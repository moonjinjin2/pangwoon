import { useState, type CSSProperties } from 'react';
import Icon, { HeartMark } from './Icon';
import { STAT_META } from './StatsBox';
import { SPEAKERS } from '../utils/episode';
import { RARITY_META, type Item } from '../utils/gacha';

interface Props {
  item: Item;
  count: number;
  // 고른 개수만큼 사용
  onUse: (amount: number) => void;
  onClose: () => void;
}

// 이름 리본에 한 줄로 들어가는 글자 수. 이보다 길면 글자를 줄여 리본 폭에 맞춤
const NAME_FIT_CHARS = 10;

// 보관함 아이템 상세 창: 어떤 아이템이든 같은 틀 (그림 · 이름 · 설명 · 효과 · 사용 버튼). 등급은 테두리로 구분
export default function ItemDetail({ item, count, onUse, onClose }: Props) {
  const effects = STAT_META.filter(({ key }) => item.stats[key]);
  const nameScale = Math.min(1, NAME_FIT_CHARS / item.name.length);
  // 사용할 개수 (보유 개수가 줄면 그 안으로 맞춤)
  const [picked, setPicked] = useState(1);
  const amount = Math.max(1, Math.min(picked, count));

  return (
    <div
      className="modal g-modal"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`item-detail item-detail--${item.rarity}`}
        style={{ '--rarity': RARITY_META[item.rarity].color } as CSSProperties}
        role="dialog"
        aria-modal
        aria-label={item.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="g-dialog__close item-detail__close" onClick={onClose} aria-label="닫기">
          <svg viewBox="0 0 10 10" aria-hidden>
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </button>

        <div className="item-detail__art">
          <img src={item.image} alt="" />
          <span className="item-detail__count">보유 {count}개</span>
        </div>

        <div className="item-detail__info">
          <h3 className="item-detail__name">
            <span style={{ fontSize: `${nameScale}em` }}>{item.name}</span>
          </h3>
          <p className="item-detail__desc">{item.description}</p>

          <div className="item-detail__effects">
            <span className="item-detail__effects-label">효과</span>
            <ul>
              {effects.map(({ key, label, icon, color }) => (
                <li key={key} style={{ color }}>
                  <Icon name={icon} className="item-detail__effect-icon" />
                  <span className="item-detail__effect-label">{label}</span>
                  <b>+{(item.stats[key] ?? 0) * amount}</b>
                </li>
              ))}
              {item.gift && (
                <li className="item-detail__effect--gift">
                  <HeartMark className="item-detail__effect-icon" />
                  <span className="item-detail__effect-label">{SPEAKERS[item.gift.heroine].name} 호감도</span>
                  <b>+{item.gift.affection * amount}</b>
                </li>
              )}
            </ul>
          </div>

          <div className="item-detail__actions">
            {count > 1 && (
              <div className="item-detail__qty">
                <div className="item-detail__stepper" role="group" aria-label="사용 개수">
                  <button type="button" onClick={() => setPicked((n) => Math.max(1, Math.min(n, count) - 1))} disabled={amount <= 1} aria-label="하나 줄이기">
                    −
                  </button>
                  <output aria-live="polite">{amount}</output>
                  <button type="button" onClick={() => setPicked((n) => Math.min(count, n + 1))} disabled={amount >= count} aria-label="하나 늘리기">
                    +
                  </button>
                </div>
              </div>
            )}
            {/* 뽑기 버튼과 같은 금속 테. 아이템 사용 소리가 따로 나므로 클릭음 없음 */}
            <button type="button" className="gacha__pull item-detail__use" data-sfx="none" onClick={() => onUse(amount)} autoFocus>
              <span className="gacha__pull-frame" aria-hidden />
              <span className="gacha__pull-label">{amount > 1 ? `${amount}개 사용` : '사용'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
