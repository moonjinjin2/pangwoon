import { useEffect, useState } from 'react';
import { PLAYER_NAME } from '../utils/episode';
import { formatFullDate } from '../utils/gameDate';
import { usePlayOnce } from '../utils/sfx';
import type { EndingKind } from './StatsBox';

interface Props {
  // health: 건강 악화(체력 0), exposed: 정체 발각(에피소드 위험도 100)
  kind: EndingKind;
  gameDate: string;
  onRestart: () => void;
}

const ENDINGS: Record<EndingKind, { title: string; story: (name: string) => string[] }> = {
  health: {
    title: '건강 악화',
    story: (name) => ['몸을 돌보지 않고 버텨온 나날들.', '바닥난 체력은 결국 한계를 넘었고,', `${name}은(는) 병상에서 다시 일어나지 못했다...`],
  },
  exposed: {
    title: '정체 발각',
    story: (name) => ['끝까지 숨겨왔던 비밀.', '드러난 송곳니와 붉게 빛나는 눈동자 앞에서,', `${name}의 평범한 대학 생활은 그날로 끝이 났다...`],
  },
};

// 연출 단계: 붉게 번쩍 → 심전도가 멈춤 → 화면이 어두워지며 엔딩 문구 → 처음으로 버튼
const PHASE_TIMES = [1600, 3000, 4600];

// 체력이 0이 되거나 정체가 들키면 보는 배드 엔딩 (게임 끝)
export default function BadEnding({ kind, gameDate, onRestart }: Props) {
  const [phase, setPhase] = useState(0);
  const done = phase >= 3;
  const { title, story } = ENDINGS[kind];

  // 숨이 죽어가는 소리
  usePlayOnce('dead');

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
          {story(PLAYER_NAME).map((line, i) => (
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
