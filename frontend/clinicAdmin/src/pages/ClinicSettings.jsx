import React, { useState } from 'react';

const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Kannada', 'Telugu', 'Bengali', 'Gujarati'];
const bookingModes = ['Only offline booking', 'Only online booking', 'Both booking is available'];
const notifChannels = ['SMS', 'Email', 'WhatsApp', 'Push Notification', 'In-App'];

/* ─── Shared primitive classes ────────────────────────────────────── */
const inputCls = "w-full bg-white border border-gray-200 rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-[#1A1D2E] outline-none box-border font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-150";
const lblCls = "block text-[11.5px] text-gray-500 mb-1.5 font-semibold tracking-[0.04em] uppercase";
const cardCls = "bg-white border border-[#F0F0F0] rounded-[14px] p-[20px_22px]";
const btnPrimaryCls = "bg-gradient-to-br from-[#E8630A] to-[#c4500a] text-white border-none rounded-[10px] px-7 py-[11px] text-[13.5px] font-semibold cursor-pointer font-['Plus_Jakarta_Sans',sans-serif] tracking-[0.01em]";
const btnOutlineCls = "bg-white text-gray-500 border border-gray-200 rounded-[10px] px-6 py-[11px] text-[13.5px] font-semibold cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]";
const sectionTitleCls = "font-['Syne',sans-serif] text-[15px] font-bold text-[#1A1D2E] mb-5 pb-3 border-b border-gray-100 flex items-center gap-2.5";
const subHeadCls = "text-[12px] font-bold text-gray-400 tracking-[0.08em] uppercase";

/* ─── Toggle ──────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl px-[18px] py-3.5">
      <div>
        <div className="text-[13.5px] font-semibold text-[#1A1D2E]">{label}</div>
        {description && <div className="text-[11.5px] text-gray-400 mt-0.5">{description}</div>}
      </div>
      <div
        className="w-[46px] h-[26px] rounded-[13px] relative cursor-pointer transition-colors duration-200 flex-shrink-0 ml-4"
        style={{ background: value ? '#22C55E' : '#D1D5DB' }}
        onClick={() => onChange(!value)}
      >
        <div
          className="absolute top-[3px] w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
          style={{ left: value ? 23 : 3 }}
        />
      </div>
    </div>
  );
}

/* ─── Field ───────────────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div>
      <label className={lblCls}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ─── Section 5.1 ─────────────────────────────────────────────────── */
function ClinicProfile({ form, u }) {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div className={sectionTitleCls}>
        <span className="bg-[rgba(232,99,10,0.1)] text-[#E8630A] rounded-lg px-2.5 py-1 text-xs">5.1</span>
        Clinic Profile
        <span className="text-xs text-gray-400 font-normal">Editable by clinic admin</span>
      </div>

      {/* Identity */}
      <div className={`${cardCls} flex flex-col gap-4`}>
        <div className={subHeadCls}>Identity</div>
        <Field label="Clinic Display Name *">
          <input className={inputCls} value={form.clinicName} onChange={e => u('clinicName', e.target.value)} placeholder="Enter clinic name" />
        </Field>
        <Field label="Tagline & Description">
          <textarea className={`${inputCls} resize-y`} rows={3} value={form.tagline} onChange={e => u('tagline', e.target.value)} />
        </Field>
        <Field label="Clinic Logo" hint="JPG, PNG, WEBP or PDF · Max 5MB">
          <div className="border-2 border-dashed border-gray-200 rounded-[10px] p-5 text-center bg-[#FAFAFA] cursor-pointer">
            <div className="text-[22px] mb-1">🏥</div>
            <div className="text-[13px] text-gray-400">Click to upload or drag & drop</div>
            <input type="file" accept=".pdf,image/*" className="hidden" />
          </div>
        </Field>
      </div>

      {/* Hours & Capacity */}
      <div className={`${cardCls} flex flex-col gap-4`}>
        <div className={subHeadCls}>Hours & Capacity</div>
        <Field label="Working Hours Per Day">
          <div className="flex gap-2.5 items-center">
            <input className={`${inputCls} w-auto flex-1`} type="time" value={form.workingHoursStart} onChange={e => u('workingHoursStart', e.target.value)} />
            <span className="text-gray-400 text-[13px]">to</span>
            <input className={`${inputCls} w-auto flex-1`} type="time" value={form.workingHoursEnd} onChange={e => u('workingHoursEnd', e.target.value)} />
          </div>
        </Field>

        <Field label="Holidays / Closures">
          <div className="flex gap-2">
            <input className={`${inputCls} flex-1`} type="date" value={newHoliday} onChange={e => setNewHoliday(e.target.value)} />
            <button
              onClick={() => { if (newHoliday && !holidays.includes(newHoliday)) { setHolidays([...holidays, newHoliday]); setNewHoliday(''); } }}
              className={`${btnOutlineCls} px-4 flex-shrink-0`}
            >+ Add</button>
          </div>
          {holidays.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {holidays.map(d => (
                <span key={d} className="bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  📅 {d}
                  <span onClick={() => setHolidays(holidays.filter(x => x !== d))} className="cursor-pointer text-amber-600">✕</span>
                </span>
              ))}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-3.5">
          <Field label="OPD Capacity (slots/day)">
            <input className={inputCls} type="number" value={form.opdCapacity} onChange={e => u('opdCapacity', e.target.value)} />
          </Field>
          <Field label="Default Consultation Duration (mins)">
            <input className={inputCls} type="number" value={form.defaultDuration} onChange={e => u('defaultDuration', e.target.value)} />
          </Field>
        </div>

        <Field label="Appointment Booking Mode">
          <div className="flex flex-col gap-2">
            {bookingModes.map(m => (
              <label
                key={m}
                className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-[11px] cursor-pointer text-[13px] transition-all duration-150"
                style={{
                  background: form.bookingMode === m ? 'rgba(232,99,10,0.06)' : '#FAFAFA',
                  border: `1.5px solid ${form.bookingMode === m ? '#E8630A' : '#F0F0F0'}`,
                  color: form.bookingMode === m ? '#E8630A' : '#6B7280',
                  fontWeight: form.bookingMode === m ? 600 : 400,
                }}
              >
                <input type="radio" name="bookingMode" checked={form.bookingMode === m} onChange={() => u('bookingMode', m)} style={{ accentColor: '#E8630A' }} />
                {m}
              </label>
            ))}
          </div>
        </Field>
      </div>

      {/* Locale */}
      <div className={`${cardCls} flex flex-col gap-4`}>
        <div className={subHeadCls}>Locale & Region</div>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Primary Language" hint="Languages added by super admin">
            <select className={inputCls} value={form.primaryLanguage} onChange={e => u('primaryLanguage', e.target.value)}>
              {languages.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Currency (auto-set)">
            <input className={`${inputCls} bg-gray-50 text-gray-400`} value={form.currency} readOnly />
          </Field>
        </div>
        <Field label="Time Zone" hint="Auto-detected but editable">
          <input className={inputCls} value={form.timezone} onChange={e => u('timezone', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

/* ─── Section 5.2 ─────────────────────────────────────────────────── */
function PrescriptionSetup({ form, u }) {
  return (
    <div className="flex flex-col gap-5">
      <div className={sectionTitleCls}>
        <span className="bg-[rgba(232,99,10,0.1)] text-[#E8630A] rounded-lg px-2.5 py-1 text-xs">5.2</span>
        Prescription & Letterhead Setup
      </div>

      <div className={`${cardCls} flex flex-col gap-4`}>
        <div className={subHeadCls}>Letterhead</div>

        <Field label="Clinic Letterhead Template">
          <div className="grid grid-cols-2 gap-2.5">
            <button className="bg-[#FAFAFA] border-[1.5px] border-dashed border-gray-300 text-gray-500 rounded-[10px] p-3.5 text-[13px] cursor-pointer flex items-center justify-center gap-2">
              📤 Upload PDF Template
            </button>
            <button className="bg-[rgba(232,99,10,0.06)] border-[1.5px] border-[rgba(232,99,10,0.3)] text-[#E8630A] rounded-[10px] p-3.5 text-[13px] cursor-pointer flex items-center justify-center gap-2">
              ✏️ Build with Editor
            </button>
          </div>
        </Field>

        <Field label="Default Clinic Stamp Image" hint="PNG with transparent background recommended">
          <div className="border-2 border-dashed border-gray-200 rounded-[10px] p-[18px] text-center bg-[#FAFAFA]">
            <div className="text-xl mb-1">🔖</div>
            <div className="text-[13px] text-gray-400">Click to upload stamp image</div>
            <input type="file" accept="image/*" className="mt-2" />
          </div>
        </Field>

        <Field label="Prescription Footer Text">
          <textarea className={`${inputCls} resize-y`} rows={3} value={form.prescriptionFooter} onChange={e => u('prescriptionFooter', e.target.value)} />
        </Field>

        <Field label="Registration / License Number" hint="Auto-filled from onboarding">
          <input className={`${inputCls} bg-gray-50 text-gray-400`} value={form.regNumber} readOnly />
        </Field>
      </div>

      {/* Live Preview */}
      <div className={cardCls}>
        <div className={`${subHeadCls} mb-4`}>Live Prescription Preview</div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-br from-[#E8630A] to-[#c4500a] px-5 py-4 flex items-center gap-3">
            <div className="w-[38px] h-[38px] bg-white/20 rounded-lg flex items-center justify-center text-lg">🏥</div>
            <div>
              <div className="font-extrabold text-[15px] text-white">{form.clinicName}</div>
              <div className="text-[11px] text-white/70">{form.tagline}</div>
            </div>
          </div>
          {/* Body */}
          <div className="px-5 py-4 bg-white">
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[['Patient', 'Pet Name'], ['Date', new Date().toLocaleDateString('en-IN')], ['Reg. No.', form.regNumber]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg px-2.5 py-2">
                  <div className="text-[9px] text-gray-400 font-bold tracking-[0.06em] uppercase">{k}</div>
                  <div className="text-[12px] text-[#1A1D2E] font-semibold mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3">
              <div className="text-[10px] text-gray-500 font-bold tracking-[0.06em] uppercase mb-1.5">Rx</div>
              <div className="bg-gray-50 rounded-lg p-3 min-h-[48px]"></div>
            </div>
          </div>
          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-5 py-2.5 text-center">
            <div className="text-[10px] text-gray-400 italic">{form.prescriptionFooter}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section 5.3 ─────────────────────────────────────────────────── */
function NotificationsAlerts({ form, u, selectedNotifChannels, setSelectedNotifChannels, selectedOwnerLang, setSelectedOwnerLang }) {
  const [reminders, setReminders] = useState({ followUp: 1, vaccination: 7, licenseExpiry: 30 });
  const ur = (k, v) => setReminders(p => ({ ...p, [k]: v }));

  const reminderFields = [
    { key: 'followUp', label: 'Follow-up Reminder', unit: 'days before', icon: '🔁' },
    { key: 'vaccination', label: 'Vaccination Due Reminder', unit: 'days before', icon: '💉' },
    { key: 'licenseExpiry', label: 'Staff License Expiry Alert', unit: 'days before', icon: '📋' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className={sectionTitleCls}>
        <span className="bg-[rgba(232,99,10,0.1)] text-[#E8630A] rounded-lg px-2.5 py-1 text-xs">5.3</span>
        Notification & Alerts
      </div>

      {/* Reminder timing */}
      <div className={`${cardCls} flex flex-col gap-3.5`}>
        <div className={subHeadCls}>Reminder Timing</div>
        {reminderFields.map(({ key, label, unit, icon }) => (
          <div key={key} className="flex items-center justify-between bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl px-[18px] py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{icon}</span>
              <div>
                <div className="text-[13.5px] font-semibold text-[#1A1D2E]">{label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Send alert {reminders[key]} {unit}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => reminders[key] > 1 && ur(key, reminders[key] - 1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer text-[15px] text-gray-500 flex items-center justify-center">−</button>
              <span className="text-[15px] font-bold text-[#1A1D2E] min-w-[24px] text-center">{reminders[key]}</span>
              <button onClick={() => ur(key, reminders[key] + 1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer text-[15px] text-gray-500 flex items-center justify-center">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Channels */}
      <div className={`${cardCls} flex flex-col gap-3.5`}>
        <div>
          <div className={`${subHeadCls} mb-3`}>Notification Channels</div>
          <div className="flex flex-wrap gap-2">
            {notifChannels.map(c => {
              const active = selectedNotifChannels.includes(c);
              const icons = { SMS: '💬', Email: '📧', WhatsApp: '📱', 'Push Notification': '🔔', 'In-App': '📲' };
              return (
                <label
                  key={c}
                  className="flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 cursor-pointer text-[13px] transition-all duration-150"
                  style={{
                    background: active ? 'rgba(232,99,10,0.08)' : '#FAFAFA',
                    border: `1.5px solid ${active ? '#E8630A' : '#F0F0F0'}`,
                    color: active ? '#E8630A' : '#6B7280',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <input type="checkbox" checked={active} onChange={() => setSelectedNotifChannels(active ? selectedNotifChannels.filter(x => x !== c) : [...selectedNotifChannels, c])} style={{ accentColor: '#E8630A' }} />
                  {icons[c]} {c}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className={lblCls}>Owner Notification Language</label>
          <select className={inputCls} value={selectedOwnerLang} onChange={e => setSelectedOwnerLang(e.target.value)}>
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">Language used for SMS / WhatsApp messages sent to pet owners</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────── */
export default function ClinicSettings() {
  const [activeTab, setActiveTab] = useState('5.1');
  const [selectedNotifChannels, setSelectedNotifChannels] = useState(['Email', 'SMS']);
  const [selectedOwnerLang, setSelectedOwnerLang] = useState('English');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    clinicName: 'Paws & Care Veterinary Clinic',
    tagline: 'Premium care for your beloved pets',
    workingHoursStart: '09:00', workingHoursEnd: '18:00',
    opdCapacity: 50, defaultDuration: 15,
    bookingMode: 'Both booking is available',
    primaryLanguage: 'English', currency: 'INR', timezone: 'Asia/Kolkata',
    prescriptionFooter: "Thank you for trusting us with your pet's health.",
    regNumber: 'VCI/MH/2020/5678',
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const tabs = [
    { id: '5.1', label: 'Clinic Profile', icon: '🏥' },
    { id: '5.2', label: 'Prescription & Letterhead', icon: '📄' },
    { id: '5.3', label: 'Notifications & Alerts', icon: '🔔' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen px-7 pt-7 pb-[60px]">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="font-['Syne',sans-serif] text-[22px] font-bold text-[#1A1D2E] m-0">
          Clinic Settings & Configuration
        </h2>
        <p className="text-gray-400 text-[13px] mt-1">
          Configure your clinic profile, prescriptions, and notification preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-7 bg-gray-50 rounded-[14px] p-1.5 w-fit border border-[#F0F0F0]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-[18px] py-2.5 rounded-[10px] border-none cursor-pointer text-[13px] font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-1.5 transition-all duration-150"
            style={{
              background: activeTab === t.id ? '#FFFFFF' : 'transparent',
              color: activeTab === t.id ? '#E8630A' : '#9CA3AF',
              fontWeight: activeTab === t.id ? 700 : 500,
              boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <span>{t.icon}</span> {t.id} {t.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="max-w-[780px]">
        {activeTab === '5.1' && <ClinicProfile form={form} u={u} />}
        {activeTab === '5.2' && <PrescriptionSetup form={form} u={u} />}
        {activeTab === '5.3' && (
          <NotificationsAlerts
            form={form} u={u}
            selectedNotifChannels={selectedNotifChannels}
            setSelectedNotifChannels={setSelectedNotifChannels}
            selectedOwnerLang={selectedOwnerLang}
            setSelectedOwnerLang={setSelectedOwnerLang}
          />
        )}

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-7 pt-5 border-t border-[#F0F0F0]">
          <div className="text-[12px] text-gray-400">
            {saved ? (
              <span className="text-green-500 font-semibold">✓ Settings saved successfully</span>
            ) : (
              '* Changes are saved per section'
            )}
          </div>
          <div className="flex gap-2.5">
            <button className={btnOutlineCls}>Discard Changes</button>
            <button className={btnPrimaryCls} onClick={handleSave}>Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}