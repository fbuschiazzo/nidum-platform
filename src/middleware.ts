import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/inversores", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get("nidum_session")?.value;
  const role = request.cookies.get("nidum_role")?.value;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/inversores", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/inversores/:path*", "/admin/:path*"],
};
