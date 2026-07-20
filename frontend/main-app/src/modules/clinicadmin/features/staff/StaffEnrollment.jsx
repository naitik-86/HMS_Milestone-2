import React, { useState, useEffect } from 'react';
import { showToast } from '../../../../shared/components/toast';
import ViewStaffModal from "./ViewStaffModal";
import { roles, departments, employmentTypes, staffData } from '../../data/staff';
import Loader from '../../../../shared/components/Loader';

import {
  createStaff,
  updateStaff,
  deleteStaff,
  getManagers,
  getStaff,
  getStaffById,
} from '../../api/staffApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const digitsOnly = (value, max = 10) => value.replace(/\D/g, "").slice(0, max);
const isFutureDate = (value) => value && new Date(value) > new Date();
const isImageFile = (file) => file?.type?.startsWith("image/");

// --- Multi-step Enrollment Form (Full-Screen Fixed Panel) ---
function EnrollForm({ onClose, onSave, editData, mode, staff, isSubmitting, }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const isFutureDate = (value) => value && new Date(value) > new Date();

  const isPastOrToday = (value) => {
    if (!value) return false;

    const selected = new Date(value);
    selected.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected <= today;
  };

  const [step, setStep] = useState(1);
  const [managerOptions, setManagerOptions] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    profilePhoto: null,
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',

    emergencyContacts: [
      {
        contactPersonName: '',
        contactNumber: ''
      }
    ],

    role: '',
    dateOfJoining: '',
    staffId: '',
    reportingTo: '',
    department: '',
    employmentType: '',
    accessLevel: '',

    modules: [],
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    upiId: "",
    username: '',

    accountExpiryDate: '',
    accountActive: true,
    forcePasswordReset: true
  });


  const validateStep = () => {
    if (step === 1) {
      const emergencyNumber = form.emergencyContacts[0]?.contactNumber?.trim();

      if (
        !form.fullName.trim() ||
        !form.gender ||
        !form.dateOfBirth ||
        !form.mobileNumber.trim() ||
        !form.email.trim()
      ) {
        alert("Please fill all required fields in Personal Information");
        return false;
      }

      if (form.fullName.trim().length < 3) {
        alert("Full name must be at least 3 characters");
        return false;
      }

      if (isFutureDate(form.dateOfBirth)) {
        alert("Date of birth cannot be a future date");
        return false;
      }

      if (!phoneRegex.test(form.mobileNumber.trim())) {
        alert("Mobile number must be exactly 10 digits");
        return false;
      }

      if (!emailRegex.test(form.email.trim())) {
        alert("Please enter a valid email address");
        return false;
      }

      if (emergencyNumber && !phoneRegex.test(emergencyNumber)) {
        alert("Emergency contact number must be exactly 10 digits");
        return false;
      }
    }

    if (step === 2) {
      if (
        !form.role ||
        !form.staffId ||
        !form.dateOfJoining
      ) {
        alert("Please fill all required fields in Work & Access");
        return false;
      }

      if (isFutureDate(form.dateOfJoining)) {
        alert("Date of joining cannot be a future date");
        return false;
      }
    }

    if (step === 3) {
      if (
        !form.bankName.trim() ||
        !form.accountHolderName.trim() ||
        !form.accountNumber.trim() ||
        !form.ifscCode.trim()
      ) {
        alert("Please fill all required Bank Account Details");
        return false;
      }

      if (!/^\d{9,18}$/.test(form.accountNumber.trim())) {
        alert("Account number must be 9 to 18 digits");
        return false;
      }

      if (!ifscRegex.test(form.ifscCode.trim().toUpperCase())) {
        alert("Please enter a valid IFSC code");
        return false;
      }
    }

    if (step === 4) {
      if (!form.accountExpiryDate) {
        alert("Please select account expiry date");
        return false;
      }

      if (isPastOrToday(form.accountExpiryDate)) {
        alert("Account expiry date must be a future date.");
        return false;
      }
    }

    return true;
  };


  useEffect(() => {
    if (editData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        fullName:
          editData.personalInfo?.fullName || "",

        profilePhoto:
          editData.personalInfo?.profilePhoto || null,

        email:
          editData.personalInfo?.email || "",

        mobileNumber:
          editData.personalInfo?.mobileNumber || "",

        dateOfBirth:
          editData.personalInfo?.dateOfBirth
            ? new Date(editData.personalInfo.dateOfBirth)
              .toISOString()
              .split("T")[0]
            : "",

        gender:
          editData.personalInfo?.gender || "",

        emergencyContacts:
          editData.personalInfo?.emergencyContacts?.length
            ? editData.personalInfo.emergencyContacts
            : [
              {
                contactPersonName: "",
                contactNumber: "",
              },
            ],

        role:
          editData.employmentInfo?.role || "",

        dateOfJoining:
          editData.employmentInfo?.dateOfJoining
            ? new Date(editData.employmentInfo.dateOfJoining)
              .toISOString()
              .split("T")[0]
            : "",

        staffId:
          editData.employmentInfo?.staffId || "",

        reportingTo:
          editData.employmentInfo?.reportingTo?._id ||
          editData.employmentInfo?.reportingTo ||
          "",

        department:
          editData.employmentInfo?.department || "",

        employmentType:
          editData.employmentInfo?.employmentType || "",

        accessLevel:
          editData.employmentInfo?.accessLevel || "",

        modules: Object.entries(
          editData.moduleAccess || {}
        )
          .filter(([_, value]) => value)
          .map(([key]) => key),
        bankName:
          editData.bankDetails?.bankName || "",

        accountHolderName:
          editData.bankDetails?.accountHolderName || "",

        accountNumber:
          editData.bankDetails?.accountNumber || "",

        ifscCode:
          editData.bankDetails?.ifscCode || "",

        branchName:
          editData.bankDetails?.branchName || "",

        upiId:
          editData.bankDetails?.upiId || "",
        username:
          editData.accountInfo?.username || "",

        accountExpiryDate:
          editData.accountInfo?.accountExpiryDate
            ? new Date(editData.accountInfo.accountExpiryDate)
              .toISOString()
              .split("T")[0]
            : "",

        accountActive:
          editData.accountInfo?.accountActive ?? true,

        forcePasswordReset:
          editData.accountInfo?.forcePasswordReset ?? true,
      });
    } else {
      setForm(prev => ({
        ...prev,
        staffId:
          "STF" +
          Math.floor(Math.random() * 900 + 100),
      }));
    }
  }, [editData]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await getManagers();
        setManagerOptions(response.data || []);
      } catch (error) {
        console.error("Failed to load reporting managers", error);
      }
    };

    fetchManagers();
  }, []);



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
    { label: "Bank Account Details", short: "Bank Details" },
    { label: 'Security & Credentials', short: 'Security' },
  ];

  const inputBase = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 transition-all bg-white placeholder-gray-300";
  const inputDisabled = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#6B7280] bg-[#F9FAFB] cursor-not-allowed outline-none";
  const inputReadonly = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#9CA3AF] bg-[#F3F4F6] font-mono outline-none";
  const labelClass = "block text-xs font-semibold text-[#6B7280] mb-2 tracking-wide";

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(17, 24, 39, 0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="bg-white rounded-3xl shadow-2xl flex flex-col relative overflow-hidden w-[calc(100vw-24px)] max-w-[1500px]"
          style={{ height: 'min(88vh, 900px)' }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── TOP HEADER STRIP ── */}
          <div className="px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-[#F3F4F6] flex-shrink-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-6">
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
            <div className="hidden md:flex items-center gap-0">
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
            <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
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
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 py-6 sm:py-8">

            {/* ─── STEP 1: Personal Information ─── */}
            {step === 1 && (
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Personal Identity</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      value={form.dateOfBirth}
                      onChange={e => update('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number <span className="text-[#E8630A]">*</span></label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      type="tel"
                      value={form.mobileNumber}
                      maxLength={10}
                      onChange={e => update('mobileNumber', digitsOnly(e.target.value))}
                      placeholder="e.g. 9876543210"
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
                      form.profilePhoto ? (
                        <img
                          src={form.profilePhoto}
                          alt="Profile"
                          className="h-24 w-24 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={inputDisabled}>
                          No photo uploaded
                        </div>
                      )
                    ) : (
                      <div
                        className="w-full border border-dashed border-[#E8630A] rounded-xl py-3 px-4 text-sm text-[#E8630A] font-semibold cursor-pointer hover:bg-[#FEF3EB] transition-colors"
                        onClick={() => document.getElementById("photoUpload").click()}
                      >
                        {form.profilePhoto ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                form.profilePhoto instanceof File
                                  ? URL.createObjectURL(form.profilePhoto)
                                  : form.profilePhoto
                              }
                              alt="Preview"
                              className="h-10 w-10 rounded-lg object-cover border border-[#E8630A]"
                            />

                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {form.profilePhoto instanceof File
                                  ? form.profilePhoto.name
                                  : "Profile Photo"}
                              </span>

                              <span className="text-xs text-gray-500">
                                {form.profilePhoto instanceof File
                                  ? form.profilePhoto.type
                                  : "Uploaded"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">Upload File</div>
                        )}

                        <input
                          id="photoUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            if (!isImageFile(file)) {
                              alert("Profile photo must be an image file");
                              e.target.value = "";
                              return;
                            }

                            update("profilePhoto", file);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                  <h3 className="text-base font-bold text-[#1A1D2E] mb-5">Emergency Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Contact Person Name</label>
                      <input
                        className={isView ? inputDisabled : inputBase}
                        disabled={isView}
                        value={form.emergencyContacts[0]?.contactPersonName || ""}
                        onChange={e =>
                          update("emergencyContacts", [
                            {
                              ...form.emergencyContacts[0],
                              contactPersonName: e.target.value
                            }
                          ])
                        }
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Contact Number</label>
                      <input
                        className={isView ? inputDisabled : inputBase}
                        disabled={isView}
                        value={form.emergencyContacts[0]?.contactNumber || ""}
                        onChange={e =>
                          update("emergencyContacts", [
                            {
                              ...form.emergencyContacts[0],
                              contactNumber: digitsOnly(e.target.value)
                            }
                          ])
                        }
                        maxLength={10}
                        placeholder="e.g. 9876500000"
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
                <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-[#1A1D2E] mb-6">Professional Placement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {managerOptions
                          .filter(s => s._id !== editData?._id)
                          .map((s, index) => (
                            <option
                              key={s._id || s.employmentInfo?.staffId || index}
                              value={s._id || ""}
                            >
                              {s.personalInfo?.fullName || "No Name"}
                              {s.employmentInfo?.staffId ? ` (${s.employmentInfo.staffId})` : ""}
                            </option>
                          ))}                   </select>
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
                <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-[#1A1D2E] mb-2">Module Access Permissions</h3>
                  <p className="text-sm text-gray-400 mb-6">Select the modules this staff member should have access to.</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'opd',
                      'surgery',
                      'lab',
                      'icu',
                      'grooming',
                      'kennel',
                      'pharmacy',
                      'reports',
                      'settings'
                    ].map(m => (
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
            {/* ─── STEP 3: Bank Account Details ─── */}
            {step === 3 && (
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">
                  Bank Account Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className={labelClass}>
                      Bank Name <span className="text-[#E8630A]">*</span>
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.bankName}
                      onChange={(e) => update("bankName", e.target.value)}
                      placeholder="Enter Bank Name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Account Holder Name <span className="text-[#E8630A]">*</span>
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.accountHolderName}
                      onChange={(e) =>
                        update("accountHolderName", e.target.value)
                      }
                      placeholder="Enter Account Holder Name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Account Number <span className="text-[#E8630A]">*</span>
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.accountNumber}
                      onChange={(e) =>
                        update("accountNumber", digitsOnly(e.target.value, 18))
                      }
                      maxLength={18}
                      placeholder="Enter Account Number"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      IFSC Code <span className="text-[#E8630A]">*</span>
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.ifscCode}
                      onChange={(e) =>
                        update("ifscCode", e.target.value.toUpperCase())
                      }
                      placeholder="Enter IFSC Code"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Branch Name
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.branchName}
                      onChange={(e) =>
                        update("branchName", e.target.value)
                      }
                      placeholder="Enter Branch Name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      UPI ID
                    </label>
                    <input
                      className={isView ? inputDisabled : inputBase}
                      disabled={isView}
                      value={form.upiId}
                      onChange={(e) =>
                        update("upiId", e.target.value)
                      }
                      placeholder="example@upi"
                    />
                  </div>

                </div>
              </div>
            )}
            {/* ─── STEP 4: Security & Credentials ─── */}
            {step === 4 && (
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#1A1D2E] mb-6">System Credentials</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <input
                    className={isView ? inputDisabled : inputBase}
                    disabled={isView}
                    type="date"
                    value={form.accountExpiryDate}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (isPastOrToday(value)) {
                        alert("Account expiry date must be a future date.");
                        return;
                      }

                      update("accountExpiryDate", value);
                    }}
                  />
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
                      onClick={() => !isView && update(
                        'forcePasswordReset',
                        !form.forcePasswordReset
                      )}
                      className="relative rounded-full transition-colors flex-shrink-0"
                      style={{
                        width: '46px', height: '24px',
                        backgroundColor: form.forcePasswordReset
                          ? '#22C55E'
                          : '#D1D5DB',
                        cursor: isView ? 'default' : 'pointer',
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                        style={{
                          left: form.forcePasswordReset
                            ? '23px'
                            : '3px'
                        }}
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
            className="px-5 sm:px-10 py-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0"
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
              disabled={isSubmitting}
              onClick={() => {
                if (isSubmitting) return;

                if (isView) {
                  onClose();
                  return;
                }

                if (step < 4) {
                  const isValid = validateStep();
                  if (isValid) {
                    setStep(step + 1);
                  }
                } else {
                  const isValid = validateStep();
                  if (isValid) {
                    onSave(form);
                  }
                }
              }}
              className={`px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors
    ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              style={{
                backgroundColor: isSubmitting ? "#C77B45" : "#E8630A",
                border: "none",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = "#D05A09";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = "#E8630A";
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : isView ? (
                "Close"
              ) : step < 4 ? (
                "Next →"
              ) : isEdit ? (
                "✓ Update Staff"
              ) : (
                "✓ Save Staff Member"
              )}
            </button>
          </div>
        </div>
      </div>
      {
        isSubmitting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl px-8 py-6 shadow-xl flex items-center gap-3">
              <svg
                className="animate-spin h-6 w-6 text-[#E8630A]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>

              <span className="font-medium">
                {isEdit ? "Updating staff..." : "Creating staff..."}
              </span>
            </div>
          </div>
        )
      }
    </>


  );
}

// --- Main Page ---
export default function StaffEnrollment() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const filtered = staff.filter(s =>
    (!filterRole ||
      s.employmentInfo?.role === filterRole) &&
    (!filterStatus ||
      (s.accountInfo?.accountActive
        ? "Active"
        : "Inactive") === filterStatus)
  );
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const response = await getStaff();

      console.log("API Response:", response);

      setStaff(response.data || []);

      setLoading(false);
    };

    fetchStaff();
  }, []);

  const handleOpenCreate = () => {
    setSelectedStaff(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);

      showToast({
        type: "success",
        title: "Staff Deleted",
        description: "Staff has been deleted successfully.",
      });

      const response = await getStaff();
      setStaff(response.data || []);

      setShowModal(false);

    } catch (err) {
      console.error(err);

      showToast({
        type: "error",
        title: "Delete Failed",
        description: "Unable to delete staff.",
      });
    }
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
  const handleSave = async (form) => {
    try {
      setIsSubmitting(true);
      if (modalMode === "edit") {

        await updateStaff(
          selectedStaff._id,
          form
        );
        showToast({
          type: "success",
          title: "Staff Updated",
          description: "Staff details have been updated successfully.",
        });
      } else {
        await createStaff(form);
        showToast({
          type: "success",
          title: "Staff Created",
          description: "Staff details have been created successfully.",
        });
      }

      const response = await getStaff();
      setStaff(response.data || []);

      setShowModal(false);

    } catch (err) {
      console.error(err);
      console.log(err);

      showToast({
        type: "error",
        title: err.response.data.message,
        description: "Unable to save Staff details. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterSelectClass = "w-full border border-[#EAE5DC] rounded-xl px-4 py-3 text-sm text-[#1A1D2E] bg-white outline-none focus:border-[#E8630A] focus:ring-1 focus:ring-[#E8630A] transition-colors";

  if (loading) {
    <div className="min-h-screen flex items-center justify-center p-6">

      <Loader />



    </div>
  }


  return (
    <div className="px-0 sm:px-4 lg:px-10 xl:px-16 py-4 sm:py-8 lg:py-10 bg-white min-h-screen">
      {showModal &&
        modalMode === "view" && (
          <ViewStaffModal
            staff={selectedStaff}
            onClose={() =>
              setShowModal(false)
            }
            onDelete={handleDelete}
          />
        )}

      {showModal &&
        modalMode !== "view" && (
          <EnrollForm
            onClose={() =>
              setShowModal(false)
            }
            onSave={handleSave}
            editData={selectedStaff}
            mode={modalMode}
            staff={staff}
            isSubmitting={isSubmitting}
          />
        )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 lg:mb-10">
        <div>
          <h1 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-[#1A1D2E] mb-2">Staff Directory</h1>
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
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-[#EAE5DC]">
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
      <div className="border border-[#EAE5DC] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[920px] border-collapse text-left">
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
              <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm"
                      style={{
                        backgroundColor: "#FEF3EB",
                        color: "#E8630A"
                      }}
                    >
                      {s.personalInfo?.fullName
                        ?.split(" ")
                        .map(n => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="font-bold text-[#1A1D2E] text-[15px]">
                      {s.personalInfo?.fullName}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 font-mono text-gray-500 text-sm"> {s.employmentInfo?.staffId}</td>
                <td className="px-5 py-5">
                  <div className="text-[#1A1D2E] font-semibold text-sm">
                    {s.employmentInfo?.role}
                  </div>

                  <div className="text-gray-400 text-xs mt-0.5">
                    {s.employmentInfo?.department}
                  </div>
                </td>
                <td className="px-5 py-5 text-gray-600 text-sm">  {s.employmentInfo?.employmentType}</td>
                <td className="px-5 py-5">
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: s.accountInfo?.accountActive
                        ? '#DCFCE7'
                        : '#F3F4F6',
                      color: s.accountInfo?.accountActive
                        ? '#16A34A'
                        : '#6B7280',
                    }}
                  >
                    {s.accountInfo?.accountActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-5 text-gray-500 text-sm">{s.employmentInfo?.dateOfJoining?.split("T")[0]}</td>
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
