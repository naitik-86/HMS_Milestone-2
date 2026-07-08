import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginGateRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const passwordResetRequired = localStorage.getItem('passwordResetRequired') === 'true';
    const totpRequired = localStorage.getItem('totpRequired') === 'true';

    if (passwordResetRequired) return navigate('/change-password', { replace: true });
    if (totpRequired) return navigate('/enable-totp', { replace: true });
    return navigate('/clinic', { replace: true });
  }, [navigate]);

  return null;
}

