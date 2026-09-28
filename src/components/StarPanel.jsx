import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Reveals the message one word at a time, like it's being written in light.
function useTypewriter(text, speed = 28) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return shown;
}

export default function StarPanel({ star, onClose }) {
  const revealed = useTypewriter(star.message, 22);

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="glass shadow-panelGlow relative z-10 w-full max-w-md rounded-3xl p-7 md:p-9"
        initial={{ opacity: 0, scale: 0.3, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.4, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 mb-5">
          <img
            src={star.image}
            alt={star.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <p className="font-display italic text-2xl md:text-3xl leading-relaxed text-white/90 min-h-[3.5rem] text-center">
          {revealed}
          <span className="inline-block w-[2px] h-[1em] bg-white/60 ml-0.5 align-middle animate-pulse" />
        </p>
      </motion.div>
    </motion.div>
  );
}
