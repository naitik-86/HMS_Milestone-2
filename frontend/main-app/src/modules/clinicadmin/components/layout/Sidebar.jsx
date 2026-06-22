import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "staff", label: "Staff", icon: "👨‍⚕️" },
    { id: "doctors", label: "Doctors", icon: "🩺" },
    { id: "groomer", label: "Groomer", icon: "✂️" },
    { id: "kennel", label: "Kennel", icon: "🐾" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleNavigate = (item) => {
    navigate(item.id === "dashboard" ? "/clinic" : `/clinic/${item.id}`);
    onClose?.();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
      className={`fixed inset-y-0 left-0 z-50 shrink-0 transform transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        width: 240,
        background: "#111827",
        padding: 16,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      {/* TOP SECTION */}
      <div>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: "0.5px",
              margin: 0,
            }}
          >
            <span style={{ color: "#E8630A" }}>Clinic</span>{" "}
            <span style={{ color: "#FFFFFF" }}>Admin</span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/15 lg:hidden"
            style={{ border: "none", cursor: "pointer" }}
            aria-label="Close clinic admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {navItems.map((item) => {
          const isActive =
            item.id === "dashboard"
              ? location.pathname === "/clinic"
              : location.pathname.startsWith(`/clinic/${item.id}`);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
                marginBottom: 6,

                background: isActive
                  ? "rgba(232,99,10,0.18)"
                  : "transparent",
                color: isActive ? "#E8630A" : "#9CA3AF",
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive
                  ? "3px solid #E8630A"
                  : "3px solid transparent",

                transition: "all 0.2s ease",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 🔥 LOGOUT BUTTON */}
      <button
        onClick={() => {
          navigate("/");
          onClose?.();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 600,
          background: "#E8630A",
          color: "#fff",
          transition: "all 0.2s ease",
        }}
      >
        {"Logout ->"}
      </button>
    </aside>
    </>
  );
};

export default Sidebar;
