import { useEffect, useState } from 'react';
import backgroundImg from '../img/background/main_background.jpg';
import Backdrop from '../components/Backdrop';
import EpisodeReplay from '../components/EpisodeReplay';
import { HeartMark } from '../components/Icon';
import IllustView from '../components/IllustView';
import LoadingScreen from '../components/LoadingScreen';
import { usePreload } from '../utils/preload';
import { EpisodeArt } from './CollectionPage';
import { Glyph, glyphs } from './WardrobePage';
import { DATE_EPISODES, HEROINES, SPEAKERS, type Episode, type Heroine } from '../utils/episode';
import { formatWeekLabel } from '../utils/gameDate';
import { getCollectedNumber, isCollected, loadSeenDates } from '../utils/storage';

interface Props {
  onClose: () => void;
}

// 프로필 동그라미에 얼굴이 오도록 캐릭터 그림에서 얼굴 중심 위치 (그림 너비·높이 대비 비율)
// size: 동그라미 대비 그림 너비 (%, 클수록 얼굴이 크게 보임, 없으면 230)
const FACES: Record<Heroine, { x: number; y: number; size?: number }> = {
  minji: { x: 0.5, y: 0.23, size: 180 },
  siyeong: { x: 0.5, y: 0.2 },
  emily: { x: 0.47, y: 0.19 },
};

const TOTAL_DATES = HEROINES.reduce((sum, h) => sum + DATE_EPISODES[h].length, 0);

// 데이트 기록: 데이트는 매달 15일 이벤트로만 진행하고, 여기서는 히로인별로 본 데이트를 다시 봄
// 본 데이트 카드는 일러스트로 바뀌고, 그림을 누르면 일러스트를 크게 보고(일러스트가 없으면 바로) 다시 보기 버튼은 바로 재생
export default function DatePage({ onClose }: Props) {
  const [viewing, setViewing] = useState<{ illust: string; title: string; label: string; episode: Episode } | null>(null);
  const [replaying, setReplaying] = useState<Episode | null>(null);
  const seen = loadSeenDates();
  const allDates = HEROINES.flatMap((h) => DATE_EPISODES[h]);
  // 본 데이트 카드에 보일 일러스트를 다 불러온 뒤에 보여줌
  const { done: illustsReady, progress } = usePreload(allDates.flatMap((episode) => (isCollected(episode.id) && episode.illust) || []));
  const doneCount = allDates.filter((episode) => isCollected(episode.id)).length;

  useEffect(() => {
    // 다시 보기 중에는 ESC가 에피소드 스킵이므로 기록 화면이 같이 닫히지 않게 함
    if (replaying || viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, replaying, viewing]);

  if (!illustsReady) return <LoadingScreen progress={progress} />;

  const renderCard = (partner: Heroine, episode: Episode, order: number) => {
    const no = `데이트 ${order}`;
    const label = `${SPEAKERS[partner].name} · ${no}`;

    // 아직 안 본 데이트는 제목도 가림
    if (!isCollected(episode.id)) {
      return (
        <li key={episode.id} className="date-card date-card--locked" aria-label={`${label} (아직 열리지 않은 데이트)`}>
          <div className="date-card__frame">
            <span className="date-card__no">{no}</span>
            <span className="date-card__lock" aria-hidden>
              <svg viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <strong className="date-card__lock-title">아직 열리지 않은 데이트예요</strong>
            <span className="date-card__lock-sub">매달 2주차에 데이트가 진행돼요</span>
          </div>
          <div className="date-card__info">
            <span className="date-card__title">???</span>
          </div>
        </li>
      );
    }

    const illust = episode.illust;
    const seenDate = seen[getCollectedNumber(episode.id) ?? ''];
    return (
      <li key={episode.id} className="date-card">
        <div className="date-card__frame">
          <button
            className="date-card__art"
            onClick={() => (illust ? setViewing({ illust, title: episode.title, label, episode }) : setReplaying(episode))}
            aria-label={`${label} ${episode.title} (${illust ? '일러스트 보기' : '다시 보기'})`}
          >
            <EpisodeArt episode={episode} showIllust />
          </button>
          <span className="date-card__no">{no}</span>
          <button className="date-card__replay" onClick={() => setReplaying(episode)} aria-label={`${label} ${episode.title} 다시 보기`}>
            <svg viewBox="0 0 12 12" aria-hidden>
              <path d="M3 2v8l7-4z" />
            </svg>
            다시 보기
          </button>
        </div>
        <div className="date-card__info">
          <span className="date-card__title">{episode.title}</span>
          <span className="date-card__when">{seenDate ? formatWeekLabel(seenDate) : ''}</span>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="dates">
        <Backdrop src={backgroundImg} tint />
        <header className="page-top">
          <button className="page-top__back" onClick={onClose} aria-label="뒤로">
            <Glyph grid={glyphs.prev} />
          </button>
          <h2 className="page-top__ribbon">
            <HeartMark />
            데이트 기록
          </h2>
        </header>

        <section className="dates__panel">
          <div className="dates__head">
            <h3>
              <HeartMark />
              Date Episodes
            </h3>
            <span className="dates__count">
              열린 데이트 <b>{`${doneCount} / ${TOTAL_DATES}`}</b>
            </span>
          </div>

          <div className="dates__rows">
            {HEROINES.map((partner) => {
              const episodes = DATE_EPISODES[partner];
              const seenCount = episodes.filter((e) => isCollected(e.id)).length;
              const face = FACES[partner];
              return (
                <div key={partner} className="dates__row">
                  <div className="dates__profile">
                    <span className="dates__avatar">
                      <img
                        src={SPEAKERS[partner].image}
                        alt=""
                        style={{ width: `${face.size ?? 230}%`, transform: `translate(${-face.x * 100}%, ${-face.y * 100}%)` }}
                      />
                    </span>
                    <strong className="dates__name">{SPEAKERS[partner].name}</strong>
                    <span className="dates__progress">
                      <HeartMark />
                      {`${seenCount} / ${episodes.length}`}
                    </span>
                  </div>
                  <ul className="dates__cards">{episodes.map((episode, i) => renderCard(partner, episode, i + 1))}</ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
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
