// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Routes that don't need authentication
  const publicRoutes = ["/login", "/signup", "/"];

  // ✅ Block access if user is not logged in
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Prevent logged-in users from visiting login/signup
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/travel", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to protected routes
export const config = {
  matcher: [
    "/travel/:path*",  
    "/mytrips/:path*", 
    "/login",         
    "/signup",          
  ],
};
