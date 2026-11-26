import { useEffect } from 'react';
import Box from './Box';
import { loopSound, usePlayOnce } from '../utils/sfx';
import { getStatMax, type DangerKind, type Stats } from './StatsBox';

// 체력이 경고 수치에 닿아 있는 동안(에피소드에서는 위험도가 높은 동안) 화면 가장자리가 심장 박동처럼 붉게 일렁이고 빠른 심장 소리가 반복됨
// sound가 false면 붉은 테두리만 보이고 심장 소리는 멈춤
export default function DangerWarning({ sound = true }: { sound?: boolean }) {
  useEffect(() => {
    if (sound) return loopSound('fastHeartbeat');
  }, [sound]);
  return <div className="danger-vignette" aria-hidden />;
}

const ALERTS: Record<DangerKind, { title: string; label: string; value: (stats: Stats) => string; ending: string; hint: string }> = {
  health: {
    title: '⚠️ 건강이 위험해요!',
    label: '체력',
    value: (stats) => `${stats.health} / ${getStatMax('health')}`,
    ending: '체력이 0이 되면',
    hint: '침대에서 뒹굴거리며 체력을 회복해주세요.',
  },
};

const ENDING_NAMES: Record<DangerKind, string> = {
  health: '건강 악화',
};

interface AlertProps {
  kind: DangerKind;
  stats: Stats;
  onClose: () => void;
}

// 체력이 경고 수치에 처음 닿았을 때 띄우는 경고
export function DangerAlert({ kind, stats, onClose }: AlertProps) {
  usePlayOnce('warning');
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
              {ending} <strong>{ENDING_NAMES[kind]}</strong>로 쓰러집니다.
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
