"use client";
import { useState } from "react";
import Link from "next/link";
import type { CalculatorRule, Program } from "../api";
import { request } from "../client-api";
type Result = { equivalent_score: number; eligible_programs: Program[]; rule_updated_at: string };
export default function Calculator({ rules }: { rules: CalculatorRule[] }) {
  const [id,setId]=useState(rules[0]?.id ?? 0);
  const [grades,setGrades]=useState<Record<string,string>>({});
  const [result,setResult]=useState<Result|null>(null);
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const rule=rules.find(r=>r.id===id);
  async function calculate(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setResult(null);
    try { setResult(await request<Result>("calculate-equivalency",{method:"POST",body:JSON.stringify({calculator_rule_id:id,grades:Object.fromEntries(Object.entries(grades).filter(([,v])=>v!==""))})})); }
    catch(e) {setError((e as Error).message);} finally{setBusy(false);}
  }
  if(!rule) return <p>لا توجد قواعد أهلية منشورة حاليًا.</p>;
  const required=rule.inputs_schema?.required_subjects ?? Object.keys(rule.formula.weights);
  return <section className="calculator-shell enhanced-calculator">
    <aside className="calculator-track-list" aria-label="قواعد الشهادات">
      <strong>اختر نوع الشهادة</strong>
      {rules.map(r=><button type="button" className={r.id===id?"active":""} disabled={busy} onClick={()=>{setId(r.id);setGrades({});setResult(null);setError("");}} key={r.id}>{r.name}</button>)}
      <div className="calculator-note-card">
        <span>مهم</span>
        <p>الحساب استرشادي، والقبول النهائي يعتمد على المقاعد وصحة الملف وترتيب الرغبات.</p>
      </div>
    </aside>
    <form className="calculator-form" onSubmit={calculate}>
      <div className="calculator-form-head">
        <div>
          <span className="eyebrow">Equivalency Calculator</span>
          <h2>{rule.name}</h2>
          <p>{rule.notes}</p>
        </div>
        <label className="calculator-select">قاعدة الشهادة<select disabled={busy} value={id} onChange={e=>{setId(Number(e.target.value));setGrades({});setResult(null);setError("");}}>{rules.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label>
      </div>
      <div className="form-grid calculator-input-grid">
        {Object.keys(rule.formula.weights).map(subject=><label key={subject}>{subject}{required.includes(subject)?" *":""}{rule.formula.grade_map && Object.keys(rule.formula.grade_map).length ? <select required={required.includes(subject)} value={grades[subject]??""} onChange={e=>setGrades({...grades,[subject]:e.target.value})}><option value="">اختر التقدير</option>{Object.keys(rule.formula.grade_map).map(g=><option key={g}>{g}</option>)}</select> : <input placeholder="0 - 100" type="number" min="0" max="100" step="0.01" required={required.includes(subject)} value={grades[subject]??""} onChange={e=>setGrades({...grades,[subject]:e.target.value})}/>}</label>)}
      </div>
      <div className="calculator-actions">
        <button className="primary-button" disabled={busy}>{busy?"جارٍ الحساب…":"احسب الأهلية"}</button>
        <Link href="/consultations" className="secondary-button">محتاج مراجعة؟</Link>
      </div>
      {error&&<p className="form-alert" role="alert">{error}</p>}
      {result&&<section className="calculator-result" aria-live="polite">
        <div className="result-panel">
          <span>المجموع المكافئ</span>
          <strong>{result.equivalent_score}%</strong>
          <small>مؤهل مبدئيًا لـ {result.eligible_programs.length} برنامج</small>
        </div>
        <div className="notice-panel">
          <strong>ماذا بعد الحساب؟</strong>
          <p>راجع المستندات والمواد المؤهلة ثم رتّب رغباتك. ظهور برنامج هنا لا يعني قبولًا نهائيًا.</p>
        </div>
        <div className="eligible-programs">
          {result.eligible_programs.slice(0, 6).map(p=><Link key={p.id} href={"/apply?program="+p.id}><strong>{p.name}</strong><small>{p.faculty?.university?.name ?? "جامعة مناسبة"}</small></Link>)}
        </div>
        {result.eligible_programs.length>6&&<p className="muted-line">يوجد {result.eligible_programs.length-6} برنامج إضافي مناسب يمكن مراجعته داخل طلبك.</p>}
        {!result.eligible_programs.length&&<p className="form-alert">لم توجد برامج مطابقة للشروط المنشورة. جرّب مراجعة الدرجات أو اطلب استشارة.</p>}
      </section>}
    </form>
  </section>;
}
