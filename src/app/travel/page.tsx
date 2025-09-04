// app/travel/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SelectTravelList, SelectBudgetOptions } from "@/lib/travel-options";

export default function TravelPage() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [days, setDays] = useState("3");
  const [traveler, setTraveler] = useState<any>(SelectTravelList[0]);
  const [budget, setBudget] = useState<any>(SelectBudgetOptions[1]);
  const [interests, setInterests] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch city/place suggestions (OpenStreetMap Nominatim)
  const fetchSuggestions = async (value: string) => {
    setDestination(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&limit=5`
      );
      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectSuggestion = (s: any) => {
    setDestination(s.display_name);
    setSuggestions([]);
  };

  // 🔹 Generate Travel Plan (AI + Unsplash)
  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    setPlace(null);

    try {
      // 1️⃣ Get main destination info with Unsplash images
      const placeRes = await axios.post("/api/place", { query: destination });
      setPlace(placeRes.data);

      // 2️⃣ Get AI-generated plan
      const res = await axios.post("/api/ai-planer", {
        destination,
        totalDays: days,
        traveler: traveler.people,
        budget: budget.title,
        interests,
      });

      let aiPlan = res.data.plan;

      // 3️⃣ Fetch Unsplash images for each itinerary spot in parallel
      for (let day of aiPlan.days) {
        await Promise.all(
          day.itinerary.map(async (spot: any) => {
            try {
              const imgRes = await axios.post("/api/place", { query: spot.name });
              if (imgRes.data?.images?.length > 0) {
                spot.image = imgRes.data.images[0].url; // pick first Unsplash image
              }
            } catch (err) {
              console.error("Unsplash fetch failed:", err);
            }
          })
        );
      }

      setPlan(aiPlan); // ✅ Save enriched plan with images
    } catch (error) {
      console.error("Error:", error);
      setPlan({ error: "⚠️ Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🌍 Guptaji AI Planner</h1>

      <div className="w-full max-w-2xl space-y-4 relative">
        {/* Destination Input with Suggestions */}
        <Input
          placeholder="Destination (e.g., Paris)"
          value={destination}
          onChange={(e) => fetchSuggestions(e.target.value)}
        />
        {suggestions.length > 0 && (
          <div className="absolute bg-gray-800 border border-gray-700 rounded-lg mt-1 w-full z-10 max-h-40 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        {/* Days Selection */}
        <div className="flex gap-2 items-center">
          <label className="text-gray-400 w-28">Days</label>
          <Input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        {/* Traveler Type */}
        <div>
          <p className="text-gray-400 mb-2">Who’s traveling?</p>
          <div className="grid grid-cols-2 gap-2">
            {SelectTravelList.map((t) => (
              <Card
                key={t.id}
                onClick={() => setTraveler(t)}
                className={`cursor-pointer border ${
                  traveler.id === t.id ? "border-purple-500" : "border-gray-700"
                } bg-gray-900 hover:bg-gray-800`}
              >
                <CardContent className="flex items-center gap-2 p-3">
                  <t.icon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.people}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Budget Options */}
        <div>
          <p className="text-gray-400 mb-2">Budget</p>
          <div className="grid grid-cols-3 gap-2">
            {SelectBudgetOptions.map((b) => (
              <Card
                key={b.id}
                onClick={() => setBudget(b)}
                className={`cursor-pointer border ${
                  budget.id === b.id ? "border-purple-500" : "border-gray-700"
                } bg-gray-900 hover:bg-gray-800`}
              >
                <CardContent className="flex flex-col items-center p-3">
                  <b.icon className="w-6 h-6 text-yellow-400" />
                  <p className="font-bold">{b.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interests */}
        <Textarea
          placeholder="Interests (e.g., museums, food, adventure)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? "Generating..." : "Generate Travel Plan"}
        </Button>
      </div>

      {/* Place Info */}
      {place && (
        <div className="mt-6 w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-3">{place.name}</h2>
          <p className="text-gray-400">
            📍 Lat: {place.lat}, Lon: {place.lon}
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {place.images.map((img: any, i: number) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt || "Place Image"}
                className="rounded-lg w-full h-32 object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Travel Plan */}
      {plan && !plan.error && (
        <div className="mt-8 w-full max-w-3xl space-y-6">
          {plan.days?.map((day: any, i: number) => (
            <Card key={i} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Day {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.itinerary.map((spot: any, j: number) => (
                  <div
                    key={j}
                    className="p-3 rounded-lg bg-gray-800 flex gap-4"
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-28 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{spot.name}</h3>
                      <p className="text-sm text-gray-400">
                        {spot.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        ⏰ {spot.time} | 💵 {spot.price}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {plan?.error && (
        <p className="text-red-400 mt-6">{plan.error}</p>
      )}
    </div>
  );
}
