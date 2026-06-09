import React, { useState } from "react";

/* UI (UNCHANGED) */
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

const Input = ({ label, ...props }) => (
    <div>
        <label className="text-sm">{label}</label>
        <input {...props} className="w-full border p-2 rounded-xl mt-1" />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div>
        <label className="text-sm">{label}</label>
        <select {...props} className="w-full border p-2 rounded-xl mt-1">
            <option value="">Select</option>
            {options.map((o) => (
                <option key={o}>{o}</option>
            ))}
        </select>
    </div>
);

const Upload = ({ label, onChange }) => (
    <div>
        <label className="text-sm">{label}</label>

        <label className="border-dashed border p-4 text-center rounded-xl mt-1 block cursor-pointer text-orange-400 border-black">
            Upload File

            <input
                type="file"
                className="hidden"
                onChange={onChange}
            />
        </label>
    </div>
);

export default function DoctorForm({ activeTab }) {
    const handleFileUpload = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.files[0],
        }));
    };

    const handleQualificationChange = (index, field, value) => {
        setQualifications((prev) =>
            prev.map((q, i) =>
                i === index
                    ? { ...q, [field]: value }
                    : q
            )
        );
    };


    const [form, setForm] = useState({
        fullName: "",
        gender: "",
        dob: "",
        mobile: "",
        email: "",
        languages: [],
        address: "",
        city: "",
        state: "",
        pincode: "",
        govtIdType: "",
        govtIdNumber: "",

        govtIdDocument: null,
        degreeCertificates: null,
        registrationCertificate: null,
        profilePhoto: null,

        experience: "",
        specializations: [],
        vetCouncilRegistrationNumber: "",
        stateVetCouncil: "",
        certificateValidityDate: "",
        isRenewable: false,
        practiceType: "",
        consultationFee: "",
        emergencyAvailable: false,
        serviceAreas: "",
        gstPan: "",
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        branch: "",
        plan: "",
    });

    const [qualifications, setQualifications] = useState([
        { degree: "", institution: "", year: "" },
    ]);

    // const [employers, setEmployers] = useState([
    //     { organisation: "", role: "", duration: "" },
    // ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const toggleArray = (field, value) => {
        const arr = form[field];
        setForm({
            ...form,
            [field]: arr.includes(value)
                ? arr.filter((v) => v !== value)
                : [...arr, value],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(form);
        console.log(qualifications);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gray-100 min-h-full">
                <div className="max-w-6xl mx-auto">

                    {/* PERSONAL */}
                    {activeTab === "personal" && (
                        <Card title="Personal Information">
                            <Grid>
                                <Input name="fullName" label="Full Name" onChange={handleChange} />
                                <Select name="gender" label="Gender" options={["Male", "Female", "Other"]} onChange={handleChange} />
                                <Input type="date" name="dob" label="Date of Birth" onChange={handleChange} />
                                <Input name="mobile" label="Mobile Number" onChange={handleChange} />
                                <Input name="email" label="Email Address" onChange={handleChange} />
                                <Upload
                                    label="Profile Photo"
                                    onChange={handleFileUpload("profilePhoto")}
                                />

                                <Full>
                                    <label>Languages Spoken</label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["English", "Hindi", "Bengali"].map((l) => (
                                            <label key={l}>
                                                <input type="checkbox" onChange={() => toggleArray("languages", l)} /> {l}
                                            </label>
                                        ))}
                                    </div>
                                </Full>

                                <Full>
                                    <textarea name="address" className="w-full border p-2 rounded-xl" placeholder="Full Address" onChange={handleChange} />
                                </Full>

                                <Input name="city" label="City / District" onChange={handleChange} />
                                <Input name="state" label="State" onChange={handleChange} />
                                <Input name="pincode" label="PIN Code" onChange={handleChange} />

                                <Select name="govtIdType" label="Government ID Type" options={["Aadhaar", "PAN", "Passport"]} onChange={handleChange} />
                                <Input name="govtIdNumber" label="Government ID Number" onChange={handleChange} />
                                <Full><Upload
                                    label="Government ID Document"
                                    onChange={handleFileUpload("govtIdDocument")}
                                /></Full>
                            </Grid>
                        </Card>
                    )}

                    {/* QUALIFICATION */}
                    {activeTab === "qualification" && (
                        <Card title="Veterinary Qualifications" >
                            {qualifications.map((q, i) => (
                                <Grid key={i}>
                                    <Input
                                        placeholder="Degree"
                                        value={q.degree}
                                        onChange={(e) =>
                                            handleQualificationChange(
                                                i,
                                                "degree",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Input
                                        placeholder="Institution"
                                        value={q.institution}
                                        onChange={(e) =>
                                            handleQualificationChange(
                                                i,
                                                "institution",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Input
                                        placeholder="Year"
                                        value={q.year}
                                        onChange={(e) =>
                                            handleQualificationChange(
                                                i,
                                                "year",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                            ))}
                            <button
                                type="button"
                                className="m-2"
                                onClick={() =>
                                    setQualifications([
                                        ...qualifications,
                                        { degree: "", institution: "", year: "" }
                                    ])
                                }
                            >                            + Add Degree
                            </button>
                            <Upload
                                label="Degree Certificates (Multiple)"
                                onChange={handleFileUpload("degreeCertificates")}
                            />
                        </Card>
                    )}

                    {/* VET */}
                    {activeTab === "vet" && (
                        <Card title="Vet Council Registration">
                            <Grid>
                                <Input name="vetCouncilRegistrationNumber" label="Complete Vet Council Registration Number" onChange={handleChange} />
                                <Select name="stateVetCouncil" label="State Vet Council" options={["Bihar", "UP", "Delhi"]} onChange={handleChange} />
                                <Full><Upload
                                    label="Registration Certificate"
                                    onChange={handleFileUpload("registrationCertificate")}
                                /></Full>
                                <Input type="date" name="certificateValidityDate" label="Certificate Validity Date" onChange={handleChange} />
                                <label>
                                    <input type="checkbox" name="isRenewable" onChange={handleChange} /> Is Registration Renewable?
                                </label>
                            </Grid>
                        </Card>
                    )}

                    {/* PRACTICE */}
                    {activeTab === "practice" && (
                        <Card title="Practice Details">
                            <Grid>
                                <Select name="practiceType" label="Practice Type"
                                    options={["Home visits", "Telemedicine", "Mobile clinic", "Freelance", "Government"]}
                                    onChange={handleChange}
                                />
                                <Input name="consultationFee" label="Consultation Fee (₹)" onChange={handleChange} />
                                <label>
                                    <input type="checkbox" name="emergencyAvailable" onChange={handleChange} /> Available for Emergency Calls?
                                </label>
                                <Input name="serviceAreas" label="Service Areas / Pincodes" onChange={handleChange} />
                                <Input name="gstPan" label="GST / PAN" onChange={handleChange} />
                            </Grid>
                        </Card>
                    )}

                    {/* BANK */}
                    {activeTab === "bank" && (
                        <Card title="Banking & Plan">
                            <Grid>
                                <Input name="accountName" label="Account Holder Name" onChange={handleChange} />
                                <Input name="accountNumber" label="Account Number" onChange={handleChange} />
                                <Input name="ifsc" label="IFSC Code" onChange={handleChange} />
                                <Input name="bankName" label="Bank Name" onChange={handleChange} />
                                <Input name="branch" label="Branch" onChange={handleChange} />
                                <Select name="plan" label="Plan Assigned" options={["Solo Basic", "Solo Pro"]} onChange={handleChange} />
                            </Grid>
                        </Card>
                    )}

                    {/* SAVE */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-3 rounded-xl"
                        >
                            Save Doctor
                        </button>
                    </div>
                </div>
            </div>

        </form>
    );
}