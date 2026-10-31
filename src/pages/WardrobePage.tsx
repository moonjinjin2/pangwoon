import { useEffect, useState, type CSSProperties } from 'react';
import backgroundImg from '../img/room3.png';
import characterImg from '../img/character/hayeong_whole.png';
import { HeartMark } from '../components/Icon';
import { PROGRESS_KEYS, useStoredState } from '../utils/storage';
import {
  CATEGORIES,
  CATEGORY_META,
  DEFAULT_EQUIPPED,
  DEFAULT_OWNED,
  OUTFITS,
  getOutfit,
  type Category,
  type Equipped,
  type Outfit,
} from '../utils/wardrobe';

// 옷 종류 아이콘 (24x24, 아이템 색으로 채움)
const OUTFIT_PATHS: Record<Category, string> = {
  top: 'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z',
  bottom: 'M6 2h12l1.5 19.5h-5.5L12 9.5l-2 12H4.5z',
};

function OutfitShape({ category, color, className }: { category: Category; color: string; className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d={OUTFIT_PATHS[category]} fill={color} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function OutfitIcon({ outfit }: { outfit: Outfit }) {
  return <OutfitShape category={outfit.category} color={outfit.color} className="inv__icon" />;
}

// 버튼용 선 글리프 (12x12)
export const glyphs = {
  close: 'M3 3l6 6M9 3l-6 6',
  prev: 'M7.5 2.5 4 6l3.5 3.5',
  next: 'M4.5 2.5 8 6l-3.5 3.5',
  star: 'M6 1.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1L6 8.6l-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z',
};

export function Glyph({ grid }: { grid: string }) {
  return (
    <svg className="inv__glyph" viewBox="0 0 12 12" aria-hidden>
      <path d={grid} />
    </svg>
  );
}

// 전신 이미지 위에 부위별로 색을 덧입혀 옷 미리보기
function Character({ outfit }: { outfit: Equipped }) {
  return (
    <div className="wardrobe__char">
      <img src={characterImg} alt="하영" />
      {CATEGORIES.map((category) => {
        const tint = getOutfit(outfit[category])?.tint;
        if (!tint) return null;
        const { region, blend } = CATEGORY_META[category];
        return (
          <div
            key={category}
            className="wardrobe__tint"
            style={
              {
                background: tint,
                mixBlendMode: blend,
                clipPath: `inset(${region[0]}% 0 ${100 - region[1]}% 0)`,
                maskImage: `url(${characterImg})`,
                WebkitMaskImage: `url(${characterImg})`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

// 화면 높이가 낮으면 카드가 찌그러지지 않도록 한 페이지에 2줄만
const SHORT_SCREEN = '(max-height: 700px)';
const MOBILE_LANDSCAPE = '(orientation: landscape) and (max-height: 500px)';

// 터치 기기이거나 폰 크기 화면이면 모바일로 봄 (PC 브라우저의 모바일 미리보기도 포함)
export const MOBILE_QUERY = '(pointer: coarse), (max-width: 760px), (max-height: 500px)';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

type Filter = 'all' | 'owned' | 'shop';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'owned', label: '보유' },
  { key: 'shop', label: '상점' },
];

interface Props {
  coins: number;
  onSpend: (amount: number) => void;
  onClose: () => void;
}

export default function WardrobePage({ coins, onSpend, onClose }: Props) {
  const [owned, setOwned] = useStoredState<string[]>(PROGRESS_KEYS.ownedOutfits, DEFAULT_OWNED);
  const [equipped, setEquipped] = useStoredState<Equipped>(PROGRESS_KEYS.equippedOutfit, DEFAULT_EQUIPPED);
  // 미리보기는 저장하지 않음 (나가면 착용 중인 옷으로 돌아감)
  const [preview, setPreview] = useState<Equipped>(equipped);
  const [tab, setTab] = useState<Category>('top');
  const [selectedId, setSelectedId] = useState<string>(equipped.top);
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(0);
  // 모바일(가로)은 카드가 가로로 넓으니 3열 x 2줄
  const isMobile = useMediaQuery(MOBILE_LANDSCAPE);
  const isShort = useMediaQuery(SHORT_SCREEN);
  const pageSize = !isMobile && isShort ? 4 : 6;
  const columns = isMobile ? 3 : 2;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const items = OUTFITS.filter((o) => {
    if (o.category !== tab) return false;
    if (filter === 'owned') return owned.includes(o.id);
    if (filter === 'shop') return !owned.includes(o.id);
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = items.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const selected = getOutfit(selectedId);
  const isOwned = selected ? owned.includes(selected.id) : false;
  const isEquipped = selected ? equipped[selected.category] === selected.id : false;
  const isPreviewChanged = CATEGORIES.some((c) => preview[c] !== equipped[c]);

  const changeTab = (category: Category) => {
    setTab(category);
    setSelectedId(preview[category]);
    setPage(0);
  };

  const select = (outfit: Outfit) => {
    setSelectedId(outfit.id);
    setPreview((prev) => ({ ...prev, [outfit.category]: outfit.id }));
  };

  const equip = (outfit: Outfit) => {
    setEquipped((prev) => ({ ...prev, [outfit.category]: outfit.id }));
  };

  const buy = (outfit: Outfit) => {
    if (owned.includes(outfit.id) || coins < outfit.price) return;
    onSpend(outfit.price);
    setOwned((prev) => [...prev, outfit.id]);
    equip(outfit);
  };

  const resetPreview = () => {
    setPreview(equipped);
    setSelectedId(equipped[tab]);
  };

  return (
    <div
      className="wardrobe"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 240, 246, 0.6), rgba(255, 240, 246, 0.6)), url(${backgroundImg})`,
      }}
    >
      <button className="wardrobe__back" onClick={onClose}>
        <Glyph grid={glyphs.prev} />
        BACK
      </button>

      <div className="wardrobe__stage">
        <Character outfit={preview} />
        {isPreviewChanged && (
          <div className="wardrobe__preview">
            <span>미리보기 중</span>
            <button onClick={resetPreview}>되돌리기</button>
          </div>
        )}
      </div>

      <section className="inv">
        <nav className="inv__side" role="tablist" aria-label="옷 종류">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={tab === category}
              aria-label={CATEGORY_META[category].label}
              className={tab === category ? 'inv__side-tab inv__side-tab--active' : 'inv__side-tab'}
              onClick={() => changeTab(category)}
            >
              <OutfitShape category={category} color="#fff" className="inv__side-icon" />
            </button>
          ))}
        </nav>

        <div className="inv__window">
          <header className="inv__header">
            <HeartMark className="inv__gem" />
            <h2 className="inv__title">WARDROBE</h2>
            <button className="inv__round" onClick={onClose} aria-label="닫기">
              <Glyph grid={glyphs.close} />
            </button>
          </header>

          <div className="inv__toolbar">
            <span className="inv__label">{CATEGORY_META[tab].tab}</span>
            <span className="inv__coins">
              <span className="inv__coin" aria-hidden>G</span>
              {coins.toLocaleString('en-US')}
            </span>
          </div>

          <div className="inv__filters">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                className={filter === key ? 'inv__filter inv__filter--active' : 'inv__filter'}
                onClick={() => {
                  setFilter(key);
                  setPage(0);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="inv__grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${pageSize / columns}, 1fr)` }}>
            {Array.from({ length: pageSize }, (_, i) => {
              const outfit = pageItems[i];
              if (!outfit) return <li key={i} className="inv__card inv__card--empty" />;
              const classes = ['inv__card'];
              if (outfit.id === selectedId) classes.push('inv__card--selected');
              if (!owned.includes(outfit.id)) classes.push('inv__card--locked');
              return (
                <li key={outfit.id}>
                  <button className={classes.join(' ')} onClick={() => select(outfit)} aria-label={outfit.name}>
                    <OutfitIcon outfit={outfit} />
                    {equipped[outfit.category] === outfit.id && (
                      <span className="inv__star" aria-label="착용중">
                        <Glyph grid={glyphs.star} />
                      </span>
                    )}
                    {!owned.includes(outfit.id) && (
                      <span className="inv__price">{outfit.price.toLocaleString('en-US')}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {selected && (
            <div className="inv__detail">
              <div className="inv__detail-info">
                <span className="inv__detail-name">{selected.name}</span>
                <span className="inv__detail-desc">{selected.desc}</span>
              </div>
              {isOwned ? (
                <button className="inv__action" disabled={isEquipped} onClick={() => equip(selected)}>
                  {isEquipped ? '착용중' : '착용'}
                </button>
              ) : (
                <button className="inv__action inv__action--buy" disabled={coins < selected.price} onClick={() => buy(selected)}>
                  구매
                </button>
              )}
            </div>
          )}

          <footer className="inv__pager">
            <button
              className="inv__page-btn"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="이전 페이지"
            >
              <Glyph grid={glyphs.prev} />
            </button>
            <span className="inv__page">
              {String(currentPage + 1).padStart(2, '0')}/{String(pageCount).padStart(2, '0')}
            </span>
            <button
              className="inv__page-btn"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
              aria-label="다음 페이지"
            >
              <Glyph grid={glyphs.next} />
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}
