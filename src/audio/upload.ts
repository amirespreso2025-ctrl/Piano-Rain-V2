// @ts-nocheck
/* eslint-disable */
import { decodeAudio } from "./engine";
import { createLaneWalker, hashString, mulberry32 } from "../lib/random";

export const Ig = 30 * 1024 * 1024;

export const Ep = 6;

export const Fg = 900;

export const pp = ["aurora", "sunset", "lilac", "ocean", "citrus"];

export async function importAudioFile(d) {
  if (!(
    d.type.startsWith("audio/") ||
    /\.(mp3|wav|m4a|aac|ogg|oga|opus|flac|weba)$/i.test(d.name)
  ))
    throw new Error("این فایل صوتی نیست. یک فایل MP3، WAV یا M4A انتخاب کن.");
  if (d.size > Ig)
    throw new Error(
      "حجم فایل بیش از ۳۰ مگابایت است. یک نسخه کوتاه‌تر انتخاب کن.",
    );
  const i = await d.arrayBuffer();
  let u;
  try {
    u = await decodeAudio(i);
  } catch {
    throw new Error(
      "خواندن این فایل ممکن نشد. یک فایل MP3 یا WAV سالم انتخاب کن.",
    );
  }
  if (u.duration < Ep) throw new Error("آهنگ باید حداقل ۶ ثانیه باشد.");
  if (u.duration > Fg) throw new Error("این آهنگ طولانی‌تر از ۱۵ دقیقه است.");
  const o = analyzeAudio(u),
    f =
      d.name
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 48) || "آهنگ من",
    h = hashString(f + d.size),
    g = pp[h % pp.length];
  return {
    track: {
      id: `upload-${Date.now().toString(36)}-${(h % 46656).toString(36)}`,
      title: f,
      titleFa: f,
      artist: "آهنگ شما",
      bpm: o.bpm,
      duration: o.duration,
      difficulty: o.difficulty,
      palette: g,
      kind: "uploaded",
      notes: o.notes,
      peaks: o.peaks,
      startOffset: o.startOffset,
      buffer: u,
      createdAt: Date.now(),
      fileSize: d.size,
    },
    raw: i,
  };
}

export function analyzeAudio(d) {
  const i = d.sampleRate,
    u = Math.max(256, Math.floor(i / 110)),
    o = d.getChannelData(0),
    f = d.numberOfChannels > 1 ? d.getChannelData(1) : void 0,
    h = Math.floor(o.length / u),
    g = u / i,
    S = new Float32Array(h);
  let m = 0;
  for (let R = 0; R < h; R++) {
    const Y = R * u,
      F = Math.min(o.length, Y + u);
    let ne = 0;
    for (let je = Y; je < F; je++) {
      const Ze = f ? (o[je] + f[je]) * 0.5 : o[je];
      ne += Ze * Ze;
    }
    const Z = Math.sqrt(ne / Math.max(1, F - Y));
    ((S[R] = Z), Z > m && (m = Z));
  }
  const b = Math.max(0.0025, m * 0.035);
  let j = 0;
  for (; j < h && S[j] < b;) j++;
  let L = h - 1;
  for (; L > j && S[L] < b;) L--;
  L - j < 8 && ((j = 0), (L = h - 1));
  const D = Math.max(0, j * g - 0.18),
    X = Math.min(d.duration, L * g + 0.6),
    B = Math.max(Ep, X - D),
    U = [],
    V = 64;
  for (let R = 0; R < V; R++) {
    const Y = Math.floor(j + ((L - j) / V) * R),
      F = Math.max(Y + 1, Math.floor(j + ((L - j) / V) * (R + 1)));
    let ne = 0;
    for (let Z = Y; Z < F; Z++) ne = Math.max(ne, S[Z] ?? 0);
    U.push(Math.min(1, Math.max(0.06, ne / Math.max(1e-4, m))));
  }
  const q = new Float32Array(h);
  for (let R = Math.max(1, j); R <= L; R++) q[R] = Math.max(0, S[R] - S[R - 1]);
  const ie = Math.max(2, Math.round(60 / 180 / g)),
    se = Math.round(60 / 72 / g);
  let Q = Math.round(0.5 / g),
    de = 0;
  for (let R = ie; R <= se; R++) {
    let Y = 0;
    const F = L - R * 2;
    for (let je = j; je < F; je++)
      Y += q[je] * (q[je + R] + 0.5 * q[je + R * 2]);
    const ne = Math.log2(60 / (R * g) / 120),
      Z = Y * Math.exp(-0.5 * (ne / 0.9) * (ne / 0.9));
    Z > de && ((de = Z), (Q = R));
  }
  const re = (R) => {
    const Y = Math.round(R);
    return Math.max(q[Y - 1] ?? 0, q[Y] ?? 0, q[Y + 1] ?? 0);
  };
  let K = 0,
    $ = -1;
  for (let R = 0; R < Q; R++) {
    let Y = 0;
    for (let F = j + R; F <= L; F += Q) Y += re(F);
    Y > $ && (($ = Y), (K = R));
  }
  const he = Q / 2,
    Fe = he * g,
    Ne = [];
  let fe = j + K;
  for (let R = 0; fe <= L; R++) {
    if (R > 0 && R % 16 === 0) {
      let F = 0,
        ne = -1;
      for (let Z = -2; Z <= 2; Z++) {
        let je = 0;
        for (let Ze = 0; Ze < 8; Ze++) je += re(fe + Z + Ze * Q);
        (je > ne + 1e-9 ||
          (Math.abs(je - ne) <= 1e-9 && Math.abs(Z) < Math.abs(F))) &&
          ((ne = je), (F = Z));
      }
      fe += F * 0.5;
    }
    const Y = fe * g - D;
    (Y >= 1 &&
      Y <= B - 0.4 &&
      Ne.push({ t: Y, strength: re(fe), onBeat: R % 2 === 0, index: R }),
      (fe += he));
  }
  const Ae = Ne.reduce((R, Y) => R + Y.strength, 0) / Math.max(1, Ne.length),
    Be = Fe >= 0.21;
  let Se = Ne.filter((R) =>
    R.onBeat ? R.strength > Ae * 0.3 : Be && R.strength > Ae * 1.25,
  );
  Se.length < 8 && (Se = Ne.filter((R) => R.onBeat));
  const k = new Set(Se.map((R) => R.index));
  let E = Number.NEGATIVE_INFINITY;
  for (const R of Ne)
    k.has(R.index)
      ? (E = R.index)
      : R.onBeat && R.index - E >= 4 && (k.add(R.index), (E = R.index));
  let O = Ne.filter((R) => k.has(R.index));
  O.length > 850 && (O = O.filter((R) => R.onBeat));
  let C = 1;
  for (; O.length / C > 850;) C++;
  O = O.filter((R, Y) => Y % C === 0);
  const G = mulberry32(hashString(`${d.duration}-${d.length}-${O.length}`)),
    v = createLaneWalker(G),
    P = O.map((R) => ({
      t: Math.round(R.t * 1e3) / 1e3,
      lane: v(),
      accent: R.index % 8 === 0,
    })),
    H = P.length / B,
    W = Math.max(1, Math.min(5, Math.round(H * 1.1 + 1)));
  return {
    notes: P,
    peaks: U,
    startOffset: D,
    duration: B,
    bpm: Math.round(60 / (Q * g)),
    difficulty: W,
  };
}

export function reanalyzeAudio(d) {
  return analyzeAudio(d);
}
