import { useEffect, useMemo, useState } from "react";
import { City, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../shared/components/toast";
import {
  registerOwnerAndPet,
  searchCustomer,
  sendRegistrationOtp,
} from "../../api/receptionApi";
import { getDoctors } from "../../api/doctorApi";
import { getDoctorStaff } from "../../api/staffApi";

const initialFormData = {
  mobileNumber: "",
  otp: "",
  visitType: "New",
  ownerName: "",
  ownerIdType: "Aadhaar Card",
  email: "",
  address: "",
  state: "",
  city: "",
  district: "",
  pincode: "",
  petId: "",
  tokenNumber: "",
  petName: "",
  species: "Dog",
  breed: "",
  gender: "Male",
  dob: "",
  age: "",
  color: "",
  rfid: "",
  identificationArea: "",
  petPhoto: null,
  sterilized: "No",
  vaccineName: "",
  vaccinationDate: "",
  batchNumber: "",
  clinicName: "",
  dewormingProduct: "",
  dewormingDate: "",
  dose: "",
  surgicalProcedure: "",
  surgeryDate: "",
  hospital: "",
  condition: "",
  treatment: "",
  treatmentDate: "",
  allergies: "",
  medications: "",
  primaryReason: "",
  assignedDoctor: "",
  complaint: "",
  appointmentDate: "",
  appointmentTime: "",
};

const steps = [
  "Owner Verification",
  "Pet Registration",
  "Pet History",
  "Reason For Visit",
];

const reasonOptions = ["Treatment", "Vaccination", "Checkup", "Certificate"];
const inputClass = "w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none";
const today = new Date().toISOString().split("T")[0];

const calculateAge = (dob) => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

const normalizeDoctorList = (response) => {
  const doctors = response?.doctors || response?.data?.doctors || response?.data || response || [];
  return Array.isArray(doctors) ? doctors : [];
};

const getDoctorName = (doctor) =>
  doctor.name ||
  doctor.fullName ||
  doctor.personalInfo?.fullName ||
  doctor.staff?.personalInfo?.fullName ||
  doctor.email ||
  "";

const getDoctorOptionValue = (doctor) =>
  doctor._id || doctor.id || doctor.doctorId || getDoctorName(doctor);

function ErrorText({ errors, name }) {
  return errors[name] ? <p className="mt-1 text-sm text-red-500">{errors[name]}</p> : null;
}

export default function NewRegistrationPet() {
  const [showModal] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [mobileExists, setMobileExists] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const states = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(
    () => (formData.state ? City.getCitiesOfState("IN", formData.state) : []),
    [formData.state]
  );
  const selectedState = states.find((item) => item.isoCode === formData.state);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const [doctorDetailsResponse, doctorStaffResponse] = await Promise.allSettled([
          getDoctors(),
          getDoctorStaff(),
        ]);

        const doctorDetails =
          doctorDetailsResponse.status === "fulfilled"
            ? normalizeDoctorList(doctorDetailsResponse.value)
            : [];
        const doctorStaff =
          doctorStaffResponse.status === "fulfilled"
            ? normalizeDoctorList(doctorStaffResponse.value)
            : [];
        const doctorMap = new Map();

        [...doctorDetails, ...doctorStaff].forEach((doctor) => {
          const optionValue = getDoctorOptionValue(doctor);
          if (optionValue) doctorMap.set(optionValue, doctor);
        });

        setDoctors(Array.from(doctorMap.values()));
      } catch (error) {
        console.error("Doctors fetch failed:", error);
      }
    };

    fetchDoctors();
  }, []);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "mobileNumber") {
      setMobileExists(false);
      setOtpSent(false);
    }

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
        district: "",
      }));
      setErrors((prev) => ({ ...prev, state: "", city: "", district: "" }));
      return;
    }

    if (name === "city") {
      setFormData((prev) => ({ ...prev, city: value, district: value }));
      setErrors((prev) => ({ ...prev, city: "", district: "" }));
      return;
    }

    if (name === "dob") {
      if (value && value > today) {
        setFormData((prev) => ({ ...prev, dob: value, age: "" }));
        setErrors((prev) => ({
          ...prev,
          dob: "Date of birth cannot be in the future.",
          age: "",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, dob: value, age: calculateAge(value) }));
      setErrors((prev) => ({ ...prev, dob: "", age: "" }));
      return;
    }

    setField(name, files ? files[0] : value);
  };

  const validateFields = (fields) => {
    const nextErrors = {};
    const required = (name, message) => {
      if (!String(formData[name] || "").trim()) nextErrors[name] = message;
    };

    if (fields.includes("owner")) {
      if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
        nextErrors.mobileNumber = "Enter a valid 10 digit mobile number.";
      }
      if (!otpSent) nextErrors.otp = "Send OTP before continuing.";
      if (!/^\d{6}$/.test(formData.otp)) nextErrors.otp = "Enter 6 digit OTP.";
      if (mobileExists) nextErrors.mobileNumber = "This mobile number is already registered.";
      required("ownerName", "Owner name is required.");
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
      required("address", "Full address is required.");
      required("state", "State is required.");
      required("city", "City is required.");
      required("district", "District is required.");
      if (!/^\d{6}$/.test(formData.pincode)) nextErrors.pincode = "Enter a valid 6 digit pincode.";
    }

    if (fields.includes("pet")) {
      required("petName", "Pet name is required.");
      required("species", "Species is required.");
      required("breed", "Breed is required.");
      required("gender", "Gender is required.");
      if (formData.dob && formData.dob > today) {
        nextErrors.dob = "Date of birth cannot be in the future.";
      }
      if (formData.age && Number(formData.age) < 0) nextErrors.age = "Age cannot be negative.";
    }

    if (fields.includes("visit")) {
      required("primaryReason", "Primary reason is required.");
      required("complaint", "Specific complaint is required.");
      required("appointmentDate", "Appointment date is required.");
      required("appointmentTime", "Appointment time is required.");
      required("assignedDoctor", "Assigned doctor is required.");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "Enter a valid 10 digit mobile number.",
      }));
      return;
    }

    try {
      const customerResponse = await searchCustomer(formData.mobileNumber);
      const existingCustomer = customerResponse?.data;

      if (existingCustomer) {
        setMobileExists(true);
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "This mobile number is already registered.",
        }));
        showToast({
          type: "error",
          title: "Already Registered",
          description: "This mobile number is already registered.",
        });
        return;
      }

      const otpResponse = await sendRegistrationOtp(formData.mobileNumber);
      setOtpSent(true);
      setField("otp", otpResponse?.data?.otp || "");
      showToast({
        type: "success",
        title: "OTP Sent",
        description: "OTP generated in backend terminal.",
      });
    } catch (error) {
      console.error("Send OTP failed:", error);
      showToast({
        type: "error",
        title: "OTP Failed",
        description: error?.response?.data?.message || "Unable to send OTP.",
      });
    }
  };

  const handleNext = () => {
    const isValid =
      step === 1 ? validateFields(["owner"]) : step === 2 ? validateFields(["pet"]) : true;

    if (isValid) setStep((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields(["owner", "pet", "visit"])) return;

    try {
      await registerOwnerAndPet({
        ...formData,
        state: selectedState?.name || formData.state,
      });

      showToast({
        type: "success",
        title: "Registration Success",
        description: "Registration has been completed successfully.",
      });

      navigate("/clinic/reception");
    } catch (error) {
      console.error("Registration Failed:", error);
      showToast({
        type: "error",
        title: "Operation Failed",
        description: error?.response?.data?.message || "Unable to register pet.",
      });
    }
  };

  return (
    <>
      {showModal && (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl h-[calc(100vh-6rem)] rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/70 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start sm:items-center gap-4 px-6 sm:px-8 py-6 border-b border-slate-100 bg-white rounded-t-3xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  New Pet Registration
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Veterinary Registration Management</p>
              </div>
            </div>

            <div className="bg-white border-b border-slate-100 py-6">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="flex items-center w-full">
                  {steps.map((item, index) => (
                    <div key={item} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-white transition-all duration-300 ${step >= index + 1 ? "bg-orange-500 shadow-md shadow-orange-100" : "bg-slate-200 text-slate-500"}`}>
                          {index + 1}
                        </div>
                        <span className={`mt-2 text-[10px] sm:text-xs font-bold text-center tracking-wide uppercase ${step >= index + 1 ? "text-orange-500" : "text-slate-400"}`}>
                          {item}
                        </span>
                      </div>
                      {index !== steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${step > index + 1 ? "bg-orange-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Owner Verification</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} maxLength="10" placeholder="Enter Mobile Number" className="flex-1 border border-slate-200 rounded-xl p-3 bg-white text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none" />
                        <button type="button" onClick={handleSendOtp} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold transition cursor-pointer border-none shrink-0">
                          Send OTP
                        </button>
                      </div>
                      <ErrorText errors={errors} name="mobileNumber" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">OTP Verification *</label>
                      <input type="text" name="otp" value={formData.otp} onChange={handleChange} maxLength="6" placeholder="Enter 6 Digit OTP" className={inputClass} />
                      <ErrorText errors={errors} name="otp" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visit Type *</label>
                      <select name="visitType" value={formData.visitType} onChange={handleChange} className={inputClass}>
                        <option value="New">New</option>
                        <option value="Follow-up">Follow-up</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner Name *</label>
                      <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" className={inputClass} />
                      <ErrorText errors={errors} name="ownerName" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner ID Type *</label>
                      <select name="ownerIdType" value={formData.ownerIdType} onChange={handleChange} className={inputClass}>
                        <option>Aadhaar Card</option>
                        <option>PAN Card</option>
                        <option>Other Govt ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" className={inputClass} />
                      <ErrorText errors={errors} name="email" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Enter Full Address" className={inputClass} />
                      <ErrorText errors={errors} name="address" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">State *</label>
                      <select name="state" value={formData.state} onChange={handleChange} className={inputClass}>
                        <option value="">Select State</option>
                        {states.map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="state" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">City *</label>
                      <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} className={inputClass}>
                        <option value="">Select City</option>
                        {cities.map((item) => (
                          <option key={`${item.name}-${item.latitude}-${item.longitude}`} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="city" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">District *</label>
                      <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.city} className={inputClass}>
                        <option value="">Select District</option>
                        {formData.city && <option value={formData.city}>{formData.city}</option>}
                      </select>
                      <ErrorText errors={errors} name="district" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pincode *</label>
                      <input name="pincode" value={formData.pincode} onChange={handleChange} type="text" maxLength="6" placeholder="Pincode" className={inputClass} />
                      <ErrorText errors={errors} name="pincode" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Pet Registration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pet Name *</label>
                      <input name="petName" value={formData.petName} onChange={handleChange} type="text" placeholder="Enter Pet Name" className={inputClass} />
                      <ErrorText errors={errors} name="petName" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Species *</label>
                      <select name="species" value={formData.species} onChange={handleChange} className={inputClass}>
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Rabbit</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Breed *</label>
                      <input name="breed" value={formData.breed} onChange={handleChange} type="text" placeholder="Breed" className={inputClass} />
                      <ErrorText errors={errors} name="breed" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    {["dob", "age", "color", "rfid"].map((name) => (
                      <div key={name}>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{name === "dob" ? "Date Of Birth" : name === "rfid" ? "RFID / Microchip Tag No" : name.charAt(0).toUpperCase() + name.slice(1)}</label>
                        <input name={name} value={formData[name]} onChange={handleChange} type={name === "dob" ? "date" : name === "age" ? "number" : "text"} max={name === "dob" ? today : undefined} readOnly={name === "age"} placeholder={name === "rfid" ? "RFID Number" : undefined} className={`${inputClass} ${name === "age" ? "bg-slate-100" : ""}`} />
                        <ErrorText errors={errors} name={name} />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Identification Area</label>
                      <textarea name="identificationArea" value={formData.identificationArea} onChange={handleChange} rows="3" placeholder="Enter Identification Marks" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pet Photo</label>
                      <input name="petPhoto" onChange={handleChange} type="file" accept="image/*" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Is Sterilized?</label>
                      <select name="sterilized" value={formData.sterilized} onChange={handleChange} className={inputClass}>
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Pet History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {[
                      ["vaccineName", "Vaccine Name", "text"],
                      ["vaccinationDate", "Vaccination Date", "date"],
                      ["batchNumber", "Batch Number", "text"],
                      ["clinicName", "Clinic Name", "text"],
                      ["dewormingProduct", "Deworming Product", "text"],
                      ["dewormingDate", "Deworming Date", "date"],
                      ["dose", "Dose", "text"],
                      ["surgicalProcedure", "Surgical Procedure", "text"],
                      ["surgeryDate", "Surgery Date", "date"],
                      ["hospital", "Hospital", "text"],
                      ["condition", "Condition", "text"],
                      ["treatment", "Treatment", "text"],
                      ["treatmentDate", "Treatment Date", "date"],
                    ].map(([name, label, type]) => (
                      <div key={name}>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                        <input name={name} value={formData[name]} onChange={handleChange} type={type} placeholder={type === "text" ? label : undefined} className={inputClass} />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Known Allergies</label>
                      <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="3" placeholder="Known Allergies" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Medications</label>
                      <textarea name="medications" value={formData.medications} onChange={handleChange} rows="3" placeholder="Current Medications" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Reason For Visit</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Reason *</label>
                      <select name="primaryReason" value={formData.primaryReason} onChange={handleChange} className={inputClass}>
                        <option value="">Select Reason</option>
                        {reasonOptions.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="primaryReason" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Token / Queue Number</label>
                      <input value="Auto generated by backend" readOnly className="w-full border rounded-xl p-3 bg-slate-100" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specific Complaint In Brief *</label>
                      <textarea name="complaint" value={formData.complaint} onChange={handleChange} rows="3" placeholder="Enter complaint details" className={inputClass} />
                      <ErrorText errors={errors} name="complaint" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Appointment Date *</label>
                      <input name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} type="date" className={inputClass} />
                      <ErrorText errors={errors} name="appointmentDate" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Appointment Time *</label>
                      <input name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} type="time" className={inputClass} />
                      <ErrorText errors={errors} name="appointmentTime" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Doctor *</label>
                      <select name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange} className={inputClass}>
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={getDoctorOptionValue(doctor)} value={getDoctorName(doctor)}>
                            {getDoctorName(doctor) || "Doctor"}
                          </option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="assignedDoctor" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 sm:p-5 flex justify-between gap-3">
              <button disabled={step === 1} onClick={() => setStep(step - 1)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold transition cursor-pointer border-none disabled:opacity-50">
                Back
              </button>
              {step < steps.length ? (
                <button onClick={handleNext} className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md shadow-orange-150 transition cursor-pointer border-none">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md shadow-emerald-150 transition cursor-pointer border-none">
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
