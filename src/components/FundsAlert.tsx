import { useEffect } from 'react';
import Box from './Box';
import { ACTIVITIES, type Activity } from '../utils/activity';

interface Props {
  activity: Activity;
  cost: number;
  coins: number;
  onClose: () => void;
}

// 이번 주 활동 비용이 모자랄 때 진행하기를 누르면 띄우는 알림
export default function FundsAlert({ activity, cost, coins, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const { icon, label } = ACTIVITIES[activity];

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog funds" role="alertdialog" aria-modal aria-label="자금 부족" onClick={(e) => e.stopPropagation()}>
        <Box title="Warning" color="var(--hud-red)" onClose={onClose}>
          <div className="result">
            <h3 className="result__title">💸 자금이 부족해요!</h3>
            <ul className="result__list">
              <li className="result__item">
                <span>
                  {icon} {label} 1주 비용
                </span>
                <span className="result__value result__value--bad">{cost.toLocaleString()}원</span>
              </li>
              <li className="result__item">
                <span>내 자금</span>
                <span>{coins.toLocaleString()}원</span>
              </li>
            </ul>
            <p className="funds__hint">알바로 돈을 모으거나 이번 주 계획을 바꿔주세요.</p>
            <button className="result__confirm" onClick={onClose} autoFocus>
              확인
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}
