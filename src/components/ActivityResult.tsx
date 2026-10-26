import DayMarks from './DayMarks';
import ResultDialog from './ResultDialog';
import { ACTIVITIES, getWeekResult, type Activity, type Grade } from '../utils/activity';

interface Props {
  activity: Activity;
  days: Grade[];
  onConfirm: () => void;
}

// 주차 활동이 끝난 뒤 메인 화면 위에 띄우는 결과창
export default function ActivityResult({ activity, days, onConfirm }: Props) {
  const info = ACTIVITIES[activity];
  const count = (grade: Grade) => days.filter((d) => d === grade).length;

  return (
    <ResultDialog
      title={
        <>
          {info.label} 완료!
          <span className="result__count">
            ○{count('success')} △{count('normal')} ✕{count('fail')}
          </span>
        </>
      }
      changes={getWeekResult(activity, days)}
      onConfirm={onConfirm}
    >
      <DayMarks days={days} />
    </ResultDialog>
  );
}
