import React, { useState } from "react";
import { showToast } from "../../../../../shared/components/toast";
import { State,City } from "country-state-city";
import { Card, Input, Select, Grid, Full, Upload } from "../../../components"
// import { createDoctor } from "../../../api/doctorApi";

export default function DoctorForm({ activeTab, form, setForm, qualifications, setQualifications }) {

    const states = State.getStatesOfCountry("IN");
    const cities = form.state
  ? [
      ...new Map(
        City.getCitiesOfState(
          "IN",
          states.find((s) => s.name === form.state)?.isoCode
        ).map((city) => [city.name, city])
      ).values(),
    ]
  : [];

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
    }
};
  const handleFileUpload = (field) => (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        showToast({
            type: "error",
            title: "Invalid File",
            description: "Only PDF files are allowed.",
        });

        e.target.value = "";
        return;
    }

    setForm((prev) => ({
        ...prev,
        [field]: file,
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


    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,

        ...(name === "state" && {
            city: "",
        }),
    }));
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

        // try {
        //     const data = await createDoctor(form);

        //     showToast({
        //         type: "success",
        //         title: "Doctor Created",
        //         description: data.message,
        //     });

        //     console.log(data);

        // } catch (error) {
        //     showToast({
        //         type: "error",
        //         title: "Error",
        //         description:
        //             error.response?.data?.message || "Something went wrong",
        //     });
        // }
    };



    return (
        <form >
            <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-full">
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
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap mt-2">
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
                                        className="w-full border p-3 rounded-xl resize-none"
                                        placeholder="Enter full address"
                                        onChange={handleChange}
                                    />
                                </Full>

                                
                                <Select
                                    value={form.state || ""}
                                    requiredField={true}
                                    name="state"
                                    label="State"
                                    options={states.map((state) => state.name)}
                                    onChange={handleChange}
                                />
                                <Select
    value={form.city || ""}
    requiredField={true}
    name="city"
    label="City"
    options={cities.map((city) => city.name)}
    onChange={handleChange}
/>
                               <Input
    value={form.pincode}
    requiredField
    name="pincode"
    label="PIN Code"
    maxLength={6}
    onChange={(e) => {
        handleChange(e);

        if (e.target.value.length === 6) {
            validatePincode(e.target.value);
        }
    }}
/>

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
                                className="
mt-4
w-full sm:w-auto
bg-orange-500
hover:bg-orange-600
text-white
px-4
py-2
rounded-xl
transition
"
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
                                <Select
                                    value={form.stateVetCouncil || ""}
                                    requiredField={true}
                                    name="stateVetCouncil"
                                    label="State Veterinary Council"
                                    options={states.map((state) => state.name)}
                                    onChange={handleChange}
                                />
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
                                <Input requiredField={true} name="serviceAreas" value={form.serviceAreas} label="Service Areas / Pincodes" onChange={handleChange} />
                                <Input requiredField={true} name="gstPan" value={form.gstPan} label="GST / PAN" onChange={handleChange} />
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
                        <div className="w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="
w-full sm:w-auto
bg-orange-500
hover:bg-orange-600
text-white
px-6
py-3
rounded-xl
font-medium
transition
"
                            >
                                Save Doctor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </form>
    );
}