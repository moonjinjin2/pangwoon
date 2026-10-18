import DayMarks from './DayMarks';
import ResultDialog from './ResultDialog';
import { ACTIVITIES, getWeekResult, type Activity } from '../utils/activity';

interface Props {
  activity: Activity;
  days: boolean[];
  onConfirm: () => void;
}

// 주차 활동이 끝난 뒤 메인 화면 위에 띄우는 결과창
export default function ActivityResult({ activity, days, onConfirm }: Props) {
  const info = ACTIVITIES[activity];
  const successes = days.filter(Boolean).length;

  return (
    <ResultDialog
      title={
        <>
          {info.label} 완료!
          {days.length > 0 && (
            <span className="result__count">
              성공 {successes}/{days.length}
            </span>
          )}
        </>
      }
      changes={getWeekResult(activity, days)}
      onConfirm={onConfirm}
    >
      {days.length > 0 && <DayMarks days={days} />}
    </ResultDialog>
  );
}
