const SCALE_FREQS = [
  130.81, 155.56, 174.61, 196.00, 233.08, // C3 - Bb3
  261.63, 311.13, 349.23, 392.00, 466.16, // C4 - Bb4
  523.25, 622.25, 698.46, 783.99          // C5 - G5
];

class EarthSoundEngine {
  constructor() {
    this.ctx = null;
    this.leadOsc = null;
    this.subOsc = null;
    this.gain = null;
    this.panner = null;
    this.isRunning = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Primary melody oscillator
    this.leadOsc = this.ctx.createOscillator();
    this.leadOsc.type = 'triangle';
    this.leadOsc.frequency.value = SCALE_FREQS;

    // Warm sub-bass harmonic layer (one octave lower)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = SCALE_FREQS / 2;

    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;

    this.panner = this.ctx.createStereoPanner();

    this.leadOsc.connect(this.gain);
    this.subOsc.connect(this.gain);
    this.gain.connect(this.panner);
    this.panner.connect(this.ctx.destination);

    this.leadOsc.start();
    this.subOsc.start();
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.isRunning = true;
    this.gain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 0.1);
  }

  stop() {
    if (!this.ctx) return;
    this.isRunning = false;
    this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
  }

  update(intensity, pan) {
    if (!this.isRunning || !this.ctx) return;

    const noteIndex = Math.min(
      Math.floor(intensity * SCALE_FREQS.length),
      SCALE_FREQS.length - 1
    );
    const targetFreq = SCALE_FREQS[noteIndex];

    this.leadOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    this.subOsc.frequency.setTargetAtTime(targetFreq / 2, this.ctx.currentTime, 0.08);
    this.panner.pan.setTargetAtTime(pan, this.ctx.currentTime, 0.1);
    this.gain.gain.setTargetAtTime(0.14 + intensity * 0.22, this.ctx.currentTime, 0.08);
  }
}

export const soundEngine = new EarthSoundEngine();
