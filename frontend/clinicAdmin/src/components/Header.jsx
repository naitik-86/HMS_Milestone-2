import React, { useState } from 'react';

export default function Header({ title, subtitle }) {
  const [notifications] = useState(3);
  const [search, setSearch] = useState('');

  return (
    <div className="bg-white border-b border-[#EAE5DC] px-7 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="font-['Syne',sans-serif] text-[22px] font-bold text-[#1A1D2E]">{title}</h1>
        {subtitle && <p className="text-[#6B7280] text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff, records..."
            className="bg-white border border-[#EAE5DC] text-[#1A1D2E] rounded-[10px] py-2.5 pr-3.5 pl-9 text-[13px] w-60 outline-none font-['Plus_Jakarta_Sans',sans-serif]"
          />
        </div>
        <button className="relative bg-white border border-[#EAE5DC] rounded-[10px] w-[38px] h-[38px] cursor-pointer text-base">
          🔔
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E8630A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{notifications}</span>
          )}
        </button>
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#E8630A] to-[#c4500a] flex items-center justify-center text-xs font-bold text-white cursor-pointer">CA</div>
      </div>
    </div>
  );
}