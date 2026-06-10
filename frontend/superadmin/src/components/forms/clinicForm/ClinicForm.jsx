
import { useState } from "react";
import { showToast } from "../../../util/toast";
import { createClinic } from "../../../api/clinicApi";


/* ---------------- UI COMPONENTS ---------------- */



const Card = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
    </div>
);

const Grid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Full = ({ children }) => <div className="md:col-span-2">{children}</div>;


const Input = ({ label, requiredField = false, ...props }) => (
    <div>
        <label className="text-sm">{label}
            {requiredField && <span className="text-red-500"> *</span>}
        </label>
        <input
            {...props}
            required={requiredField}
            value={props.value ?? ""}
            onChange={props.onChange}
            className="w-full border p-2 rounded-xl mt-1"
        />
    </div>
);


const Select = ({ label, options, requiredField = false, ...props }) => (
    <div>
        <label className="text-sm">{label}
            {requiredField && <span className="text-red-500"> *</span>}

        </label>
        <select
            required={requiredField}
            {...props}
            value={props.value ?? ""}
            onChange={props.onChange}
            className="w-full border p-2 rounded-xl mt-1"
        >
            <option value="">Select</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
);

const Upload = ({
    label,
    requiredField = false,
    value,
    onChange,
    onRemove,
}) => {
    const isImage = value && value.type?.startsWith("image/");

    return (
        <div>
            <label className="text-sm">
                {label}
                {requiredField && <span className="text-red-500"> *</span>}
            </label>

            <label className="border-dashed border p-4 rounded-xl mt-1 block cursor-pointer border-black">

                {!value ? (
                    <div className="text-center text-orange-400">
                        <p className="font-medium">Upload File</p>
                        <p className="text-xs text-gray-400">
                            Click to browse
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">

                        {/* 🔥 Image Preview */}
                        {isImage && (
                            <img
                                src={URL.createObjectURL(value)}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                        )}

                        {/* 🔥 File Info */}
                        <div className="flex-1">
                            <p className="text-green-600 font-medium truncate">
                                {value.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(value.size / 1024).toFixed(1)} KB
                            </p>
                            <p className="text-xs text-blue-500">
                                Click to change file
                            </p>
                        </div>

                        {/* 🔥 Remove Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove && onRemove();
                            }}
                            className="text-red-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    className="hidden"
                    onChange={onChange}
                />
            </label>
        </div>
    );
};



/* ---------------- MAIN FORM ---------------- */

export default function ClinicForm({
    activeTab,
    form,
    setForm,
    handleChange,
    canSave,
    validateTab,
    setActiveTab,
    tabs,
}) {

    const [submitting, setSubmitting] = useState(false);


    const handleFileUpload = (field) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

        try {
            const data = await createClinic(form);

            showToast({
                type: "success",
                title: "Clinic Created",
                description: data.message,
            });

            console.log(data);

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
        <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gray-100 min-h-full">
                <div className="max-w-6xl mx-auto space-y-6">

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

                                <Input requiredField={true} name="year" label="Year of Establishment" value={form.year} onChange={handleChange} />
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

                                <Input requiredField={true} name="address1" label="Address Line 1" value={form.address1} onChange={handleChange} />
                                <Input name="address2" label="Address Line 2" value={form.address2} onChange={handleChange} />
                                <Input requiredField={true} name="city" label="City" value={form.city} onChange={handleChange} />
                                <Input requiredField={true} name="district" label="District" value={form.district} onChange={handleChange} />
                                <Input requiredField={true} name="state" label="State" value={form.state} onChange={handleChange} />
                                <Input requiredField={true} name="pincode" label="PIN Code" value={form.pincode} onChange={handleChange} />

                                <Full>
                                    <Input requiredField={true} name="serviceArea" label="Service Areas / Zones" value={form.serviceArea} onChange={handleChange} />
                                </Full>

                            </Grid>
                        </Card>
                    )}

                    {/* 3 LICENSES */}
                    {activeTab === "licenses" && (
                        <Card title="Registrations & Licenses">
                            <Grid>

                                <Input requiredField={true} name="vetReg" label="Vet Council Reg No." value={form.vetReg} onChange={handleChange} />

                                <Select
                                    requiredField={true}
                                    name="stateCouncil"
                                    label="State Vet Council"
                                    value={form.stateCouncil}
                                    options={["Bihar", "UP", "Delhi"]}
                                    onChange={handleChange}
                                />

                                <Input requiredField={true} type="date" name="expiry" label="Expiry Date" value={form.expiry} onChange={handleChange} />
                                <Input requiredField={true} name="tradeLicense" label="Trade License No." value={form.tradeLicense} onChange={handleChange} />
                                <Input requiredField={true} name="drugLicense" label="Drug License No." value={form.drugLicense} onChange={handleChange} />

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
                                className="w-full mt-4 p-3 border rounded-xl"
                                placeholder="Enter notes..."
                            />

                            {/* MODULES (UNCHANGED UI) */}
                            {form.plan === "Custom" && (
                                <div className="mt-6 bg-slate-50 p-6 rounded-2xl border">

                                    <h3 className="text-sm font-semibold text-slate-600 mb-4">
                                        FEATURE LIMITS PER PLAN
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
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

                                    <div className="grid grid-cols-2 gap-4">

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
                                                className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border"
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
                        <div className="flex justify-end gap-3">

                            {activeTab !== "plan" ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="
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
                                    type="submit"
                                    className="
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