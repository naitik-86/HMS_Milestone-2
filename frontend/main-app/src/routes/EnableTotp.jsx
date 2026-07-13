import { useEffect } from 'react';

export default function EnableTotp() {
  // TOTP has been removed from the project.
  // Keep this route so navigation does not break.

  useEffect(() => {
    // Clear any old flag so the user can log in normally.
    localStorage.setItem('totpRequired', 'false');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-lg border border-slate-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Authenticator (TOTP) Disabled</h1>
        <p className="text-slate-500 mt-2">
          This feature has been removed from the project. You can log in normally.
        </p>
      </div>
    </div>
  );
}

