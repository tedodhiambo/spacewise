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

## License

MIT (add a LICENSE file when you push)
