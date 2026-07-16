import React, { useState } from "react";
import { createVisit, searchCustomer } from "../../api/receptionApi"

const CreateVisitForm = () => {

  const initalData = {
    petId: "",
    ownerId: "",
    visitType: "CONSULTATION",
    priority: "NORMAL",
    chiefComplaint: "",
    notes: ""
  }
  const [formData, setFormData] = useState(initalData);
  const [mobileNumber, setMobileNumber] = useState("");
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePetSelect = (e) => {
    setFormData({
      ...formData,
      petId: e.target.value,
      ownerId: owner?._id || ""
    });
  };

  const handleSearch = async () => {
    if (!mobileNumber.trim()) {
      alert("Please enter phone number");
      return;
    }

    try {
      setSearching(true);
      const res = await searchCustomer(mobileNumber.trim());
      const customer = res?.data;

      if (!customer) {
        setOwner(null);
        setPets([]);
        setFormData({ ...formData, petId: "", ownerId: "" });
        alert("No owner found with this phone number");
        return;
      }

      setOwner(customer);
      setPets(customer.pets || []);
      setFormData({
        ...formData,
        ownerId: customer._id,
        petId: customer.pets?.[0]?._id || ""
      });
    } catch (err) {
      console.error(err);
      alert("Error searching phone number");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createVisit(formData);
      setFormData(initalData)
      alert("Visit Created Successfully ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error creating visit ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Visit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Phone Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Phone Number
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter owner phone number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-60"
              >
                {searching ? "Searching" : "Search"}
              </button>
            </div>
          </div>

          {owner && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
              <p className="font-semibold text-gray-800">{owner.ownerName}</p>
              <p className="text-gray-600">Owner ID: {owner._id}</p>
            </div>
          )}

          {pets.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Pet
              </label>
              <select
                value={formData.petId}
                onChange={handlePetSelect}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.petName || pet.name || "Unnamed Pet"} - {pet._id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pet ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pet ID
            </label>
            <input
              type="text"
              name="petId"
              value={formData.petId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Owner ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner ID
            </label>
            <input
              type="text"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Visit Type + Priority */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visit Type
              </label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
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
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chief Complaint
            </label>
            <textarea
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Visit
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateVisitForm;
