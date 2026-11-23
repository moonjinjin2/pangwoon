import { useEffect, useRef, useState, type CSSProperties } from 'react';
import crystalImg from '../img/gacha/crystal.png';
import crackImg from '../img/gacha/crack.png';
import burstImg from '../img/gacha/burst.png';
import { Sparkle } from './DecoFrame';
import { playCardFlip, playGachaResult, playGachaSpin } from '../utils/sfx';
import { RARITY_META, getEffectParts, rarityRank, type Item } from '../utils/gacha';

interface Props {
  items: Item[];
  // 결과에서 닫을 때 바로 사용하기로 고른 아이템을 넘김 (나머지는 보관함에 그대로)
  onDone: (used: Item[]) => void;
  // 한 번 더 (같은 횟수로 다시 뽑기). 골드가 모자라면 againLabel만 보여주고 누를 수 없음
  againLabel: string;
  canAgain: boolean;
  onAgain: (used: Item[]) => void;
}

type Phase = 'crystal' | 'crack' | 'burst' | 'reveal';

// 여러 개 결과에서 뒷면 카드가 하나씩 깔리는 간격(ms)
const CARD_GAP_MS = 70;

// 모두 열기에서 카드가 하나씩 뒤집히는 간격(ms)
const FLIP_GAP_MS = 150;

// 카드를 열 때 사방으로 튀는 별 조각 수
const SPARKS = 12;

// 카드 뒷면: 핏빛 벨벳 + 금빛 마름모 격자(CSS) 위에 금선 두 겹 테두리 · 계단식 모서리, 가운데 초승달 문장
// 등급은 뒤집기 전까지 알 수 없게 모든 카드 뒷면이 같은 모양·색
function CardBack() {
  return (
    <span className="gacha-card__back" aria-hidden>
      <svg className="card-back__frame" viewBox="0 0 80 100" preserveAspectRatio="none">
        <rect x="3" y="3" width="74" height="94" />
        <path d="M12 8H68V12H72V88H68V92H12V88H8V12H12Z" />
        <path className="card-back__soft" d="M14 11H66V14H69V86H66V89H14V86H11V14H14Z" />
        <path className="card-back__corner" d="M3 15V3H15M65 3H77V15M77 85V97H65M15 97H3V85" />
      </svg>
      <svg className="card-back__crest" viewBox="0 0 40 52">
        <g className="card-back__rays">
          <path d="M20 1V5M20 39V43M1 22H5M35 22H39M6.6 8.6l2.8 2.8M30.6 32.6l2.8 2.8M33.4 8.6l-2.8 2.8M9.4 32.6l-2.8 2.8" />
        </g>
        <circle className="card-back__ring" cx="20" cy="22" r="13" />
        <circle className="card-back__ring card-back__soft" cx="20" cy="22" r="10.5" />
        <path className="card-back__moon" d="M23.5 14a8.5 8.5 0 1 0 0 16 7 7 0 1 1 0-16z" />
        <path className="card-back__star" d="M26 17.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
        <path className="card-back__gem" d="M20 44l3.2 3.5L20 51l-3.2-3.5z" />
      </svg>
    </span>
  );
}

// 단계별로 머무는 시간(ms). SSS가 나왔을 때만 빛 폭발 단계를 거침
const PHASE_MS: Record<Exclude<Phase, 'reveal'>, number> = {
  crystal: 1100,
  crack: 1300,
  burst: 1400,
};

const PHASE_IMAGES: Record<Exclude<Phase, 'reveal'>, string> = {
  crystal: crystalImg,
  crack: crackImg,
  burst: burstImg,
};

// 뽑기 연출: 수정 등장 → 균열과 빛(가장 높은 등급 색으로 빛남) → (SSS면) 빛 폭발 → 결과
// 화면을 누르거나 Enter를 누르면 바로 결과로 넘어감
// 결과: 1개면 크게 보여주고 보관 / 바로 사용
// 여러 개면 뒷면 카드가 주르륵 깔리고, 하나씩 눌러 공개할 때마다 등급 색 이펙트가 터짐 (모두 열기도 가능)
// 다 열면 칸을 눌러 바로 사용할 것을 고름 (기본은 모두 보관)
export default function GachaScene({ items, onDone, againLabel, canAgain, onAgain }: Props) {
  const best = items.reduce((a, b) => (rarityRank(b.rarity) > rarityRank(a.rarity) ? b : a));
  const phases: Phase[] = best.rarity === 'SSS' ? ['crystal', 'crack', 'burst', 'reveal'] : ['crystal', 'crack', 'reveal'];
  const [step, setStep] = useState(0);
  const phase = phases[step];
  const revealed = phase === 'reveal';
  const single = items.length === 1;
  // 결과 칸 번호 → 바로 사용 여부
  const [useNow, setUseNow] = useState<boolean[]>(() => items.map(() => false));
  const picked = items.filter((_, i) => useNow[i]);
  const toggle = (index: number) => setUseNow((prev) => prev.map((v, i) => (i === index ? !v : v)));
  // 여러 개 결과: 카드 번호 → 공개했는지
  const [flipped, setFlipped] = useState<boolean[]>(() => items.map(() => single));
  const allFlipped = flipped.every(Boolean);
  // 뒤집을 때마다 카드 소리 (모두 열기 도중 직접 연 카드는 다시 울리지 않게 연 카드를 기억)
  const opened = useRef(new Set<number>());
  const flip = (index: number) => {
    if (opened.current.has(index)) return;
    opened.current.add(index);
    playCardFlip();
    setFlipped((prev) => prev.map((v, i) => (i === index ? true : v)));
  };
  // 모두 열기: 남은 카드를 차례로 뒤집음
  const flipTimers = useRef<number[]>([]);
  const flipAll = () => {
    let order = 0;
    flipped.forEach((done, i) => {
      if (!done) flipTimers.current.push(window.setTimeout(() => flip(i), order++ * FLIP_GAP_MS));
    });
  };
  useEffect(() => () => flipTimers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    if (phase === 'reveal') return;
    const timer = setTimeout(() => setStep((s) => s + 1), PHASE_MS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  const skip = () => {
    stopSpin.current();
    setStep(phases.length - 1);
  };

  // 연출이 시작될 때 차오르는 소리, 결과가 나오기 전에 건너뛰면 서서히 줄임
  const stopSpin = useRef<() => void>(() => {});
  useEffect(() => {
    stopSpin.current = playGachaSpin();
    return () => stopSpin.current();
  }, []);

  // 결과가 나타날 때 효과음
  // (개발 모드 StrictMode에서 효과가 두 번 돌아도 한 번만 울리게 함)
  const resultPlayed = useRef(false);
  useEffect(() => {
    if (!revealed || resultPlayed.current) return;
    resultPlayed.current = true;
    playGachaResult();
  }, [revealed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Escape') return;
      // 결과 화면의 버튼은 Enter·Space로 누를 수 있게 그대로 둠
      if (revealed && e.key !== 'Escape') return;
      e.preventDefault();
      // 상점의 Esc(닫기)까지 전달되지 않게 막음
      e.stopImmediatePropagation();
      // 결과 화면에서 Esc는 모두 보관하고 닫기
      if (revealed) onDone([]);
      else skip();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  return (
    <div
      className={`gacha-scene gacha-scene--${phase}`}
      style={{ '--glow': RARITY_META[best.rarity].color } as CSSProperties}
      onClick={revealed ? undefined : skip}
    >
      {!revealed && (
        <>
          <img key={phase} className="gacha-scene__crystal" src={PHASE_IMAGES[phase]} alt="" />
          <span className="gacha-scene__skip">화면을 누르면 건너뛰기</span>
        </>
      )}

      {revealed && (
        <>
          <div className="gacha-scene__flash" aria-hidden />
          <section className={single ? 'gacha-result' : 'gacha-result gacha-result--many'} role="dialog" aria-label="뽑기 결과">
            <div className="gacha-result__badge">
              <Sparkle className="gacha-result__sparkle" />
              <span className="gacha-result__rarity">
                {single ? best.rarity : allFlipped ? `${items.length}회 결과 · 최고 ${best.rarity}` : `${items.length}회 뽑기`}
              </span>
              <Sparkle className="gacha-result__sparkle" />
            </div>

            {single ? (
              <>
                <img className="gacha-result__art" src={best.image} alt="" />
                <h2 className="gacha-result__name">{best.name}</h2>
                <p className="gacha-result__effects">
                  {getEffectParts(items).map(({ label, value }) => (
                    <span key={label}>
                      {label} <b>+{value}</b>
                    </span>
                  ))}
                </p>
              </>
            ) : (
              <>
                <p className="gacha-result__hint">
                  {allFlipped ? '바로 사용할 아이템을 눌러 고르세요 · 나머지는 보관함으로' : '카드를 눌러 하나씩 열어보세요'}
                </p>
                <ul className="gacha-result__grid">
                  {items.map((item, i) => (
                    <li key={i} style={{ '--delay': `${i * CARD_GAP_MS}ms` } as CSSProperties}>
                      <button
                        type="button"
                        // 뒤집기 전에는 딸깍 대신 카드 소리만 나게 함
                        data-sfx={flipped[i] ? undefined : 'none'}
                        className={`gacha-card gacha-card--${item.rarity}${flipped[i] ? ' gacha-card--open' : ''}${useNow[i] ? ' gacha-card--on' : ''}`}
                        style={{ '--rarity': RARITY_META[item.rarity].color } as CSSProperties}
                        aria-label={flipped[i] ? `${item.name}${useNow[i] ? ' (바로 사용)' : ''}` : `${i + 1}번 카드 열기`}
                        aria-pressed={flipped[i] ? useNow[i] : undefined}
                        // 뒤집기 전에는 공개, 다 연 뒤에는 바로 사용 고르기
                        onClick={() => (!flipped[i] ? flip(i) : allFlipped && toggle(i))}
                      >
                        <span className="gacha-card__inner">
                          <CardBack />
                          <span className="gacha-card__front">
                            <img src={item.image} alt="" />
                            <span className="gacha-card__name">{item.name}</span>
                            {useNow[i] && <span className="gacha-card__mark">사용</span>}
                          </span>
                        </span>
                        {/* 공개하는 순간의 이펙트: 섬광 + 퍼지는 고리 + 사방으로 튀는 별 조각 (열 때 붙어서 한 번 재생) */}
                        {flipped[i] && (
                          <span className="gacha-card__burst" aria-hidden>
                            {Array.from({ length: SPARKS }, (_, k) => (
                              <i key={k} style={{ '--angle': `${(360 / SPARKS) * k + 15}deg` } as CSSProperties} />
                            ))}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                {picked.length > 0 && (
                  <p className="gacha-result__effects gacha-result__effects--small">
                    {getEffectParts(picked).map(({ label, value }) => (
                      <span key={label}>
                        {label} <b>+{value}</b>
                      </span>
                    ))}
                  </p>
                )}
              </>
            )}

            {allFlipped ? (
              <div className="gacha-result__actions">
                <button type="button" className="gacha-result__btn" onClick={() => onAgain(picked)} disabled={!canAgain}>
                  한 번 더
                  <small className="gacha-result__btn-sub">{againLabel}</small>
                </button>
                <button type="button" className="gacha-result__btn" onClick={() => onDone([])} autoFocus>
                  {single ? '보관' : '모두 보관'}
                </button>
                <button
                  type="button"
                  className="gacha-result__btn gacha-result__btn--primary"
                  onClick={() => onDone(single ? items : picked.length > 0 ? picked : items)}
                >
                  {single ? '바로 사용' : picked.length > 0 ? `선택 사용 (${picked.length})` : '모두 사용'}
                </button>
              </div>
            ) : (
              <div className="gacha-result__actions gacha-result__actions--open">
                <button type="button" className="gacha-result__btn gacha-result__btn--primary" onClick={flipAll} autoFocus>
                  모두 열기
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
