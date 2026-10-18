import { useEffect, useState } from 'react';
import Box from './Box';
import { STAT_LABELS } from './StatsBox';
import { ACTIVITIES, type Activity, type Effect } from '../utils/activity';

const FRAME_MS = 400;
const PLAY_MS = 3200;

interface Props {
  // 예: '4월 1주'
  weekLabel: string;
  activity: Activity;
  onDone: () => void;
}

function effectLabel(key: keyof Effect) {
  return key === 'coins' ? '골드' : STAT_LABELS[key];
}

export default function ActivityScene({ weekLabel, activity, onDone }: Props) {
  const info = ACTIVITIES[activity];
  const [frame, setFrame] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => setFrame((f) => (f + 1) % info.frames.length), FRAME_MS);
    const end = setTimeout(() => setFinished(true), PLAY_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(end);
    };
  }, [info.frames.length]);

  // Enter / Space로 스킵 (꾹 누르고 있을 때 결과창까지 넘어가지 않도록 반복 입력은 무시)
  useEffect(() => {
    if (finished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        setFinished(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finished]);

  const changes = Object.entries(info.result) as [keyof Effect, number][];

  return (
    <div className="scene">
      <header className="scene__header">
        <span className="scene__week">{weekLabel}</span>
        <h2 className="scene__message">{info.message}</h2>
      </header>
      <div className="scene__stage" style={{ background: info.color }}>
        <span className="scene__frame" aria-hidden>{info.frames[frame]}</span>
      </div>
      {!finished && (
        <button className="scene__skip" onClick={() => setFinished(true)}>
          <span>SKIP ▶▶</span>
          <span className="scene__skip-hint">Space / Enter</span>
        </button>
      )}
      {finished && (
        <div className="modal">
          <div className="modal__dialog">
            <Box title="Result" onClose={onDone}>
              <div className="result">
                <h3 className="result__title">
                  {info.label} 완료!
                </h3>
                <ul className="result__list">
                  {changes.map(([key, value]) => {
                    // 스트레스는 줄어드는 쪽이 좋은 변화
                    const good = key === 'stress' ? value < 0 : value > 0;
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
                <button className="result__confirm" onClick={onDone} autoFocus>
                  확인
                </button>
              </div>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}
