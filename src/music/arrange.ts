import { midiToName, parseChords, parseMelody, type Chord } from "./notation";

/** A melody note that becomes a falling tile; tapping it plays the note. */
export interface TrackNote {
  t: number;
  lane: number;
  midi: number;
  accent: boolean;
  name: string;
}

export interface SynthEvent {
  t: number;
  type: string;
  [key: string]: unknown;
}

export type AccStyle = "ballad" | "waltz" | "chip" | "rock";

export interface Accompaniment {
  style: AccStyle;
  /** pad sound id (see PADS) */
  pad: string;
  /** bass sound id (see BASSES) */
  bass: string;
  /** optional arpeggio instrument (see VOICES) */
  arp?: string;
  /** arpeggio step in beats */
  arpStep?: number;
  /** overall accompaniment loudness multiplier */
  vol?: number;
  /** delay: [time in beats, feedback, wet, damp-hz] */
  delay?: [number, number, number, number];
}

export interface ArrangeInput {
  melody: string;
  chords: string;
  bpm: number;
  /** beats per bar */
  beatsPerBar: number;
  repeat: number;
  /** length of an incomplete first bar (anacrusis), in beats */
  pickup?: number;
  acc: Accompaniment;
  lead: string;
}

export interface Arrangement {
  notes: TrackNote[];
  synth: SynthEvent[];
  duration: number;
  warnings: string[];
}

/** seconds before the very first beat (the game adds its own count-in) */
const START = 1.0;

function chordAt(chords: Chord[], total: number, beat: number): Chord {
  const b = beat % total;
  for (const c of chords) if (b >= c.start && b < c.start + c.beats) return c;
  return chords[chords.length - 1];
}

export function arrange(input: ArrangeInput): Arrangement {
  const warnings: string[] = [];
  const mel = parseMelody(input.melody);
  const prog = parseChords(input.chords);
  const bpb = input.beatsPerBar;
  const spb = 60 / input.bpm;
  const pickup = input.pickup ?? 0;
  const passBeats = Math.round(mel.totalBeats);
  const totalBeats = passBeats * input.repeat;
  const acc = input.acc;
  const vol = acc.vol ?? 1;

  // -------- validation (helps catch typos when writing melodies) --------
  mel.barLengths.forEach((len, i) => {
    const isFirst = i === 0;
    const isLast = i === mel.barLengths.length - 1;
    if (Math.abs(len - bpb) > 0.001 && !(isFirst && pickup > 0) && !isLast) warnings.push(`bar ${i + 1}: ${len} beats (expected ${bpb})`);
  });
  if (Math.abs(prog.totalBeats - passBeats) > 0.001 && Math.abs(prog.totalBeats - mel.totalBeats) > 0.001)
    warnings.push(`chords ${prog.totalBeats} beats vs melody ${mel.totalBeats}`);

  // -------- lane mapping: the 4 lanes act like 4 groups of piano keys --------
  const pitches = [...new Set(mel.notes.filter((n) => n.midi !== null).map((n) => n.midi as number))].sort((a, b) => a - b);
  const laneOfPitch = new Map<number, number>();
  pitches.forEach((p, i) => laneOfPitch.set(p, Math.min(3, Math.floor((i * 4) / pitches.length))));

  const notes: TrackNote[] = [];
  for (let pass = 0; pass < input.repeat; pass++) {
    for (const n of mel.notes) {
      if (n.midi === null) continue;
      const beat = pass * passBeats + n.start;
      notes.push({
        t: Math.round((START + beat * spb) * 1000) / 1000,
        lane: laneOfPitch.get(n.midi) ?? 0,
        midi: n.midi,
        accent: Math.abs((((n.start - pickup) % bpb) + bpb) % bpb) < 0.001,
        name: midiToName(n.midi),
      });
    }
  }
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].t - notes[i - 1].t < 0.15) warnings.push(`notes ${i}/${i + 1} are only ${(notes[i].t - notes[i - 1].t).toFixed(3)}s apart`);
  }

  // -------- accompaniment --------
  const synth: SynthEvent[] = [];
  const T = (beat: number) => START + beat * spb;
  const drum = (type: string, beat: number, vel: number, extra: Record<string, unknown> = {}) =>
    synth.push({ t: T(beat), type, vel: vel * vol, ...extra });

  for (let n = 0; n < totalBeats; n++) {
    const nn = n % passBeats;
    const ch = chordAt(prog.chords, prog.totalBeats, nn);
    const root = 48 + ch.pc;
    const third = ch.minor ? 3 : 4;
    const ext = ch.seventh ? 10 : ch.minor ? 10 : 11;
    const tones = [root, root + third, root + 7, root + ext];
    const pos = (((nn - pickup) % bpb) + bpb) % bpb;
    const chordBeat = nn % prog.totalBeats;
    const isChordStart = Math.abs(chordBeat - ch.start) < 0.001;
    const left = Math.max(1, ch.start + ch.beats - chordBeat);

    if (acc.style === "ballad") {
      if (isChordStart) {
        synth.push({ t: T(n) - 0.02, type: "pad", k: acc.pad, midis: tones, dur: ch.beats * spb * 1.03, vel: 0.036 * vol });
        synth.push({ t: T(n), type: "bass", k: acc.bass, midi: 36 + ch.pc, dur: Math.min(ch.beats, 4) * spb * 0.95, vel: 0.15 * vol });
      }
      if (acc.arp) {
        const step = acc.arpStep ?? 1;
        const seq = [0, 1, 2, 3, 2, 1];
        for (let s = 0; s < 1; s += step) {
          const k = Math.round((n + s) / step);
          synth.push({ t: T(n + s), type: "arp", inst: acc.arp, midi: tones[seq[k % seq.length]] + 12, dur: spb * 1.6, vel: 0.05 * vol });
        }
      }
    } else if (acc.style === "waltz") {
      if (isChordStart) synth.push({ t: T(n) - 0.02, type: "pad", k: acc.pad, midis: tones.slice(0, 3), dur: Math.min(left, bpb) * spb, vel: 0.022 * vol });
      if (pos === 0) synth.push({ t: T(n), type: "bass", k: acc.bass, midi: 36 + ch.pc, dur: spb * 1.9, vel: 0.17 * vol });
      else {
        const arpTones = [tones[1] + 12, tones[2] + 12, tones[0] + 24];
        if (acc.arp) {
          synth.push({ t: T(n), type: "arp", inst: acc.arp, midi: arpTones[pos % 3], dur: spb, vel: 0.055 * vol });
          synth.push({ t: T(n), type: "arp", inst: acc.arp, midi: tones[0] + 12, dur: spb, vel: 0.04 * vol });
        }
      }
    } else {
      // chip / rock : driving pulse bass, arps and a drum kit
      const rock = acc.style === "rock";
      if (isChordStart) synth.push({ t: T(n) - 0.02, type: "pad", k: acc.pad, midis: tones, dur: ch.beats * spb * 1.02, vel: (rock ? 0.034 : 0.03) * vol });
      for (const h of [0, 0.5]) {
        const alt = h === 0.5 && pos % 2 === 1;
        synth.push({ t: T(n + h), type: "bass", k: acc.bass, midi: 36 + ch.pc + (alt ? 12 : 0), dur: spb * 0.42, vel: (rock ? 0.2 : 0.15) * vol });
        if (acc.arp) {
          const idx = [0, 1, 2, 1][(n * 2 + (h ? 1 : 0)) % 4];
          synth.push({ t: T(n + h), type: "arp", inst: acc.arp, midi: tones[idx] + 12, dur: spb * 0.4, vel: 0.04 * vol });
        }
        drum("hat", n + h, h === 0 ? 0.04 : 0.026, { k: "closed" });
      }
      const dp = pos % 4;
      if (dp === 0 || dp === 2) drum("kick", n, rock ? 0.25 : 0.2, { k: rock ? "punch" : "dry" });
      if (dp === 1 || dp === 3) drum(rock ? "snare" : "rim", n, rock ? 0.15 : 0.1);
      if (rock && pos === bpb - 1) drum("snare", n + 0.5, 0.09);
    }
  }

  // closing chord + little sparkle, like a real ending
  const lastChord = prog.chords[prog.chords.length - 1];
  const endBeat = totalBeats;
  const endRoot = 48 + lastChord.pc;
  synth.push({
    t: T(endBeat) - 0.02,
    type: "pad",
    k: acc.pad,
    midis: [endRoot, endRoot + (lastChord.minor ? 3 : 4), endRoot + 7, endRoot + 12],
    dur: 2.6,
    vel: 0.05,
  });
  synth.push({ t: T(endBeat), type: "bass", k: acc.bass, midi: 36 + lastChord.pc, dur: 2.2, vel: 0.16 * vol });
  synth.push({ t: 0, type: "pad", k: acc.pad, midis: [endRoot, endRoot + (lastChord.minor ? 3 : 4), endRoot + 7], dur: spb * bpb * 0.9, vel: 0.028 });
  synth.sort((a, b) => a.t - b.t);

  const lastNote = notes.length ? notes[notes.length - 1].t : START;
  const duration = Math.max(T(endBeat) + 2.4, lastNote + 2.4);
  return { notes, synth, duration, warnings };
}
