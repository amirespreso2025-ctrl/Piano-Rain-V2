// @ts-nocheck
/* eslint-disable */

export function mulberry32(d) {
  let i = d >>> 0;
  return () => {
    ((i |= 0), (i = (i + 1831565813) | 0));
    let u = Math.imul(i ^ (i >>> 15), 1 | i);
    return (
      (u = (u + Math.imul(u ^ (u >>> 7), 61 | u)) ^ u),
      ((u ^ (u >>> 14)) >>> 0) / 4294967296
    );
  };
}

export function hashString(d) {
  let i = 2166136261;
  for (let u = 0; u < d.length; u++)
    ((i ^= d.charCodeAt(u)), (i = Math.imul(i, 16777619)));
  return i >>> 0;
}

export function createLaneWalker(d) {
  let i = -1;
  return () => {
    if (i < 0) return ((i = Math.floor(d() * 4)), i);
    const u = d(),
      o = u < 0.68 ? 1 : u < 0.92 ? 2 : 3,
      f = d() < 0.5 ? -1 : 1;
    let h = (((i + f * o) % 4) + 4) % 4;
    return (h === i && (h = (i + 1) % 4), (i = h), h);
  };
}
