import React, { useState } from 'react';

const kennel_species = ['Dogs', 'Cats', 'Small Animals', 'Birds'];
const kennel_shifts = ['Day', 'Night', 'Rotating'];

const kennelStaff = [
  { id: 'KNL001', name: 'Amit Verma', initials: 'AV', color: '#F97316', experience: 3, species: ['Dogs', 'Cats'], shift: 'Day', firstAidCert: true, canMedicate: true, status: 'Active' },
  { id: 'KNL002', name: 'Pradeep Singh', initials: 'PS', color: '#EAB308', experience: 5, species: ['Dogs', 'Small Animals'], shift: 'Night', firstAidCert: false, canMedicate: false, status: 'Active' },
  { id: 'KNL003', name: 'Lakshmi Nair', initials: 'LN', color: '#06B6D4', experience: 2, species: ['Cats', 'Birds'], shift: 'Rotating', firstAidCert: true, canMedicate: true, status: 'Active' },
];

const ADD_STEPS = [
  { id: 1, label: 'Staff Identity' },
  { id: 2, label: 'Shift & Experience' },
  { id: 3, label: 'Species & Skills' },
  { id: 4, label: 'Certifications' },
];

const VIEW_EDIT_TABS = [
  { id: 'identity',      label: 'Staff Identity' },
  { id: 'shift',         label: 'Shift & Experience' },
  { id: 'species',       label: 'Species & Skills' },
  { id: 'certs',         label: 'Certifications' },
];

const btnPrimary = {
  background: 'linear-gradient(135deg,#E8630A,#c4500a)',
  color: '#fff', border: 'none', borderRadius: 10,
  padding: '11px 28px', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
};
const btnSecondary = {
  background: '#FFFFFF', color: '#6B7280',
  border: '1px solid #E5E7EB', borderRadius: 10,
  padding: '11px 24px', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
};
const inputStyle = (ro) => ({
  width: '100%', boxSizing: 'border-box',
  background: ro ? '#F9FAFB' : '#FFFFFF',
  border: '1.5px solid #E5E7EB', borderRadius: 10,
  padding: '11px 14px', fontSize: 14,
  color: ro ? '#6B7280' : '#1A1D2E', outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  cursor: ro ? 'default' : 'text',
});
const selectStyle = (ro, hasVal) => ({
  width: '100%', boxSizing: 'border-box',
  background: ro ? '#F9FAFB' : '#FFFFFF',
  border: '1.5px solid #E5E7EB', borderRadius: 10,
  padding: '11px 14px', fontSize: 14,
  color: hasVal ? (ro ? '#6B7280' : '#1A1D2E') : '#9CA3AF',
  outline: 'none', cursor: ro ? 'default' : 'pointer',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
});
const lbl = {
  display: 'block', fontSize: 13, color: '#374151',
  marginBottom: 7, fontWeight: 500,
};
const fieldWrap = { display: 'flex', flexDirection: 'column' };

/* ────────── Toggle ────────── */
function Toggle({ on, onChange, readOnly }) {
  return (
    <div
      onClick={() => !readOnly && onChange(!on)}
      style={{
        width: 48, height: 26, borderRadius: 13, flexShrink: 0,
        background: on ? '#22C55E' : '#D1D5DB',
        position: 'relative', cursor: readOnly ? 'default' : 'pointer',
        transition: 'background .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 25 : 3,
        width: 20, height: 20, background: '#fff', borderRadius: '50%',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </div>
  );
}

/* ────────── Step Wizard (Add mode) ────────── */
function StepWizard({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {ADD_STEPS.map((s, i) => {
        const active = s.id === step;
        const done   = s.id < step;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 90 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: active ? '#F97316' : done ? '#FED7AA' : '#FEF3C7',
                border: `2px solid ${active ? '#F97316' : done ? '#F97316' : '#FDE68A'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                color: active ? '#fff' : '#F97316',
                transition: 'all .2s',
              }}>
                {done ? '✓' : s.id}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#F97316' : '#9CA3AF', textAlign: 'center', lineHeight: 1.3 }}>
                {s.label}
              </span>
            </div>
            {i < ADD_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? '#F97316' : '#FDE68A', margin: '0 4px', marginBottom: 22 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ────────── Tab Bar (View/Edit mode) ────────── */
function TabBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
      {VIEW_EDIT_TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '9px 20px', borderRadius: 30, fontSize: 13, fontWeight: 600,
            border: active === t.id ? 'none' : '1.5px solid #E5E7EB',
            background: active === t.id ? '#F97316' : '#fff',
            color: active === t.id ? '#fff' : '#6B7280',
            cursor: 'pointer', transition: 'all .15s',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >{t.label}</button>
      ))}
    </div>
  );
}

/* ────────── Section card wrapper ────────── */
function SectionCard({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '28px 32px' }}>
      {title && <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1D2E', margin: '0 0 24px 0', fontFamily: 'Syne, sans-serif' }}>{title}</h3>}
      {children}
    </div>
  );
}

/* ────────── Grid helper ────────── */
function Grid2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>{children}</div>;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  ADD MODAL — 4-step wizard                                          */
/* ──────────────────────────────────────────────────────────────────── */
function AddModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', id: '', email: '', phone: '', altPhone: '',
    experience: '', shift: '', notes: '',
    species: [], firstAid: false, canMedicate: false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Backdrop onClose={onClose}>
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: '#1A1D2E', margin: 0 }}>Add Kennel Staff</h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>Register a new kennel staff member in the system.</p>
        </div>
      </ModalHeader>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#F8F9FA' }}>
        <StepWizard step={step} />

        {step === 1 && (
          <SectionCard title="Staff Identity">
            <Grid2>
              <div style={fieldWrap}>
                <label style={lbl}>Staff Name</label>
                <input style={inputStyle(false)} placeholder="e.g. Ravi Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Staff ID</label>
                <input style={inputStyle(false)} placeholder="e.g. KNL004" value={form.id} onChange={e => set('id', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Official Email</label>
                <input style={inputStyle(false)} type="email" placeholder="staff@kennel.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Primary Contact</label>
                <input style={inputStyle(false)} placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Alternate Contact</label>
                <input style={inputStyle(false)} placeholder="+91 98765 00000" value={form.altPhone} onChange={e => set('altPhone', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Staff Photo</label>
                <div style={{ border: '2px dashed #FED7AA', borderRadius: 10, padding: '14px', textAlign: 'center', background: '#FFF7ED', cursor: 'pointer' }}>
                  <span style={{ fontSize: 13, color: '#F97316', fontWeight: 600 }}>Upload File</span>
                </div>
              </div>
            </Grid2>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard title="Shift & Experience">
            <Grid2>
              <div style={fieldWrap}>
                <label style={lbl}>Experience (Years)</label>
                <input style={inputStyle(false)} type="number" placeholder="e.g. 3" value={form.experience} onChange={e => set('experience', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Shift Preference</label>
                <select style={selectStyle(false, !!form.shift)} value={form.shift} onChange={e => set('shift', e.target.value)}>
                  <option value="">Select Shift</option>
                  {kennel_shifts.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ ...fieldWrap, gridColumn: '1 / -1' }}>
                <label style={lbl}>Additional Notes (Optional)</label>
                <textarea
                  rows={4} placeholder="Any special skills, responsibilities, or notes..."
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                  style={{ ...inputStyle(false), resize: 'vertical' }}
                />
              </div>
            </Grid2>
          </SectionCard>
        )}

        {step === 3 && (
          <SectionCard title="Species & Skills">
            <label style={lbl}>Species Comfortable With</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {kennel_species.map(s => {
                const active = form.species.includes(s);
                return (
                  <label key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: active ? 'rgba(249,115,22,0.10)' : '#F9FAFB',
                    border: `1.5px solid ${active ? '#F97316' : '#E5E7EB'}`,
                    borderRadius: 10, padding: '10px 18px', cursor: 'pointer',
                    fontSize: 13, color: active ? '#F97316' : '#6B7280',
                    fontWeight: active ? 600 : 400, transition: 'all .15s',
                  }}>
                    <input type="checkbox" checked={active} style={{ accentColor: '#F97316' }}
                      onChange={() => set('species', active ? form.species.filter(x => x !== s) : [...form.species, s])} />
                    {s}
                  </label>
                );
              })}
            </div>
          </SectionCard>
        )}

        {step === 4 && (
          <SectionCard title="Certifications">
            {/* First Aid */}
            <div style={{ marginBottom: 20, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2E' }}>First-Aid Certified?</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Toggle on and upload certificate if certified</div>
                </div>
                <Toggle on={form.firstAid} onChange={v => set('firstAid', v)} />
              </div>
              {form.firstAid && (
                <div style={{ marginTop: 16 }}>
                  <label style={lbl}>Upload First-Aid Certificate</label>
                  <div style={{ border: '2px dashed #FED7AA', borderRadius: 10, padding: '20px', textAlign: 'center', background: '#FFF7ED' }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>📄</div>
                    <input type="file" accept=".pdf,image/*" style={{ fontSize: 13, color: '#F97316' }} />
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>PDF or image, max 5MB</div>
                  </div>
                </div>
              )}
            </div>
            {/* Can Medicate */}
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2E' }}>Can Administer Medication?</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Allow this staff to administer medications to animals</div>
              </div>
              <Toggle on={form.canMedicate} onChange={v => set('canMedicate', v)} />
            </div>
          </SectionCard>
        )}
      </div>

      {/* Footer */}
      <ModalFooter>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>Step {step} of {ADD_STEPS.length}</span>
        <div style={{ display: 'flex', gap: 12 }}>
          {step > 1
            ? <button style={btnSecondary} onClick={() => setStep(s => s - 1)}>← Back</button>
            : <button style={btnSecondary} onClick={onClose}>Cancel</button>
          }
          {step < ADD_STEPS.length
            ? <button style={btnPrimary} onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button style={btnPrimary} onClick={onClose}>✓ Save Staff</button>
          }
        </div>
      </ModalFooter>
    </Backdrop>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  VIEW / EDIT MODAL — tabbed layout                                  */
/* ──────────────────────────────────────────────────────────────────── */
function ViewEditModal({ onClose, initialData, readOnly }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [form, setForm] = useState({
    experience: initialData.experience,
    shift: initialData.shift,
    species: [...initialData.species],
    firstAid: initialData.firstAidCert,
    canMedicate: initialData.canMedicate,
    notes: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Backdrop onClose={onClose}>
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `${initialData.color}22`,
            border: `2px solid ${initialData.color}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: initialData.color, flexShrink: 0,
          }}>{initialData.initials}</div>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1D2E', margin: 0 }}>
              {readOnly ? 'View' : 'Edit'} Kennel Staff — {initialData.name}
            </h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '3px 0 0' }}>{initialData.id} · Staff Member</p>
          </div>
          <span style={{ marginLeft: 8, background: '#DCFCE7', color: '#16A34A', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>
            {initialData.status}
          </span>
        </div>
      </ModalHeader>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#F8F9FA' }}>
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === 'identity' && (
          <SectionCard title="Staff Identity">
            <Grid2>
              <div style={fieldWrap}>
                <label style={lbl}>Staff Name</label>
                <input style={inputStyle(true)} value={initialData.name} readOnly />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Staff ID</label>
                <input style={inputStyle(true)} value={initialData.id} readOnly />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Status</label>
                <input style={inputStyle(true)} value={initialData.status} readOnly />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Avatar / Initials</label>
                <input style={inputStyle(true)} value={initialData.initials} readOnly />
              </div>
            </Grid2>
          </SectionCard>
        )}

        {activeTab === 'shift' && (
          <SectionCard title="Shift & Experience">
            <Grid2>
              <div style={fieldWrap}>
                <label style={lbl}>Experience (Years)</label>
                <input
                  style={inputStyle(readOnly)} type="number"
                  value={form.experience} readOnly={readOnly}
                  onChange={e => set('experience', e.target.value)}
                />
              </div>
              <div style={fieldWrap}>
                <label style={lbl}>Shift</label>
                <select
                  style={selectStyle(readOnly, !!form.shift)}
                  value={form.shift} disabled={readOnly}
                  onChange={e => set('shift', e.target.value)}
                >
                  <option value="">Select Shift</option>
                  {kennel_shifts.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {!readOnly && (
                <div style={{ ...fieldWrap, gridColumn: '1 / -1' }}>
                  <label style={lbl}>Additional Notes</label>
                  <textarea rows={4} placeholder="Any updates or notes..."
                    value={form.notes} onChange={e => set('notes', e.target.value)}
                    style={{ ...inputStyle(false), resize: 'vertical' }} />
                </div>
              )}
            </Grid2>
          </SectionCard>
        )}

        {activeTab === 'species' && (
          <SectionCard title="Species & Skills">
            <label style={lbl}>Species Comfortable With</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {kennel_species.map(s => {
                const active = form.species.includes(s);
                return (
                  <label key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: active ? 'rgba(249,115,22,0.10)' : '#F9FAFB',
                    border: `1.5px solid ${active ? '#F97316' : '#E5E7EB'}`,
                    borderRadius: 10, padding: '10px 18px',
                    cursor: readOnly ? 'default' : 'pointer',
                    fontSize: 13, color: active ? '#F97316' : '#6B7280',
                    fontWeight: active ? 600 : 400, transition: 'all .15s',
                  }}>
                    <input type="checkbox" checked={active} disabled={readOnly}
                      style={{ accentColor: '#F97316' }}
                      onChange={() => !readOnly && set('species', active ? form.species.filter(x => x !== s) : [...form.species, s])} />
                    {s}
                  </label>
                );
              })}
            </div>
          </SectionCard>
        )}

        {activeTab === 'certs' && (
          <SectionCard title="Certifications">
            <div style={{ marginBottom: 20, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2E' }}>First-Aid Certified?</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Toggle on and upload certificate if certified</div>
                </div>
                <Toggle on={form.firstAid} onChange={v => set('firstAid', v)} readOnly={readOnly} />
              </div>
              {form.firstAid && (
                <div style={{ marginTop: 16 }}>
                  <label style={lbl}>Upload First-Aid Certificate</label>
                  <div style={{ border: '2px dashed #FED7AA', borderRadius: 10, padding: '20px', textAlign: 'center', background: '#FFF7ED' }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>📄</div>
                    <input type="file" accept=".pdf,image/*" disabled={readOnly} style={{ fontSize: 13, color: '#F97316' }} />
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>PDF or image, max 5MB</div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2E' }}>Can Administer Medication?</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Allow this staff to administer medications to animals</div>
              </div>
              <Toggle on={form.canMedicate} onChange={v => set('canMedicate', v)} readOnly={readOnly} />
            </div>
          </SectionCard>
        )}
      </div>

      {/* Footer */}
      <ModalFooter>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
          {readOnly ? '👁 View-only mode' : '* Changes are not saved automatically'}
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnSecondary} onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</button>
          {!readOnly && <button style={btnPrimary} onClick={onClose}>✓ Update Staff</button>}
        </div>
      </ModalFooter>
    </Backdrop>
  );
}

/* ────────── Shared shell components ────────── */
function Backdrop({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.50)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 1500, height: '88vh',
          background: '#fff', borderRadius: 20,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 32px 100px rgba(0,0,0,0.28)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ onClose, children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '22px 40px', borderBottom: '1px solid #F3F4F6',
      background: '#fff', flexShrink: 0,
    }}>
      {children}
      <button
        onClick={onClose}
        style={{
          background: 'none', border: '1.5px solid #E5E7EB', borderRadius: 8,
          width: 34, height: 34, cursor: 'pointer', fontSize: 18, color: '#9CA3AF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >✕</button>
    </div>
  );
}

function ModalFooter({ children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 40px', borderTop: '1px solid #F3F4F6',
      background: '#fff', flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                      */
/* ──────────────────────────────────────────────────────────────────── */
export default function KennelStaff() {
  const [modal, setModal] = useState(null);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {modal?.mode === 'add' && <AddModal onClose={() => setModal(null)} />}
      {(modal?.mode === 'view' || modal?.mode === 'edit') && (
        <ViewEditModal
          onClose={() => setModal(null)}
          initialData={modal.staff}
          readOnly={modal.mode === 'view'}
        />
      )}

      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1D2E', margin: 0 }}>Kennel Staff</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>Manage kennel staff capabilities & certifications</p>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} style={btnPrimary}>+ Add Kennel Details</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18 }}>
          {kennelStaff.map(k => (
            <div key={k.id} style={{ background: '#fff', border: '1px solid #EAE5DC', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${k.color}22`, border: `2px solid ${k.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: k.color, flexShrink: 0 }}>
                  {k.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>{k.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{k.id} · {k.experience} yrs exp</div>
                </div>
                <span style={{ background: '#DCFCE7', color: '#16A34A', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>{k.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'SHIFT',     value: k.shift,                                      color: '#F97316' },
                  { label: 'FIRST AID', value: k.firstAidCert ? '✓ Yes' : '✗ No',           color: k.firstAidCert ? '#22C55E' : '#EF4444' },
                  { label: 'MEDICATE',  value: k.canMedicate  ? '✓ Yes' : '✗ No',           color: k.canMedicate  ? '#22C55E' : '#EF4444' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 11, color, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 6 }}>SPECIES COMFORTABLE WITH</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {k.species.map(s => (
                    <span key={s} style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 12, border: '1px solid rgba(249,115,22,0.2)' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
                <button
                  onClick={() => setModal({ mode: 'view', staff: k })}
                  style={{ flex: 1, background: '#F9FAFB', color: '#6B7280', border: '1px solid #EAE5DC', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; }}
                >👁 View Details</button>
                <button
                  onClick={() => setModal({ mode: 'edit', staff: k })}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#E8630A,#c4500a)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >✎ Edit Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}