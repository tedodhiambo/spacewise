# Earth Jukebox

Hear NASA's Earth Information Center (EIC) visualizations. Earth Jukebox pairs EIC visual frames with sonifications so that blind and low-vision users, and anyone else, can experience Earth science through sound.

Built for the NASA EIC "Earth Jukebox" hackathon challenge, in JavaScript: a Node backend and a React frontend.

## The idea

1. **One sonification engine in plain JavaScript** (`src/sonify.js`) turns an image into audio. The React app imports this same file to play sound live in the browser, and the Node server and CLI use it to produce WAV files, so both sound alike.
2. **A React jukebox** where you choose a visualization, read a text description, and play its soundscape, with a moving playhead. Keyboard and screen-reader friendly.
3. **A Node server and CLI** that serve frames, render audio, and let you pre-render a gallery of tracks.

## Repo layout

```
backend
frontend
README.md
```

### Build
bun run dev

## Data and credits

Visualizations and data: NASA Earth Information Center. Add exact sources for each visual in `docs/sources.md`.

earth-jukebox/
├── backend/                     # Node.js + Express (Thin proxy & metadata API)
│   ├── data/
│   │   └── tracks.json          # Curated EIC track list (videos, milestones, audio rules)
│   ├── routes/
│   │   └── nasaProxy.js         # Fetches NASA EIC media/APIs to avoid browser CORS blocks
│   ├── server.js                # Express entry point
│   └── package.json
│
├── frontend/                    # React (Vite)
│   ├── public/
│   │   └── fallback-media/      # Local copies of 2–3 NASA EIC videos/frames for offline demo safety
│   ├── src/
│   │   ├── components/
│   │   │   ├── JukeboxPlayer.jsx    # Main playback UI, track selector, and keyboard shortcuts
│   │   │   ├── EicVisualizer.jsx    # Renders NASA video/frames onto HTML5 <canvas>
│   │   │   ├── AudioLegendModal.jsx # Accessible "Press L for Audio Guide" intro
│   │   │   └── LiveNarration.jsx    # Hidden aria-live region + SpeechSynthesis controller
│   │   ├── engine/
│   │   │   ├── frameAnalyzer.js     # Reads <canvas> RGBA pixels & detects heat/CO2 hotspots
│   │   │   └── soundEngine.js       # Web Audio API synth (oscillators, stereo panner, scales)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md                    # Setup instructions, demo script, and accessibility guide
