import type { ReactNode } from 'react';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import { STAT_LABELS } from './StatsBox';
import { isGoodChange, type Effect } from '../utils/activity';

interface Props {
  title: ReactNode;
  // 제목 아래 추가로 보여줄 내용 (예: 성공/실패 표시)
  children?: ReactNode;
  changes: Effect;
  onConfirm: () => void;
}

export function effectLabel(key: keyof Effect) {
  return key === 'coins' ? '자금' : STAT_LABELS[key];
}

// 스탯·자금 변화량을 보여주는 결과창 (활동 결과, 게임 결과에서 같이 씀)
export default function ResultDialog({ title, children, changes, onConfirm }: Props) {
  const items = Object.entries(changes) as [keyof Effect, number][];

  return (
    <Dialog title="결과" icon="sparkle" onClose={onConfirm} className="g-result-dialog">
      <div className="g-result">
        <h3 className="g-result__title">{title}</h3>
        {children}
        <ul className="g-result__list">
          {items.map(([key, value]) => {
            const good = isGoodChange(key, value);
            return (
              <li key={key} className="g-result__item">
                <span>{effectLabel(key)}</span>
                <span className={good ? 'g-result__value g-result__value--good' : 'g-result__value g-result__value--bad'}>
                  {value >= 0 ? '+' : ''}
                  {value.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
        <Button className="g-result__confirm" onClick={onConfirm} autoFocus>
          확인
        </Button>
      </div>
    </Dialog>
  );
}
