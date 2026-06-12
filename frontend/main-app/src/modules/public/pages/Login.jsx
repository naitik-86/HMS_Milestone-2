import { LogIn, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { loginSuperAdmin } from "../api/authSuperAdmin";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginSuperAdmin(form);

      console.log("Login Success:", data);

      // redirect
      // window.location.href = import.meta.env.VITE_SUPERADMIN_URL;
      window.location.href =
        `${import.meta.env.VITE_SUPERADMIN_URL}/?token=${data.token}`;


    } catch (err) {
      console.error("Login Failed:", err);
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">

      <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
        <LogIn className="w-7 h-7 text-white" />
      </div>

      <h1 className="mt-6 font-serif text-4xl font-bold text-slate-900">
        Welcome back
      </h1>
      <p className="mt-2 text-slate-500">Log in to your account</p>

      {/* ✅ FORM START */}
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8"
      >
        <button
          type="button"
          className="w-full border border-slate-200 rounded-xl py-3 flex items-center justify-center gap-3 font-medium hover:bg-slate-50"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* EMAIL */}
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full border border-green-600 rounded-xl pl-10 pr-4 py-3 focus:outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex justify-between items-center mt-5 mb-2">
          <label className="text-sm font-semibold text-slate-900">
            Password
          </label>

        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="mt-7 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl"
        >
          Log in
        </button>
      </form>
      {/* ✅ FORM END */}

      <p className="mt-7 text-sm text-slate-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-green-700 font-semibold">
          Create one
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.6 29 4.7 24 4.7 13.4 4.7 4.7 13.4 4.7 24S13.4 43.3 24 43.3 43.3 34.6 43.3 24c0-1.2-.1-2.3-.3-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.6 29 4.7 24 4.7 16.6 4.7 10.2 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.3c5 0 9.5-1.9 12.9-5l-6-5c-2 1.4-4.4 2.3-6.9 2.3-5.3 0-9.7-2.9-11.3-7H6.4l-6.5 5C3.7 39.2 13 43.3 24 43.3z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2.1 3.8-3.9 5l6 5c-.4.4 6.6-4.8 6.6-14 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}