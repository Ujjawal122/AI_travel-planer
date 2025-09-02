"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TravelAnimation() {
  return (
    <div className="relative flex items-center justify-center h-[500px] w-full overflow-hidden bg-black">
      {/* Hot Air Balloon (floating) */}
      <motion.div
        className="absolute bottom-20 left-[40%]"
        animate={{ y: [0, -25, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/hot-balloon.jpg"
          alt="Hot Air Balloon"
          width={150}
          height={150}
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
        />
      </motion.div>

      {/* Airplane Path (Right → Left in an Arc) */}
      <motion.div
        className="absolute"
        initial={{ rotate: 10 }}
        animate={{
          x: ["100vw", "50vw", "-200px"], // starts right → middle → left
          y: [100, -80, 100], // goes upward (arc) then back down
          rotate: [10, 0, -10], // tilt adjustment along path
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/aeroplane.jpg"
          alt="Airplane"
          width={100}
          height={100}
          className="drop-shadow-[0_0_20px_rgba(135,206,250,0.8)]"
        />
      </motion.div>
    </div>
  );
}
