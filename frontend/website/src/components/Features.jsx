import {
  Calendar, Stethoscope, Pill, BarChart3, Shield, Users, Video, Bell,
  Syringe, FlaskConical, Clipboard, Scissors,
} from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const features = [
  { icon: Calendar, color: "bg-blue-100 text-blue-600", title: "Appointment Management", text: "Smart scheduling with automated reminders, real-time availability, and drag-and-drop calendar." },
  { icon: Stethoscope, color: "bg-green-100 text-green-600", title: "Pet Medical Records", text: "Complete digital health records including diagnostics, surgeries, prescriptions, and treatment history." },
  { icon: Pill, color: "bg-orange-100 text-orange-600", title: "Pharmacy Management", text: "End-to-end medicine inventory, automated reorder alerts, prescription management, and expiry tracking." },
  { icon: BarChart3, color: "bg-purple-100 text-purple-600", title: "Analytics Dashboard", text: "Real-time revenue tracking, patient analytics, staff performance metrics, and business insights." },
  { icon: Shield, color: "bg-green-100 text-green-600", title: "Role-Based Access", text: "Enterprise-grade RBAC with customizable permissions for doctors, staff, receptionists, and admins." },
  { icon: Users, color: "bg-pink-100 text-pink-600", title: "Multi-Tenant SaaS", text: "Independent workspaces for multiple clinics with isolated data, branding, and subscription plans." },
  { icon: Video, color: "bg-cyan-100 text-cyan-600", title: "Telemedicine", text: "Built-in video consultations with screen sharing, file uploads, and integrated prescription delivery." },
  { icon: Bell, color: "bg-yellow-100 text-yellow-600", title: "Notification Engine", text: "Multi-channel notifications via email, SMS, WhatsApp, and in-app alerts for all stakeholders." },
  { icon: Syringe, color: "bg-red-100 text-red-500", title: "Vaccination Tracking", text: "Automated vaccination schedules, reminder systems, certificate generation, and compliance tracking." },
  { icon: FlaskConical, color: "bg-violet-100 text-violet-600", title: "Lab Management", text: "Laboratory test ordering, result tracking, report generation, and integration with diagnostics." },
  { icon: Clipboard, color: "bg-teal-100 text-teal-600", title: "Billing System", text: "Automated invoicing, payment tracking, insurance claims, tax calculations, and financial reports." },
  { icon: Scissors, color: "bg-rose-100 text-rose-500", title: "Grooming & Kennel", text: "Grooming appointments, kennel boarding management, pet daycare scheduling, and service tracking." },
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionBadge>Features</SectionBadge>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold text-slate-900">
            Everything Your Clinic Needs
          </h2>
          <p className="mt-5 text-slate-600 text-lg">
            A comprehensive suite of tools designed specifically for veterinary healthcare — from appointments to analytics.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-6 font-bold text-lg text-slate-900">{f.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
