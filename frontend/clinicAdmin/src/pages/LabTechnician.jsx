import React, { useState } from 'react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const labTests = ['Hematology', 'Biochemistry', 'Micro-Biology', 'Cytology', 'Histopathology', 'Radiology', 'PCR'];
const labShifts = ['Morning', 'Afternoon', 'Evening', '24 Hours'];

const labStaff = [
  { id: 'LAB001', name: 'Rahul Mehta',  initials: 'RM', color: '#22C55E', qualification: 'B.Sc. MLT',           experience: 5, specializedTests: ['Hematology', 'Biochemistry'],    shift: 'Morning',   status: 'Active' },
  { id: 'LAB002', name: 'Pooja Singh',  initials: 'PS', color: '#06B6D4', qualification: 'Diploma in MLT',      experience: 3, specializedTests: ['Cytology', 'PCR'],               shift: 'Afternoon', status: 'Active' },
  { id: 'LAB003', name: 'Kiran Bhat',   initials: 'KB', color: '#F59E0B', qualification: 'M.Sc. Microbiology',  experience: 7, specializedTests: ['Micro-Biology', 'Histopathology'], shift: 'Morning',  status: 'Active' },
  { id: 'LAB004', name: 'Sneha Reddy',  initials: 'SR', color: '#A855F7', qualification: 'B.Sc. MLT',           experience: 2, specializedTests: ['Radiology'],                     shift: 'Evening',   status: 'Inactive' },
];

const shiftIcons = { Morning: '🌅', Afternoon: '☀️', Evening: '🌙', '24 Hours': '🔄' };

/* ─────────────────────────────────────────────
   VIEW DETAILS MODAL
───────────────────────────────────────────── */
function ViewModal({ staff, onClose, onEdit }) {
  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: '1500px', maxWidth: '98vw', height: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-['Syne',sans-serif] text-2xl font-bold text-[#1A1D2E]">View Lab Technician</h2>
            <p className="text-sm text-gray-400 mt-0.5">Lab technician profile details</p>
          </div>
          <button
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer text-base"
            onClick={onClose}
          >✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Profile Hero */}
          <div className="flex items-center gap-5 mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
              style={{ background: `${staff.color}22`, border: `2.5px solid ${staff.color}55`, color: staff.color }}
            >
              {staff.initials}
            </div>
            <div className="flex-1">
              <div className="font-['Syne',sans-serif] text-xl font-bold text-[#1A1D2E]">{staff.name}</div>
              <div className="text-sm text-gray-400 mt-0.5">{staff.id} · Lab Technician</div>
            </div>
            <span className={staff.status === 'Active'
              ? 'bg-green-50 text-green-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100'
              : 'bg-red-50 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100'
            }>{staff.status}</span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Credentials */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Credentials</div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Qualification</div>
                  <div className="text-sm font-semibold text-[#1A1D2E]">{staff.qualification}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Experience</div>
                  <div className="text-sm font-semibold text-[#1A1D2E]">{staff.experience} years</div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Schedule</div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Shift</div>
                  <div className="text-sm font-semibold text-green-500">{shiftIcons[staff.shift]} {staff.shift}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Employee ID</div>
                  <div className="text-sm font-semibold text-[#1A1D2E]">{staff.id}</div>
                </div>
              </div>
            </div>

            {/* Tests */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Specialized Tests</div>
              <div className="flex flex-wrap gap-2">
                {staff.specializedTests.map(t => (
                  <span key={t} className="bg-green-50 text-green-500 text-xs font-semibold px-3 py-1 rounded-lg border border-green-100">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-100 shrink-0">
          <button
            className="h-10 px-6 border border-gray-200 rounded-xl bg-white text-gray-500 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >Close</button>
          <button
            className="h-10 px-7 bg-gradient-to-br from-[#E8630A] to-[#c4500a] text-white border-none rounded-xl font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(232,99,10,.3)] hover:opacity-90 transition-opacity"
            onClick={() => { onClose(); onEdit(staff); }}
          >✏️ Edit Details</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL FORM  (matches Add Clinic reference UI)
───────────────────────────────────────────── */
function LabFormModal({ onClose, initialData = null }) {
  const isEdit = !!initialData;
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState(initialData?.specializedTests || []);
  const [shift, setShift] = useState(initialData?.shift || '');
  const [certFile, setCertFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [formData, setFormData] = useState({
    qualification: initialData?.qualification || '',
    diploma: '',
    licenseNumber: '',
    experience: initialData?.experience || '',
    prevInstitution: '',
    dateOfJoining: '',
    shiftStart: '',
    shiftEnd: '',
    weeklyDays: '',
    onCall: '',
    instruments: '',
    lims: '',
    status: initialData?.status || '',
    department: '',
    supervisor: '',
    employeeId: initialData?.id || '',
    notes: '',
  });

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  const steps = [
    { num: 1, label: 'Lab Qualifications' },
    { num: 2, label: 'Tests & Schedule' },
    { num: 3, label: 'Additional Info' },
  ];

  const toggleTest = (t) =>
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const inputCls = "h-[46px] w-full border border-gray-200 rounded-xl px-4 text-sm font-['Plus_Jakarta_Sans',sans-serif] text-[#1A1D2E] bg-white outline-none transition placeholder-gray-300 focus:border-[#E8630A] focus:shadow-[0_0_0_3px_rgba(232,99,10,.1)]";
  const selectCls = "h-[46px] w-full border border-gray-200 rounded-xl px-4 pr-9 text-sm font-['Plus_Jakarta_Sans',sans-serif] text-[#1A1D2E] bg-white outline-none transition appearance-none cursor-pointer focus:border-[#E8630A] focus:shadow-[0_0_0_3px_rgba(232,99,10,.1)]";
  const labelCls = "text-[11px] font-bold text-gray-400 uppercase tracking-[.06em] mb-1 block";
  const sectionHeadCls = "text-sm font-bold text-[#1A1D2E] mb-4 mt-6 pb-2 border-b border-gray-100 font-['Syne',sans-serif]";

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: '1500px', maxWidth: '98vw', height: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-['Syne',sans-serif] text-2xl font-bold text-[#1A1D2E]">
              {isEdit ? 'Edit Lab Technician Details' : 'Add Lab Technician Details'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEdit ? `Editing profile for ${initialData.name}` : 'Register a new lab technician in the system.'}
            </p>
          </div>
          <button
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer text-base"
            onClick={onClose}
          >✕</button>
        </div>

        {/* ── STEP PROGRESS BAR (like Add Clinic top bar) ── */}
        <div className="px-8 pt-5 pb-0 shrink-0 border-b border-gray-100">
          {/* Numbered stepper */}
          <div className="flex items-center mb-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all cursor-pointer
                      ${step === s.num ? 'bg-[#E8630A] text-white' : step > s.num ? 'bg-[#22C55E] text-white' : 'bg-orange-50 text-[#E8630A] border-2 border-orange-200'}`}
                    onClick={() => step > s.num && setStep(s.num)}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <div
                    className={`text-sm font-semibold font-['Plus_Jakarta_Sans',sans-serif] cursor-pointer
                      ${step === s.num ? 'text-[#E8630A]' : step > s.num ? 'text-[#22C55E]' : 'text-gray-400'}`}
                    onClick={() => step > s.num && setStep(s.num)}
                  >
                    {s.label}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 rounded-full bg-orange-100 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#E8630A] rounded-full transition-all duration-500"
                      style={{ width: step > i + 1 ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tab buttons (like the pill tabs in Add Clinic) */}
          <div className="flex gap-2 mb-[-1px]">
            {steps.map(s => (
              <button
                key={s.num}
                className={`px-5 h-9 rounded-t-xl text-sm font-semibold font-['Plus_Jakarta_Sans',sans-serif] transition-all cursor-pointer border border-b-0
                  ${step === s.num
                    ? 'bg-[#E8630A] text-white border-[#E8630A]'
                    : step > s.num
                      ? 'bg-green-50 text-green-500 border-green-100 hover:bg-green-100'
                      : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}`}
                onClick={() => (step > s.num || step === s.num) && setStep(s.num)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50/40">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-500 text-[11px] font-bold px-3 py-1 rounded-full mb-4 tracking-wide border border-green-100">
                  Only Visible When Role is Lab Technician
                </div>
                <h3 className="font-['Syne',sans-serif] text-lg font-bold text-[#1A1D2E] mb-1">Lab Qualifications</h3>
                <p className="text-xs text-gray-400 mb-6">Section 3 → 3.1 Academic & Professional Credentials</p>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div><label className={labelCls}>Qualification / Degree <span className="text-[#E8630A]">*</span></label>
                    <input className={inputCls} placeholder="e.g. B.Sc. MLT, M.Sc. Microbiology" value={formData.qualification} onChange={e => set('qualification', e.target.value)} /></div>
                  <div><label className={labelCls}>Diploma / Short Course</label>
                    <input className={inputCls} placeholder="e.g. Diploma in Lab Technology" value={formData.diploma} onChange={e => set('diploma', e.target.value)} /></div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div><label className={labelCls}>Registration / License Number</label>
                    <input className={inputCls} placeholder="e.g. MLT-2021-04567" value={formData.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} /></div>
                  <div><label className={labelCls}>Years of Lab Experience <span className="text-[#E8630A]">*</span></label>
                    <input className={inputCls} type="number" min="0" placeholder="e.g. 5" value={formData.experience} onChange={e => set('experience', e.target.value)} /></div>
                </div>

                <div className={sectionHeadCls}>Certificate Upload</div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelCls}>Degree / Diploma Certificate <span className="text-[#E8630A]">*</span></label>
                    <div className="border-[1.5px] border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer bg-white hover:border-[#E8630A] hover:bg-orange-50/30 transition relative overflow-hidden">
                      <input type="file" accept=".pdf,image/*" onChange={e => setCertFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="text-2xl mb-2">📄</div>
                      <div className="text-sm font-semibold text-gray-500">{certFile ? certFile.name : 'Click to upload certificate'}</div>
                      <div className="text-xs text-gray-300 mt-1">PDF, JPG, PNG · up to 5 MB</div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Government ID Proof</label>
                    <div className="border-[1.5px] border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer bg-white hover:border-[#E8630A] hover:bg-orange-50/30 transition relative overflow-hidden">
                      <input type="file" accept=".pdf,image/*" onChange={e => setIdFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="text-2xl mb-2">🪪</div>
                      <div className="text-sm font-semibold text-gray-500">{idFile ? idFile.name : 'Click to upload ID proof'}</div>
                      <div className="text-xs text-gray-300 mt-1">Aadhaar, PAN, Passport · up to 5 MB</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div><label className={labelCls}>Previous Institution / Hospital</label>
                    <input className={inputCls} placeholder="e.g. Apollo Hospitals, Delhi" value={formData.prevInstitution} onChange={e => set('prevInstitution', e.target.value)} /></div>
                  <div><label className={labelCls}>Date of Joining</label>
                    <input className={inputCls} type="date" value={formData.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} /></div>
                </div>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-500 text-[11px] font-bold px-3 py-1 rounded-full mb-4 tracking-wide border border-green-100">
                  Only Visible When Role is Lab Technician
                </div>
                <h3 className="font-['Syne',sans-serif] text-lg font-bold text-[#1A1D2E] mb-1">Tests Handled & Schedule</h3>
                <p className="text-xs text-gray-400 mb-6">Section 3 → 3.2 Specialized Tests & Availability</p>

                <div className={sectionHeadCls}>Specialized Tests Handled</div>

                <div className="mb-6">
                  <label className={labelCls}>Select Tests (multi-select) <span className="text-[#E8630A]">*</span></label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {labTests.map(t => (
                      <label key={t} className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-xs font-semibold border-[1.5px] bg-white transition select-none
                        ${selectedTests.includes(t) ? 'border-green-400 bg-green-50 text-green-500' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                        <input type="checkbox" checked={selectedTests.includes(t)} onChange={() => toggleTest(t)} className="hidden" />
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition shrink-0 border
                          ${selectedTests.includes(t) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                          {selectedTests.includes(t) ? '✓' : ''}
                        </span>
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={sectionHeadCls}>Lab Shift</div>

                <div className="mb-6">
                  <label className={labelCls}>Preferred Shift <span className="text-[#E8630A]">*</span></label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {labShifts.map(s => (
                      <label key={s} className={`border-[1.5px] rounded-xl p-4 text-center cursor-pointer transition bg-white flex flex-col items-center gap-2
                        ${shift === s ? 'border-[#E8630A] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="shift" value={s} checked={shift === s} onChange={() => setShift(s)} className="hidden" />
                        <span className="text-xl">{shiftIcons[s]}</span>
                        <span className={`text-xs font-semibold ${shift === s ? 'text-[#E8630A]' : 'text-gray-500'}`}>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={sectionHeadCls}>Availability</div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div><label className={labelCls}>Shift Start Time</label>
                    <input className={inputCls} type="time" value={formData.shiftStart} onChange={e => set('shiftStart', e.target.value)} /></div>
                  <div><label className={labelCls}>Shift End Time</label>
                    <input className={inputCls} type="time" value={formData.shiftEnd} onChange={e => set('shiftEnd', e.target.value)} /></div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Weekly Days Available</label>
                    <div className="relative">
                      <select className={selectCls} value={formData.weeklyDays} onChange={e => set('weeklyDays', e.target.value)}>
                        <option value="">Select days</option>
                        <option>Mon – Fri</option><option>Mon – Sat</option><option>All 7 days</option><option>Custom</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="12" height="8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Emergency On-Call</label>
                    <div className="relative">
                      <select className={selectCls} value={formData.onCall} onChange={e => set('onCall', e.target.value)}>
                        <option value="">Select option</option>
                        <option>Yes, available</option><option>No</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="12" height="8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-500 text-[11px] font-bold px-3 py-1 rounded-full mb-4 tracking-wide border border-green-100">
                  Only Visible When Role is Lab Technician
                </div>
                <h3 className="font-['Syne',sans-serif] text-lg font-bold text-[#1A1D2E] mb-1">Additional Information</h3>
                <p className="text-xs text-gray-400 mb-6">Section 3 → 3.3 Notes, Equipment & Status</p>

                <div className={sectionHeadCls}>Equipment Proficiency</div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div><label className={labelCls}>Instruments Operated</label>
                    <input className={inputCls} placeholder="e.g. Hematology Analyzer, PCR Machine" value={formData.instruments} onChange={e => set('instruments', e.target.value)} /></div>
                  <div><label className={labelCls}>Software / LIMS Proficiency</label>
                    <input className={inputCls} placeholder="e.g. MedLab, Cerner, in-house LIMS" value={formData.lims} onChange={e => set('lims', e.target.value)} /></div>
                </div>

                <div className={sectionHeadCls}>Status & Assignment</div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelCls}>Current Status <span className="text-[#E8630A]">*</span></label>
                    <div className="relative">
                      <select className={selectCls} value={formData.status} onChange={e => set('status', e.target.value)}>
                        <option value="">Select status</option>
                        <option>Active</option><option>Inactive</option><option>On Leave</option><option>Probation</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="12" height="8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Lab Section / Department</label>
                    <div className="relative">
                      <select className={selectCls} value={formData.department} onChange={e => set('department', e.target.value)}>
                        <option value="">Select section</option>
                        <option>Clinical Pathology</option><option>Microbiology</option><option>Radiology</option>
                        <option>Molecular Diagnostics</option><option>Histopathology</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="12" height="8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div><label className={labelCls}>Supervisor / Reporting To</label>
                    <input className={inputCls} placeholder="e.g. Dr. Kavita Sharma" value={formData.supervisor} onChange={e => set('supervisor', e.target.value)} /></div>
                  <div><label className={labelCls}>Employee ID</label>
                    <input className={inputCls} placeholder="e.g. LAB005" value={formData.employeeId} onChange={e => set('employeeId', e.target.value)} /></div>
                </div>

                <div className={sectionHeadCls}>Notes</div>

                <div>
                  <label className={labelCls}>Internal Notes / Remarks</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-['Plus_Jakarta_Sans',sans-serif] text-[#1A1D2E] bg-white outline-none resize-y min-h-[100px] transition placeholder-gray-300 focus:border-[#E8630A] focus:shadow-[0_0_0_3px_rgba(232,99,10,.1)]"
                    placeholder="Any additional notes about this lab technician's capabilities, restrictions, or special skills..."
                    value={formData.notes}
                    onChange={e => set('notes', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-white shrink-0">
          <button
            className="h-10 px-6 border border-gray-200 rounded-xl bg-white text-gray-500 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >✕ Cancel</button>
          <div className="flex items-center gap-3">
            <button className="h-10 px-6 border border-gray-200 rounded-xl bg-white text-gray-500 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            {step < 3 ? (
              <button
                className="h-10 px-7 bg-gradient-to-br from-[#E8630A] to-[#c4500a] text-white border-none rounded-xl font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(232,99,10,.3)] hover:opacity-90 transition-opacity"
                onClick={() => setStep(s => s + 1)}
              >
                Next: {steps[step].label} →
              </button>
            ) : (
              <button
                className="h-10 px-7 bg-gradient-to-br from-[#E8630A] to-[#c4500a] text-white border-none rounded-xl font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(232,99,10,.3)] hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                ✓ {isEdit ? 'Update Lab Details' : 'Save Lab Details'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LabTechnician() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const handleEdit = (staff) => {
    setEditData(staff);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFFFFF; }
      `}</style>

      {viewData && (
        <ViewModal
          staff={viewData}
          onClose={() => setViewData(null)}
          onEdit={handleEdit}
        />
      )}

      {showForm && (
        <LabFormModal
          onClose={handleCloseForm}
          initialData={editData}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="font-['Syne',sans-serif] text-xl font-bold text-[#1A1D2E]">Lab Technician</div>
            <div className="text-sm text-gray-400 mt-0.5">Manage lab staff qualifications &amp; test capabilities</div>
          </div>
          <button
            className="bg-gradient-to-br from-[#E8630A] to-[#c4500a] text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer font-['Plus_Jakarta_Sans',sans-serif] shadow-[0_4px_14px_rgba(232,99,10,.25)] hover:opacity-90 transition-opacity"
            onClick={() => { setEditData(null); setShowForm(true); }}
          >+ Add Lab Details</button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-4">
          {labStaff.map(l => (
            <div key={l.id} className="bg-white border border-gray-100 rounded-2xl p-5 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,.07)] hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: `${l.color}22`, border: `2px solid ${l.color}44`, color: l.color }}
                >
                  {l.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#1A1D2E]">{l.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{l.id} · {l.qualification}</div>
                </div>
                <span className={l.status === 'Active'
                  ? 'bg-green-50 text-green-500 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-green-100'
                  : 'bg-red-50 text-red-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-red-100'
                }>{l.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase mb-0.5">Experience</div>
                  <div className="text-xs font-semibold text-gray-600">{l.experience} years</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase mb-0.5">Shift</div>
                  <div className="text-xs font-semibold text-green-500">{l.shift}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase mb-1.5">Specialized Tests</div>
                <div className="flex flex-wrap gap-1.5">
                  {l.specializedTests.map(t => (
                    <span key={t} className="bg-green-50 text-green-500 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-green-100">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3.5 border-t border-gray-100">
                <button
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-[#1A1D2E] transition-colors font-['Plus_Jakarta_Sans',sans-serif]"
                  onClick={() => setViewData(l)}
                >👁 View Details</button>
                <button
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl border border-orange-200 bg-orange-50/50 text-xs font-semibold text-[#E8630A] cursor-pointer hover:bg-orange-100 hover:border-[#E8630A] transition-colors font-['Plus_Jakarta_Sans',sans-serif]"
                  onClick={() => handleEdit(l)}
                >✏️ Edit Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}