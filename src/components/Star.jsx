import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const SIZE_MAP = {
  sm: { core: 6, glow: 26 },
  md: { core: 9, glow: 38 },
  lg: { core: 13, glow: 54 },
};

// A single interactive star on the constellation canvas.
// Handles hover glow and click-to-open without any drift-away behavior.
export default function Star({ star, visited, onOpen, canvasRef }) {
  const [hovered, setHovered] = useState(false);
  const dims = SIZE_MAP[star.size] || SIZE_MAP.md;

  return (
    <motion.button
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer group"
      style={{
        left: `${star.x * 100}%`,
        top: `${star.y * 100}%`,
        width: dims.glow * 2,
        height: dims.glow * 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(star)}
      aria-label={visited ? star.title : "an unopened star"}
    >
      {/* Ambient pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background: visited
            ? "radial-gradient(circle, rgba(255,220,180,0.28), transparent 70%)"
            : "radial-gradient(circle, rgba(200,210,255,0.16), transparent 70%)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3 + (star.size === "lg" ? 0 : 1), repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core star */}
      <motion.span
        className="absolute rounded-full"
        style={{
          width: dims.core,
          height: dims.core,
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
          background: visited ? "#ffe9c7" : "#ffffff",
          boxShadow: hovered
            ? `0 0 ${dims.glow}px ${dims.glow / 2.5}px rgba(255,225,190,0.65)`
            : `0 0 ${dims.glow / 1.6}px ${dims.glow / 4}px rgba(255,255,255,0.35)`,
        }}
        animate={{ scale: hovered ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
      />

      {/* Label on hover */}
      {star.date && (
        <motion.span
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-hand text-lg pointer-events-none"
          style={{ color: "#fdf6ff" }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -4 }}
          transition={{ duration: 0.25 }}
        >
          {star.date}
        </motion.span>
      )}
    </motion.button>
  );
}
