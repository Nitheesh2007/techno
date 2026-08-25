// Web Audio API Synthesizer & Multilingual Tamil/English Speech Synthesis Engine

let cachedVoices = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export const getBestVoice = (lang = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  
  if (lang === 'ta' || lang.startsWith('ta')) {
    // Look for dedicated Tamil voices (e.g. Google தமிழ், Microsoft Valluvar, Apple Tamil, etc.)
    const tamilVoice = voices.find(v => 
      v.lang === 'ta-IN' || 
      v.lang === 'ta_IN' || 
      v.lang === 'ta-LK' || 
      v.lang === 'ta-SG' || 
      v.lang === 'ta' || 
      v.name.toLowerCase().includes('tamil') || 
      v.name.toLowerCase().includes('valluvar') ||
      v.lang.toLowerCase().startsWith('ta')
    );
    if (tamilVoice) return tamilVoice;
  }
  
  return voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en')) || voices[0] || null;
};

export const speakVoice = (text, lang = 'en', onEnd) => {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const cleanText = (text || '').replace(/[*_#`•]/g, '').trim();
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = lang === 'ta' ? 0.9 : 1.0;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    
    const selectedVoice = getBestVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis notice:', e);
  }
};

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

  speak(text, lang = 'en', onEnd) {
    if (!this.enabled) return;
    speakVoice(text, lang, onEnd);
  }

  speakTamil(text, onEnd) {
    if (!this.enabled) return;
    speakVoice(text, 'ta', onEnd);
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

      const notes = [523.25, 659.25, 783.99, 1046.50];
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
