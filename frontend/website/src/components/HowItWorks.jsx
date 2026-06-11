import { UserPlus, Settings, Rocket } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const steps = [
  { n: "01", icon: UserPlus, title: "Register Your Clinic", text: "Sign up with your clinic details, upload verification documents, and create your workspace in minutes." },
  { n: "02", icon: Settings, title: "Configure Your System", text: "Set up departments, add staff with role-based access, configure services, pharmacy, and notification preferences." },
  { n: "03", icon: Rocket, title: "Go Live", text: "Start managing appointments, patient records, billing, telemedicine, and analytics from your personalized dashboard." },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionBadge color="orange">How It Works</SectionBadge>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold text-slate-900">Three Simple Steps</h2>
          <p className="mt-5 text-slate-600 text-lg">Get your veterinary clinic up and running on PAHMS in just a few simple steps.</p>
        </div>

        <div className="mt-20 relative grid md:grid-cols-3 gap-12">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-green-200" />
          {steps.map((s) => (
            <div key={s.n} className="text-center relative">
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-green-50 flex items-center justify-center">
                <s.icon className="w-10 h-10 text-green-700" />
                <span className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-8 font-serif text-2xl font-bold text-slate-900">{s.title}</h3>
              <p className="mt-4 text-slate-600 max-w-xs mx-auto">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
