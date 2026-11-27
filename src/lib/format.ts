// @ts-nocheck
/* eslint-disable */

export function formatDuration(d) {
  (!Number.isFinite(d) || d < 0) && (d = 0);
  const i = Math.round(d),
    u = Math.floor(i / 60),
    o = i % 60;
  return `${u}:${o.toString().padStart(2, "0")}`;
}

export function formatScore(d) {
  return Math.max(0, Math.round(d)).toLocaleString("en-US");
}

export function formatShortDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
