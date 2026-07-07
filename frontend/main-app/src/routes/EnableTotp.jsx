import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../shared/api/axios';


export default function EnableTotp() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [token, setToken] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // We don’t have staffId inside JWT payload.
  // So we ask user to enter it (from email) in this minimal implementation.
  // Later this can be derived from backend.

  useEffect(() => {
    const maybeStaffId = localStorage.getItem('staffIdForTotpSetup') || '';
    setStaffId(maybeStaffId);
  }, []);

  const setupTotp = async () => {
    if (!staffId) {
      alert('Enter your Staff ID to setup authenticator');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/staff-totp/setup', { staffId });
      setOtpauthUrl(res.data?.otpauth_url || '');
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Failed to setup TOTP');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyTotp = async () => {
    if (!staffId) {
      alert('Enter your Staff ID');
      return;
    }
    if (!token || token.length !== 6) {
      alert('Enter valid 6-digit code');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/staff-totp/verify', { staffId, token });
      localStorage.setItem('totpRequired', 'false');
      alert('TOTP enabled successfully');
      navigate('/');
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Invalid TOTP code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-lg border border-slate-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Enable Authenticator (TOTP)</h1>
        <p className="text-slate-500 mt-2">Scan the QR/OTPAUTH URL in your authenticator app and verify.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Staff ID</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
              value={staffId}
              onChange={(e) => {
                setStaffId(e.target.value);
                localStorage.setItem('staffIdForTotpSetup', e.target.value);
              }}
              placeholder="e.g. STF0001"
            />
          </div>

          <button
            onClick={setupTotp}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl"
            disabled={submitting}
          >
            {submitting ? 'Generating...' : 'Generate Authenticator QR'}
          </button>

          {otpauthUrl && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="text-sm font-semibold text-slate-900">otpauth_url (use in any QR generator/app)</div>
              <textarea
                className="w-full mt-2 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                rows={4}
                value={otpauthUrl}
                readOnly
              />
              <p className="text-xs text-slate-500 mt-2">You can paste this into an authenticator QR/otpauth flow.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">6-digit code</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
              value={token}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setToken(v);
              }}
              placeholder="123456"
            />
          </div>

          <button
            onClick={verifyTotp}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl"
            disabled={submitting}
          >
            {submitting ? 'Verifying...' : 'Verify & Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

