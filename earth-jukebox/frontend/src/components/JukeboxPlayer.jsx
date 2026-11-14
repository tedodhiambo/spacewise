import { useEffect, useRef, useState, useCallback } from 'react';
import tracks from '../data/tracks.json';
import { analyzeEicFrame } from '../engine/frameAnalyzer';
import { soundEngine } from '../engine/soundEngine';

export default function JukeboxPlayer() {
  const [activeTrack, setActiveTrack] = useState(tracks);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusText, setStatusText] = useState('Ready. Press Space to play, or 1, 2, 3 to switch tracks.');
  const [metrics, setMetrics] = useState({ intensity: 0, pan: 0 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const spokenMilestonesRef = useRef(new Set());

  // Accessible voice synthesizer
  const speak = useCallback((text) => {
    setStatusText(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Main real-time video -> canvas -> sound loop
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const { intensity, pan } = analyzeEicFrame(
      ctx,
      canvas.width,
      canvas.height,
      activeTrack.mode
    );

    soundEngine.update(intensity, pan);
    setMetrics({ intensity, pan });

    // Trigger timestamped voice milestones once per playback
    const currentSec = Math.floor(video.currentTime);
    for (const m of activeTrack.milestones) {
      if (currentSec === m.timeSec && !spokenMilestonesRef.current.has(m.timeSec)) {
        spokenMilestonesRef.current.add(m.timeSec);
        speak(m.text);
      }
    }

    rafRef.current = requestAnimationFrame(processFrame);
  }, [activeTrack, speak]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        soundEngine.start();
        setIsPlaying(true);
        speak(`Playing ${activeTrack.title}`);
        rafRef.current = requestAnimationFrame(processFrame);
      } catch (err) {
        setStatusText('Video file missing in public/fallback-media/. Check README.');
      }
    } else {
      video.pause();
      soundEngine.stop();
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
      speak('Paused');
    }
  }, [activeTrack, processFrame, speak]);

  const selectTrack = useCallback((track) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    soundEngine.stop();
    cancelAnimationFrame(rafRef.current);
    spokenMilestonesRef.current.clear();
    setIsPlaying(false);
    setActiveTrack(track);
    speak(`Selected track ${track.keyShortcut}: ${track.title}. Press L for audio legend, or Space to play.`);
  }, [speak]);

  // Global keyboard navigation for blind and low-vision users
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'l') {
        speak(activeTrack.audioLegend);
      } else if (['1', '2', '3'].includes(e.key)) {
        const found = tracks.find((t) => t.keyShortcut === e.key);
        if (found) selectTrack(found);
      } else if (e.code === 'ArrowRight' && videoRef.current) {
        videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 3);
      } else if (e.code === 'ArrowLeft' && videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTrack, selectTrack, speak, togglePlay]);

  return (
    <div className="jukebox-container">
      <header>
        <h1>NASA Earth Jukebox</h1>
        <p className="subtitle">Multi-Sensory Earth Information Center Sonification</p>
      </header>

      {/* Screen-reader live region */}
      <div className="status-banner" role="status" aria-live="polite">
        <strong>Voice Status:</strong> {statusText}
      </div>

      {/* Track Selector Buttons */}
      <nav aria-label="Climate Tracks" className="track-list">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => selectTrack(track)}
            aria-pressed={activeTrack.id === track.id}
            className={activeTrack.id === track.id ? 'track-btn active' : 'track-btn'}
          >
            [{track.keyShortcut}] {track.title}
          </button>
        ))}
      </nav>

      {/* Visual Frame & Hidden Sampler Canvas */}
      <div className="visualizer-box">
        <video
          ref={videoRef}
          src={activeTrack.videoUrl}
          loop
          muted
          playsInline
          className="eic-video"
          aria-label={activeTrack.title}
        />
        <canvas ref={canvasRef} width={320} height={180} style={{ display: 'none' }} />
      </div>

      {/* Primary Controls */}
      <div className="controls">
        <button onClick={togglePlay} className="primary-btn">
          {isPlaying ? 'Pause Track (Space)' : 'Play Track (Space)'}
        </button>
        <button onClick={() => speak(activeTrack.audioLegend)} className="secondary-btn">
          Hear Audio Legend (L)
        </button>
      </div>

      {/* Real-time Audio Telemetry Readout */}
      <div className="telemetry" aria-hidden="true">
        <span>Signal Intensity: {Math.round(metrics.intensity * 100)}%</span>
        <span>Stereo Pan: {metrics.pan < -0.15 ? 'West (Left)' : metrics.pan > 0.15 ? 'East (Right)' : 'Global Center'}</span>
      </div>
    </div>
  );
}
