import Link from "next/link";
import { getSite, pairs, safeHref, text } from "./api";

const createdPages = [
  ["الجامعات", "/universities", "قارن بين الجامعات والبرامج"],
  ["البرامج", "/programs", "اعرف التخصصات المناسبة"],
  ["الحاسبات", "/calculators", "احسب أهلية شهادتك"],
  ["الاستشارات", "/consultations", "اسأل عن شهادتك وفرصك"],
  ["المقالات", "/articles", "أدلة الشهادات والمستندات"],
  ["بوابة الطالب", "/dashboard", "تابع حالة طلبك"],
  ["لوحة التشغيل", "/admin", "متابعة داخلية للطلبات"],
];

const socialLinks = [
  ["Facebook", "https://facebook.com/", "https://cdn.simpleicons.org/facebook/0b3b5c"],
  ["Instagram", "https://instagram.com/", "https://cdn.simpleicons.org/instagram/0b3b5c"],
  ["WhatsApp", "https://wa.me/201000000000", "https://cdn.simpleicons.org/whatsapp/0b3b5c"],
  ["Email", "mailto:info@taqdeem-edu.com", "https://cdn.simpleicons.org/maildotru/0b3b5c"],
];

export async function Header() {
  const settings = (await getSite()).entries.find(e => e.slug === "site-settings")?.content;
  return <header className="site-header">
    <Link href="/" className="brand"><span className="brand-mark">ت</span><span><strong>{text(settings, "brand")}</strong><small>{text(settings, "tagline")}</small></span></Link>
    <nav className="nav-links" aria-label="التنقل الرئيسي">
      <Link href="/">الرئيسية</Link>
      <div className="nav-menu">
        <span tabIndex={0}>صفحات الموقع</span>
        <div className="nav-menu-panel" aria-label="الصفحات المتاحة">
          {createdPages.map(([label, href, hint]) => (
            <Link key={href} href={href}>
              <strong>{label}</strong>
              <small>{hint}</small>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/calculators">احسب أهليتك</Link>
      <Link href="/consultations">الاستشارات</Link>
      <Link href="/articles">دليل الطالب</Link>
    </nav>
    <div className="social-links header-social" aria-label="وسائل التواصل">
      {socialLinks.slice(0, 3).map(([label, href, icon]) => (
        <Link href={href} key={label} aria-label={label} title={label}>
          <img src={icon} alt="" />
        </Link>
      ))}
    </div>
    <Link href="/apply" className="header-action">ابدأ طلبك</Link>
  </header>;
}
export async function Footer() {
  const settings = (await getSite()).entries.find(e => e.slug === "site-settings")?.content;
  return <footer className="footer">
    <div>
      <strong>{text(settings, "brand")}</strong>
      <p>{text(settings, "footer")}</p>
      <div className="social-links">
        {socialLinks.map(([label, href, icon]) => (
          <Link href={href} key={label} aria-label={label} title={label}>
            <img src={icon} alt="" />
          </Link>
        ))}
      </div>
    </div>
    <div className="footer-links">
      {pairs(settings?.navigation).map(([label, href]) => <Link href={safeHref(href)} key={href}>{label}</Link>)}
      <Link href="/consultations">الاستشارات</Link>
      <Link href="/apply">ابدأ طلبك</Link>
    </div>
  </footer>;
}
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="app-shell"><Header />{children}<Footer /></div>;
}
export function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return <div className="section-title"><span>{kicker}</span><h2>{title}</h2><p>{text}</p></div>;
}
