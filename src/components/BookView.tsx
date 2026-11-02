import { Fragment, useEffect, useState, type ReactNode } from 'react';
import backgroundImg from '../img/background/main_background.jpg';
import { Glyph, glyphs, useMediaQuery } from '../pages/WardrobePage';

// 한 쪽에 카드 4장 (2x2)
export const CARDS_PER_PAGE = 4;

// 화면이 좁으면 책을 한 쪽씩만 펼침
const NARROW_SCREEN = '(max-width: 760px)';

interface Props {
  title: string;
  badge: ReactNode;
  // 전체 카드 칸 수 (펼친 면이 꽉 차도록 남는 칸도 renderCard로 그림)
  cardCount: number;
  // i번째 칸의 카드 (<li>)
  renderCard: (index: number) => ReactNode;
  onClose: () => void;
}

// 카드를 책 모양으로 펼쳐 보여주는 전체 화면 (에피소드 컬렉션, 데이트 선택)
export default function BookView({ title, badge, cardCount, renderCard, onClose }: Props) {
  const [spread, setSpread] = useState(0);
  const pagesPerSpread = useMediaQuery(NARROW_SCREEN) ? 1 : 2;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cardsPerSpread = CARDS_PER_PAGE * pagesPerSpread;
  const spreadCount = Math.max(1, Math.ceil(cardCount / cardsPerSpread));
  const currentSpread = Math.min(spread, spreadCount - 1);
  const pages = Array.from({ length: pagesPerSpread }, (_, i) => currentSpread * pagesPerSpread + i);

  return (
    <div
      className="collection"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 240, 246, 0.6), rgba(255, 240, 246, 0.6)), url(${backgroundImg})`,
      }}
    >
      <button className="wardrobe__back" onClick={onClose}>
        <Glyph grid={glyphs.prev} />
        BACK
      </button>

      <header className="collection__ribbon">
        <h2>{title}</h2>
        <span className="collection__count">{badge}</span>
      </header>

      <div className="collection__spread">
        <button
          className="collection__turn"
          onClick={() => setSpread(currentSpread - 1)}
          disabled={currentSpread === 0}
          aria-label="이전 페이지"
        >
          <Glyph grid={glyphs.prev} />
        </button>

        <div className={pagesPerSpread === 2 ? 'book' : 'book book--single'}>
          {pages.map((page, side) => {
            const indexes = Array.from({ length: CARDS_PER_PAGE }, (_, i) => page * CARDS_PER_PAGE + i);
            const sideClass = pagesPerSpread === 1 ? '' : side === 0 ? ' book__page--left' : ' book__page--right';
            return (
              <section key={page} className={`book__page${sideClass}`} aria-label={`${page + 1}쪽`}>
                <ul className="book__grid">
                  {indexes.map((i) => (
                    <Fragment key={i}>{renderCard(i)}</Fragment>
                  ))}
                </ul>
                <span className="book__folio">{page + 1}</span>
              </section>
            );
          })}
        </div>

        <button
          className="collection__turn"
          onClick={() => setSpread(currentSpread + 1)}
          disabled={currentSpread === spreadCount - 1}
          aria-label="다음 페이지"
        >
          <Glyph grid={glyphs.next} />
        </button>
      </div>
    </div>
  );
}
