import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { surprises } from "../content";

let nextId = 0;

export default function ShootingStars({ onCatch }) {
  const [active, setActive] = useState([]);
  const usedMessages = useRef(new Set());

  const spawn = useCallback(() => {
    const remaining = surprises.filter((_, i) => !usedMessages.current.has(i));
    if (remaining.length === 0) return;

    const message = remaining[Math.floor(Math.random() * remaining.length)];
    const msgIndex = surprises.indexOf(message);
    if (msgIndex === -1 || usedMessages.current.has(msgIndex)) return;

    const id = nextId++;
    const startY = Math.random() * 40 + 5;
    const startX = Math.random() * 30 + 60;
    setActive((prev) => [...prev, { id, message, startX, startY, revealed: false }]);

    // Auto-remove if she never catches it
    setTimeout(() => {
      setActive((prev) => prev.filter((s) => s.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) spawn();
    }, 9000);
    return () => clearInterval(interval);
  }, [spawn]);

  const handleCatch = (item) => {
    const msgIndex = surprises.indexOf(item.message);
    usedMessages.current.add(msgIndex);
    setActive((prev) => prev.map((s) => (s.id === item.id ? { ...s, revealed: true } : s)));
    onCatch?.();
    setTimeout(() => {
      setActive((prev) => prev.filter((s) => s.id !== item.id));
    }, 2600);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {active.map((item) => (
          <motion.div
            key={item.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{ left: `${item.startX}%`, top: `${item.startY}%` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              item.revealed
                ? { opacity: 1 }
                : { x: -420, y: 280, opacity: [0, 1, 1, 0] }
            }
            transition={item.revealed ? { duration: 0.3 } : { duration: 2.6, ease: "easeIn" }}
            onClick={() => !item.revealed && handleCatch(item)}
          >
            {!item.revealed ? (
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]" />
                <div
                  className="absolute top-0 right-0 h-[1.5px] w-24 origin-right"
                  style={{
                    background: "linear-gradient(to left, rgba(255,255,255,0.9), transparent)",
                    transform: "rotate(210deg)",
                  }}
                />
              </div>
            ) : (
              <motion.div
                className="glass rounded-2xl px-5 py-3 max-w-[220px]"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <p className="font-hand text-lg leading-snug" style={{ color: "#ffe1a8" }}>
                  {item.message}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
