import { useEffect, useState } from 'react';
import backgroundImg from '../img/background/main_background.jpg';
import Backdrop from '../components/Backdrop';
import Icon, { HeartMark } from '../components/Icon';
import { FACES } from './DatePage';
import { Glyph, glyphs } from './WardrobePage';
import { SPEAKERS, type Heroine } from '../utils/episode';
import { GIFTS, type Gift, type GiftInventory } from '../utils/gift';
import { PROGRESS_KEYS, useStoredState } from '../utils/storage';

interface Props {
  coins: number;
  onSpend: (amount: number) => void;
  onClose: () => void;
}

// 한 번에 살 수 있는 최대 수량
const MAX_QUANTITY = 99;

const formatGold = (amount: number) => amount.toLocaleString('en-US');

// 히로인 얼굴만 동그랗게 (얼굴 위치는 DatePage FACES)
function HeroineFace({ heroine }: { heroine: Heroine }) {
  const face = FACES[heroine];
  return (
    <span className="shop__face" aria-hidden>
      <img
        src={SPEAKERS[heroine].image}
        alt=""
        style={{ width: `${face.size ?? 230}%`, transform: `translate(${-face.x * 100}%, ${-face.y * 100}%)` }}
      />
    </span>
  );
}

// 보유 표시용 쇼핑백 아이콘
function BagIcon() {
  return (
    <svg className="shop__bag" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

// 카드 왼쪽 위: 보유 개수 (없으면 미보유)
function OwnedBadge({ count }: { count: number }) {
  return (
    <span className={count > 0 ? 'shop__owned-badge shop__owned-badge--on' : 'shop__owned-badge'}>
      <BagIcon />
      {count > 0 ? `보유 ${count}개` : '미보유'}
    </span>
  );
}

function GiftImage({ gift, className }: { gift: Gift; className: string }) {
  return <div className={className}>{gift.image && <img src={gift.image} alt="" />}</div>;
}

// 상점: 히로인이 좋아하는 선물을 사서 보관함에 모아 둠
export default function ShopPage({ coins, onSpend, onClose }: Props) {
  const [inventory, setInventory] = useStoredState<GiftInventory>(PROGRESS_KEYS.gifts, {});
  const [selectedId, setSelectedId] = useState(GIFTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const selected = GIFTS.find((g) => g.id === selectedId) ?? GIFTS[0];
  const total = selected.price * quantity;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const select = (gift: Gift) => {
    setSelectedId(gift.id);
    setQuantity(1);
  };

  const buy = () => {
    if (coins < total) return;
    onSpend(total);
    setInventory((prev) => ({ ...prev, [selected.id]: (prev[selected.id] ?? 0) + quantity }));
    setQuantity(1);
  };

  return (
    <div className="shop">
      <Backdrop src={backgroundImg} tint />
      <header className="page-top">
        <button className="page-top__back" onClick={onClose} aria-label="뒤로">
          <Glyph grid={glyphs.prev} />
        </button>
        <h2 className="page-top__ribbon">
          <Icon name="shop" className="page-top__icon" />
          상점
        </h2>
        <span className="shop__coins" aria-label={`골드 ${formatGold(coins)}`}>
          <span className="inv__coin" aria-hidden>G</span>
          {formatGold(coins)}
        </span>
      </header>

      <div className="shop__body">
        <section className="dates__panel shop__panel">
          <div className="dates__head">
            <h3>
              <HeartMark />
              Gift Shop
            </h3>
            <span className="shop__hint">히로인이 좋아하는 선물로 호감도를 올려보세요</span>
          </div>

          <ul className="shop__grid">
            {GIFTS.map((gift) => (
              <li key={gift.id}>
                <button
                  className={gift.id === selectedId ? 'shop-card shop-card--selected' : 'shop-card'}
                  onClick={() => select(gift)}
                  aria-pressed={gift.id === selectedId}
                >
                  <GiftImage gift={gift} className="shop-card__art" />
                  <OwnedBadge count={inventory[gift.id] ?? 0} />
                  <span className="shop__bonus">
                    <HeartMark />+{gift.affection}
                  </span>
                  <span className="shop-card__info">
                    <span className="shop-card__row">
                      <strong className="shop-card__name">{gift.name}</strong>
                      <span className="shop__price">
                        <span className="shop__dot" aria-hidden />
                        {formatGold(gift.price)}
                      </span>
                    </span>
                    <span className="shop-card__heroine">
                      <span className="shop-card__label">공략 히로인</span>
                      <HeroineFace heroine={gift.heroine} />
                      {SPEAKERS[gift.heroine].name}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="dates__panel shop__panel shop__detail">
          <div className="dates__head">
            <h3>
              <HeartMark />
              Item
            </h3>
          </div>

          <div className="shop__detail-body">
            <GiftImage gift={selected} className="shop__detail-art" />
            <strong className="shop__detail-name">{selected.name}</strong>
            <span className="shop__effect">
              <HeroineFace heroine={selected.heroine} />
              {SPEAKERS[selected.heroine].name} 호감도
              <span className="shop__effect-value">
                <HeartMark />+{selected.affection}
              </span>
            </span>
            <span className="shop__owned">
              <BagIcon />
              보유 중
              <span className="shop__owned-count">
                <b>{inventory[selected.id] ?? 0}</b>개
              </span>
            </span>

            <div className="shop__order">
              <div className="shop__line">
                <span>수량</span>
                <span className="shop__stepper">
                  <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1} aria-label="수량 줄이기">
                    −
                  </button>
                  <b>{quantity}</b>
                  <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= MAX_QUANTITY} aria-label="수량 늘리기">
                    +
                  </button>
                </span>
              </div>
              <div className="shop__line shop__line--total">
                <span>합계</span>
                <span className={coins < total ? 'shop__price shop__price--short' : 'shop__price'}>
                  <span className="shop__dot" aria-hidden />
                  {formatGold(selected.price)} × {quantity}
                </span>
              </div>
              <button className="shop__buy" onClick={buy} disabled={coins < total}>
                <HeartMark />
                {coins < total ? '골드가 부족해요' : '구매하기'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
