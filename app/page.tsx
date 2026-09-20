import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getCertificateTracks, getSite, pairs, strings, text } from "./api";
import { Shell, SectionTitle } from "./components";

export default async function Home() {
  const [site, articles, certificateTracks] = await Promise.all([getSite(), getArticles(), getCertificateTracks()]);
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
      <div className="hero-glow" /><div className="hero-copy">
        <span className="eyebrow">{text(c, "eyebrow")}</span><h1>{text(c, "title")}</h1><p>{text(c, "description")}</p>
        <div className="hero-actions"><Link href="/apply" className="primary-button">ابدأ طلبك</Link><Link href="/calculators" className="secondary-button">احسب أهليتك</Link></div>
      </div>
    </section>
    <section className="trust-strip">
      <div><strong>{site.counts.universities}</strong><span>جامعة</span></div>
      <div><strong>{site.counts.programs}</strong><span>برنامج</span></div>
      <div><strong>{site.counts.tracks}</strong><span>مسار شهادة</span></div>
    </section>
    <section className="search-band home-search">
      <div>
        <label>نوع الشهادة</label>
        <select defaultValue={certificateTracks[0] ?? "IGCSE / GCSE"}>
          {certificateTracks.map(track => <option key={track}>{track}</option>)}
        </select>
      </div>
      <div>
        <label>المجموع المتوقع</label>
        <input placeholder="مثال: 87%" />
      </div>
      <div>
        <label>التخصص المرغوب</label>
        <input placeholder="طب، هندسة، صيدلة..." />
      </div>
      <Link href="/calculators" className="primary-button compact">احسب الأهلية</Link>
    </section>
    <section className="section plans-section"><SectionTitle kicker="Services" title={text(c,"services_title")} text="" />
      <div className="plan-grid">{site.entries.filter(e => e.kind === "service").map(e => <article className="plan-card" key={e.id}><span>{e.name}</span><strong>{text(e.content,"price")}</strong><p>{text(e.content,"description")}</p><ul>{strings(e.content.features).map(f => <li key={f}>{f}</li>)}</ul><Link href={"/apply?service="+e.id} className="primary-button compact">اطلب الخدمة</Link></article>)}</div>
      <div className="consultation-strip">
        <div>
          <span>استشارة قبل التقديم</span>
          <strong>غير متأكد من شهادتك أو رغباتك؟</strong>
          <p>احصل على مراجعة سريعة قبل دفع الرسوم أو إرسال ملف ناقص.</p>
        </div>
        <Link href="/consultations" className="primary-button compact">اعرف الاستشارات</Link>
      </div>
    </section>
    <section className="section"><SectionTitle kicker="" title={text(c,"benefits_title")} text="" /><div className="benefit-grid">{pairs(c.benefits).map(([title,description]) => <article className="benefit-card" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="split-section">
      <div>
        <SectionTitle kicker="" title={text(c,"steps_title")} text="رحلة واضحة من أول بيانات الطالب حتى متابعة حالة الطلب." />
        <ol className="steps">{strings(c.steps).map(s => <li key={s}>{s}</li>)}</ol>
      </div>
      <div className="visual-stack">
        <div className="metric-card">
          <span>Universities</span>
          <strong>{site.counts.universities}</strong>
          <small>جامعات وبرامج قابلة للمقارنة</small>
        </div>
        <div className="metric-card accent">
          <span>Programs</span>
          <strong>{site.counts.programs}</strong>
          <small>مصنفة حسب الأهلية والشهادة</small>
        </div>
        <div className="metric-card">
          <span>Applications</span>
          <strong>24/7</strong>
          <small>متابعة حالة الطلب والتنبيهات</small>
        </div>
      </div>
    </section>
    <section className="section"><SectionTitle kicker="" title={text(c,"articles_title")} text="" /><div className="article-grid">{articles.slice(0,3).map(a => <Link href={"/articles/"+a.slug} className="article-card" key={a.slug}><span className="article-thumb" style={{backgroundImage:`url(${a.image})`}} /><div><small>{a.category}</small><h3>{a.title}</h3><p>{a.excerpt}</p></div></Link>)}</div></section>
    <section className="section"><SectionTitle kicker="" title={text(c,"faq_title")} text="" /><div className="faq-grid">{site.entries.filter(e => e.kind === "faq").map(e => <article className="faq-item" key={e.id}><h3>{e.name}</h3><p>{text(e.content,"answer")}</p></article>)}</div></section>
  </main></Shell>;
}
