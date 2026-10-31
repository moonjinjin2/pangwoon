import roomImg from '../img/room.jpg';
import barImg from '../img/bar_background.jpg';
import { useState } from 'react';
import BookView from '../components/BookView';
import IllustView from '../components/IllustView';
import { EPISODE_CATALOG, PROLOGUE, SPEAKERS, getDateLabel, getMainSpeaker, type Episode } from '../utils/episode';
import { PROGRESS_KEYS, useStoredState, type Collection } from '../utils/storage';

// 일러스트가 없는 에피소드는 배경 + 대표 캐릭터로 대신 그림 (showIllust가 false면 아직 공개 전이라 일러스트를 가림)
export function EpisodeArt({ episode, showIllust = true }: { episode: Episode; showIllust?: boolean }) {
  if (showIllust && episode.illust) return <img className="ep-card__illust" src={episode.illust} alt="" />;
  const isPrologue = episode.id === PROLOGUE.id;
  return (
    <div
      className={isPrologue ? 'ep-card__art ep-card__art--night' : 'ep-card__art'}
      style={{ backgroundImage: `url(${isPrologue ? barImg : episode.background ?? roomImg})` }}
    >
      <img className="ep-card__char" src={SPEAKERS[getMainSpeaker(episode)].image} alt="" />
    </div>
  );
}

// 에피소드 장면 제목(에피소드 #n)과 같은 번호를 씀
// 일러스트가 있는 카드는 눌러서 크게 볼 수 있음
function EpisodeCard({ episode, number, onView }: { episode?: Episode; number: number; onView: (episode: Episode) => void }) {
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
  const content = (
    <>
      <div className="ep-card__frame">
        <EpisodeArt episode={episode} />
        {episode.icon && <span className="ep-card__icon" aria-hidden>{episode.icon}</span>}
      </div>
      <span className="ep-card__no">{no}</span>
      <span className="ep-card__title">{episode.title}</span>
    </>
  );
  if (!episode.illust) return <li className="ep-card">{content}</li>;
  return (
    <li className="ep-card ep-card--illust">
      <button className="ep-card__button" onClick={() => onView(episode)} aria-label={`${no} ${episode.title} 일러스트 보기`}>
        {content}
      </button>
    </li>
  );
}

interface Props {
  onClose: () => void;
}

export default function CollectionPage({ onClose }: Props) {
  const [stored] = useStoredState<Collection>(PROGRESS_KEYS.collection, {});
  const [viewing, setViewing] = useState<Episode | null>(null);

  // 메인 화면은 프롤로그를 본 뒤에만 오므로 #0 프롤로그는 항상 수집된 것으로 봄
  const collected: Collection = { 0: PROLOGUE.id, ...stored };
  const episodeAt = (number: number) => EPISODE_CATALOG.find((e) => e.id === collected[number]);
  const numbers = Object.keys(collected).map(Number);

  // 본 회차까지 + 다음 회차 한 칸을 잠긴 카드로 보여주고, 펼친 면이 꽉 차도록 빈칸도 잠긴 카드로 채움
  return (
    <>
      <BookView
        title="EPISODE COLLECTION"
        badge={`${numbers.length}개 수집`}
        cardCount={Math.max(...numbers) + 2}
        renderCard={(number) => <EpisodeCard episode={episodeAt(number)} number={number} onView={setViewing} />}
        onClose={onClose}
      />
      {viewing?.illust && (
        <IllustView
          mode="view"
          illust={viewing.illust}
          title={viewing.title}
          caption={getDateLabel(viewing)}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
