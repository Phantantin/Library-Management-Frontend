import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendUrl, cookieName } from "@/lib/auth";
type Context = { params: Promise<{ path: string[] }> };
async function handler(req: NextRequest, { params }: Context) {
  const { path } = await params;
  if (
    path.some((p) => !/^[-\w]+$/.test(p)) ||
    !["api", "auth"].includes(path[0])
  )
    return NextResponse.json({ message: "Invalid API path" }, { status: 400 });
  const mutation = !["GET", "HEAD"].includes(req.method);
  if (mutation && req.headers.get("origin") !== req.nextUrl.origin)
    return NextResponse.json(
      { message: "Invalid request origin" },
      { status: 403 },
    );
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  const endpoint = "/" + path.join("/");
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token && !endpoint.startsWith("/auth/"))
      headers.Authorization = "Bearer " + token;
    const response = await fetch(backendUrl(endpoint) + req.nextUrl.search, {
      method: req.method,
      headers,
      body: mutation ? await req.text() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(18000),
      redirect: "error",
    });
    const data: unknown = await response.json().catch(() => ({
      message: response.ok ? "Request completed" : "Request failed",
    }));
    if (
      response.ok &&
      ["/auth/login", "/auth/signup"].includes(endpoint) &&
      typeof data === "object" &&
      data !== null &&
      "jwt" in data &&
      typeof data.jwt === "string"
    ) {
      const { jwt, ...safe } = data;
      const outgoing = NextResponse.json(safe, {
        headers: { "Cache-Control": "no-store" },
      });
      outgoing.cookies.set(cookieName, jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400,
      });
      return outgoing;
    }
    const outgoing = NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
    if (response.status === 401 && !endpoint.startsWith("/auth/"))
      outgoing.cookies.delete(cookieName);
    return outgoing;
  } catch {
    return NextResponse.json(
      { message: "The library service is unavailable." },
      { status: 502 },
    );
  }
}
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
