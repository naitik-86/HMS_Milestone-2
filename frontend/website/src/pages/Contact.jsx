import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Building2, Send } from "lucide-react";
import SectionBadge from "../components/SectionBadge.jsx";

const cards = [
  { icon: Mail, title: "Email Us", line1: "info@pahms.com", line2: "We reply within 24 hours" },
  { icon: Phone, title: "Call Us", line1: "+91 123 456 7890", line2: "Mon-Sat, 9AM-6PM IST" },
  { icon: MapPin, title: "Visit Us", line1: "Connaught Place, New Delhi", line2: "India 110001" },
  { icon: Clock, title: "Business Hours", line1: "Mon - Sat: 9AM - 6PM", line2: "Sunday: Closed" },
];

const inquiries = [
  { icon: MessageSquare, c: "bg-green-100 text-green-700", title: "Sales Inquiries", text: "Interested in PAHMS for your clinic? Let's discuss your needs." },
  { icon: Headphones, c: "bg-orange-100 text-orange-600", title: "Technical Support", text: "Need help with the platform? Our support team is here 24/7." },
  { icon: Building2, c: "bg-green-100 text-green-700", title: "Enterprise Solutions", text: "Custom integrations and dedicated support for large organizations." },
];

export default function Contact() {
  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <SectionBadge>Contact Us</SectionBadge>
          <h1 className="mt-6 font-serif text-5xl lg:text-6xl font-bold text-slate-900">Get in Touch</h1>
          <p className="mt-6 text-lg text-slate-600">
            Have questions about PAHMS? Whether you're looking for a demo, need support, or want to partner with us — we'd love to hear from you.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-16 px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <c.icon className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="mt-5 font-bold text-slate-900">{c.title}</h3>
              <p className="mt-3 text-slate-900 font-medium">{c.line1}</p>
              <p className="text-sm text-orange-500 mt-1">{c.line2}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-4xl font-bold text-slate-900">Let's Start a Conversation</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Fill out the form and our team will reach out to you within 24 hours. Or reach us directly through the contact information provided.
            </p>
            <div className="mt-10 space-y-6">
              {inquiries.map((i) => (
                <div key={i.title} className="flex gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${i.c}`}>
                    <i.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{i.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{i.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" placeholder="Your name" />
              <Field label="Email" placeholder="you@example.com" type="email" />
              <Field label="Phone" placeholder="+91 XXXXX XXXXX" />
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-green-600">
                  <option>Select a topic</option>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-600"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white font-semibold px-7 py-3.5 rounded-xl"
            >
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <input
        {...props}
        className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-600"
      />
    </div>
  );
}
