import React, { useState } from 'react';
import { labTests, labShifts, labStaff } from '../../data/lab';

function LabForm({ onClose, onSave, editData, mode }) {
  const isView = mode === 'view';

  const [form, setForm] = useState({
    qualification: editData?.qualification || '',
    experience: editData?.experience || '',
    shift: editData?.shift || '',
    selectedTests: editData?.specializedTests || [],
    certificate: null,
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.qualification.trim()) e.qualification = 'Qualification is required';
    if (!form.experience || form.experience <= 0) e.experience = 'Enter valid years of experience';
    if (!form.shift) e.shift = 'Please select a shift';
    if (form.selectedTests.length === 0) e.selectedTests = 'Select at least one test';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      qualification: form.qualification,
      experience: Number(form.experience),
      shift: form.shift,
      specializedTests: form.selectedTests,
    });
  };

  const inputBase = "w-full border border-[#EAE5DC] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-[#E8630A] focus:ring-1 focus:ring-[#E8630A] transition-colors bg-white";
  const inputDisabled = "w-full border border-[#EAE5DC] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] bg-gray-50 cursor-not-allowed outline-none";
  const inputError = "w-full border border-red-400 rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400 transition-colors bg-white";
  const labelClass = "block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="inline-block bg-[#E8630A]/10 text-[#E8630A] text-[11px] font-bold px-3 py-1 rounded-full mb-2">
            Only Visible When Role is Lab Technician
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E]">
            {isView ? 'Lab Technician Profile' : mode === 'edit' ? 'Edit Lab Technician' : 'Lab Technician Details'}
          </h2>
          <p className="text-gray-500 text-xs mt-1">Section 3 → 3.1 Lab Qualifications</p>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-100 border-none text-gray-500 w-10 h-10 rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-6">

          {/* Qualification */}
          <div>
            <label className={labelClass}>Qualification / Diploma</label>
            <input
              className={isView ? inputDisabled : errors.qualification ? inputError : inputBase}
              disabled={isView}
              value={form.qualification}
              onChange={e => update('qualification', e.target.value)}
              placeholder="e.g. B.Sc. MLT, Diploma in Lab Technology"
            />
            {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
          </div>

          {/* Certificate */}
          <div>
            <label className={labelClass}>Certificate (upload)</label>
            {isView ? (
              <div className={inputDisabled + " flex items-center gap-2 text-gray-400"}>
                <span>📄</span> certificate_uploaded.pdf
              </div>
            ) : (
              <input
                className={inputBase + " file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E8630A]/10 file:text-[#E8630A] hover:file:bg-[#E8630A]/20 cursor-pointer"}
                type="file"
                accept=".pdf,image/*"
                onChange={e => update('certificate', e.target.files[0])}
              />
            )}
          </div>

          {/* Experience */}
          <div>
            <label className={labelClass}>Years of Lab Experience</label>
            <input
              className={isView ? inputDisabled : errors.experience ? inputError : inputBase}
              disabled={isView}
              type="number"
              value={form.experience}
              onChange={e => update('experience', e.target.value)}
              placeholder="e.g. 5"
              min="0"
            />
            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
          </div>

          {/* Specialized Tests */}
          <div>
            <label className={labelClass}>Specialized Tests Handled</label>
            <div className="flex flex-wrap gap-2">
              {labTests.map(t => (
                <label
                  key={t}
                  className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isView ? 'cursor-default' : 'cursor-pointer'
                  } ${
                    form.selectedTests.includes(t)
                      ? 'bg-[#E8630A]/10 border-[#E8630A] text-[#E8630A]'
                      : 'bg-white border-[#EAE5DC] text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.selectedTests.includes(t)}
                    disabled={isView}
                    onChange={() => {
                      if (isView) return;
                      const current = form.selectedTests;
                      update('selectedTests',
                        current.includes(t)
                          ? current.filter(x => x !== t)
                          : [...current, t]
                      );
                    }}
                    className="accent-[#E8630A]"
                  />
                  {t}
                </label>
              ))}
            </div>
            {errors.selectedTests && <p className="text-red-500 text-xs mt-2">{errors.selectedTests}</p>}
          </div>

          {/* Lab Shift */}
          <div>
            <label className={labelClass}>Lab Shift</label>
            <select
              className={isView ? inputDisabled : errors.shift ? inputError : inputBase}
              disabled={isView}
              value={form.shift}
              onChange={e => update('shift', e.target.value)}
            >
              <option value="">Select Shift</option>
              {labShifts.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift}</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#EAE5DC] flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-white border border-[#EAE5DC] text-[#1A1D2E] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {isView ? 'Close' : 'Cancel'}
        </button>
        {!isView && (
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#E8630A] text-white text-sm font-semibold rounded-xl hover:bg-[#d05a09] transition-colors cursor-pointer"
          >
            {mode === 'edit' ? '✓ Update Lab Details' : 'Save Lab Details'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LabTechnician() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState(labStaff);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleSave = (formData) => {
    if (modalMode === 'edit') {
      setStaff(prev => prev.map(s =>
        s.id === selectedStaff.id
          ? { ...s, ...formData }
          : s
      ));
      showToast('Lab technician details updated successfully!');
    } else {
      const newEntry = {
        id: 'LT' + Math.floor(Math.random() * 900 + 100),
        name: 'New Technician',
        initials: 'NT',
        color: '#E8630A',
        status: 'Active',
        ...formData,
      };
      setStaff(prev => [newEntry, ...prev]);
      showToast('Lab technician added successfully!');
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[2000] px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2 transition-all ${
            toast.type === 'success'
              ? 'bg-[#E8630A] text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-[#1A1D2E]/80 flex justify-center items-center z-[1000] backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white border border-[#EAE5DC] rounded-3xl flex flex-col p-10 shadow-2xl relative overflow-hidden"
            style={{ width: '1500px', height: '88vh' }}
          >
            <LabForm
              onClose={() => setShowModal(false)}
              onSave={handleSave}
              editData={selectedStaff}
              mode={modalMode}
            />
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-['Syne'] text-2xl font-bold text-[#1A1D2E]">Lab Technician</h2>
          <p className="text-gray-500 text-sm mt-1">Manage lab staff qualifications & test capabilities</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-[#E8630A] text-white text-sm font-semibold rounded-xl hover:bg-[#d05a09] transition-colors cursor-pointer"
        >
          + Add Lab Details
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {staff.map(l => (
          <div
            key={l.id}
            className="bg-white border border-[#EAE5DC] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: `${l.color}22`, border: `2px solid ${l.color}44`, color: l.color }}
              >
                {l.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1A1D2E] truncate">{l.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{l.id} · {l.qualification}</div>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                  l.status === 'Active'
                    ? 'bg-[#E8630A]/10 text-[#E8630A]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {l.status}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Experience</div>
                <div className="text-xs text-[#1A1D2E] font-semibold">{l.experience} years</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Shift</div>
                <div className="text-xs text-[#E8630A] font-semibold">{l.shift}</div>
              </div>
            </div>

            {/* Specialized Tests */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Specialized Tests</div>
              <div className="flex flex-wrap gap-1.5">
                {l.specializedTests.map(t => (
                  <span
                    key={t}
                    className="bg-[#E8630A]/10 text-[#E8630A] text-[10px] font-semibold px-2 py-1 rounded-lg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-[#EAE5DC]">
              <button
                onClick={() => handleOpenView(l)}
                className="flex-1 bg-white border border-[#EAE5DC] text-[#1A1D2E] text-xs font-semibold py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                View
              </button>
              <button
                onClick={() => handleOpenEdit(l)}
                className="flex-1 bg-white border border-[#EAE5DC] text-[#E8630A] text-xs font-semibold py-2 rounded-xl hover:bg-[#E8630A]/5 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}