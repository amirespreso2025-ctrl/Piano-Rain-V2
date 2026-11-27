/**
 * Tiny music-notation helpers.
 *
 * Melodies are written as text so every song is plain, readable code:
 *   "E5:.5 E5:.5 r:.5 C5:1 | G4:2"
 *   - note  = letter + optional #/b + octave (C4 = middle C = MIDI 60)
 *   - "r"   = rest
 *   - ":n"  = duration in beats (the previous duration is reused when omitted)
 *   - "|"   = bar line (used only to validate the bar lengths)
 */

export interface ParsedNote {
  /** MIDI note number, or null for a rest */
  midi: number | null;
  /** start position, in beats */
  start: number;
  /** length, in beats */
  beats: number;
  /** index of the bar (0-based) the note starts in */
  bar: number;
}

const LETTER_TO_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteToMidi(token: string): number | null {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(token);
  if (!m) return null;
  const pc = LETTER_TO_PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return (parseInt(m[3], 10) + 1) * 12 + pc;
}

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SOLFEGE_FA = ["دو", "دو♯", "ر", "ر♯", "می", "فا", "فا♯", "سل", "سل♯", "لا", "لا♯", "سی"];

/** "E5", "C#4" … */
export function midiToName(midi: number): string {
  return `${SHARP_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/** Persian solfège name, e.g. "می" for E */
export function midiToSolfege(midi: number): string {
  return SOLFEGE_FA[((midi % 12) + 12) % 12];
}

export interface ParsedMelody {
  notes: ParsedNote[];
  /** total length in beats (rests included) */
  totalBeats: number;
  /** beats found in every bar, for validation */
  barLengths: number[];
}

export function parseMelody(src: string): ParsedMelody {
  const notes: ParsedNote[] = [];
  const barLengths: number[] = [];
  let beat = 0;
  let bar = 0;
  let barBeats = 0;
  let last = 1;
  for (const raw of src.trim().split(/\s+/)) {
    if (!raw) continue;
    if (raw === "|") {
      barLengths.push(barBeats);
      barBeats = 0;
      bar++;
      continue;
    }
    const [name, dur] = raw.split(":");
    const beats = dur !== undefined && dur !== "" ? parseFloat(dur) : last;
    last = beats;
    const midi = name === "r" ? null : noteToMidi(name);
    if (name !== "r" && midi === null) throw new Error(`Bad note token "${raw}"`);
    notes.push({ midi, start: beat, beats, bar });
    beat += beats;
    barBeats += beats;
  }
  if (barBeats > 0) barLengths.push(barBeats);
  return { notes, totalBeats: beat, barLengths };
}

export interface Chord {
  name: string;
  /** pitch class of the root */
  pc: number;
  minor: boolean;
  seventh: boolean;
  start: number;
  beats: number;
}

export function parseChords(src: string): { chords: Chord[]; totalBeats: number } {
  const chords: Chord[] = [];
  let beat = 0;
  for (const raw of src.replace(/\|/g, " ").trim().split(/\s+/)) {
    if (!raw) continue;
    const [name, dur] = raw.split(":");
    const m = /^([A-G])([#b]?)(m?)(7?)$/.exec(name);
    if (!m) throw new Error(`Bad chord "${raw}"`);
    const pc = (LETTER_TO_PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + 12) % 12;
    const beats = parseFloat(dur ?? "4");
    chords.push({ name, pc, minor: m[3] === "m", seventh: m[4] === "7", start: beat, beats });
    beat += beats;
  }
  return { chords, totalBeats: beat };
}
