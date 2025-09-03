// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; 

  const { pathname } = req.nextUrl;


  const publicRoutes = ["/login", "/signup", "/"];

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and tries to go to login or signup, redirect to /travel
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/travel", req.url));
  }

  return NextResponse.next();
}

// ✅ Specify which paths should run middleware
export const config = {
  matcher: ["/travel", "/login", "/signup"],
};
