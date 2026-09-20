"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="page-wrap" dir="rtl"><h1>تعذر تحميل البيانات</h1><p>الخادم غير متاح حاليًا. حاول مرة أخرى بعد قليل.</p><button className="primary-button" onClick={reset}>إعادة المحاولة</button></main>;
}
