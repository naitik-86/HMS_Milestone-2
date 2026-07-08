import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Minimal placeholder: backend password reset endpoint not present in this repo.
// So this page can be wired once you implement /password-reset.
export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      // TODO: implement backend endpoint for staff password reset on first login.
      // For now, just clear the local flag so user can continue to TOTP.
      localStorage.setItem('passwordResetRequired', 'false');
      alert('Password reset endpoint not implemented yet. Proceeding to TOTP setup.');
      navigate('/enable-totp');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-lg border border-slate-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
        <p className="text-slate-500 mt-2">First login password reset (to be wired with backend endpoint).</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Current password</label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">New password</label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            onClick={submit}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

