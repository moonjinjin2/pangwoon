import Icon, { type IconName } from './Icon';
import Panel from './ui/Panel';
import ProgressBar from './ui/ProgressBar';

export type StatKey = 'health' | 'charm' | 'mental' | 'disguise';

export type Stats = Record<StatKey, number>;

// 스탯별 최대치 (0 ~ 최대치). 위장도는 아이템으로만 오름
const STAT_MAX: Record<StatKey, number> = {
  health: 100,
  charm: 100,
  mental: 100,
  disguise: 100,
};

// 시작 스탯: 체력 100, 나머지 0
export const INITIAL_STATS: Stats = { health: 100, charm: 0, mental: 0, disguise: 0 };

// 체력이 이 값 미만이면 경고 (0이 되면 즉시 사망)
export const DANGER_WARNING = 30;

// 위험 수치에 다가가면 경고하고, 0이 되면 배드 엔딩으로 끝나는 스탯
export type DangerKind = 'health';

export const DANGER_KINDS: DangerKind[] = ['health'];

// 배드 엔딩: 체력 0(사망) / 에피소드 위험도 100(정체 발각)
export type EndingKind = DangerKind | 'exposed';

export function isDanger(kind: DangerKind, stats: Stats) {
  return stats[kind] < DANGER_WARNING;
}

export function isGameOver(kind: DangerKind, stats: Stats) {
  return stats[kind] <= 0;
}

const DANGER_BADGES: Record<DangerKind, string> = {
  health: '⚠ 건강 위험',
};

export function getStatMax(key: StatKey) {
  return STAT_MAX[key];
}

// 스탯을 각자의 범위(0 ~ 최대치) 안으로
export function clampStats(stats: Stats): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) next[key] = Math.max(0, Math.min(STAT_MAX[key], next[key] ?? 0));
  return next;
}

export const STAT_META: { key: StatKey; label: string; icon: IconName; color: string }[] = [
  { key: 'health', label: '체력', icon: 'heart', color: '#d8475f' },
  { key: 'charm', label: '매력', icon: 'sparkle', color: '#e07aa6' },
  { key: 'mental', label: '정신력', icon: 'moon', color: '#7f74d6' },
  { key: 'disguise', label: '위장도', icon: 'mask', color: '#9a8fa8' },
];

export const STAT_KEYS = STAT_META.map(({ key }) => key);

// 경고 수치에 닿은 스탯의 막대 색
export const DANGER_COLOR = '#ff4d6a';

export type StatGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

// 최대치 대비 비율로 매기는 등급 (높은 등급부터, 이 비율 이상이면 그 등급)
const GRADES: { grade: StatGrade; ratio: number }[] = [
  { grade: 'S', ratio: 0.9 },
  { grade: 'A', ratio: 0.8 },
  { grade: 'B', ratio: 0.65 },
  { grade: 'C', ratio: 0.5 },
  { grade: 'D', ratio: 0.35 },
  { grade: 'F', ratio: 0 },
];

export function getStatGrade(key: StatKey, stats: Stats): StatGrade {
  const ratio = Math.max(0, Math.min(1, stats[key] / STAT_MAX[key]));
  return GRADES.find(({ ratio: min }) => ratio >= min)!.grade;
}

export const STAT_LABELS = Object.fromEntries(STAT_META.map(({ key, label }) => [key, label])) as Record<StatKey, string>;

interface Props {
  stats: Stats;
}

export default function StatsBox({ stats }: Props) {
  return (
    <Panel title="상태 정보" icon="sparkle">
      <ul className="g-stats">
        {STAT_META.map(({ key, label, icon, color }) => {
          const max = STAT_MAX[key];
          const value = Math.max(0, Math.min(max, stats[key]));
          // 경고 수치에 닿은 스탯은 경고 원인임을 알 수 있게 붉게 표시
          const danger = key === 'health' && isDanger(key, stats);
          const grade = getStatGrade(key, stats);
          return (
            <li key={key} className={danger ? 'g-stat g-stat--danger' : 'g-stat'}>
              <Icon name={icon} className="g-stat__icon" />
              <span className="g-stat__label">
                {label}
                {danger && <span className="g-stat__warn">{DANGER_BADGES[key]}</span>}
              </span>
              <span className="g-stat__value">
                {value} / {max}
              </span>
              <span className={`g-stat__grade g-stat__grade--${grade.toLowerCase()}`}>{grade}</span>
              <ProgressBar className="g-stat__bar" value={value} max={max} color={danger ? DANGER_COLOR : color} />
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
