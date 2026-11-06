import type { CSSProperties } from 'react';
import { CONTESTS, type ContestType } from '../utils/contest';
import { getUpcomingContests } from '../utils/monthEvent';
import Icon, { type IconName } from './Icon';

// 대회별 아이콘과 카드 색 (배지 진한 색 / 배경 / 테두리)
const contestStyle: Record<ContestType, { icon: IconName; color: string; bg: string; line: string }> = {
  gym: { icon: 'dumbbell', color: '#c27150', bg: 'rgba(253, 233, 222, 0.85)', line: 'rgba(240, 196, 174, 0.8)' },
  exam: { icon: 'trophy', color: '#7a63c4', bg: 'rgba(236, 232, 252, 0.85)', line: 'rgba(200, 189, 240, 0.8)' },
};

// 메인 화면에 보여줄 대회 수
const SHOW_COUNT = 2;

interface Props {
  gameDate: string;
}

export default function UpcomingContests({ gameDate }: Props) {
  const contests = getUpcomingContests(gameDate).slice(0, SHOW_COUNT);
  if (contests.length === 0) return null;

  return (
    <section className="hud-card">
      <header className="hud-card__head">
        <Icon name="calendar" className="upcoming__icon" />
        <h3 className="hud-card__title">다가오는 대회</h3>
      </header>
      <ul className="upcoming">
        {contests.map(({ month, contest, daysLeft }) => {
          const { icon, color, bg, line } = contestStyle[contest];
          return (
            <li
              key={month}
              className="upcoming__item"
              style={{ '--contest-color': color, '--contest-bg': bg, '--contest-line': line } as CSSProperties}
            >
              <span className="upcoming__badge">
                <Icon name={icon} />
              </span>
              <span className="upcoming__info">
                <span className="upcoming__label">{CONTESTS[contest].label}</span>
                <span className="upcoming__month">{month}월</span>
              </span>
              <span className="upcoming__dday">{daysLeft === 0 ? 'D-Day' : `D-${daysLeft}`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
