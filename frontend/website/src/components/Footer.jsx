import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo.jsx";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Logo subtitle={false} light />
            <p className="mt-5 text-sm text-slate-400 leading-relaxed">
              The complete Pet & Animal Healthcare Management System. Empowering veterinary clinics with enterprise-grade digital solutions.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> info@pahms.com</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> +91 123 456 7890</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> New Delhi, India</li>
            </ul>
          </div>
          <FooterCol title="PRODUCT" links={[["Features","/"],["Pricing","/"],["About Us","/about"],["Contact","/contact"]]} />
          <FooterCol title="LEGAL" links={[["Terms & Conditions","/"],["Privacy Policy","/"],["Cookies Policy","/"]]} />
          <FooterCol title="SUPPORT" links={[["Help Center","/"],["Documentation","/"],["Status","/"]]} />
        </div>
        <div className="mt-14 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 PAHMS. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white tracking-wider mb-5">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(([label, to]) => (
          <li key={label}><Link to={to} className="hover:text-white transition">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
