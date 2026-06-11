import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SectionBadge from "./SectionBadge.jsx";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionBadge color="orange" icon={Sparkles}>Start Your Free Trial</SectionBadge>
        <h2 className="mt-6 font-serif text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
          Ready to Modernize Your Veterinary Practice?
        </h2>
        <p className="mt-6 text-lg text-slate-600">
          Join 500+ clinics already using PAHMS to streamline operations, improve patient care, and grow their practice. No credit card required.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-xl">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/contact" className="inline-flex items-center bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-8 py-4 rounded-xl">
            Talk to Sales
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">Free 14-day trial • No setup fees • Cancel anytime</p>
      </div>
    </section>
  );
}
