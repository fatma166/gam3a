import { cache } from "react";

export const API_BASE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
export type Program = { id: number; name: string; slug: string; degree: string; language: string; tuition_amount: string | null; tuition_currency: string; faculty?: { name: string; university?: { name: string; slug: string } }; admission_rules?: Array<{ minimum_score: string | null; notes: string | null; certificate_track_id: number }> };
export type UniversityCard = { id: number; slug: string; name: string; city: string; type: string; programs: number; acceptance: string; image: string; description: string; faculties?: Array<{ name: string; programs: Program[] }> };
export type ArticleCard = { slug: string; title: string; category: string; excerpt: string; date: string; readTime: string; image: string; content?: string };
export type SiteEntry = { id: number; slug: string; name: string; kind: string; content: Record<string, unknown> };
export type Site = { entries: SiteEntry[]; counts: { universities: number; programs: number; tracks: number } };
export type Track = { id: number; name: string; requirements?: unknown };
export type CalculatorRule = { id: number; name: string; notes: string; certificate_track_id: number; formula: { weights: Record<string, number>; grade_map?: Record<string, number> }; inputs_schema: { required_subjects?: string[]; min_subjects?: number } | null };

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(API_BASE_URL + path, { cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("تعذر تحميل بيانات الموقع من الخادم.");
  return response.json();
}
export const getSite = cache(() => apiGet<Site>("/site"));
export function text(content: Record<string, unknown> | undefined, key: string, fallback = "") {
  return typeof content?.[key] === "string" ? content[key] as string : fallback;
}
export function strings(value: unknown): string[] { return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []; }
export function pairs(value: unknown): string[][] { return Array.isArray(value) ? value.filter(v => Array.isArray(v) && v.length >= 2 && v.every(x => typeof x === "string")) : []; }
export function safeHref(value: string) { return value.startsWith("/") && !value.startsWith("//") ? value : "/"; }
export async function getPage(slug: string) { return (await getSite()).entries.find(e => e.kind === "page" && e.slug === slug); }
async function all<T>(path: string): Promise<T[]> {
  let page = 1; const result: T[] = [];
  while (true) {
    const payload = await apiGet<{ data: T[]; last_page: number }>(path + (path.includes("?") ? "&" : "?") + "per_page=100&page=" + page);
    result.push(...payload.data);
    if (page >= payload.last_page) return result;
    page++;
  }
}
function normalizeUniversity(item: UniversityCard & { programs_count?: number; image_url?: string; acceptance_label?: string }): UniversityCard {
  return { ...item, programs: item.programs_count ?? item.faculties?.reduce((n, f) => n + f.programs.length, 0) ?? 0, image: item.image_url ?? "", acceptance: item.acceptance_label ?? "" };
}
export async function getUniversities() { return (await all<UniversityCard>("/universities")).map(normalizeUniversity); }
export async function getUniversity(slug: string): Promise<UniversityCard | undefined> {
  const r = await fetch(API_BASE_URL + "/universities/" + encodeURIComponent(slug), { cache: "no-store" });
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error("تعذر تحميل الجامعة");
  return normalizeUniversity(await r.json());
}
export const getPrograms = () => all<Program>("/programs");
export const getTracks = () => apiGet<Track[]>("/certificate-tracks");
export const getCertificateTracks = async () => (await getTracks()).map(t => t.name);
export const getArticles = () => apiGet<ArticleCard[]>("/content/articles");
export async function getArticle(slug: string): Promise<ArticleCard | undefined> {
  const r = await fetch(API_BASE_URL + "/content/articles/" + encodeURIComponent(slug), { cache: "no-store" });
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error("تعذر تحميل المقال");
  return r.json();
}
