// @ts-nocheck
/* eslint-disable */
import { DIFFICULTIES, readThemeColors } from "./config";
import { AudioEngine } from "../audio/engine";
import { PALETTES } from "../music/palettes";

export const hp = 2;

export const Qg = 0.065;

export const Kg = 0.13;

export const mp = 140;

export const Yg = 90;

export const gp = { keys: { start: 1.12, ramp: 0.44 }, touch: { start: 1.5, ramp: 0.46 } };

export const Xg = ["D", "F", "J", "K"];

export function Xe(d, i) {
  const u = d.replace("#", ""),
    o =
      u.length === 3
        ? u
            .split("")
            .map((m) => m + m)
            .join("")
        : u,
    f = Number.parseInt(o, 16),
    h = (f >> 16) & 255,
    g = (f >> 8) & 255,
    S = f & 255;
  return `rgba(${h}, ${g}, ${S}, ${i})`;
}

export function Ro(d, i) {
  const u = d.replace("#", ""),
    o =
      u.length === 3
        ? u
            .split("")
            .map((b) => b + b)
            .join("")
        : u,
    f = Number.parseInt(o, 16),
    h = (f >> 16) & 255,
    g = (f >> 8) & 255,
    S = f & 255,
    m = (b) => Math.round(i >= 0 ? b + (255 - b) * i : b * (1 + i));
  return `rgb(${m(h)}, ${m(g)}, ${m(S)})`;
}

export function At(d, i, u, o, f, h) {
  const g = Math.max(0, Math.min(h, o / 2, f / 2));
  (d.beginPath(),
    d.moveTo(i + g, u),
    d.arcTo(i + o, u, i + o, u + f, g),
    d.arcTo(i + o, u + f, i, u + f, g),
    d.arcTo(i, u + f, i, u, g),
    d.arcTo(i, u, i + o, u, g),
    d.closePath());
}

export class RhythmBoard {
  canvas;
  context;
  track;
  callbacks;
  audio;
  background;
  bgContext;
  resizeObserver = null;
  raf = 0;
  destroyed = !1;
  needsGesture = !1;
  blockedFor = 0;
  touchMode;
  pace;
  difficultyKey;
  hitWindow;
  missWindow;
  phase = "countdown";
  time = -hp;
  lastFrame = 0;
  velocity = 700;
  speedFactor = 1;
  width = 360;
  height = 640;
  dpr = 1;
  padX = 12;
  laneW = 90;
  tileH = 72;
  judgeY = 520;
  gap = 8;
  hudHeight = 132;
  tiles = [];
  missedTile = null;
  score = 0;
  combo = 0;
  maxCombo = 0;
  perfect = 0;
  great = 0;
  good = 0;
  misses = 0;
  particles = [];
  rings = [];
  floaters = [];
  ghosts = [];
  laneFlash = [0, 0, 0, 0];
  shake = 0;
  linePulse = 0;
  comboPulse = 0;
  failFlash = 0;
  celebration = 0;
  celebrationTimer = 0;
  countdownValue = null;
  lastHudAt = 0;
  lastHudKey = "";
  feedbackId = 0;
  maxParticles = mp;
  tileSprites = [];
  spritePadX = 14;
  spritePadTop = 74;
  spritePadBottom = 14;
  spriteCssW = 0;
  spriteCssH = 0;
  laneGlowSprites = [];
  glowSize = 0;
  lineGlowGradient = null;
  topScrimGradient = null;
  topScrimVeil = 0;
  laneBeamGradients = [null, null, null, null];
  laneBeamHeight = 0;
  constructor(i, u, o, f) {
    this.canvas = i;
    const h = i.getContext("2d", { alpha: !1 });
    if (!h) throw new Error("Canvas is not available");
    ((this.context = h),
      (this.track = u),
      (this.callbacks = f),
      (this.touchMode = o.touchMode),
      (this.maxParticles = o.touchMode ? Yg : mp));
    const g = DIFFICULTIES[o.difficulty] ?? DIFFICULTIES.normal;
    ((this.difficultyKey = g.key),
      (this.hitWindow = g.hitWindow),
      (this.missWindow = g.missWindow));
    const S = o.touchMode ? gp.touch : gp.keys;
    ((this.pace = { start: S.start + g.paceOffset, ramp: S.ramp }),
      (this.background = document.createElement("canvas")),
      (this.bgContext = this.background.getContext("2d")),
      (this.tiles = u.notes.map((m) => ({
        t: m.t,
        midi: m.midi,
        name: m.name,
        lane: m.lane,
        accent: !!m.accent,
        hit: !1,
      }))),
      (this.audio = new AudioEngine(u, {
        muted: o.muted,
        volume: o.volume,
        leadIn: hp,
      })),
      this.audio.holdMusic(this.nextPendingTime() + 0.14),
      this.resize(),
      typeof ResizeObserver < "u"
        ? ((this.resizeObserver = new ResizeObserver(() => this.resize())),
          this.resizeObserver.observe(i))
        : window.addEventListener("resize", this.resize),
      this.audio.unlock(),
      (this.lastFrame = performance.now()),
      (this.raf = requestAnimationFrame(this.loop)),
      this.emitHud(!0));
  }
  resize = () => {
    if (this.destroyed) return;
    const i = this.canvas.getBoundingClientRect(),
      u = Math.max(300, Math.round(i.width)),
      o = Math.max(380, Math.round(i.height)),
      f = Math.min(window.devicePixelRatio || 1, this.touchMode ? 1.75 : 2);
    ((this.width = u),
      (this.height = o),
      (this.dpr = f),
      (this.canvas.width !== Math.round(u * f) ||
        this.canvas.height !== Math.round(o * f)) &&
        ((this.canvas.width = Math.round(u * f)),
        (this.canvas.height = Math.round(o * f))),
      (this.padX = u < 430 ? 10 : 14));
    const h = u < 430 ? 7 : 9;
    ((this.laneW = (u - this.padX * 2) / 4),
      (this.tileH = this.touchMode
        ? Math.max(72, Math.min(128, this.laneW * 1.18, o * 0.17))
        : Math.max(54, Math.min(94, this.laneW * 0.8))),
      (this.judgeY = o - Math.max(96, Math.min(144, o * 0.16))),
      (this.gap = h),
      this.drawBackground(),
      this.buildSpritesAndCaches());
  };
  laneCenter(i) {
    return this.padX + this.laneW * (i + 0.5);
  }
  laneAt(i) {
    return Math.max(0, Math.min(3, Math.floor((i - this.padX) / this.laneW)));
  }
  nextPendingTime() {
    for (const i of this.tiles) if (!i.hit) return i.t;
    return this.track.duration + 5;
  }
  tileTop(i) {
    return this.judgeY + (this.time - i.t) * this.velocity - this.tileH;
  }
  tap(i) {
    if (
      this.phase === "paused" ||
      this.phase === "failed" ||
      this.phase === "complete"
    )
      return;
    if ((this.audio.unlock(), this.phase !== "playing")) {
      this.laneFlash[i] = Math.max(this.laneFlash[i], 0.35);
      return;
    }
    const u = this.time;
    let o = null,
      f = Number.POSITIVE_INFINITY;
    for (const b of this.tiles) {
      if (b.hit || b.lane !== i) continue;
      const j = u - b.t;
      if (
        (Math.abs(j) <= this.hitWindow &&
          Math.abs(j) < Math.abs(f) &&
          ((o = b), (f = j)),
        b.t > u + 0.5)
      )
        break;
    }
    if (!o) {
      ((this.laneFlash[i] = Math.max(this.laneFlash[i], 0.45)),
        this.audio.playTap(i),
        this.spawnBurst(
          this.laneCenter(i),
          this.judgeY,
          PALETTES[this.track.palette].lanes[i],
          3,
          0.34,
        ));
      return;
    }
    const h = Math.abs(f),
      g = h <= Qg ? "perfect" : h <= Kg ? "great" : "good",
      S = this.laneCenter(o.lane),
      m = this.judgeY - this.tileH * 0.35;
    this.registerHit(o, g, S, m, m - 12);
  }
  tapAt(i) {
    const u = this.canvas.getBoundingClientRect();
    this.tap(this.laneAt(i - u.left));
  }
  tapPoint(i, u) {
    if (this.phase !== "playing" && this.phase !== "countdown") return;
    this.audio.unlock();
    const o = this.canvas.getBoundingClientRect(),
      f = i - o.left,
      h = u - o.top;
    if (h < this.veilHeight() * 0.72) return;
    const g = this.tileAt(f, h);
    if (!g) {
      (this.audio.playTap(this.laneAt(f)),
        this.rings.push({
          x: f,
          y: h,
          life: 0,
          maxLife: 0.32,
          color: "#dbe4f0",
          radius: 7,
          width: 1.6,
          grow: 20,
        }));
      return;
    }
    const S = this.tileTop(g),
      m = this.laneCenter(g.lane),
      b = S + this.tileH / 2;
    (this.ghosts.push({
      x: m,
      y: b,
      w: this.laneW - this.gap * 2,
      h: this.tileH,
      color: PALETTES[this.track.palette].lanes[g.lane],
      life: 0,
      maxLife: 0.24,
    }),
      this.registerHit(g, this.touchTone(g), m, b, S - 12));
  }
  tileAt(i, u) {
    const o = this.laneW - this.gap * 2,
      f = this.gap + Math.min(16, this.laneW * 0.16),
      h = Math.max(22, this.tileH * 0.3) + this.velocity * 0.03,
      g = Math.max(18, this.tileH * 0.24),
      S = this.pace.start + 0.9;
    let m = null,
      b = Number.POSITIVE_INFINITY;
    for (const j of this.tiles) {
      if (j.hit) continue;
      if (j.t > this.time + S) break;
      const L = this.tileTop(j),
        D = L + this.tileH;
      if (D < 0 || L > this.height) continue;
      const X = this.padX + j.lane * this.laneW + this.gap,
        B = i < X ? X - i : i > X + o ? i - X - o : 0;
      if (B > f) continue;
      const U = L - u,
        V = u - D;
      if (U > h || V > g) continue;
      const q = B * 1.4 + Math.max(0, U, V);
      q < b && ((m = j), (b = q));
    }
    return m;
  }
  touchTone(i) {
    const u = ((this.time - i.t) * this.velocity) / this.tileH;
    return u >= -0.55 && u <= 0.8 ? "perfect" : u >= -1.4 ? "great" : "good";
  }
  registerHit(i, u, o, f, h) {
    i.hit = !0;
    let g = 50,
      S = "دقیق";
    (u === "perfect"
      ? ((g = 120), (S = "عالی!"), this.perfect++)
      : u === "great"
        ? ((g = 80), (S = "خوب"), this.great++)
        : this.good++,
      this.combo++,
      (this.maxCombo = Math.max(this.maxCombo, this.combo)));
    const m = 1 + Math.min(4, Math.floor(this.combo / 10)),
      b = g * m;
    ((this.score += b),
      (this.shake = Math.max(this.shake, u === "perfect" ? 2.4 : 1.3)),
      (this.linePulse = 1),
      (this.comboPulse = 1),
      (this.laneFlash[i.lane] = 1));
    const j = u === "perfect" ? 1.15 : u === "great" ? 1 : 0.85;
    i.midi !== void 0
      ? this.audio.playNote(i.midi, i.accent ? j * 1.15 : j)
      : (this.audio.playClick(j),
        this.audio.holdMusic(this.nextPendingTime() + 0.14));
    const L = PALETTES[this.track.palette].lanes[i.lane];
    if (
      (this.spawnBurst(
        o,
        f,
        L,
        u === "perfect" ? 20 : u === "great" ? 13 : 8,
        u === "perfect" ? 1.2 : 0.9,
      ),
      this.rings.push({
        x: o,
        y: f,
        life: 0,
        maxLife: u === "perfect" ? 0.52 : 0.4,
        color: L,
        radius: this.laneW * 0.18,
        width: 2.4,
      }),
      this.floaters.push({
        x: o,
        y: h,
        text: `+${b}`,
        life: 0,
        maxLife: 0.85,
        color: u === "perfect" ? "#fef6d8" : L,
        size: 19,
      }),
      this.callbacks.onFeedback({
        id: ++this.feedbackId,
        label: S,
        tone: u,
        combo: this.combo,
        points: b,
      }),
      this.combo > 0 &&
        this.combo % 25 === 0 &&
        ((this.shake = Math.max(this.shake, 5)),
        (this.linePulse = 1),
        this.spawnBurst(o, this.judgeY - 120, "#f8e7b0", 34, 1.4)),
      navigator.vibrate)
    )
      try {
        navigator.vibrate(u === "perfect" ? 7 : 4);
      } catch {}
    this.emitHud(!0);
  }
  setHudHeight(i) {
    Number.isFinite(i) &&
      i > 0 &&
      Math.abs(this.hudHeight - i) > 1 &&
      ((this.hudHeight = i), (this.topScrimGradient = null));
  }
  veilHeight() {
    return this.touchMode ? this.hudHeight + 10 : 132;
  }
  async unlockAudio() {
    (await this.audio.unlock(),
      this.audio.ctx.state === "running" &&
        this.needsGesture &&
        ((this.needsGesture = !1), this.callbacks.onNeedsGesture(!1)));
  }
  setPhase(i) {
    this.phase !== i && ((this.phase = i), this.callbacks.onPhase(i));
  }
  pause() {
    (this.phase !== "playing" && this.phase !== "countdown") ||
      (this.setPhase("paused"), this.audio.suspend(), this.emitHud(!0));
  }
  resume() {
    this.phase === "paused" &&
      (this.setPhase(this.time < 0 ? "countdown" : "playing"),
      this.audio.resume(),
      (this.lastFrame = performance.now()),
      this.emitHud(!0));
  }
  setMuted(i) {
    this.audio.setMuted(i);
  }
  setVolume(i) {
    this.audio.setVolume(i);
  }
  get audioState() {
    return this.audio.ctx.state;
  }
  get isSuspended() {
    return this.audio.ctx.state !== "running";
  }
  get difficulty() {
    return this.difficultyKey;
  }
  destroy() {
    ((this.destroyed = !0),
      cancelAnimationFrame(this.raf),
      this.resizeObserver?.disconnect(),
      this.resizeObserver || window.removeEventListener("resize", this.resize),
      this.audio.close());
  }
  loop = (i) => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    const u = Math.min(0.05, Math.max(0.001, (i - this.lastFrame) / 1e3));
    if (((this.lastFrame = i), this.phase === "paused")) {
      this.draw();
      return;
    }
    (this.phase === "playing" ||
      this.phase === "countdown" ||
      this.phase === "failed" ||
      this.phase === "complete") &&
      (this.updateEffects(u),
      (this.phase === "playing" || this.phase === "countdown") &&
        (this.audio.ctx.state !== "running"
          ? ((this.blockedFor += u),
            this.blockedFor > 0.35 &&
              !this.needsGesture &&
              ((this.needsGesture = !0), this.callbacks.onNeedsGesture(!0)))
          : ((this.blockedFor = 0),
            this.needsGesture &&
              ((this.needsGesture = !1), this.callbacks.onNeedsGesture(!1)),
            this.audio.tick(),
            (this.time = this.audio.time()),
            this.updateCountdown(),
            this.updateLogic())),
      this.phase === "complete" &&
        ((this.celebrationTimer -= u),
        this.celebrationTimer <= 0 &&
          ((this.celebrationTimer = 0.14),
          this.spawnConfetti(),
          (this.celebration = Math.min(1.5, this.celebration + 0.2)))),
      this.draw(),
      this.emitHud(!1));
  };
  updateCountdown() {
    let i;
    (this.time < 0
      ? (i = Math.min(3, Math.ceil(-this.time / 0.62)))
      : this.time < 0.5
        ? (i = 0)
        : (i = null),
      i !== this.countdownValue &&
        ((this.countdownValue = i),
        this.callbacks.onCountdown(i),
        i !== null && this.audio.playCountTick(i)));
  }
  updateLogic() {
    this.phase === "countdown" && this.time >= 0 && this.setPhase("playing");
    const i = this.track.duration,
      u = Math.max(0, Math.min(1, this.time / i)),
      o = this.pace.start - this.pace.ramp * u;
    ((this.velocity = (this.judgeY + this.tileH) / o),
      (this.speedFactor = this.pace.start / o));
    const f = this.touchMode
      ? (this.tileH + 6) / this.velocity
      : this.missWindow;
    let h = null;
    for (const g of this.tiles)
      if (!g.hit) {
        if (this.time > g.t + f) {
          h = g;
          break;
        }
        if (g.t > this.time + 2) break;
      }
    if (h) {
      ((this.missedTile = h), this.fail(h.lane));
      return;
    }
    this.time >= i - 0.08 && this.complete();
  }
  fail(i) {
    if (this.phase === "failed" || this.phase === "complete") return;
    (this.setPhase("failed"),
      this.misses++,
      (this.shake = 18),
      (this.failFlash = 1),
      (this.linePulse = 0),
      (this.combo = 0),
      this.audio.fadeMusicOut(0.35),
      this.audio.playFail());
    const u = PALETTES[this.track.palette];
    if (
      (this.spawnBurst(
        this.laneCenter(i),
        this.judgeY + 20,
        u.lanes[i],
        30,
        1.7,
      ),
      this.spawnBurst(this.laneCenter(i), this.judgeY + 24, "#ff8095", 16, 1.2),
      this.finished("fail", i),
      navigator.vibrate)
    )
      try {
        navigator.vibrate([30, 40, 50]);
      } catch {}
  }
  complete() {
    if (this.phase === "complete" || this.phase === "failed") return;
    (this.setPhase("complete"),
      this.audio.fadeMusicOut(1.6),
      this.audio.playComplete(),
      (this.celebration = 0.8),
      (this.celebrationTimer = 0),
      (this.shake = 4));
    const i = PALETTES[this.track.palette];
    for (let u = 0; u < 4; u++)
      (this.spawnBurst(
        this.laneCenter(u),
        this.judgeY - 60,
        i.lanes[u],
        14,
        1.2,
      ),
        this.rings.push({
          x: this.laneCenter(u),
          y: this.judgeY - 60,
          life: 0,
          maxLife: 0.9,
          color: i.lanes[u],
          radius: this.laneW * 0.22,
          width: 2.5,
        }));
    this.finished("complete");
  }
  finished(i, u) {
    (this.emitHud(!0), this.callbacks.onFinish(this.buildResult(i, u)));
  }
  buildResult(i, u) {
    const o = this.perfect + this.great + this.good + this.misses,
      f = this.perfect * 100 + this.great * 80 + this.good * 50,
      h = o > 0 ? Math.round((f / o) * 10) / 10 : 0,
      g = this.perfect + this.great + this.good;
    return {
      outcome: i,
      score: this.score,
      accuracy: h,
      maxCombo: this.maxCombo,
      perfect: this.perfect,
      great: this.great,
      good: this.good,
      misses: this.misses,
      timePlayed: Math.max(0, Math.min(this.track.duration, this.time)),
      duration: this.track.duration,
      totalNotes: this.tiles.length,
      hitNotes: g,
      lane: u,
    };
  }
  emitHud(i) {
    const u = performance.now();
    if (!i && u - this.lastHudAt < 100) return;
    const o = this.perfect + this.great + this.good + this.misses,
      f = this.perfect * 100 + this.great * 80 + this.good * 50,
      h = o > 0 ? Math.round((f / o) * 10) / 10 : 100,
      g = Math.max(0, Math.min(1, this.time / this.track.duration)),
      S = this.perfect + this.great + this.good,
      m = `${this.score}|${this.combo}|${Math.round(g * 100)}|${this.speedFactor.toFixed(2)}|${this.countdownValue}`;
    if (!i && m === this.lastHudKey) return;
    ((this.lastHudAt = u), (this.lastHudKey = m));
    const b = {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      multiplier: 1 + Math.min(4, Math.floor(this.combo / 10)),
      accuracy: h,
      progress: g,
      speed: this.speedFactor,
      countdown: this.countdownValue,
      hits: S,
      total: this.tiles.length,
    };
    this.callbacks.onHud(b);
  }
  spawnBurst(i, u, o, f, h) {
    const g = PALETTES[this.track.palette],
      S = this.touchMode ? Math.ceil(f * 0.65) : f;
    for (
      let m = 0;
      m < S && !(this.particles.length >= this.maxParticles);
      m++
    ) {
      const b = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.35,
        j = (70 + Math.random() * 330) * h,
        L = g.lanes[Math.floor(Math.random() * 4)];
      this.particles.push({
        x: i + (Math.random() - 0.5) * this.laneW * 0.55,
        y: u,
        vx: Math.cos(b) * j * 0.9,
        vy: Math.sin(b) * j,
        life: 0,
        maxLife: 0.42 + Math.random() * 0.48,
        size: 1.6 + Math.random() * 3.8,
        color: Math.random() < 0.28 ? "#fff7e3" : Math.random() < 0.5 ? o : L,
        gravity: 720,
        drag: 0.985,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 12,
        shape:
          Math.random() < 0.3
            ? "shard"
            : Math.random() < 0.7
              ? "circle"
              : "streak",
      });
    }
  }
  spawnConfetti() {
    const i = PALETTES[this.track.palette];
    for (let u = 0; u < 6 && !(this.particles.length >= this.maxParticles); u++)
      this.particles.push({
        x: Math.random() * this.width,
        y: -20,
        vx: (Math.random() - 0.5) * 90,
        vy: 90 + Math.random() * 160,
        life: 0,
        maxLife: 1.8 + Math.random() * 1.4,
        size: 2 + Math.random() * 4,
        color:
          Math.random() < 0.3
            ? "#ffe6a3"
            : i.lanes[Math.floor(Math.random() * 4)],
        gravity: 130,
        drag: 0.997,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 9,
        shape: Math.random() < 0.5 ? "shard" : "circle",
      });
  }
  updateEffects(i) {
    ((this.shake *= Math.exp(-i * 7.5)),
      (this.linePulse = Math.max(0, this.linePulse - i * 3.4)),
      (this.comboPulse = Math.max(0, this.comboPulse - i * 5)),
      (this.failFlash = Math.max(0, this.failFlash - i * 1.8)),
      (this.celebration = Math.max(0, this.celebration - i * 0.5)));
    for (let u = 0; u < 4; u++)
      this.laneFlash[u] = Math.max(0, this.laneFlash[u] - i * 4.4);
    for (let u = this.particles.length - 1; u >= 0; u--) {
      const o = this.particles[u];
      if (((o.life += i), o.life >= o.maxLife)) {
        this.particles.splice(u, 1);
        continue;
      }
      ((o.vx *= o.drag),
        (o.vy = o.vy * o.drag + o.gravity * i),
        (o.x += o.vx * i),
        (o.y += o.vy * i),
        (o.rotation += o.spin * i),
        o.shape === "shard" &&
          o.y > this.height + 20 &&
          this.particles.splice(u, 1));
    }
    for (let u = this.rings.length - 1; u >= 0; u--) {
      const o = this.rings[u];
      ((o.life += i), o.life >= o.maxLife && this.rings.splice(u, 1));
    }
    for (let u = this.floaters.length - 1; u >= 0; u--) {
      const o = this.floaters[u];
      ((o.life += i), o.life >= o.maxLife && this.floaters.splice(u, 1));
    }
    for (let u = this.ghosts.length - 1; u >= 0; u--) {
      const o = this.ghosts[u];
      ((o.life += i), o.life >= o.maxLife && this.ghosts.splice(u, 1));
    }
  }
  drawBackground() {
    const i = this.bgContext;
    if (!i) return;
    const u = this.width,
      o = this.height;
    ((this.background.width = Math.round(u * this.dpr)),
      (this.background.height = Math.round(o * this.dpr)),
      i.setTransform(this.dpr, 0, 0, this.dpr, 0, 0),
      i.clearRect(0, 0, u, o));
    const f = PALETTES[this.track.palette],
      h = readThemeColors(),
      g = i.createLinearGradient(0, 0, u * 0.4, o);
    (g.addColorStop(0, h.top),
      g.addColorStop(0.55, h.mid),
      g.addColorStop(1, h.bottom),
      (i.fillStyle = g),
      i.fillRect(0, 0, u, o));
    const S = i.createRadialGradient(
      u * 0.5,
      o * 0.1,
      0,
      u * 0.5,
      o * 0.1,
      u * 0.95,
    );
    (S.addColorStop(0, h.tintA),
      S.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = S),
      i.fillRect(0, 0, u, o));
    const m = i.createRadialGradient(
      u * 0.85,
      o * 0.85,
      0,
      u * 0.85,
      o * 0.85,
      u * 0.9,
    );
    (m.addColorStop(0, h.tintB),
      m.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = m),
      i.fillRect(0, 0, u, o));
    const b = i.createRadialGradient(
      u * 0.16,
      o * 0.08,
      0,
      u * 0.16,
      o * 0.08,
      u * 0.9,
    );
    (b.addColorStop(0, Xe(f.lanes[0], 0.14)),
      b.addColorStop(0.45, Xe(f.lanes[2], 0.06)),
      b.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = b),
      i.fillRect(0, 0, u, o));
    const j = i.createRadialGradient(
      u * 0.92,
      o * 0.32,
      0,
      u * 0.92,
      o * 0.32,
      u * 0.85,
    );
    (j.addColorStop(0, Xe(f.lanes[3], 0.11)),
      j.addColorStop(0.55, Xe(f.lanes[1], 0.045)),
      j.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = j),
      i.fillRect(0, 0, u, o),
      (i.strokeStyle = "rgba(244, 241, 230, 0.035)"),
      (i.lineWidth = 1));
    for (let V = 0; V < 5; V++) {
      const q = o * 0.11 + V * 18;
      (i.beginPath(), i.moveTo(0, q), i.lineTo(u, q), i.stroke());
    }
    for (let V = 0; V < 4; V++) {
      const q = this.padX + V * this.laneW;
      if (
        ((i.fillStyle =
          V % 2 === 0 ? "rgba(255,255,255,0.021)" : "rgba(255,255,255,0.01)"),
        At(i, q + this.gap / 2, 0, this.laneW - this.gap, o, 18),
        i.fill(),
        V > 0)
      ) {
        const ie = i.createLinearGradient(0, 0, 0, o);
        (ie.addColorStop(0, "rgba(255,255,255,0)"),
          ie.addColorStop(0.45, "rgba(255,255,255,0.055)"),
          ie.addColorStop(0.85, "rgba(255,255,255,0.02)"),
          ie.addColorStop(1, "rgba(255,255,255,0)"),
          (i.strokeStyle = ie),
          i.beginPath(),
          i.moveTo(q, 0),
          i.lineTo(q, o),
          i.stroke());
      }
    }
    const L = this.judgeY,
      D = i.createLinearGradient(0, L, 0, o);
    if (
      (D.addColorStop(0, "rgba(4,6,12,0.35)"),
      D.addColorStop(0.5, "rgba(3,4,9,0.72)"),
      D.addColorStop(1, "rgba(2,3,7,0.96)"),
      (i.fillStyle = D),
      i.fillRect(0, L, u, o - L),
      this.touchMode)
    ) {
      const V = i.createLinearGradient(0, L, 0, o);
      (V.addColorStop(0, "rgba(251,113,133,0)"),
        V.addColorStop(1, "rgba(251,113,133,0.1)"),
        (i.fillStyle = V),
        i.fillRect(0, L, u, o - L),
        (i.strokeStyle = "rgba(253,164,175,0.34)"),
        (i.lineWidth = 1.6),
        (i.lineCap = "round"),
        (i.lineJoin = "round"));
      for (let q = 0; q < 4; q++) {
        const ie = this.laneCenter(q);
        for (let se = 0; se < 2; se++) {
          const Q = L + 24 + se * 11;
          ((i.globalAlpha = 1 - se * 0.5),
            i.beginPath(),
            i.moveTo(ie - 7, Q),
            i.lineTo(ie, Q + 6),
            i.lineTo(ie + 7, Q),
            i.stroke());
        }
      }
      i.globalAlpha = 1;
    } else
      for (let V = 0; V < 4; V++) {
        const q = this.laneCenter(V),
          ie = Math.min(this.laneW - 20, 62),
          se = 36,
          Q = o - 49,
          de = i.createLinearGradient(0, Q, 0, Q + se);
        (de.addColorStop(0, Xe(f.lanes[V], 0.16)),
          de.addColorStop(1, "rgba(255,255,255,0.025)"),
          (i.fillStyle = de),
          At(i, q - ie / 2, Q, ie, se, 10),
          i.fill(),
          (i.strokeStyle = Xe(f.lanes[V], 0.3)),
          (i.lineWidth = 1),
          At(i, q - ie / 2 + 0.5, Q + 0.5, ie - 1, se - 1, 10),
          i.stroke(),
          (i.fillStyle = "rgba(246,243,232,0.62)"),
          (i.font = "600 12px Sora, Vazirmatn, sans-serif"),
          (i.textAlign = "center"),
          (i.textBaseline = "middle"),
          i.fillText(Xg[V], q, Q + se / 2 + 0.5),
          (i.fillStyle = Xe(f.lanes[V], 0.7)),
          i.beginPath(),
          i.arc(q, Q - 10, 2.2, 0, Math.PI * 2),
          i.fill());
      }
    const X = i.createLinearGradient(0, 0, 0, 180);
    (X.addColorStop(0, "rgba(3,4,9,0.92)"),
      X.addColorStop(0.55, "rgba(4,6,12,0.55)"),
      X.addColorStop(1, "rgba(4,6,12,0)"),
      (i.fillStyle = X),
      i.fillRect(0, 0, u, 190));
    const B = i.createLinearGradient(0, 0, 26, 0);
    (B.addColorStop(0, "rgba(0,0,0,0.32)"),
      B.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = B),
      i.fillRect(0, 0, 30, o));
    const U = i.createLinearGradient(u, 0, u - 26, 0);
    (U.addColorStop(0, "rgba(0,0,0,0.32)"),
      U.addColorStop(1, "rgba(0,0,0,0)"),
      (i.fillStyle = U),
      i.fillRect(u - 30, 0, 30, o));
  }
  buildSpritesAndCaches() {
    const i = PALETTES[this.track.palette],
      u = this.laneW - this.gap * 2,
      o = this.tileH,
      f = this.spritePadX,
      h = this.spritePadTop,
      g = this.spritePadBottom;
    ((this.spriteCssW = Math.ceil(u + f * 2)),
      (this.spriteCssH = Math.ceil(o + h + g)),
      (this.tileSprites = []));
    for (let m = 0; m < 4; m++)
      for (const b of [!1, !0]) {
        const j = document.createElement("canvas");
        ((j.width = Math.ceil(this.spriteCssW * this.dpr)),
          (j.height = Math.ceil(this.spriteCssH * this.dpr)));
        const L = j.getContext("2d");
        (L &&
          (L.setTransform(this.dpr, 0, 0, this.dpr, 0, 0),
          this.renderTileSprite(L, f, h, u, o, i.lanes[m], b)),
          this.tileSprites.push(j));
      }
    ((this.glowSize = Math.ceil(this.laneW * 2)), (this.laneGlowSprites = []));
    for (let m = 0; m < 4; m++) {
      const b = document.createElement("canvas");
      ((b.width = Math.ceil(this.glowSize * this.dpr)),
        (b.height = Math.ceil(this.glowSize * this.dpr)));
      const j = b.getContext("2d");
      if (j) {
        j.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        const L = this.glowSize / 2,
          D = j.createRadialGradient(L, L, 0, L, L, this.laneW * 0.9);
        (D.addColorStop(0, Xe(i.lanes[m], 0.42)),
          D.addColorStop(1, Xe(i.lanes[m], 0)),
          (j.fillStyle = D),
          j.fillRect(0, 0, this.glowSize, this.glowSize));
      }
      this.laneGlowSprites.push(b);
    }
    const S = this.context.createLinearGradient(
      this.padX,
      0,
      this.width - this.padX,
      0,
    );
    (S.addColorStop(0, Xe(i.lanes[0], 0.1)),
      S.addColorStop(0.15, i.lanes[0]),
      S.addColorStop(0.48, "#f8f4e6"),
      S.addColorStop(0.75, i.lanes[2]),
      S.addColorStop(1, Xe(i.lanes[3], 0.12)),
      (this.lineGlowGradient = S),
      (this.laneBeamHeight = 130),
      (this.laneBeamGradients = [0, 1, 2, 3].map((m) => {
        const b = this.context.createLinearGradient(
          0,
          this.judgeY - this.laneBeamHeight,
          0,
          this.judgeY,
        );
        return (
          b.addColorStop(0, Xe(i.lanes[m], 0)),
          b.addColorStop(1, Xe(i.lanes[m], 0.28)),
          b
        );
      })),
      (this.topScrimGradient = null));
  }
  renderTileSprite(i, u, o, f, h, g, S) {
    const m = Math.min(18, f * 0.2),
      b = Math.min(10, h * 0.1),
      j = h - b,
      L = i.createLinearGradient(0, o - 72, 0, o + 6);
    (L.addColorStop(0, Xe(g, 0)),
      L.addColorStop(1, Xe(g, 0.2)),
      (i.fillStyle = L),
      i.fillRect(u + f * 0.16, o - 72, f * 0.68, 78),
      (i.fillStyle = Xe(g, 0.07)),
      At(i, u - 13, o - 13, f + 26, h + 26, m + 11),
      i.fill(),
      (i.fillStyle = Xe(g, 0.13)),
      At(i, u - 6, o - 6, f + 12, h + 12, m + 5),
      i.fill(),
      (i.fillStyle = Ro(g, -0.6)),
      At(i, u, o + b, f, j, m),
      i.fill());
    const D = i.createLinearGradient(0, o, 0, o + j);
    (D.addColorStop(0, Ro(g, 0.58)),
      D.addColorStop(0.42, g),
      D.addColorStop(1, Ro(g, -0.3)),
      (i.fillStyle = D),
      At(i, u, o, f, j, m),
      i.fill(),
      i.save(),
      i.clip());
    const X = i.createLinearGradient(0, o, 0, o + j * 0.5);
    (X.addColorStop(0, "rgba(255,255,255,0.46)"),
      X.addColorStop(1, "rgba(255,255,255,0)"),
      (i.fillStyle = X),
      i.fillRect(u, o, f, j * 0.5),
      (i.fillStyle = "rgba(255,255,255,0.16)"),
      i.beginPath(),
      i.moveTo(u + f * 0.08, o),
      i.lineTo(u + f * 0.4, o),
      i.lineTo(u + f * 0.04, o + j),
      i.lineTo(u - f * 0.28, o + j),
      i.closePath(),
      i.fill());
    const B = i.createLinearGradient(0, o + j * 0.62, 0, o + j);
    (B.addColorStop(0, "rgba(6,10,20,0)"),
      B.addColorStop(1, "rgba(6,10,20,0.26)"),
      (i.fillStyle = B),
      i.fillRect(u, o + j * 0.62, f, j * 0.38),
      i.restore(),
      (i.strokeStyle = S ? "rgba(255,236,170,0.95)" : "rgba(255,255,255,0.62)"),
      (i.lineWidth = S ? 2 : 1.2),
      At(i, u + 0.6, o + 0.6, f - 1.2, j - 1.2, m),
      i.stroke(),
      (i.strokeStyle = "rgba(255,255,255,0.2)"),
      (i.lineWidth = 1),
      At(i, u + 5.5, o + 5.5, f - 11, j - 11, Math.max(2, m - 5)),
      i.stroke());
    const U = u + f * 0.2,
      V = o + j * 0.2,
      q = Math.min(7, f * 0.09);
    ((i.fillStyle = "rgba(255,255,255,0.95)"),
      i.beginPath(),
      i.moveTo(U, V - q),
      i.quadraticCurveTo(U, V, U + q, V),
      i.quadraticCurveTo(U, V, U, V + q),
      i.quadraticCurveTo(U, V, U - q, V),
      i.quadraticCurveTo(U, V, U, V - q),
      i.fill());
    const ie = Math.max(0.9, Math.min(1.35, f / 62));
    for (let se = 0; se < 2; se++)
      (i.save(),
        i.translate(
          u + f / 2 - 2 + (se === 0 ? 1.4 : 0),
          o + j / 2 + (se === 0 ? 2 : 0),
        ),
        i.scale(ie, ie),
        (i.fillStyle =
          se === 0 ? "rgba(10,14,26,0.34)" : "rgba(255,255,255,0.96)"),
        i.beginPath(),
        i.ellipse(0, 9, 8.4, 6, -0.2, 0, Math.PI * 2),
        i.fill(),
        i.fillRect(6.2, -15, 2.3, 25),
        i.beginPath(),
        i.moveTo(8.5, -15),
        i.quadraticCurveTo(18, -9, 14, 1),
        i.quadraticCurveTo(14, -6, 8.5, -6.5),
        i.closePath(),
        i.fill(),
        i.restore());
  }
  drawTile(i, u, o, f) {
    const h = this.tileSprites[o * 2 + (f ? 1 : 0)];
    h &&
      this.context.drawImage(
        h,
        Math.round(i - this.spritePadX),
        Math.round(u - this.spritePadTop),
        this.spriteCssW,
        this.spriteCssH,
      );
  }
  /** note name (C4, E5 …) printed on every tile so the player can see which piano key it plays */
  drawNoteLabel(x, y, tile) {
    if (!tile.name) return;
    const i = this.context,
      w = this.laneW - this.gap * 2,
      size = Math.max(10, Math.min(15, w * 0.15));
    i.save();
    i.textAlign = "center";
    i.textBaseline = "middle";
    i.font = `800 ${size}px Sora, Vazirmatn, sans-serif`;
    i.lineJoin = "round";
    i.lineWidth = 3;
    i.strokeStyle = "rgba(8, 12, 26, 0.55)";
    i.fillStyle = "rgba(255, 255, 255, 0.96)";
    const cx = x + w / 2,
      cy = y + this.tileH - Math.max(12, this.tileH * 0.17);
    i.strokeText(tile.name, cx, cy);
    i.fillText(tile.name, cx, cy);
    i.restore();
  }
  drawTouchGuides() {
    const i = this.context,
      u = this.laneW - this.gap * 2,
      o = Math.min(16, u * 0.16);
    if (
      (this.phase === "playing" || this.phase === "countdown") &&
      this.perfect + this.great + this.good === 0
    ) {
      const f = this.tiles.find((h) => !h.hit);
      if (f) {
        const h = this.tileTop(f);
        if (h + this.tileH > this.veilHeight() && h < this.height) {
          const g = this.padX + f.lane * this.laneW + this.gap,
            S = (performance.now() % 900) / 900;
          i.lineWidth = 2;
          for (let m = 0; m < 2; m++) {
            const b = (S + m * 0.5) % 1,
              j = 4 + b * 16;
            ((i.strokeStyle = `rgba(255,255,255,${(1 - b) * 0.75})`),
              At(i, g - j, h - j, u + j * 2, this.tileH + j * 2, o + j),
              i.stroke());
          }
        }
      }
    }
    if (this.phase === "failed" && this.missedTile) {
      const f = this.tileTop(this.missedTile),
        h = this.padX + this.missedTile.lane * this.laneW + this.gap;
      ((i.strokeStyle = "rgba(255,128,149,0.95)"),
        (i.lineWidth = 2.5),
        At(i, h - 3, f - 3, u + 6, this.tileH + 6, o + 3),
        i.stroke());
    }
    for (const f of this.ghosts) {
      const h = f.life / f.maxLife,
        g = 1 + h * 0.24,
        S = (1 - h) * (1 - h),
        m = f.w * g,
        b = f.h * g;
      ((i.fillStyle = Xe(f.color, S * 0.34)),
        At(i, f.x - m / 2, f.y - b / 2, m, b, o * g),
        i.fill(),
        (i.strokeStyle = `rgba(255,255,255,${S * 0.85})`),
        (i.lineWidth = 2),
        i.stroke());
    }
  }
  draw() {
    const i = this.context;
    if (!i) return;
    (i.setTransform(this.dpr, 0, 0, this.dpr, 0, 0),
      i.drawImage(this.background, 0, 0, this.width, this.height));
    const u = this.shake > 0.15;
    u &&
      (i.save(),
      i.translate(
        (Math.random() - 0.5) * this.shake,
        (Math.random() - 0.5) * this.shake,
      ));
    for (let f = 0; f < 4; f++) {
      const h = this.laneFlash[f],
        g = this.laneCenter(f),
        S = this.laneBeamGradients[f];
      if (
        (S &&
          ((i.globalAlpha = 0.18 + h * 0.82),
          (i.fillStyle = S),
          i.fillRect(
            g - this.laneW * 0.36,
            this.judgeY - this.laneBeamHeight,
            this.laneW * 0.72,
            this.laneBeamHeight,
          )),
        h > 0.02)
      ) {
        const m = this.laneGlowSprites[f];
        m &&
          ((i.globalAlpha = h),
          i.drawImage(
            m,
            Math.round(g - this.glowSize / 2),
            Math.round(this.judgeY - this.glowSize / 2),
            this.glowSize,
            this.glowSize,
          ));
      }
    }
    if (
      ((i.globalAlpha = 1),
      this.lineGlowGradient &&
        ((i.strokeStyle = this.lineGlowGradient),
        (i.lineWidth = 1.6 + this.linePulse * 1.8),
        i.beginPath(),
        i.moveTo(this.padX, this.judgeY),
        i.lineTo(this.width - this.padX, this.judgeY),
        i.stroke()),
      (i.fillStyle = `rgba(255,255,255,${0.045 + this.linePulse * 0.12})`),
      i.fillRect(this.padX, this.judgeY - 3, this.width - this.padX * 2, 6),
      i.save(),
      i.translate(this.width / 2, this.judgeY),
      i.rotate(Math.PI / 4),
      (i.fillStyle = `rgba(248,244,230,${0.5 + this.linePulse * 0.5})`),
      i.fillRect(-2.6, -2.6, 5.2, 5.2),
      i.restore(),
      this.touchMode && this.combo >= 3 && this.phase === "playing")
    ) {
      const f = 1 + Math.min(4, Math.floor(this.combo / 10)),
        h = Math.round(Math.min(this.width * 0.34, 144)),
        g = this.judgeY * 0.52,
        S = 1 + this.comboPulse * 0.09;
      (i.save(),
        i.translate(this.width / 2, g),
        i.scale(S, S),
        (i.textAlign = "center"),
        (i.textBaseline = "middle"),
        (i.font = `800 ${h}px Sora, Vazirmatn, sans-serif`),
        (i.fillStyle = `rgba(255,255,255,${0.075 + this.comboPulse * 0.07})`),
        i.fillText(String(this.combo), 0, 0),
        (i.font = "600 10px Sora, Vazirmatn, sans-serif"),
        (i.fillStyle = "rgba(245,240,228,0.28)"),
        i.fillText(`COMBO  ×${f}`, 0, h * 0.6),
        i.restore());
    }
    for (const f of this.tiles) {
      if (f.hit) continue;
      const h = this.tileTop(f);
      if (h > this.height + 40) continue;
      if (h + this.tileH < -30) {
        if (f.t > this.time + this.pace.start + 0.9) break;
        continue;
      }
      const g = this.padX + f.lane * this.laneW + this.gap;
      this.drawTile(g, h, f.lane, f.accent), this.drawNoteLabel(g, h, f);
    }
    (this.touchMode && this.drawTouchGuides(),
      (i.globalCompositeOperation = "lighter"));
    for (const f of this.particles) {
      const h = 1 - f.life / f.maxLife,
        g = Math.max(0, Math.min(1, h));
      ((i.globalAlpha = g),
        (i.fillStyle = f.color),
        f.shape === "circle"
          ? (i.beginPath(),
            i.arc(f.x, f.y, f.size * (0.4 + g * 0.8), 0, Math.PI * 2),
            i.fill())
          : f.shape === "streak"
            ? i.fillRect(f.x, f.y, f.size * 0.7, f.size * 3.8)
            : (i.save(),
              i.translate(f.x, f.y),
              i.rotate(f.rotation),
              i.fillRect(-f.size / 2, -f.size / 2, f.size, f.size * 1.7),
              i.restore()));
    }
    ((i.globalAlpha = 1), (i.globalCompositeOperation = "source-over"));
    for (const f of this.rings) {
      const h = f.life / f.maxLife,
        g = f.radius + h * (f.grow ?? this.laneW * 0.72);
      ((i.strokeStyle = Xe(f.color, (1 - h) * 0.55)),
        (i.lineWidth = f.width * (1 - h * 0.6)),
        i.beginPath(),
        i.arc(f.x, f.y, g, 0, Math.PI * 2),
        i.stroke());
    }
    for (const f of this.floaters) {
      const h = f.life / f.maxLife,
        g = h < 0.15 ? h / 0.15 : 1 - Math.max(0, (h - 0.55) / 0.45);
      ((i.globalAlpha = Math.max(0, g)),
        (i.fillStyle = f.color),
        (i.font = `700 ${f.size}px Sora, Vazirmatn, sans-serif`),
        (i.textAlign = "center"),
        (i.textBaseline = "middle"),
        i.fillText(f.text, f.x, f.y - h * 48));
    }
    i.globalAlpha = 1;
    const o = this.veilHeight();
    if (!this.topScrimGradient || this.topScrimVeil !== o) {
      this.topScrimVeil = o;
      const f = i.createLinearGradient(0, 0, 0, o);
      (this.touchMode
        ? (f.addColorStop(0, "rgba(5,7,13,0.98)"),
          f.addColorStop(0.72, "rgba(5,7,13,0.93)"),
          f.addColorStop(1, "rgba(5,7,13,0)"))
        : (f.addColorStop(0, "rgba(5,7,13,0.97)"),
          f.addColorStop(0.55, "rgba(5,7,13,0.6)"),
          f.addColorStop(1, "rgba(5,7,13,0)")),
        (this.topScrimGradient = f));
    }
    ((i.fillStyle = this.topScrimGradient),
      i.fillRect(0, 0, this.width, o + 6),
      this.failFlash > 0.005 &&
        ((i.fillStyle = `rgba(255, 68, 97, ${this.failFlash * 0.2})`),
        i.fillRect(0, 0, this.width, this.height)),
      this.phase === "complete" &&
        this.celebration > 0 &&
        ((i.fillStyle = `rgba(255, 238, 176, ${Math.min(0.07, this.celebration * 0.04)})`),
        i.fillRect(0, 0, this.width, this.height)),
      u && i.restore());
  }
}
