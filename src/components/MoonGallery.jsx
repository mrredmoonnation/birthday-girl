import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { gallery } from "../content";

// Deterministic-ish scatter so polaroids don't overlap too badly on load.
function scatterPosition(i, total) {
  const cols = Math.ceil(Math.sqrt(total));
  const col = i % cols;
  const row = Math.floor(i / cols);
  const cellW = 100 / cols;
  const cellH = 100 / Math.ceil(total / cols);
  const jitterX = (Math.sin(i * 12.9898) * 0.5 + 0.5) * cellW * 0.3;
  const jitterY = (Math.sin(i * 78.233) * 0.5 + 0.5) * cellH * 0.3;
  return {
    left: `${col * cellW + cellW * 0.25 + jitterX}%`,
    top: `${row * cellH + cellH * 0.2 + jitterY}%`,
  };
}

export default function MoonGallery({ onClose }) {
  const [focused, setFocused] = useState(null);
  const [revealedIds, setRevealedIds] = useState([]);
  const positions = useMemo(() => gallery.map((_, i) => scatterPosition(i, gallery.length)), []);

  return (
    <motion.div
      className="fixed inset-0 z-[50] pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto" />

      <button
        onClick={onClose}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 text-white/50 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <p className="absolute top-5 left-1/2 -translate-x-1/2 font-hand text-xl sm:text-2xl z-30" style={{ color: "#ffe1a8" }}>
        drag them around
      </p>

      <div className="relative w-full h-full overflow-hidden px-3 pb-16 pt-14 sm:px-6 sm:pt-16">
        {gallery.map((photo, i) => {
          const isActive = focused?.id === photo.id;
          const isRevealed = revealedIds.includes(photo.id);

          return (
            <motion.div
              key={photo.id}
              className="absolute w-28 sm:w-32 md:w-40 bg-[#fdfaf5] rounded-sm shadow-2xl p-2 pb-6 cursor-grab active:cursor-grabbing"
              style={{ ...positions[i] }}
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.5, rotate: photo.rotate }}
              animate={{ opacity: 1, scale: 1, rotate: photo.rotate }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              whileDrag={{ scale: 1.1, zIndex: 30, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
              onClick={() => {
                setFocused(photo);
                setRevealedIds((prev) => (prev.includes(photo.id) ? prev : [...prev, photo.id]));
              }}
            >
              <motion.div
                className="w-full aspect-square bg-black/10 overflow-hidden rounded-[1px]"
                animate={{
                  filter: isActive || isRevealed ? "blur(0px) saturate(1.1)" : "blur(2px) saturate(0.7)",
                  opacity: isActive || isRevealed ? 1 : 0.82,
                  scale: isActive || isRevealed ? 1.02 : 1,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </motion.div>

              <motion.p
                className="font-hand text-[11px] sm:text-xs text-black/60 text-center mt-1 truncate"
                animate={{
                  filter: isActive || isRevealed ? "blur(0px)" : "blur(2.2px)",
                  opacity: isActive || isRevealed ? 1 : 0.45,
                  scale: isActive || isRevealed ? 1 : 0.98,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {photo.caption}
              </motion.p>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center p-6 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFocused(null)}
          >
            <motion.div
              className="bg-[#fdfaf5] rounded-sm shadow-2xl p-3 sm:p-4 pb-8 max-w-[18rem] sm:max-w-xs w-full"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full aspect-square bg-black/10 overflow-hidden">
                <img
                  src={focused.image}
                  alt={focused.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <motion.p
                className="font-hand text-base sm:text-lg text-black/70 text-center mt-3"
                initial={{ filter: "blur(3px)", opacity: 0.35 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {focused.caption}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
