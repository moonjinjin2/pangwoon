import { useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Box from './Box';
import Icon, { ACTIVITY_ICONS } from './Icon';
import { ACTIVITIES, ACTIVITY_ORDER, getWeekCost, type Activity } from '../utils/activity';

interface Props {
  title: string;
  current: Activity;
  onSelect: (activity: Activity) => void;
  onClose: () => void;
}

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
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" role="dialog" aria-modal aria-label={title} onClick={(e) => e.stopPropagation()}>
        <Box title={title} onClose={onClose}>
          <div className="activity-grid">
            {ACTIVITY_ORDER.map((key) => {
              const activity = ACTIVITIES[key];
              const cost = getWeekCost(key);
              return (
                <button
                  key={key}
                  className={key === current ? 'activity-card activity-card--current' : 'activity-card'}
                  style={{ '--activity-color': activity.color } as CSSProperties}
                  onClick={() => onSelect(key)}
                >
                  <span className="activity-card__icon">
                    <Icon name={ACTIVITY_ICONS[key]} />
                  </span>
                  <span className="activity-card__label">{activity.label}</span>
                  {cost > 0 && <span className="activity-card__effect">-{cost.toLocaleString()}원</span>}
                </button>
              );
            })}
          </div>
        </Box>
      </div>
    </div>,
    document.body,
  );
}
