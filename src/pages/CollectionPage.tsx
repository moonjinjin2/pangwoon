import { useEffect, useState } from 'react';
import backgroundImg from '../img/room3.png';
import roomImg from '../img/room.jpg';
import barImg from '../img/bar_background.png';
import { Glyph, glyphs, useMediaQuery } from './WardrobePage';
import { EPISODE_CATALOG, PROLOGUE, SPEAKERS, getMainSpeaker, type Episode } from '../utils/episode';
import { PROGRESS_KEYS, useStoredState, type Collection } from '../utils/storage';

// 한 쪽에 카드 4장 (2x2)
const CARDS_PER_PAGE = 4;

// 화면이 좁으면 책을 한 쪽씩만 펼침
const NARROW_SCREEN = '(max-width: 760px)';

// 일러스트가 없는 에피소드는 배경 + 대표 캐릭터로 대신 그림
function EpisodeArt({ episode }: { episode: Episode }) {
  if (episode.illust) return <img className="ep-card__illust" src={episode.illust} alt="" />;
  const isPrologue = episode.id === PROLOGUE.id;
  return (
    <div
      className={isPrologue ? 'ep-card__art ep-card__art--night' : 'ep-card__art'}
      style={{ backgroundImage: `url(${isPrologue ? barImg : roomImg})` }}
    >
      <img className="ep-card__char" src={SPEAKERS[getMainSpeaker(episode)].image} alt="" />
    </div>
  );
}

// 에피소드 장면 제목(에피소드 #n)과 같은 번호를 씀
function EpisodeCard({ episode, number }: { episode?: Episode; number: number }) {
  const no = `#${number}`;
  if (!episode) {
    return (
      <li className="ep-card ep-card--locked" aria-label={`${no} 아직 보지 않은 에피소드`}>
        <div className="ep-card__frame">
          <span className="ep-card__question" aria-hidden>?</span>
        </div>
        <span className="ep-card__no">{no}</span>
        <span className="ep-card__title">???</span>
      </li>
    );
  }
  return (
    <li className="ep-card">
      <div className="ep-card__frame">
        <EpisodeArt episode={episode} />
        {episode.icon && <span className="ep-card__icon" aria-hidden>{episode.icon}</span>}
      </div>
      <span className="ep-card__no">{no}</span>
      <span className="ep-card__title">{episode.title}</span>
    </li>
  );
}

interface Props {
  onClose: () => void;
}

export default function CollectionPage({ onClose }: Props) {
  const [stored] = useStoredState<Collection>(PROGRESS_KEYS.collection, {});
  const [spread, setSpread] = useState(0);
  const pagesPerSpread = useMediaQuery(NARROW_SCREEN) ? 1 : 2;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 메인 화면은 프롤로그를 본 뒤에만 오므로 #0 프롤로그는 항상 수집된 것으로 봄
  const collected: Collection = { 0: PROLOGUE.id, ...stored };
  const episodeAt = (number: number) => EPISODE_CATALOG.find((e) => e.id === collected[number]);
  const numbers = Object.keys(collected).map(Number);
  const collectedCount = numbers.length;
  // 본 회차까지 + 다음 회차 한 칸을 잠긴 카드로 보여주고, 펼친 면이 꽉 차도록 빈칸도 잠긴 카드로 채움
  const cardsPerSpread = CARDS_PER_PAGE * pagesPerSpread;
  const spreadCount = Math.ceil((Math.max(...numbers) + 2) / cardsPerSpread);
  const currentSpread = Math.min(spread, spreadCount - 1);
  const pages = Array.from({ length: pagesPerSpread }, (_, i) => currentSpread * pagesPerSpread + i);

  return (
    <div
      className="collection"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 16, 40, 0.6), rgba(20, 16, 40, 0.6)), url(${backgroundImg})`,
      }}
    >
      <button className="wardrobe__back" onClick={onClose}>
        <Glyph grid={glyphs.prev} />
        BACK
      </button>

      <header className="collection__ribbon">
        <h2>EPISODE COLLECTION</h2>
        <span className="collection__count">
          {collectedCount}개 수집
        </span>
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
            const cardNumbers = Array.from({ length: CARDS_PER_PAGE }, (_, i) => page * CARDS_PER_PAGE + i);
            const sideClass = pagesPerSpread === 1 ? '' : side === 0 ? ' book__page--left' : ' book__page--right';
            return (
              <section key={page} className={`book__page${sideClass}`} aria-label={`${page + 1}쪽`}>
                <ul className="book__grid">
                  {cardNumbers.map((number) => (
                    <EpisodeCard key={number} episode={episodeAt(number)} number={number} />
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
