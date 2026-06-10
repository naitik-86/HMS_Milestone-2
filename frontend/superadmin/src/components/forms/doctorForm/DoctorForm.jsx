import React, { useState } from "react";
import { showToast } from "../../../util/toast";
import { Card, Input, Select, Grid, Full, Upload } from "../../../components"
import { createDoctor } from "../../../api/doctorApi";

export default function DoctorForm({ activeTab, form, setForm, qualifications, setQualifications }) {


    const handleFileUpload = (field) => (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            [field]: file,
        }));

        console.log("File selected:", file);
        console.log(form);
        console.log(qualifications);


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




    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("FORM SUBMITTED");
        console.log("SUBMIT FIRED", activeTab);

        try {
            const data = await createDoctor(form);

            showToast({
                type: "success",
                title: "Doctor Created",
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
        <form >
            <div className="p-6 bg-gray-100 min-h-full">
                <div className="max-w-6xl mx-auto">

                    {/* PERSONAL */}
                    {activeTab === "personal" && (
                        <Card title="Personal Information">
                            <Grid>
                                <Input value={form.fullName} requiredField={true} name="fullName" label="Full Name" onChange={handleChange} />
                                <Select value={form.gender || ""} requiredField={true} name="gender" label="Gender" options={["Male", "Female", "Other"]} onChange={handleChange} />
                                <Input value={form.dob} requiredField={true} type="date" name="dob" label="Date of Birth" onChange={handleChange} />
                                <Input value={form.mobile} requiredField={true} name="mobile" label="Mobile Number" onChange={handleChange} />
                                <Input value={form.email} requiredField={true} name="email" label="Email Address" onChange={handleChange} />
                                <Upload
                                    requiredField={true}
                                    label="Profile Photo"
                                    value={form.profilePhoto}
                                    onChange={handleFileUpload("profilePhoto")}
                                    onRemove={() =>
                                        setForm((prev) => ({ ...prev, profilePhoto: null }))
                                    }
                                />

                                <Full>
                                    <label>Languages Spoken <span className="text-red-500"> *</span></label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["English", "Hindi", "Bengali"].map((l) => (
                                            <label key={l}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.languages?.includes(l) || false}
                                                    onChange={() => toggleArray("languages", l)} /> {l}
                                            </label>
                                        ))}
                                    </div>
                                </Full>

                                <Full>
                                    <label htmlFor="address" className="block mb-1">
                                        Full Address<span className="text-red-500"> *</span>
                                    </label>

                                    <textarea
                                        value={form.address}
                                        id="address"
                                        name="address"
                                        className="w-full border p-2 rounded-xl"
                                        placeholder="Enter full address"
                                        onChange={handleChange}
                                    />
                                </Full>

                                <Input value={form.city} requiredField={true} name="city" label="City / District" onChange={handleChange} />
                                <Input value={form.state} requiredField={true} name="state" label="State" onChange={handleChange} />
                                <Input value={form.pincode} requiredField={true} name="pincode" label="PIN Code" onChange={handleChange} />

                                <Select value={form.govtIdType || ""} requiredField={true} name="govtIdType" label="Government ID Type" options={["Aadhaar", "PAN", "Passport"]} onChange={handleChange} />
                                <Input value={form.govtIdNumber} requiredField={true} name="govtIdNumber" label="Government ID Number" onChange={handleChange} />
                                <Full>
                                    <Full>
                                        <Upload
                                            requiredField={true}
                                            label="Government ID Document"
                                            value={form.govtIdDocument}
                                            onChange={handleFileUpload("govtIdDocument")}
                                            onRemove={() =>
                                                setForm((prev) => ({ ...prev, govtIdDocument: null }))
                                            }
                                        />
                                    </Full>
                                </Full>
                            </Grid>
                        </Card>
                    )}

                    {/* QUALIFICATION */}
                    {activeTab === "qualification" && (
                        <Card title="Veterinary Qualifications" >
                            {qualifications.map((q, i) => (
                                <Grid key={i}>
                                    <Input
                                        label={"Degree Name"}
                                        requiredField={true}
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
                                        label={"Institute Name"}
                                        requiredField={true}
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
                                        label={"Year of Passing"}
                                        requiredField={true}
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
                                requiredField={true}
                                label="Degree Certificates (Multiple)"
                                value={form.degreeCertificates}
                                onChange={handleFileUpload("degreeCertificates")}
                                onRemove={() =>
                                    setForm((prev) => ({ ...prev, degreeCertificates: null }))
                                }
                            />
                        </Card>
                    )}

                    {/* VET */}
                    {activeTab === "vet" && (
                        <Card title="Vet Council Registration">
                            <Grid>
                                <Input requiredField={true} value={form.vetCouncilRegistrationNumber} name="vetCouncilRegistrationNumber" label="Complete Vet Council Registration Number" onChange={handleChange} />
                                <Select value={form.stateVetCouncil || ""} requiredField={true} name="stateVetCouncil" label="State Vet Council" options={["Bihar", "UP", "Delhi"]} onChange={handleChange} />
                                <Full>
                                    <Full>
                                        <Upload
                                            requiredField={true}
                                            label="Registration Certificate"
                                            value={form.registrationCertificate}
                                            onChange={handleFileUpload("registrationCertificate")}
                                            onRemove={() =>
                                                setForm((prev) => ({ ...prev, registrationCertificate: null }))
                                            }
                                        />
                                    </Full>
                                </Full>
                                <Input requiredField={true} type="date" value={form.certificateValidityDate} name="certificateValidityDate" label="Certificate Validity Date" onChange={handleChange} />
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
                                <Select
                                    value={form.practiceType || ""}
                                    requiredField={true}
                                    name="practiceType"
                                    label="Practice Type"
                                    options={["Home visits", "Telemedicine", "Mobile clinic", "Freelance", "Government"]}
                                    onChange={handleChange}
                                />
                                <Input requiredField={true} requiredField={true} value={form.consultationFee} name="consultationFee" label="Consultation Fee (₹)" onChange={handleChange} />
                                <label>
                                    <input type="checkbox" name="emergencyAvailable" onChange={handleChange} /> Available for Emergency Calls?
                                </label>
                                <Input requiredField={true} requiredField={true} name="serviceAreas" value={form.serviceAreas} label="Service Areas / Pincodes" onChange={handleChange} />
                                <Input requiredField={true} requiredField={true} name="gstPan" value={form.gstPan} label="GST / PAN" onChange={handleChange} />
                            </Grid>
                        </Card>
                    )}

                    {/* BANK */}
                    {activeTab === "bank" && (
                        <Card title="Banking & Plan">
                            <Grid>
                                <Input value={form.accountName} requiredField={true} name="accountName" label="Account Holder Name" onChange={handleChange} />
                                <Input value={form.accountNumber} requiredField={true} name="accountNumber" label="Account Number" onChange={handleChange} />
                                <Input requiredField={true} name="ifsc" value={form.ifsc} label="IFSC Code" onChange={handleChange} />
                                <Input requiredField={true} name="bankName" label="Bank Name" value={form.bankName} onChange={handleChange} />
                                <Input requiredField={true} name="branch" label="Branch" value={form.branch} onChange={handleChange} />
                                <Select value={form.plan || ""} requiredField={true} name="plan" label="Plan Assigned" options={["Solo Basic", "Solo Pro"]} onChange={handleChange} />
                            </Grid>
                        </Card>
                    )}

                    {/* SAVE */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
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