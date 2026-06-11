import { PawPrint } from "lucide-react";

export default function Logo({ subtitle = true, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center">
        <PawPrint className="w-6 h-6 text-white" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
      </div>
      <div className="leading-tight">
        <div className={`font-serif text-2xl font-bold tracking-wide ${light ? "text-white" : "text-slate-900"}`}>
          PAHMS
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 -mt-0.5">Pet & Animal Healthcare</div>
        )}
      </div>
    </div>
  );
}
