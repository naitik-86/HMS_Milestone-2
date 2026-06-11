import { Quote, Star } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const items = [
  { name: "Dr. Priya Sharma", role: "Lead Veterinarian, HappyPaws Clinic, Mumbai", initials: "PS",
    text: "PAHMS transformed how we manage our clinic. From appointment booking to pharmacy inventory — everything is now in one place. Our efficiency has improved by 60%." },
  { name: "Dr. Rajesh Kumar", role: "Owner, PetCare Hospital, Bangalore", initials: "RK",
    text: "The multi-tenant architecture is a game-changer. We now manage all three of our clinic branches from a single dashboard with complete data isolation." },
  { name: "Dr. Ananya Patel", role: "Veterinary Surgeon, AnimalWelfare Trust, Delhi", initials: "AP",
    text: "Telemedicine integration has been invaluable. We now provide follow-up consultations remotely, saving pet parents time while keeping our schedules efficient." },
  { name: "Dr. Vikram Reddy", role: "Clinic Director, VetLife Center, Hyderabad", initials: "VR",
    text: "The analytics dashboard gives us insights we never had before — revenue trends, patient demographics, staff performance. It's helped us grow revenue by 35%." },
  { name: "Dr. Meera Iyer", role: "Head Veterinarian, FurCare Clinic, Chennai", initials: "MI",
    text: "Vaccination tracking alone saves us hours every week. Automated reminders and certificate generation have reduced no-shows by nearly half." },
  { name: "Dr. Arjun Nair", role: "Practice Manager, PetPoint Hospital, Pune", initials: "AN",
    text: "The role-based access control is perfect for our large team. Receptionists, nurses, and doctors each see exactly what they need without compromising security." },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionBadge color="orange">Testimonials</SectionBadge>
          <h2 className="mt-5 font-serif text-4xl lg:text-5xl font-bold text-slate-900">Trusted by Veterinarians</h2>
          <p className="mt-5 text-slate-600 text-lg">
            Hear from veterinary professionals who use PAHMS daily to run their clinics more efficiently.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <Quote className="w-8 h-8 text-green-200" />
              <p className="mt-4 text-slate-700 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
