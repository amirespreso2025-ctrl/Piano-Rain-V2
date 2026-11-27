// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
import { bestScoreFor } from "../lib/storage";
import { Icon } from "./icons";
import { Brand, CoverArt, KeyCaps, LevelDots, LiveDot } from "./parts";
import { formatDuration, formatScore, formatShortDate } from "../lib/format";
import { DIFFICULTIES, DIFFICULTY_KEYS, THEMES, THEME_KEYS } from "../game/config";
import { HowToKeys, HowToTouch } from "./HowTo";
import { CategoryTabs, SongDetail, categoryShortLabel } from "./SongDetail";

export const FLOATING_NOTES = [
  { char: "♪", top: "14%", left: "6%", size: 30, dur: 15, delay: 0 },
  { char: "♫", top: "30%", left: "88%", size: 22, dur: 19, delay: -4 },
  { char: "♪", top: "58%", left: "12%", size: 20, dur: 17, delay: -8 },
  { char: "♩", top: "72%", left: "80%", size: 34, dur: 22, delay: -2 },
  { char: "♬", top: "44%", left: "46%", size: 26, dur: 20, delay: -11 },
  { char: "♪", top: "86%", left: "30%", size: 24, dur: 16, delay: -6 },
];

export function HomeScreen({
  tracks: d,
  uploadedTracks: i,
  selected: u,
  scores: o,
  playerName: f,
  soundOn: h,
  settings: g,
  onSettings: S,
  uploadStatus: m,
  playBusy: b,
  onPlay: j,
  onUpload: L,
  onDeleteUpload: D,
  onSelect: X,
  onToggleSound: B,
  onPlayerName: U,
}) {
  const [V, q] = React.useState("builtin"),
    [cat, setCat] = React.useState("all"),
    [ie, se] = React.useState(null),
    [Q, de] = React.useState(!1),
    [re, K] = React.useState(!1),
    $ = React.useRef(null),
    he = React.useMemo(
      () =>
        typeof window < "u"
          ? window.matchMedia("(pointer: coarse)").matches
          : !1,
      [],
    ),
    Fe = d.filter((C) => C.kind === "builtin"),
    Fv = cat === "all" ? Fe : Fe.filter((C) => C.category === cat),
    Ne = bestScoreFor(o, u.id),
    fe = o.length ? Math.max(...o.map((C) => C.score)) : 0,
    Ae = o.slice(0, 8),
    Be =
      m.state === "loading"
        ? `${m.name} در حال پردازش است…`
        : m.state === "idle"
          ? ""
          : m.message;
  (React.useEffect(() => {
    const C = () => K(window.scrollY > 12);
    return (
      C(),
      window.addEventListener("scroll", C, { passive: !0 }),
      () => window.removeEventListener("scroll", C)
    );
  }, []),
    React.useEffect(() => {
      m.state === "success" && q("mine");
    }, [m]),
    React.useEffect(() => {
      const C = () => {
        window.location.hash === "#mine" && q("mine");
      };
      return (
        C(),
        window.addEventListener("hashchange", C),
        () => window.removeEventListener("hashchange", C)
      );
    }, []),
    React.useEffect(() => {
      const C = document.querySelectorAll("[data-reveal]");
      if (typeof IntersectionObserver > "u") {
        C.forEach((v) => v.classList.add("is-in"));
        return;
      }
      const G = new IntersectionObserver(
        (v) => {
          for (const P of v)
            P.isIntersecting &&
              (P.target.classList.add("is-in"), G.unobserve(P.target));
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      return (C.forEach((v) => G.observe(v)), () => G.disconnect());
    }, []));
  const Se = (C) => {
      if (C === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document
        .getElementById(C)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    k = (C) => {
      C && L(C);
    },
    E = (C = !1) =>
      jsxs("button", {
        type: "button",
        className: cn("upload-card", Q && "is-drag", C && "upload-card-inline"),
        onClick: () => $.current?.click(),
        onDragOver: (G) => {
          (G.preventDefault(), de(!0));
        },
        onDragLeave: () => de(!1),
        onDrop: (G) => {
          (G.preventDefault(), de(!1), k(G.dataTransfer.files?.[0]));
        },
        disabled: m.state === "loading",
        children: [
          jsx("span", {
            className: "upload-icon",
            children:
              m.state === "loading"
                ? jsx("span", { className: "spinner" })
                : jsx(Icon, {
                    name: m.state === "success" ? "check" : "upload",
                    size: 21,
                  }),
          }),
          jsxs("span", {
            className: "upload-copy",
            children: [
              jsx("b", { children: "آهنگ خودت را اضافه کن" }),
              jsx("small", {
                children:
                  "فایل صوتی گوشی‌ات را انتخاب کن؛ نت‌ها با ریتم خودِ آهنگ ساخته می‌شوند و هر لمس، آهنگ را جلو می‌برد.",
              }),
            ],
          }),
          jsxs("div", {
            className: "upload-types",
            children: [
              jsx("span", { children: "MP3" }),
              jsx("span", { children: "WAV" }),
              jsx("span", { children: "M4A" }),
              jsx("span", { children: "OGG" }),
            ],
          }),
          m.state !== "idle" &&
            jsxs("div", {
              className: cn(
                "upload-status",
                m.state === "error" && "is-error",
                m.state === "success" && "is-success",
                m.state === "loading" && "is-loading",
              ),
              children: [
                m.state === "loading" &&
                  jsx("span", { className: "spinner" }),
                m.state === "error" && jsx(Icon, { name: "info", size: 12 }),
                m.state === "success" && jsx(Icon, { name: "check", size: 12 }),
                jsx("span", { children: Be }),
              ],
            }),
        ],
      }),
    O = (C, G) => {
      const v = bestScoreFor(o, C.id),
        P = C.kind === "uploaded";
      return jsxs(
        "div",
        {
          className: cn("song-card", u.id === C.id && "is-selected"),
          style: { animationDelay: `${G * 55}ms` },
          children: [
            jsxs("button", {
              type: "button",
              className: "song-card-main",
              onClick: () => {
                P ? (X(C), j(C)) : X(C);
              },
              "aria-label": P ? `شروع ${C.titleFa}` : `انتخاب ${C.titleFa}`,
              children: [
                jsxs("div", {
                  className: "cover-wrap",
                  children: [
                    jsx(CoverArt, { track: C }),
                    jsx("span", {
                      className: "cover-play",
                      title: `نواختن ${C.titleFa}`,
                      onClick: (H) => {
                        H.stopPropagation();
                        X(C);
                        j(C);
                      },
                      children: jsx("span", {
                        children: jsx(Icon, { name: "play", size: 19 }),
                      }),
                    }),
                  ],
                }),
                jsxs("div", {
                  className: "song-info",
                  children: [
                    jsxs("span", {
                      className: "song-title",
                      children: [
                        jsx("b", { children: C.titleFa }),
                        jsx("span", {
                          dir: "ltr",
                          children: C.title.toUpperCase(),
                        }),
                      ],
                    }),
                    jsx("span", {
                      className: "tag tag-accent shrink-0",
                      children: P ? "شما" : categoryShortLabel(C),
                    }),
                  ],
                }),
              ],
            }),
            jsxs("div", {
              className: "song-card-foot",
              children: [
                jsxs("span", {
                  className: "song-foot-group",
                  children: [
                    jsx("span", {
                      className: "num",
                      children: formatDuration(C.duration),
                    }),
                    jsx("span", { children: "·" }),
                    jsx("span", {
                      className: "num",
                      children: C.bpm > 0 ? `${C.bpm} BPM` : "AUDIO",
                    }),
                  ],
                }),
                jsxs("span", {
                  className: "song-foot-group",
                  children: [
                    v > 0
                      ? jsxs("span", {
                          className: "song-best",
                          children: [
                            jsx(Icon, { name: "trophy", size: 10 }),
                            formatScore(v),
                          ],
                        })
                      : jsx("span", { children: P ? "آهنگ شما" : "آماده" }),
                    jsx(LevelDots, {
                      level: C.difficulty,
                      className: "text-mint/80",
                    }),
                  ],
                }),
              ],
            }),
            P &&
              jsx("button", {
                type: "button",
                className: "song-delete",
                "aria-label": `حذف ${C.titleFa}`,
                onClick: (H) => {
                  (H.stopPropagation(), se(C.id));
                },
                children: jsx(Icon, { name: "trash", size: 13 }),
              }),
            ie === C.id &&
              jsxs("div", {
                className: "delete-confirm",
                dir: "rtl",
                children: [
                  jsx(Icon, { name: "trash", size: 20 }),
                  jsxs("p", {
                    children: [
                      "«",
                      C.titleFa,
                      "» از حافظه این دستگاه حذف شود؟",
                      jsx("br", {}),
                      "رکوردهای آن باقی می‌مانند.",
                    ],
                  }),
                  jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      jsx("button", {
                        type: "button",
                        className: "btn btn-secondary btn-sm",
                        onClick: () => se(null),
                        children: "انصراف",
                      }),
                      jsx("button", {
                        type: "button",
                        className: "btn btn-sm",
                        style: {
                          background: "linear-gradient(120deg,#ffe4e7,#fda4af)",
                          color: "#3a0a14",
                        },
                        onClick: () => {
                          (D(C.id), se(null));
                        },
                        children: "حذف",
                      }),
                    ],
                  }),
                ],
              }),
          ],
        },
        C.id,
      );
    };
  return jsxs("div", {
    className: "app-bg",
    id: "top",
    children: [
      jsx("div", { className: "stage-light stage-light-a" }),
      jsx("div", { className: "stage-light stage-light-b" }),
      jsx("div", { className: "stage-light stage-light-c" }),
      FLOATING_NOTES.map((C, G) =>
        jsx(
          "span",
          {
            className: "float-note",
            "aria-hidden": "true",
            style: {
              top: C.top,
              left: C.left,
              "--fn-size": `${C.size}px`,
              "--fn-dur": `${C.dur}s`,
              animationDelay: `${C.delay}s`,
            },
            children: C.char,
          },
          G,
        ),
      ),
      jsx("header", {
        className: cn("site-header", re && "is-scrolled"),
        children: jsxs("div", {
          className: "shell header-inner",
          children: [
            jsx(Brand, { persian: !0 }),
            jsx("nav", {
              className: "nav-desktop hidden lg:flex items-center gap-7",
              "aria-label": "ناوبری اصلی",
              children: [
                { id: "top", label: "خانه" },
                { id: "library", label: "کتابخانه" },
                { id: "records", label: "رکوردها" },
                { id: "how", label: "راهنما" },
                { id: "settings", label: "تنظیمات" },
              ].map((C) =>
                jsx(
                  "button",
                  {
                    type: "button",
                    className: "nav-link",
                    onClick: () => Se(C.id),
                    children: C.label,
                  },
                  C.id,
                ),
              ),
            }),
            jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                jsx("button", {
                  type: "button",
                  className: "icon-btn",
                  onClick: () => Se("settings"),
                  "aria-label": "تنظیمات",
                  title: "تنظیمات",
                  children: jsx(Icon, { name: "speed", size: 17 }),
                }),
                jsx("button", {
                  type: "button",
                  className: cn("icon-btn", h && "is-on"),
                  onClick: B,
                  "aria-label": h ? "قطع صدا" : "روشن کردن صدا",
                  title: h ? "قطع صدا" : "روشن کردن صدا",
                  children: jsx(Icon, {
                    name: h ? "volume" : "volumeOff",
                    size: 17,
                  }),
                }),
                jsxs("button", {
                  type: "button",
                  className: "btn btn-primary btn-sm hidden sm:inline-flex",
                  onClick: () => j(u),
                  children: [
                    jsx(Icon, { name: "play", size: 13 }),
                    "شروع بازی",
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      jsx("main", {
        children: jsxs("div", {
          className: "shell",
          children: [
            jsxs("section", {
              className: "deck-hero",
              id: "play",
              children: [
                jsxs("div", {
                  className: "deck-copy animate-fade-up",
                  children: [
                    jsxs("div", {
                      className: "hero-eyebrow",
                      children: [
                        jsx(LiveDot, {}),
                        jsx("span", {
                          dir: "ltr",
                          children: "PIANO RHYTHM CONSOLE",
                        }),
                        jsx("b", { children: "۱٫۱" }),
                      ],
                    }),
                    jsxs("h1", {
                      className: "hero-title",
                      children: [
                        jsx("span", {
                          className: "line",
                          children: "مکعب‌ها می‌بارند،",
                        }),
                        jsx("span", {
                          className: "line gradient-text",
                          children: "ریتم با توست.",
                        }),
                      ],
                    }),
                    jsxs("p", {
                      className: "hero-copy",
                      children: [
                        "هر مکعب یک نُت است؛ ",
                        jsx("strong", {
                          children: "با لمسِ تو نواخته می‌شود",
                        }),
                        " و مکعب‌ها روی ضربِ خودِ آهنگ می‌افتند. آهنگ گوشی‌ات را اضافه کن، سختی و رنگ صحنه را از تنظیمات انتخاب کن و تا نتِ آخر ادامه بده.",
                      ],
                    }),
                    jsxs("div", {
                      className: "hero-actions",
                      children: [
                        jsxs("button", {
                          type: "button",
                          className: "btn btn-primary",
                          onClick: () => j(u),
                          children: [
                            jsx(Icon, { name: "play", size: 16 }),
                            "شروع بازی",
                          ],
                        }),
                        jsxs("button", {
                          type: "button",
                          className: "btn btn-secondary",
                          onClick: () => {
                            (q("mine"),
                              $.current?.click(),
                              document
                                .getElementById("library")
                                ?.scrollIntoView({ behavior: "smooth" }));
                          },
                          children: [
                            jsx(Icon, { name: "upload", size: 16 }),
                            "افزودن آهنگ",
                          ],
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "hero-stats",
                      children: [
                        jsxs("div", {
                          className: "hero-stat",
                          children: [
                            jsx("b", {
                              className: "num",
                              children: d.length,
                            }),
                            jsx("span", { children: "آهنگ آماده" }),
                          ],
                        }),
                        jsx("span", { className: "hero-stat-divider" }),
                        jsxs("div", {
                          className: "hero-stat",
                          children: [
                            jsx("b", {
                              className: "num",
                              children: o.length,
                            }),
                            jsx("span", { children: "رکورد ثبت‌شده" }),
                          ],
                        }),
                        jsx("span", { className: "hero-stat-divider" }),
                        jsxs("div", {
                          className: "hero-stat",
                          children: [
                            jsx("b", {
                              className: "num",
                              children: fe > 0 ? formatScore(fe) : "—",
                            }),
                            jsx("span", { children: "بهترین امتیاز" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                jsxs("div", {
                  className: "deck-wrap animate-fade-up",
                  style: { animationDelay: "120ms" },
                  children: [
                    jsxs("div", {
                      className: "deck",
                      children: [
                        jsxs("div", {
                          className: "deck-head",
                          children: [
                            jsx("span", {
                              className: "deck-brand",
                              dir: "ltr",
                              children: "LUMA CONSOLE",
                            }),
                            jsx("span", {
                              dir: "ltr",
                              children: "SIDE A · 33⅓",
                            }),
                            jsxs("span", {
                              className: "deck-live",
                              children: [
                                jsx("i", {}),
                                jsx("span", {
                                  dir: "ltr",
                                  children: "ON AIR",
                                }),
                              ],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "deck-body",
                          children: [
                            jsx("div", {
                              className: "deck-disc",
                              "aria-hidden": "true",
                              children: jsx("span", {
                                className: "disc-label",
                                children: jsx(Icon, { name: "note", size: 16 }),
                              }),
                            }),
                            jsxs("div", {
                              className: "deck-lanes",
                              "aria-hidden": "true",
                              children: [
                                [0, 1, 2, 3].map((C) =>
                                  jsx(
                                    "div",
                                    {
                                      className: "hero-lane",
                                      children: jsx("span", {
                                        className: "preview-tile",
                                      }),
                                    },
                                    C,
                                  ),
                                ),
                                jsx("div", { className: "hero-judge" }),
                              ],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "deck-wave",
                          "aria-hidden": "true",
                          children: [
                            (u.peaks.length
                              ? u.peaks.slice(0, 44)
                              : new Array(44).fill(0.3)
                            ).map((C, G) =>
                              jsx(
                                "i",
                                {
                                  style: {
                                    height: `${Math.max(12, Math.round(C * 100))}%`,
                                  },
                                },
                                G,
                              ),
                            ),
                            jsx("span", { className: "wave-head" }),
                          ],
                        }),
                        jsxs("div", {
                          className: "deck-transport",
                          children: [
                            jsx("button", {
                              type: "button",
                              className: "deck-play",
                              "aria-label": `پخش ${u.titleFa}`,
                              onClick: () => j(u),
                              children: jsx(Icon, { name: "play", size: 18 }),
                            }),
                            jsxs("div", {
                              className: "deck-track",
                              children: [
                                jsx("b", { children: u.titleFa }),
                                jsxs("span", {
                                  dir: "ltr",
                                  children: [
                                    u.bpm > 0 ? `${u.bpm} BPM` : "YOUR AUDIO",
                                    " · ",
                                    formatDuration(u.duration),
                                    Ne > 0 ? ` · BEST ${formatScore(Ne)}` : "",
                                  ],
                                }),
                              ],
                            }),
                            jsxs("div", {
                              className: "deck-level",
                              children: [
                                jsx(LevelDots, {
                                  level: u.difficulty,
                                  className: "text-mint/90",
                                }),
                                jsxs("span", {
                                  children: [
                                    "سختی بازی: ",
                                    jsx("b", {
                                      className: "text-cream/85",
                                      children: DIFFICULTIES[g.difficulty].label,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "hero-chip hero-chip-score",
                      children: [
                        jsx("span", {
                          className: "chip-icon",
                          children: jsx(Icon, { name: "sparkles", size: 15 }),
                        }),
                        jsxs("span", {
                          dir: "ltr",
                          children: [
                            jsx("span", {
                              className: "chip-value",
                              children: "+۲۴۰",
                            }),
                            jsx("span", {
                              className: "chip-label block",
                              children: "PERFECT COMBO",
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "hero-chip hero-chip-combo",
                      children: [
                        jsx("span", {
                          className: "chip-icon",
                          style: {
                            color: "var(--gold)",
                            background: "rgba(248,212,138,.08)",
                            borderColor: "rgba(248,212,138,.18)",
                          },
                          children: jsx(Icon, { name: "flame", size: 15 }),
                        }),
                        jsxs("span", {
                          children: [
                            jsx("span", {
                              className: "chip-value num",
                              children: "×۳",
                            }),
                            jsx("span", {
                              className: "chip-label block",
                              children: "ضریب کمبو",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            jsx("div", {
              className: "ticker",
              "aria-hidden": "true",
              children: jsx("div", {
                className: "ticker-track",
                children: [...d, ...d].map((C, G) =>
                  jsxs(
                    "span",
                    {
                      children: [
                        C.titleFa,
                        jsx("i", { children: "◆" }),
                        jsx("span", {
                          dir: "ltr",
                          children: C.bpm > 0 ? `${C.bpm} BPM` : "AUDIO",
                        }),
                        jsx("i", { children: "◆" }),
                        formatDuration(C.duration),
                        jsx("i", { children: "◆" }),
                      ],
                    },
                    `${C.id}-${G}`,
                  ),
                ),
              }),
            }),
            jsxs("section", {
              className: "library-section",
              id: "library",
              "data-reveal": !0,
              children: [
                jsxs("div", {
                  className: "section-head",
                  children: [
                    jsxs("div", {
                      className: "section-head-copy",
                      children: [
                        jsx("span", {
                          className: "section-kicker",
                          children: "PLAYLIST",
                        }),
                        jsx("h2", {
                          className: "section-title",
                          children: "کتابخانه آهنگ‌ها",
                        }),
                        jsx("span", {
                          className: "section-note",
                          children:
                            "دسته را انتخاب کن، آهنگ را ببین و با دکمهٔ پخش شروع کن.",
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "flex items-center gap-2 flex-wrap",
                      children: [
                        jsxs("div", {
                          className: "tabs",
                          role: "tablist",
                          "aria-label": "دسته‌بندی آهنگ‌ها",
                          children: [
                            jsxs("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": V === "builtin",
                              className: cn(
                                "tab",
                                V === "builtin" && "is-active",
                              ),
                              onClick: () => q("builtin"),
                              children: [
                                jsx(Icon, { name: "disc", size: 13 }),
                                "ساخته‌شده",
                                jsx("span", {
                                  className: "tab-count num",
                                  children: Fe.length,
                                }),
                              ],
                            }),
                            jsxs("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": V === "mine",
                              className: cn("tab", V === "mine" && "is-active"),
                              onClick: () => q("mine"),
                              children: [
                                jsx(Icon, { name: "upload", size: 13 }),
                                "آهنگ‌های من",
                                jsx("span", {
                                  className: "tab-count num",
                                  children: i.length,
                                }),
                              ],
                            }),
                          ],
                        }),
                        jsx("button", {
                          type: "button",
                          className: "icon-btn",
                          onClick: () => $.current?.click(),
                          "aria-label": "افزودن آهنگ",
                          children: jsx(Icon, { name: "upload", size: 17 }),
                        }),
                      ],
                    }),
                  ],
                }),
                V === "builtin"
                  ? jsxs(Fragment, {
                      children: [
                        jsx(CategoryTabs, {
                          tracks: Fe,
                          active: cat,
                          onChange: (id) => {
                            setCat(id);
                            const list = id === "all" ? Fe : Fe.filter((C) => C.category === id);
                            if (list.length && !list.some((C) => C.id === u.id)) X(list[0]);
                          },
                        }),
                        u.kind === "builtin" &&
                          (cat === "all" || u.category === cat) &&
                          jsx(SongDetail, {
                            track: u,
                            best: Ne,
                            levelLabel: DIFFICULTIES[g.difficulty].label,
                            onPlay: () => j(u),
                          }),
                        jsx("div", {
                          className: "song-grid",
                          children: Fv.map(O),
                        }),
                      ],
                    })
                  : jsxs(Fragment, {
                      children: [
                        jsxs("div", {
                          className: "song-grid",
                          children: [i.map((C, G) => O(C, G)), E(!0)],
                        }),
                        i.length === 0 &&
                          jsx("p", {
                            className:
                              "mt-3 text-[10px] leading-7 text-cream/30",
                            children:
                              "آهنگ‌ها فقط در همین دستگاه نگه داشته می‌شوند و جایی آپلود نمی‌شوند. پس از افزودن، مکعب‌ها روی ضرب‌آهنگ خودِ فایل چیده می‌شوند.",
                          }),
                      ],
                    }),
              ],
            }),
            jsxs("section", {
              className: "info-section",
              id: "records",
              "data-reveal": !0,
              children: [
                jsxs("div", {
                  className: "panel records-panel",
                  children: [
                    jsxs("div", {
                      className: "records-head",
                      children: [
                        jsxs("h2", {
                          children: [
                            jsx(Icon, { name: "trophy", size: 18 }),
                            "جدول رکوردها",
                          ],
                        }),
                        jsxs("span", {
                          className: "records-sub",
                          children: [
                            "بهترین‌های ",
                            jsx("b", {
                              className: "text-cream/65",
                              children: f,
                            }),
                            " روی این دستگاه",
                          ],
                        }),
                      ],
                    }),
                    Ae.length === 0
                      ? jsxs("div", {
                          className: "empty-records",
                          children: [
                            jsx("span", {
                              className: "empty-records-icon",
                              children: jsx(Icon, { name: "trophy", size: 24 }),
                            }),
                            jsx("b", { children: "هنوز رکوردی ثبت نشده" }),
                            jsx("p", {
                              children:
                                "اولین آهنگ را بازی کن و اولین نفری باش که نامش روی جدول می‌ماند. لازم نیست جایی ثبت‌نام کنی.",
                            }),
                            jsxs("button", {
                              type: "button",
                              className: "btn btn-primary btn-sm mt-1",
                              onClick: () => j(u),
                              children: [
                                jsx(Icon, { name: "play", size: 12 }),
                                "اولین رکورد را بزن",
                              ],
                            }),
                          ],
                        })
                      : jsx("div", {
                          className: "record-list",
                          children: Ae.map((C, G) =>
                            jsxs(
                              "div",
                              {
                                className: cn(
                                  "record-row",
                                  G === 0 && "is-top",
                                ),
                                children: [
                                  jsx("span", {
                                    className: cn(
                                      "rank-badge",
                                      G === 0 && "gold",
                                      G === 1 && "silver",
                                      G === 2 && "bronze",
                                    ),
                                    children: G + 1,
                                  }),
                                  jsxs("span", {
                                    className: "record-main",
                                    children: [
                                      jsx("b", { children: C.songTitle }),
                                      jsxs("span", {
                                        children: [
                                          C.player,
                                          jsx("i", {
                                            className:
                                              "inline-block h-0.5 w-0.5 rounded-full bg-cream/25",
                                          }),
                                          formatShortDate(C.date),
                                          C.maxCombo > 0 &&
                                            jsxs(Fragment, {
                                              children: [
                                                jsx("i", {
                                                  className:
                                                    "inline-block h-0.5 w-0.5 rounded-full bg-cream/25",
                                                }),
                                                "کمبو ",
                                                C.maxCombo,
                                              ],
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  jsx("span", {
                                    className: "record-score",
                                    children: formatScore(C.score),
                                  }),
                                  jsxs("span", {
                                    className: "record-acc",
                                    children: [C.accuracy.toFixed(1), "%"],
                                  }),
                                ],
                              },
                              C.id,
                            ),
                          ),
                        }),
                  ],
                }),
                jsxs("aside", {
                  className: "panel how-panel",
                  id: "how",
                  children: [
                    jsxs("div", {
                      children: [
                        jsx("span", {
                          className: "section-kicker",
                          children: "HOW TO PLAY",
                        }),
                        jsx("h2", {
                          className: "section-title mt-2",
                          style: { fontSize: 17 },
                          children: "در سه حرکت، هماهنگ شو",
                        }),
                      ],
                    }),
                    he ? jsx(HowToTouch, {}) : jsx(HowToKeys, {}),
                  ],
                }),
              ],
            }),
            jsxs("section", {
              className: "panel settings-section",
              id: "settings",
              "data-reveal": !0,
              children: [
                jsxs("div", {
                  className: "section-head",
                  style: { marginBottom: 0 },
                  children: [
                    jsxs("div", {
                      className: "section-head-copy",
                      children: [
                        jsx("span", {
                          className: "section-kicker",
                          children: "PLAYER SETUP",
                        }),
                        jsx("h2", {
                          className: "section-title",
                          children: "تنظیمات",
                        }),
                        jsx("span", {
                          className: "section-note",
                          children:
                            "سختی و رنگ صحنه برای دستِ بعدی اعمال می‌شوند؛ بقیه همان لحظه. همه‌چیز فقط روی همین دستگاه ذخیره می‌شود.",
                        }),
                      ],
                    }),
                    jsxs("span", {
                      className: "pill",
                      children: [
                        jsx(Icon, { name: "check", size: 12 }),
                        "ذخیره خودکار",
                      ],
                    }),
                  ],
                }),
                jsxs("div", {
                  className: "settings-grid",
                  children: [
                    jsxs("div", {
                      className: "settings-col",
                      children: [
                        jsxs("h3", {
                          children: [
                            jsx(Icon, { name: "speed", size: 15 }),
                            "درجه سختی",
                          ],
                        }),
                        jsx("p", {
                          className: "settings-note",
                          children:
                            "سرعت سقوط مکعب‌ها و دقتی که از ضربه‌ات انتظار می‌رود.",
                        }),
                        jsx("div", {
                          className: "diff-list",
                          role: "radiogroup",
                          "aria-label": "درجه سختی",
                          children: DIFFICULTY_KEYS.map((C) => {
                            const G = DIFFICULTIES[C],
                              v = g.difficulty === C;
                            return jsxs(
                              "button",
                              {
                                type: "button",
                                role: "radio",
                                "aria-checked": v,
                                className: cn("diff-btn", v && "is-active"),
                                onClick: () => S({ difficulty: C }),
                                children: [
                                  jsxs("span", {
                                    className: "diff-btn-head",
                                    children: [
                                      jsx("b", { children: G.label }),
                                      jsx("small", {
                                        dir: "ltr",
                                        children: G.latin,
                                      }),
                                    ],
                                  }),
                                  jsx("small", {
                                    className: "diff-tagline",
                                    children: G.tagline,
                                  }),
                                  jsx("span", {
                                    className: "diff-hint",
                                    children: G.hint,
                                  }),
                                ],
                              },
                              C,
                            );
                          }),
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "settings-col",
                      children: [
                        jsxs("h3", {
                          children: [
                            jsx(Icon, { name: "sparkles", size: 15 }),
                            "رنگ پس‌زمینه",
                          ],
                        }),
                        jsx("p", {
                          className: "settings-note",
                          children:
                            "رنگ صحنهٔ بازی و کلِ برنامه با هم عوض می‌شوند.",
                        }),
                        jsx("div", {
                          className: "theme-grid",
                          role: "radiogroup",
                          "aria-label": "رنگ پس‌زمینه",
                          children: THEME_KEYS.map((C) => {
                            const G = THEMES[C],
                              v = g.theme === C;
                            return jsxs(
                              "button",
                              {
                                type: "button",
                                role: "radio",
                                "aria-checked": v,
                                className: cn("theme-swatch", v && "is-active"),
                                onClick: () => S({ theme: C }),
                                style: {
                                  "--sw-a": G.swatch[0],
                                  "--sw-b": G.swatch[1],
                                },
                                children: [
                                  jsx("i", {
                                    className: "swatch-dot",
                                    "aria-hidden": "true",
                                    children:
                                      v &&
                                      jsx(Icon, { name: "check", size: 13 }),
                                  }),
                                  jsx("span", { children: G.label }),
                                  jsx("em", {
                                    dir: "ltr",
                                    children: G.latin,
                                  }),
                                ],
                              },
                              C,
                            );
                          }),
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "settings-col",
                      children: [
                        jsxs("h3", {
                          children: [
                            jsx(Icon, { name: "user", size: 15 }),
                            "بازیکن و صدا",
                          ],
                        }),
                        jsx("p", {
                          className: "settings-note",
                          children:
                            "نامی که پای رکوردهایت ثبت می‌شود و بلندی صدای بازی.",
                        }),
                        jsxs("div", {
                          className: "name-field",
                          children: [
                            jsxs("label", {
                              htmlFor: "player-name",
                              children: [
                                jsx(Icon, { name: "medal", size: 12 }),
                                "نام تو در جدول رکورد",
                              ],
                            }),
                            jsx("input", {
                              id: "player-name",
                              className: "name-input",
                              value: f,
                              maxLength: 18,
                              placeholder: "مثلاً آوا",
                              onChange: (C) => U(C.target.value),
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "volume-row",
                          children: [
                            jsx("button", {
                              type: "button",
                              className:
                                "text-cream/60 hover:text-cream transition-colors",
                              onClick: B,
                              "aria-label": h ? "قطع صدا" : "روشن کردن صدا",
                              children: jsx(Icon, {
                                name: h ? "volume" : "volumeOff",
                                size: 16,
                              }),
                            }),
                            jsx("input", {
                              className: "range-slider",
                              type: "range",
                              min: 0,
                              max: 1,
                              step: 0.01,
                              value: g.volume,
                              style: {
                                "--fill": `${Math.round(g.volume * 100)}%`,
                              },
                              onChange: (C) =>
                                S({ volume: Number(C.target.value) }),
                              "aria-label": "میزان صدا",
                            }),
                            jsxs("span", {
                              className: "volume-pct num",
                              children: [Math.round(g.volume * 100), "%"],
                            }),
                          ],
                        }),
                        jsxs("button", {
                          type: "button",
                          className: cn(
                            "btn btn-secondary btn-sm btn-wide mt-1",
                            h && "border-mint/30 text-mint",
                          ),
                          onClick: B,
                          children: [
                            jsx(Icon, {
                              name: h ? "volume" : "volumeOff",
                              size: 14,
                            }),
                            h ? "صدا روشن است" : "صدا قطع است",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            jsxs("footer", {
              className: "site-footer",
              children: [
                jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    jsx(Brand, { persian: !0 }),
                    jsx("span", {
                      className: "text-cream/20",
                      children: "|",
                    }),
                    jsx("span", {
                      children:
                        "ساخته‌شده برای بازی با ریتم · تمام رکوردها روی همین دستگاه می‌مانند.",
                    }),
                  ],
                }),
                !he &&
                  jsxs("div", {
                    className: "footer-keyboard",
                    children: [
                      jsx("span", { children: "راهنمای کلیدها" }),
                      jsx(KeyCaps, { compact: !0 }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
      jsx("input", {
        ref: $,
        type: "file",
        accept: "audio/*,.mp3,.wav,.m4a,.aac,.ogg,.oga,.opus,.flac,.weba",
        className: "hidden",
        onChange: (C) => {
          (k(C.target.files?.[0]), (C.target.value = ""));
        },
      }),
      b &&
        jsx("div", {
          className:
            "fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 backdrop-blur-xl",
          children: jsxs("div", {
            className:
              "panel flex flex-col items-center gap-3 px-8 py-7 text-center",
            children: [
              jsx("span", {
                className: "spinner",
                style: { width: 24, height: 24, borderWidth: 2 },
              }),
              jsx("b", {
                className: "text-sm",
                children: "دارم آهنگ را آماده می‌کنم…",
              }),
              jsx("span", {
                className:
                  "max-w-[230px] text-[10.5px] leading-6 text-cream/45",
                children:
                  "صدا را از حافظه می‌خوانم و مکعب‌ها را با ریتم آن هماهنگ می‌کنم.",
              }),
            ],
          }),
        }),
    ],
  });
}
