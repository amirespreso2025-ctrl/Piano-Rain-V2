import type { Accompaniment } from "./arrange";

export type CategoryId = "games" | "calm" | "emotional" | "classic";

export interface CategoryDef {
  id: CategoryId;
  label: string;
  latin: string;
  icon: string;
  blurb: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "games", label: "بازی‌های معروف", latin: "GAME THEMES", icon: "gamepad", blurb: "آهنگ‌های ماندگار دنیای بازی‌های ویدیویی" },
  { id: "calm", label: "آرامش‌بخش", latin: "CALM", icon: "leaf", blurb: "ملودی‌های نرم برای آرام شدن و تمرکز" },
  { id: "emotional", label: "احساسی", latin: "EMOTIONAL", icon: "heart", blurb: "ملودی‌هایی که دل را می‌لرزانند" },
  { id: "classic", label: "معروف و خاطره‌انگیز", latin: "NOSTALGIA", icon: "sparkles", blurb: "ترانه‌هایی که همه با آن‌ها بزرگ شده‌ایم" },
];

export interface SongDef {
  id: string;
  title: string;
  titleFa: string;
  /** composer / origin */
  artist: string;
  category: CategoryId;
  /** short Persian description shown in the detail panel */
  blurb: string;
  /** key & meter, shown as info chips */
  key: string;
  meter: string;
  bpm: number;
  beatsPerBar: number;
  pickup?: number;
  /** how many times the melody is played in the level */
  repeat: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  palette: string;
  /** instrument used when the player taps a tile (see VOICES, "grand" = piano) */
  lead: string;
  melody: string;
  chords: string;
  acc: Accompaniment;
}

const MARIO_A = "C5:1.5 G4:1.5 E4:1 | r:.5 A4:1 B4:1 Bb4:.5 A4:1 | G4:.5 E5:.5 G5:1 A5:1 F5:.5 G5:.5 | r:.5 E5:1 C5:.5 D5:.5 B4:1.5";
const MARIO_B1 = "r:1 G5:.5 F#5:.5 F5:.5 D#5:.5 E5:.5 r:.5";
const MARIO_B2 = "G#4:.5 A4:.5 C5:.5 r:.5 A4:.5 C5:.5 D5:.5 r:.5";
const MARIO_B4 = "C6:1 C6:.5 C6:.5 r:2";
const MARIO_B5 = "r:.5 Eb5:1 D5:1 C5:1.5";

const mega = (root: string) => `${root}:.5 ${root}:.5 D5:.5 r:.5 A4:.5 r:1 Ab4:.5 r:.5 G4:.5 r:.5 F4:.5 D4:.5 F4:.5 G4:1`;

export const SONG_DEFS: SongDef[] = [
  // ───────────────────────── GAMES ─────────────────────────
  {
    id: "super-mario",
    title: "Super Mario Overworld",
    titleFa: "سوپر ماریو",
    artist: "Koji Kondo · 1985",
    category: "games",
    blurb: "تم همیشه‌شاد جهان اول ماریو؛ جهشی، پرانرژی و فوراً قابل تشخیص. هر لمس یک نت ۸ بیتی است.",
    key: "C Major",
    meter: "4/4",
    bpm: 128,
    beatsPerBar: 4,
    repeat: 1,
    difficulty: 3,
    palette: "arcade",
    lead: "sqpluck",
    melody: [
      "E5:.5 E5:.5 r:.5 E5:.5 r:.5 C5:.5 E5:1 | G5:1 r:1 G4:1 r:1",
      MARIO_A, MARIO_A,
      MARIO_B1, MARIO_B2, MARIO_B1, MARIO_B4, MARIO_B1, MARIO_B2, MARIO_B5,
      MARIO_A,
    ].join(" | "),
    chords: ["C:4 G:4", "C:4 F:4 C:4 G:4", "C:4 F:4 C:4 G:4", "C:4 F:4 C:4 G:4 C:4 F:4 Ab:2 Bb:1 C:1", "C:4 F:4 C:4 G:4"].join(" "),
    acc: { style: "chip", pad: "organ", bass: "pizz", arp: "sqpluck", vol: 0.9, delay: [0.5, 0.2, 0.12, 3000] },
  },
  {
    id: "tetris-a",
    title: "Tetris · Korobeiniki",
    titleFa: "تتریس",
    artist: "Russian folk song · Type A",
    category: "games",
    blurb: "ترانهٔ محلی روسی «کوروبِینیکی» که با تتریس جاودانه شد؛ ریتمی منظم که مثل چیدن بلوک‌ها آرامش‌بخش و اعتیادآور است.",
    key: "A Minor",
    meter: "4/4",
    bpm: 150,
    beatsPerBar: 4,
    repeat: 3,
    difficulty: 3,
    palette: "aurora",
    lead: "sqpluck",
    melody: [
      "E5:1 B4:.5 C5:.5 D5:1 C5:.5 B4:.5 | A4:1 A4:.5 C5:.5 E5:1 D5:.5 C5:.5 | B4:1.5 C5:.5 D5:1 E5:1 | C5:1 A4:1 A4:2",
      "D5:1.5 F5:.5 A5:1 G5:.5 F5:.5 | E5:1.5 C5:.5 E5:1 D5:.5 C5:.5 | B4:1 B4:.5 C5:.5 D5:1 E5:1 | C5:1 A4:1 A4:2",
    ].join(" | "),
    chords: "Am:4 Am:4 E:4 Am:4 Dm:4 C:4 E:4 Am:4",
    acc: { style: "chip", pad: "organ", bass: "saw", arp: "sqpluck", vol: 0.85, delay: [0.5, 0.2, 0.12, 3200] },
  },
  {
    id: "song-of-storms",
    title: "Song of Storms",
    titleFa: "آهنگ طوفان‌ها",
    artist: "Koji Kondo · Zelda",
    category: "games",
    blurb: "والس چرخان و رازآلود از دنیای زلدا؛ سه نت اول مثل باد می‌پیچد و بعد در میان طوفان گم می‌شود.",
    key: "D Minor",
    meter: "3/4",
    bpm: 132,
    beatsPerBar: 3,
    repeat: 4,
    difficulty: 2,
    palette: "meadow",
    lead: "harp",
    melody: [
      "D4:.5 F4:.5 D5:2 | D4:.5 F4:.5 D5:2 | E5:1 F5:.5 E5:.5 F5:.5 E5:.5 | C5:1 A4:2",
      "A4:.5 D4:.5 F4:.5 G4:.5 A4:1 | A4:.5 D4:.5 F4:.5 G4:.5 E4:1 | D4:3",
    ].join(" | "),
    chords: "Dm:3 Dm:3 C:3 Am:3 Dm:3 Dm:3 Dm:3",
    acc: { style: "waltz", pad: "warm", bass: "pizz", arp: "kalimba", vol: 1, delay: [0.75, 0.3, 0.2, 2600] },
  },
  {
    id: "megalovania",
    title: "Megalovania",
    titleFa: "مگالوانیا",
    artist: "Toby Fox · Undertale",
    category: "games",
    blurb: "نبرد نهایی با ریتم تند و بیس کوبنده؛ چهار فراز که با ریشه‌های ر، دو، سی و سی‌بمل پایین می‌روند.",
    key: "D Minor",
    meter: "4/4 · ×2",
    bpm: 140,
    beatsPerBar: 8,
    repeat: 3,
    difficulty: 4,
    palette: "indigo",
    lead: "synth",
    melody: [mega("D4"), mega("C4"), mega("B3"), mega("Bb3")].join(" | "),
    chords: "Dm:8 C:8 G:8 Bb:8",
    acc: { style: "rock", pad: "dark", bass: "funk", vol: 0.95, delay: [0.5, 0.22, 0.14, 2800] },
  },

  // ───────────────────────── CALM ─────────────────────────
  {
    id: "silent-night",
    title: "Silent Night",
    titleFa: "شب خاموش",
    artist: "Franz Gruber · 1818",
    category: "calm",
    blurb: "لالایی شبانهٔ زمستان؛ آرام‌ترین مسیر برای شروع. نت‌ها آهسته می‌آیند و هر لمس مثل برفی روی پیانو می‌نشیند.",
    key: "C Major",
    meter: "6/8",
    bpm: 92,
    beatsPerBar: 3,
    repeat: 1,
    difficulty: 1,
    palette: "frost",
    lead: "grand",
    melody: [
      "G4:1.5 A4:.5 G4:1 | E4:3 | G4:1.5 A4:.5 G4:1 | E4:3",
      "D5:2 D5:1 | B4:3 | C5:2 C5:1 | G4:3",
      "A4:2 A4:1 | C5:1.5 B4:.5 A4:1 | G4:1.5 A4:.5 G4:1 | E4:3",
      "A4:2 A4:1 | C5:1.5 B4:.5 A4:1 | G4:1.5 A4:.5 G4:1 | E4:3",
      "D5:2 D5:1 | F5:1.5 D5:.5 B4:1 | C5:3 | E5:3",
      "C5:1 G4:1 E4:1 | G4:1.5 F4:.5 D4:1 | C4:3",
    ].join(" | "),
    chords: "C:12 G:6 C:6 F:6 C:6 F:6 C:6 G:6 C:6 C:3 G:3 C:3",
    acc: { style: "ballad", pad: "soft", bass: "sine", arp: "harp", vol: 0.95, delay: [0.75, 0.4, 0.24, 2600] },
  },
  {
    id: "brahms-lullaby",
    title: "Brahms' Lullaby",
    titleFa: "لالایی برامس",
    artist: "Johannes Brahms · 1868",
    category: "calm",
    blurb: "مشهورترین لالایی دنیا؛ موج ملایم سه‌ضربی که با صدای جعبهٔ موزیکال، پلک‌ها را سنگین می‌کند.",
    key: "C Major",
    meter: "3/4",
    bpm: 76,
    beatsPerBar: 3,
    pickup: 1,
    repeat: 2,
    difficulty: 1,
    palette: "lilac",
    lead: "musicbox",
    melody:
      "E4:.5 E4:.5 | G4:2 E4:.5 E4:.5 | G4:2 E4:1 | G4:1 C5:2 | B4:1 A4:.5 A4:.5 G4:1 | D4:.5 E4:.5 F4:1 D4:1 | D4:.5 E4:.5 F4:1 D4:1 | F4:1 B4:.5 A4:.5 G4:1 | C5:3",
    chords: "C:1 C:3 C:3 C:3 G:3 G:3 G:3 G:3 C:3",
    acc: { style: "waltz", pad: "soft", bass: "sine", arp: "harp", vol: 0.9, delay: [0.75, 0.4, 0.24, 2400] },
  },
  {
    id: "morning-mood",
    title: "Morning Mood",
    titleFa: "حال‌وهوای صبح",
    artist: "Edvard Grieg · Peer Gynt",
    category: "calm",
    blurb: "طلوع خورشید بر فراز کوه‌ها؛ نغمهٔ پنج‌نتی که مثل نور صبح آرام بالا می‌آید.",
    key: "E Minor Pentatonic",
    meter: "6/8",
    bpm: 100,
    beatsPerBar: 3,
    repeat: 2,
    difficulty: 2,
    palette: "sunset",
    lead: "grand",
    melody: [
      "E5:1 D5:.5 B4:1 A4:.5 | G4:1 A4:.5 B4:1 D5:.5 | E5:1 D5:.5 B4:1 A4:.5 | G4:1 A4:.5 B4:1 D5:.5",
      "G5:1 E5:.5 D5:1 B4:.5 | A4:1 B4:.5 D5:1 E5:.5 | G5:1 E5:.5 D5:1 B4:.5 | E5:3",
      "E5:1 D5:.5 B4:1 A4:.5 | G4:1 A4:.5 B4:1 D5:.5 | E5:1 D5:.5 B4:1 A4:.5 | E5:3",
    ].join(" | "),
    chords: "Em:3 G:3 Em:3 G:3 G:3 D:3 G:3 Em:3 Em:3 G:3 Em:3 Em:3",
    acc: { style: "ballad", pad: "warm", bass: "sine", arp: "harp", vol: 1, delay: [0.75, 0.35, 0.22, 2800] },
  },
  {
    id: "twinkle-twinkle",
    title: "Twinkle Twinkle Little Star",
    titleFa: "ستارهٔ کوچک",
    artist: "Mozart variations · 1781",
    category: "calm",
    blurb: "نخستین ترانه‌ای که بیشتر ما با پیانو می‌نوازیم؛ ساده، شیرین و مثل شبی پرستاره آرام.",
    key: "C Major",
    meter: "4/4",
    bpm: 92,
    beatsPerBar: 4,
    repeat: 1,
    difficulty: 1,
    palette: "indigo",
    lead: "musicbox",
    melody: [
      "C5:1 C5:1 G5:1 G5:1 | A5:1 A5:1 G5:2 | F5:1 F5:1 E5:1 E5:1 | D5:1 D5:1 C5:2",
      "G5:1 G5:1 F5:1 F5:1 | E5:1 E5:1 D5:2 | G5:1 G5:1 F5:1 F5:1 | E5:1 E5:1 D5:2",
      "C5:1 C5:1 G5:1 G5:1 | A5:1 A5:1 G5:2 | F5:1 F5:1 E5:1 E5:1 | D5:1 D5:1 C5:2",
    ].join(" | "),
    chords: "C:4 F:2 C:2 F:2 C:2 G:2 C:2 C:2 F:2 C:2 G:2 C:2 F:2 C:2 G:2 C:4 F:2 C:2 F:2 C:2 G:2 C:2",
    acc: { style: "ballad", pad: "soft", bass: "sine", arp: "kalimba", vol: 0.9, delay: [0.75, 0.4, 0.24, 2600] },
  },

  // ───────────────────────── EMOTIONAL ─────────────────────────
  {
    id: "fur-elise",
    title: "Für Elise",
    titleFa: "برای الیزه",
    artist: "Ludwig van Beethoven · 1810",
    category: "emotional",
    blurb: "نامه‌ای عاشقانه که هیچ‌وقت به مقصد نرسید؛ دو نت لرزان و بعد حسرتی که دور می‌زند و برمی‌گردد.",
    key: "A Minor",
    meter: "3/8",
    bpm: 110,
    beatsPerBar: 3,
    pickup: 1,
    repeat: 3,
    difficulty: 3,
    palette: "rose",
    lead: "grand",
    melody:
      "E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 | A4:1 r:.5 C4:.5 E4:.5 A4:.5 | B4:1 r:.5 E4:.5 G#4:.5 B4:.5 | C5:1 r:.5 E4:.5 E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 | A4:1 r:.5 C4:.5 E4:.5 A4:.5 | B4:1 r:.5 E4:.5 C5:.5 B4:.5 | A4:2 r:1",
    chords: "E:1 Am:3 Am:3 E:3 Am:3 Am:3 Am:3 E:3 Am:3",
    acc: { style: "ballad", pad: "soft", bass: "sine", arp: "harp", vol: 0.9, delay: [0.75, 0.35, 0.22, 2400] },
  },
  {
    id: "greensleeves",
    title: "Greensleeves",
    titleFa: "آستین‌سبز",
    artist: "English folk song · 16th century",
    category: "emotional",
    blurb: "غمِ عاشقی که پنج قرن است در گیتار و عود می‌خوانند؛ ملودی مینور که آرام می‌پیچد و دل را می‌برد.",
    key: "A Minor",
    meter: "6/8",
    bpm: 112,
    beatsPerBar: 3,
    pickup: 1,
    repeat: 2,
    difficulty: 2,
    palette: "meadow",
    lead: "harp",
    melody: [
      "A4:1",
      "C5:2 D5:1 | E5:1.5 F5:.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:.5 B4:1 | C5:2 A4:1 | A4:1.5 G#4:.5 A4:1 | B4:2 G#4:1 | E4:2 A4:1",
      "C5:2 D5:1 | E5:1.5 F5:.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:.5 B4:1 | C5:1.5 B4:.5 A4:1 | G#4:1.5 F#4:.5 G#4:1 | A4:2 r:1",
    ].join(" | "),
    chords: "Am:1 Am:6 G:3 Em:3 Am:3 E:6 Am:3 Am:6 G:3 Em:3 Am:3 E:3 Am:3",
    acc: { style: "ballad", pad: "warm", bass: "sine", arp: "guitar", vol: 0.95, delay: [0.75, 0.35, 0.2, 2400] },
  },
  {
    id: "auld-lang-syne",
    title: "Auld Lang Syne",
    titleFa: "یاد روزهای دور",
    artist: "Scottish folk · Robert Burns",
    category: "emotional",
    blurb: "ترانهٔ وداع و یادآوری؛ برای دوستانی که رفته‌اند و روزهایی که دیگر برنمی‌گردند.",
    key: "C Major",
    meter: "4/4",
    bpm: 92,
    beatsPerBar: 4,
    pickup: 1,
    repeat: 2,
    difficulty: 2,
    palette: "gold",
    lead: "grand",
    melody:
      "G4:1 | C5:1.5 C5:.5 C5:1 E5:1 | D5:1.5 C5:.5 D5:1 E5:1 | C5:1.5 C5:.5 E5:1 G5:1 | A5:3 A5:1 | G5:1.5 E5:.5 E5:1 C5:1 | D5:1.5 C5:.5 D5:1 E5:1 | C5:1.5 A4:.5 A4:1 G4:1 | C5:4",
    chords: "C:1 C:4 C:2 G:2 C:4 F:4 C:4 G:2 C:2 F:2 G:2 C:4",
    acc: { style: "ballad", pad: "warm", bass: "sine", arp: "harp", vol: 0.95, delay: [0.75, 0.35, 0.22, 2600] },
  },
  {
    id: "canon-in-d",
    title: "Canon in D",
    titleFa: "کانن در ر ماژور",
    artist: "Johann Pachelbel · c. 1680",
    category: "emotional",
    blurb: "هشت آکورد که هرگز تمام نمی‌شوند؛ سه‌بار ملودی بالا می‌رود، پرپیچ‌وخم‌تر می‌شود و گریه را به لبخند می‌رساند.",
    key: "D Major",
    meter: "4/4",
    bpm: 92,
    beatsPerBar: 4,
    repeat: 1,
    difficulty: 2,
    palette: "ocean",
    lead: "grand",
    melody: [
      "F#5:2 E5:2 | D5:2 C#5:2 | B4:2 A4:2 | B4:2 C#5:2",
      "D5:2 C#5:2 | B4:2 A4:2 | G4:2 F#4:2 | G4:2 A4:2",
      "F#5:1 A5:1 E5:1 A5:1 | D5:1 F#5:1 C#5:1 F#5:1 | B4:1 D5:1 A4:1 D5:1 | B4:1 D5:1 C#5:1 E5:1",
      "F#5:4",
    ].join(" | "),
    chords: "D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:4",
    acc: { style: "ballad", pad: "soft", bass: "pizz", arp: "harp", vol: 0.95, delay: [0.75, 0.35, 0.22, 2800] },
  },

  // ───────────────────────── NOSTALGIA ─────────────────────────
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    titleFa: "سرود شادی",
    artist: "Ludwig van Beethoven · 1824",
    category: "classic",
    blurb: "سرودی که مرزها را برداشت؛ نت‌هایی پله‌پله و پرنشاط که در یک دقیقه شما را به لبخند می‌رسانند.",
    key: "C Major",
    meter: "4/4",
    bpm: 112,
    beatsPerBar: 4,
    repeat: 1,
    difficulty: 2,
    palette: "citrus",
    lead: "grand",
    melody: [
      "E5:1 E5:1 F5:1 G5:1 | G5:1 F5:1 E5:1 D5:1 | C5:1 C5:1 D5:1 E5:1 | E5:1.5 D5:.5 D5:2",
      "E5:1 E5:1 F5:1 G5:1 | G5:1 F5:1 E5:1 D5:1 | C5:1 C5:1 D5:1 E5:1 | D5:1.5 C5:.5 C5:2",
      "D5:1 D5:1 E5:1 C5:1 | D5:1 E5:.5 F5:.5 E5:1 C5:1 | D5:1 E5:.5 F5:.5 E5:1 D5:1 | C5:1 D5:1 G4:2",
      "E5:1 E5:1 F5:1 G5:1 | G5:1 F5:1 E5:1 D5:1 | C5:1 C5:1 D5:1 E5:1 | D5:1.5 C5:.5 C5:2",
    ].join(" | "),
    chords: "C:4 G:4 C:4 G:4 C:4 G:4 C:4 G:2 C:2 G:4 C:4 G:4 C:2 G:2 C:4 G:4 C:4 G:2 C:2",
    acc: { style: "ballad", pad: "warm", bass: "pizz", arp: "marimba", vol: 0.9, delay: [0.75, 0.25, 0.16, 3000] },
  },
  {
    id: "happy-birthday",
    title: "Happy Birthday to You",
    titleFa: "تولدت مبارک",
    artist: "Patty & Mildred Hill · 1893",
    category: "classic",
    blurb: "آهنگی که هر سال برای یکی می‌خوانیم؛ شمع‌ها را فوت کن و نت‌ها را یکی‌یکی روشن نگه دار.",
    key: "C Major",
    meter: "3/4",
    bpm: 88,
    beatsPerBar: 3,
    pickup: 1,
    repeat: 2,
    difficulty: 1,
    palette: "aurora",
    lead: "marimba",
    melody:
      "G4:.75 G4:.25 | A4:1 G4:1 C5:1 | B4:2 G4:.75 G4:.25 | A4:1 G4:1 D5:1 | C5:2 G4:.75 G4:.25 | G5:1 E5:1 C5:1 | B4:1 A4:1 F5:.75 F5:.25 | E5:1 C5:1 D5:1 | C5:3",
    chords: "G:1 C:3 G:3 G:3 C:3 C:3 F:3 C:2 G:1 C:3",
    acc: { style: "waltz", pad: "warm", bass: "pizz", arp: "kalimba", vol: 1, delay: [0.75, 0.25, 0.18, 3000] },
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    titleFa: "زنگوله‌ها",
    artist: "James Lord Pierpont · 1857",
    category: "classic",
    blurb: "سورتمه‌ای در برف و زنگوله‌هایی که از دور می‌آیند؛ ریتمی بانشاط برای شب‌های زمستان.",
    key: "C Major",
    meter: "4/4",
    bpm: 132,
    beatsPerBar: 4,
    repeat: 2,
    difficulty: 2,
    palette: "meadow",
    lead: "marimba",
    melody: [
      "E5:1 E5:1 E5:2 | E5:1 E5:1 E5:2 | E5:1 G5:1 C5:1.5 D5:.5 | E5:4",
      "F5:1 F5:1 F5:1.5 F5:.5 | F5:1 E5:1 E5:1 E5:.5 E5:.5 | E5:1 D5:1 D5:1 E5:1 | D5:2 G5:2",
      "E5:1 E5:1 E5:2 | E5:1 E5:1 E5:2 | E5:1 G5:1 C5:1.5 D5:.5 | E5:4",
      "F5:1 F5:1 F5:1.5 F5:.5 | F5:1 E5:1 E5:1 E5:.5 E5:.5 | G5:1 G5:1 F5:1 D5:1 | C5:4",
    ].join(" | "),
    chords: "C:4 C:4 C:4 C:4 F:4 C:4 G:4 G:4 C:4 C:4 C:4 C:4 F:4 C:4 C:2 G:2 C:4",
    acc: { style: "chip", pad: "warm", bass: "pizz", arp: "kalimba", vol: 0.8, delay: [0.5, 0.2, 0.12, 3200] },
  },
  {
    id: "turkish-march",
    title: "Turkish March",
    titleFa: "مارش ترکی",
    artist: "W. A. Mozart · 1783",
    category: "classic",
    blurb: "مارش پرشور موتزارت؛ گام‌های ریز و سریع که مثل رژه‌ای کوچک روی کلیدها می‌دوند.",
    key: "A Minor",
    meter: "2/4",
    bpm: 126,
    beatsPerBar: 4,
    repeat: 3,
    difficulty: 4,
    palette: "sunset",
    lead: "grand",
    melody:
      "B4:.5 A4:.5 G#4:.5 A4:.5 C5:2 | D5:.5 C5:.5 B4:.5 C5:.5 E5:2 | F5:.5 E5:.5 D#5:.5 E5:.5 B5:.5 A5:.5 G#5:.5 A5:.5 | B5:.5 A5:.5 G#5:.5 A5:.5 C6:2 | C6:1 A5:1 C6:1 A5:1 | B5:.5 A5:.5 G#5:.5 A5:.5 A5:2",
    chords: "E:2 Am:2 Am:4 E:4 Am:4 Am:4 E:2 Am:2",
    acc: { style: "chip", pad: "warm", bass: "pizz", vol: 0.75, delay: [0.5, 0.2, 0.12, 3000] },
  },
];
