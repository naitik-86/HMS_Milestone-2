export default function ObservationForm() {
  return (
    <div>

     <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">
  Observation
</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

       <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            General Demeanour
          </label>

          <select className="
w-full
border border-slate-200
rounded-2xl
px-4 py-3
text-sm md:text-base
outline-none
focus:border-orange-500
focus:ring-4
focus:ring-orange-100
resize-none
">
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
resize-none
"
          />
        </div>

       <div className="lg:col-span-2">
  <label className="block mb-2 font-medium">
    Staff Notes
  </label>

          <textarea
            rows="5"
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
resize-none
"
          />
        </div>

      </div>

    </div>
  );
}