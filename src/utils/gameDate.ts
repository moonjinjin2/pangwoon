export const START_GAME_DATE = '2026-04-01';

// 'YYYY-MM-DD' → '04/01'
export function formatShortDate(date: string) {
  const [, m, d] = date.split('-');
  return `${m}/${d}`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 'YYYY-MM-DD' → '2026년 04월 01일 (수)'
export function formatFullDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${y}년 ${m}월 ${d}일 (${WEEKDAYS[toDate(date).getDay()]})`;
}

function toDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface Week {
  start: Date;
  end: Date;
}

function lastDayOf(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// 매달 15일(2주차와 3주차 사이)은 데이트 날
export const DATE_DAY = 15;

// 각 주차 시작일. 2주차 다음 15일은 데이트, 4주차는 말일 전날까지(말일은 에피소드)
const WEEK_START_DAYS = [1, 8, DATE_DAY + 1, DATE_DAY + 8];

export function getMonthWeeks(date: string): Week[] {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const lastDay = lastDayOf(d);
  return WEEK_START_DAYS.map((startDay, i) => ({
    start: new Date(year, month, startDay),
    end: new Date(year, month, i === 1 ? DATE_DAY - 1 : i === 3 ? lastDay - 1 : startDay + 6),
  }));
}

// 게임 날짜가 몇 주차(0~3)인지
export function getWeekIndex(date: string) {
  const day = toDate(date).getDate();
  return WEEK_START_DAYS.filter((startDay) => startDay <= day).length - 1;
}

export type DayEvent = 'date' | 'episode';

// 이벤트 날인지: 15일은 데이트, 말일은 에피소드
export function getDayEvent(date: string): DayEvent | null {
  const d = toDate(date);
  if (d.getDate() === lastDayOf(d)) return 'episode';
  if (d.getDate() === DATE_DAY) return 'date';
  return null;
}

// 게임 시작 달부터 몇 번째 달인지 (0부터)
export function getMonthIndex(date: string) {
  const d = toDate(date);
  const start = toDate(START_GAME_DATE);
  return (d.getFullYear() - start.getFullYear()) * 12 + d.getMonth() - start.getMonth();
}

// 진행하기 후의 날짜
// 1주차 → 2주차 → 데이트(15일) → 3주차 → 4주차 → 에피소드(말일) → 다음 달 1일
export function getNextWeekDate(date: string) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const lastDay = lastDayOf(d);
  const nextDay = [...WEEK_START_DAYS, DATE_DAY, lastDay].sort((a, b) => a - b).find((n) => n > day);
  const next = nextDay ? new Date(year, month, nextDay) : new Date(year, month + 1, 1);
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${next.getFullYear()}-${mm}-${dd}`;
}

export function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// 게임 날짜 기준으로 이미 진행을 마친 주차인지 (변경 불가)
// 진행하기를 눌러야 날짜가 넘어가므로, 현재 주차는 아직 변경 가능
export function isWeekDone(week: Week, date: string) {
  return toDate(date) > week.end;
}
