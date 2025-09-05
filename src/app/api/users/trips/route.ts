import { NextRequest, NextResponse } from "next/server";
import Connect from "@/db/dbConnect";
import Trip from "@/models/tripModel";
import { verifyJwt } from "@/lib/auth";

// Helper to extract token from cookies
const getTokenFromCookie = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie?.split("token=")[1]?.split(";")[0];
};

// GET /api/trips
export async function GET(req: NextRequest) {
  try {
    await Connect();

    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyJwt(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const trips = await Trip.find({ userId: user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ trips });
  } catch (error: any) {
    console.error("Error in GET /api/trips:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/trips
export async function POST(req: NextRequest) {
  try {
    await Connect();

    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyJwt(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { destination, plan, days, traveler, budget, interests } = await req.json();

    if (!destination || !plan || !days || !traveler || !budget) {
      return NextResponse.json(
        { error: "Missing required fields: destination, plan, days, traveler, budget" },
        { status: 400 }
      );
    }

    const trip = await Trip.create({
      userId: user.id,
      destination,
      plan,
      days: Number(days),
      traveler,
      budget,
      interests: interests || "",
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/trips:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
