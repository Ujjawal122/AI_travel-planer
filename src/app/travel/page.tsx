"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TravelPage() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [plan, setPlan] = useState("");
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch city/place suggestions from OpenStreetMap
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

  // 🔹 When user clicks suggestion
  const handleSelectSuggestion = (s: any) => {
    setDestination(s.display_name);
    setSuggestions([]);
  };

  // 🔹 Generate Travel Plan
  const handleGenerate = async () => {
    setLoading(true);
    setPlan("");
    setPlace(null);

    try {
      // Step 1: Fetch place details & images
      const placeRes = await axios.post("/api/place", { query: destination });
      setPlace(placeRes.data);

      // Step 2: Generate AI plan
      const res = await axios.post("/api/users/ai-travel", {
        destination,
        days,
        budget,
        interests,
      });

      setPlan(res.data.plan);
    } catch (error) {
      console.error("Error:", error);
      setPlan("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🌍 AI Travel Planner</h1>

      <div className="w-full max-w-lg space-y-4 relative">
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

        <Input
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <Input
          placeholder="Budget (e.g., $1000)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <Textarea
          placeholder="Interests (e.g., museums, food, adventure)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
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
      {plan && (
        <div className="mt-8 w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3">✨ Your AI Travel Plan</h2>
          <pre className="whitespace-pre-wrap text-gray-300">{plan}</pre>
        </div>
      )}
    </div>
  );
}
