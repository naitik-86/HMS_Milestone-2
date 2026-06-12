export default function ObservationForm() {
  return (
    <div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Observation
      </h2>

      <div className="grid gap-6">

        <div>
          <label className="block mb-2 font-medium">
            General Demeanour
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Alert</option>
            <option>Depressed</option>
            <option>Anxious</option>
            <option>Unconscious</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Gait And Posture
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Visible Lesions / Abnormality
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Eyes Abnormality
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Nose Abnormality
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Ear Abnormality
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Skin Condition / Coat
          </label>

          <textarea
            rows="3"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Staff Notes
          </label>

          <textarea
            rows="5"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

      </div>

    </div>
  );
}