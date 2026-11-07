import { useEffect, useState } from 'react';
import { formatFullDate } from '../utils/gameDate';
import type { DangerKind } from './StatsBox';

interface Props {
  // stress: 과로사, health: 건강 악화
  kind: DangerKind;
  name: string;
  gameDate: string;
  onRestart: () => void;
}

const ENDINGS: Record<DangerKind, { title: string; story: (name: string) => string[] }> = {
  stress: {
    title: '과로사',
    story: (name) => ['쉬지 않고 달려온 나날들.', '쌓이고 쌓인 피로를 끝내 이기지 못하고,', `${name}은(는) 그대로 쓰러져 다시 일어나지 못했다...`],
  },
  health: {
    title: '건강 악화',
    story: (name) => ['몸을 돌보지 않고 버텨온 나날들.', '바닥난 체력은 결국 한계를 넘었고,', `${name}은(는) 병상에서 다시 일어나지 못했다...`],
  },
};

// 연출 단계: 붉게 번쩍 → 심전도가 멈춤 → 화면이 어두워지며 엔딩 문구 → 처음으로 버튼
const PHASE_TIMES = [1600, 3000, 4600];

// 스트레스 최대치·체력 0이면 보는 배드 엔딩 (게임 끝)
export default function BadEnding({ kind, name, gameDate, onRestart }: Props) {
  const [phase, setPhase] = useState(0);
  const done = phase >= 3;
  const { title, story } = ENDINGS[kind];

  useEffect(() => {
    const timers = PHASE_TIMES.map((ms, i) => window.setTimeout(() => setPhase((p) => Math.max(p, i + 1)), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (done && !e.repeat) onRestart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [done, onRestart]);

  return (
    <div className={`bad-ending bad-ending--${phase}`} role="dialog" aria-modal aria-label={`${title} 엔딩`}>
      <div className="bad-ending__flash" aria-hidden />
      {/* 뛰던 심전도가 일직선으로 */}
      <svg className="bad-ending__ecg" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden>
        <path className="bad-ending__beat" d="M0 50h120l15-30 20 70 20-80 15 40h110l15-30 20 70 20-80 15 40h230" />
        <path className="bad-ending__flat" d="M0 50h600" />
      </svg>
      <div className="bad-ending__text">
        <p className="bad-ending__tag">BAD ENDING</p>
        <h2 className="bad-ending__title">{title}</h2>
        <p className="bad-ending__date">{formatFullDate(gameDate)}</p>
        <p className="bad-ending__story">
          {story(name).map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <button className="result__confirm bad-ending__restart" onClick={onRestart} tabIndex={done ? 0 : -1}>
          처음으로
        </button>
      </div>
    </div>
  );
}
