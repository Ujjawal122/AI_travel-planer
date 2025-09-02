"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-extrabold text-center mb-6"
      >
        ✈️ AI Travel Planner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-lg md:text-2xl text-gray-300 text-center max-w-2xl mb-10"
      >
        Plan smarter, travel further 🌍.  
        Let AI design your perfect journey in seconds.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex gap-6"
      >
        <Link href="/login">
          <Button className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-700 transition">
            Login
          </Button>
        </Link>

        <Link href="/signup">
          <Button
            variant="outline"
            className="px-6 py-3 text-lg rounded-2xl shadow-lg border-gray-300 text-white hover:bg-gray-800 transition"
          >
            Sign Up
          </Button>
        </Link>
      </motion.div>

      {/* Background Motion (Airplane + Balloon) */}
     

     
    </main>
  );
}
