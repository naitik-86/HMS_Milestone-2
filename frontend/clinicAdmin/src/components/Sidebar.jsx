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

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-[260px] min-w-[260px] bg-[#13151F] border-r border-[#2A2E45] flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#2A2E45]">
        <div className="font-extrabold text-[22px]" style={{ fontFamily: 'Syne, sans-serif' }}>
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
            className={`flex items-center gap-3 w-full px-3.5 py-[11px] rounded-[10px] border-none cursor-pointer text-left text-sm mb-0.5 transition-colors
              ${activePage === item.id
                ? 'bg-[#E8630A]/[0.18] text-[#E8630A] font-semibold border-l-[3px] border-l-[#E8630A]'
                : 'bg-transparent text-[#9CA3AF] font-normal border-l-[3px] border-l-transparent'
              }`}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
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