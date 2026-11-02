import roomImg from '../img/background/main_background.jpg';
import barImg from '../img/background/bar_background.jpg';
import backgroundImg from '../img/background/main_background.jpg';
import { useEffect, useState } from 'react';
import Box from '../components/Box';
import EpisodeReplay from '../components/EpisodeReplay';
import Icon, { HeartMark } from '../components/Icon';
import IllustView from '../components/IllustView';
import LoadingScreen from '../components/LoadingScreen';
import { Glyph, glyphs } from './WardrobePage';
import { usePreload } from '../utils/preload';
import {
  DATE_EPISODES,
  EPISODE_CATALOG,
  HEROINES,
  PROLOGUE,
  PROLOGUE_DATE,
  SPEAKERS,
  getMainSpeaker,
  getReplayLines,
  type Episode,
} from '../utils/episode';
import { NAME_KEY, PROGRESS_KEYS, load, loadChoices, loadSeenDates, useStoredState, type Collection } from '../utils/storage';

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

// 앨범에 보일 본 에피소드 한 편 (회차 번호 #n은 에피소드 장면 제목과 같은 번호)
interface Entry {
  number: number;
  episode: Episode;
  // 본 달 (목록을 달별로 묶음)
  month: number;
}

// 데이트는 데이트 기록에서 따로 보므로 앨범에서는 뺌
const DATE_IDS = new Set(HEROINES.flatMap((h) => DATE_EPISODES[h].map((e) => e.id)));

// 본 달 (본 날짜를 기록하기 전에 본 에피소드는 프롤로그·달 에피소드('month-5')만 짐작하고, 모르면 undefined)
function seenMonthOf(number: number, episode: Episode, seen: Record<string, string>) {
  if (seen[number]) return Number(seen[number].split('-')[1]);
  if (episode.id === PROLOGUE.id) return Number(PROLOGUE_DATE.split('-')[1]);
  return Number(episode.id.match(/^month-(\d+)$/)?.[1]) || undefined;
}

// 목록(최근 것부터)에서 i번째와 가장 가까운, 달을 아는 회차의 달 (다음 회차 → 이전 회차 순으로 찾음)
function nearestMonth(list: { month?: number }[], i: number) {
  for (let j = i - 1; j >= 0; j--) if (list[j].month) return list[j].month!;
  for (let j = i + 1; j < list.length; j++) if (list[j].month) return list[j].month!;
  return Number(PROLOGUE_DATE.split('-')[1]);
}

// 에피소드 대사를 다시 보기처럼 그때 고른 선택지대로 이어 붙여 보여줌
function EpisodeLog({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  const playerName = load(NAME_KEY) ?? '';
  const nameOf = (speaker: keyof typeof SPEAKERS) => (speaker === 'player' ? playerName : SPEAKERS[speaker].name);
  const lines = getReplayLines(episode.lines, loadChoices(episode.id) ?? []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="vn-log" role="dialog" aria-modal aria-label="대사 로그" onClick={(e) => e.stopPropagation()}>
        <Box title={`대사 로그 · ${episode.title}`} onClose={onClose}>
          <ol className="vn-log__list">
            {lines.map((l, i) => (
              <li key={i} className="vn-log__item">
                {(l.speaker || l.name) && <span className="vn-log__name">{l.speaker ? nameOf(l.speaker) : l.name}</span>}
                <p className={l.speaker || l.name ? 'vn-log__text' : 'vn-log__text vn-log__text--narration'}>
                  {l.effect === 'system-error' && '[SYSTEM ERROR] '}
                  {l.text.split('{name}').join(playerName)}
                </p>
              </li>
            ))}
          </ol>
        </Box>
      </div>
    </div>
  );
}

interface Props {
  onClose: () => void;
}

// 에피소드 앨범: 왼쪽은 본 에피소드 목록(최근 것부터, 달별), 오른쪽은 고른 에피소드를 크게 보여주고 대사 로그·다시 보기
export default function CollectionPage({ onClose }: Props) {
  const [stored] = useStoredState<Collection>(PROGRESS_KEYS.collection, {});
  const [selected, setSelected] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Entry | null>(null);
  const [logEpisode, setLogEpisode] = useState<Episode | null>(null);
  const [replaying, setReplaying] = useState<Episode | null>(null);

  // 메인 화면은 프롤로그를 본 뒤에만 오므로 #0 프롤로그는 항상 수집된 것으로 봄
  const collected: Collection = { 0: PROLOGUE.id, ...stored };
  const seen = loadSeenDates();
  const entries: Entry[] = Object.entries(collected)
    .map(([key, id]) => ({ number: Number(key), episode: EPISODE_CATALOG.find((e) => e.id === id) }))
    .filter((e): e is { number: number; episode: Episode } => !!e.episode && !DATE_IDS.has(e.episode.id))
    .sort((a, b) => b.number - a.number)
    .map(({ number, episode }) => ({ number, episode, month: seenMonthOf(number, episode, seen) }))
    // 본 날짜 기록이 없으면 가까운 회차의 달로 봄
    .map((entry, i, list) => ({ ...entry, month: entry.month ?? nearestMonth(list, i) }));

  const current = entries.find((e) => e.number === selected) ?? entries[0];

  useEffect(() => {
    // 다시 보기 중에는 ESC가 에피소드 스킵이므로, 창이 떠 있을 때는 앨범이 같이 닫히지 않게 함
    if (replaying || viewing || logEpisode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, replaying, viewing, logEpisode]);

  // 목록 썸네일·미리보기에 쓸 데이트 일러스트를 다 불러온 뒤에 보여줌
  const { done, progress } = usePreload(entries.flatMap((e) => e.episode.illust ?? []));
  if (!done) return <LoadingScreen progress={progress} />;

  // 같은 달끼리 묶음 (최근 것부터 정렬돼 있으므로 순서대로 이어 붙이면 됨)
  const groups: { month: number; items: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.month === entry.month) last.items.push(entry);
    else groups.push({ month: entry.month, items: [entry] });
  }

  return (
    <>
      <div
        className="album"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 240, 246, 0.6), rgba(255, 240, 246, 0.6)), url(${backgroundImg})`,
        }}
      >
        <header className="page-top">
          <button className="page-top__back" onClick={onClose} aria-label="뒤로">
            <Glyph grid={glyphs.prev} />
          </button>
          <h2 className="page-top__ribbon">
            <Icon name="book" className="page-top__icon" />
            에피소드 앨범
          </h2>
        </header>

        <div className="album__body">
          <section className="album__list">
            <div className="album__head">
              <h3>
                <HeartMark />
                Episodes
              </h3>
              <span className="album__count">진행한 에피소드 {entries.length}개</span>
            </div>


            <div className="album__scroll">
              {groups.map(({ month, items }, i) => (
                <div key={`${month}-${i}`} className="album__group">
                  <span className="album__month">{month}월</span>
                  <ul className="album__items">
                    {items.map((entry) => (
                      <li key={entry.number}>
                        <button
                          className={entry === current ? 'album__item album__item--on' : 'album__item'}
                          onClick={() => setSelected(entry.number)}
                        >
                          <span className="album__thumb">
                            <EpisodeArt episode={entry.episode} />
                          </span>
                          <span className="album__meta">
                            <span className="album__no">
                              EPISODE #{entry.number}
                            </span>
                            <span className="album__title">{entry.episode.title}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="album__preview">
            {current && (
              <div className="album__stage">
                {/* 일러스트가 있으면 눌러서 크게 봄 (다시 보기는 버튼으로만) */}
                {current.episode.illust ? (
                  <button className="album__art" onClick={() => setViewing(current)} aria-label="일러스트 크게 보기">
                    <EpisodeArt episode={current.episode} />
                  </button>
                ) : (
                  <div className="album__art album__art--still">
                    <EpisodeArt episode={current.episode} />
                  </div>
                )}
                <span className="album__badge">EPISODE #{current.number}</span>
                <div className="album__caption">
                  <div className="album__info">
                    <h3 className="album__heading">{current.episode.title}</h3>
                  </div>
                  <div className="album__actions">
                    <button className="album__btn" onClick={() => setLogEpisode(current.episode)}>
                      <svg viewBox="0 0 12 12" aria-hidden>
                        <path d="M2 3h8M2 6h8M2 9h5" />
                      </svg>
                      대사 로그
                    </button>
                    <button className="album__btn album__btn--main" onClick={() => setReplaying(current.episode)}>
                      <svg viewBox="0 0 12 12" aria-hidden>
                        <path d="M3 2v8l7-4z" />
                      </svg>
                      다시 보기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      {viewing?.episode.illust && (
        <IllustView
          mode="view"
          illust={viewing.episode.illust}
          title={viewing.episode.title}
          caption={`EPISODE #${viewing.number}`}
          onReplay={() => {
            setReplaying(viewing.episode);
            setViewing(null);
          }}
          onClose={() => setViewing(null)}
        />
      )}
      {logEpisode && <EpisodeLog episode={logEpisode} onClose={() => setLogEpisode(null)} />}
      {replaying && <EpisodeReplay episode={replaying} onClose={() => setReplaying(null)} />}
    </>
  );
}
