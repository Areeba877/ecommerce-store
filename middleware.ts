import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token && (pathname.startsWith("/cart") || pathname.startsWith("/checkout"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/login", "/signup"],
};