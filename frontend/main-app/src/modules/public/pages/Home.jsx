import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Play,
  Calendar,
  Stethoscope,
  Pill,
  BarChart3,
  Users,
  Video,
  Bell,
  Syringe,
  FlaskConical,
  ClipboardList,
  Scissors,
  Award,
  Cpu,
  Cloud,
  Database,
  Building2,
  Globe,
  UserPlus,
  Settings,
  Rocket,
  Star,
  Sparkles,
  Lock,
  RefreshCw,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <Trust />
      <CTA />
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="hero-gradient">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light text-brand-dark text-sm font-medium">
            <Zap className="w-4 h-4" /> Enterprise-Grade Veterinary Platform
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mt-8 leading-[1.05] text-ink">
            Transform Your
            <br />
            <span className="text-brand-dark underline-accent">Veterinary</span>{" "}
            Practice
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft max-w-xl">
            PAHMS is a complete multi-tenant SaaS platform designed to digitally
            manage veterinary clinics, pet hospitals, and animal healthcare
            organizations — all from one centralized system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-4 rounded-xl shadow-sm transition"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white text-ink font-semibold px-7 py-4 rounded-xl border border-line shadow-sm hover:border-ink-soft transition">
              <Play className="w-4 h-4" /> Learn More
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm">
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <Shield className="w-4 h-4 text-brand" /> HIPAA Compliant
            </span>
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <Heart className="w-4 h-4 text-accent" /> 500+ Clinics Trust Us
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl bg-white shadow-xl border border-line p-3">
            <div className="flex items-center gap-1.5 px-3 pt-1 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&q=80"
              alt="Veterinarian caring for cat"
              className="rounded-xl aspect-[4/3] object-cover w-full"
            />
            <div className="px-2 pt-4 pb-2 space-y-2">
              <div className="h-2 bg-slate-100 rounded w-3/4" />
              <div className="h-2 bg-brand-light rounded w-1/3" />
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-line px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-brand" /> Live
            </div>
            <div className="mt-1 text-xs text-ink-soft">Appointments</div>
            <div className="text-2xl font-bold text-brand-dark">142</div>
          </div>

          <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-lg border border-line px-5 py-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center">
              <Heart className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-2xl font-bold text-ink">2,847</div>
              <div className="text-xs text-ink-soft">Pets Treated Today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
const FEATURES = [
  { icon: Calendar,     title: "Appointment Management", desc: "Smart scheduling with automated reminders, real-time availability, and drag-and-drop calendar.",                                              tone: "indigo" },
  { icon: Stethoscope,  title: "Pet Medical Records",    desc: "Complete digital health records including diagnostics, surgeries, prescriptions, and treatment history.",                                    tone: "green"  },
  { icon: Pill,         title: "Pharmacy Management",    desc: "End-to-end medicine inventory, automated reorder alerts, prescription management, and expiry tracking.",                                     tone: "orange" },
  { icon: BarChart3,    title: "Analytics Dashboard",    desc: "Real-time revenue tracking, patient analytics, staff performance metrics, and business insights.",                                           tone: "violet" },
  { icon: Shield,       title: "Role-Based Access",      desc: "Enterprise-grade RBAC with customizable permissions for doctors, staff, receptionists, and admins.",                                         tone: "green"  },
  { icon: Users,        title: "Multi-Tenant SaaS",      desc: "Independent workspaces for multiple clinics with isolated data, branding, and subscription plans.",                                          tone: "pink"   },
  { icon: Video,        title: "Telemedicine",           desc: "Built-in video consultations with screen sharing, file uploads, and integrated prescription delivery.",                                      tone: "sky"    },
  { icon: Bell,         title: "Notification Engine",    desc: "Multi-channel notifications via email, SMS, WhatsApp, and in-app alerts for all stakeholders.",                                             tone: "amber"  },
  { icon: Syringe,      title: "Vaccination Tracking",   desc: "Automated vaccination schedules, reminder systems, certificate generation, and compliance tracking.",                                        tone: "rose"   },
  { icon: FlaskConical, title: "Lab Management",         desc: "Laboratory test ordering, result tracking, report generation, and integration with diagnostics.",                                            tone: "violet" },
  { icon: ClipboardList,title: "Billing System",         desc: "Automated invoicing, payment tracking, insurance claims, tax calculations, and financial reports.",                                          tone: "teal"   },
  { icon: Scissors,     title: "Grooming & Kennel",      desc: "Grooming appointments, kennel boarding management, pet daycare scheduling, and service tracking.",                                           tone: "pink"   },
];

const TONES = {
  indigo: "bg-indigo-100 text-indigo-600",
  green:  "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-500",
  violet: "bg-violet-100 text-violet-600",
  pink:   "bg-pink-100 text-pink-500",
  sky:    "bg-sky-100 text-sky-500",
  amber:  "bg-amber-100 text-amber-500",
  rose:   "bg-rose-100 text-rose-500",
  teal:   "bg-teal-100 text-teal-600",
};

function FeatureCard({ icon: Icon, title, desc, tone }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-7 shadow-sm hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${TONES[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-6 font-semibold text-lg text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}

function Features() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          badge="Features"
          title="Everything Your Clinic Needs"
          subtitle="A comprehensive suite of tools designed specifically for veterinary healthcare — from appointments to analytics."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
function Stats() {
  const items = [
    { icon: Building2, value: "500+",  label: "Clinics Onboarded", tone: "text-emerald-400" },
    { icon: Heart,     value: "1.2M+", label: "Pets Treated",      tone: "text-orange-400" },
    { icon: Users,     value: "5,000+",label: "Veterinarians",     tone: "text-emerald-400" },
    { icon: Globe,     value: "25+",   label: "Cities Covered",    tone: "text-orange-400" },
  ];
  return (
    <section className="dark-section py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {items.map(({ icon: Icon, value, label, tone }) => (
          <div key={label}>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
              <Icon className={`w-6 h-6 ${tone}`} />
            </div>
            <div className="mt-6 font-serif text-4xl md:text-5xl font-bold text-white">{value}</div>
            <div className="mt-2 text-sm text-slate-400">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Why Us ---------------- */
function WhyUs() {
  const items = [
    { icon: Lock,     title: "HIPAA Compliant",    desc: "Enterprise-grade security standards to protect sensitive patient data at all times.",                                    tone: "from-violet-500/20 to-violet-500/5",  iconColor: "text-violet-400" },
    { icon: Cpu,      title: "AI-Powered Insights", desc: "Smart analytics that predict patient trends, optimize scheduling, and flag inventory shortages.",                        tone: "from-fuchsia-500/20 to-fuchsia-500/5", iconColor: "text-fuchsia-400" },
    { icon: Cloud,    title: "99.9% Uptime SLA",   desc: "Reliable cloud infrastructure with guaranteed availability for mission-critical operations.",                            tone: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
    { icon: Database, title: "Data Isolation",     desc: "Complete logical data separation between tenants with independent backups and recovery.",                                tone: "from-orange-500/20 to-orange-500/5",  iconColor: "text-orange-400" },
  ];
  return (
    <section className="dark-section py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          badge="Why PAHMS"
          badgeColor="dark"
          badgeIcon={Award}
          title="Why Clinics Choose Us"
          subtitle="We don't just build software — we build trust, reliability, and partnerships that last."
          light
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc, tone, iconColor }) => (
            <div
              key={title}
              className="rounded-2xl p-7 bg-white/[0.03] border border-white/10 hover:border-white/20 transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="mt-6 font-semibold text-lg text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How It Works ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", icon: UserPlus, title: "Register Your Clinic",    desc: "Sign up with your clinic details, upload verification documents, and create your workspace in minutes." },
    { n: "02", icon: Settings, title: "Configure Your System",   desc: "Set up departments, add staff with role-based access, configure services, pharmacy, and notification preferences." },
    { n: "03", icon: Rocket,   title: "Go Live",                 desc: "Start managing appointments, patient records, billing, telemedicine, and analytics from your personalized dashboard." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          badge="How It Works"
          badgeColor="accent"
          title="Three Simple Steps"
          subtitle="Get your veterinary clinic up and running on PAHMS in just a few simple steps."
        />
        <div className="mt-20 grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t border-dashed border-brand/30" />
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="text-center relative">
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-brand-soft border border-brand/15 flex items-center justify-center">
                  <Icon className="w-9 h-9 text-brand-dark" />
                </div>
                <span className="absolute -top-2 -right-2 bg-brand text-white text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center shadow-md">
                  {n}
                </span>
              </div>
              <h3 className="mt-8 font-serif text-2xl font-bold text-ink">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const tcards = [
    { quote: "PAHMS transformed how we manage our clinic. From appointment booking to pharmacy inventory — everything is now in one place. Our efficiency has improved by 60%.",                               name: "Dr. Priya Sharma",  role: "Lead Veterinarian, HappyPaws Clinic, Mumbai",        initials: "PS" },
    { quote: "The multi-tenant architecture is a game-changer. We now manage all three of our clinic branches from a single dashboard with complete data isolation.",                                         name: "Dr. Rajesh Kumar",  role: "Owner, PetCare Hospital, Bangalore",                 initials: "RK" },
    { quote: "Telemedicine integration has been invaluable. We now provide follow-up consultations remotely, saving pet parents time while keeping our schedules efficient.",                                  name: "Dr. Ananya Patel",  role: "Veterinary Surgeon, AnimalWelfare Trust, Delhi",     initials: "AP" },
    { quote: "The analytics dashboard gives us insights we never had before — revenue trends, patient demographics, staff performance. It's helped us grow revenue by 35%.",                                 name: "Dr. Vikram Reddy",  role: "Clinic Director, VetLife Center, Hyderabad",         initials: "VR" },
    { quote: "Vaccination tracking alone saves us hours every week. Automated reminders and certificate generation have reduced no-shows by nearly half.",                                                    name: "Dr. Meera Iyer",    role: "Head Veterinarian, FurCare Clinic, Chennai",         initials: "MI" },
    { quote: "The role-based access control is perfect for our large team. Receptionists, nurses, and doctors each see exactly what they need without compromising security.",                                name: "Dr. Arjun Nair",    role: "Practice Manager, PetPoint Hospital, Pune",          initials: "AN" },
  ];
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          badge="Testimonials"
          badgeColor="accent"
          title="Trusted by Veterinarians"
          subtitle="Hear from veterinary professionals who use PAHMS daily to run their clinics more efficiently."
        />
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tcards.map(({ quote, name, role, initials }) => (
            <article key={name} className="bg-white border border-line rounded-2xl p-8 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-brand-light" fill="currentColor">
                <path d="M7 7h4v4H7c0 2 1 3 3 4v2c-3 0-6-2-6-6V7zm9 0h4v4h-4c0 2 1 3 3 4v2c-3 0-6-2-6-6V7z" />
              </svg>
              <p className="mt-5 text-ink-soft italic leading-relaxed text-sm">{quote}</p>
              <div className="mt-6 flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-line flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-semibold text-sm">
                  {initials}
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{name}</div>
                  <div className="text-xs text-ink-soft">{role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust ---------------- */
function Trust() {
  const items = [
    { icon: Lock,      title: "End-to-End Encryption", desc: "All communication and stored data encrypted using AES-256 and TLS 1.3 protocols.",                                    tone: "text-rose-400",   bg: "bg-rose-500/10"   },
    { icon: RefreshCw, title: "Seamless Migration",    desc: "Free data migration from your existing system with zero downtime and full data integrity.",                            tone: "text-sky-400",    bg: "bg-sky-500/10"    },
    { icon: Headphones,title: "24/7 Support",          desc: "Round-the-clock technical support via chat, phone, and email with guaranteed response times.",                        tone: "text-pink-400",   bg: "bg-pink-500/10"   },
    { icon: BadgeCheck,title: "GDPR Compliant",        desc: "Full compliance with global data protection regulations including GDPR and India's DPDP Act.",                         tone: "text-violet-400", bg: "bg-violet-500/10" },
  ];
  return (
    <section className="dark-section py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, desc, tone, bg }) => (
          <div key={title} className="rounded-2xl p-7 bg-white/[0.03] border border-white/10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon className={`w-5 h-5 ${tone}`} />
            </div>
            <h3 className="mt-6 font-semibold text-lg text-white">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="hero-gradient py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft text-accent text-sm font-medium">
          <Sparkles className="w-4 h-4" /> Start Your Free Trial
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mt-6 text-ink">
          Ready to Modernize Your Veterinary Practice?
        </h2>
        <p className="mt-5 text-lg text-ink-soft">
          Join 500+ clinics already using PAHMS to streamline operations, improve patient care, and grow their practice. No credit card required.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-4 rounded-xl shadow-sm"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-ink font-semibold px-7 py-4 rounded-xl border border-line"
          >
            Talk to Sales
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Free 14-day trial • No setup fees • Cancel anytime
        </p>
      </div>
    </section>
  );
}