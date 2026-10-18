import type { ReactNode } from 'react';
import Box from './Box';
import { STAT_LABELS } from './StatsBox';
import { isGoodChange, type Effect } from '../utils/activity';

interface Props {
  title: ReactNode;
  // 제목 아래 추가로 보여줄 내용 (예: 성공/실패 표시)
  children?: ReactNode;
  changes: Effect;
  onConfirm: () => void;
}

function effectLabel(key: keyof Effect) {
  return key === 'coins' ? '골드' : STAT_LABELS[key];
}

// 스탯·골드 변화량을 보여주는 결과창 (활동 결과, 게임 결과에서 같이 씀)
export default function ResultDialog({ title, children, changes, onConfirm }: Props) {
  const items = Object.entries(changes) as [keyof Effect, number][];

  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal__dialog">
        <Box title="Result" onClose={onConfirm}>
          <div className="result">
            <h3 className="result__title">{title}</h3>
            {children}
            <ul className="result__list">
              {items.map(([key, value]) => {
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
