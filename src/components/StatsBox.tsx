import type { CSSProperties, ReactNode } from 'react';
import Box from './Box';

export type StatKey = 'health' | 'strength' | 'intellect' | 'stress';

export type Stats = Record<StatKey, number>;

// 기획서 4.1 스탯 규칙: 각 스탯 0 ~ 300
export const MAX_STAT = 300;

// 스트레스는 100이 되면 번아웃이라 100까지만
export const MAX_STRESS = 100;

// 체력 최대치는 100에서 시작해 근력 2당 1씩 늘어남 (근력 300이면 250)
const BASE_HEALTH = 100;

export function getMaxHealth(stats: Stats) {
  return Math.min(MAX_STAT, BASE_HEALTH + Math.floor(stats.strength / 2));
}

export function getStatMax(key: StatKey, stats: Stats) {
  if (key === 'health') return getMaxHealth(stats);
  if (key === 'stress') return MAX_STRESS;
  return MAX_STAT;
}

// 스탯을 각자의 범위(0 ~ 최대치) 안으로
export function clampStats(stats: Stats): Stats {
  const next = { ...stats };
  // 체력 최대치가 근력에 따라 바뀌므로 근력부터
  for (const key of ['strength', 'intellect', 'stress', 'health'] as StatKey[]) {
    next[key] = Math.max(0, Math.min(getStatMax(key, next), next[key]));
  }
  return next;
}

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
  stress: <path className="stat__icon-stroke" d="M7 8h2V6H5v5h6V4H3v9h10" />,
};

const statMeta: { key: StatKey; label: string; color: string }[] = [
  { key: 'health', label: '체력', color: '#f28ba8' },
  { key: 'strength', label: '근력', color: '#a8d08d' },
  { key: 'intellect', label: '지성', color: '#8fc4f2' },
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
          const max = getStatMax(key, stats);
          const value = Math.max(0, Math.min(max, stats[key]));
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
                  <div className="stat__fill" style={{ width: `${(value / max) * 100}%` }} />
                </div>
                <span className="stat__value">
                  {value} / {max}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Box>
  );
}
