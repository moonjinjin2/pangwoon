import { useState } from 'react';
import ActivityModal from './ActivityModal';
import Icon, { ACTIVITY_ICONS, HeartMark } from './Icon';
import { effectLabel } from './ResultDialog';
import { formatMonthDay, getMonthWeeks, getWeekIndex, isWeekDone } from '../utils/gameDate';
import { ACTIVITIES, getEffectDirections, type Activity } from '../utils/activity';

export type { Activity };

interface Props {
  gameDate: string;
  plans: Activity[];
  onChangePlan: (week: number, activity: Activity) => void;
}

export default function MonthPlan({ gameDate, plans, onChangePlan }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const weeks = getMonthWeeks(gameDate);
  // 현재 게임 날짜가 속한 주차를 강조 (데이트·에피소드 날처럼 그 주차가 이미 끝났으면 강조 안 함)
  const currentWeek = getWeekIndex(gameDate);

  return (
    <section className="hud-card plan">
      <header className="hud-card__head">
        <HeartMark />
        <h3 className="hud-card__title">이번 달 스케줄</h3>
        <span className="plan__hint">눌러서 변경</span>
      </header>
      <ul className="plan__weeks">
        {weeks.map((week, i) => {
          const activity = plans[i];
          const locked = isWeekDone(week, gameDate);
          const effects = getEffectDirections(activity);
          const className = ['plan__week', i === currentWeek && !locked && 'plan__week--selected', locked && 'plan__week--locked']
            .filter(Boolean)
            .join(' ');
          return (
            <li key={i}>
              <button className={className} disabled={locked} onClick={() => setEditing(i)}>
                <span className="plan__icon">
                  <Icon name={ACTIVITY_ICONS[activity]} />
                </span>
                <span className="plan__info">
                  <span className="plan__range">
                    {i + 1}주차 · {formatMonthDay(week.start)} - {formatMonthDay(week.end)}
                  </span>
                  <span className="plan__activity">{ACTIVITIES[activity].label}</span>
                </span>
                <span className={effects.length > 3 ? 'plan__effects plan__effects--wide' : 'plan__effects'}>
                  {effects.map(({ key, up, good }) => (
                    <span key={key} className={good ? 'plan__effect plan__effect--good' : 'plan__effect'}>
                      {effectLabel(key)} {up ? '▲' : '▼'}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {editing !== null && (
        <ActivityModal
          title={`${editing + 1}주차 활동 선택`}
          current={plans[editing]}
          onSelect={(activity) => {
            onChangePlan(editing, activity);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
