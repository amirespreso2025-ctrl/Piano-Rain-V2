import type { ReactElement } from "react";

/**
 * One hand-drawn SVG illustration per built-in song (viewBox 160 × 120, 4:3 like the cover).
 * Everything is vector code — no image files.
 */

const Stars = ({ pts, fill = "#fff" }: { pts: [number, number, number?][]; fill?: string }) => (
  <g fill={fill}>
    {pts.map(([x, y, r = 1], i) => (
      <circle key={i} cx={x} cy={y} r={r} opacity={0.5 + ((i * 37) % 50) / 100} />
    ))}
  </g>
);

const star5 = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r : R;
    return `${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`;
  }).join(" ");

const Grad = ({ id, stops, vertical = true }: { id: string; stops: [number, string][]; vertical?: boolean }) => (
  <linearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 0}>
    {stops.map(([o, c]) => (
      <stop key={o} offset={o} stopColor={c} />
    ))}
  </linearGradient>
);

const Cloud = ({ x, y, s = 1, fill = "#fff", o = 1 }: { x: number; y: number; s?: number; fill?: string; o?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} opacity={o}>
    <ellipse cx="0" cy="0" rx="16" ry="7" />
    <circle cx="-7" cy="-6" r="8" />
    <circle cx="6" cy="-8" r="10" />
  </g>
);

const SCENES: Record<string, () => ReactElement> = {
  /* ───────── GAMES ───────── */
  "super-mario": () => (
    <>
      <defs><Grad id="mario-sky" stops={[[0, "#4b7bff"], [1, "#a7d8ff"]]} /></defs>
      <rect width="160" height="120" fill="url(#mario-sky)" />
      <Cloud x={34} y={26} s={0.9} />
      <Cloud x={128} y={20} s={0.7} />
      <rect y="96" width="160" height="24" fill="#c2410c" />
      <g stroke="#7c2d12" strokeWidth="1.2">
        <path d="M0 104h160M0 112h160" />
        {[0, 20, 40, 60, 80, 100, 120, 140].map((x) => <path key={x} d={`M${x + 10} 96v8M${x} 104v8M${x + 10} 112v8`} />)}
      </g>
      <rect y="94" width="160" height="4" fill="#22c55e" />
      <g>
        <rect x="112" y="64" width="26" height="32" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
        <rect x="108" y="58" width="34" height="12" rx="2" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
        <rect x="114" y="62" width="4" height="5" fill="#86efac" />
      </g>
      <rect x="100" y="22" width="22" height="22" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
      <text x="111" y="39" fontSize="16" fontWeight="800" textAnchor="middle" fill="#92400e" fontFamily="Sora, sans-serif">?</text>
      <g transform="translate(58 62)">
        <path d="M-30 4a30 26 0 0 1 60 0Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle cx="-14" cy="-8" r="7" fill="#fff" /><circle cx="14" cy="-8" r="7" fill="#fff" /><ellipse cx="0" cy="-18" rx="6" ry="5" fill="#fff" />
        <path d="M-20 4h40v16a8 8 0 0 1-8 8h-24a8 8 0 0 1-8-8Z" fill="#fde7c2" stroke="#7f1d1d" strokeWidth="1.5" />
        <ellipse cx="-6" cy="14" rx="2.2" ry="4" fill="#1c1917" /><ellipse cx="6" cy="14" rx="2.2" ry="4" fill="#1c1917" />
      </g>
    </>
  ),
  "tetris-a": () => {
    const B = ({ x, y, c }: { x: number; y: number; c: string }) => <rect x={x} y={y} width="13" height="13" rx="2" fill={c} stroke="#ffffff55" strokeWidth="1" />;
    return (
      <>
        <defs><Grad id="tet-bg" stops={[[0, "#0b1030"], [1, "#1b1450"]]} /></defs>
        <rect width="160" height="120" fill="url(#tet-bg)" />
        <g stroke="#ffffff10">
          {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 13.3} 0v120`} />)}
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${i * 13.3}h160`} />)}
        </g>
        {/* stack */}
        {[[40, 94, "#22d3ee"], [53, 94, "#22d3ee"], [66, 94, "#22d3ee"], [79, 94, "#22d3ee"], [92, 94, "#facc15"], [105, 94, "#facc15"], [92, 107, "#facc15"], [105, 107, "#facc15"],
          [40, 107, "#a855f7"], [53, 107, "#a855f7"], [66, 107, "#a855f7"], [53, 81, "#a855f7"], [118, 107, "#22c55e"], [131, 107, "#22c55e"], [131, 94, "#22c55e"], [27, 107, "#ef4444"], [27, 94, "#ef4444"], [14, 107, "#ef4444"]].map(([x, y, c], i) => (
          <B key={i} x={x as number} y={y as number} c={c as string} />
        ))}
        {/* falling L piece */}
        <g opacity="0.95">
          {[[72, 18], [72, 31], [72, 44], [85, 44]].map(([x, y], i) => <B key={i} x={x} y={y} c="#fb923c" />)}
        </g>
        <g opacity="0.35">{[[72, 56], [72, 69], [72, 82], [85, 82]].map(([x, y], i) => <rect key={i} x={x} y={y} width="13" height="13" rx="2" fill="none" stroke="#fb923c" strokeDasharray="3 2" />)}</g>
        <g>{[[118, 20], [131, 20], [118, 33], [131, 33]].map(([x, y], i) => <B key={i} x={x} y={y} c="#facc15" />)}</g>
      </>
    );
  },
  "song-of-storms": () => (
    <>
      <defs><Grad id="storm-bg" stops={[[0, "#1e293b"], [1, "#475569"]]} /></defs>
      <rect width="160" height="120" fill="url(#storm-bg)" />
      <g stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${14 + i * 9.5} ${52 + (i % 3) * 8}l-5 14`} />)}
      </g>
      <Cloud x={50} y={36} s={2} fill="#64748b" />
      <Cloud x={104} y={30} s={1.7} fill="#94a3b8" />
      <Cloud x={80} y={44} s={1.5} fill="#cbd5e1" />
      <polygon points="86,48 70,76 82,76 74,100 100,66 88,66 96,48" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
      <g fill="none" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M14 100c18-8 32 6 50-2s20-8 30-4" /><path d="M96 108c16-6 28 4 46-2" />
      </g>
      <g transform="translate(26 82) rotate(-18)">
        <ellipse cx="0" cy="0" rx="13" ry="8" fill="#38bdf8" stroke="#075985" strokeWidth="1.5" />
        <circle cx="-3" cy="-1" r="1.4" fill="#075985" /><circle cx="2" cy="-1" r="1.4" fill="#075985" /><circle cx="7" cy="-1" r="1.4" fill="#075985" />
        <rect x="9" y="-3" width="10" height="6" rx="3" fill="#7dd3fc" stroke="#075985" strokeWidth="1.2" />
      </g>
    </>
  ),
  megalovania: () => (
    <>
      <defs>
        <Grad id="mega-bg" stops={[[0, "#0a0a23"], [1, "#25126b"]]} />
        <radialGradient id="mega-glow"><stop offset="0" stopColor="#38bdf8" stopOpacity=".7" /><stop offset="1" stopColor="#38bdf8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="160" height="120" fill="url(#mega-bg)" />
      <circle cx="80" cy="56" r="56" fill="url(#mega-glow)" opacity=".5" />
      <g stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" opacity=".5">
        <path d="M12 20l16 8-8 8M148 24l-16 6 8 8M10 96l18-6M150 98l-16-8" />
      </g>
      <path d="M80 18c-24 0-38 15-38 34 0 11 5 18 12 23v12h52V75c7-5 12-12 12-23 0-19-14-34-38-34Z" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="2" />
      <ellipse cx="65" cy="54" rx="9.5" ry="11" fill="#0f172a" />
      <ellipse cx="97" cy="54" rx="9.5" ry="11" fill="#0f172a" />
      <circle cx="97" cy="54" r="5" fill="#38bdf8" /><circle cx="97" cy="54" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity=".8" />
      <path d="M80 62l-4 10h8Z" fill="#0f172a" />
      <g stroke="#0f172a" strokeWidth="1.6"><path d="M62 87v10M72 87v10M82 87v10M92 87v10M102 87v10M58 90h48" /></g>
      <rect x="56" y="87" width="52" height="11" rx="4" fill="none" stroke="#c7d2fe" strokeWidth="1.5" />
    </>
  ),

  /* ───────── CALM ───────── */
  "silent-night": () => (
    <>
      <defs><Grad id="sn-bg" stops={[[0, "#0b1d3a"], [1, "#27508a"]]} /></defs>
      <rect width="160" height="120" fill="url(#sn-bg)" />
      <circle cx="80" cy="26" r="22" fill="#fde68a" opacity=".16" />
      <circle cx="80" cy="26" r="12" fill="#fde68a" opacity=".22" />
      <polygon points={star5(80, 26, 11, 4.5)} fill="#fef3c7" stroke="#fde047" strokeWidth="1" strokeLinejoin="round" />
      <Stars pts={[[18, 14], [34, 34], [52, 10], [110, 12], [132, 30], [146, 12], [24, 52], [140, 52], [64, 44, 0.8], [100, 46, 0.8]]} />
      <path d="M0 92c26-14 52-18 80-8s56 4 80-8v44H0Z" fill="#e0f2fe" />
      <path d="M0 104c30-8 56-4 84 2s52 0 76-6v20H0Z" fill="#bae6fd" />
      {[[26, 92, 1], [46, 96, 0.75], [122, 90, 1.1], [142, 98, 0.8]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-1.5" y="0" width="3" height="6" fill="#5b3a29" />
          <polygon points="0,-26 -11,-8 11,-8" fill="#14532d" /><polygon points="0,-18 -14,2 14,2" fill="#166534" />
          <path d="M-8-8q8 4 16 0M-10 0q10 5 20 0" stroke="#f0f9ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <rect x="70" y="84" width="22" height="16" fill="#7c4a2d" /><polygon points="66,84 81,72 96,84" fill="#f8fafc" /><rect x="77" y="88" width="8" height="8" fill="#fde047" />
    </>
  ),
  "brahms-lullaby": () => (
    <>
      <defs><Grad id="br-bg" stops={[[0, "#2e1a5e"], [1, "#7c4ea8"]]} /></defs>
      <rect width="160" height="120" fill="url(#br-bg)" />
      <Stars pts={[[18, 20], [40, 48, 1.4], [124, 16, 1.4], [142, 44], [100, 30], [70, 14], [20, 84], [148, 84, 1.3]]} />
      <path d="M96 20a36 36 0 1 0 0 70a28 28 0 1 1 0-70Z" fill="#fde9ff" />
      <path d="M96 20a36 36 0 1 0 0 70a28 28 0 1 1 0-70Z" fill="none" stroke="#fff" strokeOpacity=".5" />
      <g fill="#6b3d99"><path d="M52 50q3 4 7 0" stroke="#6b3d99" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
      <Cloud x={60} y={92} s={1.4} fill="#f5d0fe" o={0.9} />
      <Cloud x={118} y={98} s={1.1} fill="#e9d5ff" o={0.85} />
      <g fill="#f5d0fe" fontFamily="Sora, sans-serif" fontWeight="800"><text x="120" y="54" fontSize="14">z</text><text x="132" y="42" fontSize="10">z</text><text x="141" y="33" fontSize="7">z</text></g>
    </>
  ),
  "morning-mood": () => (
    <>
      <defs>
        <Grad id="mm-bg" stops={[[0, "#6d28d9"], [0.45, "#f472b6"], [0.8, "#fdba74"], [1, "#fde68a"]]} />
        <radialGradient id="mm-sun"><stop offset="0" stopColor="#fff7d6" /><stop offset="1" stopColor="#fbbf24" /></radialGradient>
      </defs>
      <rect width="160" height="120" fill="url(#mm-bg)" />
      <g stroke="#fff7d6" strokeWidth="2" strokeLinecap="round" opacity=".55">
        {Array.from({ length: 11 }, (_, i) => { const a = Math.PI + (Math.PI / 10) * i; return <path key={i} d={`M${80 + Math.cos(a) * 34} ${86 + Math.sin(a) * 34}L${80 + Math.cos(a) * 54} ${86 + Math.sin(a) * 54}`} />; })}
      </g>
      <circle cx="80" cy="86" r="28" fill="url(#mm-sun)" />
      <path d="M0 84l30-26 22 20 28-34 26 36 20-18 34 32v26H0Z" fill="#7c3aed" opacity=".75" />
      <path d="M0 98l24-20 26 18 30-24 30 26 24-16 26 20v18H0Z" fill="#4c1d95" opacity=".9" />
      <path d="M0 110c40-8 80-6 160 0v10H0Z" fill="#2e1065" />
      <g fill="none" stroke="#3b0764" strokeWidth="1.6" strokeLinecap="round"><path d="M24 30q4-5 8 0q4-5 8 0M52 20q3-4 6 0q3-4 6 0M118 28q3-4 6 0q3-4 6 0" /></g>
    </>
  ),
  "twinkle-twinkle": () => (
    <>
      <defs><Grad id="tw-bg" stops={[[0, "#1e1b4b"], [1, "#4338ca"]]} /><radialGradient id="tw-glow"><stop offset="0" stopColor="#fde047" stopOpacity=".6" /><stop offset="1" stopColor="#fde047" stopOpacity="0" /></radialGradient></defs>
      <rect width="160" height="120" fill="url(#tw-bg)" />
      <circle cx="80" cy="54" r="48" fill="url(#tw-glow)" />
      <Stars pts={[[16, 20], [34, 66, 1.4], [132, 20, 1.4], [146, 62], [112, 100], [22, 100, 1.3], [58, 14], [102, 12]]} />
      {[[24, 38, 0.5], [138, 40, 0.45], [128, 88, 0.4], [30, 86, 0.4]].map(([x, y, s], i) => (
        <polygon key={i} transform={`translate(${x} ${y}) scale(${s})`} points={star5(0, 0, 14, 6)} fill="#fef08a" />
      ))}
      <g transform="translate(80 54) rotate(-8)">
        <polygon points={star5(0, 0, 34, 15)} fill="#fde047" stroke="#facc15" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="-7" cy="-2" r="2.6" fill="#78350f" /><circle cx="7" cy="-2" r="2.6" fill="#78350f" />
        <path d="M-7 7q7 6 14 0" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="-12" cy="4" r="3" fill="#fb7185" opacity=".6" /><circle cx="12" cy="4" r="3" fill="#fb7185" opacity=".6" />
      </g>
      <path d="M96 108c12-4 22-10 34-10" stroke="#fde68a" strokeDasharray="1 5" strokeLinecap="round" strokeWidth="2" fill="none" opacity=".6" />
    </>
  ),

  /* ───────── EMOTIONAL ───────── */
  "fur-elise": () => (
    <>
      <defs><Grad id="fe-bg" stops={[[0, "#2a0a1d"], [1, "#6b1d3f"]]} /></defs>
      <rect width="160" height="120" fill="url(#fe-bg)" />
      <g fill="#fda4af" opacity=".5">{[[20, 20, 3], [140, 30, 2.4], [128, 12, 1.8], [30, 62, 2]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
      <path d="M76 66c-2 18 2 30 -2 40" stroke="#166534" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M75 92c-14-2-22-10-24-18 12 0 22 6 24 18Z" fill="#16a34a" />
      <path d="M77 82c12-2 20-8 24-16-12 0-21 6-24 16Z" fill="#15803d" />
      <g transform="translate(78 44)">
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-15" rx="13" ry="17" fill="#e11d48" transform={`rotate(${a})`} stroke="#9f1239" strokeWidth="1" />)}
        {[36, 108, 180, 252, 324].map((a) => <ellipse key={a} cx="0" cy="-9" rx="9" ry="11" fill="#fb7185" transform={`rotate(${a})`} stroke="#be123c" strokeWidth=".8" />)}
        <circle r="7" fill="#be123c" /><path d="M-4 0a4 4 0 0 1 8 0M-2 2a2.5 2.5 0 0 1 4 0" stroke="#fda4af" strokeWidth="1.2" fill="none" />
      </g>
      <g>
        <rect x="14" y="96" width="132" height="20" rx="3" fill="#fff1f2" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${14 + (i + 1) * 13.2} 96v20`} stroke="#9f1239" strokeOpacity=".4" />)}
        {[1, 2, 4, 5, 6, 8].map((k) => <rect key={k} x={14 + k * 13.2 - 4} y="96" width="8" height="12" rx="1.5" fill="#2a0a1d" />)}
      </g>
      <g fill="#fecdd3" fontFamily="Sora, sans-serif"><text x="110" y="48" fontSize="18">♪</text><text x="26" y="44" fontSize="14">♫</text></g>
    </>
  ),
  greensleeves: () => (
    <>
      <defs><Grad id="gs-bg" stops={[[0, "#052e16"], [1, "#166534"]]} /></defs>
      <rect width="160" height="120" fill="url(#gs-bg)" />
      <path d="M0 96c30-12 60-10 90-2s48 6 70-4v30H0Z" fill="#14532d" opacity=".8" />
      <g fill="#4ade80" opacity=".75">
        {[[16, 22, -30], [36, 60, 20], [140, 24, 40], [128, 70, -20], [20, 92, 10], [146, 100, -40]].map(([x, y, r], i) => (
          <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0c8-12 20-12 24 0-12 8-20 8-24 0Z" />
        ))}
      </g>
      <path d="M8 40c26 18 40-18 70 0s48 28 76 6" stroke="#86efac" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".5" />
      <g transform="translate(76 62) rotate(-28)">
        <rect x="14" y="-5" width="48" height="10" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
        <rect x="58" y="-8" width="14" height="16" rx="3" fill="#78350f" />
        {[-5, 0, 5].map((y) => <circle key={y} cx="65" cy={y} r="1.6" fill="#fde68a" />)}
        <ellipse cx="0" cy="0" rx="26" ry="22" fill="#d97706" stroke="#451a03" strokeWidth="2" />
        <ellipse cx="-2" cy="0" rx="22" ry="18" fill="none" stroke="#fbbf24" strokeWidth="1" opacity=".6" />
        <circle cx="2" cy="0" r="7" fill="#451a03" /><circle cx="2" cy="0" r="9.5" fill="none" stroke="#fde68a" strokeWidth="1.2" />
        <g stroke="#fef3c7" strokeWidth=".8"><path d="M-8 -16v32M-3 -17v34M-13 -14v28" /></g>
      </g>
    </>
  ),
  "auld-lang-syne": () => (
    <>
      <defs><Grad id="al-bg" stops={[[0, "#120a1f"], [1, "#3b1a4a"]]} /></defs>
      <rect width="160" height="120" fill="url(#al-bg)" />
      {[[44, 40, "#fde047", 1], [112, 34, "#fb7185", 1.1], [84, 62, "#fbbf24", 0.8], [140, 70, "#c4b5fd", 0.6], [20, 74, "#f0abfc", 0.6]].map(([x, y, c, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} stroke={c as string} strokeLinecap="round" strokeWidth="2.2">
          {Array.from({ length: 12 }, (_, k) => { const a = (Math.PI / 6) * k; return <path key={k} d={`M${Math.cos(a) * 7} ${Math.sin(a) * 7}L${Math.cos(a) * (k % 2 ? 18 : 24)} ${Math.sin(a) * (k % 2 ? 18 : 24)}`} />; })}
          <circle r="2.4" fill={c as string} stroke="none" />
        </g>
      ))}
      <g transform="translate(58 112) rotate(-14)">
        <path d="M-10 -30h20l-3 22q-1 8-7 8t-7-8Z" fill="#fde68a" opacity=".85" /><rect x="-1.2" y="0" width="2.4" height="8" fill="#fde68a" /><rect x="-7" y="8" width="14" height="2.6" rx="1.3" fill="#fde68a" />
      </g>
      <g transform="translate(102 112) rotate(14)">
        <path d="M-10 -30h20l-3 22q-1 8-7 8t-7-8Z" fill="#fda4af" opacity=".85" /><rect x="-1.2" y="0" width="2.4" height="8" fill="#fda4af" /><rect x="-7" y="8" width="14" height="2.6" rx="1.3" fill="#fda4af" />
      </g>
      <g fill="#fff"><path d="M80 82l1.8 4.2 4.2 1.8-4.2 1.8L80 94l-1.8-4.2L74 88l4.2-1.8Z" /></g>
    </>
  ),
  "canon-in-d": () => (
    <>
      <defs><Grad id="cd-bg" stops={[[0, "#06223a"], [1, "#0c5a7a"]]} /></defs>
      <rect width="160" height="120" fill="url(#cd-bg)" />
      <g fill="none" stroke="#7dd3fc" strokeWidth="1.2" opacity=".3">
        <path d="M0 96c20-8 40 8 60 0s40-8 60 0 30 6 40 2M0 106c20-8 40 8 60 0s40-8 60 0 30 6 40 2" />
      </g>
      <g stroke="#bae6fd" opacity=".5" strokeWidth=".8">{[28, 34, 40, 46, 52].map((y) => <path key={y} d={`M0 ${y - 22}h160`} />)}</g>
      <g transform="translate(80 62) rotate(-24)">
        <rect x="-2.5" y="-60" width="5" height="40" fill="#3b2314" />
        <path d="M0-60c-6-2-8-9-3-11 5-1 7 5 3 8" fill="none" stroke="#92400e" strokeWidth="2.4" />
        <circle cx="0" cy="-64" r="4.4" fill="#b45309" />
        <path d="M0-26c-14 0-18 8-12 16-8 3-12 12-8 22 6 12 36 12 40 0 4-10 0-19-8-22 6-8 2-16-12-16Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
        <path d="M0-26c-9 0-12 6-9 12" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".6" />
        <path d="M-8-4c-2 4-2 8 0 12M8-4c2 4 2 8 0 12" stroke="#1c0a02" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="-8" y="14" width="16" height="3" rx="1.5" fill="#1c0a02" />
        <g stroke="#fef3c7" strokeWidth=".7" opacity=".8"><path d="M-2-48V12M0-48V12M2-48V12" /></g>
      </g>
      <path d="M26 96L132 22" stroke="#e7e5e4" strokeWidth="1.8" strokeLinecap="round" opacity=".85" />
      <path d="M26 96L132 22" stroke="#78350f" strokeWidth="3.2" strokeLinecap="round" opacity=".35" transform="translate(1 1)" />
    </>
  ),

  /* ───────── NOSTALGIA ───────── */
  "ode-to-joy": () => (
    <>
      <defs><Grad id="oj-bg" stops={[[0, "#3f6212"], [1, "#a16207"]]} /><radialGradient id="oj-sun"><stop offset="0" stopColor="#fffbe6" /><stop offset="1" stopColor="#fde047" /></radialGradient></defs>
      <rect width="160" height="120" fill="url(#oj-bg)" />
      <g stroke="#fef9c3" strokeWidth="2" strokeLinecap="round" opacity=".4">
        {Array.from({ length: 16 }, (_, i) => { const a = (Math.PI / 8) * i; return <path key={i} d={`M${80 + Math.cos(a) * 30} ${58 + Math.sin(a) * 30}L${80 + Math.cos(a) * 78} ${58 + Math.sin(a) * 78}`} />; })}
      </g>
      <circle cx="80" cy="58" r="30" fill="url(#oj-sun)" opacity=".95" />
      {Array.from({ length: 18 }, (_, i) => {
        const a = (360 / 18) * i;
        return <ellipse key={i} cx="0" cy="-40" rx="5" ry="10" transform={`translate(80 58) rotate(${a}) rotate(${i % 2 ? 24 : -24} 0 -40)`} fill={i % 2 ? "#4d7c0f" : "#65a30d"} stroke="#365314" strokeWidth=".8" />;
      })}
      <g fill="#7c2d12" fontFamily="Sora, sans-serif" fontWeight="800" textAnchor="middle"><text x="80" y="72" fontSize="40">♪</text></g>
    </>
  ),
  "happy-birthday": () => (
    <>
      <defs><Grad id="hb-bg" stops={[[0, "#312e81"], [1, "#a855f7"]]} /></defs>
      <rect width="160" height="120" fill="url(#hb-bg)" />
      {[[20, 18, "#fb7185", -20], [140, 24, "#fde047", 30], [34, 80, "#5eead4", 40], [128, 76, "#f472b6", -10], [100, 14, "#a7f3d0", 20], [56, 14, "#fcd34d", -30]].map(([x, y, c, r], i) => (
        <rect key={i} x={x as number} y={y as number} width="7" height="3" rx="1" fill={c as string} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <g>
        <path d="M30 20c-12 0-14 20 0 22 12 0 14-22 0-22Z" fill="#fb7185" /><path d="M30 42l-2 4h4Z" fill="#fb7185" /><path d="M30 46q-4 14 4 30" stroke="#fff" strokeOpacity=".6" fill="none" />
        <path d="M132 36c-11 0-13 18 0 20 11 0 13-20 0-20Z" fill="#38bdf8" /><path d="M132 56l-2 4h4Z" fill="#38bdf8" /><path d="M132 60q4 12-4 28" stroke="#fff" strokeOpacity=".6" fill="none" />
      </g>
      <rect x="44" y="82" width="72" height="28" rx="5" fill="#fde68a" /><path d="M44 90q6 8 12 0t12 0 12 0 12 0 12 0 12 0v-6H44Z" fill="#f472b6" />
      <rect x="54" y="62" width="52" height="22" rx="5" fill="#fbcfe8" /><path d="M54 70q5 7 10 0t10 0 10 0 10 0 10 0 2 0v-6H54Z" fill="#fff" />
      {[66, 80, 94].map((x) => (
        <g key={x}><rect x={x - 1.6} y="46" width="3.2" height="17" rx="1" fill="#60a5fa" /><path d={`M${x} 36c4 5 4 8 0 10c-4-2-4-5 0-10Z`} fill="#fde047" stroke="#f59e0b" strokeWidth=".8" /></g>
      ))}
      <rect x="38" y="108" width="84" height="4" rx="2" fill="#ffffff55" />
    </>
  ),
  "jingle-bells": () => (
    <>
      <defs><Grad id="jb-bg" stops={[[0, "#14532d"], [1, "#7f1d1d"]]} vertical={false} /></defs>
      <rect width="160" height="120" fill="url(#jb-bg)" />
      <g fill="#fff" opacity=".8">{[[14, 18, 2], [40, 40, 1.4], [120, 14, 2], [146, 52, 1.6], [24, 92, 1.8], [138, 100, 2], [100, 100, 1.2], [60, 14, 1.2]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
      <path d="M16 106c12-26 34-34 64-30s52 12 64 30" stroke="#fecaca" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".35" />
      {[[62, -12, 1], [100, 12, 0.88]].map(([x, r, s], i) => (
        <g key={i} transform={`translate(${x} 46) rotate(${r}) scale(${s})`}>
          <path d="M0-16v-8" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
          <path d="M-22 22c0-24 8-38 22-38s22 14 22 38Z" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <path d="M-14 4c0-12 4-18 10-21" stroke="#fffbeb" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
          <rect x="-26" y="21" width="52" height="7" rx="3.5" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="0" cy="33" r="5.5" fill="#92400e" />
        </g>
      ))}
      <g transform="translate(80 96)">
        <path d="M-6 0c-18-16-34-4-28 4s22 4 28-4Z" fill="#16a34a" stroke="#052e16" strokeWidth="1.2" />
        <path d="M6 0c18-16 34-4 28 4s-22 4-28-4Z" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />
        {[[-3, -2], [3, 0], [0, 4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" fill="#ef4444" stroke="#7f1d1d" strokeWidth=".8" />)}
      </g>
    </>
  ),
  "turkish-march": () => (
    <>
      <defs><Grad id="tm-bg" stops={[[0, "#3b0a1a"], [0.7, "#9a3412"], [1, "#f59e0b"]]} /></defs>
      <rect width="160" height="120" fill="url(#tm-bg)" />
      <Stars pts={[[18, 20], [40, 40, 1.2], [136, 18], [148, 44, 1.2], [112, 10], [22, 62]]} fill="#fde68a" />
      <path d="M84 16a26 26 0 1 0 0 52a21 21 0 1 1 0-52Z" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" />
      <polygon points={star5(106, 40, 9, 3.8)} fill="#fde047" stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round" />
      <g fill="#431407">
        <path d="M0 120V92h8l4-8 4 8h6v28ZM24 120V86h4V76l7-12 7 12v10h4v34Z" opacity=".95" />
        <path d="M52 120V88a28 28 0 0 1 56 0v32Z" />
        <rect x="78" y="48" width="4" height="14" /><path d="M72 62a8 8 0 0 1 16 0Z" /><rect x="79" y="36" width="2" height="14" />
        <path d="M112 120V86h4V76l7-12 7 12v10h4v34ZM136 120V92h6l4-8 4 8h6v28Z" opacity=".95" />
      </g>
      <g fill="#fbbf24"><path d="M62 108a8 10 0 0 1 16 0v12H62ZM82 108a8 10 0 0 1 16 0v12H82Z" opacity=".9" /></g>
    </>
  ),
};

const FALLBACK = () => (
  <>
    <rect width="160" height="120" fill="none" />
    <g fill="#ffffff" fillOpacity=".8" fontFamily="Sora, sans-serif" fontSize="48" textAnchor="middle"><text x="80" y="76">♪</text></g>
  </>
);

export function hasSongArt(id?: string): boolean {
  return !!id && id in SCENES;
}

export function SongArt({ id, className }: { id: string; className?: string }) {
  const Scene = SCENES[id] ?? FALLBACK;
  return (
    <svg className={className} viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <Scene />
    </svg>
  );
}
