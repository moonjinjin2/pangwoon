import type { StatKey } from '../components/StatsBox';

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
  // GIF처럼 순서대로 반복되는 컷. 픽셀아트 컷 이미지가 준비되면 교체
  frames: string[];
  result: Effect;
}

export const ACTIVITIES: Record<Activity, ActivityInfo> = {
  study: {
    label: '공부',
    icon: '📖',
    effect: '지능 ↑',
    color: '#a99cf5',
    message: '열심히 공부를 합니다...',
    frames: ['📖', '✏️', '📝'],
    result: { intellect: 8, stress: 10, health: -10 },
  },
  gym: {
    label: '헬스',
    icon: '🏋️',
    effect: '근력 ↑',
    color: '#f5a98a',
    message: '열심히 운동을 합니다...',
    frames: ['🏋️', '💪', '🏃'],
    result: { strength: 5, stress: 10, health: -15 },
  },
  job: {
    label: '알바',
    icon: '💼',
    effect: '골드 ↑',
    color: '#8fd8f5',
    message: '열심히 알바를 합니다...',
    frames: ['💼', '☕', '💰'],
    result: { coins: 50000, stress: 15, health: -15 },
  },
  rest: {
    label: '쉬기',
    icon: '🛏️',
    effect: '스트레스 ↓',
    color: '#9fe39a',
    message: '푹 쉬고 있습니다...',
    frames: ['🛏️', '💤', '😴'],
    result: { stress: -20, health: 20 },
  },
};

export const ACTIVITY_ORDER: Activity[] = ['study', 'gym', 'job', 'rest'];
