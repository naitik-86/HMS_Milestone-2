export default function SectionBadge({ icon: Icon, children, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${colors[color]}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </span>
  );
}
