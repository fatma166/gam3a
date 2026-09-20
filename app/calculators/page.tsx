import { notFound } from "next/navigation";
import { Shell, SectionTitle } from "../components";
import { apiGet, getPage, text, type CalculatorRule } from "../api";
import Calculator from "./Calculator";
export default async function CalculatorsPage() {
  const [rules,page]=await Promise.all([apiGet<CalculatorRule[]>("/calculator-rules"),getPage("calculators")]);
  if(!page) notFound();
  return <Shell><main className="page-wrap calculators-page">
    <SectionTitle kicker="Eligibility" title={text(page.content,"title")} text={text(page.content,"description")}/>
    <section className="page-support-section calculator-intro">
      <div>
        <span>قبل ترتيب الرغبات</span>
        <h2>احسب مجموعك ثم راجع المواد المؤهلة</h2>
        <p>النتيجة تساعدك على معرفة البرامج المناسبة مبدئيًا، لكنها لا تغني عن مراجعة نوع الشهادة والمستندات والحد الأدنى لكل جامعة.</p>
      </div>
      <a href="/consultations" className="primary-button compact">اسأل مستشار</a>
    </section>
    <Calculator rules={rules}/>
  </main></Shell>;
}
