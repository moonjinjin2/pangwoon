import type { ReactNode } from 'react';
import Icon, { HeartMark } from './Icon';
import { SPEAKERS } from '../utils/episode';
import { STAT_META } from './StatsBox';
import { RARITY_META, describeEffects, type Item } from '../utils/gacha';

interface Props {
  item: Item;
  // 보관함에서 보유 개수 표시 (없으면 숨김)
  count?: number;
  // 아직 얻지 못한 아이템 (흐리게)
  dim?: boolean;
  // 카드 아래 덧붙일 내용 (보유 여부 등)
  children?: ReactNode;
  // 있으면 카드 전체가 버튼 (보관함에서 눌러 상세 창 열기)
  onClick?: () => void;
}

// 아이템 한 칸: 아이콘(등급 테두리 포함) + 이름 + 효과
export default function ItemCard({ item, count, dim = false, children, onClick }: Props) {
  const Root = onClick ? 'button' : 'div';
  return (
    <Root
      {...(onClick && { type: 'button' as const, onClick })}
      className={`item-card item-card--${item.rarity}${dim ? ' item-card--dim' : ''}${onClick ? ' item-card--button' : ''}`}
      style={{ borderColor: RARITY_META[item.rarity].color }}
    >
      <span className="item-card__art">
        <img src={item.image} alt="" />
        {count !== undefined && <span className="item-card__count">×{count}</span>}
      </span>
      <strong className="item-card__name">{item.name}</strong>
      {/* 효과: 상단 스탯바와 같은 아이콘·색 + 숫자만 (스탯 이름은 올렸을 때 · 상세 창에서) */}
      <span className="item-card__effects" title={describeEffects([item])} aria-label={describeEffects([item])}>
        {STAT_META.filter(({ key }) => item.stats[key]).map(({ key, icon, color }) => (
          <span key={key} className="item-card__stat" style={{ color }} aria-hidden>
            <Icon name={icon} className="item-card__stat-icon" />+{item.stats[key]}
          </span>
        ))}
        {item.gift && (
          <span className="item-card__stat item-card__stat--gift" aria-hidden>
            <HeartMark className="item-card__stat-icon" />
            {SPEAKERS[item.gift.heroine].name} +{item.gift.affection}
          </span>
        )}
      </span>
      {children}
    </Root>
  );
}
