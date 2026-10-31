import { HeartMark } from './Icon';
import { ACTIVITIES, type Activity } from '../utils/activity';
import { CONTESTS, getContest } from '../utils/contest';
import { getDayEvent, getWeekIndex } from '../utils/gameDate';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

interface Props {
  gameDate: string;
  plans: Activity[];
}

// 이번 달 이름과 지금이 몇 주차인지 크게 보여주는 카드
export default function WeekCard({ gameDate, plans }: Props) {
  const month = Number(gameDate.split('-')[1]);
  const week = getWeekIndex(gameDate);
  const dayEvent = getDayEvent(gameDate);
  // 대회·말일 에피소드 날은 이번 주 활동 대신 그날 일정
  const subtitle =
    dayEvent === 'episode'
      ? '오늘 · 메인 에피소드'
      : dayEvent === 'contest'
        ? `오늘 · ${CONTESTS[getContest(gameDate)].label}`
        : `이번 주 · ${ACTIVITIES[plans[week]].label}`;

  return (
    <section className="hud-card week-card">
      <header className="hud-card__head">
        <HeartMark />
        <h3 className="hud-card__title">{MONTH_NAMES[month - 1]}</h3>
      </header>
      <div className="week-card__body">
        <span className="week-card__number">{week + 1}</span>
        <div className="week-card__text">
          <strong className="week-card__week">주차</strong>
          <span className="week-card__sub">{subtitle}</span>
        </div>
      </div>
    </section>
  );
}
