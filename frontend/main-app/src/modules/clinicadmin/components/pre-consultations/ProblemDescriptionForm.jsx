export default function ProblemDescriptionForm() {
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
            rows="5"
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
            <option>Vomiting</option>
            <option>Diarrhea</option>
            <option>Lethargy</option>
            <option>Coughing</option>
            <option>Sneezing</option>
            <option>Discharge</option>
            <option>Skin Lesion</option>
            <option>Lameness</option>
            <option>Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block mb-2 font-medium">
            Severity
          </label>

          <select
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
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>
        </div>

      </div>

    </div>
  );
}