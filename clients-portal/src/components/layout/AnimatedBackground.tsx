"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#080812]">

      {/* Deep dark base radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.14)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />

      {/* Large drifting neon orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-700/25 blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.4, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-fuchsia-700/20 blur-[160px]"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[40%] w-[45vw] h-[45vw] rounded-full bg-cyan-700/12 blur-[120px]"
      />

      {/* Floating particles */}
      {[...Array(22)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${100 + Math.random() * 20}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${100 + Math.random() * 10}vh`, `-${10 + Math.random() * 10}vh`],
            opacity: [0, 0.6, 0.3, 0],
            x: `${Math.random() * 100}vw`,
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear",
          }}
          className="absolute"
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            borderRadius: "50%",
            background: i % 3 === 0
              ? "rgba(99,102,241,0.8)"
              : i % 3 === 1
              ? "rgba(168,85,247,0.7)"
              : "rgba(34,211,238,0.6)",
            boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
          }}
        />
      ))}

      {/* Subtle scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
    </div>
  );
}
