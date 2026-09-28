import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import EntryScreen from "./components/EntryScreen";
import ConstellationView from "./components/ConstellationView";
import FinaleSequence from "./components/FinaleSequence";
import AmbientAudio from "./components/AmbientAudio";
import { stars } from "./content";

const PHASES = {
  ENTRY: "entry",
  CONSTELLATION: "constellation",
  FINALE: "finale",
};

export default function App() {
  const [phase, setPhase] = useState(PHASES.ENTRY);
  const [visitedStars, setVisitedStars] = useState(() => new Set());
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const setViewportHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);
    window.visualViewport?.addEventListener("resize", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
      window.visualViewport?.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  const handleEnter = useCallback(() => {
    setAudioUnlocked(true);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }

    setPhase(PHASES.CONSTELLATION);
  }, []);

  const handleStarVisited = useCallback((starId) => {
    setVisitedStars((prev) => {
      if (prev.has(starId)) return prev;
      const next = new Set(prev);
      next.add(starId);
      return next;
    });
  }, []);

  const handleFinaleTrigger = useCallback(() => {
    setPhase(PHASES.FINALE);
  }, []);

  const handleReplay = useCallback(() => {
    setPhase(PHASES.CONSTELLATION);
  }, []);

  const visitedRatio = stars.length ? visitedStars.size / stars.length : 0;

  return (
    <div className="relative h-[var(--app-height)] w-full overflow-hidden bg-[#05050f] text-white antialiased selection:bg-[#f7d5b7]/30">
      <AmbientAudio phase={phase} unlocked={audioUnlocked} muted={muted} onToggleMute={() => setMuted((m) => !m)} />

      <AnimatePresence mode="wait">
        {phase === PHASES.ENTRY && <EntryScreen key="entry" onEnter={handleEnter} />}

        {phase === PHASES.CONSTELLATION && (
          <ConstellationView
            key="constellation"
            visitedStars={visitedStars}
            visitedRatio={visitedRatio}
            onStarVisited={handleStarVisited}
            onFinaleTrigger={handleFinaleTrigger}
          />
        )}

        {phase === PHASES.FINALE && (
          <FinaleSequence key="finale" visitedStars={visitedStars} onReplay={handleReplay} />
        )}
      </AnimatePresence>
    </div>
  );
}
