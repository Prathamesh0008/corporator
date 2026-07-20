export default function DashboardCards({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <div key={card.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">{card.label}</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{card.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
