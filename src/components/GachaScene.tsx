import { useEffect, useState, type CSSProperties } from 'react';
import crystalImg from '../img/gacha/crystal.png';
import crackImg from '../img/gacha/crack.png';
import burstImg from '../img/gacha/burst.png';
import Sparkle from './Sparkle';
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
// 결과: 1개면 크게 보여주고 보관 / 바로 사용, 여러 개면 칸을 눌러 바로 사용할 것을 고름 (기본은 모두 보관)
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

  useEffect(() => {
    if (phase === 'reveal') return;
    const timer = setTimeout(() => setStep((s) => s + 1), PHASE_MS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  const skip = () => setStep(phases.length - 1);

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
              <span className="gacha-result__rarity">{single ? best.rarity : `${items.length}회 결과 · 최고 ${best.rarity}`}</span>
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
                <p className="gacha-result__hint">바로 사용할 아이템을 눌러 고르세요 · 나머지는 보관함으로</p>
                <ul className="gacha-result__grid">
                  {items.map((item, i) => (
                    <li key={i} style={{ animationDelay: `${i * 70}ms` }}>
                      <button
                        type="button"
                        className={useNow[i] ? 'gacha-tile gacha-tile--on' : 'gacha-tile'}
                        style={{ '--rarity': RARITY_META[item.rarity].color } as CSSProperties}
                        aria-pressed={useNow[i]}
                        onClick={() => toggle(i)}
                      >
                        <img src={item.image} alt="" />
                        <span className="gacha-tile__name">{item.name}</span>
                        {useNow[i] && <span className="gacha-tile__mark">사용</span>}
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
          </section>
        </>
      )}
    </div>
  );
}
