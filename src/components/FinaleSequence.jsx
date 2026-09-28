import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { stars, siteConfig } from "../content";

// Parametric heart curve, returns normalized (0-1) points.
function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x / 34 + 0.5, y: y / 34 + 0.5 };
}

function emberBurst() {
  const colors = ["#ffe1a8", "#ffb8d1", "#fff6d0"];
  confetti({
    particleCount: 5,
    startVelocity: 12,
    spread: 80,
    gravity: 0.35,
    scalar: 0.9,
    ticks: 220,
    colors,
    origin: { x: Math.random(), y: Math.random() * 0.3 },
    shapes: ["circle"],
  });
}

export default function FinaleSequence({ visitedStars, onReplay }) {
  const [stage, setStage] = useState("aligning"); // aligning -> letter
  const [lettersShown, setLettersShown] = useState(0);
  const intervalRef = useRef(null);

  const visitedStarList = useMemo(() => stars.filter((s) => visitedStars.has(s.id) || s.isFinalStar), [visitedStars]);

  const heartPositions = useMemo(() => {
    const n = Math.max(visitedStarList.length, 1);
    return visitedStarList.map((_, i) => heartPoint((i / n) * Math.PI * 2));
  }, [visitedStarList]);

  useEffect(() => {
    const burstTimer = setInterval(emberBurst, 260);
    const toLetter = setTimeout(() => {
      clearInterval(burstTimer);
      setStage("letter");
    }, 3800);
    return () => {
      clearInterval(burstTimer);
      clearTimeout(toLetter);
    };
  }, []);

  useEffect(() => {
    if (stage !== "letter") return;
    intervalRef.current = setInterval(() => {
      setLettersShown((n) => {
        if (n >= siteConfig.finale.letter.length) {
          clearInterval(intervalRef.current);
          return n;
        }
        return n + 1;
      });
    }, 550);
    return () => clearInterval(intervalRef.current);
  }, [stage]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,190,150,0.16), transparent 65%), #05050f",
        }}
      />
      <div className="twinkle-layer opacity-30" />

      {/* Aligning stage: visited stars fly into heart formation */}
      <AnimatePresence>
        {stage === "aligning" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            {visitedStarList.map((star, i) => {
              const target = heartPositions[i];
              return (
                <motion.span
                  key={star.id}
                  className="absolute rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "#ffe9c7",
                    boxShadow: "0 0 20px 6px rgba(255,220,180,0.6)",
                  }}
                  initial={{
                    left: `${star.x * 100}%`,
                    top: `${star.y * 100}%`,
                    opacity: 0.9,
                  }}
                  animate={{
                    left: `${target.x * 100}%`,
                    top: `${target.y * 100}%`,
                    opacity: 1,
                  }}
                  transition={{ duration: 2.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
            <motion.p
              className="absolute bottom-16 left-0 right-0 text-center font-hand text-2xl"
              style={{ color: "#ffe1a8" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
            >
              every star, finding its place
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter stage */}
      <AnimatePresence>
        {stage === "letter" && (
          <motion.div
            className="relative z-10 w-full max-w-lg px-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="glass shadow-panelGlow rounded-3xl p-8 md:p-12 text-center">
              <p className="font-hand text-2xl mb-1" style={{ color: "#ffe1a8" }}>
                {siteConfig.finale.wishSubtitle}
              </p>
              <h1 className="font-display italic text-4xl md:text-5xl mb-6">{siteConfig.finale.wishTitle}</h1>

              <div className="text-left space-y-2 min-h-[220px]">
                {siteConfig.finale.letter.slice(0, lettersShown).map((line, i) => (
                  <motion.p
                    key={i}
                    className={`font-body ${line === "" ? "h-3" : "text-base text-white/85 leading-relaxed"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {lettersShown >= siteConfig.finale.letter.length && (
                <motion.button
                  onClick={onReplay}
                  className="mt-8 font-body text-sm tracking-wide text-white/70 border border-white/20 rounded-full px-6 py-2 hover:bg-white/10 hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {siteConfig.finale.replayLabel}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
