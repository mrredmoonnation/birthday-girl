import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, BookHeart, Images } from "lucide-react";
import Star from "./Star";
import StarPanel from "./StarPanel";
import CursorDust from "./CursorDust";
import ShootingStars from "./ShootingStars";
import CakeMoment from "./CakeMoment";
import ShayariDeck from "./ShayariDeck";
import MoonGallery from "./MoonGallery";
import { stars, constellations, siteConfig } from "../content";

const CANVAS_SIZE = 1600; // virtual canvas the stars are laid out on, in px, panned within the viewport

const PORTAL_OPTIONS = [
  { key: "cake", label: "cake", icon: Cake },
  { key: "shayari", label: "shayari", icon: BookHeart },
  { key: "gallery", label: "photos", icon: Images },
];

function PortalMenu({ onOpen, active }) {
  return (
    <div className="absolute top-[calc(1rem+env(safe-area-inset-top))] left-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 190, damping: 20 }}
        className="glass flex items-center justify-between gap-1.5 rounded-full border border-white/10 px-1.5 py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
      >
        {PORTAL_OPTIONS.map(({ key, label, icon: Icon }) => {
          const selected = active === key;

          return (
            <motion.button
              key={key}
              onClick={() => onOpen(key)}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all ${
                selected
                  ? "bg-white/10 text-[#ffe1a8] shadow-[0_0_18px_rgba(255,220,180,0.18)]"
                  : "text-white/65 hover:text-white"
              }`}
              aria-label={`Open ${label}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ConstellationView({ visitedStars, visitedRatio, onStarVisited, onFinaleTrigger }) {
  const [openStar, setOpenStar] = useState(null);
  const [openPortal, setOpenPortal] = useState(null); // "cake" | "shayari" | "gallery" | null
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    return clamp(Math.min(window.innerWidth / 390, window.innerHeight / 760), 0.78, 1.15);
  });
  const canvasRef = useRef(null);
  const pinchRef = useRef(null);

  const finalStar = useMemo(() => stars.find((s) => s.isFinalStar), []);
  const normalStars = useMemo(() => stars.filter((s) => !s.isFinalStar), []);
  const finalUnlocked = visitedRatio >= siteConfig.finale.unlockThreshold;

  const handleOpen = useCallback(
    (star) => {
      if (star.isFinalStar) {
        onFinaleTrigger();
        return;
      }
      setOpenStar(star);
      onStarVisited(star.id);
    },
    [onFinaleTrigger, onStarVisited]
  );

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setScale((s) => clamp(s - e.deltaY * 0.0009, 0.7, 2));
  }, []);

  const handleTouchStart = useCallback((event) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { distance, scale };
    }
  }, [scale]);

  const handleTouchMove = useCallback((event) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    event.preventDefault();

    const [a, b] = [event.touches[0], event.touches[1]];
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const nextScale = clamp((pinchRef.current.scale * distance) / pinchRef.current.distance, 0.7, 2);
    setScale(nextScale);
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  // A constellation's connecting line appears once every star in it has been visited.
  const completedConstellations = constellations.filter((c) => c.stars.every((id) => visitedStars.has(id)));

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1 }}
      onWheel={handleWheel}
    >
      <div className="nebula-bg" />
      <div className="twinkle-layer opacity-40" />
      <CursorDust />
      <ShootingStars />

      {/* Top UI chrome */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-16 sm:pt-20 pointer-events-none">
        <p className="font-hand text-lg text-white/85 drop-shadow-[0_0_18px_rgba(255,255,255,0.18)] sm:text-2xl">{siteConfig.constellationHint}</p>
        <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-white/10 shadow-[0_0_20px_rgba(255,213,167,0.12)] sm:mt-3 sm:w-44">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ffb8d1] to-[#ffe1a8]"
            animate={{ width: `${Math.min(100, visitedRatio * 100)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Pannable/zoomable canvas */}
      <motion.div
        ref={canvasRef}
        className="absolute"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, left: "50%", top: "50%", touchAction: "none" }}
        drag
        dragElastic={0.12}
        dragMomentum={false}
        dragTransition={{ power: 0.4, timeConstant: 180 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        initial={{ x: -CANVAS_SIZE / 2, y: -CANVAS_SIZE / 2, scale: 0.9 }}
        animate={{ x: -CANVAS_SIZE / 2, scale }}
        transition={{ scale: { type: "spring", stiffness: 140, damping: 20 } }}
      >
        {/* Constellation connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 1 1`} preserveAspectRatio="none" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          {completedConstellations.map((c) => {
            const points = c.stars
              .map((id) => stars.find((s) => s.id === id))
              .filter(Boolean)
              .map((s) => `${s.x * CANVAS_SIZE},${s.y * CANVAS_SIZE}`)
              .join(" ");
            return (
              <motion.polyline
                key={c.id}
                points={points}
                fill="none"
                stroke={c.color}
                strokeWidth="1"
                strokeOpacity="0.45"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {normalStars.map((star) => (
          <Star
            key={star.id}
            star={star}
            visited={visitedStars.has(star.id)}
            onOpen={handleOpen}
            canvasRef={canvasRef}
          />
        ))}

        <AnimatePresence>
          {finalUnlocked && finalStar && (
            <motion.div
              key="final-wrapper"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <Star star={finalStar} visited={false} onOpen={handleOpen} canvasRef={canvasRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {finalUnlocked && (
        <motion.p
          className="absolute bottom-8 left-0 right-0 text-center font-hand text-2xl z-20 pointer-events-none"
          style={{ color: "#ffe1a8" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {siteConfig.finaleUnlockText}
        </motion.p>
      )}

      <AnimatePresence>
        {openStar && <StarPanel star={openStar} onClose={() => setOpenStar(null)} />}
      </AnimatePresence>

      <PortalMenu onOpen={setOpenPortal} active={openPortal} />

      <AnimatePresence>
        {openPortal === "cake" && <CakeMoment key="cake" onClose={() => setOpenPortal(null)} />}
        {openPortal === "shayari" && <ShayariDeck key="shayari" onClose={() => setOpenPortal(null)} />}
        {openPortal === "gallery" && <MoonGallery key="gallery" onClose={() => setOpenPortal(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
