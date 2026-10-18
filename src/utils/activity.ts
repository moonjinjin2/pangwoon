import type { StatKey } from '../components/StatsBox';
import studyGif from '../img/study.gif';
import exerciseGif from '../img/exercise.gif';
import workGif from '../img/work.gif';
import restGif from '../img/rest.gif';

export type Activity = 'gym' | 'study' | 'job' | 'rest';

// 활동 1주 진행 시 변화량 (coins = 골드)
// 체력은 100에서 시작해 활동할수록 깎이고, 쉬기로만 회복됨
export type Effect = Partial<Record<StatKey | 'coins', number>>;

interface ActivityInfo {
  label: string;
  icon: string;
  effect: string;
  color: string;
  message: string;
  // 활동 중 보여줄 움짤
  animation?: string;
  // 움짤이 없을 때 대신 순서대로 반복되는 컷
  frames: string[];
  result: Effect;
  // true면 5일 성공/실패 판정 없이 result를 그대로 얻음
  noRoll?: boolean;
}

export const ACTIVITIES: Record<Activity, ActivityInfo> = {
  study: {
    label: '공부',
    icon: '📖',
    effect: '지능 ↑',
    color: '#a99cf5',
    message: '열심히 공부를 합니다...',
    animation: studyGif,
    frames: ['📖', '✏️', '📝'],
    result: { intellect: 8, stress: 10, health: -10 },
  },
  gym: {
    label: '헬스',
    icon: '🏋️',
    effect: '근력 ↑',
    color: '#f5a98a',
    message: '열심히 운동을 합니다...',
    animation: exerciseGif,
    frames: ['🏋️', '💪', '🏃'],
    result: { strength: 5, stress: 10, health: -15 },
  },
  job: {
    label: '알바',
    icon: '💼',
    effect: '골드 ↑',
    color: '#8fd8f5',
    message: '열심히 알바를 합니다...',
    animation: workGif,
    frames: ['💼', '☕', '💰'],
    result: { coins: 50000, stress: 15, health: -15 },
  },
  rest: {
    label: '쉬기',
    icon: '🛏️',
    effect: '스트레스 ↓',
    color: '#9fe39a',
    message: '푹 쉬고 있습니다...',
    animation: restGif,
    frames: ['🛏️', '💤', '😴'],
    result: { stress: -20, health: 20 },
    noRoll: true,
  },
};

export const ACTIVITY_ORDER: Activity[] = ['study', 'gym', 'job', 'rest'];

// 한 주차는 5일치를 한 번에 진행. 하루마다 성공(○)/실패(✕)를 랜덤으로 정함
export const DAYS_PER_WEEK = 5;
const SUCCESS_RATE = 0.7;

// 판정이 없는 활동(쉬기)은 빈 배열
export function rollDays(activity: Activity) {
  if (ACTIVITIES[activity].noRoll) return [];
  return Array.from({ length: DAYS_PER_WEEK }, () => Math.random() < SUCCESS_RATE);
}

// 스트레스는 줄어드는 쪽이 좋은 변화
export function isGoodChange(key: keyof Effect, value: number) {
  return key === 'stress' ? value < 0 : value > 0;
}

// result는 5일 모두 성공했을 때 기준. 좋은 변화는 성공한 날만큼만 얻고, 나쁜 변화(피로·스트레스)는 그대로 적용
// 판정이 없는 활동(쉬기)은 result 그대로
export function getWeekResult(activity: Activity, days: boolean[]): Effect {
  if (ACTIVITIES[activity].noRoll) return ACTIVITIES[activity].result;
  const successes = days.filter(Boolean).length;
  const result: Effect = {};
  for (const [key, value] of Object.entries(ACTIVITIES[activity].result) as [keyof Effect, number][]) {
    result[key] = isGoodChange(key, value) ? Math.round((value * successes) / DAYS_PER_WEEK) : value;
  }
  return result;
}
