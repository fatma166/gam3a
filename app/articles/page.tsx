import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell,SectionTitle } from "../components";
import { getArticles,getPage,text } from "../api";
export default async function ArticlesPage({searchParams}:{searchParams:Promise<{q?:string;category?:string}>}){
  const [all,page,query]=await Promise.all([getArticles(),getPage("articles"),searchParams]);if(!page)notFound();
  const articles=all.filter(a=>(!query.q||(a.title+" "+a.excerpt).includes(query.q))&&(!query.category||a.category===query.category));
  return <Shell><main className="page-wrap"><SectionTitle kicker="Articles" title={text(page.content,"title")} text={text(page.content,"description")}/><form className="filter-bar"><input name="q" placeholder="ابحث في المقالات" defaultValue={query.q}/><select name="category" defaultValue={query.category??""}><option value="">كل التصنيفات</option>{[...new Set(all.map(a=>a.category))].map(c=><option key={c}>{c}</option>)}</select><button className="primary-button compact">بحث</button></form><div className="article-grid">{articles.map(a=><Link href={"/articles/"+a.slug} className="article-card" key={a.slug}><span className="article-thumb" style={{backgroundImage:`url(${a.image})`}}/><div><small>{a.category}</small><h3>{a.title}</h3><p>{a.excerpt}</p></div></Link>)}</div>{!articles.length&&<p>لا توجد مقالات مطابقة.</p>}</main></Shell>;
}
