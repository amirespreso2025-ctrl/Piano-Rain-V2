// @ts-nocheck
/* eslint-disable */

export const DIFFICULTIES = {
    easy: {
      key: "easy",
      label: "آسان",
      latin: "EASY",
      tagline:
        "مکعب‌ها آرام‌تر می‌افتند و پنجرهٔ ضربه بازتر است؛ برای شروع و گوشی.",
      paceOffset: 0.18,
      hitWindow: 0.32,
      missWindow: 0.22,
      hint: "آرام‌تر · بخشنده‌تر",
    },
    normal: {
      key: "normal",
      label: "عادی",
      latin: "NORMAL",
      tagline: "تجربهٔ استاندارد لوما؛ همان چیزی که بازی حول آن کوک شده.",
      paceOffset: 0,
      hitWindow: 0.27,
      missWindow: 0.16,
      hint: "استاندارد",
    },
    hard: {
      key: "hard",
      label: "سخت",
      latin: "HARD",
      tagline: "سقوط سریع‌تر و پنجرهٔ ضربهٔ تنگ‌تر؛ برای ریتم‌شناس‌ها.",
      paceOffset: -0.15,
      hitWindow: 0.235,
      missWindow: 0.13,
      hint: "تندتر · دقیق‌تر",
    },
    pro: {
      key: "pro",
      label: "حرفه‌ای",
      latin: "PRO",
      tagline: "بی‌رحم‌ترین حالت؛ اینجا هر میلی‌ثانیه حساب می‌شود.",
      paceOffset: -0.26,
      hitWindow: 0.205,
      missWindow: 0.105,
      hint: "بی‌رحم",
    },
  };

export const DIFFICULTY_KEYS = Object.keys(DIFFICULTIES);

export function isDifficulty(d) {
  return typeof d == "string" && d in DIFFICULTIES;
}

export const THEMES = {
    midnight: {
      key: "midnight",
      label: "نیمه‌شب",
      latin: "MIDNIGHT",
      swatch: ["#0b1020", "#1b2a4a"],
    },
    ocean: {
      key: "ocean",
      label: "اقیانوس",
      latin: "OCEAN",
      swatch: ["#04121f", "#0b3a5c"],
    },
    forest: {
      key: "forest",
      label: "شب‌تاب",
      latin: "GLOWWOOD",
      swatch: ["#05130c", "#0d3a24"],
    },
    wine: {
      key: "wine",
      label: "شراب شب",
      latin: "NIGHT WINE",
      swatch: ["#170712", "#4a1030"],
    },
    plum: {
      key: "plum",
      label: "بادمجان",
      latin: "PLUM",
      swatch: ["#120b20", "#3c1a5e"],
    },
    ember: {
      key: "ember",
      label: "کهربا",
      latin: "EMBER",
      swatch: ["#120d07", "#4a2c10"],
    },
  };

export const THEME_KEYS = Object.keys(THEMES);

export function isTheme(d) {
  return typeof d == "string" && d in THEMES;
}

export function applyTheme(d) {
  typeof document > "u" || (document.documentElement.dataset.theme = d);
}

export function readThemeColors() {
  if (typeof document > "u")
    return {
      top: "#070912",
      mid: "#090c17",
      bottom: "#05070d",
      tintA: "rgba(94,234,212,0.1)",
      tintB: "rgba(129,140,248,0.08)",
    };
  const d = getComputedStyle(document.documentElement),
    i = (u, o) => d.getPropertyValue(u).trim() || o;
  return {
    top: i("--c-top", "#070912"),
    mid: i("--c-mid", "#090c17"),
    bottom: i("--c-bot", "#05070d"),
    tintA: i("--c-tint-a", "rgba(94,234,212,0.1)"),
    tintB: i("--c-tint-b", "rgba(129,140,248,0.08)"),
  };
}
