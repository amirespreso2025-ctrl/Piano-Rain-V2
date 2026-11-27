// @ts-nocheck
/* eslint-disable */
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Icon } from "./icons";
import { KeyCaps } from "./parts";

export function HowToTouch() {
  return jsxs("div", {
    className: "how-steps",
    children: [
      jsxs("div", {
        className: "step-row",
        children: [
          jsx("span", { className: "step-num", children: "۰۱" }),
          jsxs("div", {
            children: [
              jsx("b", { children: "روی خودِ مکعب بزن" }),
              jsx("p", {
                children:
                  "انگشتت باید روی خودِ مکعب بنشیند؛ لمسِ ستونِ خالی حساب نمی‌شود. هر مکعب را قبل از عبور از خط پایین بزن.",
              }),
            ],
          }),
        ],
      }),
      jsxs("div", {
        className: "step-row",
        children: [
          jsx("span", { className: "step-num", children: "۰۲" }),
          jsxs("div", {
            children: [
              jsx("b", { children: "نزدیکِ خط، امتیاز بیشتر" }),
              jsx("p", {
                children:
                  "هرچه مکعب هنگام لمس به خط نزدیک‌تر باشد امتیاز بالاتری می‌گیری. سرعت هم آرام‌آرام تا پایان آهنگ بیشتر می‌شود.",
              }),
            ],
          }),
        ],
      }),
      jsxs("div", {
        className: "step-row",
        children: [
          jsx("span", { className: "step-num", children: "۰۳" }),
          jsxs("div", {
            children: [
              jsx("b", { children: "تا نتِ آخر ادامه بده" }),
              jsx("p", {
                children:
                  "اگر مکعبی کامل از خط عبور کند، بازی تمام می‌شود. مکث و شروع دوباره همیشه یک لمس فاصله دارد.",
              }),
            ],
          }),
        ],
      }),
      jsxs("div", {
        className: "keys-line",
        children: [
          jsxs("span", {
            className: "flex items-center gap-1.5",
            children: [
              jsx(Icon, { name: "touch", size: 14 }),
              "لمس مستقیم مکعب‌ها",
            ],
          }),
          jsxs("span", {
            className: "flex items-center gap-1.5",
            children: [
              jsx(Icon, { name: "pause", size: 12 }),
              "مکث با دکمه بالای صفحه",
            ],
          }),
        ],
      }),
    ],
  });
}

export function HowToKeys() {
  return jsxs(Fragment, {
    children: [
      jsxs("div", {
        className: "how-steps",
        children: [
          jsxs("div", {
            className: "step-row",
            children: [
              jsx("span", { className: "step-num", children: "۰۱" }),
              jsxs("div", {
                children: [
                  jsx("b", { children: "روی مکعب بزن" }),
                  jsx("p", {
                    children:
                      "کلید D F J K یا هر جای ستون را کلیک کن. هر مکعب را قبل از رسیدن به خط پایین بزن.",
                  }),
                ],
              }),
            ],
          }),
          jsxs("div", {
            className: "step-row",
            children: [
              jsx("span", { className: "step-num", children: "۰۲" }),
              jsxs("div", {
                children: [
                  jsx("b", { children: "زمان‌بندی، همه‌چیز است" }),
                  jsx("p", {
                    children:
                      "هرچه دقیق‌تر بزنی، کمبو و ضریب امتیاز بالاتر می‌رود. سرعت هم تا پایان آهنگ بیشتر می‌شود.",
                  }),
                ],
              }),
            ],
          }),
          jsxs("div", {
            className: "step-row",
            children: [
              jsx("span", { className: "step-num", children: "۰۳" }),
              jsxs("div", {
                children: [
                  jsx("b", { children: "تا نتِ آخر ادامه بده" }),
                  jsx("p", {
                    children:
                      "اگر مکعبی از خط عبور کند، بازی تمام می‌شود. مکث با Esc و شروع دوباره همیشه یک کلیک فاصله دارد.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      jsxs("div", {
        className: "keys-line",
        children: [
          jsx(KeyCaps, { compact: !0 }),
          jsxs("span", {
            className: "flex items-center gap-1.5",
            children: [jsx(Icon, { name: "keyboard", size: 13 }), "مکث با Esc"],
          }),
        ],
      }),
    ],
  });
}
