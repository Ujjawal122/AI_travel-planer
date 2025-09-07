"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  // ✅ Check auth from backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setIsAuth(res.data.authenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      setIsAuth(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Background floating circles for depth */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl top-20 left-10"
        animate={{ y: [0, 40, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-10 right-10"
        animate={{ y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Hero Section */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-extrabold text-center mb-6"
      >
        ✈️ AI Travel Planner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-lg md:text-2xl text-gray-300 text-center max-w-2xl mb-12"
      >
        Plan smarter, travel further 🌍.  
        Let AI design your perfect journey in seconds.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-wrap gap-6 justify-center"
      >
        {isAuth ? (
          <>
            <Link href="/travel">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-purple-600 hover:bg-purple-700 transition">
                  🌍 Plan a Trip
                </Button>
              </motion.div>
            </Link>

            <Link href="/my-trips">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-green-600 hover:bg-green-700 transition">
                  📌 My Trips
                </Button>
              </motion.div>
            </Link>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-red-600 hover:bg-red-700 transition"
              >
                🚪 Logout
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-700 transition">
                  🔑 Login
                </Button>
              </motion.div>
            </Link>

            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="px-6 py-3 text-lg rounded-2xl shadow-lg border-gray-300 text-white hover:bg-gray-800 transition"
                >
                  ✨ Sign Up
                </Button>
              </motion.div>
            </Link>
          </>
        )}
      </motion.div>
    </main>
  );
}
