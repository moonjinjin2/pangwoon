const DAY_NAMES = ['월', '화', '수', '목', '금'];

// 글꼴마다 ○/✕ 글자 높이가 달라 정렬이 어긋나므로 같은 10x10 격자의 픽셀 아이콘으로 그림
const MARK_ICONS = {
  success: <path d="M3 0h4v1h2v2h1v4H9v2H7v1H3V9H1V7H0V3h1V1h2zM3 2v1H2v4h1v1h4V7h1V3H7V2z" fillRule="evenodd" />,
  fail: <path d="M0 0h2v1h1v1h1v1h2V2h1V1h1V0h2v2H9v1H8v1H7v2h1v1h1v1h1v2H8V9H7V8H6V7H4v1H3v1H2v1H0V8h1V7h1V6h1V4H2V3H1V2H0z" />,
};

interface Props {
  days: boolean[];
  // 앞에서부터 몇 개를 공개할지 (기본: 전부)
  revealed?: number;
}

// 5일치 성공(○)/실패(✕) 표시
export default function DayMarks({ days, revealed = days.length }: Props) {
  return (
    <ol className="days">
      {days.map((success, i) => {
        const shown = i < revealed;
        return (
          <li key={i} className="days__item">
            <span className="days__name">{DAY_NAMES[i]}</span>
            <span
              className={shown ? (success ? 'days__mark days__mark--success' : 'days__mark days__mark--fail') : 'days__mark'}
              aria-label={shown ? (success ? '성공' : '실패') : '진행 전'}
            >
              {shown && (
                <svg viewBox="0 0 10 10" aria-hidden>
                  {MARK_ICONS[success ? 'success' : 'fail']}
                </svg>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
