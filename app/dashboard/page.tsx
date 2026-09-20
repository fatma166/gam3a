import { notFound } from "next/navigation";
import { Shell,SectionTitle } from "../components";
import { getPage,getSite,strings,text } from "../api";
import StudentAccess from "../StudentAccess";
import Applications from "./Applications";
export default async function DashboardPage(){
  const [page,site]=await Promise.all([getPage("dashboard"),getSite()]);
  if(!page)notFound();
  return <Shell><main className="page-wrap dashboard-page">
    <SectionTitle kicker="Student Portal" title={text(page.content,"title")} text={text(page.content,"description")}/>
    <section className="dashboard-overview">
      <div>
        <span>متابعة الطلب</span>
        <h2>كل ما يخص ملفك في مكان واحد</h2>
        <p>تابع حالة الطلب، ارفع المستندات الناقصة، راجع الرغبات، واقرأ ملاحظات فريق القبول قبل أي خطوة جديدة.</p>
      </div>
      <div className="portal-status-card">
        <small>آخر حالة متوقعة</small>
        <strong>قيد المراجعة</strong>
        <p>سنخبرك عند اعتماد المستندات أو ظهور أي نقص في الملف.</p>
      </div>
    </section>
    <StudentAccess><Applications documents={strings(site.entries.find(e=>e.slug==="site-settings")?.content.required_documents)}/></StudentAccess>
  </main></Shell>;
}
