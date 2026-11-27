import { CATEGORIES, categoryOf, type Track } from "../music/songs";
import type { CSSProperties, ComponentType } from "react";
import { PALETTES as PALETTES_RAW } from "../music/palettes";
import { midiToSolfege } from "../music/notation";
import { cn } from "../utils/cn";
import { Icon as IconRaw } from "./icons";
import { CoverArt as CoverArtRaw, LevelDots as LevelDotsRaw } from "./parts";
import { formatDuration, formatScore } from "../lib/format";

// the ported (untyped) modules are re-typed here so this file stays strictly typed
const PALETTES = PALETTES_RAW as unknown as Record<string, { lanes: string[]; accent: string }>;
const Icon = IconRaw as unknown as ComponentType<{ name: string; size?: number; className?: string }>;
const CoverArt = CoverArtRaw as unknown as ComponentType<{ track: Track; className?: string; showTitle?: boolean }>;
const LevelDots = LevelDotsRaw as unknown as ComponentType<{ level: number; className?: string }>;

const CATEGORY_SHORT: Record<string, string> = {
  games: "بازی",
  calm: "آرامش",
  emotional: "احساسی",
  classic: "خاطره",
};

export function categoryShortLabel(track: { category?: string }): string {
  return CATEGORY_SHORT[track.category ?? ""] ?? "LUMA";
}

const CATEGORY_ACCENT: Record<string, string> = {
  games: "#fbbf24",
  calm: "#7dd3fc",
  emotional: "#fda4af",
  classic: "#c4b5fd",
};

/** Category filter row for the library */
export function CategoryTabs({
  tracks,
  active,
  onChange,
}: {
  tracks: Track[];
  active: string;
  onChange: (id: string) => void;
}) {
  const items = [{ id: "all", label: "همه", icon: "music", blurb: "" }, ...CATEGORIES];
  const activeCat = CATEGORIES.find((c) => c.id === active);
  return (
    <>
      <div className="cat-row" role="tablist" aria-label="دسته‌بندی موسیقی">
        {items.map((c) => {
          const count = c.id === "all" ? tracks.length : tracks.filter((t) => t.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              className={cn("cat-chip", active === c.id && "is-active")}
              style={{ ["--cat-accent" as string]: CATEGORY_ACCENT[c.id] ?? "#5eead4" }}
              onClick={() => onChange(c.id)}
            >
              <Icon name={c.icon} size={14} />
              {c.label}
              <span className="cat-count">{count}</span>
            </button>
          );
        })}
      </div>
      {activeCat && <p className="cat-blurb">{activeCat.blurb}</p>}
    </>
  );
}

/** Everything about the selected song: cover, name, info, the notes you are going to play */
export function SongDetail({
  track,
  best,
  levelLabel,
  onPlay,
}: {
  track: Track;
  best: number;
  levelLabel: string;
  onPlay: () => void;
}) {
  const palette = PALETTES[track.palette];
  const cat = categoryOf(track);
  const preview = track.notes.slice(0, 30);
  const style = { ["--accent" as string]: palette.accent } as CSSProperties;

  return (
    <article className="song-detail" style={style} aria-live="polite" key={track.id}>
      <div className="detail-cover">
        <CoverArt track={track} />
      </div>
      <div className="detail-body">
        {cat && (
          <span className="detail-cat">
            <Icon name={cat.icon} size={14} />
            {cat.label}
          </span>
        )}
        <h3 className="detail-title">
          {track.titleFa}
          <small>{track.title.toUpperCase()}</small>
        </h3>
        <p className="detail-blurb">{track.blurb}</p>

        <div className="detail-chips">
          <span className="detail-chip"><Icon name="user" size={12} /> <b>{track.artist}</b></span>
          <span className="detail-chip"><Icon name="clock" size={12} /> <b>{formatDuration(track.duration)}</b></span>
          <span className="detail-chip"><Icon name="speed" size={12} /> <b>{track.bpm}</b> BPM</span>
          <span className="detail-chip"><Icon name="music" size={12} /> <b>{track.key}</b> · {track.meter}</span>
          <span className="detail-chip"><Icon name="note" size={12} /> <b>{track.notes.length}</b> نت</span>
          <span className="detail-chip">
            <LevelDots level={track.difficulty} className="text-mint/90" /> <b>{levelLabel}</b>
          </span>
        </div>

        <div>
          <div className="note-strip-head">
            <span>نت‌هایی که می‌نوازی</span>
            <span dir="ltr">
              {preview.length} / {track.notes.length}
            </span>
          </div>
          <div className="note-strip" dir="ltr" aria-label="ترتیب نت‌های آهنگ">
            {preview.map((n, i) => (
              <span key={i} className="note-pill" style={{ ["--np" as string]: palette.lanes[n.lane] }} title={midiToSolfege(n.midi)}>
                {n.name}
              </span>
            ))}
          </div>
        </div>

        {track.laneRanges && (
          <div className="lane-legend" aria-label="محدودهٔ نت‌ها در هر خط">
            {track.laneRanges.map((r) => (
              <div key={r.lane} style={{ ["--np" as string]: palette.lanes[r.lane] }}>
                <span>
                  {r.from}
                  {r.from !== r.to ? ` – ${r.to}` : ""}
                </span>
                <small>
                  {r.fromFa}
                  {r.from !== r.to ? ` تا ${r.toFa}` : ""}
                </small>
              </div>
            ))}
          </div>
        )}

        <div className="detail-actions">
          <button type="button" className="btn btn-primary" onClick={onPlay}>
            <Icon name="play" size={16} />
            شروع نواختن
          </button>
          {best > 0 && (
            <span className="song-best">
              <Icon name="trophy" size={12} />
              {formatScore(best)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
