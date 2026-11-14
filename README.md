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
├── backend/                          # Lightweight Express server (for future live NASA APIs)
│   ├── server.js
│   └── package.json
│
├── frontend/                         # React (Vite) - Self-contained Offline Demo App
│   ├── public/
│   │   └── fallback-media/           # Place your 3 downloaded NASA SVS MP4 files here:
│   │       ├── global-temp-anomalies.mp4
│   │       ├── global-co2-plumes.mp4
│   │       └── arctic-sea-ice.mp4
│   ├── src/
│   │   ├── data/
│   │   │   └── tracks.json           # Track config, color mode, audio legend & voice cues
│   │   ├── engine/
│   │   │   ├── frameAnalyzer.js      # Real-time <canvas> RGB pixel & hotspot analyzer
│   │   │   └── soundEngine.js        # Web Audio API C-Minor Pentatonic synthesizer
│   │   ├── components/
│   │   │   └── JukeboxPlayer.jsx     # Accessible UI, keyboard shortcuts & voice narrator
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd earth-jukebox
```

### 2. Install & Start the Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 3. Install & Start the Frontend (Port 5173)
Open a second terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.