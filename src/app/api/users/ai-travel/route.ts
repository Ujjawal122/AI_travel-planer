import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_AI, // from .env.local
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Travel Planner",
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, days, budget, interests } = body;

    const prompt = `
You are an AI Travel Planner. 
Plan a personalized trip for a traveler.

Destination: ${destination}
Days: ${days}
Budget: ${budget}
Interests: ${interests}

Return the plan in a clear day-by-day format.
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // or "openai/gpt-4o" if you prefer
      messages: [{ role: "user", content: prompt }],
    });

    const aiMessage = completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ plan: aiMessage });
  } catch (error) {
    console.error("AI Travel Planner Error:", error);
    return NextResponse.json(
      { error: "Failed to generate travel plan" },
      { status: 500 }
    );
  }
}
