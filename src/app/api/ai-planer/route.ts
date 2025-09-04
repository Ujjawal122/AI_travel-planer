import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_AI, // store in .env.local
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Travel Planner",
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, totalDays, traveler, budget, interests } = body;

    const prompt = `
You are an AI Travel Planner.

Generate a JSON ONLY travel plan for:
- Destination: ${destination}
- Days: ${totalDays}
- Traveler type: ${traveler}
- Budget: ${budget}
- Interests: ${interests}

⚠️ IMPORTANT:
- Reply with ONLY valid JSON.
- Do NOT include markdown, explanations, or extra text.
- Use this structure:

{
  "days": [
    {
      "day": 1,
      "itinerary": [
        {
          "name": "Place Name",
          "description": "Short description",
          "time": "Morning / Afternoon / Evening",
          "price": "Free / $20 / Approx cost",
          "image": "https://source.unsplash.com/featured/?PLACE"
        }
      ]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let aiMessage = completion.choices[0]?.message?.content || "{}";

    // ✅ Ensure it's valid JSON
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(aiMessage);
    } catch (err) {
      console.error("JSON parse error:", aiMessage);
      return NextResponse.json(
        { error: "AI did not return valid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: parsedPlan });
  } catch (error) {
    console.error("AI Travel Planner Error:", error);
    return NextResponse.json(
      { error: "Failed to generate travel plan" },
      { status: 500 }
    );
  }
}
