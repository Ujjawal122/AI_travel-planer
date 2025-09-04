import { NextResponse } from "next/server";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 🔹 Step 1: Search location in OpenStreetMap
    const osmRes = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q: query,
          limit: 1,
        },
      }
    );

    if (!osmRes.data || osmRes.data.length === 0) {
      
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }

    const place = osmRes.data[0];

    // 🔹 Step 2: Fetch images from Unsplash
    const unsplashRes = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query,
          per_page: 3,
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const images = unsplashRes.data.results.map((img: any) => ({
      url: img.urls.regular,
      alt: img.alt_description || "Travel Image",
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
