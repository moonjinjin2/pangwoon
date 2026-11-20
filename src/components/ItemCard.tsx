import type { ReactNode } from 'react';
import { HeartMark } from './Icon';
import { SPEAKERS } from '../utils/episode';
import { STAT_LABELS, type StatKey } from './StatsBox';
import { RARITY_META, type Item } from '../utils/gacha';

interface Props {
  item: Item;
  // 보관함에서 보유 개수 표시 (없으면 숨김)
  count?: number;
  // 아직 얻지 못한 아이템 (흐리게)
  dim?: boolean;
  // 카드 아래 덧붙일 내용 (사용 버튼·확률 등)
  children?: ReactNode;
}

// 아이템 한 칸: 아이콘(등급 테두리 포함) + 이름 + 효과
export default function ItemCard({ item, count, dim = false, children }: Props) {
  return (
    <div className={`item-card item-card--${item.rarity}${dim ? ' item-card--dim' : ''}`} style={{ borderColor: RARITY_META[item.rarity].color }}>
      <div className="item-card__art">
        <img src={item.image} alt="" />
        {count !== undefined && <span className="item-card__count">×{count}</span>}
      </div>
      <strong className="item-card__name">{item.name}</strong>
      <span className="item-card__effects">
        {(Object.entries(item.stats) as [StatKey, number][]).map(([stat, value]) => (
          <span key={stat} className="item-card__stat">
            {STAT_LABELS[stat]} +{value}
          </span>
        ))}
        {item.gift && (
          <span className="item-card__stat item-card__stat--gift">
            <HeartMark />
            {SPEAKERS[item.gift.heroine].name} +{item.gift.affection}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}
