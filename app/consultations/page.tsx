import Link from "next/link";
import { Shell, SectionTitle } from "../components";

const consultationTypes = [
  ["استشارة الشهادة", "نراجع نوع الشهادة، سنة الحصول عليها، المواد المؤهلة، وهل تحتاج مواد أو تصديقات قبل التقديم."],
  ["استشارة الرغبات", "نرتب 10 رغبات تجمع بين طموح الطالب وفرص القبول الواقعية حسب الجامعة والتخصص والمقاعد."],
  ["استشارة المستندات", "نفحص الجواز، الشهادة، الميلاد أو الرقم الوطني، الصورة الشخصية، وجودة الملفات قبل الإرسال."],
  ["استشارة المتابعة", "نوضح ماذا تفعل عند ظهور إشعار نقص، تعديل رغبة، إعادة ترشيح، أو طلب سداد رسوم."],
];

const admissionDetails = [
  ["التقديم ليس قبولًا نهائيًا", "تجاوز الحد الأدنى يسمح بفتح الطلب، لكن القبول يتأثر بالمقاعد، المنافسة، الجنسية، نوع الشهادة، وصحة الملف."],
  ["توقيت التقديم مهم", "عادة يبدأ التقديم للوافدين في مايو أو يونيو ويستمر حتى سبتمبر أو أكتوبر، لذلك كلما اكتمل الملف مبكرًا قلت المخاطر."],
  ["الشهادات تختلف", "IGCSE تحتاج تدقيق مواد O-Level و A-Level أو AS-Level، والشهادات العربية قد تحتاج حذف مواد أو حساب ساعات أو قدرات."],
  ["الأخطاء الصغيرة مؤثرة", "اختلاف حرف في الاسم، صورة غير مناسبة، مستند غير واضح، أو رغبات غير مرتبة قد يؤخر مراجعة الطلب."],
];

const requiredDocuments = [
  "بيانات الطالب ووسائل التواصل",
  "بيانات ولي الأمر",
  "الشهادة الثانوية وكشف الدرجات",
  "جواز سفر سارٍ",
  "شهادة ميلاد أو رقم وطني",
  "صورة شخصية رسمية بخلفية واضحة",
  "10 رغبات دراسية مرتبة",
  "إيصالات أو مستندات سداد عند الحاجة",
];

export default function ConsultationsPage() {
  return (
    <Shell>
      <main className="consultations-page">
        <section className="consultation-hero">
          <div>
            <span>Consultations</span>
            <h1>استشارات التقديم والقبول</h1>
            <h2>هل مشكلتك في الشهادة، الرغبات، المستندات، أم المتابعة؟</h2>
            <p>
              قبل أن تدفع رسومًا أو ترسل طلبًا ناقصًا، احصل على تقييم واضح لشهادتك ورغباتك ومستنداتك
              وما يجب إصلاحه قبل إرسال الملف.
            </p>
            <div className="hero-actions compact-actions">
              <Link href="/apply?service=consultation" className="primary-button">اطلب استشارة</Link>
              <Link href="/calculators" className="secondary-button">احسب أهليتك أولًا</Link>
            </div>
          </div>
          <div className="risk-panel consultation-panel">
            <span>مخرجات الاستشارة</span>
            <strong>خطة واضحة</strong>
            <p>نحدد فرص القبول، المواد أو المستندات الناقصة، أفضل ترتيب للرغبات، والخطوة التالية بدون تخمين.</p>
          </div>
        </section>

        <section className="consultation-proof">
          {["فحص الشهادة", "ترتيب الرغبات", "مراجعة المستندات", "متابعة النواقص"].map((item) => (
            <div key={item}>
              <strong>{item}</strong>
              <span>ضمن تقرير الاستشارة</span>
            </div>
          ))}
        </section>

        <section className="section embedded-section consultation-section">
          <SectionTitle kicker="Services" title="أنواع الاستشارات" text="اختر الخدمة حسب السؤال الذي تريد إجابته قبل بدء الطلب." />
          <div className="benefit-grid">
            {consultationTypes.map(([title, description]) => (
              <article className="benefit-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section embedded-section consultation-section">
          <SectionTitle kicker="Admission Details" title="تفاصيل مهمة قبل التقديم" text="هذه النقاط تمنع أخطاء شائعة وتوضح للطالب ما الذي يحدث بعد إرسال الملف." />
          <div className="logic-grid">
            {admissionDetails.map(([title, description]) => (
              <article className="logic-card" key={title}>
                <span>{title}</span>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="university-section-card two-column-card consultation-docs">
          <div>
            <div className="section-mini-title">
              <span>Documents</span>
              <h2>ما الذي نراجعه في الاستشارة؟</h2>
            </div>
            <ul className="document-list">
              {requiredDocuments.map((doc) => <li key={doc}>{doc}</li>)}
            </ul>
          </div>
          <div className="timeline-card">
            <span>مسار الاستشارة</span>
            {["إرسال السؤال", "فحص الشهادة والمستندات", "اقتراح الرغبات", "بدء الطلب أو تعديل الملف"].map(step => <div key={step}>{step}</div>)}
          </div>
        </section>
      </main>
    </Shell>
  );
}
