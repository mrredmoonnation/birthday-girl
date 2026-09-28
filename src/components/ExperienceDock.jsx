import { motion } from "framer-motion";
import { Cake, BookHeart, Images } from "lucide-react";
import { siteConfig } from "../content";

const ITEMS = [
  { key: "cake", icon: Cake, label: siteConfig.dock.cakeLabel },
  { key: "shayari", icon: BookHeart, label: siteConfig.dock.shayariLabel },
  { key: "gallery", icon: Images, label: siteConfig.dock.galleryLabel },
];

export default function ExperienceDock({ onOpen }) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 glass rounded-full px-4 py-2.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {ITEMS.map(({ key, icon: Icon, label }) => (
        <motion.button
          key={key}
          onClick={() => onOpen(key)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-full text-white/70 hover:text-white transition-colors"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          aria-label={`Open ${label}`}
        >
          <Icon size={18} />
          <span className="font-body text-[10px] tracking-wide">{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
