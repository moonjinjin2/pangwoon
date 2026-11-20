import { getStatMax, type StatKey, type Stats } from '../components/StatsBox';
import exerciseGif from '../img/exercise.gif';
import workGif from '../img/work.gif';
import restGif from '../img/rest.gif';

export type Activity = 'job' | 'blood' | 'gym' | 'meditate' | 'tanning';

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
  // 하루 비용 (원). 판정과 상관없이 매일 나감
  cost: number;
  // 하루 판정별 변화량
  perDay: Record<Grade, Effect>;
}

// 활동별 효과(하루 기준). 위장도는 활동으로 오르지 않고 아이템으로만 오름 (기획서: 밸런스 요약 2)
export const ACTIVITIES: Record<Activity, ActivityInfo> = {
  job: {
    label: '학사 알바',
    icon: '💼',
    color: '#8fd8f5',
    message: '학사 사무실에서 알바를 합니다...',
    animation: workGif,
    frames: ['💼', '☕', '💰'],
    cost: 0,
    perDay: {
      fail: { coins: 4000, health: -6 },
      normal: { coins: 8000, health: -4 },
      success: { coins: 12000, health: -3 },
    },
  },
  blood: {
    label: '피 뽑기',
    icon: '🩸',
    color: '#d8475f',
    message: '헌혈의 집에서 피를 뽑습니다...',
    frames: ['🩸', '💉', '💰'],
    cost: 0,
    perDay: {
      fail: { coins: 20000, health: -16 },
      normal: { coins: 45000, health: -14 },
      success: { coins: 60000, health: -12 },
    },
  },
  gym: {
    label: '운동',
    icon: '🏋️',
    color: '#f5a98a',
    message: '열심히 운동을 합니다...',
    animation: exerciseGif,
    frames: ['🏋️', '💪', '🏃'],
    cost: 0,
    perDay: {
      fail: { health: -2 },
      normal: { health: 4 },
      success: { health: 8 },
    },
  },
  meditate: {
    label: '명상',
    icon: '🕯️',
    color: '#a99cf5',
    message: '조용히 명상을 합니다...',
    animation: restGif,
    frames: ['🕯️', '🌙', '🧘'],
    cost: 0,
    perDay: {
      fail: { mental: -1, health: -1 },
      normal: {},
      success: { mental: 1 },
    },
  },
  tanning: {
    label: '화이트태닝',
    icon: '✨',
    color: '#f5c6dc',
    message: '창백하고 매혹적인 피부를 가꿉니다...',
    frames: ['🧴', '✨', '🪞'],
    cost: 0,
    perDay: {
      fail: { health: -2 },
      normal: {},
      success: { charm: 1 },
    },
  },
};

export const ACTIVITY_ORDER: Activity[] = ['job', 'blood', 'gym', 'meditate', 'tanning'];

// 한 주차는 월~금 5일치를 한 번에 진행
export const DAYS_PER_WEEK = 5;

// 한 주 활동 비용 (진행 전에 이만큼 있어야 함)
export function getWeekCost(activity: Activity) {
  return ACTIVITIES[activity].cost * DAYS_PER_WEEK;
}

// 하루 판정 확률 ✕ / △ / ○ (기획서 평균: 20일 중 실패 3일·보통 5일·성공 12일)
export const GRADE_RATES: Record<Grade, number> = { fail: 0.15, normal: 0.25, success: 0.6 };

function rollGrade(): Grade {
  let r = Math.random();
  for (const grade of GRADES) {
    r -= GRADE_RATES[grade];
    if (r < 0) return grade;
  }
  return 'success';
}

// 하루마다 ✕/△/○를 랜덤으로 정함
// 체력이 0이 되면 즉시 사망하므로 그날까지만 진행하고 남은 요일은 진행하지 않음
export function rollDays(activity: Activity, stats: Stats): Grade[] {
  const { perDay } = ACTIVITIES[activity];
  const days: Grade[] = [];
  let health = stats.health;
  while (days.length < DAYS_PER_WEEK && health > 0) {
    const grade = rollGrade();
    days.push(grade);
    health = Math.min(getStatMax('health'), health + (perDay[grade].health ?? 0));
  }
  return days;
}

// 모든 스탯·자금은 오르는 쪽이 좋은 변화
export function isGoodChange(_key: keyof Effect, value: number) {
  return value > 0;
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
  job: [['coins', 'up'], ['health', 'down']],
  blood: [['coins', 'up'], ['health', 'down']],
  gym: [['health', 'up']],
  meditate: [['mental', 'up']],
  tanning: [['charm', 'up']],
};

// 활동이 올리고 내리는 항목
export function getEffectDirections(activity: Activity) {
  return EFFECT_SUMMARY[activity].map(([key, direction]) => {
    const up = direction === 'up';
    return { key, up, good: isGoodChange(key, up ? 1 : -1) };
  });
}
