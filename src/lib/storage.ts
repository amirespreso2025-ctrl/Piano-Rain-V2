// @ts-nocheck
/* eslint-disable */
import { isDifficulty, isTheme } from "../game/config";

export const Cp = "luma.scores.v1";

export const Mp = "luma.player.v1";

export const Lp = "luma.settings.v1";

export function Op(d, i) {
  if (!d) return i;
  try {
    return JSON.parse(d);
  } catch {
    return i;
  }
}

export function loadScores() {
  if (typeof window > "u") return [];
  const d = Op(window.localStorage.getItem(Cp), []);
  return Array.isArray(d)
    ? d
        .filter(
          (i) => i && typeof i.score == "number" && typeof i.songId == "string",
        )
        .sort((i, u) => u.score - i.score)
        .slice(0, 50)
    : [];
}

export function saveScore(d) {
  const i = [...loadScores(), d].sort((u, o) => o.score - u.score).slice(0, 50);
  try {
    window.localStorage.setItem(Cp, JSON.stringify(i));
  } catch {}
  return i;
}

export function bestScoreFor(d, i) {
  return d.reduce((u, o) => (o.songId === i && o.score > u ? o.score : u), 0);
}

export function topScoresFor(d, i, u = 3) {
  return d
    .filter((o) => o.songId === i)
    .sort((o, f) => f.score - o.score)
    .slice(0, u);
}

export function loadPlayerName() {
  return typeof window > "u"
    ? "نوازنده"
    : window.localStorage.getItem(Mp)?.trim() || "نوازنده";
}

export function savePlayerName(d) {
  try {
    window.localStorage.setItem(Mp, d);
  } catch {}
}

export const ui = { sound: !0, volume: 0.8, difficulty: "normal", theme: "midnight" };

export function loadSettings() {
  if (typeof window > "u") return { ...ui };
  const d = Op(window.localStorage.getItem(Lp), {});
  return {
    sound: d.sound !== !1,
    volume:
      typeof d.volume == "number"
        ? Math.max(0, Math.min(1, d.volume))
        : ui.volume,
    difficulty: isDifficulty(d.difficulty) ? d.difficulty : ui.difficulty,
    theme: isTheme(d.theme) ? d.theme : ui.theme,
  };
}

export function saveSettings(d) {
  try {
    window.localStorage.setItem(Lp, JSON.stringify(d));
  } catch {}
}

export const i0 = "luma-library";

export const s0 = 1;

export const Hn = "meta";

export const Vn = "audio";

export let Io = null;

export function mi() {
  return (
    Io ||
    ((Io = new Promise((d, i) => {
      if (typeof indexedDB > "u") {
        i(new Error("IndexedDB unavailable"));
        return;
      }
      const u = indexedDB.open(i0, s0);
      ((u.onupgradeneeded = () => {
        const o = u.result;
        (o.objectStoreNames.contains(Hn) ||
          o.createObjectStore(Hn, { keyPath: "id" }),
          o.objectStoreNames.contains(Vn) || o.createObjectStore(Vn));
      }),
        (u.onsuccess = () => d(u.result)),
        (u.onerror = () => i(u.error ?? new Error("Could not open library"))));
    })),
    Io)
  );
}

export async function loadUploadedTracks() {
  try {
    const d = await mi();
    return (
      await new Promise((i, u) => {
        const o = d.transaction(Hn, "readonly").objectStore(Hn).getAll();
        ((o.onsuccess = () => i(o.result)), (o.onerror = () => u(o.error)));
      })
    )
      .sort((i, u) => u.createdAt - i.createdAt)
      .map((i) => ({
        id: i.id,
        title: i.title,
        titleFa: i.titleFa,
        artist: i.artist,
        bpm: i.bpm,
        duration: i.duration,
        difficulty: i.difficulty,
        palette: i.palette,
        kind: "uploaded",
        notes: i.notes,
        peaks: i.peaks,
        startOffset: i.startOffset,
        createdAt: i.createdAt,
        fileSize: i.fileSize,
      }));
  } catch {
    return [];
  }
}

export async function saveUploadedTrack(d, i) {
  const u = await mi(),
    o = {
      id: d.id,
      title: d.title,
      titleFa: d.titleFa,
      artist: d.artist,
      bpm: d.bpm,
      duration: d.duration,
      difficulty: d.difficulty,
      palette: d.palette,
      notes: d.notes,
      peaks: d.peaks,
      startOffset: d.startOffset ?? 0,
      createdAt: d.createdAt ?? Date.now(),
      fileSize: d.fileSize ?? i.byteLength,
    };
  await new Promise((f, h) => {
    const g = u.transaction([Hn, Vn], "readwrite");
    (g.objectStore(Hn).put(o),
      g.objectStore(Vn).put(i, d.id),
      (g.oncomplete = () => f()),
      (g.onerror = () => h(g.error)));
  });
}

export async function loadUploadedAudio(d) {
  try {
    const i = await mi();
    return await new Promise((u, o) => {
      const f = i.transaction(Vn, "readonly").objectStore(Vn).get(d);
      ((f.onsuccess = () => u(f.result)), (f.onerror = () => o(f.error)));
    });
  } catch {
    return;
  }
}

export async function deleteUploadedTrack(d) {
  try {
    const i = await mi();
    await new Promise((u, o) => {
      const f = i.transaction([Hn, Vn], "readwrite");
      (f.objectStore(Hn).delete(d),
        f.objectStore(Vn).delete(d),
        (f.oncomplete = () => u()),
        (f.onerror = () => o(f.error)));
    });
  } catch {}
}
