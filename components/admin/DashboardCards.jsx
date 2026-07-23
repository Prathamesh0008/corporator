export default function DashboardCards({ stats }) {
  return (
    <div className="grid border-y border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <div key={card.label} className="border-b border-slate-200 p-5 sm:border-r xl:border-b-0">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">{card.label}</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{card.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
