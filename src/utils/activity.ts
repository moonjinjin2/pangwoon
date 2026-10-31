import type { StatKey, Stats } from '../components/StatsBox';
import studyGif from '../img/study.gif';
import exerciseGif from '../img/exercise.gif';
import workGif from '../img/work.gif';
import restGif from '../img/rest.gif';

export type Activity = 'gym' | 'study' | 'job' | 'rest';

// 스탯·자금 변화량 (coins = 자금, 원 단위)
export type Effect = Partial<Record<StatKey | 'coins', number>>;

// 하루(칸) 판정: ✕ 실패 / △ 보통 / ○ 성공
export type Grade = 'fail' | 'normal' | 'success';

export const GRADES: Grade[] = ['fail', 'normal', 'success'];

interface ActivityInfo {
  label: string;
  icon: string;
  color: string;
  message: string;
  // 활동 중 보여줄 움짤
  animation?: string;
  // 움짤이 없을 때 대신 순서대로 반복되는 컷
  frames: string[];
  // 하루(칸) 비용 (원). 판정과 상관없이 매일 나감
  cost: number;
  // 하루(칸) 판정별 변화량
  perDay: Record<Grade, Effect>;
  // 판정 확률을 정하는 관련 스탯 (여러 개면 평균, 없으면 보통 구간 확률)
  relatedStats: StatKey[];
}

// 기획서 4.1 활동별 효과(칸당), 4.2 한 주(5칸) 결과 범위 기준
export const ACTIVITIES: Record<Activity, ActivityInfo> = {
  study: {
    label: '공부',
    icon: '📖',
    color: '#a99cf5',
    message: '열심히 공부를 합니다...',
    animation: studyGif,
    frames: ['📖', '✏️', '📝'],
    cost: 5000,
    perDay: {
      fail: { intellect: 2, stress: 8 },
      normal: { intellect: 3, stress: 6 },
      success: { intellect: 4, stress: 4 },
    },
    relatedStats: ['intellect'],
  },
  gym: {
    label: '헬스',
    icon: '🏋️',
    color: '#f5a98a',
    message: '열심히 운동을 합니다...',
    animation: exerciseGif,
    frames: ['🏋️', '💪', '🏃'],
    cost: 10000,
    perDay: {
      fail: { strength: 2, health: -8 },
      normal: { strength: 3, health: -6 },
      success: { strength: 4, health: -4 },
    },
    relatedStats: ['strength'],
  },
  job: {
    label: '알바',
    icon: '💼',
    color: '#8fd8f5',
    message: '열심히 알바를 합니다...',
    animation: workGif,
    frames: ['💼', '☕', '💰'],
    cost: 0,
    perDay: {
      fail: { coins: 60000, health: -6, stress: 5 },
      normal: { coins: 90000, health: -5, stress: 4 },
      success: { coins: 120000, health: -4, stress: 3 },
    },
    relatedStats: ['strength', 'intellect'],
  },
  rest: {
    label: '쉬기',
    icon: '🛏️',
    color: '#9fe39a',
    message: '푹 쉬고 있습니다...',
    animation: restGif,
    frames: ['🛏️', '💤', '😴'],
    cost: 0,
    perDay: {
      fail: { health: 10, stress: -8 },
      normal: { health: 12, stress: -10 },
      success: { health: 15, stress: -12 },
    },
    relatedStats: [],
  },
};

export const ACTIVITY_ORDER: Activity[] = ['study', 'gym', 'job', 'rest'];

// 한 주차는 5일(5칸)치를 한 번에 진행
export const DAYS_PER_WEEK = 5;

// 한 주 활동 비용 (진행 전에 이만큼 있어야 함)
export function getWeekCost(activity: Activity) {
  return ACTIVITIES[activity].cost * DAYS_PER_WEEK;
}

// 기획서 4.1 활동 결과 판정 확률 (관련 스탯 구간별 ✕ / △ / ○)
const GRADE_RATES: { min: number; rates: Record<Grade, number> }[] = [
  { min: 120, rates: { fail: 0.1, normal: 0.3, success: 0.6 } },
  { min: 60, rates: { fail: 0.2, normal: 0.4, success: 0.4 } },
  { min: 0, rates: { fail: 0.4, normal: 0.4, success: 0.2 } },
];

// 관련 스탯이 없는 활동(쉬기)은 보통 구간(60~119) 확률
const DEFAULT_STAT = 60;

export function getGradeRates(activity: Activity, stats: Stats) {
  const keys = ACTIVITIES[activity].relatedStats;
  const value = keys.length ? keys.reduce((sum, key) => sum + stats[key], 0) / keys.length : DEFAULT_STAT;
  return GRADE_RATES.find(({ min }) => value >= min)!.rates;
}

// 하루마다 ✕/△/○를 랜덤으로 정함
export function rollDays(activity: Activity, stats: Stats): Grade[] {
  const rates = getGradeRates(activity, stats);
  return Array.from({ length: DAYS_PER_WEEK }, () => {
    let r = Math.random();
    for (const grade of GRADES) {
      r -= rates[grade];
      if (r < 0) return grade;
    }
    return 'success';
  });
}

// 스트레스는 줄어드는 쪽이 좋은 변화
export function isGoodChange(key: keyof Effect, value: number) {
  return key === 'stress' ? value < 0 : value > 0;
}

// 5일치 판정 결과를 합친 한 주 변화량 (비용 포함)
export function getWeekResult(activity: Activity, days: Grade[]): Effect {
  const { cost, perDay } = ACTIVITIES[activity];
  const result: Effect = {};
  const add = (key: keyof Effect, value: number) => {
    const sum = (result[key] ?? 0) + value;
    if (sum === 0) delete result[key];
    else result[key] = sum;
  };
  for (const grade of days) {
    for (const [key, value] of Object.entries(perDay[grade]) as [keyof Effect, number][]) add(key, value);
    add('coins', -cost);
  }
  return result;
}

// 계획표에 보여줄 활동별 주요 효과 (실제 수치의 부수 효과·비용은 빼고 핵심만)
const EFFECT_SUMMARY: Record<Activity, [keyof Effect, 'up' | 'down'][]> = {
  job: [['coins', 'up'], ['health', 'down'], ['stress', 'up']],
  study: [['intellect', 'up'], ['stress', 'up']],
  gym: [['strength', 'up'], ['health', 'down']],
  rest: [['health', 'up'], ['stress', 'down']],
};

// 활동이 올리고 내리는 항목
export function getEffectDirections(activity: Activity) {
  return EFFECT_SUMMARY[activity].map(([key, direction]) => {
    const up = direction === 'up';
    return { key, up, good: isGoodChange(key, up ? 1 : -1) };
  });
}
