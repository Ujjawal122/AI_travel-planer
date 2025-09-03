// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
   (await cookies()).set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // expires immediately
  });

  return NextResponse.json({ success: true, message: "Logged out" });
}
