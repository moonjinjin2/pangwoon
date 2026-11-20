import moonImg from '../img/background/red_moon.jpg';
import Ribbon from './ui/Ribbon';
import { getWeekIndex } from '../utils/gameDate';

interface Props {
  gameDate: string;
}

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// 이번 달과 지금이 몇 주차인지 크게 보여주는 진홍 띠
export default function WeekCard({ gameDate }: Props) {
  const month = Number(gameDate.split('-')[1]);
  const week = getWeekIndex(gameDate);

  return (
    <Ribbon variant="tag" className="g-date">
      {/* 숫자 뒤에 은은하게 비치는 붉은 달 */}
      <span className="g-date__moon" style={{ backgroundImage: `url(${moonImg})` }} aria-hidden />
      <span className="g-date__day">
        <span className="g-date__month">{month}</span>
        <span className="g-date__name">/{MONTH_NAMES[month - 1]}</span>
      </span>
      <span className="g-date__divider" aria-hidden />
      <strong className="g-date__week">{week + 1}주차</strong>
    </Ribbon>
  );
}
