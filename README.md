# a universe, for you

A personalized, animated birthday web experience: a draggable night-sky
"constellation" of memories that culminates in a heart-shaped star alignment
and a personal letter.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build a static production version to host anywhere (Netlify, Vercel, a
personal server, etc.):

```bash
npm run build
```

This outputs a `dist/` folder — upload its contents anywhere that serves
static files.

## Making it hers — everything lives in `src/content.js`

You should not need to touch any component code. Open `src/content.js` and:

1. **Names & copy** — edit `siteConfig` (her name, entry text, the finale
   letter).
2. **Photos** — drop your real images into `public/images/` and update the
   `image` path on each star in the `stars` array. Recommended: roughly
   4:3, under ~500KB each, so the panel reveal stays snappy.
3. **Memories** — edit `title`, `date`, and `message` for each star. Add or
   remove stars freely; `x`/`y` are normalized 0–1 positions on the canvas,
   so just nudge them until nothing overlaps awkwardly.
4. **Music** — drop MP3s into `public/audio/` matching the filenames in
   `siteConfig.audio`. If you don't have music yet, the app still works;
   Howler will just silently fail to load those specific files, no visual
   sound is required for any of the tools noted here.
5. **The shy star & final star** — exactly one star should have
   `special: true` (the one that drifts from the cursor) and exactly one
   should have `isFinalStar: true` (the one that launches the finale).
6. **Finale unlock threshold** — `siteConfig.finale.unlockThreshold`
   (0–1) controls what fraction of stars she needs to open before the
   final star appears. Lower it if you have fewer memories.

## The three extra portals

A small dock sits at the bottom of the constellation screen with three icons,
available any time she's exploring the sky:

- **Cake** — she taps out each candle flame, then swipes across the cake to
  cut it, revealing a hidden message inside. Edit candle count, flavor, and
  the message in the `cake` object in `content.js`.
- **Shayari** — a swipeable deck of romantic couplets. Add/edit/remove
  entries in the `shayaris` array; `translation` is optional per entry.
- **Photos** — a scattered, draggable polaroid board (separate from the
  constellation's memory stars — use it for extra photos that don't need a
  written memory attached). Edit the `gallery` array; images go in
  `public/images/` alongside the star photos.

## Structure

```
src/
  content.js              <- ALL editable content lives here
  App.jsx                 <- phase orchestration (entry -> constellation -> finale)
  index.css               <- global theme, star-field background, a11y
  components/
    EntryScreen.jsx        <- tap-hold candle intro
    ConstellationView.jsx  <- pannable/zoomable star map
    Star.jsx                <- single interactive star (incl. shy-star drift)
    StarPanel.jsx           <- glass memory card, condenses out of a star
    ShootingStars.jsx       <- random one-line surprise messages
    CursorDust.jsx          <- canvas particle trail following the pointer
    FinaleSequence.jsx      <- heart alignment + letter reveal + embers
    AmbientAudio.jsx        <- Howler music manager + mute toggle
    ExperienceDock.jsx      <- bottom dock opening the 3 portals below
    CakeMoment.jsx          <- blow-candles + swipe-to-cut cake
    ShayariDeck.jsx         <- swipeable couplet deck
    MoonGallery.jsx         <- draggable scattered polaroid board
```

## Notes

- No photos or music ship in this repo — the app degrades gracefully
  (broken images are hidden, missing audio just doesn't play) so you can
  preview the interactions before adding real assets.
- Respects `prefers-reduced-motion` for the ambient particle/twinkle
  effects.
- Built mobile-first: the candle hold, star drag/tap, and panels all use
  pointer events so touch works identically to mouse.
