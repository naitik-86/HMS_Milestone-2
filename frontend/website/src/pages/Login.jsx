import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center shadow">
        <LogIn className="w-6 h-6" />
      </div>
      <h1 className="font-serif text-4xl font-bold mt-6 text-ink">
        Welcome back
      </h1>
      <p className="text-ink-soft mt-2">Log in to your account</p>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-sm">
        <button className="w-full inline-flex items-center justify-center gap-3 border border-line rounded-lg py-3 text-sm font-medium hover:bg-slate-50">
          <GoogleIcon /> Continue with Google
        </button>
        <div className="my-6 flex items-center gap-4 text-xs text-ink-soft">
          <div className="h-px bg-line flex-1" />
          OR
          <div className="h-px bg-line flex-1" />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-ink">Password</label>
              <a
                href="#"
                className="text-sm font-medium text-brand-dark hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-line focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
              />
            </div>
          </div>
          <button className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-xl">
            Log in
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        Don't have an account?{" "}
        <Link to="/login" className="text-brand-dark font-medium hover:underline">
          Create one
        </Link>
      </p>
      <Link to="/" className="mt-8 text-sm text-ink-soft hover:text-ink">
        ← Back home
      </Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}
