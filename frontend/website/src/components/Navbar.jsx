import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-2 bg-slate-50/60 rounded-full p-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </header>
  );
}
