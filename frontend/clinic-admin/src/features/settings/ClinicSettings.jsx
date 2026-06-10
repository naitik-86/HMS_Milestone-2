import React, { useState } from 'react';
import { languages, bookingModes, notifChannels } from '../../data/settings';
import { lbl, btnPrimary } from '../../styles/tokens';

function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 10, padding: '12px 16px' }}>
      <span style={{ fontSize: 13, color: '#D1D5DB' }}>{label}</span>
      <div style={{ width: 44, height: 24, background: value ? '#22C55E' : '#4B5563', borderRadius: 12, position: 'relative', cursor: 'pointer' }} onClick={() => onChange(!value)}>
        <div style={{ position: 'absolute', right: value ? 2 : undefined, left: value ? undefined : 2, top: 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'all 0.2s' }}></div>
      </div>
    </div>
  );
}

export default function ClinicSettings() {
  const [activeTab, setActiveTab] = useState('5.1');
  const [selectedNotifChannels, setSelectedNotifChannels] = useState(['Email', 'SMS']);
  const [selectedOwnerLang, setSelectedOwnerLang] = useState('English');
  const [form, setForm] = useState({
    clinicName: 'Paws & Care Veterinary Clinic',
    tagline: 'Premium care for your beloved pets',
    workingHoursStart: '09:00', workingHoursEnd: '18:00',
    opdCapacity: 50, defaultDuration: 15, bookingMode: 'Both booking is available',
    primaryLanguage: 'English', currency: 'INR', timezone: 'Asia/Kolkata',
    followUpDays: 1, vaccinationDays: 7, licenseExpiryDays: 30,
    prescriptionFooter: 'Thank you for trusting us with your pet\'s health.',
    regNumber: 'VCI/MH/2020/5678',
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const tabs = [
    { id: '5.1', label: 'Clinic Profile' },
    { id: '5.2', label: 'Prescription & Letterhead' },
    { id: '5.3', label: 'Notifications & Alerts' },
  ];

  return (
    <div style={{ padding: 24 }} className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: '#1A1D2E' }}>Clinic Settings & Configuration</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Configure your clinic profile, prescriptions, and notification preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#FFFFFF', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: activeTab === t.id ? '#FFFFFF' : 'transparent',
            color: activeTab === t.id ? '#E8630A' : '#6B7280',
            fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}>{t.id} {t.label}</button>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 16, padding: 28, maxWidth: 760 }}>
        {activeTab === '5.1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: '#1A1D2E', marginBottom: 4 }}>5.1 — Clinic Profile <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 400 }}>(editable by clinic admin)</span></h3>

            <div>
              <label style={lbl}>Clinic Display Name *</label>
              <input className="input-field" value={form.clinicName} onChange={e => u('clinicName', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Clinic Tagline & Description</label>
              <textarea className="input-field" rows={3} value={form.tagline} onChange={e => u('tagline', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={lbl}>Clinic Logo (pdf upload)</label>
              <input className="input-field" type="file" accept=".pdf,image/*" />
            </div>
            <div>
              <label style={lbl}>Working Hours Per Day (time range per day)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input className="input-field" type="time" value={form.workingHoursStart} onChange={e => u('workingHoursStart', e.target.value)} />
                <span style={{ color: '#6B7280' }}>to</span>
                <input className="input-field" type="time" value={form.workingHoursEnd} onChange={e => u('workingHoursEnd', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={lbl}>Holidays / Closures (multiple date picker)</label>
              <input className="input-field" type="date" />
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Click to add multiple holiday dates</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>OPD Capacity (slots/day)</label>
                <input className="input-field" type="number" value={form.opdCapacity} onChange={e => u('opdCapacity', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Default Consultation Duration (minutes)</label>
                <input className="input-field" type="number" value={form.defaultDuration} onChange={e => u('defaultDuration', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={lbl}>Appointment Booking Mode</label>
              <select className="input-field" value={form.bookingMode} onChange={e => u('bookingMode', e.target.value)}>
                {bookingModes.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>Primary Language of Clinic</label>
                <select className="input-field" value={form.primaryLanguage} onChange={e => u('primaryLanguage', e.target.value)}>
                  {languages.map(l => <option key={l}>{l}</option>)}
                </select>
                <p style={{ fontSize: 10, color: '#6B7280', marginTop: 3 }}>All languages from super admin panel</p>
              </div>
              <div>
                <label style={lbl}>Currency <span style={{ color: '#6B7280', fontSize: 11 }}>(auto set to INR)</span></label>
                <input className="input-field" value={form.currency} readOnly style={{ opacity: 0.7 }} />
              </div>
            </div>
            <div>
              <label style={lbl}>Time Zone <span style={{ color: '#6B7280', fontSize: 11 }}>(auto detected but editable)</span></label>
              <input className="input-field" value={form.timezone} onChange={e => u('timezone', e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === '5.2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: '#1A1D2E', marginBottom: 4 }}>5.2 — Prescription & Letterhead Setup</h3>

            <div>
              <label style={lbl}>Clinic Letterhead Template</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, background: '#FFFFFF', border: '1px solid #EAE5DC', color: '#D1D5DB', borderRadius: 10, padding: 12, fontSize: 13, cursor: 'pointer' }}>📤 Upload PDF Template</button>
                <button style={{ flex: 1, background: 'rgba(232,99,10,0.1)', border: '1px solid rgba(232,99,10,0.3)', color: '#E8630A', borderRadius: 10, padding: 12, fontSize: 13, cursor: 'pointer' }}>✏️ Build with Editor</button>
              </div>
            </div>
            <div>
              <label style={lbl}>Default Clinic Stamp Image</label>
              <input className="input-field" type="file" accept="image/*" />
            </div>
            <div>
              <label style={lbl}>Prescription Footer Text</label>
              <textarea className="input-field" rows={3} value={form.prescriptionFooter} onChange={e => u('prescriptionFooter', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={lbl}>Registration / License Number <span style={{ color: '#6B7280', fontSize: 11 }}>(auto filled from onboarding)</span></label>
              <input className="input-field" value={form.regNumber} readOnly style={{ opacity: 0.7 }} />
            </div>

            {/* Preview */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 12, padding: 20, marginTop: 8 }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Prescription Preview</div>
              <div style={{ background: '#fff', borderRadius: 8, padding: 16, color: '#FFFFFF' }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#E8630A' }}>{form.clinicName}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}>{form.tagline}</div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, fontSize: 11, color: '#6B7280' }}>
                  Reg. No.: {form.regNumber}
                </div>
                <div style={{ marginTop: 30, fontSize: 10, color: '#9CA3AF', borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>{form.prescriptionFooter}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === '5.3' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: '#1A1D2E', marginBottom: 4 }}>5.3 — Notification & Alerts</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>Follow-up Reminder (days before) <span style={{ color: '#6B7280' }}>default: 1</span></label>
                <input className="input-field" type="number" defaultValue={1} />
              </div>
              <div>
                <label style={lbl}>Vaccination Due Reminder (days before) <span style={{ color: '#6B7280' }}>default: 7</span></label>
                <input className="input-field" type="number" defaultValue={7} />
              </div>
              <div>
                <label style={lbl}>Staff License Expiry (days before) <span style={{ color: '#6B7280' }}>default: 30</span></label>
                <input className="input-field" type="number" defaultValue={30} />
              </div>
            </div>

            <div>
              <label style={lbl}>Notification Channel (dropdown + multiselect)</label>
              <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}>All languages added by super admin will be visible</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {notifChannels.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, background: selectedNotifChannels.includes(c) ? 'rgba(232,99,10,0.15)' : '#FFFFFF', border: `1px solid ${selectedNotifChannels.includes(c) ? '#E8630A' : '#EAE5DC'}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: selectedNotifChannels.includes(c) ? '#E8630A' : '#D1D5DB' }}>
                    <input type="checkbox" checked={selectedNotifChannels.includes(c)} onChange={() => setSelectedNotifChannels(selectedNotifChannels.includes(c) ? selectedNotifChannels.filter(x => x !== c) : [...selectedNotifChannels, c])} style={{ accentColor: '#E8630A' }} /> {c}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>Owner Notification Language</label>
              <select className="input-field" value={selectedOwnerLang} onChange={e => setSelectedOwnerLang(e.target.value)}>
                {languages.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button style={btnPrimary}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
