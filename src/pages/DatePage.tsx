import { useState } from 'react';
import BookView from '../components/BookView';
import EpisodeReplay from '../components/EpisodeReplay';
import IllustView from '../components/IllustView';
import LoadingScreen from '../components/LoadingScreen';
import { usePreload } from '../utils/preload';
import { EpisodeArt } from './CollectionPage';
import { DATE_EPISODES, HEROINES, SPEAKERS, type Episode } from '../utils/episode';
import { isCollected } from '../utils/storage';

interface Props {
  onClose: () => void;
}

// 히로인 순서대로 데이트 에피소드를 나열 (히로인별 1번째, 2번째 …)
const DATES = HEROINES.flatMap((partner) =>
  DATE_EPISODES[partner].map((episode, i) => ({ partner, episode, order: i + 1 })),
);

// 데이트 앨범: 데이트는 매달 15일 이벤트로만 진행하고, 여기서는 본 데이트를 다시 봄
// 본 데이트 카드는 일러스트로 바뀌고, 누르면 일러스트를 크게 보거나(일러스트가 없으면 바로) 다시 보기
export default function DatePage({ onClose }: Props) {
  const [viewing, setViewing] = useState<{ illust: string; title: string; label: string; episode: Episode } | null>(null);
  const [replaying, setReplaying] = useState<Episode | null>(null);
  // 본 데이트 카드에 보일 일러스트를 다 불러온 뒤에 책을 펼침
  const { done: illustsReady, progress } = usePreload(DATES.flatMap(({ episode }) => (isCollected(episode.id) && episode.illust) || []));
  const doneCount = DATES.filter(({ episode }) => isCollected(episode.id)).length;

  const renderCard = (index: number) => {
    const date = DATES[index];
    if (!date) return <li className="ep-card ep-card--empty" aria-hidden />;
    const { partner, episode, order } = date;
    const label = `${SPEAKERS[partner].name} · 데이트 ${order}`;

    // 아직 안 본 데이트는 제목도 가림
    if (!isCollected(episode.id)) {
      return (
        <li className="ep-card ep-card--locked" aria-label={`${label} (아직 안 본 데이트)`}>
          <div className="ep-card__frame ep-card__frame--lock">
            <span className="ep-card__question" aria-hidden>🔒</span>
          </div>
          <span className="ep-card__no">{label}</span>
          <span className="ep-card__title">???</span>
        </li>
      );
    }

    const illust = episode.illust;
    return (
      <li className={illust ? 'ep-card ep-card--illust' : 'ep-card ep-card--done'}>
        <button
          className="ep-card__button"
          onClick={() => (illust ? setViewing({ illust, title: episode.title, label, episode }) : setReplaying(episode))}
          aria-label={`${label} ${episode.title} (${illust ? '일러스트 보기' : '다시 보기'})`}
        >
          <div className="ep-card__frame">
            <EpisodeArt episode={episode} showIllust />
            <span className="ep-card__stamp">✔ 완료</span>
          </div>
          <span className="ep-card__no">{label}</span>
          <span className="ep-card__title">{episode.title}</span>
        </button>
      </li>
    );
  };

  if (!illustsReady) return <LoadingScreen progress={progress} />;

  return (
    <>
      <BookView
        title="DATE"
        badge={`${doneCount} / ${DATES.length}`}
        cardCount={DATES.length}
        renderCard={renderCard}
        // 다시 보기 중에는 ESC가 에피소드 스킵이므로 책이 같이 닫히지 않게 함
        onClose={replaying ? () => {} : onClose}
      />
      {viewing && (
        <IllustView
          mode="view"
          illust={viewing.illust}
          title={viewing.title}
          caption={viewing.label}
          onReplay={() => {
            setReplaying(viewing.episode);
            setViewing(null);
          }}
          onClose={() => setViewing(null)}
        />
      )}
      {replaying && <EpisodeReplay episode={replaying} onClose={() => setReplaying(null)} />}
    </>
  );
}
