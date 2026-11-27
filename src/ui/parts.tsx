// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
import { PALETTES } from "../music/palettes";
import { SongArt, hasSongArt } from "./SongArt";

export function Brand({ compact: d = !1, persian: i = !1 }) {
  return jsxs("div", {
    className: "flex items-center gap-2.5",
    dir: "ltr",
    children: [
      jsxs("span", {
        className: "brand-glyph",
        "aria-hidden": "true",
        children: [
          jsx("span", {}),
          jsx("span", {}),
          jsx("span", {}),
          jsx("span", {}),
        ],
      }),
      i
        ? jsx("span", {
            className: "brand-fa",
            dir: "rtl",
            lang: "fa",
            children: "نغمه‌های باربد",
          })
        : jsxs("span", {
            className: "flex flex-col leading-none",
            children: [
              jsx("span", {
                className:
                  "font-display text-[19px] font-extrabold tracking-[0.3em] text-cream",
                children: "LUMA",
              }),
              !d &&
                jsx("span", {
                  className:
                    "mt-1 font-display text-[8px] font-medium tracking-[0.42em] text-cream/40",
                  children: "PIANO FLOW",
                }),
            ],
          }),
    ],
  });
}

export const CoverArt = React.memo(function ({ track: d, className: i, showTitle: u = !1 }) {
  const o = PALETTES[d.palette],
    f = d.peaks.length ? d.peaks.slice(0, 36) : new Array(36).fill(0.35),
    h = {
      "--cover-a": o.cover[0],
      "--cover-b": o.cover[1],
      "--accent": o.accent,
      "--lane-0": o.lanes[0],
      "--lane-1": o.lanes[1],
      "--lane-2": o.lanes[2],
      "--lane-3": o.lanes[3],
    };
  return jsxs("div", {
    className: cn("cover-art", hasSongArt(d.art) && "has-art", i),
    style: h,
    "aria-hidden": "true",
    children: [
      hasSongArt(d.art) && jsx(SongArt, { id: d.art, className: "cover-illustration" }),
      jsx("div", { className: "cover-orbit cover-orbit-a" }),
      jsx("div", { className: "cover-orbit cover-orbit-b" }),
      jsx("div", { className: "cover-disc", children: jsx("span", {}) }),
      jsxs("div", {
        className: "cover-tiles",
        children: [
          jsx("i", {}),
          jsx("i", {}),
          jsx("i", {}),
          jsx("i", {}),
        ],
      }),
      jsx("div", {
        className: "cover-wave",
        children: f.map((g, S) =>
          jsx(
            "i",
            { style: { height: `${Math.max(8, Math.round(g * 100))}%` } },
            S,
          ),
        ),
      }),
      u &&
        jsxs("div", {
          className: "cover-title",
          children: [
            jsx("span", { children: d.titleFa }),
            jsx("small", { children: d.title }),
          ],
        }),
      jsxs("div", {
        className: "cover-stamp",
        children: [
          jsx("span", { children: "LUMA" }),
          jsx("span", {
            children:
              d.kind === "uploaded" ? "YOUR TRACK" : `SIDE ${d.difficulty}`,
          }),
        ],
      }),
    ],
  });
});

export function LevelDots({ level: d, className: i }) {
  return jsx("span", {
    className: cn("inline-flex items-center gap-1", i),
    title: `سطح ${d} از ۵`,
    children: [1, 2, 3, 4, 5].map((u) =>
      jsx(
        "i",
        {
          className: cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            u <= d ? "bg-current" : "bg-current/20",
          ),
        },
        u,
      ),
    ),
  });
}

export function KeyCaps({ className: d, compact: i = !1 }) {
  return jsx("div", {
    className: cn("flex items-center gap-1.5", d),
    dir: "ltr",
    children: ["D", "F", "J", "K"].map((u) =>
      jsx(
        "kbd",
        { className: cn("keycap", i ? "keycap-sm" : ""), children: u },
        u,
      ),
    ),
  });
}

export function ProgressRing({ value: d, size: i = 76, className: u }) {
  const o = Math.max(0, Math.min(100, d));
  return jsx("div", {
    className: cn("accuracy-ring", u),
    style: { width: i, height: i, "--accuracy": `${o * 3.6}deg` },
    children: jsxs("div", {
      className: "accuracy-ring-inner",
      children: [
        jsxs("strong", { children: [o.toFixed(0), "%"] }),
        jsx("span", { children: "دقت" }),
      ],
    }),
  });
}

export function LiveDot({ active: d = !0 }) {
  return jsxs("span", {
    className: cn("equalizer", d && "is-active"),
    "aria-hidden": "true",
    children: [
      jsx("i", {}),
      jsx("i", {}),
      jsx("i", {}),
      jsx("i", {}),
      jsx("i", {}),
    ],
  });
}

export const INITIAL_HUD = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    multiplier: 1,
    accuracy: 100,
    progress: 0,
    speed: 1,
    countdown: null,
    hits: 0,
    total: 0,
  };

export const LEVEL_LABELS = ["", "آسان", "ملایم", "متوسط", "سخت", "حرفه‌ای"];

export const TONE_LABELS = { perfect: "PERFECT", great: "GREAT", good: "GOOD", miss: "MISS" };

export const KEY_LANES = { d: 0, f: 1, j: 2, k: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
