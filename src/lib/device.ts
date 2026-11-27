// @ts-nocheck
/* eslint-disable */

export function isTouchDevice() {
  return typeof window > "u" || typeof navigator > "u"
    ? !1
    : ((d) =>
          typeof window.matchMedia == "function"
            ? window.matchMedia(d).matches
            : !1)("(pointer: coarse)")
      ? !0
      : (navigator.maxTouchPoints ?? 0) === 0
        ? !1
        : navigator.userAgentData?.mobile
          ? !0
          : /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}
