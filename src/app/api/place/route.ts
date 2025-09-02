import { NextResponse } from "next/server";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 🔹 Step 1: Get location from OpenStreetMap
    const osmRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );

    if (osmRes.data.length === 0) {
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }

    const place = osmRes.data[0]; // take first match

    // 🔹 Step 2: Get images from Unsplash
    const unsplashRes = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=3`
    );

    const images = unsplashRes.data.results.map((img: any) => ({
      url: img.urls.regular,
      alt: img.alt_description,
    }));

    return NextResponse.json({
      name: place.display_name,
      lat: place.lat,
      lon: place.lon,
      images,
    });
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
