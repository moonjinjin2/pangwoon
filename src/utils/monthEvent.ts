import { CONTESTS, type ContestType } from './contest';
import { EVENT_DAY } from './gameDate';
import { DATE_EPISODES, SPEAKERS, type Episode, type Heroine } from './episode';
import { isCollected } from './storage';

// 매달 15일(2주차 다음) 이벤트: 정해진 히로인과 데이트 / 대회 / 히로인 3명 중 1명 골라 데이트
export type MonthEvent =
  | { kind: 'date'; heroine: Heroine }
  | { kind: 'contest'; contest: ContestType }
  | { kind: 'pick' };

const MONTH_EVENTS: Record<number, MonthEvent> = {
  4: { kind: 'date', heroine: 'minji' },
  5: { kind: 'date', heroine: 'siyeong' },
  6: { kind: 'date', heroine: 'emily' },
  7: { kind: 'contest', contest: 'gym' },
  8: { kind: 'contest', contest: 'exam' },
  9: { kind: 'pick' },
  10: { kind: 'pick' },
  11: { kind: 'pick' },
  12: { kind: 'contest', contest: 'gym' },
};

// 일정이 정해지지 않은 달은 히로인 선택 데이트
export function getMonthEvent(date: string): MonthEvent {
  return MONTH_EVENTS[Number(date.split('-')[1])] ?? { kind: 'pick' };
}

export function getMonthEventLabel(event: MonthEvent) {
  if (event.kind === 'contest') return CONTESTS[event.contest].label;
  if (event.kind === 'date') return `${SPEAKERS[event.heroine].name} 데이트`;
  return '히로인 데이트';
}

// 오늘(이벤트 날 포함) 이후 열리는 대회와 남은 일수
export function getUpcomingContests(date: string): { month: number; contest: ContestType; daysLeft: number }[] {
  const [year, month, day] = date.split('-').map(Number);
  const today = new Date(year, month - 1, day);
  return Object.entries(MONTH_EVENTS)
    .map(([m, event]) => ({ month: Number(m), event }))
    .filter(({ month: m, event }) => event.kind === 'contest' && (m > month || (m === month && day <= EVENT_DAY)))
    .map(({ month: m, event }) => ({
      month: m,
      contest: (event as { contest: ContestType }).contest,
      daysLeft: Math.round((new Date(year, m - 1, EVENT_DAY).getTime() - today.getTime()) / 86400000),
    }));
}

// 히로인의 아직 안 본 다음 데이트 (다 봤으면 undefined)
export function getNextDate(heroine: Heroine): { episode: Episode; order: number } | undefined {
  const index = DATE_EPISODES[heroine].findIndex((episode) => !isCollected(episode.id));
  return index === -1 ? undefined : { episode: DATE_EPISODES[heroine][index], order: index + 1 };
}
