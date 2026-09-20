import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, SectionTitle } from "../components";
import { getSite,getTracks,getPrograms,getPage,text } from "../api";
import StudentAccess from "../StudentAccess";
import ApplicationForm from "./ApplicationForm";
export default async function ApplyPage({searchParams}:{searchParams:Promise<{service?:string;program?:string}>}) {
  const [site,tracks,programs,page,query]=await Promise.all([getSite(),getTracks(),getPrograms(),getPage("apply"),searchParams]);
  if(!page)notFound();
  return <Shell><main className="page-wrap"><SectionTitle kicker="Application" title={text(page.content,"title")} text={text(page.content,"description")}/>
  <section className="page-support-section">
    <div>
      <span>قبل إرسال الطلب</span>
      <h2>التقديم الصحيح يبدأ باستشارة واضحة</h2>
      <p>راجع شهادتك، المواد المؤهلة، المستندات، وترتيب الرغبات قبل إرسال الملف حتى تقل احتمالات النقص أو التأخير.</p>
    </div>
    <Link href="/consultations" className="primary-button compact">اطلب استشارة</Link>
  </section>
  <StudentAccess><ApplicationForm services={site.entries.filter(e=>e.kind==="service")} tracks={tracks} programs={programs} year={text(site.entries.find(e=>e.slug==="site-settings")?.content,"academic_year")} service={query.service} program={query.program}/></StudentAccess></main></Shell>;
}
