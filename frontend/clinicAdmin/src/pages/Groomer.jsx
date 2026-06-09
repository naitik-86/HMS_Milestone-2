import React, { useState } from 'react';

const allSpecies       = ['Dogs', 'Cats', 'Small Animals', 'Birds', 'Exotic'];
const allServices      = ['Bath & Dry', 'Hair Trim', 'Nail Clipping', 'Ear Cleaning', 'Dental Cleaning', 'De-shedding', 'Styling'];
const allShifts        = ['Full Day', 'Half Day', 'Weekends'];
const certTypes        = ['Certificate', 'Diploma', 'Training Course', 'Workshop', 'Other'];

const groomers = [
  { id: 'GRM001', name: 'Sunita Rao',   initials: 'SR', color: '#A855F7', experience: 4, species: ['Dogs', 'Cats'],                   services: ['Bath & Dry', 'Hair Trim', 'Styling'],        shift: 'Full Day',  certified: true,  status: 'Active' },
  { id: 'GRM002', name: 'Raj Kumar',    initials: 'RK', color: '#EC4899', experience: 6, species: ['Dogs', 'Small Animals', 'Exotic'], services: ['Bath & Dry', 'Nail Clipping', 'De-shedding'], shift: 'Weekends',  certified: true,  status: 'Active' },
  { id: 'GRM003', name: 'Meena Pillai', initials: 'MP', color: '#F59E0B', experience: 2, species: ['Cats', 'Birds'],                  services: ['Bath & Dry', 'Ear Cleaning'],                shift: 'Half Day',  certified: false, status: 'Active' },
];

const ORANGE = '#E8630A';
const PURPLE = '#A855F7';
const shiftIcons = { 'Full Day': '🌞', 'Half Day': '🌤', 'Weekends': '📅' };

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    * { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-syne { font-family: 'Syne', sans-serif; }
    @keyframes gFadeIn { from { opacity:0; transform:scale(.98) } to { opacity:1; transform:scale(1) } }
    .animate-fadeIn { animation: gFadeIn .18s ease; }
    select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
  `}</style>
);

/* ─── ViewModal ─── */
function ViewModal({ groomer: g, onClose, onEdit }) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center animate-fadeIn"
      style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-[20px] w-[90%] max-w-[580px] max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: `${g.color}22`, border: `2px solid ${g.color}44`, color: g.color }}>{g.initials}</div>
            <div>
              <div className="font-syne text-xl font-bold text-[#1A1D2E]">{g.name}</div>
              <div className="text-xs text-[#9CA3AF] mt-1">{g.id} · Groomer</div>
            </div>
          </div>
          <button className="w-[34px] h-[34px] rounded-[9px] border border-[#EAE5DC] bg-white flex items-center justify-center text-[#6B7280] cursor-pointer hover:bg-[#FEE2E2] hover:text-[#EF4444]" onClick={onClose}>✕</button>
        </div>
        {[
          { title: 'Experience & Certification', items: [['Experience', `${g.experience} years`], ['Certified', g.certified ? '✓ Yes' : '✗ No']] },
          { title: 'Schedule', items: [['Shift', g.shift], ['Status', g.status]] },
        ].map(section => (
          <div className="mb-5" key={section.title}>
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 pb-2 border-b border-[#EAE5DC]">{section.title}</div>
            <div className="grid grid-cols-2 gap-3">
              {section.items.map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">{k}</div>
                  <div className="text-[13px] font-semibold text-[#1A1D2E]">{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {[
          { title: 'Species Handled', items: g.species, bg: 'rgba(168,85,247,.1)', color: PURPLE },
          { title: 'Services Offered', items: g.services, bg: 'rgba(232,99,10,.1)', color: ORANGE },
        ].map(section => (
          <div className="mb-5" key={section.title}>
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 pb-2 border-b border-[#EAE5DC]">{section.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {section.items.map(s => (
                <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-[10px]"
                  style={{ background: section.bg, color: section.color }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-2.5 mt-6 pt-5 border-t border-[#EAE5DC]">
          <button className="flex items-center gap-2 border border-[#EAE5DC] rounded-[10px] bg-white text-[#6B7280] text-sm font-semibold px-[22px] h-11 cursor-pointer hover:bg-[#f8f8f8]" onClick={onClose}>Close</button>
          <button className="flex items-center gap-2 text-white border-none rounded-[10px] text-sm font-bold px-7 h-11 cursor-pointer hover:opacity-90"
            style={{ background: ORANGE, boxShadow: '0 4px 14px rgba(232,99,10,.3)' }}
            onClick={() => { onClose(); onEdit(g); }}>✏️ Edit Details</button>
        </div>
      </div>
    </div>
  );
}

/* ─── STEPS ─── */
const STEPS = [
  { num: 1, label: 'Grooming Skills' },
  { num: 2, label: 'Services & Shift' },
  { num: 3, label: 'Additional Info' },
];

/* ─── GroomerModal ─── */
function GroomerModal({ onClose, initialData = null }) {
  const isEdit = !!initialData;
  const [step, setStep] = useState(1);
  const [selectedSpecies,  setSelectedSpecies]  = useState(initialData?.species  || []);
  const [selectedServices, setSelectedServices] = useState(initialData?.services || []);
  const [shift,    setShift]    = useState(initialData?.shift     || '');
  const [certified, setCertified] = useState(initialData?.certified ?? false);
  const [certFile,  setCertFile]  = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [certs, setCerts] = useState([{ type: '', name: '' }]);
  const [formData, setFormData] = useState({
    experience: initialData?.experience || '',
    prevSalon: '', licenseNumber: '', dateOfJoining: '',
    shiftStart: '', shiftEnd: '', weeklyDays: '', onCall: '',
    tools: '', specialBreeds: '',
    status: initialData?.status || '',
    department: '', supervisor: '',
    employeeId: initialData?.id || '',
    notes: '',
  });

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const toggleSpecies  = s => setSelectedSpecies(p  => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleService  = s => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const addCertRow    = () => setCerts(p => [...p, { type: '', name: '' }]);
  const removeCertRow = i  => setCerts(p => p.filter((_, j) => j !== i));
  const setCertField  = (i, k, v) => setCerts(p => p.map((c, j) => j === i ? { ...c, [k]: v } : c));

  const inputCls  = `h-[44px] border border-[#EAE5DC] rounded-[10px] px-3.5 text-sm text-[#1A1D2E] bg-white outline-none w-full transition-all focus:border-[#E8630A] focus:shadow-[0_0_0_3px_rgba(232,99,10,0.1)] placeholder-[#D1D5DB]`;
  const selectCls = `${inputCls} cursor-pointer`;
  const labelCls  = `text-[11px] font-bold text-[#6B7280] uppercase tracking-widest`;
  const divCls    = `text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[.08em] flex items-center gap-3 my-5 after:content-[''] after:flex-1 after:h-px after:bg-[#EAE5DC]`;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center animate-fadeIn"
      style={{ background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', padding: '24px' }}
      onClick={onClose}
    >
      {/* ── Modal shell: max-width 1500px, height 88vh ── */}
      <div
        className="relative bg-white rounded-[20px] shadow-2xl flex flex-col overflow-hidden w-full"
        style={{ maxWidth: '1500px', height: '88vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ══ HEADER ══ */}
        <div className="flex-shrink-0 px-10 pt-7 pb-0 bg-white">

          {/* Title row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-syne text-2xl font-bold" style={{ color: ORANGE }}>
                {isEdit ? `Edit Groomer — ${initialData.name}` : 'Add Groomer Details'}
              </h2>
              <p className="text-sm text-[#9CA3AF] mt-0.5">
                {isEdit ? 'Update grooming profile, skills and schedule.' : 'Register grooming skills, services and availability.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#f3f4f6] transition text-xl leading-none mt-0.5 border-none bg-transparent cursor-pointer"
            >×</button>
          </div>

          {/* ── Numbered step progress (matches Add Clinic reference) ── */}
          <div className="flex items-center mb-4">
            {STEPS.map(({ num, label }, i) => {
              const done   = step > num;
              const active = step === num;
              const circleCls = done || active
                ? 'text-white'
                : 'text-[#fb923c]';
              return (
                <React.Fragment key={num}>
                  <div
                    className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
                    onClick={() => setStep(num)}
                  >
                    {/* Circle */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all flex-shrink-0 ${circleCls}`}
                      style={
                        done || active
                          ? { background: ORANGE, borderColor: ORANGE }
                          : { background: '#fff7ed', borderColor: '#fed7aa' }
                      }
                    >
                      {done ? '✓' : num}
                    </div>
                    {/* Label */}
                    <p className="text-sm font-semibold whitespace-nowrap leading-tight"
                      style={{ color: active ? '#111827' : done ? '#4b5563' : '#9ca3af' }}>
                      {label}
                    </p>
                  </div>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-4 rounded-full transition-all"
                      style={{ background: step > num ? '#fb923c' : '#fed7aa' }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── Tab pills ── */}
          <div className="flex gap-2 pb-4">
            {STEPS.map(({ num, label }) => (
              <button
                key={num}
                onClick={() => setStep(num)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all border cursor-pointer"
                style={step === num
                  ? { background: ORANGE, color: '#fff', borderColor: ORANGE, boxShadow: '0 2px 8px rgba(232,99,10,.25)' }
                  : { background: '#fff', color: '#6B7280', borderColor: '#e5e7eb' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ SCROLLABLE BODY ══ */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb] px-10 py-5">
          <div className="bg-white rounded-[16px] border border-[#e5e7eb] px-8 py-6">

            {/* ── STEP 1: Grooming Skills ── */}
            {step === 1 && (
              <>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(168,85,247,.12)', color: PURPLE }}>
                  Show Only when role is Groomer · Requires Grooming Module
                </div>
                <div className="font-syne text-lg font-bold text-[#1A1D2E] mb-0.5">Grooming Skills & Credentials</div>
                <div className="text-[13px] text-[#9CA3AF] mb-6">Section 4 → 4.1 Experience, Certifications & Species</div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Years of Experience <span style={{ color: ORANGE }}>*</span></label>
                    <input className={inputCls} type="number" min="0" placeholder="e.g. 4" value={formData.experience} onChange={e => set('experience', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Previous Salon / Clinic</label>
                    <input className={inputCls} placeholder="e.g. PetSmart, Happy Paws Salon" value={formData.prevSalon} onChange={e => set('prevSalon', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>License / Registration Number</label>
                    <input className={inputCls} placeholder="e.g. GRM-2022-00891" value={formData.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Date of Joining</label>
                    <input className={inputCls} type="date" value={formData.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} />
                  </div>
                </div>

                <div className={divCls}>Certification / Training</div>

                <div className="mb-5">
                  <label className={labelCls}>Certificates & Training</label>
                  <div className="mt-1.5">
                    {certs.map((c, i) => (
                      <div key={i} className="grid gap-2.5 items-center mb-2.5"
                        style={{ gridTemplateColumns: i > 0 ? '1fr 1fr auto' : '1fr 1fr' }}>
                        <select className={selectCls} value={c.type} onChange={e => setCertField(i, 'type', e.target.value)}>
                          <option value="">Select Type</option>
                          {certTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <input className={inputCls} placeholder="Certificate / Course name" value={c.name} onChange={e => setCertField(i, 'name', e.target.value)} />
                        {i > 0 && (
                          <button className="w-9 h-9 rounded-[9px] border border-[#FEE2E2] bg-[#FFF5F5] flex items-center justify-center cursor-pointer text-[#EF4444] text-sm flex-shrink-0 hover:bg-[#FEE2E2]"
                            onClick={() => removeCertRow(i)}>✕</button>
                        )}
                      </div>
                    ))}
                    <button
                      className="inline-flex items-center gap-1.5 border border-dashed border-[#EAE5DC] rounded-[9px] bg-white text-xs font-semibold text-[#6B7280] px-4 py-2.5 cursor-pointer transition-all hover:border-[#E8630A]"
                      onClick={addCertRow}>+ Add Certificate Row</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  {[
                    { label: 'Certificate Document', icon: '📜', accept: '.pdf,image/*', state: certFile, setState: setCertFile },
                    { label: 'Profile / ID Photo', icon: '🪪', accept: 'image/*', state: profilePhoto, setState: setProfilePhoto },
                  ].map(({ label, icon, accept, state, setState }) => (
                    <div className="flex flex-col gap-1.5" key={label}>
                      <label className={labelCls}>{label}</label>
                      <div className="border-2 border-dashed border-[#EAE5DC] rounded-xl p-6 text-center cursor-pointer bg-white relative overflow-hidden transition-all hover:border-[#E8630A] hover:bg-[rgba(232,99,10,.03)]">
                        <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setState(e.target.files[0])} />
                        <div className="text-[26px] mb-1.5">{icon}</div>
                        <div className="text-[13px] font-semibold text-[#6B7280]">{state ? state.name : 'Click to upload'}</div>
                        <div className="text-[11px] text-[#D1D5DB] mt-0.5">PDF, JPG, PNG · up to 5 MB</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={divCls}>Certification Status</div>
                <div className="flex items-center gap-3 mb-5">
                  <button
                    className={`w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors flex-shrink-0 ${certified ? 'bg-green-500' : 'bg-[#D1D5DB]'}`}
                    onClick={() => setCertified(p => !p)}
                  >
                    <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all"
                      style={{ left: certified ? '23px' : '3px' }} />
                  </button>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1A1D2E]">
                      {certified ? 'Professionally Certified' : 'Not Certified'}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">Toggle on if this groomer holds a recognized grooming certification</div>
                  </div>
                </div>

                <div className={divCls}>Species Handled</div>
                <div>
                  <label className={labelCls}>Select Species (multi-select) <span style={{ color: ORANGE }}>*</span></label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {allSpecies.map(s => {
                      const sel = selectedSpecies.includes(s);
                      return (
                        <label key={s} className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[10px] cursor-pointer text-xs font-semibold border transition-all select-none"
                          style={sel ? { borderColor: PURPLE, background: 'rgba(168,85,247,.1)', color: PURPLE } : { borderColor: '#EAE5DC', background: '#fff', color: '#9CA3AF' }}>
                          <input type="checkbox" className="hidden" checked={sel} onChange={() => toggleSpecies(s)} />
                          <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] transition-all flex-shrink-0"
                            style={sel ? { background: PURPLE, border: `1.5px solid ${PURPLE}`, color: '#fff' } : { border: '1.5px solid #D1D5DB' }}>{sel ? '✓' : ''}</span>
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: Services & Shift ── */}
            {step === 2 && (
              <>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(168,85,247,.12)', color: PURPLE }}>
                  Show Only when role is Groomer · Requires Grooming Module
                </div>
                <div className="font-syne text-lg font-bold text-[#1A1D2E] mb-0.5">Services Offered & Schedule</div>
                <div className="text-[13px] text-[#9CA3AF] mb-6">Section 4 → 4.2 Grooming Services & Availability</div>

                <div className={divCls}>Grooming Services</div>
                <div>
                  <label className={labelCls}>Select Services (multi-select) <span style={{ color: ORANGE }}>*</span></label>
                  <div className="flex flex-wrap gap-2 mt-1.5 mb-5">
                    {allServices.map(s => {
                      const sel = selectedServices.includes(s);
                      return (
                        <label key={s} className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[10px] cursor-pointer text-xs font-semibold border transition-all select-none"
                          style={sel ? { borderColor: ORANGE, background: 'rgba(232,99,10,.08)', color: ORANGE } : { borderColor: '#EAE5DC', background: '#fff', color: '#9CA3AF' }}>
                          <input type="checkbox" className="hidden" checked={sel} onChange={() => toggleService(s)} />
                          <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] transition-all flex-shrink-0"
                            style={sel ? { background: ORANGE, border: `1.5px solid ${ORANGE}`, color: '#fff' } : { border: '1.5px solid #D1D5DB' }}>{sel ? '✓' : ''}</span>
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className={divCls}>Availability / Shift</div>
                <div className="mb-5">
                  <label className={labelCls}>Preferred Shift <span style={{ color: ORANGE }}>*</span></label>
                  <div className="grid grid-cols-3 gap-2.5 mt-1.5">
                    {allShifts.map(s => (
                      <label key={s} className="border rounded-[10px] p-3.5 text-center cursor-pointer bg-white flex flex-col items-center gap-1.5 transition-all"
                        style={shift === s ? { borderColor: ORANGE, background: 'rgba(232,99,10,.06)', borderWidth: '1.5px' } : { borderColor: '#EAE5DC', borderWidth: '1.5px' }}>
                        <input type="radio" name="g-shift" value={s} className="hidden" checked={shift === s} onChange={() => setShift(s)} />
                        <span className="text-xl">{shiftIcons[s]}</span>
                        <span className="text-xs font-semibold" style={{ color: shift === s ? ORANGE : '#6B7280' }}>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Shift Start Time</label>
                    <input className={inputCls} type="time" value={formData.shiftStart} onChange={e => set('shiftStart', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Shift End Time</label>
                    <input className={inputCls} type="time" value={formData.shiftEnd} onChange={e => set('shiftEnd', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Weekly Days Available</label>
                    <select className={selectCls} value={formData.weeklyDays} onChange={e => set('weeklyDays', e.target.value)}>
                      <option value="">Select days</option>
                      <option>Mon – Fri</option>
                      <option>Mon – Sat</option>
                      <option>All 7 days</option>
                      <option>Weekends only</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Emergency / On-Call</label>
                    <select className={selectCls} value={formData.onCall} onChange={e => set('onCall', e.target.value)}>
                      <option value="">Select option</option>
                      <option>Yes, available</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: Additional Info ── */}
            {step === 3 && (
              <>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(168,85,247,.12)', color: PURPLE }}>
                  Show Only when role is Groomer · Requires Grooming Module
                </div>
                <div className="font-syne text-lg font-bold text-[#1A1D2E] mb-0.5">Additional Information</div>
                <div className="text-[13px] text-[#9CA3AF] mb-6">Section 4 → 4.3 Tools, Assignment & Notes</div>

                <div className={divCls}>Tools & Special Skills</div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Grooming Tools / Equipment</label>
                    <input className={inputCls} placeholder="e.g. HV Dryer, Clippers, Dematting Comb" value={formData.tools} onChange={e => set('tools', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Special Breeds Handled</label>
                    <input className={inputCls} placeholder="e.g. Poodle, Persian, Husky" value={formData.specialBreeds} onChange={e => set('specialBreeds', e.target.value)} />
                  </div>
                </div>

                <div className={divCls}>Status & Assignment</div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Current Status <span style={{ color: ORANGE }}>*</span></label>
                    <select className={selectCls} value={formData.status} onChange={e => set('status', e.target.value)}>
                      <option value="">Select status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>On Leave</option>
                      <option>Probation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Department / Section</label>
                    <select className={selectCls} value={formData.department} onChange={e => set('department', e.target.value)}>
                      <option value="">Select department</option>
                      <option>Grooming Studio</option>
                      <option>Mobile Grooming</option>
                      <option>Spa & Wellness</option>
                      <option>General Grooming</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Supervisor / Reporting To</label>
                    <input className={inputCls} placeholder="e.g. Dr. Priya Nair" value={formData.supervisor} onChange={e => set('supervisor', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Employee ID</label>
                    <input className={inputCls} placeholder="e.g. GRM004" value={formData.employeeId} onChange={e => set('employeeId', e.target.value)} />
                  </div>
                </div>

                <div className={divCls}>Notes</div>
                <div className="flex flex-col gap-1.5 mb-5">
                  <label className={labelCls}>Internal Notes / Remarks</label>
                  <textarea
                    className="border border-[#EAE5DC] rounded-[10px] px-3.5 py-3 text-sm text-[#1A1D2E] bg-white outline-none resize-y min-h-[90px] w-full transition-all focus:border-[#E8630A] focus:shadow-[0_0_0_3px_rgba(232,99,10,0.1)] placeholder-[#D1D5DB]"
                    placeholder="Any additional notes about scheduling, special skills, or restrictions..."
                    value={formData.notes}
                    onChange={e => set('notes', e.target.value)}
                  />
                </div>
              </>
            )}

          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-4 bg-white border-t border-[#f3f4f6]">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="px-5 py-2.5 rounded-[10px] border border-[#e5e7eb] text-[#4b5563] text-sm font-semibold cursor-pointer hover:bg-[#f9fafb] transition bg-white"
          >
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-[10px] border border-[#e5e7eb] text-[#4b5563] text-sm font-semibold cursor-pointer hover:bg-[#f9fafb] transition bg-white">
              Save Draft
            </button>
            <button
              onClick={() => step < 3 ? setStep(s => s + 1) : onClose()}
              className="px-8 py-2.5 rounded-[10px] text-white text-sm font-bold border-none cursor-pointer hover:opacity-90 transition-all"
              style={{ background: ORANGE, boxShadow: '0 4px 14px rgba(232,99,10,.3)' }}
            >
              {step < 3 ? `Next: ${STEPS[step].label} →` : (isEdit ? '✓ Update Groomer' : '✓ Save Groomer Details')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Groomer() {
  const [showForm, setShowForm]   = useState(false);
  const [editData, setEditData]   = useState(null);
  const [viewData, setViewData]   = useState(null);

  const handleEdit = (groomer) => { setEditData(groomer); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditData(null); };

  return (
    <>
      <FontImport />

      {viewData && (
        <ViewModal groomer={viewData} onClose={() => setViewData(null)} onEdit={handleEdit} />
      )}

      {showForm && (
        <GroomerModal onClose={handleCloseForm} initialData={editData} />
      )}

      <div className="p-6 bg-white min-h-full">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="font-syne text-xl font-bold text-[#1A1D2E]">Groomer</div>
            <div className="text-[13px] text-[#6B7280] mt-0.5">Manage grooming staff skills & service capabilities</div>
          </div>
          <button
            className="text-white border-none rounded-[10px] px-[22px] py-[11px] text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: ORANGE, boxShadow: '0 4px 14px rgba(232,99,10,.25)' }}
            onClick={() => { setEditData(null); setShowForm(true); }}
          >+ Add Groomer Details</button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))' }}>
          {groomers.map(g => (
            <div key={g.id} className="bg-white border border-[#EAE5DC] rounded-2xl p-5 transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: `${g.color}22`, border: `2px solid ${g.color}44`, color: g.color }}>{g.initials}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#1A1D2E]">{g.name}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{g.id} · {g.experience} yrs exp</div>
                </div>
                <span className={g.status === 'Active'
                  ? 'bg-green-100 text-green-500 text-[11px] font-semibold px-2.5 py-[3px] rounded-full'
                  : 'bg-red-50 text-red-400 text-[11px] font-semibold px-2.5 py-[3px] rounded-full'
                }>{g.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white border border-[#EAE5DC] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-[3px]">Shift</div>
                  <div className="text-xs font-semibold" style={{ color: PURPLE }}>{g.shift}</div>
                </div>
                <div className="bg-white border border-[#EAE5DC] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-[3px]">Certified</div>
                  <div className="text-xs font-semibold" style={{ color: g.certified ? '#22C55E' : '#EAB308' }}>{g.certified ? '✓ Yes' : '✗ No'}</div>
                </div>
              </div>

              {[
                { title: 'Species Handled', items: g.species, bg: 'rgba(168,85,247,.1)', color: PURPLE },
                { title: 'Services Offered', items: g.services, bg: 'rgba(232,99,10,.1)', color: ORANGE },
              ].map(({ title, items, bg, color }) => (
                <div className="mb-2.5" key={title}>
                  <div className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-1.5">{title}</div>
                  <div className="flex flex-wrap gap-1">
                    {items.map(s => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-[3px] rounded-[10px]"
                        style={{ background: bg, color }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3.5 border-t border-[#EAE5DC]">
                <button className="flex items-center justify-center gap-1.5 h-9 rounded-[9px] border border-[#EAE5DC] bg-white text-xs font-semibold text-[#6B7280] cursor-pointer transition-all hover:bg-[#f8f8f8]"
                  onClick={() => setViewData(g)}>👁 View Details</button>
                <button className="flex items-center justify-center gap-1.5 h-9 rounded-[9px] text-xs font-semibold cursor-pointer transition-all"
                  style={{ border: `1px solid rgba(232,99,10,.3)`, background: 'rgba(232,99,10,.06)', color: ORANGE }}
                  onClick={() => handleEdit(g)}>✏️ Edit Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}