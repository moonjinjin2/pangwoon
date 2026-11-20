import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon, { ACTIVITY_ICONS } from './Icon';
import Dialog from './ui/Dialog';
import { ACTIVITIES, ACTIVITY_ORDER, getWeekCost, type Activity } from '../utils/activity';

interface Props {
  title: string;
  current: Activity;
  onSelect: (activity: Activity) => void;
  onClose: () => void;
}

// 피 뽑기는 위험한 활동이라 2x2 칸 밑에 경고와 함께 따로 둠
const GRID_ACTIVITIES = ACTIVITY_ORDER.filter((key) => key !== 'blood');

export default function ActivityModal({ title, current, onSelect, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // 스케줄 카드(backdrop-filter)가 fixed 기준이 되지 않도록 body에 띄워 화면 가운데에 둠
  return createPortal(
    <Dialog title={title} icon="calendar" onClose={onClose} closeOnBackdrop className="g-activity-dialog">
      <div className="g-activities">
        {GRID_ACTIVITIES.map((key) => {
          const cost = getWeekCost(key);
          return (
            <button
              key={key}
              type="button"
              className={key === current ? 'g-activity g-activity--current' : 'g-activity'}
              onClick={() => onSelect(key)}
            >
              <span className="g-activity__icon">
                <Icon name={ACTIVITY_ICONS[key]} />
              </span>
              <span className="g-activity__label">{ACTIVITIES[key].label}</span>
              {cost > 0 && <span className="g-activity__cost">-{cost.toLocaleString()}원</span>}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={['g-activity g-activity--blood', current === 'blood' && 'g-activity--current'].filter(Boolean).join(' ')}
        onClick={() => onSelect('blood')}
      >
        <span className="g-activity__icon">
          <Icon name={ACTIVITY_ICONS.blood} />
        </span>
        <span className="g-activity__info">
          <span className="g-activity__label">{ACTIVITIES.blood.label}</span>
          <span className="g-activity__warning">돈을 많이 벌 수 있지만 체력이 크게 깎여요. 몸 상태를 꼭 확인하세요.</span>
        </span>
      </button>
    </Dialog>,
    document.body,
  );
}
