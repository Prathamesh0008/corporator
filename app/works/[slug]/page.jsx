import Link from "next/link";
import Image from "next/image";
import { workItems } from "../../../components/workData";
import Bilingual from "../../../components/Common/Bilingual";

export async function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = workItems.find((entry) => entry.slug === slug);

  if (!item) {
    return {
      title: "Work Not Found",
    };
  }

  return {
    title: `${item.titleEn} | Ward Works`,
    description: item.detailEn,
  };
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;
  const item = workItems.find((entry) => entry.slug === slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-900"><Bilingual en="Work not found" mr="काम सापडले नाही" /></h1>
        <Link href="/works" className="complaint-cta mt-6 inline-flex">
          <Bilingual en="Back to works" mr="कामांकडे परत जा" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#082f49] px-4 py-14 text-white">
        <div className="container-responsive">
          <Link href="/works" className="inline-flex text-sm font-bold text-orange-300 hover:text-orange-200">
            ← Back to Works
          </Link>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl"><Bilingual en={item.titleEn} mr={item.titleMr} /></h1>
          <p className="mt-3 max-w-3xl text-lg text-blue-100"><Bilingual en={item.detailEn || item.descriptionEn} mr={item.detailMr || item.descriptionMr} /></p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-responsive grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image src={item.afterImage} alt={item.titleEn} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black text-slate-900"><Bilingual en="Project overview" mr="कामाचा आढावा" /></h2>
              <p className="mt-3 leading-8 text-slate-600"><Bilingual en={item.detailEn || item.descriptionEn} mr={item.detailMr || item.descriptionMr} /></p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black tracking-[0.2em] text-orange-700"><Bilingual en="Location" mr="ठिकाण" /></p>
              <p className="mt-2 text-lg font-bold text-slate-900"><Bilingual en={item.locationEn} mr={item.locationMr} /></p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black tracking-[0.2em] text-orange-700"><Bilingual en="Status" mr="स्थिती" /></p>
              <p className="mt-2 text-lg font-bold text-slate-900"><Bilingual en={item.statusEn} mr={item.statusMr} /></p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black tracking-[0.2em] text-orange-700"><Bilingual en="Highlights" mr="ठळक बाबी" /></p>
              <ul className="mt-3 space-y-2 text-slate-700">
                {item.highlightsEn.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
