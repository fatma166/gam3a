import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell,SectionTitle } from "../components";
import { getUniversities,getPage,text } from "../api";
export default async function UniversitiesPage({searchParams}:{searchParams:Promise<{q?:string;city?:string;type?:string}>}) {
  const [all,page,query]=await Promise.all([getUniversities(),getPage("universities"),searchParams]);
  if(!page)notFound();
  const rows=all.filter(u=>(!query.q||(u.name+" "+u.city).includes(query.q))&&(!query.city||u.city===query.city)&&(!query.type||u.type===query.type));
  return <Shell><main className="page-wrap"><SectionTitle kicker="Universities" title={text(page.content,"title")} text={text(page.content,"description")}/>
    <form className="filter-bar"><input name="q" defaultValue={query.q} placeholder="ابحث باسم الجامعة أو المدينة"/><select name="type" defaultValue={query.type??""}><option value="">كل الأنواع</option>{[...new Set(all.map(u=>u.type))].map(t=><option key={t}>{t}</option>)}</select><select name="city" defaultValue={query.city??""}><option value="">كل المدن</option>{[...new Set(all.map(u=>u.city))].map(t=><option key={t}>{t}</option>)}</select><button className="primary-button compact">بحث</button></form>
    <div className="university-grid wide">{rows.map(u=><Link href={"/universities/"+u.slug} className="university-card" key={u.slug}><i className="university-card-image" style={{backgroundImage:`url(${u.image})`}}/><span>{u.type}</span><h3>{u.name}</h3><p>{u.description}</p><small>{u.city} · {u.programs} برنامج · {u.acceptance}</small></Link>)}</div>{!rows.length&&<p>لا توجد جامعات مطابقة.</p>}
  </main></Shell>;
}
