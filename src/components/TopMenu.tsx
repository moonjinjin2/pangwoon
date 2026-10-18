// 16x16 픽셀 그리드로 그린 아이콘. 각 문자는 palette의 색상 키, '.'은 투명
type Grid = string[];

const palette: Record<string, string> = {
  w: '#f7f5ff',
  l: '#c9b8f0',
  p: '#f49ac1',
  o: '#f0a060',
  d: '#b8561f',
};

const icons = {
  shirt: [
    '................',
    '...wwww..wwww...',
    '.wwwwwwllwwwwww.',
    'wwwwwwwllwwwwwww',
    'wwwwwwwllwwwwwww',
    'lwwlwwwwwwwwlwwl',
    '.llllwwwwwwllll.',
    '....lwwwwwwl....',
    '....lwwwwwwl....',
    '....lwwwwwwl....',
    '....lwwwwwwl....',
    '....lwwwwwwl....',
    '....llllllll....',
  ],
  shop: [
    '................',
    '..pppwwwpppwww..',
    '.ppppwwwpppwwwp.',
    'pppppwwwpppwwwpp',
    '.wwwwwwwwwwwwww.',
    '.w............w.',
    '.w.wwww..wwww.w.',
    '.w.w..w..w..w.w.',
    '.w.wwww..w..w.w.',
    '.w.......w..w.w.',
    '.w.......w..w.w.',
    'wwwwwwwwwwwwwwww',
  ],
  book: [
    '................',
    '.wwwww....wwwww.',
    'wwwwwwwllwwwwwww',
    'wllllwwllwwllllw',
    'wwwwwwwllwwwwwww',
    'wllllwwllwwllllw',
    'wwwwwwwllwwwwwww',
    'wlllwwwllwwwlllw',
    'wwwwwwwllwwwwwww',
    'wwwwwwwllwwwwwww',
    'pwwwwwwllwwwwwwp',
    'pppppppppppppppp',
    '......pppp......',
  ],
  coin: [
    '....dddddddd....',
    '..ddoooooooodd..',
    '.dooooooooooood.',
    '.doooddddddoood.',
    'dooodoooooodoood',
    'doodoooooooodood',
    'doodoooooooodood',
    'doodoooooooodood',
    'doodoooooooodood',
    'doodoooooooodood',
    'dooodoooooodoood',
    '.doooddddddoood.',
    '.dooooooooooood.',
    '..ddoooooooodd..',
    '....dddddddd....',
  ],
  gear: [
    '......wwww......',
    '..ww.wwwwww.ww..',
    '.wwwwwwwwwwwwww.',
    '..wwwwwwwwwwww..',
    '..wwww....wwww..',
    'wwwww......wwwww',
    'wwwww......wwwww',
    'wwwww......wwwww',
    'wwwww......wwwww',
    '..wwww....wwww..',
    '..wwwwwwwwwwww..',
    '.wwwwwwwwwwwwww.',
    '..ww.wwwwww.ww..',
    '......wwww......',
  ],
} satisfies Record<string, Grid>;

function PixelIcon({ grid }: { grid: Grid }) {
  const width = Math.max(...grid.map((row) => row.length));
  const height = grid.length;
  const rects: JSX.Element[] = [];

  // 같은 색이 연속되는 픽셀은 하나의 rect로 합침
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === key) end++;
      if (key !== '.') {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={palette[key]} />);
      }
      x = end;
    }
  });

  return (
    <svg className="topmenu__icon" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {rects}
    </svg>
  );
}

interface Props {
  coins: number;
  onWardrobe?: () => void;
  onShop?: () => void;
  onCollection?: () => void;
  onSettings?: () => void;
}

export default function TopMenu({ coins, onWardrobe, onShop, onCollection, onSettings }: Props) {
  return (
    <nav className="topmenu">
      <button className="topmenu__item topmenu__btn" onClick={onWardrobe} aria-label="옷장">
        <PixelIcon grid={icons.shirt} />
      </button>
      <button className="topmenu__item topmenu__btn" onClick={onShop} aria-label="상점">
        <PixelIcon grid={icons.shop} />
      </button>
      <button className="topmenu__item topmenu__btn" onClick={onCollection} aria-label="컬렉션">
        <PixelIcon grid={icons.book} />
      </button>
      <div className="topmenu__item topmenu__coins" aria-label={`코인 ${coins.toLocaleString('en-US')}`}>
        <PixelIcon grid={icons.coin} />
        <span className="topmenu__amount">{coins.toLocaleString('en-US')}</span>
      </div>
      <button className="topmenu__item topmenu__btn" onClick={onSettings} aria-label="설정">
        <PixelIcon grid={icons.gear} />
      </button>
    </nav>
  );
}
