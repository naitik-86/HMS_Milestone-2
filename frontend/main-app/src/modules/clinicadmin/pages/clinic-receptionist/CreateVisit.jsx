import { useState } from "react";
import {
  addPet,
  createVisit,
  searchCustomer,
  updateOwner,
  updatePet,
} from "../../api/receptionApi";

const today = new Date().toISOString().split("T")[0];

const emptyPetForm = {
  petName: "",
  species: "Dog",
  breed: "",
  gender: "Male",
  dob: "",
  age: "",
  color: "",
  rfid: "",
  identificationArea: "",
  sterilized: "No",
};

const emptyVisitForm = {
  petId: "",
  ownerId: "",
  visitType: "CONSULTATION",
  priority: "NORMAL",
  chiefComplaint: "",
  notes: "",
};

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

const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : "");
const normalizeSpecies = (species) =>
  species ? species.charAt(0).toUpperCase() + species.slice(1).toLowerCase() : "Dog";

function ErrorText({ errors, name }) {
  return errors[name] ? <p className="mt-1 text-sm text-red-500">{errors[name]}</p> : null;
}

export default function CreateVisitForm() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);
  const [ownerForm, setOwnerForm] = useState({});
  const [petForm, setPetForm] = useState(emptyPetForm);
  const [visitForm, setVisitForm] = useState(emptyVisitForm);
  const [mode, setMode] = useState("edit");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedPet = pets.find((pet) => pet._id === visitForm.petId);

  const setError = (name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const fillOwner = (customer) => {
    setOwner(customer);
    setPets(customer.pets || []);
    setOwnerForm({
      ownerName: customer.ownerName || "",
      visitType: customer.visitType || "Follow-up",
      ownerIdType: customer.ownerIdType || "Aadhaar Card",
      email: customer.email || "",
      address: customer.address || "",
      state: customer.state || "",
      city: customer.city || "",
      district: customer.district || "",
      pincode: customer.pincode || "",
    });

    const firstPet = customer.pets?.[0];
    setVisitForm((prev) => ({
      ...prev,
      ownerId: customer._id,
      petId: firstPet?._id || "",
    }));

    if (firstPet) {
      setPetForm({
        petName: firstPet.petName || firstPet.name || "",
        species: normalizeSpecies(firstPet.species),
        breed: firstPet.breed || "",
        gender: firstPet.gender || "Male",
        dob: formatDate(firstPet.dob),
        age: firstPet.age || "",
        color: firstPet.color || "",
        rfid: firstPet.rfid || firstPet.rfidTag || "",
        identificationArea: firstPet.identificationArea || firstPet.identificationMarks || "",
        sterilized: firstPet.sterilized || firstPet.isSterilised ? "Yes" : "No",
      });
    } else {
      setMode("add");
      setPetForm(emptyPetForm);
    }
  };

  const handleSearch = async () => {
    if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
      setError("mobileNumber", "Enter a valid registered mobile number.");
      return;
    }

    try {
      setSearching(true);
      setErrors({});
      const response = await searchCustomer(mobileNumber.trim());
      const customer = response?.data;

      if (!customer) {
        setOwner(null);
        setPets([]);
        setPetForm(emptyPetForm);
        setVisitForm(emptyVisitForm);
        setError("mobileNumber", "No registered owner found with this number.");
        return;
      }

      fillOwner(customer);
    } catch (error) {
      console.error(error);
      setError("mobileNumber", "Error searching mobile number.");
    } finally {
      setSearching(false);
    }
  };

  const handleOwnerChange = (event) => {
    const { name, value } = event.target;
    setOwnerForm((prev) => ({ ...prev, [name]: value }));
    setError(name, "");
  };

  const handlePetChange = (event) => {
    const { name, value } = event.target;

    if (name === "dob") {
      if (value && value > today) {
        setPetForm((prev) => ({ ...prev, dob: value, age: "" }));
        setError("dob", "DOB cannot be in future.");
        return;
      }

      setPetForm((prev) => ({ ...prev, dob: value, age: calculateAge(value) }));
      setError("dob", "");
      return;
    }

    setPetForm((prev) => ({ ...prev, [name]: value }));
    setError(name, "");
  };

  const handleVisitChange = (event) => {
    const { name, value } = event.target;
    setVisitForm((prev) => ({ ...prev, [name]: value }));
    setError(name, "");
  };

  const handlePetSelect = (event) => {
    const pet = pets.find((item) => item._id === event.target.value);

    setMode("edit");
    setVisitForm((prev) => ({
      ...prev,
      petId: event.target.value,
      ownerId: owner?._id || "",
    }));

    if (pet) {
      setPetForm({
        petName: pet.petName || pet.name || "",
        species: normalizeSpecies(pet.species),
        breed: pet.breed || "",
        gender: pet.gender || "Male",
        dob: formatDate(pet.dob),
        age: pet.age || "",
        color: pet.color || "",
        rfid: pet.rfid || pet.rfidTag || "",
        identificationArea: pet.identificationArea || pet.identificationMarks || "",
        sterilized: pet.sterilized || pet.isSterilised ? "Yes" : "No",
      });
    }
  };

  const validate = (includeVisit = true) => {
    const nextErrors = {};
    const required = (name, value, message) => {
      if (!String(value || "").trim()) nextErrors[name] = message;
    };

    required("ownerName", ownerForm.ownerName, "Owner name is required.");
    required("address", ownerForm.address, "Address is required.");
    required("petName", petForm.petName, "Pet name is required.");
    required("breed", petForm.breed, "Breed is required.");
    if (includeVisit) {
      required("chiefComplaint", visitForm.chiefComplaint, "Chief complaint is required.");
    }

    if (!owner?._id) nextErrors.mobileNumber = "Search registered owner first.";
    if (mode === "edit" && !visitForm.petId) nextErrors.petId = "Select pet.";
    if (petForm.dob && petForm.dob > today) nextErrors.dob = "DOB cannot be in future.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const refreshOwner = (updatedOwner) => {
    fillOwner(updatedOwner);
  };

  const handleSaveOwner = async () => {
    if (!owner?._id) return;

    const response = await updateOwner(owner._id, ownerForm);
    refreshOwner(response.data);
    alert("Owner updated successfully");
  };

  const handleSavePet = async () => {
    if (!validate(false)) return null;

    const payload = {
      ...petForm,
      sterilized: petForm.sterilized === "Yes",
    };

    if (mode === "add") {
      const response = await addPet(owner._id, payload);
      const addedPet = response.data?.pets?.[response.data.pets.length - 1];
      refreshOwner(response.data);
      setMode("edit");
      setVisitForm((prev) => ({
        ...prev,
        ownerId: owner._id,
        petId: addedPet?._id || prev.petId,
      }));
      alert("New pet added successfully");
      return addedPet?._id;
    }

    const response = await updatePet(owner._id, visitForm.petId, payload);
    refreshOwner(response.data);
    alert("Pet updated successfully");
    return visitForm.petId;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate(true)) return;

    try {
      setSaving(true);
      await updateOwner(owner._id, ownerForm);
      const petId = mode === "add" ? await handleSavePet() : visitForm.petId;

      await createVisit({
        ...visitForm,
        ownerId: owner._id,
        petId,
      });

      setVisitForm({
        ...emptyVisitForm,
        ownerId: owner._id,
        petId,
      });
      alert("Visit created successfully");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error creating visit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl shadow-slate-200/80 border border-slate-200/70">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Create Visit</h2>
        <p className="mt-2 text-sm text-slate-400">
          Search an already registered owner, edit details if needed, add/edit pet, then create visit.
        </p>

        <div className="mt-6 mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Registered Mobile Number</label>
          <div className="mt-1 flex gap-3">
            <input
              type="text"
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              maxLength="10"
              placeholder="Enter 10-digit mobile number"
              className="w-full border border-slate-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none text-slate-700 font-medium bg-white"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="rounded-xl bg-slate-800 hover:bg-slate-900 px-6 py-2.5 font-semibold text-white transition cursor-pointer disabled:opacity-60 shrink-0"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
          <ErrorText errors={errors} name="mobileNumber" />
        </div>

        {owner && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="rounded-3xl border border-slate-200/50 bg-slate-50/30 p-6 shadow-md shadow-slate-100/80">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Owner Details</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Owner ID: {owner._id}</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleSaveOwner} 
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 font-semibold text-white transition hover:shadow-md cursor-pointer border-none text-sm"
                >
                  Save Owner Edit
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["ownerName", "Owner Name *"],
                  ["email", "Email"],
                  ["address", "Address *"],
                  ["state", "State"],
                  ["city", "City"],
                  ["district", "District"],
                  ["pincode", "Pincode"],
                ].map(([name, label]) => (
                  <div key={name} className={name === "address" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                    <input
                      name={name}
                      value={ownerForm[name] || ""}
                      onChange={handleOwnerChange}
                      className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white"
                    />
                    <ErrorText errors={errors} name={name} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/50 p-6 bg-white shadow-md shadow-slate-100/80">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Pet Details</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {mode === "add" ? "Adding new pet for this owner" : "Editing selected pet"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("add");
                    setPetForm(emptyPetForm);
                    setVisitForm((prev) => ({ ...prev, petId: "" }));
                  }}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:shadow-md cursor-pointer border-none text-sm"
                >
                  + Add New Pet
                </button>
              </div>

              {pets.length > 0 && mode === "edit" && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Existing Pet</label>
                  <select 
                    value={visitForm.petId} 
                    onChange={handlePetSelect} 
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white cursor-pointer"
                  >
                    {pets.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {pet.petName || pet.name || "Unnamed Pet"} ({pet.uniquePetId || pet._id})
                      </option>
                    ))}
                  </select>
                  <ErrorText errors={errors} name="petId" />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pet Name *</label>
                  <input name="petName" value={petForm.petName} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                  <ErrorText errors={errors} name="petName" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Species *</label>
                  <select name="species" value={petForm.species} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white cursor-pointer">
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Breed *</label>
                  <input name="breed" value={petForm.breed} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                  <ErrorText errors={errors} name="breed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                  <select name="gender" value={petForm.gender} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white cursor-pointer">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">DOB</label>
                  <input name="dob" type="date" max={today} value={petForm.dob} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                  <ErrorText errors={errors} name="dob" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                  <input name="age" value={petForm.age} readOnly className="w-full border border-slate-200 rounded-xl p-3 text-slate-500 font-mono font-medium outline-none bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Color</label>
                  <input name="color" value={petForm.color} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">RFID / Microchip</label>
                  <input name="rfid" value={petForm.rfid} onChange={handlePetChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Identification Area</label>
                  <textarea name="identificationArea" value={petForm.identificationArea} onChange={handlePetChange} rows="2" className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleSavePet} 
                className="mt-6 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 font-semibold text-white transition hover:shadow-md cursor-pointer border-none text-sm"
              >
                {mode === "add" ? "Save New Pet" : "Save Pet Edit"}
              </button>
            </section>

            <section className="rounded-3xl border border-slate-200/50 p-6 bg-slate-50/30 shadow-md shadow-slate-100/80">
              <h3 className="mb-6 text-lg font-bold text-slate-800">Visit Details</h3>
              {selectedPet && (
                <div className="mb-4 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600">
                  Creating visit for: <strong className="text-slate-800">{selectedPet.petName || selectedPet.name}</strong>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visit Type</label>
                  <select name="visitType" value={visitForm.visitType} onChange={handleVisitChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white cursor-pointer">
                    <option value="CONSULTATION">Consultation</option>
                    <option value="VACCINATION">Vaccination</option>
                    <option value="GROOMING">Grooming</option>
                    <option value="SURGERY">Surgery</option>
                    <option value="KENNEL">Kennel</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select name="priority" value={visitForm.priority} onChange={handleVisitChange} className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white cursor-pointer">
                    <option value="NORMAL">Normal</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chief Complaint *</label>
                  <textarea name="chiefComplaint" value={visitForm.chiefComplaint} onChange={handleVisitChange} rows="3" className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                  <ErrorText errors={errors} name="chiefComplaint" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Notes</label>
                  <textarea name="notes" value={visitForm.notes} onChange={handleVisitChange} rows="3" className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white" />
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={saving} 
              className="w-full rounded-xl bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-3.5 font-semibold text-white transition hover:shadow-lg cursor-pointer border-none text-base disabled:opacity-60"
            >
              {saving ? "Creating Visit..." : "Create Visit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
