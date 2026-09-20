export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = options.body instanceof FormData ? options.headers : { "Content-Type": "application/json", ...options.headers };
  const response = await fetch("/api/backend/" + path, { ...options, headers, cache: "no-store" });
  if (response.status === 204) return undefined as T;
  const result = await response.json();
  if (!response.ok) throw new Error(result.errors ? Object.values(result.errors).flat().join(" ") : result.message ?? "تعذر تنفيذ الطلب");
  return result;
}
