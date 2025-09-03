// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  // ✅ Optional: verify JWT here
  return NextResponse.json({ authenticated: true });
}
