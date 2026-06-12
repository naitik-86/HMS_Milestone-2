import React, { useState } from 'react';

// ── Mock Data ────────────────────────────────────────────────────────────────
const degreeTypes = ['BVSc', 'BVSc & AH', 'MVSc', 'PhD (Vet)', 'BAMS', 'Other'];
const specializations = ['Small Animal', 'Large Animal', 'Exotic & Wildlife', 'Poultry', 'Aquatic', 'Surgery', 'Dermatology', 'Dentistry', 'Oncology', 'Cardiology'];
const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];
const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Kerala', 'West Bengal', 'Uttar Pradesh', 'Madhya Pradesh'];

const initialDoctors = [
  { id: 'DOC-001', name: 'Dr. Priya Sharma', initials: 'PS', color: '#6366F1', status: 'Active', specialization: 'Small Animal', experience: 8, fees: 500, emergency: true, regNo: 'VCI/MH/2020/1234', state: 'Maharashtra', degrees: [{ degree: 'BVSc & AH' }], selectedSpecs: ['Small Animal'], selectedLangs: ['English', 'Hindi'], regNumber: 'VCI/MH/2020/1234', certValidity: '2026-12-31', reminderDays: 30, avgDuration: 20 },
  { id: 'DOC-002', name: 'Dr. Rohan Mehta', initials: 'RM', color: '#E8630A', status: 'Active', specialization: 'Surgery', experience: 12, fees: 800, emergency: false, regNo: 'VCI/KA/2018/5678', state: 'Karnataka', degrees: [{ degree: 'MVSc' }], selectedSpecs: ['Surgery'], selectedLangs: ['English', 'Kannada'], regNumber: 'VCI/KA/2018/5678', certValidity: '2025-06-30', reminderDays: 30, avgDuration: 30 },
  { id: 'DOC-003', name: 'Dr. Anita Rao', initials: 'AR', color: '#22C55E', status: 'Active', specialization: 'Exotic & Wildlife', experience: 5, fees: 600, emergency: true, regNo: 'VCI/TN/2021/9101', state: 'Tamil Nadu', degrees: [{ degree: 'BVSc' }], selectedSpecs: ['Exotic & Wildlife'], selectedLangs: ['English', 'Tamil'], regNumber: 'VCI/TN/2021/9101', certValidity: '2027-03-15', reminderDays: 45, avgDuration: 25 },
];

function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

// ── Shared style constants ───────────────────────────────────────────────────
const inputCls = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 transition-all bg-white placeholder-gray-300";
const inputErrCls = "w-full border border-red-400 rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white";
const labelCls = "block text-xs font-semibold text-[#6B7280] mb-2 tracking-wide";
const cardCls = "bg-white border border-[#F3F4F6] rounded-2xl p-8 shadow-sm";

function UploadBox({ id, accept, label }) {
  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}
      <div
        className="w-full border border-dashed border-[#E8630A] rounded-xl py-3.5 px-4 text-sm text-[#E8630A] font-semibold text-center cursor-pointer hover:bg-[#FEF3EB] transition-colors"
        onClick={() => document.getElementById(id).click()}
      >
        Upload File
        <input id={id} type="file" accept={accept} className="hidden" />
      </div>
    </div>
  );
}

// ── DoctorForm ───────────────────────────────────────────────────────────────
function DoctorForm({ onClose, onSave, existingData, isEdit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [degrees, setDegrees] = useState(existingData?.degrees || [{ degree: '' }]);
  const [selectedSpecs, setSelectedSpecs] = useState(existingData?.selectedSpecs || []);
  const [selectedLangs, setSelectedLangs] = useState(existingData?.selectedLangs || []);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: existingData?.name || '',
    regNumber: existingData?.regNumber || '',
    state: existingData?.state || '',
    certValidity: existingData?.certValidity || '',
    reminderDays: existingData?.reminderDays || 30,
    fees: existingData?.fees || '',
    avgDuration: existingData?.avgDuration || 15,
    emergency: existingData?.emergency ?? false,
    experience: existingData?.experience || '',
  });

  const u = (k, v) => {
    setFormData(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const steps = [
    { label: 'Qualifications' },
    { label: 'Vet Council Registration' },
    { label: 'Practice Settings' },
  ];

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Doctor name is required';
    if (!formData.experience || Number(formData.experience) <= 0) e.experience = 'Enter valid years of experience';
    if (!selectedSpecs.length) e.selectedSpecs = 'Select at least one specialization';
    if (!formData.regNumber.trim()) e.regNumber = 'Registration number is required';
    if (!formData.state) e.state = 'Please select a state';
    if (!formData.fees || Number(formData.fees) <= 0) e.fees = 'Enter valid consultation fees';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) {
      if (errors.name || errors.experience || errors.selectedSpecs) setActiveStep(0);
      else if (errors.regNumber || errors.state) setActiveStep(1);
      else setActiveStep(2);
      return;
    }
    onSave({ ...formData, degrees, selectedSpecs, selectedLangs });
  };

  const toggleSpec = (s) => {
    setSelectedSpecs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    if (errors.selectedSpecs) setErrors(p => ({ ...p, selectedSpecs: '' }));
  };
  const toggleLang = (l) => setSelectedLangs(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);

  const stepErrors = [
    [errors.name, errors.experience, errors.selectedSpecs].filter(Boolean).length,
    [errors.regNumber, errors.state].filter(Boolean).length,
    [errors.fees].filter(Boolean).length,
  ];

  const chipCls = (active) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
      active ? 'border-[#E8630A] bg-[#FEF3EB] text-[#E8630A]' : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300'
    }`;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '1500px', height: '88vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── HEADER ── */}
        <div className="px-10 pt-8 pb-0 flex-shrink-0 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E] leading-tight">
                {isEdit ? 'Edit Doctor Details' : 'Add Doctor Details'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isEdit
                  ? `Update qualifications & practice settings for ${formData.name || '—'}`
                  : 'Register a new doctor — qualifications, registration & practice details.'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-lg mt-0.5 bg-transparent border-none">
              ✕
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center">
            {steps.map((s, i) => {
              const isActive = activeStep === i;
              const isDone = activeStep > i;
              return (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: isDone || isActive ? '#E8630A' : '#FEF3EB',
                        color: isDone || isActive ? '#fff' : '#E8630A',
                        border: `2px solid ${isDone || isActive ? '#E8630A' : '#FDDAB5'}`,
                      }}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span
                      className="text-sm whitespace-nowrap"
                      style={{ color: isActive ? '#1A1D2E' : isDone ? '#E8630A' : '#9CA3AF', fontWeight: isActive ? 700 : 600 }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="flex-1 mx-5 rounded-full"
                      style={{ height: '2px', backgroundColor: activeStep > i ? '#E8630A' : '#E5E7EB', minWidth: '80px' }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Pill tabs */}
          <div className="flex gap-2 mt-5 pb-5">
            {steps.map((s, i) => {
              const isActive = activeStep === i;
              const isDone = activeStep > i;
              return (
                <div key={i} className="relative">
                  <button
                    onClick={() => setActiveStep(i)}
                    className="px-5 py-2 rounded-full text-sm font-semibold cursor-pointer border-none transition-all"
                    style={{
                      backgroundColor: isActive ? '#E8630A' : isDone ? '#FEF3EB' : '#F3F4F6',
                      color: isActive ? '#fff' : isDone ? '#E8630A' : '#6B7280',
                    }}
                  >
                    {s.label}
                  </button>
                  {stepErrors[i] > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {stepErrors[i]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-10 py-8">

          {/* Step 0: Qualifications */}
          {activeStep === 0 && (
            <div className="space-y-6">
              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Doctor Identity</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Doctor Full Name <span className="text-[#E8630A]">*</span></label>
                    <input className={errors.name ? inputErrCls : inputCls} placeholder="e.g. Dr. Priya Sharma" value={formData.name} onChange={e => u('name', e.target.value)} />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Years of Experience <span className="text-[#E8630A]">*</span></label>
                    <input type="number" min="0" placeholder="e.g. 8" value={formData.experience} onChange={e => u('experience', e.target.value)} className={errors.experience ? inputErrCls : inputCls} />
                    {errors.experience && <p className="text-red-500 text-xs mt-1.5">{errors.experience}</p>}
                  </div>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Academic Degrees</h3>
                <div className="space-y-4">
                  {degrees.map((d, i) => (
                    <div key={i} className="bg-[#FAFAFA] border border-[#F3F4F6] rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Degree {i + 1}</span>
                        {i > 0 && (
                          <button onClick={() => setDegrees(degrees.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer bg-transparent border-none">
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Degree Type</label>
                          <select className={inputCls} value={d.degree} onChange={e => setDegrees(degrees.map((deg, j) => j === i ? { ...deg, degree: e.target.value } : deg))}>
                            <option value="">Select</option>
                            {degreeTypes.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <UploadBox id={`cert-${i}`} accept=".pdf,image/*" label="Certificate (img / pdf)" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setDegrees([...degrees, { degree: '' }])}
                    className="text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer border border-[#E8630A]/40 text-[#E8630A] bg-[#E8630A]/5 hover:bg-[#E8630A]/10 transition-colors"
                  >
                    + Add Degree
                  </button>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-1">Specialization <span className="text-[#E8630A]">*</span></h3>
                <p className="text-sm text-gray-400 mb-5">Select all areas that apply.</p>
                <div className="flex flex-wrap gap-2.5">
                  {specializations.map(s => (
                    <div key={s} onClick={() => toggleSpec(s)} className={chipCls(selectedSpecs.includes(s))}>
                      <input type="checkbox" checked={selectedSpecs.includes(s)} readOnly className="accent-[#E8630A]" />
                      {s}
                    </div>
                  ))}
                </div>
                {errors.selectedSpecs && <p className="text-red-500 text-xs mt-3">{errors.selectedSpecs}</p>}
              </div>
            </div>
          )}

          {/* Step 1: Vet Council */}
          {activeStep === 1 && (
            <div className={cardCls}>
              <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Vet Council Registration</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Registration Number <span className="text-[#E8630A]">*</span></label>
                  <input placeholder="e.g. VCI/MH/2020/1234" value={formData.regNumber} onChange={e => u('regNumber', e.target.value)} className={errors.regNumber ? inputErrCls : inputCls} />
                  {errors.regNumber && <p className="text-red-500 text-xs mt-1.5">{errors.regNumber}</p>}
                </div>
                <div>
                  <label className={labelCls}>State Vet Council <span className="text-[#E8630A]">*</span></label>
                  <select value={formData.state} onChange={e => u('state', e.target.value)} className={errors.state ? inputErrCls : inputCls}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1.5">{errors.state}</p>}
                </div>
                <div>
                  <label className={labelCls}>Certificate Validity Date</label>
                  <input type="date" value={formData.certValidity} onChange={e => u('certValidity', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Renewal Reminder <span className="text-gray-400 font-normal">(days before expiry)</span></label>
                  <input type="number" value={formData.reminderDays} onChange={e => u('reminderDays', e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <UploadBox id="regCert" accept=".pdf" label="Registration Certificate (PDF)" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Practice Settings */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Practice Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Consultation Fees (₹) <span className="text-[#E8630A]">*</span></label>
                    <input type="number" min="0" placeholder="e.g. 500" value={formData.fees} onChange={e => u('fees', e.target.value)} className={errors.fees ? inputErrCls : inputCls} />
                    {errors.fees && <p className="text-red-500 text-xs mt-1.5">{errors.fees}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Avg Consultation Duration (min)</label>
                    <input type="number" value={formData.avgDuration} onChange={e => u('avgDuration', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 p-5 bg-[#FAFAFA] border border-[#F3F4F6] rounded-2xl">
                  <div>
                    <div className="font-semibold text-[#1A1D2E] text-sm">Available for Emergency?</div>
                    <div className="text-xs text-gray-400 mt-0.5">{formData.emergency ? 'Available for emergencies' : 'Not available for emergencies'}</div>
                  </div>
                  <div
                    onClick={() => u('emergency', !formData.emergency)}
                    className="relative rounded-full cursor-pointer flex-shrink-0 transition-colors"
                    style={{ width: '46px', height: '24px', backgroundColor: formData.emergency ? '#E8630A' : '#D1D5DB' }}
                  >
                    <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all" style={{ left: formData.emergency ? '23px' : '3px' }} />
                  </div>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Documents & Assets</h3>
                <div className="grid grid-cols-2 gap-6">
                  <UploadBox id="digSign" accept="image/*" label="Digital Signature" />
                  <UploadBox id="letterhead" accept="image/*,.pdf" label="Doctor Letterhead / Stamp" />
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-base font-bold text-[#1A1D2E] mb-1">Prescription Language(s)</h3>
                <p className="text-sm text-gray-400 mb-5">Select languages for prescription writing.</p>
                <div className="flex flex-wrap gap-2.5">
                  {languages.map(l => (
                    <div key={l} onClick={() => toggleLang(l)} className={chipCls(selectedLangs.includes(l))}>
                      <input type="checkbox" checked={selectedLangs.includes(l)} readOnly className="accent-[#E8630A]" />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="px-10 py-5 flex items-center justify-between flex-shrink-0 border-t border-[#F3F4F6]">
          <button
            onClick={() => activeStep > 0 ? setActiveStep(activeStep - 1) : onClose()}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold border border-[#E5E7EB] text-[#374151] bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {activeStep > 0 ? '← Previous' : 'Cancel'}
          </button>
          <button
            onClick={() => activeStep < steps.length - 1 ? setActiveStep(activeStep + 1) : handleSave()}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#E8630A] hover:bg-[#D05A09] cursor-pointer transition-colors border-none"
          >
            {activeStep < steps.length - 1 ? 'Next →' : isEdit ? '✓ Update Doctor' : 'Save Doctor Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ViewProfile Modal ────────────────────────────────────────────────────────
function ViewProfileModal({ doctor, onClose, onEdit }) {
  if (!doctor) return null;

  const statItems = [
    { label: 'Specialization', value: doctor.specialization || '—' },
    { label: 'Experience', value: doctor.experience ? `${doctor.experience} years` : '—' },
    { label: 'Consultation Fees', value: doctor.fees ? `₹${doctor.fees}` : '—', cls: 'text-[#E8630A]' },
    { label: 'Avg Duration', value: doctor.avgDuration ? `${doctor.avgDuration} min` : '—' },
    { label: 'Emergency', value: doctor.emergency ? 'Available' : 'Not Available', cls: doctor.emergency ? 'text-green-500' : 'text-red-400' },
    { label: 'State', value: doctor.state || '—' },
  ];

  return (
    <div className="flex flex-col gap-5 overflow-y-auto">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: `${doctor.color}20`, border: `2px solid ${doctor.color}50`, color: doctor.color }}>
            {doctor.initials}
          </div>
          <div>
            <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E]">{doctor.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{doctor.id}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-600">{doctor.status}</span>
              {doctor.degrees?.[0]?.degree && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8630A]/10 text-[#E8630A]">{doctor.degrees[0].degree}</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer bg-transparent border-none">✕</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statItems.map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3.5 border border-[#EAE5DC]">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{item.label}</div>
            <div className={`text-sm font-bold ${item.cls || 'text-[#1A1D2E]'}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-[#EAE5DC]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Vet Council Registration</div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A1D2E]">{doctor.regNumber || '—'}</p>
            <p className="text-xs text-gray-500 mt-0.5">{doctor.state || '—'} Vet Council</p>
          </div>
          {doctor.certValidity && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Valid until</p>
              <p className="text-sm font-semibold text-[#1A1D2E] mt-0.5">{doctor.certValidity}</p>
            </div>
          )}
        </div>
      </div>

      {doctor.selectedSpecs?.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Specializations</div>
          <div className="flex flex-wrap gap-2">
            {doctor.selectedSpecs.map(s => (
              <span key={s} className="text-xs bg-[#E8630A]/10 text-[#E8630A] border border-[#E8630A]/20 px-3 py-1.5 rounded-lg font-semibold">{s}</span>
            ))}
          </div>
        </div>
      )}

      {doctor.selectedLangs?.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Prescription Languages</div>
          <div className="flex flex-wrap gap-2">
            {doctor.selectedLangs.map(l => (
              <span key={l} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg font-semibold">{l}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-3 border-t border-[#EAE5DC]">
        <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1A1D2E] text-sm font-semibold rounded-xl cursor-pointer border-none transition-colors">
          Close
        </button>
        <button onClick={onEdit} className="px-6 py-2.5 bg-[#E8630A] hover:bg-[#D05A09] text-white text-sm font-semibold rounded-xl cursor-pointer border-none transition-colors">
          Edit Details
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DoctorDetails() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => setModal(null);

  const handleSave = (formData) => {
    const initials = getInitials(formData.name);
    if (modal.type === 'edit') {
      setDoctors(prev => prev.map(d =>
        d.id === modal.doctor.id
          ? {
              ...d,
              name: formData.name.trim() || d.name,
              initials: initials || d.initials,
              experience: Number(formData.experience) || d.experience,
              fees: Number(formData.fees) || d.fees,
              emergency: formData.emergency,
              regNumber: formData.regNumber || d.regNumber,
              regNo: formData.regNumber || d.regNo,
              state: formData.state || d.state,
              certValidity: formData.certValidity || d.certValidity,
              reminderDays: Number(formData.reminderDays) || d.reminderDays,
              avgDuration: Number(formData.avgDuration) || d.avgDuration,
              degrees: formData.degrees,
              selectedSpecs: formData.selectedSpecs,
              selectedLangs: formData.selectedLangs,
              specialization: formData.selectedSpecs?.[0] || d.specialization,
            }
          : d
      ));
      showToast('Doctor details updated successfully!');
    } else {
      const id = `DOC-${String(doctors.length + 1).padStart(3, '0')}`;
      setDoctors(prev => [...prev, {
        id, name: formData.name.trim(), initials, color: '#E8630A', status: 'Active',
        specialization: formData.selectedSpecs?.[0] || 'General',
        experience: Number(formData.experience) || 0,
        fees: Number(formData.fees) || 0,
        emergency: formData.emergency,
        regNo: formData.regNumber || '—',
        regNumber: formData.regNumber || '',
        state: formData.state || '',
        certValidity: formData.certValidity || '',
        reminderDays: Number(formData.reminderDays) || 30,
        avgDuration: Number(formData.avgDuration) || 15,
        degrees: formData.degrees,
        selectedSpecs: formData.selectedSpecs,
        selectedLangs: formData.selectedLangs,
      }]);
      showToast('New doctor added successfully!');
    }
    closeModal();
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {toast && (
        <div className="fixed top-5 right-5 z-[2000] px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold text-white bg-[#E8630A] flex items-center gap-2">
          ✓ {toast}
        </div>
      )}

      {(modal?.type === 'add' || modal?.type === 'edit') && (
        <DoctorForm onClose={closeModal} onSave={handleSave} existingData={modal.doctor} isEdit={modal.type === 'edit'} />
      )}

      {modal?.type === 'view' && (
        <div className="fixed inset-0 bg-[#1A1D2E]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl overflow-y-auto"
            style={{ width: 'min(700px, 95vw)', maxHeight: '92vh', padding: '40px' }}
          >
            <ViewProfileModal
              doctor={modal.doctor}
              onClose={closeModal}
              onEdit={() => { closeModal(); setTimeout(() => setModal({ type: 'edit', doctor: modal.doctor }), 50); }}
            />
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E]">Doctor Details</h2>
          <p className="text-gray-500 text-sm mt-1">Manage doctor profiles, qualifications & practice settings</p>
        </div>
        <button
          onClick={() => setModal({ type: 'add' })}
          className="bg-[#E8630A] hover:bg-[#D05A09] text-white text-sm font-semibold px-6 py-3 rounded-xl cursor-pointer border-none transition-colors"
        >
          + Add Doctor Details
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map(d => (
          <div key={d.id} className="bg-white border border-[#EAE5DC] rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: `${d.color}20`, border: `2px solid ${d.color}40`, color: d.color }}
              >
                {d.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1A1D2E] truncate">{d.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{d.id}</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-600 flex-shrink-0">{d.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'SPECIALIZATION', value: d.specialization, cls: 'text-[#1A1D2E]' },
                { label: 'EXPERIENCE', value: `${d.experience} yrs`, cls: 'text-[#1A1D2E]' },
                { label: 'CONSULT FEES', value: `₹${d.fees}`, cls: 'text-[#E8630A]' },
                { label: 'EMERGENCY', value: d.emergency ? 'Available' : 'Not Available', cls: d.emergency ? 'text-green-500' : 'text-red-400' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-2.5">
                  <div className="text-[10px] text-gray-400 font-semibold mb-1 tracking-wide">{item.label}</div>
                  <div className={`text-xs font-bold ${item.cls}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-400 border-t border-[#EAE5DC] pt-3 mb-3 truncate">
              Reg: {d.regNo} · {d.state || '—'}
            </div>

            <div className="flex gap-2">
              <button
                onClick={e => { e.stopPropagation(); setModal({ type: 'edit', doctor: d }); }}
                className="flex-1 bg-white border border-[#E8630A]/30 text-[#E8630A] hover:bg-[#E8630A]/5 rounded-xl py-2 text-xs font-semibold cursor-pointer transition-colors"
              >
                ✏️ Edit Details
              </button>
              <button
                onClick={e => { e.stopPropagation(); setModal({ type: 'view', doctor: d }); }}
                className="flex-1 bg-white border border-[#E5E7EB] text-gray-500 hover:bg-gray-50 rounded-xl py-2 text-xs font-semibold cursor-pointer transition-colors"
              >
                👁 View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}