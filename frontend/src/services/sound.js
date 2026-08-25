// Web Audio API Synthesizer - Zero external audio file dependencies

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playBeep(freq = 880, duration = 0.08) {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (index * 0.08));
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + (index * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (index * 0.08) + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + (index * 0.08));
        osc.stop(this.ctx.currentTime + (index * 0.08) + 0.35);
      });
    } catch {}
  }

  playTimerAlert() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const beeps = [880, 880, 1174.66];
      beeps.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.15));
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + (idx * 0.15));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.15) + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + (idx * 0.15));
        osc.stop(this.ctx.currentTime + (idx * 0.15) + 0.14);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();
