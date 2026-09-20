import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "../../../api";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join("/");
  if (!/^(auth\/(login|register|logout)|me|dashboard|calculate-equivalency|applications(?:\/\d+(?:\/documents)?)?)$/.test(route)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (request.method !== "GET" && request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
  }
  const jar = await cookies();
  const token = jar.get("gam3a_session")?.value;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  if (request.headers.get("content-type")) headers["Content-Type"] = request.headers.get("content-type")!;
  try {
    const upstream = await fetch(API_BASE_URL + "/" + route + request.nextUrl.search, {
      method: request.method, headers, cache: "no-store",
      body: request.method === "GET" ? undefined : await request.arrayBuffer(),
      signal: AbortSignal.timeout(20000),
    });
    const payload = upstream.status === 204 ? null : await upstream.json();
    if (upstream.ok && (route === "auth/login" || route === "auth/register")) {
      jar.set("gam3a_session", payload.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 });
      delete payload.token;
    }
    if ((route === "auth/logout" && upstream.ok) || upstream.status === 401) jar.delete("gam3a_session");
    return upstream.status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "تعذر الاتصال بالخادم. حاول مرة أخرى." }, { status: 502 });
  }
}
export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
