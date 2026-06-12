import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'staff', label: 'Staff Enrollment', icon: '👥' },
  { id: 'doctors', label: 'Doctor Details', icon: '🩺' },
  { id: 'lab', label: 'Lab Technician', icon: '🔬' },
  { id: 'groomer', label: 'Groomer', icon: '✂️' },
  { id: 'kennel', label: 'Kennel Staff', icon: '🐾' },
  { id: 'settings', label: 'Clinic Settings', icon: '⚙️' },
  { id: 'reports', label: 'Reports', icon: '📊' },
];

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <div className="w-[260px] min-w-[260px] bg-[#13151F] border-r border-[#2A2E45] flex flex-col h-screen">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#2A2E45]">
        <div className="font-syne text-[22px] font-extrabold">
          <span className="text-[#E8630A]">Clinic</span>
          <span className="text-[#E2E8F0]">Admin</span>
        </div>
        <div className="text-[#6B7280] text-[11px] mt-0.5 tracking-[0.05em]">
          Veterinary Management System
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 w-full px-3.5 py-[11px] rounded-[10px] text-left text-sm mb-0.5 font-['Plus_Jakarta_Sans',sans-serif] transition-colors
              ${activePage === item.id
                ? 'bg-[#E8630A2E] text-[#E8630A] font-semibold border-l-[3px] border-[#E8630A]'
                : 'bg-transparent text-[#9CA3AF] font-normal border-l-[3px] border-transparent hover:bg-white/5'
              }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Divider */}
        <div className="border-t border-[#2A2E45] my-2.5 mx-1" />

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3.5 py-[11px] rounded-[10px] text-left text-sm font-medium font-['Plus_Jakarta_Sans',sans-serif] text-[#F43F5E] border-l-[3px] border-transparent bg-transparent hover:bg-[#F43F5E1A] transition-colors"
        >
          <span className="flex items-center text-base">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Logout
        </button>
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-[#2A2E45] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8630A] to-[#c4500a] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
          CA
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#E2E8F0]">Clinic Admin</div>
          <div className="text-[11px] text-[#6B7280]">admin@clinic.com</div>
        </div>
      </div>

    </div>
  );
}