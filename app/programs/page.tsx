import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getPrograms, text } from "../api";
import { Shell, SectionTitle } from "../components";
export default async function ProgramsPage() {
  const [programs,page] = await Promise.all([getPrograms(),getPage("programs")]);
  if (!page) notFound();
  return <Shell><main className="page-wrap"><SectionTitle kicker="Programs" title={text(page.content,"title")} text={text(page.content,"description")} />
    <div className="program-list">{programs.map((p,i) => <article className="program-row" key={p.id}><strong>{i+1}</strong><div><h3>{p.name}</h3><p>{p.faculty?.university?.name} · {p.degree} · {p.language}</p><p>{p.tuition_amount ? p.tuition_amount+" "+p.tuition_currency : ""}</p>{p.admission_rules?.map((r,j) => <p key={j}>الحد الأدنى: {r.minimum_score ?? "غير محدد"} {r.notes}</p>)}</div><Link href={"/apply?program="+p.id}>أضف إلى طلبك</Link></article>)}</div>
    {!programs.length && <p>لا توجد برامج منشورة حاليًا.</p>}
  </main></Shell>;
}
