import { Heart, Shield, Zap, Globe, Target, Eye } from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";

export default function About() {
  return (
    <>
      <section className="legal-gradient py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-light text-brand-dark text-sm font-medium">
            About PAHMS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mt-8 leading-tight text-ink max-w-4xl">
            Revolutionizing Veterinary Healthcare, One Clinic at a Time
          </h1>
          <p className="mt-8 text-lg text-ink-soft max-w-3xl leading-relaxed">
            PAHMS was born from a simple observation — veterinary clinics
            deserve the same powerful digital tools that human healthcare
            systems enjoy. We're on a mission to digitize and automate every
            aspect of animal healthcare management.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-8">
          <MVCard
            icon={Target}
            title="Our Mission"
            desc="To empower every veterinary clinic with an enterprise-grade digital platform that streamlines operations, improves patient outcomes, and enables sustainable growth — regardless of the clinic's size or location."
            tone="brand"
          />
          <MVCard
            icon={Eye}
            title="Our Vision"
            desc="To become the global standard for veterinary healthcare management — a unified ecosystem where every pet's health journey is tracked, every clinic runs efficiently, and every vet has access to world-class tools."
            tone="accent"
          />
        </div>
      </section>

      <section className="bg-brand-soft py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide every decision we make and every feature we build."
          />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <article
                key={v.title}
                className="bg-white rounded-2xl p-8 text-center border border-line shadow-sm"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-light flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-brand-dark" />
                </div>
                <h3 className="mt-6 font-semibold text-lg text-ink">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {v.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionHeader
            badge="Our Team"
            title="Meet the People Behind PAHMS"
            subtitle="A passionate team of engineers, veterinarians, and product experts building the future of animal healthcare."
          />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((p) => (
              <div key={p.name} className="text-center">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full aspect-square object-cover rounded-2xl border border-line"
                />
                <h3 className="mt-6 font-semibold text-lg text-ink">
                  {p.name}
                </h3>
                <p className="text-sm text-ink-soft">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-5xl font-bold text-white">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function MVCard({ icon: Icon, title, desc, tone }) {
  const bg =
    tone === "brand" ? "bg-brand-light text-brand-dark" : "bg-accent-soft text-accent";
  return (
    <article className="bg-white rounded-2xl border border-line p-10 shadow-sm">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-3xl font-bold mt-7 text-ink">{title}</h3>
      <p className="mt-5 text-ink-soft leading-relaxed">{desc}</p>
    </article>
  );
}

const VALUES = [
  {
    icon: Heart,
    title: "Compassion First",
    desc: "Every feature we build serves the well-being of animals and the people who care for them.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    desc: "Enterprise-grade security with data isolation ensures your clinic data is always protected.",
  },
  {
    icon: Zap,
    title: "Innovation",
    desc: "We continuously push boundaries to deliver cutting-edge veterinary technology solutions.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    desc: "Making advanced veterinary management tools accessible to clinics of all sizes across India.",
  },
];

const TEAM = [
  {
    name: "Dr. Arjun Mehta",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priya Sharma",
    role: "CTO",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rahul Singh",
    role: "Head of Product",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Neha Gupta",
    role: "Veterinary Advisor",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
];

const STATS = [
  { value: "2022", label: "Founded" },
  { value: "50+", label: "Team Members" },
  { value: "500+", label: "Clinics Served" },
  { value: "99.9%", label: "Uptime SLA" },
];
