export default function BriefHistoryForm() {
  return (
    <div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Brief History Of Problem
      </h2>

      <div className="grid gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Duration Of Illness
          </label>

          <input
            type="text"
            placeholder="Days / Weeks / Years"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Onset
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Sudden</option>
            <option>Gradual</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Progression
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Improving</option>
            <option>Worsening</option>
            <option>Stable</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Previous Similar Episodes
          </label>

          <textarea
            rows="4"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Recent Travel
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Any Contact With Animal
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

      </div>

    </div>
  );
}