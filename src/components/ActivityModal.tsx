import { useEffect, type CSSProperties } from 'react';
import Box from './Box';
import { ACTIVITIES, ACTIVITY_ORDER, type Activity } from '../utils/activity';

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

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" role="dialog" aria-modal aria-label={title} onClick={(e) => e.stopPropagation()}>
        <Box title={title} onClose={onClose}>
          <div className="activity-grid">
            {ACTIVITY_ORDER.map((key) => {
              const activity = ACTIVITIES[key];
              return (
                <button
                  key={key}
                  className={key === current ? 'activity-card activity-card--current' : 'activity-card'}
                  style={{ '--activity-color': activity.color } as CSSProperties}
                  onClick={() => onSelect(key)}
                >
                  <span className="activity-card__icon" aria-hidden>{activity.icon}</span>
                  <span className="activity-card__label">{activity.label}</span>
                </button>
              );
            })}
          </div>
        </Box>
      </div>
    </div>
  );
}
