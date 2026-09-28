import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX } from "lucide-react";
import { siteConfig } from "../content";

export default function AmbientAudio({ phase, unlocked, muted, onToggleMute }) {
  const trackRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!unlocked || initialized.current) return;

    initialized.current = true;
    const sound = new Howl({
      src: [siteConfig.audio.ambient],
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
      format: ["mp3"],
      onplayerror: () => {
        sound.once("unlock", () => sound.play());
      },
    });

    trackRef.current = sound;

    try {
      sound.play();
    } catch (error) {
      // browser blocked autoplay; user gesture required
    }

    return () => {
      sound.stop();
      sound.unload();
      trackRef.current = null;
      initialized.current = false;
    };
  }, [unlocked]);

  useEffect(() => {
    if (!initialized.current || !trackRef.current) return;

    const targetVolume = muted ? 0 : phase === "finale" ? 0.32 : 0.18;
    const fadeDuration = phase === "finale" ? 2200 : 1800;

    try {
      if (!trackRef.current.playing() && !muted) {
        trackRef.current.play();
      }
      trackRef.current.fade(trackRef.current.volume(), targetVolume, fadeDuration);
    } catch (error) {
      // safe guard for browser autoplay restrictions
    }
  }, [muted, phase]);

  if (!unlocked) return null;

  return (
    <button
      onClick={onToggleMute}
      className="fixed bottom-24 right-5 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0d111d]/60 text-white/70 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:text-white"
      aria-label={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
