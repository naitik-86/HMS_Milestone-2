import { Target, Eye, Heart, Shield, Zap, Globe } from "lucide-react";
import SectionBadge from "../components/SectionBadge.jsx";

const values = [
  { icon: Heart, title: "Compassion First", text: "Every feature we build serves the well-being of animals and the people who care for them." },
  { icon: Shield, title: "Trust & Security", text: "Enterprise-grade security with data isolation ensures your clinic data is always protected." },
  { icon: Zap, title: "Innovation", text: "We continuously push boundaries to deliver cutting-edge veterinary technology solutions." },
  { icon: Globe, title: "Accessibility", text: "Making advanced veterinary management tools accessible to clinics of all sizes across India." },
];

const team = [
  { name: "Dr. Arjun Mehta", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Priya Sharma", role: "CTO", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Rahul Singh", role: "Head of Product", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Dr. Neha Gupta", role: "Veterinary Advisor", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-green-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionBadge>About PAHMS</SectionBadge>
          <h1 className="mt-6 font-serif text-5xl lg:text-6xl font-bold text-slate-900 leading-tight max-w-4xl">
            Revolutionizing Veterinary Healthcare, One Clinic at a Time
          </h1>
          <p className="mt-7 text-lg text-slate-600 max-w-3xl leading-relaxed">
            PAHMS was born from a simple observation — veterinary clinics deserve the same powerful digital tools that human healthcare systems enjoy. We're on a mission to digitize and automate every aspect of animal healthcare management.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-8">
          {[
            { icon: Target, c: "bg-green-100 text-green-700", title: "Our Mission", text: "To empower every veterinary clinic with an enterprise-grade digital platform that streamlines operations, improves patient outcomes, and enables sustainable growth — regardless of the clinic's size or location." },
            { icon: Eye, c: "bg-orange-100 text-orange-600", title: "Our Vision", text: "To become the global standard for veterinary healthcare management — a unified ecosystem where every pet's health journey is tracked, every clinic runs efficiently, and every vet has access to world-class tools." },
          ].map((b) => (
            <div key={b.title} className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${b.c}`}>
                <b.icon className="w-7 h-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-slate-900">{b.title}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-green-50/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900">Our Core Values</h2>
          <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto">
            The principles that guide every decision we make and every feature we build.
          </p>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="mt-5 font-bold text-lg text-slate-900">{v.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <SectionBadge>Our Team</SectionBadge>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold text-slate-900">Meet the People Behind PAHMS</h2>
          <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto">
            A passionate team of engineers, veterinarians, and product experts building the future of animal healthcare.
          </p>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <img src={m.img} alt={m.name} className="w-56 h-56 object-cover rounded-2xl mx-auto" />
                <h3 className="mt-5 font-bold text-lg text-slate-900">{m.name}</h3>
                <p className="text-green-700 text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[["2022","Founded"],["50+","Team Members"],["500+","Clinics Served"],["99.9%","Uptime SLA"]].map(([v,l]) => (
            <div key={l}>
              <div className="font-serif text-4xl lg:text-5xl font-bold text-white">{v}</div>
              <div className="mt-2 text-sm text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
