import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
        <UserPlus className="w-7 h-7 text-white" />
      </div>
      <h1 className="mt-6 font-serif text-4xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-2 text-slate-500">Start your 14-day free trial</p>

      <div className="mt-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
        <Field label="Full Name" icon={User} placeholder="Dr. Your Name" />
        <Field label="Email" icon={Mail} type="email" placeholder="you@example.com" />
        <Field label="Password" icon={Lock} type="password" placeholder="Create a password" />
        <button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl">
          Sign Up Free
        </button>
      </div>

      <p className="mt-7 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-green-700 font-semibold">Log in</Link>
      </p>
    </div>
  );
}

function Field({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          {...props}
          className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-600"
        />
      </div>
    </div>
  );
}
