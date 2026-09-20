import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../components";
import { getUniversity, getSite, getTracks, strings } from "../../api";
export default async function UniversityDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [university,site,tracks] = await Promise.all([getUniversity(slug),getSite(),getTracks()]);
  if (!university) notFound();
  const settings=site.entries.find(e=>e.slug==="site-settings")?.content;
  return <Shell><main className="page-wrap"><h1>{university.name}</h1><p>{university.description}</p><p>{university.city} · {university.type} · {university.acceptance}</p>
    <div className="program-list">{university.faculties?.map(f => <section key={f.name} className="university-section-card"><h2>{f.name}</h2>{f.programs.map(p => <article key={p.id}><h3>{p.name}</h3>{p.admission_rules?.map((r,i) => <p key={i}>{tracks.find(t=>t.id===r.certificate_track_id)?.name} · الحد الأدنى: {r.minimum_score ?? "غير محدد"} · {r.notes}</p>)}<Link className="primary-button compact" href={"/apply?program="+p.id}>أضف إلى الرغبات</Link></article>)}</section>)}</div>
    <section className="university-section-card"><h2>المستندات المطلوبة</h2><ul>{strings(settings?.required_documents).map(d=><li key={d}>{d}</li>)}</ul></section>
  </main></Shell>;
}
