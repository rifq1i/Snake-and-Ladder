/**
 * =========================================================================
 * MESIN AUDIO SINTETIS & MULTI-TRACK BGM SOUNDTRACK (WEB AUDIO API MURNI)
 * =========================================================================
 */
const SoundEngine = (() => {
  let ctx = null;
  let muted = false;
  let bgmPlaying = false;
  let currentTrackIndex = 0;
  let bgmVolume = 0.7;
  let sfxVolume = 0.85;
  let stepIndex = 0;
  let sequencerTimer = null;
  let autoStartedOnce = false;

  // Frekuensi Tangga Nada untuk komposisi BGM
  const N = {
    _: 0,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, C6: 1046.50
  };

  // 3 Lagu Soundtrack (BGM) Multi-Track 32-Step yang Ceria & Asik
  const BGM_TRACKS = [
    {
      name: 'Arcade Nusantara',
      stepMs: 135, // ~111 BPM Upbeat Party
      leadWave: 'triangle',
      bassWave: 'sine',
      lead: [
        N.C5, N.E5, N.G5, N.E5, N.A5, N.G5, N.E5, N.C5,
        N.D5, N.F5, N.A5, N.F5, N.G5, N.E5, N.D5, N._,
        N.C5, N.E5, N.G5, N.C6, N.A5, N.G5, N.E5, N.C5,
        N.D5, N.E5, N.F5, N.D5, N.C5, N.G4, N.C5, N._
      ],
      bass: [
        N.C3, N._, N.G3, N._, N.A3, N._, N.E3, N._,
        N.F3, N._, N.C3, N._, N.G3, N._, N.G3, N.D3,
        N.C3, N._, N.G3, N._, N.A3, N._, N.E3, N._,
        N.F3, N._, N.G3, N._, N.C3, N.G3, N.C3, N._
      ],
      arp: [
        N.E4, N.G4, N.C5, N.G4, N.C4, N.E4, N.A4, N.E4,
        N.F4, N.A4, N.C5, N.A4, N.D4, N.G4, N.B4, N.G4,
        N.E4, N.G4, N.C5, N.G4, N.C4, N.E4, N.A4, N.E4,
        N.F4, N.A4, N.D4, N.B4, N.E4, N.G4, N.C5, N._
      ],
      drums: [
        'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
        'K', 'H', 'S', 'H', 'K', 'S', 'K', 'S',
        'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
        'K', 'H', 'S', 'H', 'K', 'S', 'K', 'H'
      ]
    },
    {
      name: 'Petualangan 8-Bit',
      stepMs: 125, // ~120 BPM Funky Chiptune
      leadWave: 'square',
      bassWave: 'triangle',
      lead: [
        N.G5, N._, N.E5, N.C5, N.D5, N.E5, N.G5, N._,
        N.A5, N.G5, N.E5, N.D5, N.C5, N.D5, N.E5, N._,
        N.G5, N.A5, N.C6, N.A5, N.G5, N.E5, N.C5, N.E5,
        N.D5, N.F5, N.E5, N.D5, N.C5, N._, N.C5, N._
      ],
      bass: [
        N.C3, N.C3, N.E3, N.G3, N.A3, N.A3, N.G3, N.E3,
        N.F3, N.F3, N.A3, N.C4, N.G3, N.G3, N.D3, N.G3,
        N.C3, N.C3, N.E3, N.G3, N.A3, N.A3, N.E3, N.G3,
        N.F3, N.D3, N.G3, N.G3, N.C3, N.G3, N.C3, N._
      ],
      arp: [
        N.C5, N.G4, N.E4, N.G4, N.A4, N.E4, N.C4, N.E4,
        N.F4, N.C5, N.A4, N.C5, N.G4, N.B4, N.D5, N.B4,
        N.C5, N.G4, N.E4, N.G4, N.A4, N.E4, N.C4, N.E4,
        N.F4, N.A4, N.G4, N.B4, N.C5, N.G4, N.C5, N._
      ],
      drums: [
        'K', 'H', 'S', 'K', 'H', 'K', 'S', 'H',
        'K', 'H', 'S', 'K', 'H', 'S', 'K', 'S',
        'K', 'H', 'S', 'K', 'H', 'K', 'S', 'H',
        'K', 'S', 'K', 'S', 'K', 'H', 'S', 'H'
      ]
    },
    {
      name: 'Semangat Kuis',
      stepMs: 130, // ~115 BPM Game Show Bounce
      leadWave: 'triangle',
      bassWave: 'triangle',
      lead: [
        N.F5, N.G5, N.A5, N.C6, N._, N.A5, N.G5, N.F5,
        N.E5, N.G5, N.C6, N.G5, N.E5, N.C5, N.D5, N.E5,
        N.F5, N.G5, N.A5, N.C6, N.D5, N.F5, N.A5, N.G5,
        N.E5, N.C5, N.D5, N.E5, N.F5, N._, N.F5, N._
      ],
      bass: [
        N.F3, N._, N.C3, N.F3, N.D3, N._, N.A3, N._,
        N.C3, N._, N.G3, N.C3, N.B3, N.Bb4, N.A3, N.G3,
        N.F3, N._, N.C3, N.F3, N.G3, N._, N.D3, N._,
        N.C3, N.E3, N.G3, N.C4, N.F3, N.C3, N.F3, N._
      ],
      arp: [
        N.A4, N.C5, N.F5, N.C5, N.A4, N.D5, N.F5, N.D5,
        N.G4, N.C5, N.E5, N.C5, N.G4, N.Bb4, N.E5, N.C5,
        N.A4, N.C5, N.F5, N.C5, N.B4, N.D5, N.G5, N.D5,
        N.G4, N.Bb4, N.C5, N.E5, N.A4, N.C5, N.F5, N._
      ],
      drums: [
        'K', 'H', 'K', 'S', 'K', 'H', 'S', 'H',
        'K', 'H', 'K', 'S', 'K', 'S', 'K', 'S',
        'K', 'H', 'K', 'S', 'K', 'H', 'S', 'H',
        'K', 'S', 'H', 'S', 'K', 'K', 'S', 'H'
      ]
    }
  ];

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function playNote(freq, type, duration, delay = 0, gainVal = 0.14, isBgm = false) {
    if (muted || !freq) return;
    const channelVol = isBgm ? bgmVolume : sfxVolume;
    if (channelVol <= 0.01) return;

    try {
      ensureContext();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);

      const finalGain = Math.max(0.001, gainVal * channelVol);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(finalGain, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (e) {}
  }

  // Sintesis Ketukan Drum (Kick, Snare, Hi-Hat) untuk BGM
  function playDrumHit(type) {
    if (muted || bgmVolume <= 0.01) return;
    try {
      ensureContext();
      if (!ctx) return;
      const t0 = ctx.currentTime;

      if (type === 'K') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, t0);
        osc.frequency.exponentialRampToValueAtTime(38, t0 + 0.09);
        gain.gain.setValueAtTime(0.18 * bgmVolume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.11);
      } else if (type === 'S') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t0);
        osc.frequency.exponentialRampToValueAtTime(95, t0 + 0.07);
        gain.gain.setValueAtTime(0.1 * bgmVolume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.09);
      } else if (type === 'H') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1850, t0);
        gain.gain.setValueAtTime(0.025 * bgmVolume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.028);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.035);
      }
    } catch (e) {}
  }

  function tickSequencer() {
    if (!bgmPlaying || muted) return;
    const track = BGM_TRACKS[currentTrackIndex] || BGM_TRACKS[0];
    const idx = stepIndex % track.lead.length;

    const leadNote = track.lead[idx];
    const bassNote = track.bass[idx];
    const arpNote = track.arp[idx];
    const drumHit = track.drums[idx];

    const leadGain = track.leadWave === 'square' ? 0.048 : 0.1;
    if (leadNote) playNote(leadNote, track.leadWave, 0.12, 0, leadGain, true);
    if (bassNote) playNote(bassNote, track.bassWave, 0.15, 0, 0.11, true);
    if (arpNote) playNote(arpNote, 'sine', 0.09, 0, 0.045, true);
    if (drumHit) playDrumHit(drumHit);

    stepIndex = (stepIndex + 1) % track.lead.length;
  }

  function restartSequencerTimer() {
    clearInterval(sequencerTimer);
    if (!bgmPlaying) return;
    const track = BGM_TRACKS[currentTrackIndex] || BGM_TRACKS[0];
    sequencerTimer = setInterval(tickSequencer, track.stepMs);
  }

  return {
    isMuted: () => muted,
    isBgmPlaying: () => bgmPlaying && !muted,
    getTrackIndex: () => currentTrackIndex,
    getTrackName: () => BGM_TRACKS[currentTrackIndex].name,
    startBgm: () => {
      ensureContext();
      bgmPlaying = true;
      muted = false;
      restartSequencerTimer();
    },
    stopBgm: () => {
      bgmPlaying = false;
      clearInterval(sequencerTimer);
    },
    toggleBgm: () => {
      if (bgmPlaying && !muted) {
        bgmPlaying = false;
        clearInterval(sequencerTimer);
      } else {
        ensureContext();
        muted = false;
        bgmPlaying = true;
        restartSequencerTimer();
      }
      return bgmPlaying && !muted;
    },
    tryAutoStartBgm: () => {
      if (autoStartedOnce) return false;
      autoStartedOnce = true;
      ensureContext();
      bgmPlaying = true;
      restartSequencerTimer();
      return true;
    },
    setTrack: (idx) => {
      currentTrackIndex = Math.max(0, Math.min(BGM_TRACKS.length - 1, Number(idx) || 0));
      stepIndex = 0;
      if (bgmPlaying) restartSequencerTimer();
      return BGM_TRACKS[currentTrackIndex].name;
    },
    nextTrack: () => {
      currentTrackIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
      stepIndex = 0;
      if (!bgmPlaying) bgmPlaying = true;
      restartSequencerTimer();
      return currentTrackIndex;
    },
    setBgmVolume: (pct) => {
      bgmVolume = Math.max(0, Math.min(1, pct / 100));
    },
    setSfxVolume: (pct) => {
      sfxVolume = Math.max(0, Math.min(1, pct / 100));
    },
    toggleMuteAll: () => {
      muted = !muted;
      return muted;
    },
    roll: () => {
      const freqs = [260, 340, 420, 310, 480, 560, 390, 520];
      freqs.forEach((f, i) => playNote(f, 'triangle', 0.065, i * 0.075, 0.14));
    },
    step: () => {
      playNote(523.25, 'sine', 0.085, 0, 0.14);
    },
    ladder: () => {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, idx) => {
        playNote(f, 'triangle', 0.16, idx * 0.08, 0.16);
      });
    },
    snake: () => {
      [523.25, 440, 349.23, 261.63, 196.0].forEach((f, idx) => {
        playNote(f, 'sawtooth', 0.18, idx * 0.09, 0.11);
      });
    },
    event: () => {
      [659.25, 880, 1174.66, 1567.98].forEach((f, idx) => {
        playNote(f, 'sine', 0.2, idx * 0.07, 0.15);
      });
    },
    correct: () => {
      playNote(587.33, 'triangle', 0.14, 0, 0.18);
      playNote(880, 'triangle', 0.28, 0.11, 0.2);
    },
    wrong: () => {
      playNote(277.18, 'sawtooth', 0.18, 0, 0.13);
      playNote(207.65, 'sawtooth', 0.3, 0.14, 0.13);
    },
    win: () => {
      const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
      const delays = [0, 0.11, 0.22, 0.33, 0.5, 0.62, 0.76];
      melody.forEach((f, i) => playNote(f, 'triangle', 0.25, delays[i], 0.2));
    }
  };
})();