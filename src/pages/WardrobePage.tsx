import { useEffect, useState, type CSSProperties } from 'react';
import backgroundImg from '../img/room3.png';
import characterImg from '../img/character/hayeong.png';
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

// 픽셀 아이콘: k=테두리, #=아이템 색, w=흰 디테일, .=투명
const icons: Record<Category, string[]> = {
  top: [
    '....kkkkkk....',
    '..kk#wkkw#kk..',
    '.k###w..w###k.',
    'k####w..w####k',
    'k#k##w##w##k#k',
    'k#k########k#k',
    'k#k########k#k',
    'k#k########k#k',
    'k#k########k#k',
    'k#k########k#k',
    'kkk########kkk',
    '..k########k..',
    '..kkkkkkkkkk..',
  ],
  bottom: [
    'kkkkkkkkkkkk',
    'k####ww####k',
    'kkkkkkkkkkkk',
    'k##########k',
    'k####kk####k',
    'k###k..k###k',
    'k###k..k###k',
    'k###k..k###k',
    'k###k..k###k',
    'k###k..k###k',
    'kkkkk..kkkkk',
  ],
};

function PixelIcon({ grid, color, className }: { grid: string[]; color: string; className: string }) {
  const width = Math.max(...grid.map((row) => row.length));
  const fills: Record<string, string> = { k: '#4a2440', '#': color, w: '#fff8f0' };
  const rects: JSX.Element[] = [];

  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === key) end++;
      if (key !== '.') {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={fills[key]} />);
      }
      x = end;
    }
  });

  return (
    <svg className={className} viewBox={`-1 -1 ${width + 2} ${width + 2}`} aria-hidden>
      {rects}
    </svg>
  );
}

function OutfitIcon({ outfit }: { outfit: Outfit }) {
  return <PixelIcon grid={icons[outfit.category]} color={outfit.color} className="inv__icon" />;
}

// 버튼용 픽셀 글리프 (#=글자색)
const glyphs = {
  close: ['##...##', '###.###', '.#####.', '..###..', '.#####.', '###.###', '##...##'],
  prev: ['...#', '..##', '.###', '####', '.###', '..##', '...#'],
  next: ['#...', '##..', '###.', '####', '###.', '##..', '#...'],
  star: ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'],
};

const coinIcon = ['..kkkk..', '.k#ww#k.', 'k#w####k', 'k#w####k', 'k######k', 'k######k', '.k####k.', '..kkkk..'];

function Glyph({ grid }: { grid: string[] }) {
  const width = Math.max(...grid.map((row) => row.length));
  return (
    <svg className="inv__glyph" viewBox={`0 0 ${width} ${grid.length}`} aria-hidden>
      {grid.flatMap((row, y) =>
        [...row].map((key, x) => (key === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
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

function useMediaQuery(query: string) {
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
  const pageSize = useMediaQuery(SHORT_SCREEN) ? 4 : 6;

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
        backgroundImage: `linear-gradient(rgba(20, 16, 40, 0.55), rgba(20, 16, 40, 0.55)), url(${backgroundImg})`,
      }}
    >
      <button className="topmenu__item wardrobe__back" onClick={onClose}>
        ◀ BACK
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
              <PixelIcon grid={icons[category]} color="#f390b0" className="inv__side-icon" />
            </button>
          ))}
        </nav>

        <div className="inv__window">
          <header className="inv__header">
            <svg className="inv__gem" viewBox="0 0 7 7" aria-hidden>
              <path d="M3 0h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3V6H2V5H1V4H0V3h1V2h1V1h1z" />
            </svg>
            <h2 className="inv__title">WARDROBE</h2>
            <button className="inv__round" onClick={onClose} aria-label="닫기">
              <Glyph grid={glyphs.close} />
            </button>
          </header>

          <div className="inv__toolbar">
            <span className="inv__label">{CATEGORY_META[tab].tab}</span>
            <span className="inv__coins">
              <PixelIcon grid={coinIcon} color="#f2a65a" className="inv__coin" />
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

          <ul className="inv__grid" style={{ gridTemplateRows: `repeat(${pageSize / 2}, 1fr)` }}>
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
