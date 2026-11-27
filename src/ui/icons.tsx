// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs, Fragment } from "react/jsx-runtime";

export const ICON_PATHS = {
  gamepad: jsxs(Fragment, {
    children: [
      jsx("rect", { x: "2.8", y: "7", width: "18.4", height: "10.5", rx: "5" }),
      jsx("path", { d: "M7.5 10.2v4M5.5 12.2h4" }),
      jsx("circle", { cx: "15.6", cy: "11.2", r: "0.9", fill: "currentColor" }),
      jsx("circle", { cx: "17.8", cy: "13.4", r: "0.9", fill: "currentColor" }),
    ],
  }),
  leaf: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M5 19c0-8 5-13.5 14.5-14.5C19.5 14 14 19 5 19Z" }),
      jsx("path", { d: "M5 19c2.5-4.5 5.5-7.5 9-9.5" }),
    ],
  }),
  heart: jsx("path", { d: "M12 19.5s-7-4.3-7-9.7A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.2c0 5.4-7 9.7-7 9.7Z" }),
  play: jsx("path", {
    d: "M8 5.5 19 12 8 18.5Z",
    fill: "currentColor",
    stroke: "none",
  }),
  pause: jsxs(Fragment, {
    children: [
      jsx("rect", {
        x: "6.5",
        y: "5",
        width: "4",
        height: "14",
        rx: "1.2",
        fill: "currentColor",
        stroke: "none",
      }),
      jsx("rect", {
        x: "13.5",
        y: "5",
        width: "4",
        height: "14",
        rx: "1.2",
        fill: "currentColor",
        stroke: "none",
      }),
    ],
  }),
  home: jsx("path", { d: "M4 11.2 12 4.5l8 6.7V20h-5.4v-5.4H9.4V20H4Z" }),
  upload: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M12 16.5V5.5" }),
      jsx("path", { d: "m7.5 9.8 4.5-4.3 4.5 4.3" }),
      jsx("path", { d: "M4.5 16v3.5h15V16" }),
    ],
  }),
  music: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M9 17.5V6l10-2.2v11" }),
      jsx("circle", { cx: "6.4", cy: "18", r: "2.8" }),
      jsx("circle", { cx: "16.4", cy: "15.3", r: "2.8" }),
    ],
  }),
  trophy: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M8 4h8v5.2a4 4 0 0 1-8 0Z" }),
      jsx("path", { d: "M8 6H5v1.8a3 3 0 0 0 3 3" }),
      jsx("path", { d: "M16 6h3v1.8a3 3 0 0 1-3 3" }),
      jsx("path", { d: "M12 13.2V16.5" }),
      jsx("path", { d: "M8.6 20h6.8" }),
      jsx("path", { d: "M9.4 16.5h5.2l.6 3.5H8.8Z" }),
    ],
  }),
  flame: jsx("path", {
    d: "M12 3.5c.7 3.5 4.8 4.6 4.8 9a4.8 4.8 0 0 1-9.6 0c0-2 .9-3.3 1.8-4.2.2 1.4.8 2.3 1.7 2.7.6-2.7.9-5.1 1.3-7.5Z",
  }),
  target: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "12", r: "7.5" }),
      jsx("circle", { cx: "12", cy: "12", r: "3.4" }),
      jsx("path", { d: "M12 2v3M12 19v3M2 12h3M19 12h3" }),
    ],
  }),
  speed: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4.5 17.5a8.5 8.5 0 1 1 15 0" }),
      jsx("path", { d: "m12 13 4-3.5" }),
      jsx("circle", { cx: "12", cy: "13.6", r: "1.4", fill: "currentColor" }),
    ],
  }),
  volume: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4Z" }),
      jsx("path", { d: "M15.4 9a4.4 4.4 0 0 1 0 6" }),
      jsx("path", { d: "M17.8 6.6a7.8 7.8 0 0 1 0 10.8" }),
    ],
  }),
  volumeOff: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4Z" }),
      jsx("path", { d: "m16 9.5 5 5M21 9.5l-5 5" }),
    ],
  }),
  restart: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4.8 10.4A7.7 7.7 0 1 1 5.7 16" }),
      jsx("path", { d: "M4.3 4.8v5.6H10" }),
    ],
  }),
  close: jsx("path", { d: "m6 6 12 12M18 6 6 18" }),
  check: jsx("path", { d: "m4.5 12.5 5 5 10-11" }),
  trash: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4.5 7h15" }),
      jsx("path", { d: "M9 7V4.5h6V7" }),
      jsx("path", { d: "M6.5 7l.8 12.5h9.4L17.5 7" }),
      jsx("path", { d: "M10 10.5v6M14 10.5v6" }),
    ],
  }),
  clock: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "12", r: "8" }),
      jsx("path", { d: "M12 7.5V12l3 2" }),
    ],
  }),
  medal: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "14.5", r: "5.5" }),
      jsx("path", { d: "m8.5 9.7-2.3-6h4l1.8 4.3L13.8 3.7h4l-2.3 6" }),
      jsx("path", {
        d: "m12 12 .8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2Z",
      }),
    ],
  }),
  note: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M10 17.5V6.8l8-1.8v9.3" }),
      jsx("ellipse", { cx: "7.4", cy: "18", rx: "2.7", ry: "2.1" }),
      jsx("ellipse", { cx: "15.4", cy: "16.2", rx: "2.7", ry: "2.1" }),
    ],
  }),
  keyboard: jsxs(Fragment, {
    children: [
      jsx("rect", {
        x: "2.8",
        y: "6.5",
        width: "18.4",
        height: "11",
        rx: "2.2",
      }),
      jsx("path", { d: "M7 10v1.6M11 10v1.6M15 10v1.6M17.6 10v1.6" }),
      jsx("path", { d: "M6.5 14.4h11" }),
    ],
  }),
  arrow: jsx("path", { d: "M4.5 12h15m0 0-5.5-5.5M19.5 12 14 17.5" }),
  chevron: jsx("path", { d: "m9 5 7 7-7 7" }),
  sparkles: jsxs(Fragment, {
    children: [
      jsx("path", {
        d: "M12 3.5 13.7 9l5.3 1.7-5.3 1.7L12 18l-1.7-5.6L5 10.7l5.3-1.7Z",
      }),
      jsx("path", {
        d: "M18.7 16.2 19.4 18l1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z",
      }),
    ],
  }),
  info: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "12", r: "8.5" }),
      jsx("path", { d: "M12 11v5.5" }),
      jsx("path", { d: "M12 7.6v.2" }),
    ],
  }),
  headphones: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M4.5 15v-3a7.5 7.5 0 0 1 15 0v3" }),
      jsx("rect", {
        x: "3.2",
        y: "13.5",
        width: "4",
        height: "6.5",
        rx: "2",
      }),
      jsx("rect", {
        x: "16.8",
        y: "13.5",
        width: "4",
        height: "6.5",
        rx: "2",
      }),
    ],
  }),
  disc: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "12", r: "8.5" }),
      jsx("circle", { cx: "12", cy: "12", r: "2" }),
      jsx("path", { d: "M12 3.5v3M12 17.5v3" }),
    ],
  }),
  user: jsxs(Fragment, {
    children: [
      jsx("circle", { cx: "12", cy: "8.5", r: "3.4" }),
      jsx("path", { d: "M5 20c.6-3.5 3.4-5.5 7-5.5s6.4 2 7 5.5" }),
    ],
  }),
  star: jsx("path", {
    d: "m12 3.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8Z",
  }),
  touch: jsxs(Fragment, {
    children: [
      jsx("path", { d: "M7.2 6.2a4.4 4.4 0 0 1 7.6 0" }),
      jsx("path", { d: "M9.5 14.5V7.3a1.5 1.5 0 0 1 3 0v4.9" }),
      jsx("path", {
        d: "m12.5 12.2 3.4.7a2 2 0 0 1 1.6 2v1.4a4.4 4.4 0 0 1-4.4 4.4h-1.3a4 4 0 0 1-3.2-1.6l-2.3-3.1a1.3 1.3 0 0 1 2-1.6l1.2 1.3",
      }),
    ],
  }),
};

export function Icon({ name: d, size: i = 20, className: u, ...o }) {
  return jsx("svg", {
    viewBox: "0 0 24 24",
    width: i,
    height: i,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: u,
    ...o,
    children: ICON_PATHS[d],
  });
}
