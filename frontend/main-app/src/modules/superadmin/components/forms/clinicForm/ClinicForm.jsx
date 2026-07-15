import { useEffect, useMemo, useState } from "react";
import { showToast } from "../../../../../shared/components/toast";
import {
    ClipboardDocumentListIcon,
    BeakerIcon,
    BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import { createClinic } from "../../../api/clinicApi";
import { getPlans } from "../../../api/planApi";
import { Upload, Card, Select, Grid, Full, Input } from "../../../components";
import { useNavigate } from "react-router-dom";

/* ---------------- MAIN FORM ---------------- */

const DEFAULT_MAP_CENTER = {
    lat: 20.5937,
    lng: 78.9629,
};

const DEFAULT_MAP_ZOOM = 12;
const TILE_SIZE = 256;
const BILLING_MONTHS = {
    Monthly: 1,
    Quarterly: 3,
    Annual: 12,
};

const getDateValue = (date) => date.toISOString().slice(0, 10);

const getTomorrowDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return getDateValue(date);
};

const getPlanEndDate = (startDate, billingCycle) => {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) return "";

    date.setMonth(date.getMonth() + (BILLING_MONTHS[billingCycle] || 1));
    return getDateValue(date);
};

const getNonNegativeNumber = (value) => {
    const number = Number(value || 0);
    return Number.isFinite(number) ? Math.max(number, 0) : 0;
};

const getTrialLimit = (planRecords) =>
    planRecords.reduce(
        (max, plan) => Math.max(max, getNonNegativeNumber(plan.trialPeriodDays)),
        0
    );

const clampTrialDays = (value, max) =>
    Math.min(getNonNegativeNumber(value), getNonNegativeNumber(max));

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
    validateTab,
    setActiveTab,
    tabs,
    onClose
}) {

    const [mapLocating, setMapLocating] = useState(false);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [plansError, setPlansError] = useState("");
    const navigate = useNavigate();
    // const stateOptions = INDIAN_STATE_OPTIONS;

    const states = State.getStatesOfCountry("IN");
    const idType = form.govtIdType || "Aadhar";

    const idNumberLabel =
        idType === "PAN"
            ? "PAN Number"
            : idType === "Passport"
                ? "Passport Number"
                : "Aadhar Number";

    const idDocumentLabel =
        idType === "PAN"
            ? "Upload PAN Card"
            : idType === "Passport"
                ? "Upload Passport"
                : "Upload Aadhar Card";
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

    useEffect(() => {
        if (activeTab !== "plan" || plans.length) return;

        let active = true;

        const loadPlans = async () => {
            setPlansLoading(true);
            setPlansError("");

            try {
                const res = await getPlans();
                const planList = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                        ? res
                        : [];

                if (active) {
                    setPlans(planList);
                }
            } catch (err) {
                console.error(err);

                if (active) {
                    const message = err.response?.status === 401
                        ? "Please login again as Super Admin to load subscription plans."
                        : err.response?.data?.message || "Unable to load subscription plans.";

                    setPlansError(message);
                    showToast({
                        type: "error",
                        title: "Plans Unavailable",
                        description: message,
                    });
                }
            } finally {
                if (active) {
                    setPlansLoading(false);
                }
            }
        };

        loadPlans();

        return () => {
            active = false;
        };
    }, [activeTab, plans.length]);

    const activePlans = useMemo(
        () => plans.filter((plan) => !plan.status || plan.status === "Active"),
        [plans]
    );

    const planOptions = useMemo(
        () => [...new Set(activePlans.map((plan) => plan.subscriptionPlan).filter(Boolean))],
        [activePlans]
    );

    const billingOptions = useMemo(
        () => [
            ...new Set(
                activePlans
                    .filter((plan) => plan.subscriptionPlan === form.plan)
                    .map((plan) => plan.billingCycle)
                    .filter(Boolean)
            ),
        ],
        [activePlans, form.plan]
    );

    const selectedPlanRecords = useMemo(
        () => activePlans.filter((plan) => plan.subscriptionPlan === form.plan),
        [activePlans, form.plan]
    );

    const maxTrialDays = useMemo(
        () => getTrialLimit(selectedPlanRecords),
        [selectedPlanRecords]
    );

    useEffect(() => {
        if (!planOptions.length) return;

        setForm((prev) => {
            const nextPlan = planOptions.includes(prev.plan) ? prev.plan : planOptions[0];
            const nextBillingOptions = [
                ...new Set(
                    activePlans
                        .filter((plan) => plan.subscriptionPlan === nextPlan)
                        .map((plan) => plan.billingCycle)
                        .filter(Boolean)
                ),
            ];
            const nextBilling = nextBillingOptions.includes(prev.billing)
                ? prev.billing
                : nextBillingOptions[0] || "";
            const nextPlanRecords = activePlans
                .filter((plan) => plan.subscriptionPlan === nextPlan);
            const nextTrialDays = clampTrialDays(prev.trialDays, getTrialLimit(nextPlanRecords));
            const nextEndDate = prev.startDate && nextBilling
                ? getPlanEndDate(prev.startDate, nextBilling)
                : "";

            if (
                prev.plan === nextPlan &&
                prev.billing === nextBilling &&
                Number(prev.trialDays || 0) === nextTrialDays &&
                prev.endDate === nextEndDate
            ) {
                return prev;
            }

            return {
                ...prev,
                plan: nextPlan,
                billing: nextBilling,
                trialDays: nextTrialDays,
                endDate: nextEndDate,
            };
        });
    }, [activePlans, planOptions, setForm]);

    const updateMapCoordinates = (latitude, longitude) => {
        setForm((prev) => ({
            ...prev,
            latitude: Number(latitude).toFixed(6),
            longitude: Number(longitude).toFixed(6),
        }));
    };

    const applyKnownLocationCoordinates = (locationForm = form) => {
        const selectedState = states.find(
            (state) => state.name === locationForm.state
        );

        if (!selectedState) return false;

        if (locationForm.city) {
            const selectedCity = City.getCitiesOfState("IN", selectedState.isoCode).find(
                (city) => city.name.toLowerCase() === locationForm.city.toLowerCase()
            );

            if (selectedCity?.latitude && selectedCity?.longitude) {
                updateMapCoordinates(selectedCity.latitude, selectedCity.longitude);
                return true;
            }
        }

        if (selectedState.latitude && selectedState.longitude) {
            updateMapCoordinates(selectedState.latitude, selectedState.longitude);
            return true;
        }

        return false;
    };

    const geocodeManualLocation = async (locationForm = form, signal) => {
        const addressParts = [
            locationForm.address1,
            locationForm.address2,
            locationForm.city,
            locationForm.district,
            locationForm.state,
            locationForm.pincode,
            "India",
        ].filter(Boolean);

        const hasLocationInput =
            locationForm.state ||
            locationForm.city ||
            locationForm.address1 ||
            /^\d{6}$/.test(String(locationForm.pincode || ""));

        if (!hasLocationInput) return false;

        const hasDetailedInput =
            locationForm.address1 ||
            locationForm.address2 ||
            /^\d{6}$/.test(String(locationForm.pincode || ""));

        if (!hasDetailedInput && applyKnownLocationCoordinates(locationForm)) {
            return true;
        }

        setMapLocating(true);
        const locatingTimeout = setTimeout(() => {
            setMapLocating(false);
        }, 5000);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(addressParts.join(", "))}`,
                {
                    signal,
                    headers: {
                        "Accept-Language": "en",
                    },
                }
            );

            const data = await response.json();
            const location = data?.[0];

            if (!location?.lat || !location?.lon) return false;

            updateMapCoordinates(location.lat, location.lon);

            return true;
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }

            return false;
        } finally {
            clearTimeout(locatingTimeout);

            if (!signal?.aborted) {
                setMapLocating(false);
            }
        }
    };

    useEffect(() => {
        if (activeTab !== "address") return;

        const controller = new AbortController();
        const timer = setTimeout(() => {
            geocodeManualLocation(form, controller.signal);
        }, 600);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [
        activeTab,
        form.address1,
        form.address2,
        form.city,
        form.district,
        form.state,
        form.pincode,
        setForm,
    ]);

    const handleAddressChange = (e) => {
        handleChange(e);
    };

    const handleAddressSelectChange = (e) => {
        const { name, value } = e.target;
        const nextForm = {
            ...form,
            [name]: value,
            ...(name === "state" ? { city: "" } : {}),
        };

        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "state" ? { city: "" } : {}),
        }));

        if (!applyKnownLocationCoordinates(nextForm)) {
            geocodeManualLocation(nextForm);
        }
    };

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
            serviceAreas: prev.serviceAreas?.length
                ? [...prev.serviceAreas]
                : [location.city || ""],
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
    }; const addServiceArea = () => {
        setForm((prev) => ({
            ...prev,
            serviceAreas: [...(prev.serviceAreas || []), ""],
        }));
    };

    const updateServiceArea = (index, value) => {
        const updated = [...(form.serviceAreas || [])];
        updated[index] = value;

        setForm((prev) => ({
            ...prev,
            serviceAreas: updated,
        }));
    };

    const removeServiceArea = (index) => {
        const updated = [...form.serviceAreas];
        updated.splice(index, 1);

        setForm((prev) => ({
            ...prev,
            serviceAreas: updated,
        }));
    };
    const handleFileUpload = (field) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (field === "logo") {
            const allowedLogoFiles = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "application/pdf",
            ];

            if (!allowedLogoFiles.includes(file.type)) {
                showToast({
                    type: "error",
                    title: "Invalid File",
                    description: "Only JPG, JPEG, PNG or PDF files are allowed.",
                });

                e.target.value = "";
                return;
            }
        } else if (["profile", "cheque", "idDoc"].includes(field)) {
            const allowedImageOrPdfFiles = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "application/pdf",
            ];

            if (!allowedImageOrPdfFiles.includes(file.type)) {
                showToast({
                    type: "error",
                    title: "Invalid File",
                    description: "Only JPG, JPEG, PNG or PDF files are allowed.",
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

    const getPhoneDigits = (value) => String(value || "").replace(/\D/g, "");

    const isValidMobileNumber = (value) => /^[6-9]\d{9}$/.test(getPhoneDigits(value));

    const isValidEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());

    const isValidPan = (value) =>
        /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(value || "").trim().toUpperCase());

    const isValidGst = (value) =>
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
            String(value || "").trim().toUpperCase()
        );

    const isValidIfsc = (value) =>
        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(value || "").trim().toUpperCase());

    const isValidAccountNumber = (value) =>
        /^\d{9,18}$/.test(String(value || "").trim());

    const isAlphabeticText = (value) =>
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(String(value || "").trim());

    const isValidWebsiteUrl = (value) => {
        const website = String(value || "").trim();

        if (!website) return true;
        if (/\s/.test(website)) return false;

        try {
            const url = new URL(
                /^https?:\/\//i.test(website) ? website : `https://${website}`
            );

            return (
                ["http:", "https:"].includes(url.protocol) &&
                url.hostname.includes(".") &&
                !/^\d+$/.test(url.hostname.replace(/\./g, ""))
            );
        } catch {
            return false;
        }
    };

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        const digitsOnly = getPhoneDigits(value).slice(0, 10);

        handleChange({
            target: {
                name,
                value: digitsOnly,
                type: "text",
            },
        });
    };

    const handleDigitsChange = (maxLength) => (e) => {
        const { name, value } = e.target;
        const digitsOnly = getPhoneDigits(value).slice(0, maxLength);

        handleChange({
            target: {
                name,
                value: digitsOnly,
                type: "text",
            },
        });
    };

    const handleUppercaseChange = (maxLength) => (e) => {
        const { name, value } = e.target;

        handleChange({
            target: {
                name,
                value: value.toUpperCase().slice(0, maxLength),
                type: "text",
            },
        });
    };

    const handleAlphaSpaceChange = (e) => {
        const { value } = e.target;

        if (/^[A-Za-z\s]*$/.test(value)) {
            handleChange(e);
        }
    };

    const handlePlanChange = (e) => {
        const plan = e.target.value;
        const nextBillingOptions = [
            ...new Set(
                activePlans
                    .filter((item) => item.subscriptionPlan === plan)
                    .map((item) => item.billingCycle)
                    .filter(Boolean)
            ),
        ];
        const billing = nextBillingOptions[0] || "";
        const trialMax = getTrialLimit(
            activePlans.filter((item) => item.subscriptionPlan === plan)
        );

        setForm((prev) => ({
            ...prev,
            plan,
            billing,
            trialDays: clampTrialDays(prev.trialDays, trialMax),
            endDate: prev.startDate && billing ? getPlanEndDate(prev.startDate, billing) : "",
        }));
    };

    const handleBillingChange = (e) => {
        const billing = e.target.value;

        setForm((prev) => ({
            ...prev,
            billing,
            endDate: prev.startDate && billing ? getPlanEndDate(prev.startDate, billing) : "",
        }));
    };

    const handleStartDateChange = (e) => {
        const startDate = e.target.value;

        setForm((prev) => ({
            ...prev,
            startDate,
            endDate: startDate && prev.billing ? getPlanEndDate(startDate, prev.billing) : "",
        }));
    };

    const handleTrialDaysChange = (e) => {
        const trialDays = clampTrialDays(e.target.value, maxTrialDays);

        setForm((prev) => ({
            ...prev,
            trialDays,
        }));
    };

    const handlePincodeChange = (e) => {
        const pincode = getPhoneDigits(e.target.value).slice(0, 6);

        handleChange({
            target: {
                name: "pincode",
                value: pincode,
                type: "text",
            },
        });

        if (pincode.length === 6) {
            geocodeManualLocation({
                ...form,
                pincode,
            });
            validatePincode(pincode);
        }
    };

    const validateIdentityFields = () => {
        const yearValue = String(form.year || "").trim();
        const currentYear = new Date().getFullYear();
        const earliestFoundingYear = 1800;

        if (yearValue) {
            if (!/^\d{4}$/.test(yearValue)) {
                showToast({
                    type: "error",
                    title: "Invalid Year",
                    description: "Year of Establishment must be a 4-digit year.",
                });

                return false;
            }

            const year = Number(yearValue);

            if (year < earliestFoundingYear || year > currentYear) {
                showToast({
                    type: "error",
                    title: "Invalid Year",
                    description: `Year of Establishment must be between ${earliestFoundingYear} and ${currentYear}.`,
                });

                return false;
            }
        }

        const primaryContact = getPhoneDigits(form.phone);
        const alternateContact = getPhoneDigits(form.altPhone);

        if (primaryContact && !isValidMobileNumber(primaryContact)) {
            showToast({
                type: "error",
                title: "Invalid Contact",
                description: "Primary Contact must be a valid 10-digit mobile number.",
            });

            return false;
        }

        if (alternateContact && !isValidMobileNumber(alternateContact)) {
            showToast({
                type: "error",
                title: "Invalid Contact",
                description: "Alternate Contact must be a valid 10-digit mobile number.",
            });

            return false;
        }

        if (primaryContact && alternateContact && primaryContact === alternateContact) {
            showToast({
                type: "error",
                title: "Duplicate Contact",
                description: "Primary Contact and Alternate Contact cannot be the same.",
            });

            return false;
        }

        if (!isValidWebsiteUrl(form.website)) {
            showToast({
                type: "error",
                title: "Invalid Website URL",
                description: "Website URL must be a valid http/https URL or domain.",
            });

            return false;
        }

        return true;
    };

    const validateAddressFields = () => {
        const pincode = String(form.pincode || "").trim();

        if (!pincode) {
            showToast({
                type: "error",
                title: "PIN Code Required",
                description: "Please enter the clinic PIN Code before continuing.",
            });

            return false;
        }

        if (!/^\d{6}$/.test(pincode)) {
            showToast({
                type: "error",
                title: "Invalid PIN Code",
                description: "PIN Code must be exactly 6 digits.",
            });

            return false;
        }

        return true;
    };

    const validateTaxFields = () => {
        if (!isValidGst(form.gst)) {
            showToast({
                type: "error",
                title: "Invalid GST Number",
                description: "GST Number must follow the standard 15-character GST format.",
            });

            return false;
        }

        if (!isValidPan(form.pan)) {
            showToast({
                type: "error",
                title: "Invalid PAN Number",
                description: "PAN Number must follow the format AAAAA9999A.",
            });

            return false;
        }

        if (!isAlphabeticText(form.bankName)) {
            showToast({
                type: "error",
                title: "Invalid Bank Name",
                description: "Bank Name should contain only alphabetic text and spaces.",
            });

            return false;
        }

        if (!isValidAccountNumber(form.accountNumber)) {
            showToast({
                type: "error",
                title: "Invalid Account Number",
                description: "Account Number must be numeric and 9 to 18 digits long.",
            });

            return false;
        }

        if (!isValidIfsc(form.ifsc)) {
            showToast({
                type: "error",
                title: "Invalid IFSC Code",
                description: "IFSC Code must follow the format ABCD0XXXXXX.",
            });

            return false;
        }

        return true;
    };

    const validateAdminFields = () => {
        if (!isAlphabeticText(form.adminName)) {
            showToast({
                type: "error",
                title: "Invalid Full Name",
                description: "Full Name should contain only alphabetic text and spaces.",
            });

            return false;
        }

        if (!isAlphabeticText(form.designation)) {
            showToast({
                type: "error",
                title: "Invalid Designation",
                description: "Designation should contain only alphabetic text and spaces.",
            });

            return false;
        }

        if (form.adminPhone && !isValidMobileNumber(form.adminPhone)) {
            showToast({
                type: "error",
                title: "Invalid Mobile",
                description: "Admin Mobile must be a valid 10-digit mobile number.",
            });

            return false;
        }

        if (!isValidEmail(form.adminEmail)) {
            showToast({
                type: "error",
                title: "Invalid Email",
                description: "Admin Email must be a valid email address.",
            });

            return false;
        }

        if ((form.govtIdType || idType) === "PAN" && !isValidPan(form.govtIdNumber)) {
            showToast({
                type: "error",
                title: "Invalid PAN Number",
                description: "PAN Number must follow the format AAAAA9999A.",
            });

            return false;
        }

        return true;
    };

    const validatePlanFields = () => {
        if (!planOptions.length) {
            showToast({
                type: "error",
                title: "No Plans Available",
                description: "Please create an active subscription plan before assigning one.",
            });

            return false;
        }

        if (!planOptions.includes(form.plan)) {
            showToast({
                type: "error",
                title: "Invalid Plan",
                description: "Please select a configured subscription plan.",
            });

            return false;
        }

        if (!billingOptions.includes(form.billing)) {
            showToast({
                type: "error",
                title: "Invalid Billing Cycle",
                description: "Please select a billing cycle configured for this plan.",
            });

            return false;
        }

        const tomorrow = getTomorrowDate();

        if (!form.startDate || form.startDate < tomorrow) {
            showToast({
                type: "error",
                title: "Invalid Start Date",
                description: "Plan Start Date must be a future date.",
            });

            return false;
        }

        const expectedEndDate = getPlanEndDate(form.startDate, form.billing);

        if (!form.endDate || form.endDate !== expectedEndDate) {
            setForm((prev) => ({
                ...prev,
                endDate: expectedEndDate,
            }));

            showToast({
                type: "error",
                title: "Invalid Renewal Date",
                description: "Plan End / Renewal Date must be calculated from the selected billing cycle.",
            });

            return false;
        }

        const trialDays = getNonNegativeNumber(form.trialDays);

        if (trialDays < 0 || trialDays > maxTrialDays) {
            showToast({
                type: "error",
                title: "Invalid Trial Period",
                description: `Trial Period must be between 0 and ${maxTrialDays} days for this plan.`,
            });

            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (activeTab === "identity" && !validateIdentityFields()) {
            return;
        }

        if (activeTab === "address" && !validateAddressFields()) {
            return;
        }

        if (activeTab === "tax" && !validateTaxFields()) {
            return;
        }

        if (activeTab === "admin" && !validateAdminFields()) {
            return;
        }

        if (activeTab === "plan" && !validatePlanFields()) {
            return;
        }

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

    const handlePrevious = () => {
        const currentIndex = tabs.findIndex(
            ([key]) => key === activeTab
        );

        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1][0]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateIdentityFields()) {
            return;
        }

        if (!validateAddressFields()) {
            return;
        }

        if (!validateTaxFields()) {
            return;
        }

        if (!validateAdminFields()) {
            return;
        }

        if (!validatePlanFields()) {
            return;
        }

        console.log("FORM SUBMITTED");
        console.log("SUBMIT FIRED", activeTab);

        try {

            const data = await createClinic({
                ...form,
                trialDays: clampTrialDays(form.trialDays, maxTrialDays),
            });

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

                               <Input
    requiredField={false}
    name="year"
    label="Year of Establishment"
    value={form.year}
    maxLength={4}
    onChange={(e) => {
        if (/^\d*$/.test(e.target.value)) {
            handleChange(e);
        }
    }}
/>
                                <Input requiredField={true} name="email" label="Official Email" value={form.email} onChange={handleChange} />
                                <Input requiredField={true} name="phone" label="Primary Contact" value={form.phone} maxLength={10} inputMode="numeric" onChange={handlePhoneChange} />
                                <Input name="altPhone" label="Alternate Contact" value={form.altPhone} maxLength={10} inputMode="numeric" onChange={handlePhoneChange} />
                                <Input name="website" label="Website URL" value={form.website} onChange={handleChange} />

                                <Upload
                                    requiredField={true}
                                    label="Clinic Logo / PDF"
                                    value={form.logo}
                                    onChange={handleFileUpload("logo")}
                                    onRemove={() => setForm((p) => ({ ...p, logo: null }))}
                                    accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
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
                                        locating={mapLocating}
                                        onSelect={handleMapLocationSelect}
                                    />
                                </Full>

                                <Input requiredField={true} name="address1" label="Address Line 1" value={form.address1} onChange={handleAddressChange} />
                                <Input name="address2" label="Address Line 2" value={form.address2} onChange={handleAddressChange} />


                                <Select
                                    requiredField
                                    name="state"
                                    label="State"
                                    value={form.state}
                                    options={stateOptions}
                                    onChange={handleAddressSelectChange}
                                />
                                <Select
                                    requiredField
                                    name="city"
                                    label="City"
                                    value={form.city}
                                    options={cityOptions}
                                    onChange={handleAddressSelectChange}
                                />
                                <Input requiredField name="district" label="District" value={form.district} onChange={handleAddressChange} />
                                <Input
                                    requiredField
                                    name="pincode"
                                    label="PIN Code"
                                    value={form.pincode}
                                    maxLength={6}
                                    inputMode="numeric"
                                    onChange={handlePincodeChange}
                                />
                                <Full>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Service Areas / Zones
                                        </label>

                                        {(form.serviceAreas || [""]).map((area, index) => (
                                            <div key={index} className="flex items-center gap-3">

                                                <Input
                                                    label={`Service Area ${index + 1}`}
                                                    value={area}
                                                    onChange={(e) =>
                                                        updateServiceArea(index, e.target.value)
                                                    }
                                                />

                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeServiceArea(index)}
                                                        className="px-4 py-2 rounded-lg bg-red-500 text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                )}

                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addServiceArea}
                                            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                                        >
                                            + Add Service Area
                                        </button>
                                    </div>
                                </Full>

                                <Input name="latitude" label="Latitude" value={form.latitude} onChange={handleChange} readOnly />
                                <Input name="longitude" label="Longitude" value={form.longitude} onChange={handleChange} readOnly />

                            </Grid>
                        </Card>
                    )}

                    {/* 3 LICENSES */}
                    {/* ===================== REGISTRATIONS & LICENSES ===================== */}

                    {activeTab === "licenses" && (
                        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">

                            <div className="px-8 py-8">

                                {/* Header */}

                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-800">
                                        Registrations & Licenses
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Upload all mandatory registration and license documents.
                                    </p>
                                </div>

                                {/* State Council */}

                                <div className="mb-10">

                                    <Select
                                        requiredField
                                        name="stateCouncil"
                                        label="State Vet Council"
                                        value={form.stateCouncil}
                                        options={states.map((state) => state.name)}
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* ================================================= */}

                                {/* Registration */}

                                <div className="border-t border-slate-200 py-8">

                                    <div className="grid lg:grid-cols-[80px_1fr_1fr_260px] gap-8 items-center">

                                        {/* Icon */}

                                        <div className="w-16 h-16 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">

                                            <ClipboardDocumentListIcon className="w-8 h-8 text-orange-500" />

                                        </div>

                                        {/* Number */}

                                        <Input
                                            requiredField
                                            name="vetReg"
                                            label="Registration Number"
                                            value={form.vetReg}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                        {/* Upload */}

                                        <Upload
                                            requiredField
                                            label="Registration Certificate"
                                            value={form.vetCert}
                                            onChange={handleFileUpload("vetCert")}
                                            onRemove={() =>
                                                setForm((p) => ({
                                                    ...p,
                                                    vetCert: null,
                                                }))
                                            }
                                        />

                                        {/* Date */}

                                        <Input
                                            type="date"
                                            requiredField
                                            name="vetExpiry"
                                            label="Expiry Date"
                                            value={form.vetExpiry}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                    </div>

                                </div>

                                {/* ================================================= */}

                                {/* Drug */}

                                <div className="border-t border-slate-200 py-8">

                                    <div className="grid lg:grid-cols-[80px_1fr_1fr_260px] gap-8 items-center">

                                        <div className="w-16 h-16 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">

                                            <BeakerIcon className="w-8 h-8 text-orange-500" />

                                        </div>

                                        <Input
                                            requiredField
                                            name="drugLicense"
                                            label="Drug License Number"
                                            value={form.drugLicense}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                        <Upload
                                            requiredField
                                            label="Drug License Document"
                                            value={form.drugDoc}
                                            onChange={handleFileUpload("drugDoc")}
                                            onRemove={() =>
                                                setForm((p) => ({
                                                    ...p,
                                                    drugDoc: null,
                                                }))
                                            }
                                        />

                                        <Input
                                            type="date"
                                            requiredField
                                            name="drugExpiry"
                                            label="Expiry Date"
                                            value={form.drugExpiry}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                    </div>

                                </div>

                                {/* ================================================= */}

                                {/* Trade */}

                                <div className="border-t border-slate-200 py-8">

                                    <div className="grid lg:grid-cols-[80px_1fr_1fr_260px] gap-8 items-center">

                                        <div className="w-16 h-16 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">

                                            <BuildingStorefrontIcon className="w-8 h-8 text-orange-500" />

                                        </div>

                                        <Input
                                            requiredField
                                            name="tradeLicense"
                                            label="Trade License Number"
                                            value={form.tradeLicense}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                        <Upload
                                            requiredField
                                            label="Trade License Document"
                                            value={form.tradeDoc}
                                            onChange={handleFileUpload("tradeDoc")}
                                            onRemove={() =>
                                                setForm((p) => ({
                                                    ...p,
                                                    tradeDoc: null,
                                                }))
                                            }
                                        />

                                        <Input
                                            type="date"
                                            requiredField
                                            name="tradeExpiry"
                                            label="Expiry Date"
                                            value={form.tradeExpiry}
                                            onChange={handleChange}
                                            className="rounded-lg h-12"
                                        />

                                    </div>

                                </div>

                            </div>

                        </Card>
                    )}

                    {/* 4 TAX */}
                    {activeTab === "tax" && (
                        <Card title="Tax & Banking">
                            <Grid>

                                <Input requiredField={true} name="gst" label="GST Number" value={form.gst} maxLength={15} onChange={handleUppercaseChange(15)} />
                                <Input requiredField={true} name="pan" label="PAN Number" value={form.pan} maxLength={10} onChange={handleUppercaseChange(10)} />
                                <Input requiredField={true} name="bankName" label="Bank Name" value={form.bankName} onChange={handleAlphaSpaceChange} />
                                <Input requiredField={true} name="accountNumber" label="Account Number" value={form.accountNumber} maxLength={18} inputMode="numeric" onChange={handleDigitsChange(18)} />
                                <Input requiredField={true} name="ifsc" label="IFSC Code" value={form.ifsc} maxLength={11} onChange={handleUppercaseChange(11)} />

                                <Upload
                                    requiredField={true}
                                    label="Cancelled Cheque"
                                    value={form.cheque}
                                    onChange={handleFileUpload("cheque")}
                                    onRemove={() => setForm((p) => ({ ...p, cheque: null }))}
                                    accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* 5 ADMIN */}
                    {activeTab === "admin" && (
                        <Card title="Admin Info">
                            <Grid>

                                <Input requiredField={true} name="adminName" label="Full Name" value={form.adminName} onChange={handleAlphaSpaceChange} />
                                <Input requiredField={true} name="designation" label="Designation" value={form.designation} onChange={handleAlphaSpaceChange} />
                                <Input requiredField={true} name="adminPhone" label="Mobile" value={form.adminPhone} maxLength={10} inputMode="numeric" onChange={handlePhoneChange} />
                                <Input requiredField={true} name="adminEmail" label="Email" value={form.adminEmail} onChange={handleChange} />

                                <Select
                                    name="govtIdType"
                                    label="Govt ID"
                                    value={form.govtIdType}
                                    options={["Aadhar", "PAN", "Passport"]}
                                    onChange={handleChange}
                                />

                                <Input
                                    requiredField
                                    name="govtIdNumber"
                                    label={idNumberLabel}
                                    value={form.govtIdNumber}
                                    maxLength={idType === "PAN" ? 10 : undefined}
                                    onChange={idType === "PAN" ? handleUppercaseChange(10) : handleChange}
                                />

                                <Upload
                                    requiredField
                                    label={idDocumentLabel}
                                    value={form.idDoc}
                                    onChange={handleFileUpload("idDoc")}
                                    onRemove={() =>
                                        setForm((p) => ({
                                            ...p,
                                            idDoc: null,
                                        }))
                                    }
                                    accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
                                />

                                <Upload
                                    requiredField={true}
                                    label="Profile Photo / PDF"
                                    value={form.profile}
                                    onChange={handleFileUpload("profile")}
                                    onRemove={() => setForm((p) => ({ ...p, profile: null }))}
                                    accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* PLAN */}
                    {activeTab === "plan" && (
                        <Card title="Plan & Features">
                            {plansError && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {plansError}
                                </div>
                            )}

                            <Grid>

                                <Select
                                    requiredField={true}
                                    name="plan"
                                    label="Subscription Plan"
                                    value={form.plan}
                                    options={planOptions}
                                    onChange={handlePlanChange}
                                    disabled={plansLoading || !planOptions.length}
                                />

                                <Select
                                    requiredField
                                    name="billing"
                                    label="Billing Cycle"
                                    value={form.billing}
                                    options={billingOptions}
                                    onChange={handleBillingChange}
                                    disabled={!billingOptions.length}
                                />

                                <Input
                                    requiredField
                                    type="date"
                                    name="startDate"
                                    label="Plan Start Date"
                                    value={form.startDate}
                                    min={getTomorrowDate()}
                                    onChange={handleStartDateChange}
                                />

                                <Input
                                    requiredField
                                    type="date"
                                    name="endDate"
                                    label="Plan End / Renewal Date"
                                    value={form.endDate}
                                    disabled
                                />
                                <Input requiredField={false} type="number" name="trialDays" label="Trial Period (Days)" value={clampTrialDays(form.trialDays, maxTrialDays)} min={0} max={maxTrialDays} onChange={handleTrialDaysChange} />

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
   <div className="flex justify-between items-center">

    {activeTab !== "identity" ? (
        <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
        >
            ← Previous
        </button>
    ) : (
        <div />
    )}

    {activeTab !== "plan" ? (
        <button
            type="button"
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
        >
            Next →
        </button>
    ) : (
        <button
            type="button"
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
        >
            Submit
        </button>
    )}

</div>

                </div>
            </div>
        </form>
    );
}

function ClinicLocationMap({ latitude, longitude, locating = false, onSelect }) {
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState("");
    const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);
    const center = {
        lat: Number(latitude) || DEFAULT_MAP_CENTER.lat,
        lng: Number(longitude) || DEFAULT_MAP_CENTER.lng,
    };

    const centerTileX = lonToTileX(center.lng, zoom);
    const centerTileY = latToTileY(center.lat, zoom);
    const baseTileX = Math.floor(centerTileX);
    const baseTileY = Math.floor(centerTileY);
    const offsetX = (centerTileX - baseTileX) * TILE_SIZE;
    const offsetY = (centerTileY - baseTileY) * TILE_SIZE;

    const tiles = [];
    for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
            tiles.push({
                key: `${zoom}-${baseTileX + x}-${baseTileY + y}`,
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
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: {
                        "Accept-Language": "en",
                    },
                }
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
        const lng = tileXToLon(clickedTileX, zoom);
        const lat = tileYToLat(clickedTileY, zoom);

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
                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(z + 1, 19))}
                        className="h-10 w-10 rounded-lg border bg-white hover:bg-gray-100"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(z - 1, 3))}
                        className="h-10 w-10 rounded-lg border bg-white hover:bg-gray-100"
                    >
                        −
                    </button>

                </div>
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
                        src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
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

                {(loading || locating) && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-slate-700">
                        {loading ? "Fetching address..." : "Locating..."}
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
