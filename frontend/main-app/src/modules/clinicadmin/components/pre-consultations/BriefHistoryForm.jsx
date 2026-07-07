export default function BriefHistoryForm({ formData, setFormData }) {
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
        Brief History Of Problem
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Duration Of Illness Value */}
        <div>
          <label className="block mb-2 font-medium">
            Duration Of Illness
          </label>

          <input
            type="number"
            name="durationValue"
            value={formData.durationValue}
            onChange={handleChange}
            placeholder="Enter Duration"
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

        {/* Duration Unit */}
        <div>
          <label className="block mb-2 font-medium">
            Duration Unit
          </label>

          <select
            name="durationUnit"
            value={formData.durationUnit}
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
            <option value="">Select Unit</option>
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
        </div>

        {/* Onset */}
        <div>
          <label className="block mb-2 font-medium">
            Onset
          </label>

          <select
            name="onset"
            value={formData.onset}
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
            <option value="">Select Onset</option>
            <option value="Sudden">Sudden</option>
            <option value="Gradual">Gradual</option>
          </select>
        </div>

        {/* Progression */}
        <div>
          <label className="block mb-2 font-medium">
            Progression
          </label>

          <select
            name="progression"
            value={formData.progression}
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
            <option value="">Select Progression</option>
            <option value="Improving">Improving</option>
            <option value="Worsening">Worsening</option>
            <option value="Stable">Stable</option>
          </select>
        </div>

        {/* Recent Travel */}
        <div>
          <label className="block mb-2 font-medium">
            Recent Travel
          </label>

          <select
            name="recentTravel"
            value={String(formData.recentTravel)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recentTravel: e.target.value === "true",
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
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* Animal Contact */}
        <div>
          <label className="block mb-2 font-medium">
            Any Contact With Animal
          </label>

          <select
            name="animalContact"
            value={String(formData.animalContact)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                animalContact: e.target.value === "true",
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
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* Previous Similar Episodes */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            Previous Similar Episodes
          </label>

          <textarea
            rows="4"
            name="previousEpisodesDescription"
            value={formData.previousEpisodesDescription}
            onChange={handleChange}
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