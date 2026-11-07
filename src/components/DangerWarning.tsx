import { useEffect } from 'react';
import Box from './Box';
import { MAX_STRESS, getMaxHealth, type DangerKind, type Stats } from './StatsBox';

// 스트레스·체력이 경고 수치에 닿아 있는 동안 화면 가장자리가 심장 박동처럼 붉게 일렁임
export default function DangerWarning() {
  return <div className="danger-vignette" aria-hidden />;
}

const ALERTS: Record<DangerKind, { title: string; label: string; value: (stats: Stats) => string; ending: string; hint: string }> = {
  stress: {
    title: '⚠️ 몸이 한계에 가까워요!',
    label: '스트레스',
    value: (stats) => `${stats.stress} / ${MAX_STRESS}`,
    ending: `스트레스가 ${MAX_STRESS}이 되면`,
    hint: '휴식으로 스트레스를 낮춰주세요.',
  },
  health: {
    title: '⚠️ 건강이 위험해요!',
    label: '체력',
    value: (stats) => `${stats.health} / ${getMaxHealth(stats)}`,
    ending: '체력이 0이 되면',
    hint: '휴식으로 체력을 회복해주세요.',
  },
};

const ENDING_NAMES: Record<DangerKind, string> = {
  stress: '과로사',
  health: '건강 악화',
};

interface AlertProps {
  kind: DangerKind;
  stats: Stats;
  onClose: () => void;
}

// 스트레스·체력이 경고 수치에 처음 닿았을 때 띄우는 경고
export function DangerAlert({ kind, stats, onClose }: AlertProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const { title, label, value, ending, hint } = ALERTS[kind];

  return (
    <div className="modal danger-alert" onClick={onClose}>
      <div className="danger-alert__flash" aria-hidden />
      <div className="modal__dialog" role="alertdialog" aria-modal aria-label={`${label} 경고`} onClick={(e) => e.stopPropagation()}>
        <Box title="Warning" color="var(--hud-red)" onClose={onClose}>
          <div className="result">
            <h3 className="result__title">{title}</h3>
            <div className="danger-alert__meter">
              <span>{label}</span>
              <span className="result__value result__value--bad">{value(stats)}</span>
            </div>
            <p className="danger-alert__msg">
              {ending} <strong>{ENDING_NAMES[kind]}</strong>(으)로 쓰러집니다.
              <br />
              {hint}
            </p>
            <button className="result__confirm" onClick={onClose} autoFocus>
              확인
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}
