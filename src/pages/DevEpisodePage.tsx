import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import Box from '../components/Box';
import EpisodeScene from '../components/EpisodeScene';
import IllustView from '../components/IllustView';
import { INITIAL_STATS, STAT_LABELS, type Stats } from '../components/StatsBox';
import { DATE_EPISODES, HEROINES, MAIN_EPISODE_LIST, SPEAKERS, getDateLabel, type Affection, type Episode } from '../utils/episode';

interface Props {
  gameDate: string;
  onClose: () => void;
}

interface Playing {
  label: string;
  episode: Episode;
  isDate: boolean;
}

// 테스트로 본 에피소드에서 바뀐 호감도 (게임 진행에는 반영하지 않고 보여주기만 함)
interface TestResult {
  title: string;
  affection: Partial<Affection>;
}

// 테스트에서 호감도 조건(11월 데이트 초대 등)을 보려고 쓰는 호감도
const DEV_AFFECTION: Affection = { minji: 100, siyeong: 100, emily: 100 };
const NO_AFFECTION: Affection = { minji: 0, siyeong: 0, emily: 0 };

// 테스트에서 바꿔 볼 수 있는 스탯 (위험도 계산에 쓰는 위장도·정신력)
const RISK_STATS = ['disguise', 'mental'] as const;

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// 개발자 모드: 메인 에피소드·히로인별 데이트를 골라 바로 봄
// 컬렉션·호감도·스탯·데이트 진행 순서는 바뀌지 않음
export default function DevEpisodePage({ gameDate, onClose }: Props) {
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [illust, setIllust] = useState<Episode | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  // 끄면 호감도 0으로 테스트 (11월에 아무도 초대하지 않는 장면 확인용)
  const [highAffection, setHighAffection] = useState(true);
  const devAffection = highAffection ? DEV_AFFECTION : NO_AFFECTION;
  // 위험도 테스트용 스탯 (위장도: 위험 상승량 감소, 정신력: 흥분 위험 회피). 나머지는 기본값
  const [devStats, setDevStats] = useState<Stats>(INITIAL_STATS);
  const setStat = (key: (typeof RISK_STATS)[number], value: number) =>
    setDevStats((prev) => ({ ...prev, [key]: Math.min(100, Math.max(0, Math.round(value) || 0)) }));

  useEffect(() => {
    if (playing || illust) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playing, illust, onClose]);

  const finish = (affection: Partial<Affection>) => {
    if (!playing) return;
    setResult({ title: playing.episode.title, affection });
    // 실제 데이트처럼 끝나면 일러스트 공개
    if (playing.isDate && playing.episode.illust) setIllust(playing.episode);
    setPlaying(null);
  };

  const closeScene = useCallback(() => setPlaying(null), []);

  const changes = result && HEROINES.filter((h) => result.affection[h]).map((h) => `${SPEAKERS[h].name} ${signed(result.affection[h]!)}`);

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
              <label className="dev-episodes__hint">
                <input type="checkbox" checked={highAffection} onChange={(e) => setHighAffection(e.target.checked)} /> 호감도 100으로
                테스트 (끄면 0, 11월 데이트 초대 조건 확인용)
              </label>
              <div className="dev-episodes__stats">
                <span className="dev-episodes__stats-title">위험도 테스트 스탯</span>
                {RISK_STATS.map((key) => (
                  <label key={key} className="dev-episodes__stat">
                    <span className="dev-episodes__stat-label">{STAT_LABELS[key]}</span>
                    <input
                      className="settings__slider"
                      type="range"
                      min={0}
                      max={100}
                      value={devStats[key]}
                      style={{ '--fill': `${devStats[key]}%` } as CSSProperties}
                      onChange={(e) => setStat(key, Number(e.target.value))}
                    />
                    <span className="dev-episodes__stat-value">{devStats[key]}</span>
                  </label>
                ))}
              </div>
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
          affection={devAffection}
          stats={devStats}
          onDone={finish}
          // 위험도 100이면 배드엔딩·발각 연출까지 보고 목록으로 (실제 게임오버는 없음)
          onExposed={closeScene}
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
