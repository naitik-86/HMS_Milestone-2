// Thin wrapper around the Google Maps JavaScript SDK: lazy-loads the script
// once (subsequent calls reuse the same in-flight/resolved promise) and
// exposes small geocode/reverse-geocode helpers that return plain objects
// shaped for our address form fields, so callers never touch the Google SDK
// types directly.

let loadPromise = null;

export const loadGoogleMaps = () => {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Google Maps requires a browser environment."));
    }

    if (window.google?.maps) {
        return Promise.resolve(window.google.maps);
    }

    if (loadPromise) return loadPromise;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return Promise.reject(new Error("Google Maps API key is not configured."));
    }

    loadPromise = new Promise((resolve, reject) => {
        const callbackName = "__hmsGoogleMapsReady";

        window[callbackName] = () => {
            delete window[callbackName];
            resolve(window.google.maps);
        };

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            loadPromise = null;
            delete window[callbackName];
            reject(new Error("Failed to load Google Maps script."));
        };

        document.head.appendChild(script);
    });

    return loadPromise;
};

// Google's address_components is a flat array of {long_name, short_name,
// types[]} entries - this pulls out the pieces our address form needs and
// shapes them the same way the previous Nominatim-based implementation did,
// so callers (ClinicForm's handleMapLocationSelect) don't need to change.
const getComponent = (components, type) =>
    components.find((component) => component.types.includes(type))?.long_name || "";

const parseAddressComponents = (components = []) => {
    const streetNumber = getComponent(components, "street_number");
    const route = getComponent(components, "route");
    const sublocality =
        getComponent(components, "sublocality_level_1") ||
        getComponent(components, "sublocality") ||
        getComponent(components, "neighborhood");
    const locality =
        getComponent(components, "locality") ||
        getComponent(components, "administrative_area_level_3") ||
        getComponent(components, "postal_town");
    const district = getComponent(components, "administrative_area_level_2") || locality;
    const state = getComponent(components, "administrative_area_level_1");
    const pincode = getComponent(components, "postal_code");
    const streetLine = [streetNumber, route].filter(Boolean).join(" ");

    return {
        address1: streetLine || sublocality || locality,
        address2: sublocality && sublocality !== locality ? sublocality : "",
        city: locality,
        district,
        state,
        pincode,
    };
};

export const reverseGeocodeLatLng = async (lat, lng) => {
    const maps = await loadGoogleMaps();
    const geocoder = new maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode(
            { location: { lat: Number(lat), lng: Number(lng) } },
            (results, status) => {
                if (status === "OK" && results?.[0]) {
                    resolve({
                        ...parseAddressComponents(results[0].address_components),
                        formattedAddress: results[0].formatted_address,
                    });
                } else {
                    reject(new Error(`Reverse geocode failed: ${status}`));
                }
            }
        );
    });
};

export const geocodeAddress = async (query) => {
    const maps = await loadGoogleMaps();
    const geocoder = new maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: query, region: "in" }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                    ...parseAddressComponents(results[0].address_components),
                });
            } else {
                reject(new Error(`Geocode failed: ${status}`));
            }
        });
    });
};
