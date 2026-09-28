import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { shayaris } from "../content";

export default function ShayariDeck({ onClose }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir) => {
    setDirection(dir);
    setIndex((i) => (i + dir + shayaris.length) % shayaris.length);
  };

  const handleDragEnd = (_e, info) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const current = shayaris[index];

  return (
    <motion.div
      className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-[#090510]/75 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 text-white/60 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <div className="relative z-10 w-full max-w-[22rem] sm:max-w-sm flex items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => go(-1)}
          className="text-white/60 hover:text-white transition-colors shrink-0"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative w-full h-[19rem] sm:h-[22rem] overflow-visible">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0 rounded-[1.75rem] p-5 sm:p-7 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing select-none shadow-[0_0_30px_rgba(255,192,138,0.18)] border border-[#f1d2a5]/25 bg-[radial-gradient(circle_at_top,_rgba(255,216,170,0.15),_rgba(20,14,21,0.88)_58%,_rgba(10,8,15,0.96))]"
              custom={direction}
              initial={{ opacity: 0, x: direction * 70, rotate: direction * 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -direction * 70, rotate: -direction * 4 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
            >
              {current.lines.map((line, i) => (
                <p
                  key={i}
                  className="font-display italic text-[2rem] sm:text-[2.35rem] leading-[1.05] text-[#fff2d4] drop-shadow-[0_0_12px_rgba(255,218,160,0.25)]"
                >
                  {line}
                </p>
              ))}
              {current.translation && (
                <p className="font-body italic text-[11px] sm:text-xs text-[#f8dfb2] mt-4 leading-relaxed px-2 opacity-95">
                  {current.translation}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => go(1)}
          className="text-white/40 hover:text-white transition-colors shrink-0"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 z-10">
        {shayaris.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === index ? "#ffe1a8" : "rgba(255,255,255,0.25)" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
