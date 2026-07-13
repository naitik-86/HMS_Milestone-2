
import { useState } from "react";
import { showToast } from "../../../../../shared/components/toast";

import { createClinic } from "../../../api/clinicApi";
import { Upload, Card, Select, Grid, Full, Input } from "../../../components"
import { useNavigate } from "react-router-dom";

import { State, City } from "country-state-city";
/* ---------------- MAIN FORM ---------------- */

const DEFAULT_MAP_CENTER = {
    lat: 20.5937,
    lng: 78.9629,
};

const MAP_ZOOM = 12;
const TILE_SIZE = 256;

const lonToTileX = (lon, zoom) =>
    ((lon + 180) / 360) * Math.pow(2, zoom);

const latToTileY = (lat, zoom) => {
    const rad = (lat * Math.PI) / 180;
    return (
        (1 -
            Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) /
        2
    ) * Math.pow(2, zoom);
};

const tileXToLon = (x, zoom) =>
    (x / Math.pow(2, zoom)) * 360 - 180;

const tileYToLat = (y, zoom) => {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

const getDisplayAddress = (address = {}) =>
    [
        address.house_number,
        address.road,
        address.neighbourhood,
        address.suburb,
        address.village,
        address.town,
    ]
        .filter(Boolean)
        .join(", ");

const getCityName = (address = {}) =>
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    "";

export default function ClinicForm({
    activeTab,
    form,
    setForm,
    handleChange,
    canSave,
    validateTab,
    setActiveTab,
    tabs,
    onClose
}) {

    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const states = State.getStatesOfCountry("IN");

const cities = form.state
  ? City.getCitiesOfState(
      "IN",
      states.find((s) => s.name === form.state)?.isoCode
    )
  : [];
const cityOptions = form.city && !cities.some((city) => city.name === form.city)
    ? [form.city, ...cities.map((city) => city.name)]
    : cities.map((city) => city.name);

const stateOptions = form.state && !states.some((state) => state.name === form.state)
    ? [form.state, ...states.map((state) => state.name)]
    : states.map((state) => state.name);

const handleMapLocationSelect = (location) => {
    setForm((prev) => ({
        ...prev,
        address1: location.address1 || prev.address1,
        address2: location.address2 || prev.address2,
        city: location.city || prev.city,
        district: location.district || location.city || prev.district,
        state: location.state || prev.state,
        pincode: location.pincode || prev.pincode,
        latitude: location.latitude,
        longitude: location.longitude,
        serviceArea: location.city || prev.serviceArea,
    }));
};
const validatePincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
        const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
        );

        const data = await response.json();

        if (
            !data ||
            data[0].Status !== "Success" ||
            !data[0].PostOffice
        ) {
            showToast({
                type: "error",
                title: "Invalid PIN Code",
                description: "PIN Code not found.",
            });

            setForm((prev) => ({
                ...prev,
                pincode: "",
            }));

            return;
        }

        const office = data[0].PostOffice[0];

        const stateMatched =
            office.State.trim().toLowerCase() ===
            form.state.trim().toLowerCase();

        const cityMatched =
            office.District.trim().toLowerCase() ===
                form.city.trim().toLowerCase() ||
            office.Block?.trim().toLowerCase() ===
                form.city.trim().toLowerCase();

        if (!stateMatched || !cityMatched) {
            showToast({
                type: "error",
                title: "Location Mismatch",
                description:
                    "Selected State / City doesn't match this PIN Code.",
            });

            setForm((prev) => ({
                ...prev,
                pincode: "",
            }));

            return;
        }

        showToast({
            type: "success",
            title: "Verified",
            description: "PIN Code verified successfully.",
        });
    } catch (err) {
        console.error(err);

        showToast({
            type: "error",
            title: "Network Error",
            description: "Unable to verify PIN Code.",
        });
    }
};
   const handleFileUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Logo & Profile images allowed
    if (field === "logo" || field === "profile") {
        const allowedImages = [
            "image/png",
            "image/jpeg",
            "image/jpg",
        ];

        if (!allowedImages.includes(file.type)) {
            showToast({
                type: "error",
                title: "Invalid File",
                description: "Only JPG, JPEG or PNG images are allowed.",
            });

            e.target.value = "";
            return;
        }
    } else {
        // All other uploads → PDF only
        if (file.type !== "application/pdf") {
            showToast({
                type: "error",
                title: "Invalid File",
                description: "Only PDF files are allowed.",
            });

            e.target.value = "";
            return;
        }
    }

    setForm((prev) => ({
        ...prev,
        [field]: file,
    }));
};


    const handleNext = () => {
        if (!validateTab()) {
            showToast({
                type: "error",
                title: "Validation Error",
                description: "Please fill all required fields.",
            });

            return;
        }

        const currentIndex = tabs.findIndex(
            ([key]) => key === activeTab
        );

        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1][0]);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("FORM SUBMITTED");
        console.log("SUBMIT FIRED", activeTab);

        try {

            const data = await createClinic(form);

            showToast({
                type: "success",
                title: "Clinic Created",
                description: data.message,
            });

            console.log(data);
            onClose();
            navigate("/superadmin/clinics");

        } catch (error) {
            showToast({
                type: "error",
                title: "Error",
                description:
                    error.response?.data?.message || "Something went wrong",
            });
        }
    };



    return (
        <form >
            <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-full">
                <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">

                    {/* 1 IDENTITY */}
                    {activeTab === "identity" && (
                        <Card title="Clinic Identity">
                            <Grid>

                                <Input
                                    name="clinicName"
                                    requiredField={true}
                                    label="Clinic Name"
                                    value={form.clinicName}
                                    onChange={handleChange}
                                />

                                <Select
                                    requiredField={true}
                                    name="facilityType"
                                    label="Type of Facility"
                                    value={form.facilityType}
                                    options={[
                                        "Govt Vet Hospital",
                                        "Private Clinic",
                                        "NGO",
                                        "Mobile Vet",
                                        "Solo Practitioner"
                                    ]}
                                    onChange={handleChange}
                                />

                                <Input requiredField={false} name="year" label="Year of Establishment" value={form.year} onChange={handleChange} />
                                <Input requiredField={true} name="email" label="Official Email" value={form.email} onChange={handleChange} />
                                <Input requiredField={true} name="phone" label="Primary Contact" value={form.phone} onChange={handleChange} />
                                <Input name="altPhone" label="Alternate Contact" value={form.altPhone} onChange={handleChange} />
                                <Input name="website" label="Website URL" value={form.website} onChange={handleChange} />

                                <Upload
                                    requiredField={true}
                                    label="Clinic Logo"
                                    value={form.logo}
                                    onChange={handleFileUpload("logo")}
                                    onRemove={() => setForm((p) => ({ ...p, logo: null }))}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* 2 ADDRESS */}
                    {activeTab === "address" && (
                        <Card title="Address & Location">
                            <Grid>
                                <Full>
                                    <ClinicLocationMap
                                        latitude={form.latitude}
                                        longitude={form.longitude}
                                        onSelect={handleMapLocationSelect}
                                    />
                                </Full>

                                <Input requiredField={true} name="address1" label="Address Line 1" value={form.address1} onChange={handleChange} />
                                <Input name="address2" label="Address Line 2" value={form.address2} onChange={handleChange} />
                               
  
                                <Select
                                    requiredField
                                    name="state"
                                    label="State"
                                    value={form.state}
                                    options={stateOptions}
                                    onChange={handleChange}
                                />
                                    <Select
                                requiredField
                                name="city"
                                label="City"
                                value={form.city}
                                options={cityOptions}
                                onChange={handleChange}
                            />
                               <Input requiredField name="district" label="District" value={form.district} onChange={handleChange} />
                               <Input
                                    requiredField
                                    name="pincode"
                                    label="PIN Code"
                                    value={form.pincode}
                                    maxLength={6}
                                    onChange={(e) => {
                                        handleChange(e);

                                        if (e.target.value.length === 6) {
                                            validatePincode(e.target.value);
                                        }
                                    }}
                                />

                                <Full>
                                    <Input requiredField={true} name="serviceArea" label="Service Areas / Zones" value={form.serviceArea} onChange={handleChange} />
                                </Full>

                                <Input name="latitude" label="Latitude" value={form.latitude} onChange={handleChange} readOnly />
                                <Input name="longitude" label="Longitude" value={form.longitude} onChange={handleChange} readOnly />

                            </Grid>
                        </Card>
                    )}

                    {/* 3 LICENSES */}
                    {activeTab === "licenses" && (
                        <Card title="Registrations & Licenses">
                            <Grid>

                                <Input requiredField={true} name="vetReg" label="Registration Number" value={form.vetReg} onChange={handleChange} />

                                <Select
                                    requiredField={true}
                                    name="stateCouncil"
                                    label="State Vet Council"
                                    value={form.stateCouncil}
                                    options={states.map((state) => state.name)}
                                    onChange={handleChange}
                                />

                                <Input requiredField={false} type="date" name="expiry" label="Expiry Date" value={form.expiry} onChange={handleChange} />
                                <Input requiredField={true} name="tradeLicense" label="Trade License No." value={form.tradeLicense} onChange={handleChange} />
                                <Input requiredField={true} name="drugLicense" label="Drug License No." value={form.drugLicense} onChange={handleChange} />
<div className="col-span-full">
    <p className="text-sm text-orange-600 font-medium">
        Upload any ONE of the following documents (PDF only).
    </p>
</div>
                                <Upload
                                    requiredField={true}
                                    label="Registration Certificate"
                                    value={form.vetCert}
                                    onChange={handleFileUpload("vetCert")}
                                    onRemove={() => setForm((p) => ({ ...p, vetCert: null }))}
                                />

                                <Upload
                                    requiredField={true}
                                    label="Trade License Doc"
                                    value={form.tradeDoc}
                                    onChange={handleFileUpload("tradeDoc")}
                                    onRemove={() => setForm((p) => ({ ...p, tradeDoc: null }))}
                                />

                                <Upload
                                    requiredField={true}
                                    label="Drug License Doc"
                                    value={form.drugDoc}
                                    onChange={handleFileUpload("drugDoc")}
                                    onRemove={() => setForm((p) => ({ ...p, drugDoc: null }))}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* 4 TAX */}
                    {activeTab === "tax" && (
                        <Card title="Tax & Banking">
                            <Grid>

                                <Input requiredField={true} name="gst" label="GST Number" value={form.gst} onChange={handleChange} />
                                <Input requiredField={true} name="pan" label="PAN Number" value={form.pan} onChange={handleChange} />
                                <Input requiredField={true} name="bankName" label="Bank Name" value={form.bankName} onChange={handleChange} />
                                <Input requiredField={true} name="accountNumber" label="Account Number" value={form.accountNumber} onChange={handleChange} />
                                <Input requiredField={true} name="ifsc" label="IFSC Code" value={form.ifsc} onChange={handleChange} />

                                <Upload
                                    requiredField={true}
                                    label="Cancelled Cheque"
                                    value={form.cheque}
                                    onChange={handleFileUpload("cheque")}
                                    onRemove={() => setForm((p) => ({ ...p, cheque: null }))}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* 5 ADMIN */}
                    {activeTab === "admin" && (
                        <Card title="Admin Info">
                            <Grid>

                                <Input requiredField={true} name="adminName" label="Full Name" value={form.adminName} onChange={handleChange} />
                                <Input requiredField={true} name="designation" label="Designation" value={form.designation} onChange={handleChange} />
                                <Input requiredField={true} name="adminPhone" label="Mobile" value={form.adminPhone} onChange={handleChange} />
                                <Input requiredField={true} name="adminEmail" label="Email" value={form.adminEmail} onChange={handleChange} />

                                <Select
                                    name="govtIdType"
                                    label="Govt ID"
                                    value={form.govtIdType}
                                    options={["Aadhar", "PAN", "Passport"]}
                                    onChange={handleChange}
                                />

                                <Input requiredField={true} name="govtIdNumber" label="ID Number" value={form.govtIdNumber} onChange={handleChange} />

                                <Upload
                                    requiredField={true}
                                    label="ID Document"
                                    value={form.idDoc}
                                    onChange={handleFileUpload("idDoc")}
                                    onRemove={() => setForm((p) => ({ ...p, idDoc: null }))}
                                />

                                <Upload
                                    requiredField={true}
                                    label="Profile Photo"
                                    value={form.profile}
                                    onChange={handleFileUpload("profile")}
                                    onRemove={() => setForm((p) => ({ ...p, profile: null }))}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* PLAN */}
                    {activeTab === "plan" && (
                        <Card title="Plan & Features">
                            <Grid>

                                <Select
                                    requiredField={true}
                                    name="plan"
                                    label="Subscription Plan"
                                    value={form.plan}
                                    options={["Basic", "Standard", "Professional", "Enterprise", "Custom"]}
                                    onChange={handleChange}
                                />

                                <Select
                                    requiredField
                                    name="billing"
                                    label="Billing Cycle"
                                    value={form.billing}
                                    options={[
                                        "Monthly",
                                        "Quarterly",
                                        "Annual",
                                    ]}
                                    onChange={handleChange}
                                />

                                <Input
                                    requiredField
                                    type="date"
                                    name="startDate"
                                    label="Plan Start Date"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />

                                <Input
                                    requiredField
                                    type="date"
                                    name="endDate"
                                    label="Plan End / Renewal Date"
                                    value={form.endDate}
                                    disabled
                                />
                                <Input requiredField={false} type="number" name="trialDays" label="Trial Period (Days)" value={form.trialDays} onChange={handleChange} />

                                <Input requiredField={false} name="discountCode" label="Discount / Promo Code" value={form.discountCode} onChange={handleChange} />

                            </Grid>

                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full mt-4 p-3 border rounded-xl resize-none text-sm md:text-base"
                                placeholder="Enter notes..."
                            />

                            {/* MODULES (UNCHANGED UI) */}
                            {form.plan === "Custom" && (
                                <div className="mt-6 bg-slate-50 p-6 rounded-2xl border">

                                    <h3 className="text-sm font-semibold text-slate-600 mb-4">
                                        FEATURE LIMITS PER PLAN
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <Input
                                            requiredField
                                            name="maxStaff"
                                            label="Max Staff Accounts"
                                            value={form.maxStaff}
                                            onChange={handleChange}
                                        />

                                        <Input
                                            requiredField
                                            name="maxDoctors"
                                            label="Max Doctors"
                                            value={form.maxDoctors}
                                            onChange={handleChange}
                                        />

                                        <Input
                                            requiredField
                                            name="maxPets"
                                            label="Max Pet Records / Unlimited"
                                            value={form.maxPets}
                                            onChange={handleChange}
                                        />

                                        <Input
                                            requiredField
                                            name="storageLimit"
                                            label="Storage Limit (GB)"
                                            value={form.storageLimit}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <h3 className="text-sm font-semibold text-slate-600 mb-4">
                                        MODULE ACCESS
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {[
                                            ["labModule", "Lab Module"],
                                            ["groomingModule", "Grooming Module"],
                                            ["kennelModule", "Kennel Module"],
                                            ["pharmacyModule", "Online Pharmacy"],
                                            ["apiAccess", "API Access"],
                                            ["whiteLabel", "White Label / Custom Branding"],
                                        ].map(([key, label]) => (
                                            <label
                                                key={key}
                                                className="flex items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border"
                                            >
                                                <span>{label}</span>

                                                <input
                                                    type="checkbox"
                                                    name={key}
                                                    checked={form[key]}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                        ))}

                                    </div>

                                </div>
                            )}
                        </Card>
                    )}

                    {/* SAVE */}
                    <div className="flex justify-end">
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row justify-end gap-3">

                            {activeTab !== "plan" ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                   className="
w-full sm:w-auto
bg-orange-500
hover:bg-orange-600
text-white
px-6
py-3
rounded-xl
font-medium
transition-all
"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                className="
w-full sm:w-auto
bg-orange-500
hover:bg-orange-600
text-white
px-6
py-3
rounded-xl
font-medium
transition-all
"
                                >
                                    Save Clinic
                                </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
}

function ClinicLocationMap({ latitude, longitude, onSelect }) {
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState("");

    const center = {
        lat: Number(latitude) || DEFAULT_MAP_CENTER.lat,
        lng: Number(longitude) || DEFAULT_MAP_CENTER.lng,
    };

    const centerTileX = lonToTileX(center.lng, MAP_ZOOM);
    const centerTileY = latToTileY(center.lat, MAP_ZOOM);
    const baseTileX = Math.floor(centerTileX);
    const baseTileY = Math.floor(centerTileY);
    const offsetX = (centerTileX - baseTileX) * TILE_SIZE;
    const offsetY = (centerTileY - baseTileY) * TILE_SIZE;

    const tiles = [];
    for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
            tiles.push({
                key: `${x}-${y}`,
                x: baseTileX + x,
                y: baseTileY + y,
                left: x * TILE_SIZE - offsetX,
                top: y * TILE_SIZE - offsetY,
            });
        }
    }

    const reverseGeocode = async (lat, lng, errorMessage) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            const address = data.address || {};

            onSelect({
                address1: getDisplayAddress(address) || data.display_name || "",
                address2: address.suburb || address.neighbourhood || "",
                city: getCityName(address),
                district: address.state_district || address.county || getCityName(address),
                state: address.state || "",
                pincode: address.postcode || "",
                latitude: Number(lat).toFixed(6),
                longitude: Number(lng).toFixed(6),
            });
        } catch (err) {
            console.error(err);
            setMapError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = async (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pixelX = e.clientX - rect.left - rect.width / 2;
        const pixelY = e.clientY - rect.top - rect.height / 2;
        const clickedTileX = centerTileX + pixelX / TILE_SIZE;
        const clickedTileY = centerTileY + pixelY / TILE_SIZE;
        const lng = tileXToLon(clickedTileX, MAP_ZOOM);
        const lat = tileYToLat(clickedTileY, MAP_ZOOM);

        setLoading(true);
        setMapError("");
        reverseGeocode(lat, lng, "Unable to fetch address for this location.");
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMapError("Current location is not supported in this browser.");
            return;
        }

        setLoading(true);
        setMapError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                reverseGeocode(lat, lng, "Unable to fetch address for current location.");
            },
            () => {
                setLoading(false);
                setMapError("Unable to access current location.");
            }
        );
    };

    return (
        <div className="rounded-2xl border bg-white overflow-hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                        Select Clinic Location
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Click the map to auto-fill address, city and PIN code.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Use Current Location
                </button>
            </div>

            <button
                type="button"
                onClick={handleMapClick}
                className="relative block w-full h-72 overflow-hidden bg-slate-100 cursor-crosshair"
                aria-label="Select clinic location on map"
            >
                {tiles.map((tile) => (
                    <img
                        key={tile.key}
                        src={`https://tile.openstreetmap.org/${MAP_ZOOM}/${tile.x}/${tile.y}.png`}
                        alt=""
                        className="absolute max-w-none"
                        style={{
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            left: `calc(50% + ${tile.left}px)`,
                            top: `calc(50% + ${tile.top}px)`,
                        }}
                        draggable="false"
                    />
                ))}

                <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-full rounded-full bg-orange-500 shadow-lg ring-4 ring-white" />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

                {loading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-slate-700">
                        Fetching address...
                    </span>
                )}
            </button>

            <div className="px-4 py-3 text-xs text-slate-500">
                Selected: {latitude && longitude ? `${latitude}, ${longitude}` : "No location selected"}
                {mapError && <span className="ml-2 text-red-600">{mapError}</span>}
            </div>
        </div>
    );
}
