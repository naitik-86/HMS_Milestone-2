
import { useState } from "react";
import { showToast } from "../../../util/toast";
import { api } from "../../../services/apiClient";



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

const Upload = ({ label, requiredField = false, onChange }) => (
    <div>
        <label className="text-sm">
            {label}
            {requiredField && <span className="text-red-500"> *</span>}

        </label>

        <label className="border-dashed border p-4 text-center rounded-xl mt-1 block cursor-pointer text-orange-400 border-black">
            Upload File

            <input
                required={requiredField}
                type="file"
                className="hidden"
                onChange={onChange}
            />
        </label>
    </div>
);

/* ---------------- MAIN FORM ---------------- */

export default function ClinicForm({ activeTab, form, setForm }) {

    const [submitting, setSubmitting] = useState(false);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileUpload = (field) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            [field]: file,
        }));
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

                                <Upload requiredField={true} label="Clinic Logo" onChange={handleFileUpload("logo")} />

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

                                <Upload requiredField={true} label="Registration Certificate" onChange={handleFileUpload("vetCert")} />
                                <Upload requiredField={true} label="Trade License Doc" onChange={handleFileUpload("tradeDoc")} />
                                <Upload requiredField={true} label="Drug License Doc" onChange={handleFileUpload("drugDoc")} />

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

                                <Upload requiredField={true} label="Cancelled Cheque" onChange={handleFileUpload("cheque")} />

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

                                <Upload requiredField={true} label="ID Document" onChange={handleFileUpload("idDoc")} />
                                <Upload requiredField={true} label="Profile Photo" onChange={handleFileUpload("profile")} />

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
                                    requiredField={true}
                                    name="billing"
                                    label="Billing Cycle"
                                    value={form.billing}
                                    options={["Monthly", "Quarterly", "Annual"]}
                                    onChange={handleChange}
                                />

                                <Input requiredField={true} type="date" name="startDate" label="Plan Start Date" value={form.startDate} onChange={handleChange} />

                                <Input requiredField={true} name="endDate" label="Plan End / Renewal Date" value={form.endDate} disabled />

                                <Input requiredField={true} type="number" name="trialDays" label="Trial Period (Days)" value={form.trialDays} onChange={handleChange} />

                                <Input requiredField={true} name="discountCode" label="Discount / Promo Code" value={form.discountCode} onChange={handleChange} />

                            </Grid>

                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="w-full mt-4 p-3 border rounded-xl"
                                placeholder="Enter notes..."
                            />

                            {/* MODULES (UNCHANGED UI) */}
                            <div className="mt-6 bg-slate-50 p-6 rounded-2xl border">
                                <h3 className="text-sm font-semibold text-slate-600 mb-4">
                                    FEATURE LIMITS PER PLAN
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <Input requiredField={true} name="maxStaff" label="Max Staff Accounts" value={form.maxStaff} onChange={handleChange} />
                                    <Input requiredField={true} name="maxDoctors" label="Max Doctors" value={form.maxDoctors} onChange={handleChange} />
                                    <Input requiredField={true} name="maxPets" label="Max Pet Records / Unlimited" value={form.maxPets} onChange={handleChange} />
                                    <Input requiredField={true} name="storageLimit" label="Storage Limit (GB)" value={form.storageLimit} onChange={handleChange} />
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

                        </Card>
                    )}

                    {/* SAVE */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-3 rounded-xl">
                            Save Clinic
                        </button>
                    </div>

                </div>
            </div>
        </form>
    );
}