import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import { cake, portraitPhotos } from "../content";

function Candle({ lit, onBlow }) {
  return (
    <button
      className="relative flex cursor-pointer flex-col items-center justify-end"
      onClick={onBlow}
      disabled={!lit}
      aria-label={lit ? "Blow out candle" : "Candle already out"}
      style={{ width: 18, height: 88 }}
    >
      <AnimatePresence>
        {lit && (
          <motion.span
            className="absolute -top-8 block rounded-full"
            style={{
              width: 18,
              height: 22,
              background: "radial-gradient(circle at 50% 55%, #fffdf4 0%, #ffe8af 20%, #ffc85b 52%, #ff8d3d 100%)",
              boxShadow: "0 0 22px 12px rgba(255,184,82,0.7), 0 0 36px rgba(255,148,55,0.4)",
            }}
            animate={{ scaleY: [1, 1.2, 0.9, 1], rotate: [0, 6, -6, 0], y: [0, -2, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            exit={{ scale: [1, 1.7, 0.2], opacity: [1, 0.5, 0], y: -10, transition: { duration: 0.45 } }}
          />
        )}
      </AnimatePresence>

      <span
        className="absolute top-0 block rounded-full"
        style={{
          width: 4,
          height: 16,
          background: "linear-gradient(180deg, #f6dab3 0%, #e7be76 100%)",
          boxShadow: "0 0 12px rgba(255,208,122,0.7)",
        }}
      />
      <span
        className="block rounded-t-[10px]"
        style={{
          width: 8,
          height: 30,
          background: "linear-gradient(180deg, #f8f0cd 0%, #ecc86a 28%, #cf8c38 100%)",
          boxShadow: "inset 0 -4px 6px rgba(138,88,33,0.18)",
        }}
      />
      <span
        className="block rounded-b-[10px]"
        style={{
          width: 10,
          height: 9,
          background: "linear-gradient(180deg, #f7e3b7 0%, #efc96d 100%)",
          boxShadow: "inset 0 -2px 5px rgba(156,98,29,0.32)",
        }}
      />
    </button>
  );
}

function CandleRow({ litCount, onBlow }) {
  const candles = Array.from({ length: cake.candleCount });

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4">
      {candles.map((_, index) => (
        <Candle key={index} lit={index < litCount} onBlow={onBlow} />
      ))}
    </div>
  );
}

export default function CakeMoment({ onClose }) {
  const [litCount, setLitCount] = useState(cake.candleCount);
  const [cut, setCut] = useState(false);
  const [randomPhoto, setRandomPhoto] = useState("");
  const dragX = useRef(0);
  const allBlown = litCount === 0;
  const photoOptions = portraitPhotos;

  const blowOne = () => setLitCount((n) => Math.max(0, n - 1));

  const handleDrag = (_e, info) => {
    dragX.current = info.point.x;
  };

  const handleDragEnd = (_e, info) => {
    if (Math.abs(info.offset.x) > 90 && allBlown && !cut) {
      const nextPhoto = photoOptions[Math.floor(Math.random() * photoOptions.length)];
      setRandomPhoto(nextPhoto);
      setCut(true);
      confetti({
        particleCount: 100,
        spread: 110,
        startVelocity: 32,
        origin: { x: 0.5, y: 0.48 },
        colors: ["#ffe1a8", "#ffb8d1", "#f9d9d8", "#ffffff", "#ffd9a8"],
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-[#050a13]/85 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-[40rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0d15]/90 shadow-[0_0_28px_rgba(12,18,30,0.9)]"
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: "spring", stiffness: 230, damping: 22 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_rgba(255,255,255,0)_55%)]" />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 text-white/60 transition-colors hover:text-white"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="relative z-10 px-6 pb-8 pt-8 text-center sm:px-8">
          <p className="font-display italic text-[3rem] leading-none tracking-[-0.05em] text-[#f4dca8] sm:text-[4rem]">
            {cake.title}
          </p>

          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
            {allBlown ? cake.cutInstruction : cake.subtitle}
          </p>

          <div className="relative mt-7 flex h-[230px] items-center justify-center sm:h-[260px]">
            {!cut && (
              <div className="absolute left-1/2 top-[18px] z-20 -translate-x-1/2">
                <CandleRow litCount={litCount} onBlow={blowOne} />
              </div>
            )}

            {!cut && (
              <motion.div
                className="absolute bottom-[28px] right-[22%] z-30 flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 shadow-[0_0_18px_rgba(255,255,255,0.08)]"
                style={{ opacity: allBlown ? 1 : 0.2 }}
                drag={allBlown ? "x" : false}
                dragConstraints={{ left: -100, right: 100 }}
                dragElastic={0.2}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 1.06 }}
              >
                <div className="relative h-16 w-5">
                  <div className="absolute left-1/2 top-0 h-12 w-[4px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#f8f0d9_0%,_#d5b567_52%,_#a36d2d_100%)] shadow-[0_0_20px_rgba(244,201,106,0.32)]" />
                  <div className="absolute left-1/2 top-8 h-6 w-2 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#ffffff_0%,_#e7ecf8_52%,_#d9deef_100%)]" />
                  <div className="absolute left-1/2 top-8 h-6 w-2 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,_rgba(255,255,255,0.9),_rgba(255,255,255,0.2)_60%,_transparent_68%)]" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-2 tracking-[0.3em] text-[10px] uppercase text-white/35 sm:text-[11px]">
            {cake.flavor}
          </div>

          <AnimatePresence>
            {cut && (
              <motion.div
                className="mt-6 flex flex-col items-center justify-center px-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="mb-4 flex w-full items-center justify-center">
                  <div className="w-full max-w-[18rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_0_22px_rgba(255,205,130,0.12)]">
                    <img
                      src={randomPhoto || portraitPhotos[0]}
                      alt="Riya celebration"
                      className="h-56 w-full object-cover object-center"
                    />
                  </div>
                </div>

                <p className="text-center font-display italic text-[2.2rem] leading-[1.1] tracking-[-0.04em] text-[#f4dca8] sm:text-[3rem]">
                  {cake.insideMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
