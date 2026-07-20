import { useState } from "react";

import { showToast } from "../../../../../shared/components/toast";
import { INDIAN_STATE_OPTIONS } from "../../../../../shared/constants/indiaStates";
import Card from "../Card";
import Input from "../Input";
import Select from "../Select";
import { Grid, Full } from "../Grid";
import Upload from "../Upload";
import { createDoctor, updateDoctor } from "../../../api/doctorApi";

const DEGREE_OPTIONS = [
    "BVSc",
    "BVSc & AH",
    "MVSc",
    "PhD (Vet)",
    "BAMS",
    "Other",
];

const SPECIALIZATION_OPTIONS = [
    "Small Animal",
    "Large Animal",
    "Exotic & Wildlife",
    "Poultry",
    "Aquatic",
    "Surgery",
    "Dermatology",
    "Dentistry",
    "Oncology",
    "Cardiology",
];

const PRACTICE_TYPES = [
    "Home visits",
    "Telemedicine",
    "Mobile clinic",
    "Freelance",
    "Government",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const YEAR_REGEX = /^\d{4}$/;

const digitsOnly = (value, max = 10) =>
    String(value || "")
        .replace(/\D/g, "")
        .slice(0, max);

const uppercaseValue = (value, max = 20) =>
    String(value || "")
        .toUpperCase()
        .replace(/\s+/g, "")
        .slice(0, max);

const isFutureDate = (value) => {
    if (!value) return false;
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
};

const isPastDate = (value) => {
    if (!value) return false;
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
};

const parseDelimitedList = (value) =>
    String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const isQualificationRowFilled = (row) =>
    Boolean(row?.degree?.trim() || row?.institution?.trim() || row?.year?.trim());

const isValidGstPan = (value) => {
    const normalized = String(value || "").trim().toUpperCase();
    return PAN_REGEX.test(normalized) || GST_REGEX.test(normalized);
};

const getGovtIdRule = (type) => {
    switch (type) {
        case "PAN":
            return {
                label: "PAN Number",
                docLabel: "Upload PAN Card",
                placeholder: "Enter PAN number",
                inputMode: "text",
                maxLength: 10,
                sanitize: (value) => uppercaseValue(value, 10),
                validate: (value) => PAN_REGEX.test(String(value || "").trim().toUpperCase()),
                message: "PAN number must follow the format AAAAA9999A.",
            };
        case "Passport":
            return {
                label: "Passport Number",
                docLabel: "Upload Passport",
                placeholder: "Enter passport number",
                inputMode: "text",
                maxLength: 8,
                sanitize: (value) => uppercaseValue(value, 8),
                validate: (value) => PASSPORT_REGEX.test(String(value || "").trim().toUpperCase()),
                message: "Passport number must follow the format A9999999.",
            };
        default:
            return {
                label: "Aadhaar Number",
                docLabel: "Upload Aadhaar Card",
                placeholder: "Enter 12-digit Aadhaar number",
                inputMode: "numeric",
                maxLength: 12,
                sanitize: (value) => digitsOnly(value, 12),
                validate: (value) => AADHAAR_REGEX.test(String(value || "").trim()),
                message: "Aadhaar number must contain 12 digits.",
            };
    }
};

const getStepErrorMessage = (errors) => Object.values(errors).find(Boolean) || "";

export default function DoctorForm({
    activeTab,
    tabs,
    setActiveTab,
    form,
    setForm,
    qualifications,
    setQualifications,
    planOptions = ["Solo Basic", "Solo Pro"],
    onClose,
    onCreated,
    onSaved,
    mode = "create",
    doctorId = "",
}) {
    const stateOptions = INDIAN_STATE_OPTIONS;
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const isEditMode = mode === "edit";

    const currentStepIndex = Math.max(
        tabs.findIndex(([key]) => key === activeTab),
        0
    );
    const isLastStep = currentStepIndex >= tabs.length - 1;
    const isQualificationStep = activeTab === "qualification";
    const govtIdRule = getGovtIdRule(form.govtIdType);

    const clearErrorKeys = (...keys) => {
        const flatKeys = keys.flat().filter(Boolean);

        if (!flatKeys.length) return;

        setErrors((prev) => {
            const next = { ...prev };

            flatKeys.forEach((key) => {
                delete next[key];
            });

            return next;
        });
    };

    const setFieldValue = (name, value, extra = {}) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...extra,
            ...(name === "state" ? { city: "" } : {}),
            ...(name === "govtIdType"
                ? {
                    govtIdNumber: "",
                    govtIdDocument: null,
                }
                : {}),
        }));

        clearErrorKeys(
            name,
            ...(name === "state" ? ["city", "pincode"] : []),
            ...(name === "govtIdType" ? ["govtIdNumber", "govtIdDocument"] : [])
        );
    };

    const setQualificationValue = (index, field, value) => {
        setQualifications((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [field]: value }
                    : item
            )
        );

        clearErrorKeys(`qualification-${index}-${field}`, "qualifications");
    };

    const handleSimpleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFieldValue(name, checked);
            return;
        }

        if (name === "state") {
            setFieldValue(name, value, { city: "" });
            return;
        }

        if (name === "govtIdType") {
            setFieldValue(name, value, {
                govtIdNumber: "",
                govtIdDocument: null,
            });
            return;
        }

        setFieldValue(name, value);
    };

    const handleMobileChange = (e) => {
        setFieldValue("mobile", digitsOnly(e.target.value, 10));
    };

    const handlePincodeChange = async (e) => {
        const nextValue = digitsOnly(e.target.value, 6);
        setFieldValue("pincode", nextValue);

        if (nextValue.length === 6) {
            const validation = await validatePincode(nextValue, form.state, form.city, true);

            if (!validation.valid) {
                setErrors((prev) => ({ ...prev, pincode: validation.message }));
            }
        }
    };

    const handleGovtIdNumberChange = (e) => {
        const sanitized = govtIdRule.sanitize(e.target.value);
        setFieldValue("govtIdNumber", sanitized);
    };

    const handleExperienceChange = (e) => {
        setFieldValue("experience", digitsOnly(e.target.value, 2));
    };

    const handleConsultationFeeChange = (e) => {
        setFieldValue("consultationFee", digitsOnly(e.target.value, 6));
    };

    const handleAccountNumberChange = (e) => {
        setFieldValue("accountNumber", digitsOnly(e.target.value, 18));
    };

    const handleIfscChange = (e) => {
        setFieldValue("ifsc", uppercaseValue(e.target.value, 11));
    };

    const handleYearChange = (index) => (e) => {
        const sanitized = digitsOnly(e.target.value, 4);
        setQualificationValue(index, "year", sanitized);
    };

    const toggleArray = (field, value) => {
        const currentValues = Array.isArray(form[field]) ? form[field] : [];
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        setFieldValue(field, nextValues);
    };

    const validatePincode = async (
        pincodeValue,
        stateValue = form.state,
        cityValue = form.city,
        showFeedback = false
    ) => {
        const pincode = digitsOnly(pincodeValue, 6);

        if (!PINCODE_REGEX.test(pincode)) {
            return {
                valid: false,
                message: "PIN Code must be 6 digits.",
            };
        }

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (!data || data[0].Status !== "Success" || !data[0].PostOffice) {
                if (showFeedback) {
                    showToast({
                        type: "error",
                        title: "Invalid PIN Code",
                        description: "PIN Code not found.",
                    });
                }

                return {
                    valid: false,
                    message: "PIN Code not found.",
                };
            }

            const office = data[0].PostOffice[0];

            const stateMatched =
                office.State.trim().toLowerCase() ===
                String(stateValue || "").trim().toLowerCase();

            const cityMatched =
                office.District.trim().toLowerCase() ===
                String(cityValue || "").trim().toLowerCase() ||
                office.Block?.trim().toLowerCase() ===
                String(cityValue || "").trim().toLowerCase();

            if (!stateMatched || !cityMatched) {
                if (showFeedback) {
                    showToast({
                        type: "error",
                        title: "Location Mismatch",
                        description: "Selected State / City does not match this PIN Code.",
                    });
                }

                return {
                    valid: false,
                    message: "Selected State / City does not match this PIN Code.",
                };
            }

            if (showFeedback) {
                showToast({
                    type: "success",
                    title: "Verified",
                    description: "PIN Code verified successfully.",
                });
            }

            return { valid: true };
        } catch (error) {
            if (showFeedback) {
                showToast({
                    type: "error",
                    title: "Network Error",
                    description: "Unable to verify PIN Code.",
                });
            }

            return {
                valid: false,
                message: "Unable to verify PIN Code.",
            };
        }
    };

    const handleFileUpload = (field) => (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";

        const fileRules = {
            profilePhoto: {
                valid: isImage,
                message: "Profile photo must be an image file.",
            },
            govtIdDocument: {
                valid: isImage || isPdf,
                message: "Government ID document must be an image or PDF file.",
            },
            degreeCertificates: {
                valid: isPdf,
                message: "Degree certificates must be PDF files.",
            },
            registrationCertificate: {
                valid: isPdf,
                message: "Registration certificate must be a PDF file.",
            },
        };

        const rule = fileRules[field];

        if (rule && !rule.valid) {
            showToast({
                type: "error",
                title: "Invalid File",
                description: rule.message,
            });

            e.target.value = "";
            setFieldValue(field, null);
            return;
        }

        setFieldValue(field, file);
    };

    const validatePersonalStep = async () => {
        const nextErrors = {};

        if (!form.fullName.trim()) {
            nextErrors.fullName = "Full name is required.";
        } else if (form.fullName.trim().length < 3) {
            nextErrors.fullName = "Full name must be at least 3 characters.";
        }

        if (!form.gender) {
            nextErrors.gender = "Gender is required.";
        }

        if (!form.dob) {
            nextErrors.dob = "Date of birth is required.";
        } else if (isFutureDate(form.dob)) {
            nextErrors.dob = "Date of birth cannot be in the future.";
        }

        if (!PHONE_REGEX.test(String(form.mobile || "").trim())) {
            nextErrors.mobile = "Enter a valid 10-digit mobile number.";
        }

        if (!EMAIL_REGEX.test(String(form.email || "").trim())) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!form.profilePhoto) {
            nextErrors.profilePhoto = "Profile photo is required.";
        }

        if (!Array.isArray(form.languages) || !form.languages.length) {
            nextErrors.languages = "Select at least one language.";
        }

        if (!form.address.trim()) {
            nextErrors.address = "Address is required.";
        }

        if (!form.state) {
            nextErrors.state = "State is required.";
        }

        if (!form.city.trim()) {
            nextErrors.city = "City is required.";
        }

        if (!PINCODE_REGEX.test(String(form.pincode || "").trim())) {
            nextErrors.pincode = "PIN Code must be 6 digits.";
        } else {
            const pincodeCheck = await validatePincode(
                form.pincode,
                form.state,
                form.city,
                false
            );

            if (!pincodeCheck.valid) {
                nextErrors.pincode = pincodeCheck.message;
            }
        }

        if (!form.govtIdType) {
            nextErrors.govtIdType = "Government ID type is required.";
        } else {
            const idValue = String(form.govtIdNumber || "").trim();

            if (!idValue) {
                nextErrors.govtIdNumber = `${govtIdRule.label} is required.`;
            } else if (!govtIdRule.validate(idValue)) {
                nextErrors.govtIdNumber = govtIdRule.message;
            }

            if (!form.govtIdDocument) {
                nextErrors.govtIdDocument = `${govtIdRule.docLabel} is required.`;
            }
        }

        return nextErrors;
    };

    const validateQualificationStep = () => {
        const nextErrors = {};
        const enteredRows = qualifications
            .map((row, index) => ({ row, index }))
            .filter(({ row }) => isQualificationRowFilled(row));
        const hasCertificate = Boolean(form.degreeCertificates);

        if (!enteredRows.length && !hasCertificate) {
            return nextErrors;
        }

        if (!enteredRows.length && hasCertificate) {
            nextErrors.qualifications = "Add at least one degree entry before uploading certificates.";
        }

        if (enteredRows.length && !hasCertificate) {
            nextErrors.degreeCertificates = "Degree certificates are required when qualifications are entered.";
        }

        enteredRows.forEach(({ row, index }) => {
            if (!row.degree?.trim()) {
                nextErrors[`qualification-${index}-degree`] = "Degree name is required.";
            }

            if (row.degree === "Other" && !row.customDegree?.trim()) {
                nextErrors[`qualification-${index}-customDegree`] = "Please specify the degree.";
            }

            if (!row.institution?.trim()) {
                nextErrors[`qualification-${index}-institution`] = "Institute name is required.";
            }

            if (!YEAR_REGEX.test(String(row.year || "").trim())) {
                nextErrors[`qualification-${index}-year`] = "Enter a 4-digit year.";
                return;
            }

            const yearValue = Number(row.year);

            if (yearValue < 1900 || yearValue > new Date().getFullYear()) {
                nextErrors[`qualification-${index}-year`] = "Enter a valid passing year.";
            }
        });

        return nextErrors;
    };

    const validateVetStep = () => {
        const nextErrors = {};

        if (!form.vetCouncilRegistrationNumber.trim()) {
            nextErrors.vetCouncilRegistrationNumber = "Registration number is required.";
        } else if (!/^[A-Za-z0-9/-]{5,30}$/.test(form.vetCouncilRegistrationNumber.trim())) {
            nextErrors.vetCouncilRegistrationNumber =
                "Registration number must be 5-30 characters and may include letters, numbers, / or -.";
        }

        if (!form.stateVetCouncil) {
            nextErrors.stateVetCouncil = "State veterinary council is required.";
        }

        if (!form.certificateValidityDate) {
            nextErrors.certificateValidityDate = "Certificate validity date is required.";
        } else if (isPastDate(form.certificateValidityDate)) {
            nextErrors.certificateValidityDate = "Certificate validity date cannot be in the past.";
        }

        if (!form.registrationCertificate) {
            nextErrors.registrationCertificate = "Registration certificate is required.";
        }

        return nextErrors;
    };

    const validatePracticeStep = () => {
        const nextErrors = {};
        const serviceAreaList = parseDelimitedList(form.serviceAreas);

        if (!String(form.experience || "").trim()) {
            nextErrors.experience = "Years of experience is required.";
        } else {
            const experienceValue = Number(form.experience);
            if (!Number.isFinite(experienceValue) || experienceValue < 1 || experienceValue > 70) {
                nextErrors.experience = "Experience must be between 1 and 70 years.";
            }
        }

        if (!form.practiceType) {
            nextErrors.practiceType = "Practice type is required.";
        }

        if (!String(form.consultationFee || "").trim()) {
            nextErrors.consultationFee = "Consultation fee is required.";
        } else {
            const feeValue = Number(form.consultationFee);
            if (!Number.isFinite(feeValue) || feeValue <= 0 || feeValue > 100000) {
                nextErrors.consultationFee = "Consultation fee must be between 1 and 100000.";
            }
        }

        if (!serviceAreaList.length) {
            nextErrors.serviceAreas = "Service areas or pincodes are required.";
        }

        if (!form.gstPan.trim()) {
            nextErrors.gstPan = "GST or PAN is required.";
        } else if (!isValidGstPan(form.gstPan)) {
            nextErrors.gstPan = "Enter a valid GSTIN or PAN.";
        }

        return nextErrors;
    };

    const validateBankStep = () => {
        const nextErrors = {};

        if (!form.accountName.trim()) {
            nextErrors.accountName = "Account holder name is required.";
        }

        if (!String(form.accountNumber || "").trim()) {
            nextErrors.accountNumber = "Account number is required.";
        } else if (!/^\d{9,18}$/.test(String(form.accountNumber || "").trim())) {
            nextErrors.accountNumber = "Account number must be between 9 and 18 digits.";
        }

        if (!String(form.ifsc || "").trim()) {
            nextErrors.ifsc = "IFSC code is required.";
        } else if (!IFSC_REGEX.test(String(form.ifsc || "").trim().toUpperCase())) {
            nextErrors.ifsc = "Enter a valid IFSC code.";
        }

        if (!form.bankName.trim()) {
            nextErrors.bankName = "Bank name is required.";
        }

        if (!form.branch.trim()) {
            nextErrors.branch = "Branch is required.";
        }

        if (!form.plan) {
            nextErrors.plan = "Plan assignment is required.";
        }

        return nextErrors;
    };

    const validateCurrentStep = async (stepKey = activeTab) => {
        let nextErrors = {};

        switch (stepKey) {
            case "personal":
                nextErrors = await validatePersonalStep();
                break;
            case "qualification":
                nextErrors = validateQualificationStep();
                break;
            case "vet":
                nextErrors = validateVetStep();
                break;
            case "practice":
                nextErrors = validatePracticeStep();
                break;
            case "bank":
                nextErrors = validateBankStep();
                break;
            default:
                nextErrors = {};
        }

        setErrors(nextErrors);

        return nextErrors;
    };

    const validateAllSteps = async () => {
        const personalErrors = await validatePersonalStep();
        const qualificationErrors = validateQualificationStep();
        const vetErrors = validateVetStep();
        const practiceErrors = validatePracticeStep();
        const bankErrors = validateBankStep();

        const nextErrors = {
            ...personalErrors,
            ...qualificationErrors,
            ...vetErrors,
            ...practiceErrors,
            ...bankErrors,
        };

        setErrors(nextErrors);

        return nextErrors;
    };

    const goToNextStep = () => {
        if (currentStepIndex < tabs.length - 1) {
            setActiveTab(tabs[currentStepIndex + 1][0]);
        }
    };

    const goToPreviousStep = () => {
        if (currentStepIndex > 0) {
            setActiveTab(tabs[currentStepIndex - 1][0]);
        }
    };

    const handleNext = async () => {
        if (submitting) return;

        const nextErrors = await validateCurrentStep(activeTab);

        if (Object.keys(nextErrors).length) {
            const message = getStepErrorMessage(nextErrors);
            if (message) {
                showToast({
                    type: "error",
                    title: "Validation Error",
                    description: message,
                });
            }
            return;
        }

        goToNextStep();
    };

    const handleSkip = () => {
        if (!isQualificationStep) return;

        setQualifications([{ degree: "", institution: "", year: "" }]);
        setFieldValue("degreeCertificates", null);
        clearErrorKeys(
            "qualifications",
            "degreeCertificates",
            ...qualifications
                .map((_, index) => [
                    `qualification-${index}-degree`,
                    `qualification-${index}-institution`,
                    `qualification-${index}-year`,
                ])
                .flat()
        );

        goToNextStep();
    };

    const buildSubmissionPayload = () => {
        const normalizedQualifications = qualifications
            .map((row) => ({
                degree: String(row.degree === "Other" ? row.customDegree : row.degree || "").trim(),
                institution: String(row.institution || "").trim(),
                year: String(row.year || "").trim(),
            }))
            .filter(isQualificationRowFilled);

        return {
            ...form,
            qualifications: normalizedQualifications,
            languages: Array.isArray(form.languages) ? form.languages : [],
            specializations: Array.isArray(form.specializations) ? form.specializations : [],
            serviceAreas: parseDelimitedList(form.serviceAreas),
            bankDetails: {
                accountName: form.accountName,
                accountNumber: form.accountNumber,
                ifsc: form.ifsc,
                bankName: form.bankName,
                branch: form.branch,
            },
        };
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const nextErrors = await validateAllSteps();

        if (Object.keys(nextErrors).length) {
            const message = getStepErrorMessage(nextErrors);
            showToast({
                type: "error",
                title: "Validation Error",
                description: message || "Please complete the required fields.",
            });
            return;
        }

        setSubmitting(true);

        try {
            if (isEditMode && !doctorId) {
                throw new Error("Missing veterinarian id for update.");
            }

            const payload = buildSubmissionPayload();
            const response = isEditMode
                ? await updateDoctor(doctorId, payload)
                : await createDoctor(payload);

            showToast({
                type: "success",
                title: isEditMode ? "Veterinarian Updated" : "Veterinarian Created",
                description:
                    response.message ||
                    (isEditMode
                        ? "Veterinarian profile updated successfully."
                        : "Veterinarian profile created and login credentials were emailed to the registered address."),
            });

            onSaved?.(response);

            if (!isEditMode) {
                onCreated?.(response);
            }
            onClose?.();
        } catch (error) {
            showToast({
                type: "error",
                title: isEditMode ? "Update Failed" : "Save Failed",
                description:
                    error.response?.data?.message ||
                    (isEditMode
                        ? "Unable to update veterinarian details. Please try again."
                        : "Unable to save veterinarian details. Please try again."),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (isLastStep) {
            await handleSubmit();
            return;
        }

        await handleNext();
    };

    const textareaClass = (error) => `
        w-full
        border
        rounded-xl
        p-3
        resize-none
        outline-none
        transition
        ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
            : "border-slate-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        }
    `;

    const chipClass = (active) =>
        `inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition ${
            active
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
        }`;

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-full">
                <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
                    {/* PERSONAL */}
                    {activeTab === "personal" && (
                        <Card title="Personal Information">
                            <Grid>
                                <Input
                                    value={form.fullName}
                                    requiredField={true}
                                    name="fullName"
                                    label="Full Name"
                                    error={errors.fullName}
                                    onChange={handleSimpleChange}
                                />

                                <Select
                                    value={form.gender || ""}
                                    requiredField={true}
                                    name="gender"
                                    label="Gender"
                                    options={["Male", "Female", "Other"]}
                                    error={errors.gender}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    value={form.dob}
                                    requiredField={true}
                                    type="date"
                                    name="dob"
                                    label="Date of Birth"
                                    error={errors.dob}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    value={form.mobile}
                                    requiredField={true}
                                    name="mobile"
                                    label="Mobile Number"
                                    error={errors.mobile}
                                    onChange={handleMobileChange}
                                    maxLength={10}
                                    inputMode="numeric"
                                />

                                <Input
                                    value={form.email}
                                    requiredField={true}
                                    name="email"
                                    label="Email Address"
                                    error={errors.email}
                                    onChange={handleSimpleChange}
                                />

                                <Upload
                                    requiredField={true}
                                    label="Profile Photo"
                                    value={form.profilePhoto}
                                    error={errors.profilePhoto}
                                    accept="image/*"
                                    onChange={handleFileUpload("profilePhoto")}
                                    onRemove={() => setFieldValue("profilePhoto", null)}
                                />

                                <Full>
                                    <label className={`block text-sm font-medium mb-2 ${errors.languages ? "text-red-600" : "text-slate-700"}`}>
                                        Languages Spoken <span className="text-red-500">*</span>
                                    </label>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                                        {["English", "Hindi", "Bengali"].map((language) => (
                                            <label key={language} className={chipClass(form.languages?.includes(language))}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.languages?.includes(language) || false}
                                                    onChange={() => toggleArray("languages", language)}
                                                />
                                                {language}
                                            </label>
                                        ))}
                                    </div>

                                    {errors.languages && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.languages}
                                        </p>
                                    )}
                                </Full>

                                <Full>
                                    <label
                                        htmlFor="address"
                                        className={`block mb-1 text-sm font-medium ${errors.address ? "text-red-600" : "text-slate-700"}`}
                                    >
                                        Full Address <span className="text-red-500">*</span>
                                    </label>

                                    <textarea
                                        value={form.address}
                                        id="address"
                                        name="address"
                                        className={textareaClass(errors.address)}
                                        placeholder="Enter full address"
                                        onChange={handleSimpleChange}
                                    />

                                    {errors.address && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </Full>

                                <Select
                                    value={form.state || ""}
                                    requiredField={true}
                                    name="state"
                                    label="State"
                                    options={stateOptions}
                                    error={errors.state}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    value={form.city || ""}
                                    requiredField={true}
                                    name="city"
                                    label="City"
                                    error={errors.city}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    value={form.pincode}
                                    requiredField={true}
                                    name="pincode"
                                    label="PIN Code"
                                    error={errors.pincode}
                                    maxLength={6}
                                    inputMode="numeric"
                                    onChange={handlePincodeChange}
                                />

                                <Select
                                    value={form.govtIdType || ""}
                                    requiredField={true}
                                    name="govtIdType"
                                    label="Government ID Type"
                                    options={["Aadhaar", "PAN", "Passport"]}
                                    error={errors.govtIdType}
                                    onChange={handleSimpleChange}
                                />

                                {form.govtIdType && (
                                    <Input
                                        value={form.govtIdNumber}
                                        requiredField={true}
                                        name="govtIdNumber"
                                        label={govtIdRule.label}
                                        error={errors.govtIdNumber}
                                        placeholder={govtIdRule.placeholder}
                                        maxLength={govtIdRule.maxLength}
                                        inputMode={govtIdRule.inputMode}
                                        onChange={handleGovtIdNumberChange}
                                    />
                                )}

                                {form.govtIdType && (
                                    <Full>
                                        <Upload
                                            requiredField={true}
                                            label={govtIdRule.docLabel}
                                            value={form.govtIdDocument}
                                            error={errors.govtIdDocument}
                                            accept="image/*,.pdf,application/pdf"
                                            onChange={handleFileUpload("govtIdDocument")}
                                            onRemove={() => setFieldValue("govtIdDocument", null)}
                                        />
                                    </Full>
                                )}
                            </Grid>
                        </Card>
                    )}

                    {/* QUALIFICATION */}
                    {activeTab === "qualification" && (
                        <Card title="Veterinary Qualifications">
                            <p className="mb-4 text-sm text-slate-500">
                                This step is optional. Use Skip if you want to add qualification details later.
                            </p>

                            {qualifications.map((qualification, index) => (
                                <div
                                    key={index}
                                    className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                                >
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Degree {index + 1}
                                        </span>

                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                onClick={() =>
                                                    setQualifications((prev) =>
                                                        prev.filter((_, itemIndex) => itemIndex !== index)
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <Grid>
                                        <Select
                                            label="Degree Name"
                                            requiredField={false}
                                            value={qualification.degree || ""}
                                            options={DEGREE_OPTIONS}
                                            error={errors[`qualification-${index}-degree`]}
                                            onChange={(e) =>
                                                setQualificationValue(index, "degree", e.target.value)
                                            }
                                        />

                                        {qualification.degree === "Other" && (
                                            <Input
                                                label="Specify Degree"
                                                requiredField={false}
                                                placeholder="Enter degree name"
                                                value={qualification.customDegree || ""}
                                                error={errors[`qualification-${index}-customDegree`]}
                                                onChange={(e) =>
                                                    setQualificationValue(index, "customDegree", e.target.value)
                                                }
                                            />
                                        )}

                                        <Input
                                            label="Institute Name"
                                            requiredField={false}
                                            placeholder="Institution"
                                            value={qualification.institution}
                                            error={errors[`qualification-${index}-institution`]}
                                            onChange={(e) =>
                                                setQualificationValue(index, "institution", e.target.value)
                                            }
                                        />

                                        <Input
                                            label="Year of Passing"
                                            requiredField={false}
                                            placeholder="Year"
                                            value={qualification.year}
                                            error={errors[`qualification-${index}-year`]}
                                            maxLength={4}
                                            inputMode="numeric"
                                            onChange={handleYearChange(index)}
                                        />
                                    </Grid>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="mt-2 w-full sm:w-auto rounded-xl bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                                onClick={() =>
                                    setQualifications([
                                        ...qualifications,
                                        { degree: "", institution: "", year: "" },
                                    ])
                                }
                            >
                                + Add Degree
                            </button>

                            {errors.qualifications && (
                                <p className="mt-2 text-xs text-red-600">
                                    {errors.qualifications}
                                </p>
                            )}

                            <div className="mt-4">
                                <Upload
                                    requiredField={false}
                                    label="Degree Certificates"
                                    value={form.degreeCertificates}
                                    error={errors.degreeCertificates}
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileUpload("degreeCertificates")}
                                    onRemove={() => setFieldValue("degreeCertificates", null)}
                                />
                            </div>
                        </Card>
                    )}

                    {/* VET */}
                    {activeTab === "vet" && (
                        <Card title="Vet Council Registration">
                            <Grid>
                                <Input
                                    requiredField={true}
                                    value={form.vetCouncilRegistrationNumber}
                                    name="vetCouncilRegistrationNumber"
                                    label="Complete Vet Council Registration Number"
                                    error={errors.vetCouncilRegistrationNumber}
                                    onChange={handleSimpleChange}
                                />

                                <Select
                                    value={form.stateVetCouncil || ""}
                                    requiredField={true}
                                    name="stateVetCouncil"
                                    label="State Veterinary Council"
                                    options={stateOptions}
                                    error={errors.stateVetCouncil}
                                    onChange={handleSimpleChange}
                                />

                                <Full>
                                    <Upload
                                        requiredField={true}
                                        label="Registration Certificate"
                                        value={form.registrationCertificate}
                                        error={errors.registrationCertificate}
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileUpload("registrationCertificate")}
                                        onRemove={() => setFieldValue("registrationCertificate", null)}
                                    />
                                </Full>

                                <Input
                                    requiredField={true}
                                    type="date"
                                    value={form.certificateValidityDate}
                                    name="certificateValidityDate"
                                    label="Certificate Validity Date"
                                    error={errors.certificateValidityDate}
                                    onChange={handleSimpleChange}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* PRACTICE */}
                    {activeTab === "practice" && (
                        <Card title="Practice Details">
                            <Grid>
                                <Input
                                    requiredField={true}
                                    value={form.experience}
                                    name="experience"
                                    label="Years of Experience"
                                    error={errors.experience}
                                    onChange={handleExperienceChange}
                                    inputMode="numeric"
                                    maxLength={2}
                                />

                                <Select
                                    value={form.practiceType || ""}
                                    requiredField={true}
                                    name="practiceType"
                                    label="Practice Type"
                                    options={PRACTICE_TYPES}
                                    error={errors.practiceType}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    requiredField={true}
                                    value={form.consultationFee}
                                    name="consultationFee"
                                    label="Consultation Fee (Rs.)"
                                    error={errors.consultationFee}
                                    onChange={handleConsultationFeeChange}
                                    inputMode="numeric"
                                    maxLength={6}
                                />

                                <Full>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Specializations
                                    </label>

                                    <div className="flex flex-wrap gap-2">
                                        {SPECIALIZATION_OPTIONS.map((specialization) => {
                                            const active = form.specializations?.includes(specialization) || false;

                                            return (
                                                <button
                                                    key={specialization}
                                                    type="button"
                                                    onClick={() => toggleArray("specializations", specialization)}
                                                    className={chipClass(active)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={active}
                                                        readOnly
                                                        className="accent-orange-500"
                                                    />
                                                    {specialization}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </Full>

                                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        name="emergencyAvailable"
                                        checked={Boolean(form.emergencyAvailable)}
                                        onChange={handleSimpleChange}
                                    />
                                    Available for emergency calls
                                </label>

                                <Input
                                    requiredField={true}
                                    name="serviceAreas"
                                    value={form.serviceAreas}
                                    label="Service Areas / Pincodes"
                                    placeholder="Comma-separated list"
                                    error={errors.serviceAreas}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    requiredField={true}
                                    name="gstPan"
                                    value={form.gstPan}
                                    label="GST / PAN"
                                    placeholder="GSTIN or PAN"
                                    error={errors.gstPan}
                                    onChange={handleSimpleChange}
                                    maxLength={20}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* BANK */}
                    {activeTab === "bank" && (
                        <Card title="Banking & Plan">
                            <Grid>
                                <Input
                                    value={form.accountName}
                                    requiredField={true}
                                    name="accountName"
                                    label="Account Holder Name"
                                    error={errors.accountName}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    value={form.accountNumber}
                                    requiredField={true}
                                    name="accountNumber"
                                    label="Account Number"
                                    error={errors.accountNumber}
                                    onChange={handleAccountNumberChange}
                                    inputMode="numeric"
                                    maxLength={18}
                                />

                                <Input
                                    requiredField={true}
                                    name="ifsc"
                                    value={form.ifsc}
                                    label="IFSC Code"
                                    error={errors.ifsc}
                                    onChange={handleIfscChange}
                                    maxLength={11}
                                />

                                <Input
                                    requiredField={true}
                                    name="bankName"
                                    label="Bank Name"
                                    value={form.bankName}
                                    error={errors.bankName}
                                    onChange={handleSimpleChange}
                                />

                                <Input
                                    requiredField={true}
                                    name="branch"
                                    label="Branch"
                                    value={form.branch}
                                    error={errors.branch}
                                    onChange={handleSimpleChange}
                                />

                                <Select
                                    value={form.plan || ""}
                                    requiredField={true}
                                    name="plan"
                                    label="Plan Assigned"
                                    options={planOptions}
                                    error={errors.plan}
                                    onChange={handleSimpleChange}
                                />
                            </Grid>
                        </Card>
                    )}

                    {/* FOOTER */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                        <button
                            type="button"
                            onClick={currentStepIndex > 0 ? goToPreviousStep : onClose}
                            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            disabled={submitting}
                        >
                            {currentStepIndex > 0 ? "Previous" : "Cancel"}
                        </button>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                            {isQualificationStep && (
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                    disabled={submitting}
                                >
                                    Skip
                                </button>
                            )}

                            {!isLastStep ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                                    disabled={submitting}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? (isEditMode ? "Updating..." : "Saving...")
                                        : (isEditMode ? "Update Veterinarian" : "Save Veterinarian")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
