import type { CSSProperties } from 'react';
import { HeartMark } from './Icon';

export type StatKey = 'health' | 'strength' | 'intellect' | 'stress';

export type Stats = Record<StatKey, number>;

// 기획서 4.1 스탯 규칙: 각 스탯 0 ~ 300
export const MAX_STAT = 300;

// 스트레스는 100이 되면 번아웃이라 100까지만
export const MAX_STRESS = 100;

// 스트레스가 이만큼 쌓이면 과로사 경고 (MAX_STRESS가 되면 과로사 엔딩)
export const STRESS_WARNING = 70;

// 체력이 이 값 미만이면 건강 악화 경고 (0이 되면 건강 악화 엔딩)
export const HEALTH_WARNING = 30;

// 위험 수치에 다가가면 경고하고, 한계에 닿으면 배드 엔딩으로 끝나는 스탯
export type DangerKind = 'stress' | 'health';

export const DANGER_KINDS: DangerKind[] = ['stress', 'health'];

export function isDanger(kind: DangerKind, stats: Stats) {
  return kind === 'stress' ? stats.stress >= STRESS_WARNING : stats.health < HEALTH_WARNING;
}

export function isGameOver(kind: DangerKind, stats: Stats) {
  return kind === 'stress' ? stats.stress >= MAX_STRESS : stats.health <= 0;
}

const DANGER_BADGES: Record<DangerKind, string> = {
  stress: '⚠ 과로 위험',
  health: '⚠ 건강 위험',
};

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

const statMeta: { key: StatKey; label: string; color: string }[] = [
  { key: 'health', label: '체력', color: '#d9668f' },
  { key: 'strength', label: '근력', color: '#eb9a78' },
  { key: 'intellect', label: '지성', color: '#a597e8' },
  { key: 'stress', label: '스트레스', color: '#b4aacb' },
];

export const STAT_LABELS = Object.fromEntries(statMeta.map(({ key, label }) => [key, label])) as Record<StatKey, string>;

interface Props {
  stats: Stats;
}

export default function StatsBox({ stats }: Props) {
  return (
    <section className="hud-card">
      <header className="hud-card__head">
        <HeartMark />
        <h3 className="hud-card__title">Status</h3>
      </header>
      <ul className="stats">
        {statMeta.map(({ key, label, color }) => {
          const max = getStatMax(key, stats);
          const value = Math.max(0, Math.min(max, stats[key]));
          // 경고 수치에 닿은 스탯은 경고 원인임을 알 수 있게 붉게 표시
          const danger = (key === 'stress' || key === 'health') && isDanger(key, stats);
          return (
            <li
              key={key}
              className={danger ? 'stat stat--danger' : 'stat'}
              style={{ '--stat-color': color } as CSSProperties}
            >
              <span className="stat__label">
                {label}
                {danger && <span className="stat__warn">{DANGER_BADGES[key]}</span>}
              </span>
              <span className="stat__value">
                {value} / {max}
              </span>
              <div className="stat__bar">
                <div className="stat__fill" style={{ width: `${(value / max) * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
