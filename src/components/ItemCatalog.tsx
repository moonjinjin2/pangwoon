import { useState } from 'react';
import ItemCard from './ItemCard';
import Dialog from './ui/Dialog';
import { ITEMS, RARITIES, RARITY_META, type Item, type ItemInventory, type Rarity } from '../utils/gacha';

interface Props {
  inventory: ItemInventory;
  onClose: () => void;
}

// 목록 높이의 기준이 되는 등급
const SIZE_RARITY: Rarity = 'SR';

// 아이템 하나가 나올 확률(%) = 등급 확률 ÷ 그 등급 아이템 수
function itemRate(rarity: Rarity) {
  const rate = RARITY_META[rarity].rate / ITEMS.filter((i) => i.rarity === rarity).length;
  return rate >= 1 ? rate.toFixed(1) : rate.toFixed(2);
}

// 획득 가능 아이템: 등급 탭별로(N부터) 전체 목록과 확률, 보유 여부를 보여줌
export default function ItemCatalog({ inventory, onClose }: Props) {
  const [rarity, setRarity] = useState<Rarity>('N');
  const items = ITEMS.filter((i) => i.rarity === rarity);
  const ownedCount = items.filter((i) => (inventory[i.id] ?? 0) > 0).length;

  const renderItem = (item: Item) => {
    const count = inventory[item.id] ?? 0;
    return (
      <li key={item.id}>
        <ItemCard item={item} dim={count === 0}>
          <span className={count > 0 ? 'catalog__owned catalog__owned--on' : 'catalog__owned'}>
            {count > 0 ? `보유 ${count}개` : '미보유'}
          </span>
        </ItemCard>
      </li>
    );
  };

  return (
    <Dialog title="획득 가능 아이템" icon="sparkle" onClose={onClose} closeOnBackdrop className="catalog">
      <div className="catalog__tabs" role="tablist" aria-label="등급">
        {RARITIES.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={r === rarity}
            className={r === rarity ? 'catalog__tab catalog__tab--on' : 'catalog__tab'}
            style={{ color: RARITY_META[r].color }}
            onClick={() => setRarity(r)}
          >
            <b>{r}</b>
            <span>{RARITY_META[r].rate}%</span>
          </button>
        ))}
      </div>

      <p className="catalog__summary">
        {rarity} 등급 {items.length}종 · 하나당 {itemRate(rarity)}% · 보유 {ownedCount} / {items.length}
      </p>

      {/* 창 높이는 SR 목록 기준으로 고정: SR 목록을 안 보이게 깔아 높이를 잡고, 고른 등급 목록은 그 위에 겹쳐 스크롤 */}
      <div className="catalog__body">
        <ul className="catalog__grid catalog__grid--sizer" aria-hidden>
          {ITEMS.filter((i) => i.rarity === SIZE_RARITY).map((item) => renderItem(item))}
        </ul>
        <ul className="catalog__grid catalog__grid--active" role="tabpanel">
          {items.map((item) => renderItem(item))}
        </ul>
      </div>
    </Dialog>
  );
}
