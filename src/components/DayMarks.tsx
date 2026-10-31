import type { ReactNode } from 'react';
import type { Grade } from '../utils/activity';

const DAY_NAMES = ['월', '화', '수', '목', '금'];

// 글꼴마다 ○/△/✕ 글자 높이가 달라 정렬이 어긋나므로 같은 크기의 선 아이콘으로 그림
const MARK_ICONS: Record<Grade, ReactNode> = {
  success: <circle cx="10" cy="10" r="6.5" />,
  normal: <path d="M10 3.5 16.5 15.5H3.5z" />,
  fail: <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />,
};

interface Props {
  days: Grade[];
  // 앞에서부터 몇 개를 공개할지 (기본: 전부)
  revealed?: number;
}

const GRADE_LABELS: Record<Grade, string> = { success: '성공', normal: '보통', fail: '실패' };

// 5일치 성공(○)/보통(△)/실패(✕) 표시
export default function DayMarks({ days, revealed = days.length }: Props) {
  return (
    <ol className="days">
      {days.map((grade, i) => {
        const shown = i < revealed;
        return (
          <li key={i} className="days__item">
            <span className="days__name">{DAY_NAMES[i]}</span>
            <span
              className={shown ? `days__mark days__mark--${grade}` : 'days__mark'}
              aria-label={shown ? GRADE_LABELS[grade] : '진행 전'}
            >
              {shown && (
                <svg viewBox="0 0 20 20" aria-hidden>
                  {MARK_ICONS[grade]}
                </svg>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
