export default function ObservationForm({ formData, setFormData }) {

  // ✅ Bug 3 Fix: Only allow letters, spaces, commas, periods, hyphens
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/[^a-zA-Z\s,.\-\/()]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: cleaned,
    }));
  };

  // Dropdowns still use plain handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">
        Observation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* General Demeanour — dropdown, no text restriction needed */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            General Demeanour
          </label>
          <select
            name="generalDemeanour"
            value={formData.generalDemeanour}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select Demeanour</option>
            <option value="Alert">Alert</option>
            <option value="Depressed">Depressed</option>
            <option value="Anxious">Anxious</option>
            <option value="Unconscious">Unconscious</option>
          </select>
        </div>

        {/* Gait And Posture */}
        <div>
          <label className="block mb-2 font-medium">
            Gait And Posture
          </label>
          <textarea
            rows={3}
            name="gaitAndPosture"
            value={formData.gaitAndPosture}
            onChange={handleTextChange}
            placeholder="Enter Gait & Posture (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Visible Lesions */}
        <div>
          <label className="block mb-2 font-medium">
            Visible Lesions / Abnormality
          </label>
          <textarea
            rows={3}
            name="visibleLesions"
            value={formData.visibleLesions}
            onChange={handleTextChange}
            placeholder="Enter Visible Lesions (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Eyes */}
        <div>
          <label className="block mb-2 font-medium">
            Eyes Abnormality
          </label>
          <textarea
            rows={3}
            name="eyesAbnormality"
            value={formData.eyesAbnormality}
            onChange={handleTextChange}
            placeholder="Enter Eye Observation (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Nose */}
        <div>
          <label className="block mb-2 font-medium">
            Nose Abnormality
          </label>
          <textarea
            rows={3}
            name="noseAbnormality"
            value={formData.noseAbnormality}
            onChange={handleTextChange}
            placeholder="Enter Nose Observation (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Ear */}
        <div>
          <label className="block mb-2 font-medium">
            Ear Abnormality
          </label>
          <textarea
            rows={3}
            name="earAbnormality"
            value={formData.earAbnormality}
            onChange={handleTextChange}
            placeholder="Enter Ear Observation (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Skin */}
        <div>
          <label className="block mb-2 font-medium">
            Skin Condition / Coat
          </label>
          <textarea
            rows={3}
            name="skinCondition"
            value={formData.skinCondition}
            onChange={handleTextChange}
            placeholder="Enter Skin Condition (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

        {/* Staff Notes */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium">
            Staff Notes
          </label>
          <textarea
            rows={5}
            name="staffNotes"
            value={formData.staffNotes}
            onChange={handleTextChange}
            placeholder="Enter Staff Notes (letters only)"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Letters, spaces and basic punctuation only.</p>
        </div>

      </div>
    </div>
  );
}
