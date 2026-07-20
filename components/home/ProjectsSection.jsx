"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { projectsData } from "../../data/siteContent";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";

const filters = ["all", "completed", "ongoing", "planned"];

export default function ProjectsSection() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [filter, setFilter] = useState("all");

  const visibleProjects = useMemo(() => {
    if (filter === "all") return projectsData;
    const normalized = filter === "completed" ? "Completed" : filter === "ongoing" ? "Ongoing" : "Planned";
    return projectsData.filter((project) => project.tag === normalized);
  }, [filter]);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow={mr ? "विकास प्रकल्प" : "Development projects"} title={mr ? "वॉर्डातील प्रगतीशील कामे" : "Major public works in the ward"} description={mr ? "प्रत्येक प्रकल्पाची स्थिती, स्थान आणि प्रगती सहज पाहता येईल." : "Track status, location and progress for each public initiative."} align="left" />
        <div className="flex flex-wrap gap-2">
          {filters.map((value) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === value ? "bg-orange-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-600"}`}>
              {mr ? (value === "all" ? "सर्व" : value === "completed" ? "पूर्ण" : value === "ongoing" ? "चालू" : "नियोजित") : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleProjects.slice(0, 6).map((project) => (
          <ProjectCard key={project.id} project={project} mr={mr} />
        ))}
      </div>
    </section>
  );
}
