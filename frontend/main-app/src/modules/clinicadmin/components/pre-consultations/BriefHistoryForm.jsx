export default function BriefHistoryForm() {
  return (
    <div>

      <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">
        Brief History Of Problem
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Duration Of Illness */}
        <div>
          <label className="block mb-2 font-medium">
            Duration Of Illness
          </label>

          <input
            type="text"
            placeholder="Days / Weeks / Months / Years"
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
          />
        </div>

        {/* Onset */}
        <div>
          <label className="block mb-2 font-medium">
            Onset
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
            <option>Sudden</option>
            <option>Gradual</option>
          </select>
        </div>

        {/* Progression */}
        <div>
          <label className="block mb-2 font-medium">
            Progression
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
            <option>Improving</option>
            <option>Worsening</option>
            <option>Stable</option>
          </select>
        </div>

        {/* Recent Travel */}
        <div>
          <label className="block mb-2 font-medium">
            Recent Travel
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
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Animal Contact */}
        <div>
          <label className="block mb-2 font-medium">
            Any Contact With Animal
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
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Previous Similar Episodes */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            Previous Similar Episodes
          </label>

          <textarea
            rows="4"
            placeholder="Describe previous similar episodes..."
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

      </div>

    </div>
  );
}