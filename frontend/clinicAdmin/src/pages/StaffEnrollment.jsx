import React, { useState, useRef, useCallback } from 'react';

const roles = ['Clinic Admin', 'Receptionist', 'Pre-consultation Staff', 'Doctor', 'Lab Technician', 'Groomer', 'Kennel Staff', 'Pharmacist'];
const departments = ['OPD', 'Surgery', 'Lab', 'ICU', 'Grooming', 'Kennel'];
const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Visiting', 'Locum'];
const modules = ['OPD', 'Lab', 'Pharmacy', 'Grooming', 'Kennel', 'Reports', 'Billing', 'Settings'];

const avatarColorMap = {
  '#6366F1': 'bg-indigo-100 border-indigo-200 text-indigo-500',
  '#22C55E': 'bg-green-100 border-green-200 text-green-600',
  '#A855F7': 'bg-purple-100 border-purple-200 text-purple-500',
  '#F97316': 'bg-orange-100 border-orange-200 text-orange-500',
  '#EC4899': 'bg-pink-100 border-pink-200 text-pink-500',
  '#06B6D4': 'bg-cyan-100 border-cyan-200 text-cyan-500',
  '#E8630A': 'bg-orange-100 border-orange-200 text-orange-600',
};

const initialStaffData = [
  { id: 'STF001', name: 'Dr. Priya Sharma', role: 'Doctor', dept: 'OPD', status: 'Active', joined: '2024-01-15', initials: 'DP', color: '#6366F1', employment: 'Full-time', gender: 'Female', mobile: '9876543210', email: 'priya.sharma@clinic.com', emergencyName: 'Ramesh Sharma', emergencyContact: '9876500001', reportingTo: '', accountActive: true, accountExpiry: '', moduleAccess: ['OPD', 'Reports'], photo: null },
  { id: 'STF002', name: 'Rahul Mehta', role: 'Lab Technician', dept: 'Lab', status: 'Active', joined: '2024-02-20', initials: 'RM', color: '#22C55E', employment: 'Full-time', gender: 'Male', mobile: '9123456789', email: 'rahul.mehta@clinic.com', emergencyName: 'Sita Mehta', emergencyContact: '9123400001', reportingTo: '', accountActive: true, accountExpiry: '', moduleAccess: ['Lab'], photo: null },
  { id: 'STF003', name: 'Sunita Rao', role: 'Groomer', dept: 'Grooming', status: 'Active', joined: '2024-03-10', initials: 'SR', color: '#A855F7', employment: 'Part-time', gender: 'Female', mobile: '9988776655', email: 'sunita.rao@clinic.com', emergencyName: 'Suresh Rao', emergencyContact: '9988700001', reportingTo: '', accountActive: true, accountExpiry: '', moduleAccess: ['Grooming'], photo: null },
  { id: 'STF004', name: 'Amit Verma', role: 'Kennel Staff', dept: 'Kennel', status: 'Active', joined: '2024-03-22', initials: 'AV', color: '#F97316', employment: 'Full-time', gender: 'Male', mobile: '9911223344', email: 'amit.verma@clinic.com', emergencyName: 'Kavita Verma', emergencyContact: '9911200001', reportingTo: '', accountActive: true, accountExpiry: '', moduleAccess: ['Kennel'], photo: null },
  { id: 'STF005', name: 'Neha Kapoor', role: 'Receptionist', dept: 'Front Desk', status: 'Inactive', joined: '2023-11-05', initials: 'NK', color: '#EC4899', employment: 'Contract', gender: 'Female', mobile: '9800012345', email: 'neha.kapoor@clinic.com', emergencyName: 'Anil Kapoor', emergencyContact: '9800000001', reportingTo: '', accountActive: false, accountExpiry: '2024-12-31', moduleAccess: ['OPD', 'Billing'], photo: null },
  { id: 'STF006', name: 'Dr. Arjun Nair', role: 'Doctor', dept: 'Surgery', status: 'Active', joined: '2023-08-18', initials: 'AN', color: '#06B6D4', employment: 'Full-time', gender: 'Male', mobile: '9700123456', email: 'arjun.nair@clinic.com', emergencyName: 'Maya Nair', emergencyContact: '9700100001', reportingTo: '', accountActive: true, accountExpiry: '', moduleAccess: ['OPD', 'Lab', 'Reports'], photo: null },
];

/* ─── Primitive UI ─── */
function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 mb-1.5">{children}</label>;
}

function Input({ className = '', readOnly, ...rest }) {
  return (
    <input
      readOnly={readOnly}
      {...rest}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
        placeholder-gray-300 transition
        ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}
        ${className}`}
    />
  );
}

function Sel({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition
        ${props.className || ''}`}
    >
      {children}
    </select>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0
        ${on ? 'bg-green-400' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function Avatar({ initials, color, size = 'sm', photo }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-lg' : 'w-9 h-9 text-xs';
  const colorClasses = avatarColorMap[color] || 'bg-orange-100 border-orange-200 text-orange-500';
  if (photo) return <img src={photo} alt={initials} className={`${sz} rounded-full object-cover flex-shrink-0 border-2 ${colorClasses.split(' ')[1]}`} />;
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 ${colorClasses}`}>
      {initials}
    </div>
  );
}

/* ─── Photo Upload ─── */
function PhotoUpload({ value, onChange }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const processFile = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Only JPG, PNG, WEBP allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]); }, []);

  if (value) {
    return (
      <div className="flex items-center gap-4 border border-orange-200 rounded-xl p-3 bg-orange-50">
        <img src={value} alt="Staff" className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700 mb-2">Photo uploaded ✓</p>
          <div className="flex gap-2">
            <button onClick={() => inputRef.current.click()} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-600 bg-white hover:bg-orange-50 transition">Replace</button>
            <button onClick={() => onChange(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition">Remove</button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => processFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
          ${dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'}`}
      >
        <span className="block text-2xl mb-1">📷</span>
        <span className="block font-semibold text-gray-500 text-sm mb-0.5">Upload File</span>
        <span className="block text-xs text-gray-400">JPG, PNG, WEBP · up to 5MB</span>
      </div>
      {error && <p className="text-xs text-red-500 font-semibold mt-1.5">{error}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => processFile(e.target.files?.[0])} />
    </div>
  );
}

/* ─── STEPS CONFIG ─── */
const STEPS = [
  { idx: 1, label: 'Personal Info' },
  { idx: 2, label: 'Roles & Access' },
  { idx: 3, label: 'Account Setup' },
];

/* ─── ENROLL PANEL — Centered modal matching Add Clinic reference ─── */
function EnrollPanel({ onClose, onSave, initialData = null }) {
  const isEdit = !!initialData;
  const [step, setStep] = useState(1);
  const [moduleAccess, setModuleAccess] = useState(initialData?.moduleAccess || []);
  const [photo, setPhoto] = useState(initialData?.photo || null);
  const [form, setForm] = useState({
    fullName: initialData?.name || '',
    gender: initialData?.gender || '',
    dob: initialData?.dob || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    emergencyName: initialData?.emergencyName || '',
    emergencyContact: initialData?.emergencyContact || '',
    role: initialData?.role || '',
    department: initialData?.dept || '',
    reportingTo: initialData?.reportingTo || '',
    staffId: initialData?.id || ('STF' + Math.floor(Math.random() * 900 + 100)),
    dateOfJoining: initialData?.joined || '',
    employmentType: initialData?.employment || '',
    accountActive: initialData?.accountActive ?? true,
    accountExpiry: initialData?.accountExpiry || '',
    forceReset: !isEdit,
  });

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleModule = (m) => setModuleAccess(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      {/*
        Modal: matches the Add Clinic reference —
        white bg, rounded-2xl, max-w-5xl, fixed tall height, flex column
      */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '100%', maxWidth: '1500px', height: '88vh', maxHeight: '820px' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header: white, no border at bottom ── */}
        <div className="flex-shrink-0 px-10 pt-7 pb-0 bg-white">

          {/* Title + close */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-orange-500">
                {isEdit ? `Edit Staff — ${initialData.name}` : 'Enroll New Staff'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {isEdit ? 'Update staff member details and access permissions.' : 'Register a new staff member in the system.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition text-xl leading-none mt-0.5"
            >
              ×
            </button>
          </div>

          {/* ── Step progress: numbered circles + connecting lines (matches reference exactly) ── */}
          <div className="flex items-center mb-4">
            {STEPS.map(({ idx, label }, i) => {
              const done = step > idx;
              const active = step === idx;
              return (
                <React.Fragment key={idx}>
                  <div
                    className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
                    onClick={() => setStep(idx)}
                  >
                    {/* Circle */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all flex-shrink-0
                        ${done
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : active
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-orange-50 border-orange-200 text-orange-400'
                        }`}
                    >
                      {done ? '✓' : idx}
                    </div>
                    {/* Label */}
                    <p className={`text-sm font-semibold whitespace-nowrap leading-tight
                      ${active ? 'text-gray-900' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {label}
                    </p>
                  </div>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${step > idx ? 'bg-orange-400' : 'bg-orange-100'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── Tab pills row (like the reference tabs) ── */}
          <div className="flex gap-2 pb-4">
            {STEPS.map(({ idx, label }) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border
                  ${step === idx
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Gray scrollable content area (matches reference) ── */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-10 py-5">
          {/* White card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-6">

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-5">Personal Information</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input placeholder="Enter full legal name" value={form.fullName} onChange={e => update('fullName', e.target.value)} />
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <Sel value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </Sel>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <Label>Mobile Number *</Label>
                    <Input placeholder="10-digit number" type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
                  </div>
                  <div>
                    <Label>Email Address *</Label>
                    <Input type="email" placeholder="email@clinic.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <Label>Emergency Contact Name</Label>
                    <Input placeholder="Full name" value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)} />
                  </div>
                  <div>
                    <Label>Emergency Contact Number</Label>
                    <Input placeholder="Phone number" value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)} />
                  </div>
                  <div>
                    <Label>Profile Photo</Label>
                    <PhotoUpload value={photo} onChange={setPhoto} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Roles & Access ── */}
            {step === 2 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-5">Roles & Access Assignment</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-7">
                  <div>
                    <Label>Role *</Label>
                    <Sel value={form.role} onChange={e => update('role', e.target.value)}>
                      <option value="">Select Role</option>
                      {roles.map(r => <option key={r}>{r}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Sel value={form.department} onChange={e => update('department', e.target.value)}>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <Label>Employment Type *</Label>
                    <Sel value={form.employmentType} onChange={e => update('employmentType', e.target.value)}>
                      <option value="">Select Type</option>
                      {employmentTypes.map(t => <option key={t}>{t}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <Label>Reporting To (Manager)</Label>
                    <Sel value={form.reportingTo} onChange={e => update('reportingTo', e.target.value)}>
                      <option value="">Select Manager</option>
                      {initialStaffData.filter(s => s.role === 'Doctor' || s.role === 'Clinic Admin').map(s => <option key={s.id}>{s.name}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <Label>Date of Joining *</Label>
                    <Input type="date" value={form.dateOfJoining} onChange={e => update('dateOfJoining', e.target.value)} />
                  </div>
                  <div>
                    <Label>Staff ID <span className="text-gray-300 font-normal">(auto-generated)</span></Label>
                    <Input value={form.staffId} readOnly />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-1.5">Module Access</h3>
                <p className="text-xs text-gray-400 mb-3">Select modules this staff member can access.</p>
                <div className="grid grid-cols-4 gap-3">
                  {modules.map(m => {
                    const selected = moduleAccess.includes(m);
                    return (
                      <button
                        key={m}
                        onClick={() => toggleModule(m)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                          ${selected
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'}`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] flex-shrink-0 border
                          ${selected ? 'bg-white/30 border-white/40 text-white' : 'bg-gray-100 border-gray-200'}`}>
                          {selected ? '✓' : ''}
                        </span>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 3: Account Setup ── */}
            {step === 3 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-5">Account Credentials</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-7">
                  <div>
                    <Label>Login Username <span className="text-gray-300 font-normal">(auto-suggested)</span></Label>
                    <Input value={form.fullName ? form.fullName.toLowerCase().replace(/\s+/g, '.') : ''} placeholder="username.auto" readOnly />
                  </div>
                  <div>
                    <Label>Temporary Password <span className="text-gray-300 font-normal">(auto-generated)</span></Label>
                    <div className="relative">
                      <Input value="••••••••••••" readOnly />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500 font-bold cursor-pointer hover:text-orange-600">Show</span>
                    </div>
                  </div>
                  <div>
                    <Label>Account Expiry Date <span className="text-gray-300 font-normal">(contract/locum)</span></Label>
                    <Input type="date" value={form.accountExpiry} onChange={e => update('accountExpiry', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-3">Account Settings</h3>
                <div className="grid grid-cols-2 gap-4 mb-7">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Force Password Reset</p>
                      <p className="text-xs text-gray-400 mt-0.5">Required on first sign-in</p>
                    </div>
                    <Toggle on={form.forceReset} onToggle={() => update('forceReset', !form.forceReset)} />
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Account Active</p>
                      <p className="text-xs text-gray-400 mt-0.5">Inactive accounts cannot log in</p>
                    </div>
                    <Toggle on={form.accountActive} onToggle={() => update('accountActive', !form.accountActive)} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-3">Enrollment Summary</h3>
                {photo && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                    <img src={photo} alt="Staff" className="w-12 h-12 rounded-lg object-cover border-2 border-orange-200 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{form.fullName || 'Staff Member'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Profile photo attached ✓</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['Full Name', form.fullName || '—'], ['Role', form.role || '—'], ['Department', form.department || '—'],
                    ['Staff ID', form.staffId], ['Employment', form.employmentType || '—'], ['Date of Joining', form.dateOfJoining || '—'],
                    ['Gender', form.gender || '—'], ['Mobile', form.mobile || '—'], ['Email', form.email || '—'],
                    ['Emergency Contact', form.emergencyName || '—'], ['Emergency Phone', form.emergencyContact || '—'],
                    ['Account Status', form.accountActive ? 'Active' : 'Inactive'],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-0.5">{k}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{v}</p>
                    </div>
                  ))}
                </div>
                {moduleAccess.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Module Access</p>
                    <div className="flex flex-wrap gap-2">
                      {moduleAccess.map(m => (
                        <span key={m} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-100 text-orange-600 border border-orange-200">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: white, border-top, Back/Cancel left + Next/Save right ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-4 bg-white border-t border-gray-100">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(step + 1) : onSave({ ...form, moduleAccess, photo })}
            className="px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md transition-all"
          >
            {step < 3 ? 'Next →' : (isEdit ? '✓ Save Changes' : '✓ Enroll Staff')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── View Modal ── */
function ViewModal({ staff, onClose, onEdit }) {
  const infoItems = [
    ['Staff ID', staff.id], ['Role', staff.role], ['Department', staff.dept],
    ['Employment', staff.employment], ['Status', staff.status], ['Date Joined', staff.joined],
    ['Mobile', staff.mobile || '—'], ['Email', staff.email || '—'], ['Gender', staff.gender || '—'],
    ['Emergency Contact', staff.emergencyName ? `${staff.emergencyName} (${staff.emergencyContact})` : '—'],
    ['Reporting To', staff.reportingTo || '—'], ['Account Expiry', staff.accountExpiry || 'N/A'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-8" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[calc(100vh-64px)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start px-8 pt-7 pb-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Avatar initials={staff.initials} color={staff.color} size="lg" photo={staff.photo} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{staff.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{staff.role} · {staff.dept}</p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mt-2 ${staff.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />{staff.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-lg">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="grid grid-cols-3 gap-3">
            {infoItems.map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k}</p>
                <p className="text-sm font-semibold text-gray-800 break-all">{v}</p>
              </div>
            ))}
          </div>
          {staff.moduleAccess && staff.moduleAccess.length > 0 && (
            <div className="mt-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Module Access</p>
              <div className="flex flex-wrap gap-2">
                {staff.moduleAccess.map(m => (
                  <span key={m} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-8 py-4 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Close</button>
          <button onClick={onEdit} className="px-7 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md transition-all">✏️ Edit Staff</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function StaffEnrollment() {
  const [staff, setStaff] = useState(initialStaffData);
  const [modal, setModal] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const filtered = staff.filter(s =>
    (!filterRole || s.role === filterRole) &&
    (!filterStatus || s.status === filterStatus) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (form) => {
    const isEdit = modal?.type === 'edit';
    if (isEdit) {
      setStaff(prev => prev.map(s => s.id === modal.staff.id ? {
        ...s,
        name: form.fullName || s.name, role: form.role || s.role, dept: form.department || s.dept,
        status: form.accountActive ? 'Active' : 'Inactive', joined: form.dateOfJoining || s.joined,
        employment: form.employmentType || s.employment, gender: form.gender || s.gender,
        mobile: form.mobile || s.mobile, email: form.email || s.email,
        emergencyName: form.emergencyName, emergencyContact: form.emergencyContact,
        reportingTo: form.reportingTo, accountActive: form.accountActive,
        accountExpiry: form.accountExpiry, moduleAccess: form.moduleAccess, photo: form.photo,
        initials: form.fullName ? form.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : s.initials,
      } : s));
    } else {
      setStaff(prev => [{
        id: form.staffId, name: form.fullName || 'Unnamed Staff',
        role: form.role || 'N/A', dept: form.department || 'N/A',
        status: form.accountActive ? 'Active' : 'Inactive', joined: form.dateOfJoining || '—',
        initials: form.fullName ? form.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NS',
        color: '#E8630A', employment: form.employmentType || 'N/A',
        gender: form.gender, mobile: form.mobile, email: form.email,
        emergencyName: form.emergencyName, emergencyContact: form.emergencyContact,
        reportingTo: form.reportingTo, accountActive: form.accountActive,
        accountExpiry: form.accountExpiry, moduleAccess: form.moduleAccess || [], photo: form.photo || null,
      }, ...prev]);
    }
    setModal(null);
  };

  const stats = [
    { label: 'Total Staff', value: staff.length, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Active', value: staff.filter(s => s.status === 'Active').length, icon: '✅', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Inactive', value: staff.filter(s => s.status === 'Inactive').length, icon: '⏸️', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' },
    { label: 'Doctors', value: staff.filter(s => s.role === 'Doctor').length, icon: '🩺', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {(modal?.type === 'enroll' || modal?.type === 'edit') && (
        <EnrollPanel onClose={() => setModal(null)} onSave={handleSave} initialData={modal?.staff || null} />
      )}
      {modal?.type === 'view' && (
        <ViewModal staff={modal.staff} onClose={() => setModal(null)} onEdit={() => setModal({ type: 'edit', staff: modal.staff })} />
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Enrollment</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, enroll, and track all clinic staff members</p>
        </div>
        <button
          onClick={() => setModal({ type: 'enroll' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          + Enroll New Staff
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white border-2 ${s.border} rounded-2xl p-5 shadow-sm flex items-center gap-4`}>
            <div className={`${s.bg} w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className={`text-3xl font-black ${s.color} leading-none`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option><option>Inactive</option>
        </select>
        {(filterRole || filterStatus || search) && (
          <button onClick={() => { setFilterRole(''); setFilterStatus(''); setSearch(''); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition">✕ Clear</button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Staff Member', 'Staff ID', 'Role', 'Department', 'Employment', 'Status', 'Date Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-4 text-left text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-sm text-gray-400">No staff members match your filters.</td></tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-orange-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.initials} color={s.color} photo={s.photo} />
                      <span className="text-sm font-bold text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="text-xs font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{s.id}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-semibold">{s.role}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{s.dept}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.employment === 'Full-time' ? 'bg-blue-50 text-blue-600' : s.employment === 'Part-time' ? 'bg-purple-50 text-purple-600' : s.employment === 'Contract' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.employment}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />{s.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{s.joined}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ type: 'view', staff: s })} className="text-xs font-bold text-orange-500 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-lg px-3 py-1.5 transition">View</button>
                      <button onClick={() => setModal({ type: 'edit', staff: s })} className="text-xs font-bold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-3 py-1.5 transition">Edit</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing <span className="font-bold text-gray-600">{filtered.length}</span> of <span className="font-bold text-gray-600">{staff.length}</span> staff members</p>
          <p className="text-xs text-gray-400">ClinicAdmin — Staff Registry</p>
        </div>
      </div>
    </div>
  );
}