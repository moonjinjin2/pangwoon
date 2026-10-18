import Box from './Box';
import DayMarks from './DayMarks';
import { STAT_LABELS } from './StatsBox';
import { ACTIVITIES, getWeekResult, isGoodChange, type Activity, type Effect } from '../utils/activity';

interface Props {
  activity: Activity;
  days: boolean[];
  onConfirm: () => void;
}

function effectLabel(key: keyof Effect) {
  return key === 'coins' ? '골드' : STAT_LABELS[key];
}

// 주차 활동이 끝난 뒤 메인 화면 위에 띄우는 결과창
export default function ActivityResult({ activity, days, onConfirm }: Props) {
  const info = ACTIVITIES[activity];
  const successes = days.filter(Boolean).length;
  const changes = Object.entries(getWeekResult(activity, days)) as [keyof Effect, number][];

  return (
    <div className="modal">
      <div className="modal__dialog">
        <Box title="Result" onClose={onConfirm}>
          <div className="result">
            <h3 className="result__title">
              {info.label} 완료!
              {days.length > 0 && (
                <span className="result__count">
                  성공 {successes}/{days.length}
                </span>
              )}
            </h3>
            {days.length > 0 && <DayMarks days={days} />}
            <ul className="result__list">
              {changes.map(([key, value]) => {
                const good = isGoodChange(key, value);
                return (
                  <li key={key} className="result__item">
                    <span>{effectLabel(key)}</span>
                    <span className={good ? 'result__value result__value--good' : 'result__value result__value--bad'}>
                      {value >= 0 ? '+' : ''}
                      {value.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button className="result__confirm" onClick={onConfirm} autoFocus>
              확인
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}
