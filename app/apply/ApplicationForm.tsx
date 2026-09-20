"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Program, SiteEntry, Track } from "../api";
import { request } from "../client-api";
export default function ApplicationForm({services,tracks,programs,year,service,program}:{services:SiteEntry[];tracks:Track[];programs:Program[];year:string;service?:string;program?:string}) {
  const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  const [choices,setChoices]=useState<string[]>([programs.some(p=>String(p.id)===program)?program!:""]);
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setError("");
    const form=new FormData(e.currentTarget);
    const data={full_name:form.get("full_name"),nationality:form.get("nationality"),passport_number:form.get("passport_number"),certificate_track_id:Number(form.get("certificate_track_id")),academic_year:year,status:"draft",meta:{service_id:Number(form.get("service_id")),question:form.get("question")},choices:choices.filter(Boolean).map((id,i)=>({program_id:Number(id),rank:i+1}))};
    try { await request("applications",{method:"POST",body:JSON.stringify(data)});router.push("/dashboard"); }
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  if(!services.length||!tracks.length||!year)return <p>التقديم غير متاح حاليًا. يرجى التواصل مع الإدارة.</p>;
  return <form className="application-form" onSubmit={submit}><h2>بيانات الطلب</h2><div className="form-grid">
    <label>الخدمة<select name="service_id" required defaultValue={services.some(s=>String(s.id)===service)?service:services[0].id}>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <label>السنة الأكاديمية<input value={year} readOnly/></label>
    <label>الاسم الكامل<input name="full_name" required maxLength={255}/></label><label>الجنسية<input name="nationality" required maxLength={120}/></label>
    <label>رقم جواز السفر<input name="passport_number" maxLength={80}/></label><label>الشهادة<select name="certificate_track_id" required>{tracks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
    <label className="full">السؤال أو الملاحظات<textarea name="question" maxLength={4000}/></label>
    </div><h3>الرغبات بالترتيب</h3>{choices.map((id,i)=><label key={i}>الرغبة {i+1}<select value={id} onChange={e=>setChoices(choices.map((v,j)=>j===i?e.target.value:v))}><option value="">اختر البرنامج</option>{programs.filter(p=>String(p.id)===id||!choices.includes(String(p.id))).map(p=><option key={p.id} value={p.id}>{p.name} · {p.faculty?.university?.name}</option>)}</select></label>)}
    {choices.length<10&&<button type="button" className="secondary-button" onClick={()=>setChoices([...choices,""])}>إضافة رغبة</button>}
    <p>سيُحفظ الطلب كمسودة لتتمكن من رفع المستندات قبل إرساله.</p>{error&&<p role="alert">{error}</p>}<button className="primary-button" disabled={busy}>{busy?"جارٍ الحفظ…":"حفظ ومتابعة"}</button>
  </form>;
}
