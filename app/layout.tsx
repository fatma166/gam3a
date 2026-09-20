import type { Metadata } from "next";
import "./globals.css";
import { getSite, text } from "./api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSite()).entries.find(e => e.slug === "site-settings")?.content;
  return { title: text(settings, "brand"), description: text(settings, "footer") };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
