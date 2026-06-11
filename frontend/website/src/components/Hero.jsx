import { ArrowRight, Play, Shield, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "./SectionBadge.jsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionBadge icon={Zap}>Enterprise-Grade Veterinary Platform</SectionBadge>
          <h1 className="mt-6 font-serif text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.05]">
            Transform Your<br />
            <span className="text-green-700 relative inline-block">
              Veterinary
              <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" fill="none">
                <path d="M2 7 C 80 1, 180 1, 298 6" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            <span className="text-slate-900">Practice</span>
          </h1>
          <p className="mt-7 text-lg text-slate-600 leading-relaxed max-w-xl">
            PAHMS is a complete multi-tenant SaaS platform designed to digitally manage veterinary clinics, pet hospitals, and animal healthcare organizations — all from one centralized system.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white font-semibold px-7 py-4 rounded-xl transition"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center gap-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-7 py-4 rounded-xl transition">
              <Play className="w-5 h-5" /> Learn More
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> HIPAA Compliant</div>
            <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-orange-500" /> 500+ Clinics Trust Us</div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-3 relative">
            <div className="flex gap-1.5 px-2 py-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&q=80"
              alt="Veterinarian with cat"
              className="rounded-xl w-full h-[420px] object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
              <div className="h-2 w-1/2 bg-green-100 rounded-full" />
            </div>
          </div>
          <div className="absolute -top-5 -right-5 bg-white rounded-xl shadow-xl px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Live
            </div>
            <div className="text-sm text-slate-500 mt-1">Appointments</div>
            <div className="font-serif text-3xl font-bold text-green-700">142</div>
          </div>
          <div className="absolute -bottom-6 left-6 bg-white rounded-xl shadow-xl px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-xl text-slate-900">2,847</div>
              <div className="text-xs text-slate-500">Pets Treated Today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
