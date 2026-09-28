// ============================================================
// CENTRAL CONTENT FILE
// Edit everything in here. You should never need to touch
// component code to update text, photos, or music.
// ============================================================

export const siteConfig = {
  recipientName: "Riya",
  fromName: "Priyanshu",

  // Shown on the entry screen
  entryInstruction: "hold the flame, and make a wish",
  entryHint: "(press and hold)",
  entryTitle: "a universe, for you",
  entrySubtitle: "Riya —",

  // Files go in /public/audio/. Swap these paths for real files.
  audio: {
    ambient: "/audio/vaaroon_vFniuna8.mp3",
    climax: "/audio/vaaroon_vFniuna8.mp3",
    chimeSoft: "/audio/chime-soft.mp3",
    chimeShooting: "/audio/chime-shoot.mp3",
    blowOut: "/audio/blow-out.mp3",
  },

  constellationHint: "drag to explore \u00b7 tap a star",
  finaleUnlockText: "one more star left in the sky...",

  finale: {
    // Fraction of stars that must be opened before the final star appears (0-1)
    unlockThreshold: 0.7,
    wishTitle: "Happy Birthday, Riya",
    wishSubtitle: "make a wish. i already have.",
    letter: [
      "I don't know how to put a year of loving you into words,",
      "so I built you a sky instead.",
      "",
      "Every star here is real. Every one of them is us.",
      "",
      "Happy birthday to the best part of my every day.",
      "I love you, endlessly.",
      "",
      "\u2014 Priyanshu",
    ],
    replayLabel: "wander the sky again",
  },
};

export const portraitPhotos = Array.from(
  { length: 16 },
  (_, index) => `/images/priyanshu-${String(index + 1).padStart(2, "0")}.jpeg`
);

// Loosely groups stars for the connecting-line reveal as she explores.
// "color" is used for the constellation line + label glow.
export const constellations = [
  { id: "first-days", label: "First Days", color: "#ffd1dc", stars: ["star-1", "star-2", "star-3"] },
  { id: "adventures", label: "Adventures", color: "#b8e0ff", stars: ["star-4", "star-5"] },
  { id: "little-things", label: "Little Things", color: "#fff3b8", stars: ["star-6", "star-7"] },
];

// Position is normalized (0-1) and scaled to the pannable canvas at render time.
// size: "sm" | "md" | "lg" — controls glow radius + star brightness.
// special: true marks the one "shy" star that drifts from the cursor.
// isFinalStar: true marks the star that triggers the finale instead of a panel.
export const stars = [
  {
    id: "star-1",
    x: 0.12, y: 0.28,
    size: "lg",
    date: "",
    title: "The day we met",
    image: portraitPhotos[0],
    message: "Teri muskaan ne har subah ko mehka diya, dil ko bhi ek naya safar mila.",
  },
  {
    id: "star-2",
    x: 0.28, y: 0.62,
    size: "md",
    date: "",
    title: "First real date",
    image: portraitPhotos[1],
    message: "Pehli mulaqat mein hi tumne dil ko aise chhoo liya, jaise raat bhi khushboo ban gayi.",
  },
  {
    id: "star-3",
    x: 0.45, y: 0.18,
    size: "sm",
    date: "",
    title: "That 2am phone call",
    image: portraitPhotos[2],
    message: "2 baje ki baatein, 2 dilon ki khamoshi, aur ek aisi dua jo sirf tum ho.",
  },
  {
    id: "star-4",
    x: 0.63, y: 0.42,
    size: "lg",
    date: "",
    title: "Our first trip",
    image: portraitPhotos[3],
    message: "Safar toh sirf manzilon ka naam tha, asli khushi to tumhare saath ka ehsaas tha.",
  },
  {
    id: "star-5",
    x: 0.77, y: 0.68,
    size: "md",
    date: "",
    title: "The hike that nearly killed us",
    image: portraitPhotos[4],
    message: "Tere saath har mushkil bhi khushgawar lagti hai, jaise dua se zyada pyaari si raah.",
  },
  {
    id: "star-6",
    x: 0.2, y: 0.82,
    size: "sm",
    date: "",
    title: "Your terrible puns",
    image: portraitPhotos[5],
    message: "Teri bakwaas bhi teri sabse pyaari adaa hai, bas isi liye dil har baar ruk jaata hai.",
  },
  {
    id: "star-7",
    x: 0.52, y: 0.86,
    size: "sm",
    date: "",
    title: "Sunday mornings",
    image: portraitPhotos[6],
    message: "Har Sunday tere saath bas ek naya sukoon, ek nayi dua, ek naya khwaab hai.",
  },
  {
    id: "star-8",
    x: 0.88, y: 0.25,
    size: "md",
    date: "",
    title: "This one's the last",
    image: portraitPhotos[7],
    message: "Aaj bhi dil kehta hai, tum bina zindagi adhoori hai, aur tum saath ho toh sab poora lagta hai.",
    isFinalStar: true,
  },
];

// Shooting-star surprise lines — short, playful, one-time reveal per session.
export const surprises = [
  "you have the best laugh in any room",
  "i still smile at my phone like an idiot when you text",
  "you make ordinary tuesdays feel like something",
  "i'd choose you in every timeline",
];

// ---- Cake portal ----
// candleCount stars are lit; she taps each flame to blow it out, then
// swipes across the cake to "cut" it, revealing insideMessage.
export const cake = {
  title: "make a wish",
  subtitle: "blow out each candle, then cut the cake",
  candleCount: 5,
  flavor: "red velvet \u00b7 her favorite",
  cutInstruction: "swipe across the cake to cut it",
  insideMessage: "the sweetest year yet is the one starting today.",
};

// ---- Shayari portal ----
// Each entry is a short couplet. "translation" is optional — leave the
// string empty ("") to hide it for a couplet that doesn't need one.
export const shayaris = [
  {
    lines: ["tumse milne se pehle,", "adhoore the hum bhi kisi kahani jaise."],
    translation: "Before I met you, I was like a story left unfinished.",
  },
  {
    lines: ["teri hansi mein woh baat hai,", "jo har udaas shaam ko subah kar de."],
    translation: "Your laugh has the kind of magic that turns every sad evening into morning.",
  },
  {
    lines: ["dil ne kaha tha ek din tum aaogi,", "aaj lagta hai dil kabhi jhootha nahi tha."],
    translation: "My heart once said you'd come one day — turns out it never lied.",
  },
  {
    lines: ["har khushi mein tera zikr hai,", "har khwaab mein tera hi aana hai."],
    translation: "You're mentioned in every joy, you're the one who arrives in every dream.",
  },
  {
    lines: ["zindagi ne bahut kuch diya,", "par sabse khoobsurat tohfa tum ho."],
    translation: "Life has given me a lot, but the most beautiful gift is you.",
  },
];

// ---- Moon Gallery portal ----
// A scattered board of polaroids, separate from the constellation stars —
// for photos that don't need a written memory attached, just a caption.
export const gallery = [
  { id: "g1", image: portraitPhotos[8], caption: "Teri muskaan se har subah mehkaati hai", rotate: -6 },
  { id: "g2", image: portraitPhotos[9], caption: "Dil ko tera saath har lamha sukoon deta hai", rotate: 4 },
  { id: "g3", image: portraitPhotos[10], caption: "Tere bina har safar adhoora sa lagta hai", rotate: -3 },
  { id: "g4", image: portraitPhotos[11], caption: "Humne toh bas ek dusre ko apna banaya hai", rotate: 7 },
  { id: "g5", image: portraitPhotos[12], caption: "Teri hansi mein duniya ki sabse khubsurat dua hai", rotate: -8 },
  { id: "g6", image: portraitPhotos[13], caption: "Mere dil ka sabse pyaara ghar tera saath hai", rotate: 5 },
  { id: "g7", image: portraitPhotos[14], caption: "Har din tere saath ek nayi kahani lagti hai", rotate: -2 },
  { id: "g8", image: portraitPhotos[15], caption: "Tumhi ho jahan, wahan sab kuch sukoon lagta hai", rotate: 3 },
];
