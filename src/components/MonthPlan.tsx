import { useState } from 'react';
import ActivityModal from './ActivityModal';
import Icon, { ACTIVITY_ICONS } from './Icon';
import Panel from './ui/Panel';
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
    <Panel title="이번 달 스케줄" icon="calendar" extra={<span className="g-plan__hint">눌러서 변경</span>}>
      <ul className="g-plan">
        {weeks.map((week, i) => {
          const activity = plans[i];
          const locked = isWeekDone(week, gameDate);
          const effects = getEffectDirections(activity);
          const className = ['g-week', i === currentWeek && !locked && 'g-week--selected', locked && 'g-week--locked']
            .filter(Boolean)
            .join(' ');
          return (
            <li key={i}>
              <button className={className} disabled={locked} onClick={() => setEditing(i)}>
                <span className="g-week__icon">
                  <Icon name={ACTIVITY_ICONS[activity]} />
                </span>
                <span className="g-week__info">
                  <span className="g-week__range">
                    {i + 1}주차 · {formatMonthDay(week.start)} ~ {formatMonthDay(week.end)}
                  </span>
                  <span className="g-week__activity">{ACTIVITIES[activity].label}</span>
                </span>
                <span className={effects.length > 3 ? 'g-week__effects g-week__effects--wide' : 'g-week__effects'}>
                  {effects.map(({ key, up, good }) => (
                    <span key={key} className={good ? 'g-week__effect g-week__effect--good' : 'g-week__effect'}>
                      {effectLabel(key)} <span className="g-week__arrow">{up ? '▲' : '▼'}</span>
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
    </Panel>
  );
}
