import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import wingImage from "../pngwing.com.png";
import { siteConfig } from "../content";

const HOLD_DURATION = 1400; // ms required to blow out the candle

export default function EntryScreen({ onEnter }) {
  const [holding, setHolding] = useState(false);
  const [blownOut, setBlownOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min(1, elapsed / HOLD_DURATION);
    setProgress(pct);
    if (pct < 1) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const startHold = useCallback(() => {
    if (blownOut) return;
    setHolding(true);
    startRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      setBlownOut(true);
      setHolding(false);
      // Give the extinguish animation a beat before transitioning phases
      setTimeout(onEnter, 1800);
    }, HOLD_DURATION);
  }, [blownOut, onEnter, tick]);

  const cancelHold = useCallback(() => {
    if (blownOut) return;
    clearTimers();
    setHolding(false);
    setProgress(0);
  }, [blownOut]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center select-none"
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
    >
      <div className="nebula-bg" />
      <div className="twinkle-layer opacity-30" />

      <AnimatePresence>
        {!blownOut && (
          <motion.div
            className="relative z-10 mb-10 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={wingImage}
              alt="Wing illustration"
              className="h-10 w-auto opacity-80 drop-shadow-[0_0_16px_rgba(255,220,180,0.5)]"
            />
            <p className="font-hand text-2xl md:text-3xl text-glow-gold/90 ml-4" style={{ color: "#ffe1a8" }}>
              {siteConfig.entrySubtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The candle + flame */}
      <div
        className="relative z-10 flex flex-col items-center cursor-pointer touch-none"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        role="button"
        tabIndex={0}
        aria-label="Hold to blow out the candle and enter"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") startHold();
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") cancelHold();
        }}
      >
        <AnimatePresence mode="wait">
          {!blownOut ? (
            <div className="relative flex items-end justify-center">
              <motion.div
                key="flame"
                className="relative w-6 h-10 rounded-full"
                style={{
                  background: "radial-gradient(circle at 50% 70%, #fff6d0, #ffb347 60%, #ff7a3c 100%)",
                  boxShadow: "0 0 30px 10px rgba(255,180,80,0.55)",
                }}
                animate={
                  holding
                    ? {
                        scaleY: [1, 0.72, 1.2, 0.82, 1],
                        scaleX: [1, 1.18, 0.9, 1.08, 1],
                        rotate: [0, -8, 7, -5, 0],
                        opacity: [1, 1, 1, 1, 0.4 + (1 - progress) * 0.6],
                        filter: ["blur(0px)", "blur(0.6px)", "blur(0px)", "blur(0.8px)", "blur(0px)"],
                      }
                    : { scaleY: [1, 1.08, 1], scaleX: [1, 0.95, 1], rotate: [0, 2, -2, 0] }
                }
                transition={
                  holding
                    ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
                exit={{
                  scale: [1, 1.7, 0],
                  opacity: [1, 0.6, 0],
                  transition: { duration: 0.7, ease: "easeOut" },
                }}
              />

              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-white/15 blur-md"
                animate={holding ? { opacity: [0, 0.9, 0.3, 0], y: [-8, -20, -38], x: [0, -4, 8] } : { opacity: 0, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          ) : (
            <motion.div
              key="smoke"
              className="relative w-3 h-16 rounded-full bg-white/20 blur-md"
              initial={{ opacity: 0.7, y: 0, scaleY: 0.5 }}
              animate={{ opacity: 0, y: -65, scaleY: 1.6, x: [0, 6, -5, 3] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Candle body */}
        <div className="w-4 h-24 mt-1 rounded-sm bg-gradient-to-b from-[#fff3e0] to-[#e8d3ae]" />
        <div className="w-16 h-3 rounded-full bg-[#3a2e1f]/80 -mt-1 blur-[0.5px]" />

        {/* Progress ring around the hold target */}
        {holding && (
          <svg className="absolute -top-10 -left-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none" viewBox="0 0 120 200">
            <circle
              cx="60"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(255,220,180,0.5)"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - progress)}
              strokeLinecap="round"
              transform="rotate(-90 60 40)"
            />
          </svg>
        )}
      </div>

      <AnimatePresence>
        {!blownOut && (
          <motion.div
            className="mt-12 text-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="font-body text-sm tracking-wide text-white/60">{siteConfig.entryInstruction}</p>
            <p className="font-body text-xs text-white/30 mt-1">{siteConfig.entryHint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blownOut && (
          <motion.h1
            className="font-display italic text-4xl md:text-6xl text-center mt-16 z-10"
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.02em" }}
            transition={{ delay: 0.6, duration: 1.4, ease: "easeOut" }}
          >
            {siteConfig.entryTitle}
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
