import roomImg from '../img/background/room.png';
import schoolImg from '../img/background/school.jpg';
import backgroundImg from '../img/background/room.png';
import Backdrop from '../components/Backdrop';
import { useEffect, useState } from 'react';
import Box from '../components/Box';
import EpisodeReplay from '../components/EpisodeReplay';
import Icon, { HeartMark } from '../components/Icon';
import IllustView from '../components/IllustView';
import { Glyph, glyphs } from '../components/DecoFrame';
import {
  EPISODE_CATALOG,
  PROLOGUE,
  PROLOGUE_DATE,
  READY_BACKGROUNDS,
  PLAYER_NAME,
  SPEAKERS,
  MAIN_EPISODE_MONTHS,
  getEpisodeCgs,
  getMainEpisode,
  getMainSpeaker,
  getReplayLines,
  type Episode,
} from '../utils/episode';
import { PROGRESS_KEYS, loadChoices, loadEpisodeAffection, loadSeenDates, useStoredState, type Collection } from '../utils/storage';

// 에피소드의 대표 배경: 지정된 에피소드 배경, 없으면 대사가 가장 많이 나오는 배경
// 에피소드 장면처럼 아직 준비 안 된 배경은 school.jpg로 (프롤로그는 방에서 진행)
function episodeBackground(episode: Episode) {
  if (episode.id === PROLOGUE.id) return roomImg;
  let picked = episode.background;
  if (!picked) {
    const counts = new Map<string, number>();
    let current: string | undefined;
    for (const line of episode.lines) {
      current = line.background ?? current;
      if (current) counts.set(current, (counts.get(current) ?? 0) + 1);
    }
    picked = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
  }
  return picked && READY_BACKGROUNDS.has(picked) ? picked : schoolImg;
}

// 일러스트가 없는 에피소드는 대표 배경 + 대표 캐릭터(이번 에피소드에서 호감도가 가장 많이 오른 히로인)로 대신 그림 (showIllust가 false면 아직 공개 전이라 일러스트를 가림)
export function EpisodeArt({ episode, showIllust = true }: { episode: Episode; showIllust?: boolean }) {
  if (showIllust && episode.illust) return <img className="ep-card__illust" src={episode.illust} alt="" />;
  const isPrologue = episode.id === PROLOGUE.id;
  return (
    <div className={isPrologue ? 'ep-card__art ep-card__art--night' : 'ep-card__art'}>
      <Backdrop src={episodeBackground(episode)} />
      <img className="ep-card__char" src={SPEAKERS[getMainSpeaker(episode, loadChoices(episode.id), loadEpisodeAffection(episode.id))].image} alt="" />
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
  const nameOf = (speaker: keyof typeof SPEAKERS) => SPEAKERS[speaker].name;
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
                  {l.text.split('{name}').join(PLAYER_NAME)}
                </p>
              </li>
            ))}
          </ol>
        </Box>
      </div>
    </div>
  );
}

// 메인 에피소드마다 들어갈 CG 수 (대본이 아직 없는 달도 이만큼 잠긴 칸으로 자리를 잡아 둠)
const CGS_PER_EPISODE = 3;

function LockedCg() {
  return (
    <span className="cg-grid__item cg-grid__item--locked" aria-label="아직 보지 않은 일러스트">
      <span className="cg-grid__lock" aria-hidden>
        <svg viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </span>
      <span className="cg-grid__lock-text">LOCKED</span>
    </span>
  );
}

// CG 모아보기: 메인 에피소드(달)별로 묶어 보여주고, 아직 안 본 에피소드의 CG는 잠가 둠 
function CgGallery({ collectedIds, onView }: { collectedIds: Set<string>; onView: (cg: string, episode: Episode) => void }) {
  const groups = MAIN_EPISODE_MONTHS.map((month) => {
    const episode = getMainEpisode(month);
    const cgs = episode ? getEpisodeCgs(episode) : [];
    const open = !!episode && collectedIds.has(episode.id);
    return { month, episode, cgs: open ? cgs : [], slots: Math.max(cgs.length, CGS_PER_EPISODE) };
  });
  const total = groups.reduce((sum, g) => sum + g.slots, 0);
  const unlocked = groups.reduce((sum, g) => sum + g.cgs.length, 0);

  return (
    <section className="album__list album__gallery">
      <div className="album__head">
        <h3>
          <HeartMark />
          Illustrations
        </h3>
        <span className="album__count">
          모은 일러스트 {unlocked} / {total}
        </span>
      </div>
      <div className="album__scroll">
        {groups.map(({ month, episode, cgs, slots }) => (
          <div key={month} className="album__group">
            <span className={cgs.length > 0 ? 'album__month' : 'album__month album__month--locked'}>
              {month}월 · {cgs.length > 0 && episode ? episode.title : '아직 보지 않은 에피소드'}
            </span>
            <ul className="cg-grid">
              {Array.from({ length: slots }, (_, i) => (
                <li key={i}>
                  {episode && cgs[i] ? (
                    <button className="cg-grid__item" onClick={() => onView(cgs[i], episode)} aria-label={`${episode.title} 일러스트 크게 보기`}>
                      <img src={cgs[i]} alt="" loading="lazy" />
                    </button>
                  ) : (
                    <LockedCg />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
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
  // 위쪽 탭: 에피소드 목록 / CG 모아보기
  const [tab, setTab] = useState<'episodes' | 'cg'>('episodes');
  const [viewingCg, setViewingCg] = useState<{ cg: string; episode: Episode } | null>(null);

  // 3월 프롤로그(#0)는 오프닝 영상으로 대신하므로 앨범에 보이지 않음 (저장 기록에는 남아 있어도 뺌)
  const collected: Collection = Object.fromEntries(Object.entries(stored).filter(([, id]) => id !== PROLOGUE.id));
  const seen = loadSeenDates();
  const entries: Entry[] = Object.entries(collected)
    .map(([key, id]) => ({ number: Number(key), episode: EPISODE_CATALOG.find((e) => e.id === id) }))
    .filter((e): e is { number: number; episode: Episode } => !!e.episode)
    .sort((a, b) => b.number - a.number)
    .map(({ number, episode }) => ({ number, episode, month: seenMonthOf(number, episode, seen) }))
    // 본 날짜 기록이 없으면 가까운 회차의 달로 봄
    .map((entry, i, list) => ({ ...entry, month: entry.month ?? nearestMonth(list, i) }));

  const current = entries.find((e) => e.number === selected) ?? entries[0];
  // 본 에피소드 (데이트 포함)
  const collectedIds = new Set(Object.values(collected));

  useEffect(() => {
    // 다시 보기 중에는 ESC가 에피소드 스킵이므로, 창이 떠 있을 때는 앨범이 같이 닫히지 않게 함
    if (replaying || viewing || logEpisode || viewingCg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, replaying, viewing, logEpisode, viewingCg]);

  // 같은 달끼리 묶음 (최근 것부터 정렬돼 있으므로 순서대로 이어 붙이면 됨)
  const groups: { month: number; items: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.month === entry.month) last.items.push(entry);
    else groups.push({ month: entry.month, items: [entry] });
  }

  return (
    <>
      <div className="album">
        <Backdrop src={backgroundImg} tint />
        <header className="page-top">
          <button className="page-top__back" onClick={onClose} aria-label="뒤로">
            <Glyph grid={glyphs.prev} />
          </button>
          <h2 className="page-top__ribbon">
            <Icon name="book" className="page-top__icon" />
            에피소드 앨범
          </h2>
          <div className="album__tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'episodes'} className={tab === 'episodes' ? 'album__tab album__tab--on' : 'album__tab'} onClick={() => setTab('episodes')}>
              에피소드
            </button>
            <button role="tab" aria-selected={tab === 'cg'} className={tab === 'cg' ? 'album__tab album__tab--on' : 'album__tab'} onClick={() => setTab('cg')}>
              일러스트
            </button>
          </div>
        </header>

        {tab === 'cg' ? (
          <div className="album__body album__body--single">
            <CgGallery collectedIds={collectedIds} onView={(cg, episode) => setViewingCg({ cg, episode })} />
          </div>
        ) : (
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
        )}
      </div>
      {viewingCg && <IllustView mode="view" illust={viewingCg.cg} title={viewingCg.episode.title} onClose={() => setViewingCg(null)} />}
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
