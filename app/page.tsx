import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getArticles, getSite, getTracks, pairs, strings, text } from "./api";
import { Shell, SectionTitle } from "./components";
import HomeEligibilitySearch from "./HomeEligibilitySearch";

type HomeIconName = "university" | "program" | "certificate" | "file" | "admission" | "support" | "check" | "trend" | "target" | "grid" | "question" | "clock";

function HomeIcon({ name }: { name: HomeIconName }) {
  const paths: Record<HomeIconName, ReactNode> = {
    university: <><path d="M4 10h16" /><path d="M6 10v8" /><path d="M10 10v8" /><path d="M14 10v8" /><path d="M18 10v8" /><path d="M3 18h18" /><path d="M12 4l8 6H4l8-6Z" /></>,
    program: <><path d="M5 5h14v14H5z" /><path d="M9 9h6" /><path d="M9 13h6" /><path d="M9 17h3" /></>,
    certificate: <><path d="M6 4h9l3 3v13H6z" /><path d="M15 4v4h4" /><path d="M9 13h6" /><path d="M9 17h4" /></>,
    file: <><path d="M7 4h8l4 4v12H7z" /><path d="M15 4v5h5" /><path d="M10 13h6" /><path d="M10 16h5" /></>,
    admission: <><path d="M12 3l8 4v6c0 4-3.4 6.6-8 8-4.6-1.4-8-4-8-8V7l8-4Z" /><path d="m9 12 2 2 4-5" /></>,
    support: <><path d="M5 12a7 7 0 0 1 14 0" /><path d="M5 12v4a2 2 0 0 0 2 2h1v-6H5Z" /><path d="M19 12v4a2 2 0 0 1-2 2h-1v-6h3Z" /><path d="M9 20h3" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    trend: <><path d="M4 17 10 11l4 4 6-8" /><path d="M14 7h6v6" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /></>,
    grid: <><path d="M4 4h7v7H4z" /><path d="M13 4h7v7h-7z" /><path d="M4 13h7v7H4z" /><path d="M13 13h7v7h-7z" /></>,
    question: <><path d="M9.5 9a2.8 2.8 0 1 1 4.8 2c-.9.8-1.8 1.3-1.8 2.7" /><path d="M12 18h.01" /><circle cx="12" cy="12" r="9" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

const serviceIcons: HomeIconName[] = ["file", "admission", "support", "check"];
const benefitIcons: HomeIconName[] = ["trend", "target", "grid", "check", "question", "clock"];
const faqIcons: HomeIconName[] = ["question", "check", "file", "admission", "trend", "target"];

export default async function Home() {
  const [site, articles, tracks] = await Promise.all([getSite(), getArticles(), getTracks()]);
  const page = site.entries.find(e => e.slug === "home");
  if (!page) notFound();
  const c = page.content;
  return <Shell><main>
    <section className="hero ce-hero">
      <div className="hero-media" aria-hidden="true">
        <div className="media-column media-column-a">
          <span className="media-tile tile-1" />
          <span className="media-tile tile-2" />
          <span className="media-tile tile-3" />
          <span className="media-tile tile-4" />
        </div>
        <div className="media-column media-column-b">
          <span className="media-tile tile-5" />
          <span className="media-tile tile-6" />
          <span className="media-tile tile-7" />
          <span className="media-tile tile-8" />
        </div>
        <div className="media-column media-column-c">
          <span className="media-tile tile-9" />
          <span className="media-tile tile-10" />
          <span className="media-tile tile-11" />
          <span className="media-tile tile-12" />
        </div>
      </div>
      <div className="ai-depth-field" aria-hidden="true">
        <span className="ai-orbit orbit-one"><i /></span>
        <span className="ai-orbit orbit-two"><i /></span>
        <span className="ai-orbit orbit-three"><i /></span>
      </div>
      <div className="hero-glow" /><div className="hero-copy">
        <span className="eyebrow">{text(c, "eyebrow")}</span><h1>{text(c, "title")}</h1><p>{text(c, "description")}</p>
        <div className="hero-actions"><Link href="/apply" className="primary-button">ابدأ طلبك</Link><Link href="/calculators" className="secondary-button">احسب أهليتك</Link></div>
      </div>
    </section>
    <section className="trust-strip">
      <div><i className="card-icon"><HomeIcon name="university" /></i><strong>{site.counts.universities}</strong><span>جامعة</span></div>
      <div><i className="card-icon"><HomeIcon name="program" /></i><strong>{site.counts.programs}</strong><span>برنامج</span></div>
      <div><i className="card-icon"><HomeIcon name="certificate" /></i><strong>{site.counts.tracks}</strong><span>مسار شهادة</span></div>
    </section>
    <HomeEligibilitySearch tracks={tracks} />
    <section className="section plans-section">
      <div className="section-head-row services-head">
        <SectionTitle kicker="الخدمات" title={text(c,"services_title")} text="خدمات مختصرة وواضحة تساعد الطالب على اختيار المسار الصحيح، تجهيز الملف، ومتابعة الطلب دون تشتت." />
        <div className="services-mini-panel" aria-label="مميزات الخدمات">
          <span>تقييم سريع</span>
          <span>ملف منظم</span>
          <span>متابعة واضحة</span>
        </div>
        <div className="services-visual" aria-hidden="true">
          <span className="service-orb" />
          <span className="service-doc doc-one" />
          <span className="service-doc doc-two" />
          <span className="service-doc doc-three" />
          <span className="service-path" />
        </div>
      </div>
      <div className="plan-grid">{site.entries.filter(e => e.kind === "service").map((e, index) => <article className="plan-card" key={e.id}><i className="card-icon"><HomeIcon name={serviceIcons[index % serviceIcons.length]} /></i><span>{e.name}</span><strong>{text(e.content,"price")}</strong><p>{text(e.content,"description")}</p><ul>{strings(e.content.features).map(f => <li key={f}>{f}</li>)}</ul><Link href={"/apply?service="+e.id} className="primary-button compact">اطلب الخدمة</Link></article>)}</div>
      <div className="consultation-strip">
        <div>
          <span>استشارة قبل التقديم</span>
          <strong>غير متأكد من شهادتك أو رغباتك؟</strong>
          <p>احصل على مراجعة سريعة قبل دفع الرسوم أو إرسال ملف ناقص.</p>
        </div>
        <Link href="/consultations" className="primary-button compact">اعرف الاستشارات</Link>
      </div>
    </section>
    <section className="section premium-benefits">
      <div className="benefits-photo-panel" aria-hidden="true" />
      <div className="benefits-content-panel">
        <SectionTitle kicker="" title={text(c,"benefits_title")} text="" />
        <div className="benefit-grid">{pairs(c.benefits).map(([title,description], index) => <article className="benefit-card" key={title}><i className="card-icon"><HomeIcon name={benefitIcons[index % benefitIcons.length]} /></i><h3>{title}</h3><p>{description}</p></article>)}</div>
      </div>
    </section>
    <section className="split-section">
      <div className="journey-depth" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div>
        <SectionTitle kicker="" title={text(c,"steps_title")} text="رحلة واضحة من أول بيانات الطالب حتى متابعة حالة الطلب." />
        <ol className="steps">{strings(c.steps).map(s => <li key={s}>{s}</li>)}</ol>
      </div>
      <div className="visual-stack">
        <div className="metric-card">
          <i className="card-icon"><HomeIcon name="university" /></i>
          <span>الجامعات</span>
          <strong>{site.counts.universities}</strong>
          <small>جامعات وبرامج قابلة للمقارنة</small>
        </div>
        <div className="metric-card accent">
          <i className="card-icon"><HomeIcon name="program" /></i>
          <span>البرامج</span>
          <strong>{site.counts.programs}</strong>
          <small>مصنفة حسب الأهلية والشهادة</small>
        </div>
        <div className="metric-card">
          <i className="card-icon"><HomeIcon name="clock" /></i>
          <span>الطلبات</span>
          <strong>24/7</strong>
          <small>متابعة حالة الطلب والتنبيهات</small>
        </div>
      </div>
    </section>
    <section className="section editorial-home">
      <div className="pattern-title-band"><SectionTitle kicker="" title={text(c,"articles_title")} text="" /></div>
      <div className="guide-video-layout">
        <div className="guide-video-card" aria-label="فيديو إرشادي لدليل الطالب">
          <div className="guide-video-scene">
            <div className="ai-video-layer" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="video-badge">دليل الطالب</span>
            <strong>قبل ما تبدأ طلبك</strong>
            <p>٤ خطوات تمنع تأخير الملف وتخلي اختيار الجامعة أوضح.</p>
            <div className="video-step-feed">
              {["راجع شهادتك", "احسب أهليتك", "جهز مستنداتك", "رتب رغباتك"].map((item) => <span key={item}>{item}</span>)}
            </div>
            <Link href="/articles" className="reel-link">شاهد الدليل</Link>
          </div>
        </div>
        <div className="guide-article-stack">
          {articles.slice(0,3).map((a, index) => (
            <Link href={"/articles/"+a.slug} className="guide-mini-card" key={a.slug}>
              <span className="guide-mini-image" style={{backgroundImage:`url(${a.image})`}} />
              <div>
                <small>{a.category}</small>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </div>
              <b>{String(index + 1).padStart(2, "0")}</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
    <section className="section faq-section"><SectionTitle kicker="" title={text(c,"faq_title")} text="إجابات سريعة على الأسئلة التي تمنع تأخير الطلب أو اختيار مسار غير مناسب." /><div className="faq-grid">{site.entries.filter(e => e.kind === "faq").map((e, index) => <article className="faq-item" key={e.id}><i className="card-icon"><HomeIcon name={faqIcons[index % faqIcons.length]} /></i><h3>{e.name}</h3><p>{text(e.content,"answer")}</p></article>)}</div></section>
  </main></Shell>;
}
