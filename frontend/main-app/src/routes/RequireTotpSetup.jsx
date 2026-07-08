import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Simple redirect gate based on flags stored in localStorage.
 */
export default function RequireTotpSetup({ children }) {
  const navigate = useNavigate();

  const passwordResetRequired = localStorage.getItem('passwordResetRequired') === 'true';
  const totpRequired = localStorage.getItem('totpRequired') === 'true';

  useEffect(() => {
    if (passwordResetRequired) {
      navigate('/change-password', { replace: true });
      return;
    }
    if (totpRequired) {
      navigate('/enable-totp', { replace: true });
      return;
    }
  }, [navigate, passwordResetRequired, totpRequired]);

  // If we need setup, the effect will redirect.
  // If not, show children.
  if (passwordResetRequired || totpRequired) return null;
  return children;
}

