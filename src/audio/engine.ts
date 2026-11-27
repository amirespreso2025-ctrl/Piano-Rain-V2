// @ts-nocheck
/* eslint-disable */
import { BASSES, KICKS, PADS, VOICES } from "./instruments";

export function createAudioContext() {
  const d = window.AudioContext ?? window.webkitAudioContext;
  if (!d) throw new Error("Web Audio is not supported in this browser.");
  try {
    return new d({ latencyHint: "balanced" });
  } catch {
    return new d();
  }
}

export function midiToFreq(d) {
  return 440 * Math.pow(2, (d - 69) / 12);
}

export async function decodeAudio(d) {
  const i = createAudioContext();
  try {
    return await i.decodeAudioData(d.slice(0));
  } finally {
    i.close().catch(() => {});
  }
}

export class AudioEngine {
  ctx;
  startTime;
  track;
  master;
  compressor;
  musicBus;
  synthBus;
  fxBus;
  delay;
  delayFeedback;
  delayDamp;
  noise;
  bufferSource;
  gate;
  eventIndex = 0;
  muted;
  volume;
  closed = !1;
  musicStopped = !1;
  activeVoices = 0;
  constructor(i, u) {
    ((this.track = i),
      (this.ctx = createAudioContext()),
      (this.muted = u.muted),
      (this.volume = u.volume),
      (this.startTime = this.ctx.currentTime + u.leadIn + 0.08),
      (this.compressor = this.ctx.createDynamicsCompressor()),
      (this.compressor.threshold.value = -14),
      (this.compressor.knee.value = 24),
      (this.compressor.ratio.value = 3.5),
      (this.compressor.attack.value = 0.008),
      (this.compressor.release.value = 0.25),
      (this.master = this.ctx.createGain()),
      (this.master.gain.value = this.muted
        ? 0
        : Math.pow(this.volume, 1.15) * 0.85),
      (this.musicBus = this.ctx.createGain()),
      (this.musicBus.gain.value = 0.9),
      (this.synthBus = this.ctx.createGain()),
      (this.synthBus.gain.value = 0.85),
      (this.fxBus = this.ctx.createGain()),
      (this.fxBus.gain.value = 0.8),
      (this.delay = this.ctx.createDelay(1)),
      (this.delay.delayTime.value = i.fx ? i.fx.d : 0.28),
      (this.delayFeedback = this.ctx.createGain()),
      (this.delayFeedback.gain.value = i.fx ? i.fx.fb : 0.16),
      (this.delayDamp = this.ctx.createBiquadFilter()),
      (this.delayDamp.type = "lowpass"),
      (this.delayDamp.frequency.value = i.fx ? i.fx.damp : 1750));
    const o = this.ctx.createGain();
    ((o.gain.value = i.fx ? i.fx.wet : 0.14),
      this.musicBus.connect(this.compressor),
      this.synthBus.connect(this.compressor),
      this.synthBus.connect(this.delay),
      this.delay.connect(this.delayDamp),
      this.delayDamp.connect(this.delayFeedback),
      this.delayFeedback.connect(this.delay),
      this.delayDamp.connect(o),
      o.connect(this.compressor),
      this.fxBus.connect(this.compressor),
      this.compressor.connect(this.master),
      this.master.connect(this.ctx.destination),
      (this.noise = this.createNoiseBuffer()),
      i.kind === "uploaded" &&
        i.buffer &&
        ((this.bufferSource = this.ctx.createBufferSource()),
        (this.bufferSource.buffer = i.buffer),
        (this.gate = this.ctx.createGain()),
        (this.gate.gain.value = 1),
        this.bufferSource.connect(this.gate).connect(this.musicBus),
        this.bufferSource.start(this.startTime, i.startOffset ?? 0)),
      this.ctx.resume().catch(() => {}));
  }
  get startAt() {
    return this.startTime;
  }
  time() {
    return this.ctx.currentTime - this.startTime;
  }
  async unlock() {
    if (!this.closed)
      try {
        this.ctx.state === "suspended" && (await this.ctx.resume());
      } catch {}
  }
  setMuted(i) {
    ((this.muted = i), this.applyMaster());
  }
  setVolume(i) {
    ((this.volume = Math.max(0, Math.min(1, i))), this.applyMaster());
  }
  applyMaster() {
    if (this.closed) return;
    const i = this.muted ? 0 : Math.pow(this.volume, 1.15) * 0.85;
    this.master.gain.setTargetAtTime(i, this.ctx.currentTime, 0.025);
  }
  tick() {
    if (this.closed || this.musicStopped) return;
    const i = this.track.synth;
    if (!i || i.length === 0) return;
    const u = this.time() + 0.4;
    for (; this.eventIndex < i.length;) {
      const o = i[this.eventIndex];
      if (o.t > u) break;
      (this.eventIndex++, this.scheduleEvent(o));
    }
  }
  scheduleEvent(i) {
    const u = Math.max(this.ctx.currentTime + 0.012, this.startTime + i.t);
    switch (i.type) {
      case "piano":
        this.piano(i.midi, u, i.dur, i.vel, this.synthBus);
        break;
      case "arp":
        this.voice(i.inst, i.midi, u, i.dur, i.vel, this.synthBus);
        break;
      case "pad":
        this.pad(i.midis, u, i.dur, i.vel, i.k);
        break;
      case "bass":
        this.bass(i.midi, u, i.dur, i.vel, i.k);
        break;
      case "kick":
        this.kick(u, i.vel, i.k);
        break;
      case "hat":
        this.hat(u, i.vel, i.k, i.f);
        break;
      case "snare":
        this.snare(u, i.vel);
        break;
      case "clap":
        this.clap(u, i.vel);
        break;
      case "rim":
        this.rim(u, i.vel);
        break;
      case "tom":
        this.tom(u, i.vel, i.f);
        break;
    }
  }
  createNoiseBuffer() {
    const i = Math.max(1, Math.floor(this.ctx.sampleRate * 0.35)),
      u = this.ctx.createBuffer(1, i, this.ctx.sampleRate),
      o = u.getChannelData(0);
    let f = 0;
    for (let h = 0; h < i; h++) {
      const g = Math.random() * 2 - 1;
      ((f = (f + 0.25 * g) / 1.25), (o[h] = f * 0.85));
    }
    return u;
  }
  envelope(i, u, o, f) {
    const h = this.ctx.createGain();
    return (
      h.gain.setValueAtTime(1e-4, i),
      h.gain.linearRampToValueAtTime(Math.max(2e-4, f), i + u),
      h.gain.exponentialRampToValueAtTime(1e-4, i + Math.max(u + 0.05, o)),
      h
    );
  }
  piano(i, u, o, f, h) {
    if (this.activeVoices > 16) return;
    this.activeVoices++;
    const g = Math.max(this.ctx.currentTime + 0.01, u),
      S = midiToFreq(i),
      m = this.ctx.createBiquadFilter();
    ((m.type = "lowpass"),
      m.frequency.setValueAtTime(Math.min(5200, 2200 + S * 1.9), g),
      (m.Q.value = 0.35));
    const b = this.envelope(g, 0.012, o, f),
      j = this.ctx.createOscillator();
    ((j.type = "triangle"), (j.frequency.value = S));
    const L = this.ctx.createOscillator();
    ((L.type = "sine"), (L.frequency.value = S * 2));
    const D = this.ctx.createGain();
    ((D.gain.value = 0.2),
      j.connect(m),
      L.connect(D).connect(m),
      m.connect(b).connect(h));
    const X = g + Math.max(0.35, o) + 0.06;
    ((j.onended = () => {
      ((this.activeVoices = Math.max(0, this.activeVoices - 1)),
        j.disconnect(),
        L.disconnect(),
        D.disconnect(),
        m.disconnect(),
        b.disconnect());
    }),
      j.start(g),
      L.start(g),
      j.stop(X),
      L.stop(X));
  }
  pad(i, u, o, f, h) {
    const g = PADS[h] || PADS.warm,
      S = Math.max(this.ctx.currentTime + 0.01, u),
      m = this.ctx.createBiquadFilter();
    ((m.type = "lowpass"),
      m.frequency.setValueAtTime(g.c0, S),
      g.c1 &&
        m.frequency.exponentialRampToValueAtTime(
          g.c1,
          S + Math.max(0.2, o * 0.7),
        ));
    const b = this.ctx.createGain(),
      j = i.length,
      L = (f * g.m) / Math.max(2, j * 0.8),
      D = Math.min(g.att, o * 0.35);
    (b.gain.setValueAtTime(1e-4, S),
      b.gain.linearRampToValueAtTime(L, S + D),
      b.gain.setValueAtTime(L, S + Math.max(D, o * 0.72)),
      b.gain.exponentialRampToValueAtTime(1e-4, S + o),
      m.connect(b).connect(this.synthBus),
      (g.up ? i.concat(i.map((X) => X + 12)) : i).forEach((X, B) => {
        const U = this.ctx.createOscillator();
        if (
          ((U.type = g.t[B % g.t.length]),
          (U.frequency.value = midiToFreq(X)),
          (U.detune.value = ((B % j) - 1.5) * g.d),
          B >= j)
        ) {
          const V = this.ctx.createGain();
          ((V.gain.value = 0.4), U.connect(V).connect(m));
        } else U.connect(m);
        (B === 0 &&
          (U.onended = () => {
            (m.disconnect(), b.disconnect());
          }),
          U.start(S),
          U.stop(S + o + 0.08));
      }));
  }
  bass(i, u, o, f, h) {
    const g = BASSES[h] || BASSES.sine,
      S = Math.max(this.ctx.currentTime + 0.01, u),
      m = midiToFreq(i),
      b = this.ctx.createOscillator();
    ((b.type = g.a),
      b.frequency.setValueAtTime(g.g ? m * g.g : m, S),
      g.g && b.frequency.exponentialRampToValueAtTime(m, S + 0.07));
    const j = this.ctx.createOscillator();
    ((j.type = g.b), (j.frequency.value = m / 2));
    const L = this.ctx.createGain();
    L.gain.value = g.bg;
    const D = this.ctx.createBiquadFilter();
    ((D.type = "lowpass"),
      D.frequency.setValueAtTime(g.c0, S),
      g.c1 !== g.c0 &&
        D.frequency.exponentialRampToValueAtTime(
          g.c1,
          S + Math.min(0.3, o * g.dm),
        ));
    const X = this.envelope(S, g.att, o * g.dm, f * g.vm);
    (b.connect(D),
      j.connect(L).connect(D),
      D.connect(X).connect(this.synthBus),
      (b.onended = () => {
        (b.disconnect(),
          j.disconnect(),
          L.disconnect(),
          D.disconnect(),
          X.disconnect());
      }));
    const B = S + o * g.dm + 0.1;
    (b.start(S), j.start(S), b.stop(B), j.stop(B));
  }
  kick(i, u, o) {
    const f = KICKS[o] || KICKS.soft,
      h = Math.max(this.ctx.currentTime + 0.01, i),
      g = this.ctx.createOscillator();
    ((g.type = "sine"),
      g.frequency.setValueAtTime(f.f0, h),
      g.frequency.exponentialRampToValueAtTime(f.f1, h + f.tf));
    const S = this.ctx.createGain();
    (S.gain.setValueAtTime(1e-4, h),
      S.gain.linearRampToValueAtTime(u * f.m, h + 0.008),
      S.gain.exponentialRampToValueAtTime(1e-4, h + f.dec),
      g.connect(S).connect(this.synthBus),
      (g.onended = () => {
        (g.disconnect(), S.disconnect());
      }),
      g.start(h),
      g.stop(h + f.dec + 0.03));
  }
  noiseHit(i, u, o, f, h, g, S, m) {
    const b = Math.max(this.ctx.currentTime + 0.01, i),
      j = this.ctx.createBufferSource();
    j.buffer = this.noise;
    const L = this.ctx.createBiquadFilter();
    ((L.type = o), (L.frequency.value = f), (L.Q.value = h));
    const D = this.ctx.createGain();
    (D.gain.setValueAtTime(1e-4, b),
      D.gain.linearRampToValueAtTime(Math.max(2e-4, u), b + g),
      D.gain.exponentialRampToValueAtTime(1e-4, b + g + S),
      j.connect(L).connect(D).connect(this.synthBus),
      (j.onended = () => {
        (j.disconnect(), L.disconnect(), D.disconnect());
      }),
      j.start(b, m || 0),
      j.stop(b + g + S + 0.03));
  }
  hat(i, u, o, f) {
    switch (o) {
      case "open":
        return this.noiseHit(i, u * 0.8, "highpass", 6200, 0.7, 0.004, 0.2);
      case "shaker":
        return this.noiseHit(
          i,
          u * 1.1,
          "bandpass",
          5200,
          0.7,
          0.012,
          0.085,
          Math.random() * 0.1,
        );
      case "rain":
        return this.noiseHit(
          i,
          u * 1.6,
          "bandpass",
          f || 6e3,
          2.5,
          0.002,
          0.035,
          Math.random() * 0.1,
        );
      default:
        return this.noiseHit(i, u * 0.75, "bandpass", 6800, 1.1, 0.004, 0.055);
    }
  }
  snare(i, u) {
    this.noiseHit(i, u * 1.2, "bandpass", 1900, 0.8, 0.002, 0.15);
    const o = Math.max(this.ctx.currentTime + 0.01, i),
      f = this.ctx.createOscillator();
    ((f.type = "triangle"),
      f.frequency.setValueAtTime(210, o),
      f.frequency.exponentialRampToValueAtTime(130, o + 0.08));
    const h = this.ctx.createGain();
    (h.gain.setValueAtTime(1e-4, o),
      h.gain.linearRampToValueAtTime(u * 0.8, o + 0.003),
      h.gain.exponentialRampToValueAtTime(1e-4, o + 0.12),
      f.connect(h).connect(this.synthBus),
      (f.onended = () => {
        (f.disconnect(), h.disconnect());
      }),
      f.start(o),
      f.stop(o + 0.15));
  }
  clap(i, u) {
    ([0, 0.012, 0.024].forEach((o) =>
      this.noiseHit(i + o, u * 1.1, "bandpass", 1500, 1.2, 0.001, 0.02, o * 3),
    ),
      this.noiseHit(
        i + 0.034,
        u * 1.1,
        "bandpass",
        1300,
        1.1,
        0.002,
        0.16,
        0.05,
      ));
  }
  rim(i, u) {
    const o = Math.max(this.ctx.currentTime + 0.01, i),
      f = this.ctx.createOscillator();
    ((f.type = "square"), (f.frequency.value = 1750));
    const h = this.ctx.createBiquadFilter();
    ((h.type = "bandpass"), (h.frequency.value = 1800), (h.Q.value = 3));
    const g = this.ctx.createGain();
    (g.gain.setValueAtTime(1e-4, o),
      g.gain.linearRampToValueAtTime(u * 0.6, o + 0.001),
      g.gain.exponentialRampToValueAtTime(1e-4, o + 0.04),
      f.connect(h).connect(g).connect(this.synthBus),
      (f.onended = () => {
        (f.disconnect(), h.disconnect(), g.disconnect());
      }),
      f.start(o),
      f.stop(o + 0.06));
  }
  tom(i, u, o) {
    const f = Math.max(this.ctx.currentTime + 0.01, i),
      h = this.ctx.createOscillator();
    ((h.type = "sine"),
      h.frequency.setValueAtTime(o * 1.5, f),
      h.frequency.exponentialRampToValueAtTime(o, f + 0.1));
    const g = this.ctx.createGain();
    (g.gain.setValueAtTime(1e-4, f),
      g.gain.linearRampToValueAtTime(u, f + 0.006),
      g.gain.exponentialRampToValueAtTime(1e-4, f + 0.34),
      h.connect(g).connect(this.synthBus),
      (h.onended = () => {
        (h.disconnect(), g.disconnect());
      }),
      h.start(f),
      h.stop(f + 0.38));
  }
  voice(i, u, o, f, h, g) {
    const S = VOICES[i];
    if (!S) return this.piano(u, o, f, h, g);
    if (this.activeVoices > 18) return;
    this.activeVoices++;
    const m = this.ctx,
      b = Math.max(m.currentTime + 0.01, o),
      j = midiToFreq(u),
      L = m.createGain();
    ((L.gain.value = S.g || 1), L.connect(g));
    const D = [L],
      X = [];
    let B = b;
    if (S.p) {
      const U = Math.max(0.35, Math.min(1, f / 1.2));
      for (const [V, q, ie, se] of S.p) {
        const Q = m.createOscillator();
        ((Q.type = se || "sine"), (Q.frequency.value = j * V));
        const de = m.createGain(),
          re = ie * U;
        (de.gain.setValueAtTime(1e-4, b),
          de.gain.linearRampToValueAtTime(Math.max(2e-4, h * q), b + S.att),
          de.gain.exponentialRampToValueAtTime(1e-4, b + S.att + re),
          Q.connect(de).connect(L),
          X.push(Q),
          D.push(Q, de),
          (B = Math.max(B, b + S.att + re)));
      }
    } else {
      const U = m.createBiquadFilter();
      ((U.type = "lowpass"), (U.Q.value = S.q));
      const V = Math.min(S.dec, Math.max(0.14, f));
      (U.frequency.setValueAtTime(S.c0, b),
        U.frequency.exponentialRampToValueAtTime(S.c1, b + S.ft));
      const q = this.envelope(b, S.att, V, h);
      for (const [ie, se, Q, de] of S.o) {
        const re = m.createOscillator();
        ((re.type = ie),
          (re.frequency.value = j * Math.pow(2, (de || 0) / 12)),
          (re.detune.value = se));
        const K = m.createGain();
        ((K.gain.value = Q),
          re.connect(K).connect(U),
          X.push(re),
          D.push(re, K));
      }
      (U.connect(q).connect(L),
        D.push(U, q),
        (B = b + Math.max(S.att + 0.05, V)));
    }
    ((B += 0.06),
      (X[0].onended = () => {
        this.activeVoices = Math.max(0, this.activeVoices - 1);
        for (const U of D)
          try {
            U.disconnect();
          } catch {}
      }));
    for (const U of X) (U.start(b), U.stop(B));
  }
  playHit(i, u = 1) {
    if (this.closed) return;
    const o = this.ctx.currentTime + 0.012,
      f = [84, 88, 91, 95][Math.max(0, Math.min(3, i))];
    this.piano(f, o, 0.22, 0.045 * u, this.fxBus);
  }
  playNote(i, u = 1) {
    if (this.closed) return;
    const o = this.ctx.currentTime + 0.012;
    this.voice(this.track.lead || "piano", i, o, 0.85, 0.16 * u, this.synthBus);
  }
  holdMusic(i) {
    if (this.closed || !this.gate || this.musicStopped) return;
    const u = this.ctx.currentTime,
      o = this.gate.gain,
      f = o.value;
    try {
      typeof o.cancelAndHoldAtTime == "function"
        ? o.cancelAndHoldAtTime(u)
        : (o.cancelScheduledValues(u), o.setValueAtTime(f, u));
    } catch {
      (o.cancelScheduledValues(u), o.setValueAtTime(f, u));
    }
    (o.setTargetAtTime(1, u, 0.03),
      o.setTargetAtTime(0.22, Math.max(u + 0.06, this.startTime + i), 0.14));
  }
  playClick(i = 1) {
    if (this.closed) return;
    const u = this.ctx.currentTime + 0.012,
      o = this.ctx.createOscillator();
    ((o.type = "sine"),
      o.frequency.setValueAtTime(920, u),
      o.frequency.exponentialRampToValueAtTime(420, u + 0.032));
    const f = this.ctx.createGain();
    (f.gain.setValueAtTime(1e-4, u),
      f.gain.linearRampToValueAtTime(0.022 * i, u + 0.004),
      f.gain.exponentialRampToValueAtTime(1e-4, u + 0.045),
      o.connect(f).connect(this.fxBus),
      (o.onended = () => {
        (o.disconnect(), f.disconnect());
      }),
      o.start(u),
      o.stop(u + 0.055));
  }
  playTap(i) {
    if (this.closed) return;
    const u = this.ctx.currentTime + 0.012,
      o = this.ctx.createOscillator();
    ((o.type = "sine"),
      o.frequency.setValueAtTime(520 + i * 80, u),
      o.frequency.exponentialRampToValueAtTime(320 + i * 60, u + 0.045));
    const f = this.ctx.createGain();
    (f.gain.setValueAtTime(1e-4, u),
      f.gain.linearRampToValueAtTime(0.014, u + 0.005),
      f.gain.exponentialRampToValueAtTime(1e-4, u + 0.055),
      o.connect(f).connect(this.fxBus),
      (o.onended = () => {
        (o.disconnect(), f.disconnect());
      }),
      o.start(u),
      o.stop(u + 0.065));
  }
  playCountTick(i) {
    if (this.closed) return;
    const u = this.ctx.currentTime + 0.012;
    if (i <= 0) {
      [72, 76, 79, 84].forEach((f, h) =>
        this.piano(f, u + h * 0.055, 0.35, 0.07, this.synthBus),
      );
      return;
    }
    const o = [67, 71, 74];
    this.piano(o[Math.min(2, 3 - i)], u, 0.22, 0.05, this.synthBus);
  }
  playMiss() {
    if (this.closed) return;
    const i = this.ctx.currentTime + 0.012,
      u = this.ctx.createOscillator();
    ((u.type = "triangle"),
      u.frequency.setValueAtTime(140, i),
      u.frequency.exponentialRampToValueAtTime(84, i + 0.16));
    const o = this.ctx.createBiquadFilter();
    ((o.type = "lowpass"), (o.frequency.value = 600));
    const f = this.envelope(i, 0.008, 0.2, 0.08);
    (u.connect(o).connect(f).connect(this.fxBus),
      (u.onended = () => {
        (u.disconnect(), o.disconnect(), f.disconnect());
      }),
      u.start(i),
      u.stop(i + 0.24));
  }
  playFail() {
    if (this.closed) return;
    const i = this.ctx.currentTime + 0.012,
      u = this.ctx.createOscillator();
    ((u.type = "triangle"),
      u.frequency.setValueAtTime(240, i),
      u.frequency.exponentialRampToValueAtTime(54, i + 0.65));
    const o = this.ctx.createBiquadFilter();
    ((o.type = "lowpass"),
      o.frequency.setValueAtTime(900, i),
      o.frequency.exponentialRampToValueAtTime(200, i + 0.6));
    const f = this.envelope(i, 0.012, 0.7, 0.14);
    (u.connect(o).connect(f).connect(this.fxBus),
      (u.onended = () => {
        (u.disconnect(), o.disconnect(), f.disconnect());
      }),
      u.start(i),
      u.stop(i + 0.78));
  }
  playComplete() {
    if (this.closed) return;
    const i = this.ctx.currentTime + 0.02;
    [72, 76, 79, 84, 88].forEach((u, o) => {
      this.piano(u, i + o * 0.09, 0.7, 0.075, this.synthBus);
    });
  }
  fadeMusicOut(i = 0.8) {
    if (this.closed) return;
    this.musicStopped = !0;
    const u = this.ctx.currentTime,
      o = Math.max(0.15, i);
    for (const f of [this.musicBus, this.synthBus])
      (f.gain.cancelScheduledValues(u),
        f.gain.setValueAtTime(Math.max(1e-4, f.gain.value), u),
        f.gain.exponentialRampToValueAtTime(1e-4, u + o));
    try {
      this.bufferSource?.stop(u + o + 0.02);
    } catch {}
  }
  async suspend() {
    if (!this.closed)
      try {
        await this.ctx.suspend();
      } catch {}
  }
  async resume() {
    if (!this.closed)
      try {
        await this.ctx.resume();
      } catch {}
  }
  async close() {
    if (!this.closed) {
      this.closed = !0;
      try {
        this.bufferSource?.stop();
      } catch {}
      try {
        await this.ctx.close();
      } catch {}
    }
  }
}
