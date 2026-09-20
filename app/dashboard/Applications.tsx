"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { request } from "../client-api";
type Application = {id:number;full_name:string;academic_year:string;status:string;documents:Array<{id:number;original_name:string;type:string;status:string;review_notes?:string}>;choices:Array<{rank:number;program:{name:string}}>;meta?:{admin_notes?:Array<{at:string;note:string;status:string}>}};
const labels:Record<string,string>={draft:"مسودة",submitted:"تم الإرسال",under_review:"قيد المراجعة",missing_documents:"مستندات ناقصة",approved:"معتمد",rejected:"مرفوض",pending_review:"بانتظار المراجعة"};
export default function Applications({documents}:{documents:string[]}) {
  const [items,setItems]=useState<Application[]>([]);const [error,setError]=useState("");const [busy,setBusy]=useState(false);const [loading,setLoading]=useState(true);const [page,setPage]=useState(1);const [last,setLast]=useState(1);
  async function load(current=page){try{const result=await request<{data:Application[];last_page:number}>("applications?page="+current);setItems(result.data);setLast(result.last_page);}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
  useEffect(()=>{load(page);},[page]);
  async function send(id:number){setBusy(true);setError("");try{await request("applications/"+id,{method:"PATCH",body:JSON.stringify({status:"submitted"})});await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  async function upload(e:React.FormEvent<HTMLFormElement>,id:number){e.preventDefault();const form=e.currentTarget;setBusy(true);setError("");try{await request("applications/"+id+"/documents",{method:"POST",body:new FormData(form)});form.reset();await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <section className="student-applications">
    <div className="student-toolbar">
      <div>
        <span>طلباتك</span>
        <strong>{items.length ? `${items.length} طلب` : "لا توجد طلبات"}</strong>
      </div>
      <button className="secondary-button" disabled={busy} onClick={()=>load()}>تحديث الحالة</button>
    </div>
    {error&&<p className="form-alert" role="alert">{error}</p>}
    {loading?<div className="portal-empty">جارٍ تحميل الطلبات…</div>:!items.length?<div className="portal-empty"><strong>لا توجد طلبات بعد</strong><p>ابدأ طلبًا جديدًا ثم ارجع هنا لمتابعة المستندات والحالة.</p><Link href="/apply" className="primary-button compact">ابدأ طلبًا جديدًا</Link></div>:items.map(a=><article className="student-application-card" key={a.id}>
      <div className="application-card-head">
        <div>
          <span>طلب #{a.id}</span>
          <h2>{a.full_name}</h2>
          <p>{a.academic_year}</p>
        </div>
        <strong className={"status-pill status-"+a.status}>{labels[a.status]??a.status}</strong>
      </div>
      <div className="application-summary-grid">
        <div><span>الرغبات</span><strong>{a.choices.length}</strong></div>
        <div><span>المستندات</span><strong>{a.documents.length}</strong></div>
        <div><span>الملاحظات</span><strong>{a.meta?.admin_notes?.length ?? 0}</strong></div>
      </div>
      <div className="application-columns">
        <section>
          <h3>الرغبات المحفوظة</h3>
          <ol className="choice-list">{a.choices.map(c=><li key={c.rank}><span>{c.rank}</span>{c.program.name}</li>)}</ol>
        </section>
        <section>
          <h3>المستندات</h3>
          <ul className="document-status-list">{a.documents.map(d=><li key={d.id}><div><strong>{d.type}</strong><small>{d.original_name}</small>{d.review_notes&&<p>{d.review_notes}</p>}</div><span>{labels[d.status]??d.status}</span></li>)}</ul>
        </section>
      </div>
      {!["approved","rejected"].includes(a.status)&&<form className="upload-panel" onSubmit={e=>upload(e,a.id)}>
        <h3>رفع مستند جديد</h3>
        <div className="form-grid">
          <label>نوع المستند<select name="type" required>{documents.map(d=><option key={d}>{d}</option>)}</select></label>
          <label>ملف PDF أو صورة<input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required/></label>
        </div>
        <button className="secondary-button" disabled={busy||!documents.length}>رفع المستند</button>
      </form>}
      <div className="application-actions">
        {a.status==="draft"&&<button className="primary-button" disabled={busy} onClick={()=>send(a.id)}>إرسال للمراجعة</button>}
        <Link href="/consultations" className="secondary-button">اسأل عن حالة الملف</Link>
      </div>
      {a.meta?.admin_notes?.length ? <div className="admin-note-list">{a.meta.admin_notes.map((n,i)=><p key={i}><strong>{labels[n.status]??n.status}</strong>: {n.note} · {new Date(n.at).toLocaleDateString("ar-EG")}</p>)}</div> : null}
    </article>)}
    <div className="detail-actions pagination-actions"><button className="secondary-button" disabled={page===1||busy} onClick={()=>setPage(page-1)}>السابق</button><span>{page} / {last}</span><button className="secondary-button" disabled={page>=last||busy} onClick={()=>setPage(page+1)}>التالي</button></div>
  </section>;
}
