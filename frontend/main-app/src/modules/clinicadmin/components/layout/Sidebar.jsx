import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "staff", label: "Staff", icon: "👨‍⚕️" },
    { id: "doctors", label: "Doctors", icon: "🩺" },
    { id: "lab", label: "Lab", icon: "🧪" },
    { id: "groomer", label: "Groomer", icon: "✂️" },
    { id: "kennel", label: "Kennel", icon: "🐾" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
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
        <h2
          style={{
            marginBottom: 24,
            fontSize: 22,
            fontWeight: "800",
            letterSpacing: "0.5px",
          }}
        >
          <span style={{ color: "#E8630A" }}>Clinic</span>{" "}
          <span style={{ color: "#FFFFFF" }}>Admin</span>
        </h2>

        {navItems.map((item) => {
          const isActive =
            item.id === "dashboard"
              ? location.pathname === "/clinic"
              : location.pathname.startsWith(`/clinic/${item.id}`);

          return (
            <button
              key={item.id}
              onClick={() =>
                navigate(
                  item.id === "dashboard"
                    ? "/clinic"
                    : `/clinic/${item.id}`
                )
              }
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
        onClick={() => navigate("/")}
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
    </div>
  );
};

export default Sidebar;