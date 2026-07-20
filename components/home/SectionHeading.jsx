export default function SectionHeading({ eyebrow, title, description, align = "center" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mx-auto max-w-3xl ${alignClass}`}>
      {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-600">{eyebrow}</p> : null}
      {title ? <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{title}</h2> : null}
      {description ? <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}
