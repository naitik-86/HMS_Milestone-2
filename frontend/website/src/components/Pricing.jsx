import { Check, ArrowRight, Sparkles } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const plans = [
  { name: "Starter", desc: "For small clinics getting started", price: "2,999",
    features: ["Up to 3 staff members", "Appointment scheduling", "Basic patient records", "Email notifications", "1 clinic location", "Standard support"] },
  { name: "Professional", desc: "For growing practices", price: "5,999", popular: true,
    features: ["Up to 15 staff members", "Advanced scheduling", "Full medical records", "Pharmacy management", "Billing & invoicing", "Telemedicine", "Up to 3 locations", "Priority support"] },
  { name: "Enterprise", desc: "For multi-branch hospitals", price: "12,999",
    features: ["Unlimited staff members", "All Professional features", "Advanced analytics", "Custom integrations", "Unlimited locations", "Dedicated account manager", "API access", "24/7 premium support"] },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionBadge icon={Sparkles}>Simple Pricing</SectionBadge>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold text-slate-900">Plans That Scale With You</h2>
          <p className="mt-5 text-slate-600 text-lg">
            Start small, grow big. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-start">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative bg-white rounded-3xl p-10 border ${
                p.popular ? "border-green-600 shadow-2xl shadow-green-100 lg:-mt-6 lg:pb-14" : "border-slate-200"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold text-slate-900">{p.name}</h3>
              <p className="mt-2 text-slate-600">{p.desc}</p>
              <div className="mt-6 flex items-baseline">
                <span className="font-serif text-5xl font-bold text-slate-900">₹{p.price}</span>
                <span className="ml-1 text-slate-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-10 w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl transition ${
                  p.popular
                    ? "bg-green-700 hover:bg-green-800 text-white"
                    : "border border-slate-200 hover:border-slate-300 text-slate-800"
                }`}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
