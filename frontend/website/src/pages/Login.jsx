import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

// 🔑 Replace with your Google OAuth Client ID from:
// https://console.cloud.google.com → APIs & Services → Credentials
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin + "/auth/google/callback";

function handleGoogleLogin() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  const onGoogleClick = () => {
    setGoogleLoading(true);
    handleGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-green-700 text-white flex items-center justify-center shadow-md">
        <LogIn className="w-6 h-6" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mt-5 text-gray-900 tracking-tight">
        Welcome back
      </h1>
      <p className="text-gray-500 mt-2 text-sm">Log in to your account</p>

      {/* Card */}
      <div className="mt-8 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Google Button */}
        <button
          onClick={onGoogleClick}
          disabled={googleLoading}
          className="w-full inline-flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4 text-xs text-gray-400">
          <div className="h-px bg-gray-200 flex-1" />
          OR
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-800">Password</label>
              <a href="#" className="text-sm font-medium text-green-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Log in
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-green-700 font-medium hover:underline">
          Create one
        </Link>
      </p>
      <Link to="/" className="mt-6 text-sm text-gray-400 hover:text-gray-600">
        ← Back home
      </Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}