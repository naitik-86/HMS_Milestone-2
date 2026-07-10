import React, { useState } from "react";
import { createVisit } from "../../api/receptionApi"

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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