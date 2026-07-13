import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Simple redirect gate based on flags stored in localStorage.
 */
export default function RequireTotpSetup({ children }) {
  const navigate = useNavigate();

  const passwordResetRequired = localStorage.getItem('passwordResetRequired') === 'true';

  useEffect(() => {
    if (passwordResetRequired) {
      navigate('/change-password', { replace: true });
    }
  }, [navigate, passwordResetRequired]);

  // Keep force password reset gating, but do NOT block for TOTP anymore.
  if (passwordResetRequired) return null;
  return children;
}