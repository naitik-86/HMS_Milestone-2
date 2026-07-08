export default function ProblemDescriptionForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">
        Problem Description
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Primary Complaint */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            Primary Complaint
          </label>

          <textarea
            rows={5}
            name="primaryComplaint"
            value={formData.primaryComplaint}
            onChange={handleChange}
            placeholder="Enter primary complaint..."
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              resize-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Associated Symptoms */}
        <div>
          <label className="block mb-2 font-medium">
            Associated Symptoms
          </label>

          <select
            name="associatedSymptoms"
            value={formData.associatedSymptoms[0] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                associatedSymptoms: e.target.value
                  ? [e.target.value]
                  : [],
              }))
            }
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          >
            <option value="">Select Symptom</option>
            <option value="Vomiting">Vomiting</option>
            <option value="Diarrhea">Diarrhea</option>
            <option value="Lethargy">Lethargy</option>
            <option value="Coughing">Coughing</option>
            <option value="Sneezing">Sneezing</option>
            <option value="Discharge">Discharge</option>
            <option value="Skin Lesion">Skin Lesion</option>
            <option value="Lameness">Lameness</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block mb-2 font-medium">
            Severity
          </label>

          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          >
            <option value="">Select Severity</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

      </div>
    </div>
  );
}