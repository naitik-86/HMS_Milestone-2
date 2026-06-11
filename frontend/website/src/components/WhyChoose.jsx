import { ShieldCheck, Cpu, Cloud, Database, Lock, RefreshCw, Headphones, BadgeCheck, Award } from "lucide-react";

const top = [
  { icon: ShieldCheck, c: "bg-indigo-500/15 text-indigo-400", title: "HIPAA Compliant", text: "Enterprise-grade security standards to protect sensitive patient data at all times." },
  { icon: Cpu, c: "bg-purple-500/15 text-purple-400", title: "AI-Powered Insights", text: "Smart analytics that predict patient trends, optimize scheduling, and flag inventory shortages." },
  { icon: Cloud, c: "bg-green-500/15 text-green-400", title: "99.9% Uptime SLA", text: "Reliable cloud infrastructure with guaranteed availability for mission-critical operations." },
  { icon: Database, c: "bg-orange-500/15 text-orange-400", title: "Data Isolation", text: "Complete logical data separation between tenants with independent backups and recovery." },
];

const bottom = [
  { icon: Lock, c: "bg-red-500/15 text-red-400", title: "End-to-End Encryption", text: "All communication and stored data encrypted using AES-256 and TLS 1.3 protocols." },
  { icon: RefreshCw, c: "bg-teal-500/15 text-teal-400", title: "Seamless Migration", text: "Free data migration from your existing system with zero downtime and full data integrity." },
  { icon: Headphones, c: "bg-pink-500/15 text-pink-400", title: "24/7 Support", text: "Round-the-clock technical support via chat, phone, and email with guaranteed response times." },
  { icon: BadgeCheck, c: "bg-violet-500/15 text-violet-400", title: "GDPR Compliant", text: "Full compliance with global data protection regulations including GDPR and India's DPDP Act." },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#0a0a0a] py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.06),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm bg-slate-800 text-slate-200">
            <Award className="w-4 h-4 text-orange-400" /> Why PAHMS
          </span>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold">Why Clinics Choose Us</h2>
          <p className="mt-5 text-slate-400 text-lg">
            We don't just build software — we build trust, reliability, and partnerships that last.
          </p>
        </div>

        <Grid items={top} className="mt-14" />
        <Grid items={bottom} className="mt-6" />
      </div>
    </section>
  );
}

function Grid({ items, className = "" }) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {items.map((f) => (
        <div key={f.title} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.c}`}>
            <f.icon className="w-6 h-6" />
          </div>
          <h3 className="mt-6 font-bold text-lg">{f.title}</h3>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
