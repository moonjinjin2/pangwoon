import type { StatKey } from '../components/StatsBox';
import jobSuccessGif from '../img/activity/학사근로_성공.gif';
import jobNormalGif from '../img/activity/학사근로_보통.gif';
import jobFailGif from '../img/activity/학사근로_실패.gif';
import gymSuccessGif from '../img/activity/침대뒹굴기_성공.gif';
import gymNormalGif from '../img/activity/침대뒹굴기_보통.gif';
import gymFailGif from '../img/activity/침대뒹굴기_실패.gif';
import meditateSuccessGif from '../img/activity/명상_성공.gif';
import meditateNormalGif from '../img/activity/명상_보통.gif';
import meditateFailGif from '../img/activity/명상_실패.gif';
import tanningSuccessGif from '../img/activity/화이트태닝_성공.gif';
import tanningNormalGif from '../img/activity/화이트태닝_보통.gif';
import tanningFailGif from '../img/activity/화이트태닝_실패.gif';

export type Activity = 'job' | 'blood' | 'rest' | 'meditate' | 'tanning';

// 스탯·자금 변화량 (coins = 자금, 원 단위)
export type Effect = Partial<Record<StatKey | 'coins', number>>;

// 하루(칸) 판정: ✕ 실패 / △ 보통 / ○ 성공
export type Grade = 'fail' | 'normal' | 'success';

export const GRADES: Grade[] = ['fail', 'normal', 'success'];

interface ActivityInfo {
  label: string;
  // 활동 선택 창에 보여줄 한 줄 효과 설명
  description: string;
  icon: string;
  color: string;
  message: string;
  // 활동 중 보여줄 움짤. 판정별로 나뉘어 있으면 5일치 평균 판정에 맞는 움짤을 보여줌
  animation?: string | Record<Grade, string>;
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
    description: '돈을 벌 수 있지만 체력이 조금 깎여요.',
    icon: '💼',
    color: '#8fd8f5',
    message: '학사 사무실에서 알바를 합니다...',
    animation: { success: jobSuccessGif, normal: jobNormalGif, fail: jobFailGif },
    frames: ['💼', '☕', '💰'],
    cost: 0,
    perDay: {
      fail: { coins: 4000, health: -9 },
      normal: { coins: 8000, health: -8 },
      success: { coins: 12000, health: -6 },
    },
  },
  blood: {
    label: '피 뽑기',
    description: '돈을 많이 벌 수 있지만 체력이 크게 깎여요. 몸 상태를 꼭 확인하세요.',
    icon: '🩸',
    color: '#d8475f',
    message: '헌혈의 집에서 피를 뽑습니다...',
    frames: ['🩸', '💉', '💰'],
    cost: 0,
    perDay: {
      fail: { coins: 20000, health: -18 },
      normal: { coins: 45000, health: -16 },
      success: { coins: 60000, health: -14 },
    },
  },
  rest: {
    label: '침대에서 뒹굴거리기',
    description: '푹 쉬면서 체력을 회복해요.',
    icon: '🛏️',
    color: '#f5a98a',
    message: '침대에서 뒹굴거리며 쉽니다...',
    animation: { success: gymSuccessGif, normal: gymNormalGif, fail: gymFailGif },
    frames: ['🛏️', '💤', '😪'],
    cost: 0,
    perDay: {
      fail: { health: 10 },
      normal: { health: 15 },
      success: { health: 20 },
    },
  },
  meditate: {
    label: '명상',
    description: '정신력이 오르지만 체력이 조금 깎여요.',
    icon: '🕯️',
    color: '#a99cf5',
    message: '조용히 명상을 합니다...',
    animation: { success: meditateSuccessGif, normal: meditateNormalGif, fail: meditateFailGif },
    frames: ['🕯️', '🌙', '🧘'],
    cost: 0,
    perDay: {
      fail: { mental: 1, health: -9 },
      normal: { mental: 2, health: -8 },
      success: { mental: 3, health: -6 },
    },
  },
  tanning: {
    label: '화이트태닝',
    description: '매력이 오르지만 체력이 꽤 깎여요.',
    icon: '✨',
    color: '#f5c6dc',
    message: '창백하고 매혹적인 피부를 가꿉니다...',
    animation: { success: tanningSuccessGif, normal: tanningNormalGif, fail: tanningFailGif },
    frames: ['🧴', '✨', '🪞'],
    cost: 0,
    perDay: {
      fail: { health: -14 },
      normal: { charm: 1, health: -12 },
      success: { charm: 1, health: -10 },
    },
  },
};

export const ACTIVITY_ORDER: Activity[] = ['job', 'blood', 'rest', 'meditate', 'tanning'];

// 한 주차는 월~금 5일치를 한 번에 진행
export const DAYS_PER_WEEK = 5;

// 한 주 활동 비용 (진행 전에 이만큼 있어야 함)
export function getWeekCost(activity: Activity) {
  return ACTIVITIES[activity].cost * DAYS_PER_WEEK;
}

// 하루 판정 확률 ✕ / △ / ○
export const GRADE_RATES: Record<Grade, number> = { fail: 0.25, normal: 0.55, success: 0.2 };

function rollGrade(): Grade {
  let r = Math.random();
  for (const grade of GRADES) {
    r -= GRADE_RATES[grade];
    if (r < 0) return grade;
  }
  return 'success';
}

// 하루마다 ✕/△/○를 랜덤으로 정함
// 중간에 체력이 0이 되더라도 5일치를 모두 보여주고, 사망은 결과를 반영한 뒤 판정
export function rollDays(): Grade[] {
  return Array.from({ length: DAYS_PER_WEEK }, rollGrade);
}

const GRADE_SCORES: Record<Grade, number> = { fail: 0, normal: 1, success: 2 };

// 여러 날 판정의 평균 (✕=0, △=1, ○=2 점수 평균을 반올림)
export function getAverageGrade(days: Grade[]): Grade {
  if (days.length === 0) return 'normal';
  const avg = days.reduce((sum, grade) => sum + GRADE_SCORES[grade], 0) / days.length;
  return GRADES[Math.round(avg)];
}

// 활동 중 보여줄 움짤 (판정별 움짤이 있으면 평균 판정에 맞는 것으로)
export function getAnimation(activity: Activity, days: Grade[]) {
  const { animation } = ACTIVITIES[activity];
  return typeof animation === 'object' ? animation[getAverageGrade(days)] : animation;
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
  rest: [['health', 'up']],
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
