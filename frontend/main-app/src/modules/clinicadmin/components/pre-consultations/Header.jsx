export default function Header({ title, subtitle }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">

      <h1 className="text-3xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="text-slate-500 mt-2">
        {subtitle}
      </p>

    </div>
  );
}