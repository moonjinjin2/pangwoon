import { useEffect, useState, type CSSProperties } from 'react';
import Box from './Box';
import ResultDialog from './ResultDialog';
import type { Stats } from './StatsBox';
import type { Effect } from '../utils/activity';
import { CONTESTS, PRIZES, canEnter, getContestResult, meetsRequirement, rollRank, type ContestType } from '../utils/contest';

interface Props {
  type: ContestType;
  month: number;
  stats: Stats;
  // 참가했으면 결과 변화량, 불참·참가 불가면 빈 객체
  onDone: (effect: Effect) => void;
}

// 순위 발표 전 두구두구 시간
const ROLL_MS = 1800;
const ROLL_TICK_MS = 120;
const ROLL_LABELS = ['1등', '2등', '3등', '탈락'];

function rankLabel(rank: number | null) {
  return rank ? `${rank}등` : '탈락';
}

// 매달 15일 대회: 참가 조건 확인 → 순위 추첨 연출 → 결과
export default function ContestScene({ type, month, stats, onDone }: Props) {
  const info = CONTESTS[type];
  const eligible = canEnter(type, stats);
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'result'>('intro');
  const [rank, setRank] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (phase !== 'rolling') return;
    const spin = window.setInterval(() => setTick((t) => t + 1), ROLL_TICK_MS);
    const end = window.setTimeout(() => setPhase('result'), ROLL_MS);
    return () => {
      window.clearInterval(spin);
      window.clearTimeout(end);
    };
  }, [phase]);

  const enter = () => {
    setRank(rollRank(type, stats));
    setPhase('rolling');
  };

  if (phase === 'result') {
    return (
      <ResultDialog
        title={
          <>
            {info.label} {rank ? `${rank}등 입상!` : '탈락...'}
            {rank && <span className="result__count">상금 {PRIZES[rank - 1].toLocaleString()}원</span>}
          </>
        }
        changes={getContestResult(type, rank)}
        onConfirm={() => onDone(getContestResult(type, rank))}
      >
        <p className={rank ? 'contest__rank contest__rank--win' : 'contest__rank'}>{rankLabel(rank)}</p>
      </ResultDialog>
    );
  }

  return (
    <div className="modal">
      <div className="modal__dialog contest" style={{ '--contest-color': info.color } as CSSProperties}>
        <Box title={`${month}월 ${info.label}`} color={info.color}>
          <div className="result">
            <h3 className="result__title">
              {info.icon} {info.label} 개최!
            </h3>
            {phase === 'rolling' ? (
              <div className="contest__rolling" aria-live="polite">
                <span className="contest__drum">두구두구...</span>
                <span className="contest__rank contest__rank--spin">{ROLL_LABELS[tick % ROLL_LABELS.length]}</span>
              </div>
            ) : (
              <>
                <ul className="result__list">
                  {info.requirements.map((r) => {
                    const ok = meetsRequirement(r, stats);
                    return (
                      <li key={r.stat} className="result__item">
                        <span>
                          {r.label} {r.value} {r.kind === 'min' ? '이상' : '이하'}
                        </span>
                        <span className={ok ? 'result__value result__value--good' : 'result__value result__value--bad'}>
                          {stats[r.stat]} {ok ? '✔' : '✘'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="contest__hint">
                  {eligible
                    ? `상금 1등 ${(PRIZES[0] / 10000).toLocaleString()}만 · 2등 ${(PRIZES[1] / 10000).toLocaleString()}만 · 3등 ${(PRIZES[2] / 10000).toLocaleString()}만원`
                    : '참가 조건을 채우지 못해 이번 대회는 구경만 했다...'}
                </p>
                <div className="contest__actions">
                  {eligible && (
                    <button className="result__confirm" onClick={enter} autoFocus>
                      참가하기
                    </button>
                  )}
                  <button className="result__confirm contest__skip" onClick={() => onDone({})} autoFocus={!eligible}>
                    {eligible ? '불참' : '확인'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
