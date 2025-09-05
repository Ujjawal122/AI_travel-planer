"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Trip {
  _id: string;
  destination: string;
  plan: any;
  createdAt: string;
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/users/trips");
        setTrips(res.data.trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🧳 My Trips</h1>
      {trips.length === 0 ? (
        <p className="text-gray-400">No trips saved yet.</p>
      ) : (
        <div className="grid gap-6">
          {trips.map((trip) => (
            <Card key={trip._id} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
                <p className="text-xs text-gray-500">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                {trip.plan.days.map((day: any, i: number) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-bold">Day {i + 1}</h3>
                    <ul className="list-disc ml-5 text-gray-300">
                      {day.itinerary.map((spot: any, j: number) => (
                        <li key={j}>{spot.name} – {spot.time}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
