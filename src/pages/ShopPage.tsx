import { useEffect, useState } from 'react';
import backgroundImg from '../img/background/room.png';
import chestImg from '../img/gacha/chest.png';
import Backdrop from '../components/Backdrop';
import GachaScene from '../components/GachaScene';
import ItemCatalog from '../components/ItemCatalog';
import { Glyph, glyphs } from '../components/DecoFrame';
import Icon from '../components/Icon';
import ItemCard from '../components/ItemCard';
import Plate from '../components/ui/Plate';
import { DANGER_COLOR, STAT_META, getStatMax, isDanger, type Stats } from '../components/StatsBox';
import ProgressBar from '../components/ui/ProgressBar';
import {
  ITEMS,
  PULL_PRICE,
  RARITIES,
  RARITY_META,
  TEN_PULL_PRICE,
  describeEffects,
  pullItems,
  rarityRank,
  type Item,
  type ItemInventory,
} from '../utils/gacha';
import { PROGRESS_KEYS, useStoredState } from '../utils/storage';
import { playSound } from '../utils/sfx';

interface Props {
  coins: number;
  // 아이템 효과를 바로 확인할 수 있게 현재 스탯을 골드 옆에 표시
  stats: Stats;
  onSpend: (amount: number) => void;
  // 아이템을 사용하면 효과(스탯·호감도)를 반영
  onUseItems: (items: Item[]) => void;
  onClose: () => void;
}

const formatGold = (amount: number) => amount.toLocaleString('en-US');

// 보관함은 높은 등급부터 (같은 등급은 목록 순서대로)
const SORTED_ITEMS = [...ITEMS].sort((a, b) => rarityRank(b.rarity) - rarityRank(a.rarity));

// 사용 알림이 떠 있는 시간
const NOTICE_MS = 2600;

interface PullButtonProps {
  label: string;
  price: number;
  note?: string;
  disabled: boolean;
  onClick: () => void;
}

// 금속 테 + 벨벳 네모 버튼 (일정 진행·데이트 육각 버튼과 같은 재질, 테는 src/img/ui/pull*.svg)
function PullButton({ label, price, note, disabled, onClick }: PullButtonProps) {
  return (
    <button className="gacha__pull" onClick={onClick} disabled={disabled}>
      <span className="gacha__pull-frame" aria-hidden />
      <span className="gacha__pull-text">
        <span className="gacha__pull-label">{label}</span>
        <span className="gacha__pull-price">
          <span className="shop__dot" aria-hidden />
          {formatGold(price)}
          {note && <span className="gacha__pull-note">· {note}</span>}
        </span>
      </span>
    </button>
  );
}

// 상점: 골드로 비밀의 상자를 열어 아이템을 뽑고 보관함에 모아 둠
export default function ShopPage({ coins, stats, onSpend, onUseItems, onClose }: Props) {
  const [inventory, setInventory] = useStoredState<ItemInventory>(PROGRESS_KEYS.items, {});
  const [results, setResults] = useState<Item[] | null>(null);
  // 한 번 더 뽑을 때 연출을 처음부터 다시 보여주려고 뽑을 때마다 늘림
  const [pullId, setPullId] = useState(0);
  const againPrice = results && results.length > 1 ? TEN_PULL_PRICE : PULL_PRICE;
  const [catalogOpen, setCatalogOpen] = useState(false);
  // 방금 사용한 아이템 알림
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(null);
  const owned = SORTED_ITEMS.filter((item) => (inventory[item.id] ?? 0) > 0);

  // Esc: 아이템 목록이 열려 있으면 그것만 닫음 (뽑기 연출 중에는 연출 쪽에서 처리)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (catalogOpen) setCatalogOpen(false);
      else if (!results) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, catalogOpen, results]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // 보관함에서 꺼내 사용 (효과 반영 + 개수 차감)
  const consumeItems = (items: Item[]) => {
    if (items.length === 0) return;
    setInventory((prev) => {
      const next = { ...prev };
      for (const item of items) {
        const left = (next[item.id] ?? 0) - 1;
        if (left > 0) next[item.id] = left;
        else delete next[item.id];
      }
      return next;
    });
    onUseItems(items);
    playSound('itemUse');
    const what = items.length === 1 ? items[0].name : `아이템 ${items.length}개`;
    setNotice({ id: Date.now(), text: `${what} 사용 · ${describeEffects(items)}` });
  };

  // 골드를 내고 바로 보관함에 넣은 뒤 연출을 보여줌 (연출 중 새로고침해도 뽑은 아이템은 남음)
  const pull = (count: number, price: number) => {
    if (coins < price) return;
    const items = pullItems(count);
    onSpend(price);
    playSound('coins');
    setInventory((prev) => {
      const next = { ...prev };
      for (const item of items) next[item.id] = (next[item.id] ?? 0) + 1;
      return next;
    });
    setResults(items);
    setPullId((id) => id + 1);
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
        <ul className="shop__stats" aria-label="현재 스탯">
          {STAT_META.map(({ key, label, icon, color }) => {
            const max = getStatMax(key);
            const value = Math.max(0, Math.min(max, stats[key]));
            const danger = key === 'health' && isDanger(key, stats);
            return (
              <li key={key} className={danger ? 'shop__stat shop__stat--danger' : 'shop__stat'} title={label}>
                <Icon name={icon} className="shop__stat-icon" />
                <span className="shop__stat-label">{label}</span>
                <span className="shop__stat-value">
                  {value}
                  <span className="shop__stat-max"> / {max}</span>
                </span>
                <ProgressBar className="shop__stat-bar" value={value} max={max} color={danger ? DANGER_COLOR : color} />
              </li>
            );
          })}
        </ul>
        <Plate className="topmenu__coins shop__coins" label={`골드 ${formatGold(coins)}`}>
          <span className="topmenu__coin" aria-hidden>G</span>
          <span className="topmenu__amount">{formatGold(coins)}</span>
        </Plate>
      </header>

      <div className="shop__body">
        <section className="dates__panel gacha">
          <div className="dates__head">
            <h3>비밀의 상자</h3>
            <span className="shop__hint">상자를 열어 랜덤 아이템을 획득하세요</span>
          </div>

          <div className="gacha__stage">
            <img className="gacha__chest" src={chestImg} alt="비밀의 상자" />
            <button type="button" className="gacha__catalog-link" onClick={() => setCatalogOpen(true)}>
              획득 가능 아이템
              <Glyph grid={glyphs.next} />
            </button>
          </div>

          <ul className="gacha__rates" aria-label="등급별 확률">
            {RARITIES.map((rarity) => (
              <li key={rarity}>
                <b style={{ color: RARITY_META[rarity].color }}>{rarity}</b>
                {RARITY_META[rarity].rate}%
              </li>
            ))}
          </ul>

          <div className="gacha__buttons">
            <PullButton label="1회 뽑기" price={PULL_PRICE} disabled={coins < PULL_PRICE} onClick={() => pull(1, PULL_PRICE)} />
            <PullButton
              label="10회 뽑기"
              price={TEN_PULL_PRICE}
              note="SR 이상 1개 확정"
              disabled={coins < TEN_PULL_PRICE}
              onClick={() => pull(10, TEN_PULL_PRICE)}
            />
          </div>
        </section>

        <aside className="dates__panel gacha-bag">
          <div className="dates__head">
            <h3>보관함</h3>
            <span className="shop__hint">
              {owned.length} / {ITEMS.length}종
            </span>
          </div>

          {owned.length === 0 ? (
            <p className="gacha-bag__empty">아직 뽑은 아이템이 없어요</p>
          ) : (
            <ul className="gacha-bag__grid">
              {owned.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} count={inventory[item.id]}>
                    <button type="button" className="item-card__use" onClick={() => consumeItems([item])}>
                      사용
                    </button>
                  </ItemCard>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {notice && (
        <p key={notice.id} className="shop__notice" role="status">
          {notice.text}
        </p>
      )}
      {results && (
        <GachaScene
          key={pullId}
          items={results}
          onDone={(used) => {
            setResults(null);
            consumeItems(used);
          }}
          againLabel={`${results.length}회 · ${formatGold(againPrice)}G`}
          canAgain={coins >= againPrice}
          onAgain={(used) => {
            consumeItems(used);
            pull(results.length, againPrice);
          }}
        />
      )}
      {catalogOpen && <ItemCatalog inventory={inventory} onClose={() => setCatalogOpen(false)} />}
    </div>
  );
}
