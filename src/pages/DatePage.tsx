import { useState } from 'react';
import BookView from '../components/BookView';
import EpisodeReplay from '../components/EpisodeReplay';
import IllustView from '../components/IllustView';
import { EpisodeArt } from './CollectionPage';
import { DATE_COST, DATE_EPISODES, DATE_UNLOCKS, HEROINES, SPEAKERS, type Affection, type Episode, type Heroine } from '../utils/episode';
import { isCollected } from '../utils/storage';

interface Props {
  affection: Affection;
  coins: number;
  onSelect: (partner: Heroine, episode: Episode) => void;
  onClose: () => void;
}

// 히로인 순서대로 데이트 에피소드를 나열 (히로인별 1번째, 2번째 …)
const DATES = HEROINES.flatMap((partner) =>
  DATE_EPISODES[partner].map((episode, i) => ({
    partner,
    episode,
    order: i + 1,
    need: DATE_UNLOCKS[Math.min(i, DATE_UNLOCKS.length - 1)],
  })),
);

// 데이트 선택: 에피소드 컬렉션처럼 책에 카드로 보여줌. 호감도를 채우면 해금, 본 데이트는 완료 표시
// 본 데이트 카드는 일러스트로 바뀌고, 누르면 일러스트를 크게 다시 봄
export default function DatePage({ affection, coins, onSelect, onClose }: Props) {
  const affordable = coins >= DATE_COST;
  const [viewing, setViewing] = useState<{ illust: string; title: string; label: string; episode: Episode } | null>(null);
  const [replaying, setReplaying] = useState<Episode | null>(null);

  const renderCard = (index: number) => {
    const date = DATES[index];
    if (!date) return <li className="ep-card ep-card--empty" aria-hidden />;
    const { partner, episode, order, need } = date;
    const label = `${SPEAKERS[partner].name} · 데이트 ${order}`;

    if (affection[partner] < need && !isCollected(episode.id)) {
      return (
        <li className="ep-card ep-card--locked" aria-label={`${label} 잠김 (호감도 ${need} 필요)`}>
          <div className="ep-card__frame ep-card__frame--lock">
            <span className="ep-card__question" aria-hidden>🔒</span>
            <span className="ep-card__need">♥ {need}</span>
          </div>
          <span className="ep-card__no">{label}</span>
          <span className="ep-card__title">???</span>
        </li>
      );
    }

    const done = isCollected(episode.id);
    const playable = !done && affordable;
    const illust = done ? episode.illust : undefined;
    return (
      <li className={illust ? 'ep-card ep-card--illust' : done ? 'ep-card ep-card--done' : playable ? 'ep-card ep-card--open' : 'ep-card ep-card--poor'}>
        <button
          className="ep-card__button"
          disabled={!playable && !illust}
          onClick={() => (illust ? setViewing({ illust, title: episode.title, label, episode }) : onSelect(partner, episode))}
          aria-label={`${label} ${episode.title}${illust ? ' (일러스트 보기)' : done ? ' (완료)' : !affordable ? ' (자금 부족)' : ''}`}
        >
          <div className="ep-card__frame">
            <EpisodeArt episode={episode} showIllust={done} />
            <span className="ep-card__stamp">{done ? '✔ 완료' : affordable ? '💗 GO' : '자금 부족'}</span>
          </div>
          <span className="ep-card__no">{label}</span>
          <span className="ep-card__title">{episode.title}</span>
        </button>
      </li>
    );
  };

  return (
    <>
      <BookView
        title="DATE"
        badge={`1회 ${DATE_COST.toLocaleString()}원`}
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
