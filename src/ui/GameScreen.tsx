// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
import { CoverArt, INITIAL_HUD, KEY_LANES, KeyCaps, LEVEL_LABELS, LevelDots, ProgressRing, TONE_LABELS } from "./parts";
import { isTouchDevice } from "../lib/device";
import { RhythmBoard } from "../game/board";
import { topScoresFor } from "../lib/storage";
import { Icon } from "./icons";
import { formatDuration, formatScore } from "../lib/format";
import { DIFFICULTIES } from "../game/config";

export function GameScreen({
  track: d,
  playerName: i,
  difficulty: u,
  soundOn: o,
  volume: f,
  scores: h,
  previousBest: g,
  onResult: S,
  onExit: m,
  onRestart: b,
  onToggleSound: j,
  onVolumeChange: L,
}) {
  const [D, X] = React.useState("countdown"),
    [B, U] = React.useState({ ...INITIAL_HUD, total: d.notes.length }),
    [V, q] = React.useState(null),
    [ie, se] = React.useState(null),
    [Q, de] = React.useState(null),
    [re, K] = React.useState(!1),
    [$] = React.useState(isTouchDevice),
    he = React.useRef(0),
    Fe = React.useRef(null),
    Ne = React.useRef(null),
    fe = React.useRef(null),
    Ae = React.useRef(null),
    Be = React.useRef(!1),
    Se = React.useRef(g),
    k = React.useRef({ onResult: S });
  ((k.current.onResult = S),
    React.useEffect(() => {
      const F = Ne.current;
      if (!F) return;
      const ne = new RhythmBoard(
        F,
        d,
        { muted: !o, volume: f, touchMode: $, difficulty: u },
        {
          onHud: (Z) => U(Z),
          onFeedback: (Z) => {
            (se(Z),
              Ae.current && window.clearTimeout(Ae.current),
              (Ae.current = window.setTimeout(() => se(null), 560)));
          },
          onCountdown: (Z) => q(Z),
          onPhase: (Z) => X(Z),
          onFinish: (Z) => {
            (X(Z.outcome === "fail" ? "failed" : "complete"),
              (he.current = performance.now()),
              de(Z),
              q(null),
              Be.current || ((Be.current = !0), k.current.onResult(Z)));
          },
          onNeedsGesture: (Z) => K(Z),
        },
      );
      return (
        (fe.current = ne),
        () => {
          (Ae.current && window.clearTimeout(Ae.current),
            ne.destroy(),
            (fe.current = null));
        }
      );
    }, [d.id]),
    React.useEffect(() => {
      const F = Fe.current;
      if (!F) return;
      const ne = () =>
        fe.current?.setHudHeight(F.getBoundingClientRect().height);
      if ((ne(), typeof ResizeObserver > "u")) return;
      const Z = new ResizeObserver(ne);
      return (Z.observe(F), () => Z.disconnect());
    }, [d.id]),
    React.useEffect(() => {
      fe.current?.setMuted(!o);
    }, [o]),
    React.useEffect(() => {
      fe.current?.setVolume(f);
    }, [f]));
  const E = () => {
      const F = fe.current;
      F && (D === "playing" || D === "countdown") && (F.pause(), X("paused"));
    },
    O = () => {
      const F = fe.current;
      F && (F.resume(), X(F.phase === "playing" ? "playing" : "countdown"));
    };
  (React.useEffect(() => {
    const F = () => {
      document.hidden && E();
    };
    return (
      document.addEventListener("visibilitychange", F),
      () => document.removeEventListener("visibilitychange", F)
    );
  }, [D]),
    React.useEffect(() => {
      const F = (ne) => {
        if (ne.repeat) return;
        const Z = ne.target;
        if (Z && (Z.tagName === "INPUT" || Z.tagName === "TEXTAREA")) return;
        if (D === "failed" || D === "complete") {
          ne.key === "Enter" || ne.key === " "
            ? (ne.preventDefault(), b())
            : ne.key === "Escape" && (ne.preventDefault(), m());
          return;
        }
        if (D === "paused") {
          (ne.key === "Escape" || ne.key === " " || ne.key === "Enter") &&
            (ne.preventDefault(), O());
          return;
        }
        const je = ne.key.toLowerCase();
        if (je === "escape" || je === " ") {
          (ne.preventDefault(), E());
          return;
        }
        if (je === "r") {
          (ne.preventDefault(), b());
          return;
        }
        if (je === "m") {
          (ne.preventDefault(), j());
          return;
        }
        const Ze = KEY_LANES[je];
        Ze !== void 0 && (ne.preventDefault(), fe.current?.tap(Ze));
      };
      return (
        window.addEventListener("keydown", F),
        () => window.removeEventListener("keydown", F)
      );
    }, [D, m, b, j]));
  const C = topScoresFor(h, d.id, 3),
    G = C.reduce((F, ne) => Math.max(F, ne.score), Se.current),
    v = Math.max(1, Math.min(10, Math.round((B.speed - 1) * 11) + 1)),
    P = Q ? Q.score > Se.current && Q.score > 0 : !1,
    H = (F) => {
      if (!F.target?.closest("button, input, .stage-top, .game-overlay")) {
        if ((F.preventDefault(), re)) {
          (K(!1), fe.current?.unlockAudio());
          return;
        }
        $
          ? fe.current?.tapPoint(F.clientX, F.clientY)
          : fe.current?.tapAt(F.clientX);
      }
    },
    W = (F) => () => {
      ($ && performance.now() - he.current < 500) || F();
    },
    R = Math.round(B.progress * 100),
    Y = Math.min(d.duration, B.progress * d.duration);
  return jsx("div", {
    className: "game-page",
    children: jsxs("div", {
      className: "game-frame",
      children: [
        jsxs("aside", {
          className: "game-rail",
          "aria-label": "اطلاعات آهنگ",
          children: [
            jsxs("div", {
              className: "rail-card",
              children: [
                jsxs("div", {
                  className: "rail-title",
                  children: [
                    jsx(Icon, { name: "disc", size: 12 }),
                    "NOW PLAYING",
                  ],
                }),
                jsx("div", {
                  className: "rail-cover",
                  children: jsx(CoverArt, { track: d, showTitle: !0 }),
                }),
                jsx("div", {
                  className: "rail-song-title",
                  children: d.titleFa,
                }),
                jsxs("div", {
                  className: "rail-song-sub",
                  dir: "ltr",
                  children: [d.title.toUpperCase(), " · ", d.artist],
                }),
                jsxs("div", {
                  className: "rail-tags",
                  children: [
                    jsxs("span", {
                      className: "tag",
                      children: [
                        jsx(Icon, { name: "clock", size: 10 }),
                        formatDuration(d.duration),
                      ],
                    }),
                    jsx("span", {
                      className: "tag",
                      children: d.bpm > 0 ? `${d.bpm} BPM` : "AUDIO",
                    }),
                    jsxs("span", {
                      className: "tag tag-accent",
                      children: [
                        jsx(LevelDots, { level: d.difficulty }),
                        LEVEL_LABELS[d.difficulty],
                      ],
                    }),
                    jsxs("span", {
                      className: "tag",
                      children: [
                        jsx(Icon, { name: "speed", size: 10 }),
                        "سختی: ",
                        DIFFICULTIES[u].label,
                      ],
                    }),
                  ],
                }),
                jsxs("div", {
                  className: "rail-metrics",
                  children: [
                    jsxs("div", {
                      className: "metric-box",
                      children: [
                        jsx("span", { children: "بهترین شما" }),
                        jsx("b", { children: formatScore(G) }),
                      ],
                    }),
                    jsxs("div", {
                      className: "metric-box",
                      children: [
                        jsx("span", { children: "کمبو فعلی" }),
                        jsx("b", {
                          style: { color: "var(--mint)" },
                          children: B.combo,
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "metric-box",
                      children: [
                        jsx("span", { children: "دقت" }),
                        jsxs("b", { children: [B.accuracy.toFixed(0), "%"] }),
                      ],
                    }),
                    jsxs("div", {
                      className: "metric-box",
                      children: [
                        jsx("span", { children: "نت‌ها" }),
                        jsxs("b", {
                          children: [
                            B.hits,
                            jsxs("small", {
                              className: "text-cream/30",
                              style: { fontSize: 9 },
                              children: [" / ", d.notes.length],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                jsxs("div", {
                  className: "speed-meter",
                  children: [
                    jsxs("div", {
                      className: "speed-meter-head",
                      children: [
                        jsx("span", { children: "ضریب سرعت" }),
                        jsxs("b", { children: ["×", B.speed.toFixed(2)] }),
                      ],
                    }),
                    jsx("div", {
                      className: "speed-bars",
                      children: Array.from({ length: 10 }).map((F, ne) =>
                        jsx("i", { className: ne < v ? "is-on" : "" }, ne),
                      ),
                    }),
                  ],
                }),
              ],
            }),
            jsxs("div", {
              className: "rail-note",
              children: [
                jsx("b", { children: "Tip." }),
                " با هر ۱۰ کمبو، ضریب امتیاز یک پله بالا می‌رود. برای بهترین نتیجه، وسط مکعب را روی خط بزن.",
              ],
            }),
          ],
        }),
        jsx("main", {
          className: "game-main",
          children: jsx("div", {
            className: "game-main-inner",
            children: jsxs("div", {
              className: cn("stage", $ && "is-touch"),
              onPointerDown: H,
              onContextMenu: (F) => F.preventDefault(),
              children: [
                jsx("canvas", {
                  ref: Ne,
                  className: "stage-canvas",
                  "aria-label": "زمین بازی ریتم پیانو",
                }),
                jsxs("div", {
                  className: "stage-top",
                  ref: Fe,
                  children: [
                    jsxs("div", {
                      className: "stage-top-row",
                      children: [
                        jsx("button", {
                          type: "button",
                          className: "hud-icon",
                          onClick: E,
                          "aria-label": "مکث و منو",
                          children: jsx(Icon, { name: "home", size: 17 }),
                        }),
                        jsxs("div", {
                          className: "hud-center",
                          children: [
                            jsx("b", { children: d.titleFa }),
                            jsxs("span", {
                              children: [
                                jsx("i", { className: "hud-live-dot" }),
                                jsx("span", {
                                  dir: "ltr",
                                  children:
                                    d.bpm > 0 ? `${d.bpm} BPM` : "YOUR AUDIO",
                                }),
                                jsx("span", {
                                  className: "text-cream/20",
                                  children: "·",
                                }),
                                jsx("span", { children: i }),
                              ],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "stage-top-actions",
                          children: [
                            jsx("button", {
                              type: "button",
                              className: "hud-icon",
                              onClick: j,
                              "aria-label": o ? "قطع صدا" : "روشن کردن صدا",
                              children: jsx(Icon, {
                                name: o ? "volume" : "volumeOff",
                                size: 16,
                              }),
                            }),
                            jsx("button", {
                              type: "button",
                              className: "hud-icon",
                              onClick: E,
                              "aria-label": "مکث",
                              children: jsx(Icon, { name: "pause", size: 15 }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "stage-hud",
                      children: [
                        jsxs("div", {
                          children: [
                            jsxs("div", {
                              className: "hud-score-label",
                              children: [
                                jsx(Icon, { name: "sparkles", size: 10 }),
                                "SCORE",
                              ],
                            }),
                            jsxs("div", {
                              className: "hud-score",
                              children: [
                                jsx("strong", { children: formatScore(B.score) }),
                                jsxs("small", {
                                  children: ["×", B.multiplier],
                                }),
                              ],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "hud-side",
                          children: [
                            jsxs("span", {
                              className: "hud-pill",
                              children: [
                                jsx(Icon, { name: "target", size: 11 }),
                                B.accuracy.toFixed(0),
                                "%",
                              ],
                            }),
                            jsxs("span", {
                              className: cn(
                                "hud-pill",
                                B.combo > 0 && "is-combo",
                              ),
                              children: [
                                jsx(Icon, { name: "flame", size: 11 }),
                                B.combo,
                              ],
                            }),
                            jsxs("span", {
                              className: "hud-pill",
                              children: [
                                jsx(Icon, { name: "speed", size: 11 }),
                                "×",
                                B.speed.toFixed(1),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsx("div", {
                      className: "hud-progress",
                      children: jsx("div", {
                        className: "hud-progress-fill",
                        style: { width: `${R}%` },
                      }),
                    }),
                    jsxs("div", {
                      className: "hud-progress-meta",
                      children: [
                        jsxs("span", {
                          className: "num",
                          dir: "ltr",
                          children: [formatDuration(Y), " / ", formatDuration(d.duration)],
                        }),
                        jsxs("span", {
                          children: [
                            "پیشرفت ",
                            jsxs("b", {
                              className: "num text-cream/60",
                              children: [R, "%"],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                B.combo >= 3 &&
                  D !== "paused" &&
                  !Q &&
                  !$ &&
                  jsxs("div", {
                    className: "stage-combo",
                    "aria-hidden": "true",
                    children: [
                      B.combo >= 10 &&
                        jsx("span", {
                          className: "combo-flame",
                          children: jsx(Icon, { name: "flame", size: 18 }),
                        }),
                      jsx(
                        "div",
                        { className: "combo-number", children: B.combo },
                        B.combo,
                      ),
                      jsxs("span", {
                        className: "combo-label",
                        children: ["COMBO ×", B.multiplier],
                      }),
                    ],
                  }),
                ie &&
                  D !== "paused" &&
                  jsx("div", {
                    className: "judgement",
                    "aria-live": "polite",
                    children: jsxs(
                      "div",
                      {
                        className: cn("judgement-inner", `tone-${ie.tone}`),
                        children: [
                          jsx("b", { children: ie.label }),
                          jsx("span", { children: TONE_LABELS[ie.tone] }),
                        ],
                      },
                      ie.id,
                    ),
                  }),
                V !== null &&
                  !Q &&
                  D !== "paused" &&
                  jsx("div", {
                    className: "countdown",
                    "aria-live": "polite",
                    children: jsx(
                      "span",
                      {
                        className: cn("countdown-number", V === 0 && "is-go"),
                        children: V === 0 ? "GO!" : V,
                      },
                      V,
                    ),
                  }),
                re &&
                  !Q &&
                  D !== "paused" &&
                  jsxs("div", {
                    className: "gesture-note",
                    children: [
                      jsx("div", {
                        children: jsx(Icon, { name: "volume", size: 22 }),
                      }),
                      jsx("b", {
                        children: "برای شروع صدا، یک‌بار ضربه بزن",
                      }),
                      jsx("span", {
                        children: "همین یک لمس، بازی و موسیقی را روشن می‌کند.",
                      }),
                    ],
                  }),
                jsx("div", {
                  className: "stage-hint",
                  children: $
                    ? jsxs(Fragment, {
                        children: [
                          jsx(Icon, { name: "touch", size: 14 }),
                          jsx("span", {
                            children:
                              "روی خودِ مکعب‌ها بزن؛ نگذار از خط رد شوند",
                          }),
                        ],
                      })
                    : jsxs(Fragment, {
                        children: [
                          jsx("span", {
                            className: "desktop-only",
                            children: "کلیدها",
                          }),
                          jsx(KeyCaps, { compact: !0 }),
                          jsx("span", {
                            className: "desktop-only",
                            children: "· یا روی ستون لمس کن",
                          }),
                          jsx("span", {
                            className: "mobile-only",
                            children: "روی مکعب‌ها یا هر جای ستون بزن",
                          }),
                        ],
                      }),
                }),
                D === "paused" &&
                  jsx("div", {
                    className: "game-overlay",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-label": "بازی متوقف شده",
                    children: jsxs("div", {
                      className: "overlay-panel pause-panel",
                      children: [
                        jsx("div", {
                          className: "overlay-kicker",
                          children: "SESSION PAUSED",
                        }),
                        jsx("div", {
                          className: "pause-icon",
                          children: jsx(Icon, { name: "pause", size: 22 }),
                        }),
                        jsx("div", {
                          className: "pause-title",
                          children: "نفس بگیر",
                        }),
                        jsx("p", {
                          className: "pause-sub",
                          children:
                            "بازی و موسیقی متوقف شده‌اند؛ هر وقت آماده بودی ادامه بده.",
                        }),
                        jsxs("div", {
                          className: "hud-score-label mt-4 justify-center",
                          children: [
                            jsx(Icon, { name: "sparkles", size: 10 }),
                            " SCORE",
                          ],
                        }),
                        jsx("div", {
                          className: "result-score",
                          style: { marginTop: 6, padding: "8px 10px" },
                          children: jsx("strong", {
                            style: { fontSize: 28 },
                            children: formatScore(B.score),
                          }),
                        }),
                        jsx("div", {
                          className: "hud-progress mt-3",
                          children: jsx("div", {
                            className: "hud-progress-fill",
                            style: { width: `${R}%` },
                          }),
                        }),
                        jsxs("div", {
                          className: "hud-progress-meta",
                          children: [
                            jsxs("span", {
                              className: "num",
                              dir: "ltr",
                              children: [formatDuration(Y), " / ", formatDuration(d.duration)],
                            }),
                            jsxs("span", { children: [R, "% از آهنگ"] }),
                          ],
                        }),
                        jsxs("div", {
                          className: "pause-stats",
                          children: [
                            jsxs("div", {
                              children: [
                                jsx("span", { children: "سختی" }),
                                jsx("b", { children: DIFFICULTIES[u].label }),
                              ],
                            }),
                            jsxs("div", {
                              children: [
                                jsx("span", { children: "دقت" }),
                                jsxs("b", {
                                  children: [B.accuracy.toFixed(1), "%"],
                                }),
                              ],
                            }),
                            jsxs("div", {
                              children: [
                                jsx("span", { children: "بهترین کمبو" }),
                                jsx("b", { children: B.maxCombo }),
                              ],
                            }),
                            jsxs("div", {
                              children: [
                                jsx("span", { children: "ضریب" }),
                                jsxs("b", { children: ["×", B.multiplier] }),
                              ],
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
                              onClick: j,
                              "aria-label": o ? "قطع صدا" : "روشن کردن صدا",
                              children: jsx(Icon, {
                                name: o ? "volume" : "volumeOff",
                                size: 16,
                              }),
                            }),
                            jsx("input", {
                              className: "range-slider",
                              type: "range",
                              min: 0,
                              max: 1,
                              step: 0.01,
                              value: f,
                              style: { "--fill": `${Math.round(f * 100)}%` },
                              onChange: (F) => L(Number(F.target.value)),
                              "aria-label": "میزان صدا",
                            }),
                            jsxs("span", {
                              className: "volume-pct num",
                              children: [Math.round(f * 100), "%"],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "result-actions",
                          children: [
                            jsxs("button", {
                              type: "button",
                              className: "btn btn-primary btn-wide",
                              onClick: O,
                              children: [
                                jsx(Icon, { name: "play", size: 14 }),
                                "ادامه بازی",
                              ],
                            }),
                            jsxs("div", {
                              className: "result-actions-row",
                              children: [
                                jsxs("button", {
                                  type: "button",
                                  className: "btn btn-secondary btn-sm",
                                  onClick: () => {
                                    b();
                                  },
                                  children: [
                                    jsx(Icon, { name: "restart", size: 13 }),
                                    "شروع دوباره",
                                  ],
                                }),
                                jsxs("button", {
                                  type: "button",
                                  className: "btn btn-secondary btn-sm",
                                  onClick: m,
                                  children: [
                                    jsx(Icon, { name: "home", size: 13 }),
                                    "منوی اصلی",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        !$ &&
                          jsxs("div", {
                            className: "keys-line",
                            style: {
                              borderTop: 0,
                              paddingTop: 4,
                              justifyContent: "center",
                            },
                            children: [
                              jsx("span", {
                                children: "Esc ادامه · R شروع دوباره",
                              }),
                              jsx(KeyCaps, { compact: !0 }),
                            ],
                          }),
                      ],
                    }),
                  }),
                Q &&
                  jsx("div", {
                    className: "game-overlay",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-label": "پایان بازی",
                    children: jsxs("div", {
                      className: cn(
                        "overlay-panel",
                        Q.outcome === "fail" ? "is-fail" : "is-win",
                      ),
                      children: [
                        jsx("div", {
                          className: "overlay-kicker",
                          children:
                            Q.outcome === "fail" ? "RUN ENDED" : "RUN COMPLETE",
                        }),
                        jsx("div", {
                          className: cn(
                            "result-icon",
                            Q.outcome === "complete" && "is-win",
                          ),
                          children: jsx(Icon, {
                            name: Q.outcome === "fail" ? "note" : "trophy",
                            size: 26,
                          }),
                        }),
                        jsx("h2", {
                          className: "result-title",
                          children:
                            Q.outcome === "fail"
                              ? "یک نُت از دست رفت"
                              : "آهنگ کامل شد!",
                        }),
                        jsx("p", {
                          className: "result-sub",
                          children:
                            Q.outcome === "fail"
                              ? "مکعب از خط پایین عبور کرد. با یک شروع دوباره، ریتم را پس بگیر."
                              : "تا آخرین نت ادامه دادی؛ حالا نامت را روی جدول رکوردها ببین.",
                        }),
                        jsxs("div", {
                          className: "result-score",
                          children: [
                            jsx("span", { children: "FINAL SCORE" }),
                            jsx("strong", { children: formatScore(Q.score) }),
                            P &&
                              jsxs("span", {
                                className: "new-record",
                                children: [
                                  jsx(Icon, { name: "sparkles", size: 10 }),
                                  "رکورد جدید برای این آهنگ",
                                ],
                              }),
                          ],
                        }),
                        jsxs("div", {
                          className: "result-stats",
                          children: [
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#5eead4" },
                                    }),
                                    "عالی",
                                  ],
                                }),
                                jsx("b", { children: Q.perfect }),
                              ],
                            }),
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#7dd3fc" },
                                    }),
                                    "خوب",
                                  ],
                                }),
                                jsx("b", { children: Q.great }),
                              ],
                            }),
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#a78bfa" },
                                    }),
                                    "دقیق",
                                  ],
                                }),
                                jsx("b", { children: Q.good }),
                              ],
                            }),
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#fb7185" },
                                    }),
                                    "از دست رفته",
                                  ],
                                }),
                                jsx("b", { children: Q.misses }),
                              ],
                            }),
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#f8d48a" },
                                    }),
                                    "بهترین کمبو",
                                  ],
                                }),
                                jsx("b", { children: Q.maxCombo }),
                              ],
                            }),
                            jsxs("div", {
                              className: "result-stat",
                              children: [
                                jsxs("span", {
                                  children: [
                                    jsx("i", {
                                      className: "dot",
                                      style: { background: "#f0abfc" },
                                    }),
                                    "دقت",
                                  ],
                                }),
                                jsxs("b", {
                                  children: [Q.accuracy.toFixed(1), "%"],
                                }),
                              ],
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "overlay-best",
                          children: [
                            jsx(Icon, { name: "trophy", size: 11 }),
                            "بهترین تو برای «",
                            d.titleFa,
                            "»: ",
                            formatScore(Math.max(Se.current, Q.score)),
                          ],
                        }),
                        jsxs("div", {
                          className: "result-actions",
                          children: [
                            jsxs("button", {
                              type: "button",
                              className: "btn btn-primary btn-wide",
                              onClick: W(b),
                              children: [
                                jsx(Icon, { name: "restart", size: 14 }),
                                "شروع دوباره",
                              ],
                            }),
                            jsxs("button", {
                              type: "button",
                              className: "btn btn-secondary btn-sm btn-wide",
                              onClick: W(m),
                              children: [
                                jsx(Icon, { name: "home", size: 13 }),
                                "بازگشت به منوی اصلی",
                              ],
                            }),
                          ],
                        }),
                        !$ &&
                          jsx("div", {
                            className: "keys-line",
                            style: {
                              borderTop: 0,
                              paddingTop: 8,
                              justifyContent: "center",
                            },
                            children: jsx("span", {
                              children: "Enter شروع دوباره · Esc منوی اصلی",
                            }),
                          }),
                      ],
                    }),
                  }),
              ],
            }),
          }),
        }),
        jsxs("aside", {
          className: "game-rail",
          "aria-label": "رکوردها و آمار",
          children: [
            jsxs("div", {
              className: "rail-card",
              children: [
                jsxs("div", {
                  className: "rail-title",
                  children: [
                    jsx(Icon, { name: "target", size: 12 }),
                    "LIVE STATS",
                  ],
                }),
                jsxs("div", {
                  className: "flex items-center justify-between gap-3",
                  children: [
                    jsx(ProgressRing, { value: B.accuracy, size: 76 }),
                    jsxs("div", {
                      className:
                        "flex flex-col gap-2 text-[9.5px] text-cream/40",
                      children: [
                        jsxs("span", {
                          className: "flex items-center gap-1.5",
                          children: [
                            jsx("i", {
                              className: "h-1.5 w-1.5 rounded-full bg-mint",
                            }),
                            " نت‌های زده ",
                            B.hits,
                          ],
                        }),
                        jsxs("span", {
                          className: "flex items-center gap-1.5",
                          children: [
                            jsx("i", {
                              className: "h-1.5 w-1.5 rounded-full bg-sky",
                            }),
                            " کمبو فعلی ",
                            B.combo,
                          ],
                        }),
                        jsxs("span", {
                          className: "flex items-center gap-1.5",
                          children: [
                            jsx("i", {
                              className: "h-1.5 w-1.5 rounded-full bg-rose",
                            }),
                            "نت‌های باقی‌مانده ",
                            Math.max(0, B.total - B.hits),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                jsx("div", { className: "rail-divider" }),
                jsxs("div", {
                  className: "rail-title",
                  children: [
                    jsx(Icon, { name: "trophy", size: 12 }),
                    "BEST RUNS",
                  ],
                }),
                C.length === 0
                  ? jsx("p", {
                      className: "text-[10px] leading-6 text-cream/35",
                      children:
                        "هنوز رکوردی برای این آهنگ ثبت نشده. اولین نفر باش.",
                    })
                  : C.map((F, ne) =>
                      jsxs(
                        "div",
                        {
                          className: "mini-rank",
                          children: [
                            jsx("i", { children: ne + 1 }),
                            jsx("b", { children: F.player }),
                            jsx("span", { children: formatScore(F.score) }),
                          ],
                        },
                        F.id,
                      ),
                    ),
                jsx("div", { className: "rail-divider" }),
                jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    jsx("span", {
                      className: "text-[9px] text-cream/35",
                      children: "بهترین رکورد",
                    }),
                    jsx("b", {
                      className: "num text-[13px] text-gold/90",
                      children: formatScore(G),
                    }),
                  ],
                }),
              ],
            }),
            jsxs("div", {
              className: "rail-card",
              children: [
                jsxs("div", {
                  className: "rail-title",
                  children: [
                    jsx(Icon, { name: "keyboard", size: 12 }),
                    "CONTROLS",
                  ],
                }),
                jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    jsx(KeyCaps, {}),
                    jsx("span", {
                      className: "text-[9px] text-cream/35",
                      children: $ ? "روی خودِ مکعب بزن" : "لمس هم فعال است",
                    }),
                  ],
                }),
                jsx("div", { className: "rail-divider" }),
                jsxs("div", {
                  className: "flex flex-col gap-2 text-[10px] text-cream/40",
                  children: [
                    jsxs("span", {
                      className: "flex items-center justify-between",
                      children: [
                        jsx("span", { children: "مکث" }),
                        jsx("span", { className: "pill", children: "Esc" }),
                      ],
                    }),
                    jsxs("span", {
                      className: "flex items-center justify-between",
                      children: [
                        jsx("span", { children: "شروع دوباره" }),
                        jsx("span", { className: "pill", children: "R" }),
                      ],
                    }),
                    jsxs("span", {
                      className: "flex items-center justify-between",
                      children: [
                        jsx("span", { children: "صدا" }),
                        jsx("span", { className: "pill", children: "Mute" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            jsxs("div", {
              className: "rail-note",
              children: [
                "مکعب‌ها را ",
                jsx("b", { children: "قبل از خط" }),
                " بزن. یک مکعب عبورکرده یعنی پایان بازی. سرعت به‌تدریج تا پایان آهنگ بالا می‌رود.",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
