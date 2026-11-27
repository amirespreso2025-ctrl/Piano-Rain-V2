// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { bestScoreFor, deleteUploadedTrack, loadPlayerName, loadScores, loadSettings, loadUploadedAudio, loadUploadedTracks, savePlayerName, saveScore, saveSettings, saveUploadedTrack } from "./lib/storage";
import { BUILTIN_TRACKS, DEFAULT_TRACK } from "./music/songs";
import { applyTheme } from "./game/config";
import { decodeAudio } from "./audio/engine";
import { importAudioFile, reanalyzeAudio } from "./audio/upload";
import { GameScreen } from "./ui/GameScreen";
import { HomeScreen } from "./ui/HomeScreen";
import { Icon } from "./ui/icons";

export function newId() {
  return typeof crypto < "u" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [d, i] = React.useState("menu"),
    [u, o] = React.useState([]),
    [f, h] = React.useState(DEFAULT_TRACK.id),
    [g, S] = React.useState(() => loadScores()),
    [m, b] = React.useState(() => loadSettings()),
    [j, L] = React.useState(() => loadPlayerName()),
    [D, X] = React.useState({ state: "idle" }),
    [B, U] = React.useState(!1),
    [V, q] = React.useState(null),
    [ie, se] = React.useState(0),
    [Q, de] = React.useState(null),
    re = React.useMemo(() => [...BUILTIN_TRACKS, ...u], [u]),
    K = re.find((E) => E.id === f) ?? DEFAULT_TRACK;
  (React.useEffect(() => {
    let E = !1;
    return (
      loadUploadedTracks().then((O) => {
        E || o(O);
      }),
      () => {
        E = !0;
      }
    );
  }, []),
    React.useEffect(() => {
      if (!Q) return;
      const E = window.setTimeout(() => de(null), 4200);
      return () => window.clearTimeout(E);
    }, [Q]),
    React.useEffect(() => {
      applyTheme(m.theme);
    }, [m.theme]));
  const $ = (E) => {
      b((O) => {
        const C = { ...O, ...E };
        return (saveSettings(C), C);
      });
    },
    he = (E) => {
      (L(E), savePlayerName(E));
    },
    Fe = (E) => {
      (q(E), se((O) => O + 1), i("game"), window.scrollTo({ top: 0 }));
    },
    Ne = async (E) => {
      if ((h(E.id), E.kind === "uploaded" && !E.buffer)) {
        U(!0);
        try {
          const O = await loadUploadedAudio(E.id);
          if (!O) throw new Error("missing");
          const C = await decodeAudio(O),
            G = { ...E, buffer: C, ...reanalyzeAudio(C) };
          (o((v) => v.map((P) => (P.id === E.id ? G : P))), Fe(G));
        } catch {
          de("فایل صوتی این آهنگ پیدا نشد. دوباره آن را اضافه کن.");
        } finally {
          U(!1);
        }
        return;
      }
      Fe(E);
    },
    fe = async (E) => {
      (d === "menu" && window.history.replaceState(null, "", "#mine"),
        X({ state: "loading", name: E.name }));
      try {
        const O = await importAudioFile(E);
        let C = !0;
        try {
          await saveUploadedTrack(O.track, O.raw);
        } catch {
          C = !1;
        }
        (o((G) => [O.track, ...G.filter((v) => v.id !== O.track.id)]),
          h(O.track.id),
          X({
            state: "success",
            message: C
              ? `«${O.track.titleFa}» آماده است. روی کارت بزن و بازی کن.`
              : "آهنگ آماده است، اما ذخیره دائمی در حافظه ممکن نشد.",
          }));
      } catch (O) {
        X({
          state: "error",
          message:
            O instanceof Error
              ? O.message
              : "خواندن فایل ممکن نشد. یک فایل صوتی دیگر امتحان کن.",
        });
      }
    },
    Ae = async (E) => {
      (o((O) => O.filter((C) => C.id !== E)),
        f === E && h(DEFAULT_TRACK.id),
        await deleteUploadedTrack(E));
    },
    Be = (E) => {
      if (!V || E.score <= 0) return;
      const O = {
        id: newId(),
        songId: V.id,
        songTitle: V.titleFa,
        player: j.trim() || "نوازنده",
        score: E.score,
        accuracy: E.accuracy,
        maxCombo: E.maxCombo,
        date: Date.now(),
        kind: V.kind,
      };
      S(saveScore(O));
    },
    Se = () => {
      (i("menu"), q(null), window.scrollTo({ top: 0 }));
    },
    k = () => {
      se((E) => E + 1);
    };
  return jsxs(Fragment, {
    children: [
      d === "game" && V
        ? jsx(
            GameScreen,
            {
              track: V,
              playerName: j.trim() || "نوازنده",
              difficulty: m.difficulty,
              soundOn: m.sound,
              volume: m.volume,
              scores: g,
              previousBest: bestScoreFor(g, V.id),
              onResult: Be,
              onExit: Se,
              onRestart: k,
              onToggleSound: () => $({ sound: !m.sound }),
              onVolumeChange: (E) => $({ volume: E }),
            },
            `${V.id}-${ie}`,
          )
        : jsx(HomeScreen, {
            tracks: re,
            uploadedTracks: u,
            selected: K,
            scores: g,
            playerName: j,
            soundOn: m.sound,
            settings: m,
            onSettings: $,
            uploadStatus: D,
            playBusy: B,
            onPlay: Ne,
            onUpload: fe,
            onDeleteUpload: Ae,
            onSelect: (E) => h(E.id),
            onToggleSound: () => $({ sound: !m.sound }),
            onPlayerName: he,
          }),
      Q &&
        jsxs("div", {
          className:
            "fixed inset-x-4 bottom-5 z-[90] mx-auto flex max-w-[420px] items-center gap-2.5 rounded-2xl border border-rose-200/15 bg-[#140d15]/95 px-4 py-3 text-[11px] text-rose-100 shadow-2xl backdrop-blur-xl",
          role: "status",
          children: [
            jsx(Icon, { name: "info", size: 15 }),
            jsx("span", { children: Q }),
            jsx("button", {
              type: "button",
              className: "mr-auto text-rose-100/40 hover:text-rose-100",
              onClick: () => de(null),
              "aria-label": "بستن",
              children: jsx(Icon, { name: "close", size: 13 }),
            }),
          ],
        }),
    ],
  });
}
