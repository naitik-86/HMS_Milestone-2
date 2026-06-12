export default function ProblemDescriptionForm() {
  return (
    <div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Problem Description
      </h2>

      <div className="grid gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Primary Complaint
          </label>

          <textarea
            rows="5"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Associated Symptoms
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
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

        <div>
          <label className="block mb-2 font-medium">
            Severity
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>
        </div>

      </div>

    </div>
  );
}