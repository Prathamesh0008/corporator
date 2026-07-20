import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiMapPin, FiTrendingUp } from "react-icons/fi";

export default function ProjectCard({ project, mr = false }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44">
        <Image src={project.image} alt={mr ? project.titleMr : project.titleEn} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            {mr ? project.categoryMr : project.categoryEn}
          </span>
          <span className="text-sm font-semibold text-slate-500">{mr ? project.statusMr : project.statusEn}</span>
        </div>
        <h3 className="mt-4 text-xl font-black text-slate-900">{mr ? project.titleMr : project.titleEn}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{mr ? project.descriptionMr : project.descriptionEn}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <FiMapPin className="text-orange-500" /> {mr ? project.locationMr : project.locationEn}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <FiCalendar className="text-orange-500" /> {project.startDate} → {project.endDate}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FiTrendingUp className="text-orange-500" /> {project.progress}%
          </div>
          <Link href={`/development/${project.slug}`} className="font-semibold text-orange-600">{mr ? "तपशील" : "View detail"}</Link>
        </div>
      </div>
    </article>
  );
}
