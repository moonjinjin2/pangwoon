import { useEffect, useState } from 'react';
import Box from '../components/Box';
import EpisodeScene from '../components/EpisodeScene';
import IllustView from '../components/IllustView';
import type { Effect } from '../utils/activity';
import { STAT_LABELS, type StatKey } from '../components/StatsBox';
import { DATE_EPISODES, HEROINES, MAIN_EPISODE_LIST, SPEAKERS, getDateLabel, type Affection, type Episode } from '../utils/episode';

interface Props {
  name: string;
  gameDate: string;
  onClose: () => void;
}

interface Playing {
  label: string;
  episode: Episode;
  isDate: boolean;
}

// 테스트로 본 에피소드에서 바뀐 호감도·스탯 (게임 진행에는 반영하지 않고 보여주기만 함)
interface TestResult {
  title: string;
  affection: Partial<Affection>;
  stats?: Effect;
}

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// 개발자 모드: 메인 에피소드·히로인별 데이트를 골라 바로 봄
// 컬렉션·호감도·스탯·데이트 진행 순서는 바뀌지 않음
export default function DevEpisodePage({ name, gameDate, onClose }: Props) {
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [illust, setIllust] = useState<Episode | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (playing || illust) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playing, illust, onClose]);

  const finish = (affection: Partial<Affection>, stats?: Effect) => {
    if (!playing) return;
    setResult({ title: playing.episode.title, affection, stats });
    // 실제 데이트처럼 끝나면 일러스트 공개
    if (playing.isDate && playing.episode.illust) setIllust(playing.episode);
    setPlaying(null);
  };

  const changes = result && [
    ...HEROINES.filter((h) => result.affection[h]).map((h) => `${SPEAKERS[h].name} ${signed(result.affection[h]!)}`),
    ...Object.entries(result.stats ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k === 'coins' ? '자금' : STAT_LABELS[k as StatKey]} ${signed(v!)}`),
  ];

  return (
    <>
      {/* 에피소드 장면이 모달보다 아래에 깔리므로 보는 동안은 목록을 숨김 */}
      {!playing && !illust && (
        <div className="modal" onClick={onClose}>
          <div
            className="modal__dialog dev-episodes"
            role="dialog"
            aria-modal
            aria-label="에피소드 테스트"
            onClick={(e) => e.stopPropagation()}
          >
            <Box title="에피소드 테스트" onClose={onClose}>
              <p className="dev-episodes__hint">테스트로 본 에피소드는 컬렉션·호감도·스탯에 반영되지 않아요.</p>
              {result && (
                <p className="dev-episodes__result">
                  <strong>{result.title}</strong> 결과: {changes && changes.length > 0 ? changes.join(', ') : '변화 없음'}
                </p>
              )}
              <section className="dev-episodes__group">
                <h4 className="dev-episodes__heading">메인 에피소드</h4>
                <ul className="dev-episodes__list">
                  {MAIN_EPISODE_LIST.map(({ label, episode }) => (
                    <li key={episode.id}>
                      <button
                        className="dev-episodes__item"
                        onClick={() =>
                          setPlaying({
                            label: `테스트 · ${label} 에피소드`,
                            episode,
                            isDate: false,
                          })
                        }
                      >
                        <span className="dev-episodes__tag">{label}</span>
                        {episode.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              {HEROINES.map((heroine) => (
                <section key={heroine} className="dev-episodes__group">
                  <h4 className="dev-episodes__heading">{SPEAKERS[heroine].name} 데이트</h4>
                  <ul className="dev-episodes__list">
                    {DATE_EPISODES[heroine].map((episode, i) => (
                      <li key={episode.id}>
                        <button
                          className="dev-episodes__item"
                          onClick={() =>
                            setPlaying({
                              label: `테스트 · ${getDateLabel(episode) ?? SPEAKERS[heroine].name}`,
                              episode,
                              isDate: true,
                            })
                          }
                        >
                          <span className="dev-episodes__tag">{i + 1}</span>
                          {episode.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Box>
          </div>
        </div>
      )}
      {playing && (
        <EpisodeScene
          number={0}
          label={playing.label}
          episode={playing.isDate ? { icon: '💗', ...playing.episode } : playing.episode}
          date={gameDate}
          playerName={name}
          onDone={finish}
        />
      )}
      {illust?.illust && (
        <IllustView
          mode="reveal"
          illust={illust.illust}
          title={illust.title}
          caption={getDateLabel(illust)}
          onClose={() => setIllust(null)}
        />
      )}
    </>
  );
}
