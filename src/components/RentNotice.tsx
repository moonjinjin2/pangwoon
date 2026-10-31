import { useEffect, useState, type CSSProperties } from 'react';
import Box from './Box';
import { START_GAME_DATE } from '../utils/gameDate';
import { HOMELESS_MONTHS, RENT, UNPAID_STRESS } from '../utils/rent';

interface Props {
  // 'YYYY-MM-DD' (몇 월 고지서인지 표시)
  gameDate: string;
  paid: boolean;
  // 납부 전 자금
  before: number;
  // 연속 미납 횟수 (미납일 때)
  streak: number;
  onConfirm: () => void;
}

// 연출 단계: 고지서가 떨어짐 → 잔액이 빠져나감 → 도장 쾅 → 확인 버튼
const PHASE_TIMES = [600, 1700, 2200];
const COUNT_MS = 900;
const COIN_COUNT = 8;

// 매달 1일 월세·생활비 고지서 (납부: 동전이 빠져나가고 '납부 완료' 도장 / 미납: 붉게 흔들리며 '미납' 도장)
export default function RentNotice({ gameDate, paid, before, streak, onConfirm }: Props) {
  const [phase, setPhase] = useState(0);
  const [shown, setShown] = useState(before);
  const after = paid ? before - RENT : before;
  const month = Number(gameDate.split('-')[1]);
  const done = phase >= 3;
  // 게임 시작 달에 내는 첫 월세
  const first = gameDate.slice(0, 7) === START_GAME_DATE.slice(0, 7);

  useEffect(() => {
    const timers = PHASE_TIMES.map((ms, i) => window.setTimeout(() => setPhase((p) => Math.max(p, i + 1)), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // 잔액이 줄어드는 카운트
  useEffect(() => {
    if (!paid || phase < 1) return;
    if (phase >= 2) {
      setShown(after);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setShown(Math.round(before - (before - after) * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paid, phase, before, after]);

  // 연출 중 Enter / Space / 클릭으로 스킵
  useEffect(() => {
    if (done) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        setPhase(3);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [done]);

  const className = ['modal', 'rent', paid ? 'rent--paid' : 'rent--unpaid', phase >= 2 && 'rent--stamped'].filter(Boolean).join(' ');

  return (
    <div className={className} onClick={() => !done && setPhase(3)}>
      {!paid && phase >= 2 && <div className="rent__flash" aria-hidden />}
      <div className="modal__dialog rent__dialog" role="dialog" aria-modal aria-label={`${month}월 월세 고지서`}>
        <Box title="Bill" color={paid ? undefined : "var(--hud-red)"}>
          <div className="rent__bill">
            <p className="rent__label">{month}월 월세</p>
            <p className="rent__amount">{RENT.toLocaleString()}원</p>
            <div className="rent__balance">
              <span>내 자금</span>
              <span className={paid ? 'rent__coins' : 'rent__coins rent__coins--short'}>{shown.toLocaleString()}원</span>
              {paid && phase === 1 && (
                <span className="rent__coin-burst" aria-hidden>
                  {Array.from({ length: COIN_COUNT }, (_, i) => (
                    <span
                      key={i}
                      className="rent__coin"
                      style={{ '--dx': `${(i - (COIN_COUNT - 1) / 2) * 14}px`, '--delay': `${i * 70}ms` } as CSSProperties}
                    />
                  ))}
                </span>
              )}
            </div>
            {!paid && phase >= 1 && <p className="rent__short">잔액 부족! {(RENT - before).toLocaleString()}원이 모자라요</p>}
            {phase >= 2 && <span className="rent__stamp">{paid ? '납부 완료' : '미 납'}</span>}
            {done && (
              <>
                {paid ? (
                  <p className="rent__msg">{first ? '자취 생활의 첫 월세...\n통장이 순식간에 가벼워졌다.' : '이번 달도 무사히 넘겼다...!'}</p>
                ) : (
                  <>
                    <p className="rent__msg rent__msg--bad">스트레스 +{UNPAID_STRESS}</p>
                    <div className="rent__streak">
                      <span>연속 미납</span>
                      <span className="rent__streak-cells">
                        {Array.from({ length: HOMELESS_MONTHS }, (_, i) => (
                          <span key={i} className={i < streak ? 'rent__cell rent__cell--on' : 'rent__cell'} />
                        ))}
                      </span>
                    </div>
                    <p className="rent__warn">
                      {streak >= HOMELESS_MONTHS ? '더 이상 버틸 수 없다...' : `${HOMELESS_MONTHS - streak}번 더 밀리면 쫓겨난다...`}
                    </p>
                  </>
                )}
                <button className="result__confirm" onClick={onConfirm} autoFocus>
                  확인
                </button>
              </>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
