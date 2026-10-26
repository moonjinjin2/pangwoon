import type { StatKey, Stats } from '../components/StatsBox';
import type { Effect } from './activity';
import { getMonthIndex } from './gameDate';

// 기획서 4.3 미니 이벤트: 매달 15일 대회 (헬스대회·경시대회를 달마다 번갈아)
export type ContestType = 'gym' | 'exam';

const CONTEST_ORDER: ContestType[] = ['gym', 'exam'];

interface Requirement {
  stat: StatKey;
  label: string;
  // 'min': 이 값 이상, 'max': 이 값 이하
  kind: 'min' | 'max';
  value: number;
}

interface ContestInfo {
  label: string;
  icon: string;
  color: string;
  // 순위를 정하는 스탯
  stat: StatKey;
  requirements: Requirement[];
  // 참가 시 변화량
  entryEffect: Effect;
}

export const CONTESTS: Record<ContestType, ContestInfo> = {
  gym: {
    label: '헬스대회',
    icon: '🏆',
    color: '#f5a98a',
    stat: 'strength',
    requirements: [
      { stat: 'strength', label: '근력', kind: 'min', value: 40 },
      { stat: 'health', label: '체력', kind: 'min', value: 20 },
    ],
    entryEffect: { health: -10 },
  },
  exam: {
    label: '경시대회',
    icon: '📝',
    color: '#a99cf5',
    stat: 'intellect',
    requirements: [
      { stat: 'intellect', label: '지성', kind: 'min', value: 40 },
      { stat: 'stress', label: '스트레스', kind: 'max', value: 20 },
    ],
    entryEffect: { stress: 10 },
  },
};

export function getContest(date: string): ContestType {
  return CONTEST_ORDER[getMonthIndex(date) % CONTEST_ORDER.length];
}

export function meetsRequirement({ stat, kind, value }: Requirement, stats: Stats) {
  return kind === 'min' ? stats[stat] >= value : stats[stat] <= value;
}

export function canEnter(type: ContestType, stats: Stats) {
  return CONTESTS[type].requirements.every((r) => meetsRequirement(r, stats));
}

// 순위별 상금 (1등, 2등, 3등)
export const PRIZES = [500000, 200000, 100000];

// 순위 스탯 구간별 1등 / 2등 / 3등 / 탈락 확률 (두 대회 같은 표)
const RANK_RATES: { min: number; rates: number[] }[] = [
  { min: 120, rates: [0.45, 0.4, 0.15, 0] },
  { min: 90, rates: [0.15, 0.45, 0.3, 0.1] },
  { min: 60, rates: [0, 0.2, 0.5, 0.3] },
  { min: 0, rates: [0, 0, 0.3, 0.7] },
];

// 1 ~ 3등, 탈락이면 null
export function rollRank(type: ContestType, stats: Stats): number | null {
  const { rates } = RANK_RATES.find(({ min }) => stats[CONTESTS[type].stat] >= min)!;
  let r = Math.random();
  for (let i = 0; i < PRIZES.length; i++) {
    r -= rates[i];
    if (r < 0) return i + 1;
  }
  return null;
}

// 참가 결과 변화량 (참가 비용 + 상금)
export function getContestResult(type: ContestType, rank: number | null): Effect {
  const result: Effect = { ...CONTESTS[type].entryEffect };
  if (rank) result.coins = PRIZES[rank - 1];
  return result;
}
