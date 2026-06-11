import { Building2, Heart, Users, Globe } from "lucide-react";

const stats = [
  { icon: Building2, color: "text-green-500", value: "500+", label: "Clinics Onboarded" },
  { icon: Heart, color: "text-orange-500", value: "1.2M+", label: "Pets Treated" },
  { icon: Users, color: "text-green-500", value: "5,000+", label: "Veterinarians" },
  { icon: Globe, color: "text-orange-500", value: "25+", label: "Cities Covered" },
];

export default function Stats() {
  return (
    <section className="bg-[#0a0a0a] py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.08),transparent_60%),radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.08),transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-5">
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className="font-serif text-4xl lg:text-5xl font-bold text-white">{s.value}</div>
              <div className="mt-2 text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
