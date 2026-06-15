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
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-2 bg-transparent rounded-full p-1">
          {links.map((l) => {
            const active =
              l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${active
                  ? "bg-brand-light text-brand-dark"
                  : "text-ink-soft hover:text-ink"
                  }`}
              >
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">

          {/* Login */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${isActive
                ? "bg-green-200 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Log In
          </NavLink>

          {/* Super Admin */}
          <NavLink
            to="/doctor"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${isActive
                ? "bg-green-200 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Doctor
          </NavLink>

          {/* Clinic Admin */}
          <NavLink
            to="/clinic"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${isActive
                ? "bg-green-200 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Clinic Admin
          </NavLink>

          {/* Signup */}
          <NavLink
            to="/login"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            Sign Up Free
          </NavLink>

        </div>
      </div>
    </header>
  );
}
