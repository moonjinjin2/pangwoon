import type { CSSProperties, ReactNode } from 'react';
import Box from './Box';

export type StatKey = 'health' | 'strength' | 'intellect' | 'charm' | 'stress';

export type Stats = Record<StatKey, number>;

export const MAX_STAT = 100;

// 16x16 픽셀 아이콘
const icons: Record<StatKey, ReactNode> = {
  health: (
    <path d="M3 3h4v1h2V3h4v1h1v4h-1v1h-1v1h-1v1h-1v1h-1v1H7v-1H6v-1H5v-1H4V9H3V8H2V4h1z" />
  ),
  strength: <path d="M2 4h2v8H2z M12 4h2v8h-2z M1 6h1v4H1z M14 6h1v4h-1z M4 7h8v2H4z" />,
  intellect: (
    <>
      <path d="M1 3h6v10H1z M9 3h6v10H9z" />
      <path className="stat__icon-ink" d="M2 5h4v1H2z M2 7h4v1H2z M2 9h4v1H2z M10 5h4v1h-4z M10 7h4v1h-4z M10 9h4v1h-4z" />
    </>
  ),
  charm: (
    <path d="M7 1h2v4h5v2h-1v1h-1v1h-1v2h1v3h-1v1h-1v-1H9v-1H7v1H6v1H5v-1H4v-3h1V9H4V8H3V7H2V5h5z" />
  ),
  stress: <path className="stat__icon-stroke" d="M7 8h2V6H5v5h6V4H3v9h10" />,
};

const statMeta: { key: StatKey; label: string; color: string }[] = [
  { key: 'health', label: '체력', color: '#f28ba8' },
  { key: 'strength', label: '근력', color: '#a8d08d' },
  { key: 'intellect', label: '지성', color: '#8fc4f2' },
  { key: 'charm', label: '매력', color: '#b48cf2' },
  { key: 'stress', label: '스트레스', color: '#b98cf0' },
];

export const STAT_LABELS = Object.fromEntries(statMeta.map(({ key, label }) => [key, label])) as Record<StatKey, string>;

interface Props {
  stats: Stats;
}

export default function StatsBox({ stats }: Props) {
  return (
    <Box title="Status">
      <ul className="stats">
        {statMeta.map(({ key, label, color }) => {
          const value = Math.max(0, Math.min(MAX_STAT, stats[key]));
          return (
            <li key={key} className="stat" style={{ '--stat-color': color } as CSSProperties}>
              <span className="stat__icon">
                <svg viewBox="0 0 16 16" aria-hidden>
                  {icons[key]}
                </svg>
              </span>
              <div className="stat__info">
                <span className="stat__label">{label}</span>
                <div className="stat__bar">
                  <div className="stat__fill" style={{ width: `${(value / MAX_STAT) * 100}%` }} />
                </div>
                <span className="stat__value">
                  {value} / {MAX_STAT}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Box>
  );
}
