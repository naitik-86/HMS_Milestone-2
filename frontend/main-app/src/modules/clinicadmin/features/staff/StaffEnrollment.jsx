import React, { useState, useEffect } from 'react';
import { roles, departments, employmentTypes, staffData } from '../../data/staff';

// --- Multi-step Enrollment Form (Full-Screen Fixed Panel) ---
function EnrollForm({ onClose, onSave, editData, mode }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', gender: '', dob: '', mobile: '', email: '', photo: null,
    emergencyName: '', emergencyContact: '',
    role: '', department: '', reportingTo: '', accessLevel: '', staffId: '', dateOfJoining: '', employmentType: '',
    username: '', accountActive: true, accountExpiry: '', forceReset: true,
    modules: []
  });

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        fullName: editData.name,
        staffId: editData.id,
        department: editData.dept,
        accountActive: editData.status === 'Active',
        employmentType: editData.employment,
        dateOfJoining: editData.joined,
        modules: editData.modules || ['OPD', 'Reports'],
        forceReset: true
      });
    } else {
      setForm(prev => ({ ...prev, staffId: 'STF' + Math.floor(Math.random() * 900 + 100) }));
    }
  }, [editData]);

  const update = (k, v) => {
    if (isView) return;
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const toggleModule = (m) => {
    if (isView) return;
    const current = [...form.modules];
    if (current.includes(m)) update('modules', current.filter(x => x !== m));
    else update('modules', [...current, m]);
  };

  const steps = [
    { label: 'Personal Information', short: 'Personal Info' },
    { label: 'Work & Access Assignment', short: 'Work & Access' },
    { label: 'Security & Credentials', short: 'Security' },
  ];

  const inputBase = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 transition-all bg-white placeholder-gray-300";
  const inputDisabled = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#6B7280] bg-[#F9FAFB] cursor-not-allowed outline-none";
  const inputReadonly = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#9CA3AF] bg-[#F3F4F6] font-mono outline-none";
  const labelClass = "block text-xs font-semibold text-[#6B7280] mb-2 tracking-wide";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17, 24, 39, 0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
        style={{ width: '1500px', height: '88vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── TOP HEADER STRIP ── */}
        <div className="px-10 pt-8 pb-6 border-b border-[#F3F4F6] flex-shrink-0">
          {/* Title row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E] leading-tight">
                {isView ? 'Staff Profile' : isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isView
                  ? `Viewing record for ${form.fullName || '—'}`
                  : isEdit
                  ? `Update details for ${form.fullName || '—'}`
                  : 'Enroll a new staff member into the clinic system.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
              style={{ fontSize: '18px', border: 'none', background: 'transparent' }}
            >
              ✕
            </button>
          </div>

          {/* ── STEPPER WITH NUMBERED CIRCLES ── */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => {
              const num = i + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2.5">
                    {/* Circle */}
                    <div
                      className="flex items-center justify-center rounded-full font-bold text-sm flex-shrink-0 transition-all"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: isDone ? '#E8630A' : isActive ? '#E8630A' : '#FEF3EB',
                        color: isDone || isActive ? '#FFFFFF' : '#E8630A',
                        border: isActive ? '2px solid #E8630A' : isDone ? '2px solid #E8630A' : '2px solid #FDDAB5',
                      }}
                    >
                      {isDone ? '✓' : num}
                    </div>
                    {/* Label */}
                    <span
                      className="text-sm font-semibold whitespace-nowrap"
                      style={{ color: isActive ? '#1A1D2E' : isDone ? '#E8630A' : '#9CA3AF' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className="flex-1 mx-4 rounded-full"
                      style={{
                        height: '2px',
                        backgroundColor: step > i + 1 ? '#E8630A' : '#E5E7EB',
                        minWidth: '60px',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── PILL TABS ── */}
          <div className="flex gap-2 mt-5">
            {steps.map((s, i) => {
              const num = i + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <button
                  key={i}
                  onClick={() => !isView && setStep(num)}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? '#E8630A' : isDone ? '#FEF3EB' : '#F3F4F6',
                    color: isActive ? '#FFFFFF' : isDone ? '#E8630A' : '#6B7280',
                    border: 'none',
                  }}
                >
                  {s.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SCROLLABLE FORM BODY ── */}
        <div className="flex-1 overflow-y-auto px-10 py-8">

          {/* ─── STEP 1: Personal Information ─── */}
          {step === 1 && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Personal Identity</h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name <span className="text-[#E8630A]">*</span></label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.fullName}
                      onChange={e => update('fullName', e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender <span className="text-[#E8630A]">*</span></label>
                    <select
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.gender}
                      onChange={e => update('gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Date of Birth <span className="text-[#E8630A]">*</span></label>
                  <input
                    className={isView ? inputDisabled : inputBase}
                    disabled={isView}
                    type="date"
                    value={form.dob}
                    onChange={e => update('dob', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mobile Number <span className="text-[#E8630A]">*</span></label>
                  <input
                    className={isView ? inputDisabled : inputBase}
                    disabled={isView}
                    type="tel"
                    value={form.mobile}
                    onChange={e => update('mobile', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address <span className="text-[#E8630A]">*</span></label>
                  <input
                    className={isView ? inputDisabled : inputBase}
                    disabled={isView}
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="e.g. john@clinic.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>Profile Photo</label>
                  {isView ? (
                    <div className={inputDisabled}>No photo uploaded</div>
                  ) : (
                    <div
                      className="w-full border border-dashed border-[#E8630A] rounded-xl py-3 px-4 text-sm text-[#E8630A] font-semibold text-center cursor-pointer hover:bg-[#FEF3EB] transition-colors"
                      onClick={() => document.getElementById('photoUpload').click()}
                    >
                      Upload File
                      <input id="photoUpload" type="file" accept="image/*" className="hidden"
                        onChange={e => update('photo', e.target.files[0])} />
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-5">Emergency Contact Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Contact Person Name</label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.emergencyName}
                      onChange={e => update('emergencyName', e.target.value)}
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.emergencyContact}
                      onChange={e => update('emergencyContact', e.target.value)}
                      placeholder="e.g. +91 98765 00000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Work & Access ─── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Professional Placement Card */}
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Professional Placement</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Role <span className="text-[#E8630A]">*</span></label>
                    <select
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.role}
                      onChange={e => update('role', e.target.value)}
                    >
                      <option value="">Select</option>
                      {roles.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Department</label>
                    <select
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.department}
                      onChange={e => update('department', e.target.value)}
                    >
                      <option value="">Select</option>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Reporting Manager</label>
                    <select
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.reportingTo}
                      onChange={e => update('reportingTo', e.target.value)}
                    >
                      <option value="">Select Manager</option>
                      {staffData.map(s => <option key={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Staff ID <span className="text-[#9CA3AF] font-normal">(System Generated)</span></label>
                    <input className={inputReadonly} readOnly value={form.staffId} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Joining <span className="text-[#E8630A]">*</span></label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      type="date"
                      value={form.dateOfJoining}
                      onChange={e => update('dateOfJoining', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Employment Type</label>
                    <select
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.employmentType}
                      onChange={e => update('employmentType', e.target.value)}
                    >
                      <option value="">Select</option>
                      {employmentTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Module Access Card */}
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-2">Module Access Permissions</h3>
                <p className="text-sm text-gray-400 mb-6">Select the modules this staff member should have access to.</p>
                <div className="flex flex-wrap gap-3">
                  {['OPD', 'Lab', 'Pharmacy', 'Grooming', 'Kennel', 'Reports', 'Billing', 'Settings'].map(m => (
                    <div
                      key={m}
                      onClick={() => toggleModule(m)}
                      className="flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all"
                      style={{
                        cursor: isView ? 'default' : 'pointer',
                        borderColor: form.modules.includes(m) ? '#E8630A' : '#E5E7EB',
                        backgroundColor: form.modules.includes(m) ? '#FEF3EB' : '#FFFFFF',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.modules.includes(m)}
                        readOnly
                        className="accent-[#E8630A]"
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: form.modules.includes(m) ? '#E8630A' : '#6B7280' }}
                      >
                        {m}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Security & Credentials ─── */}
          {step === 3 && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1D2E] mb-6">System Credentials</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    className={inputDisabled}
                    value={form.fullName ? form.fullName.toLowerCase().replace(/\s+/g, '.') : ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className={labelClass}>Temporary Password</label>
                  <input className={inputReadonly} value="••••••••••••" readOnly />
                </div>
                <div>
                  <label className={labelClass}>Account Expiry Date</label>
                  <input
                    className={isView ? inputDisabled : inputBase}
                    disabled={isView}
                    type="date"
                    value={form.accountExpiry}
                    onChange={e => update('accountExpiry', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4 max-w-xl">
                {/* Force Password Reset */}
                <div
                  className="flex items-center justify-between p-5 border border-[#F3F4F6] rounded-2xl"
                  style={{ backgroundColor: '#FAFAFA' }}
                >
                  <div>
                    <div className="font-semibold text-[#1A1D2E] text-sm">Force Password Reset</div>
                    <div className="text-xs text-gray-400 mt-0.5">User must change password on first login</div>
                  </div>
                  <div
                    onClick={() => !isView && update('forceReset', !form.forceReset)}
                    className="relative rounded-full transition-colors flex-shrink-0"
                    style={{
                      width: '46px', height: '24px',
                      backgroundColor: form.forceReset ? '#22C55E' : '#D1D5DB',
                      cursor: isView ? 'default' : 'pointer',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                      style={{ left: form.forceReset ? '23px' : '3px' }}
                    />
                  </div>
                </div>

                {/* Account Status */}
                <div
                  className="flex items-center justify-between p-5 border border-[#F3F4F6] rounded-2xl"
                  style={{ backgroundColor: '#FAFAFA' }}
                >
                  <div>
                    <div className="font-semibold text-[#1A1D2E] text-sm">Account Status</div>
                    <div className="text-xs text-gray-400 mt-0.5">Enable or disable system access for this member</div>
                  </div>
                  <div
                    onClick={() => !isView && update('accountActive', !form.accountActive)}
                    className="relative rounded-full transition-colors flex-shrink-0"
                    style={{
                      width: '46px', height: '24px',
                      backgroundColor: form.accountActive ? '#22C55E' : '#D1D5DB',
                      cursor: isView ? 'default' : 'pointer',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                      style={{ left: form.accountActive ? '23px' : '3px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div
          className="px-10 py-5 flex items-center justify-between flex-shrink-0"
          style={{ borderTop: '1px solid #F3F4F6', backgroundColor: '#FFFFFF' }}
        >
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              color: '#374151',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            {step > 1 ? '← Previous' : 'Cancel'}
          </button>

          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else if (!isView) onSave(form);
              else onClose();
            }}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: '#E8630A', border: 'none' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D05A09'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#E8630A'}
          >
            {isView
              ? 'Close'
              : step < 3
              ? 'Next →'
              : isEdit
              ? '✓ Update Staff'
              : '✓ Save Staff Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function StaffEnrollment() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState(staffData);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = staff.filter(s =>
    (!filterRole || s.role === filterRole) &&
    (!filterStatus || s.status === filterStatus)
  );

  const handleOpenCreate = () => {
    setSelectedStaff(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedStaff(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleOpenView = (item) => {
    setSelectedStaff(item);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSave = (form) => {
    if (modalMode === 'edit') {
      setStaff(prev => prev.map(s => s.id === form.staffId ? {
        ...s,
        name: form.fullName,
        role: form.role,
        dept: form.department || 'N/A',
        status: form.accountActive ? 'Active' : 'Inactive',
        employment: form.employmentType,
        joined: form.dateOfJoining
      } : s));
    } else {
      const newStaff = {
        id: form.staffId,
        name: form.fullName,
        role: form.role,
        dept: form.department || 'N/A',
        status: form.accountActive ? 'Active' : 'Inactive',
        joined: form.dateOfJoining || new Date().toISOString().split('T')[0],
        initials: form.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        color: '#E8630A',
        employment: form.employmentType || 'Full-time',
      };
      setStaff([newStaff, ...staff]);
    }
    setShowModal(false);
  };

  const filterSelectClass = "w-full border border-[#EAE5DC] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] bg-white outline-none focus:border-[#E8630A] focus:ring-1 focus:ring-[#E8630A] transition-colors";

  return (
    <div className="px-16 py-10 bg-white min-h-screen">
      {showModal && (
        <EnrollForm
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editData={selectedStaff}
          mode={modalMode}
        />
      )}

      {/* Title Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-['Syne'] text-4xl font-extrabold text-[#1A1D2E] mb-2">Staff Directory</h1>
          <p className="text-gray-500 text-base">Manage clinic personnel, access levels, and account credentials.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-7 py-3.5 bg-[#E8630A] text-white text-[15px] font-semibold rounded-xl hover:bg-[#d05a09] transition-colors cursor-pointer"
          style={{ border: 'none' }}
        >
          + Enroll New Staff
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex gap-4 mb-8 p-6 bg-gray-50 rounded-2xl border border-[#EAE5DC]">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Filter by Role
          </label>
          <select
            className={filterSelectClass}
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="">All Staff Roles</option>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Filter by Status
          </label>
          <select
            className={filterSelectClass}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Account Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#EAE5DC] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-[#EAE5DC]">
              {['STAFF MEMBER', 'STAFF ID', 'ROLE / DEPT', 'EMPLOYMENT', 'STATUS', 'JOINED DATE', 'ACTIONS'].map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-5 text-xs font-semibold text-gray-500 tracking-wide ${i === 6 ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      {s.initials}
                    </div>
                    <div className="font-bold text-[#1A1D2E] text-[15px]">{s.name}</div>
                  </div>
                </td>
                <td className="px-5 py-5 font-mono text-gray-500 text-sm">{s.id}</td>
                <td className="px-5 py-5">
                  <div className="text-[#1A1D2E] font-semibold text-sm">{s.role}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{s.dept}</div>
                </td>
                <td className="px-5 py-5 text-gray-600 text-sm">{s.employment}</td>
                <td className="px-5 py-5">
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: s.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                      color: s.status === 'Active' ? '#16A34A' : '#6B7280',
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-5 text-gray-500 text-sm">{s.joined}</td>
                <td className="px-5 py-5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleOpenView(s)}
                      className="bg-white border border-[#EAE5DC] px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold text-[#1A1D2E] hover:bg-gray-50 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="bg-white border border-[#EAE5DC] px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold text-[#E8630A] hover:bg-[#FEF3EB] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}