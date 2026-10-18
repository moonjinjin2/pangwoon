import { useState } from 'react';
import Box from './Box';
import CalendarIcon from './CalendarIcon';
import ActivityModal from './ActivityModal';
import { formatMonthDay, getMonthWeeks, getWeekIndex, isWeekDone } from '../utils/gameDate';
import { ACTIVITIES, type Activity } from '../utils/activity';

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
    <Box title="Plan">
      <div className="plan">
        <h3 className="plan__title">
          <CalendarIcon />
          이번 달 계획
        </h3>
        <ul className="plan__weeks">
          {weeks.map((week, i) => {
            const activity = ACTIVITIES[plans[i]];
            const locked = isWeekDone(week, gameDate);
            const className = ['plan__week', i === currentWeek && !locked && 'plan__week--selected', locked && 'plan__week--locked']
              .filter(Boolean)
              .join(' ');
            return (
              <li key={i}>
                <button
                  className={className}
                  disabled={locked}
                  onClick={() => setEditing(i)}
                >
                  <span className="plan__icon" aria-hidden>{activity.icon}</span>
                  <span className="plan__info">
                    <span className="plan__range">
                      {i + 1}주차 ({formatMonthDay(week.start)} ~ {formatMonthDay(week.end)})
                    </span>
                    <span className="plan__activity">{activity.label}</span>
                  </span>
                  {!locked && <span className="plan__arrow" aria-hidden>{'›'}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
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
    </Box>
  );
}
