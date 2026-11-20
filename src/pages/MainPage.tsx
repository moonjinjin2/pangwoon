import { useCallback, useEffect, useState } from 'react';
import backgroundImg from '../img/background/room.png';
import hayeongImg from '../img/character/hayeong/hayeong_main.png';
import MonthPlan, { type Activity } from '../components/MonthPlan';
import ActionBox from '../components/ActionBox';
import Backdrop from '../components/Backdrop';
import ActivityResult from '../components/ActivityResult';
import ActivityScene from '../components/ActivityScene';
import AffectionBox, { MAX_AFFECTION, REVEAL_PRICE } from '../components/AffectionBox';
import EpisodeScene from '../components/EpisodeScene';
import FundsAlert from '../components/FundsAlert';
import GuideTour from '../components/GuideTour';
import HeroinePick from '../components/HeroinePick';
import Icon from '../components/Icon';
import IllustView from '../components/IllustView';
import StatsBox, { DANGER_KINDS, INITIAL_STATS, clampStats, isDanger, isGameOver, type DangerKind, type EndingKind, type StatKey } from '../components/StatsBox';
import DangerWarning, { DangerAlert } from '../components/DangerWarning';
import BadEnding from '../components/BadEnding';
import SettingsModal from '../components/SettingsModal';
import TopMenu from '../components/TopMenu';
import WeekCard from '../components/WeekCard';
import TalkBox from '../components/ui/TalkBox';
import CollectionPage from './CollectionPage';
import DevEpisodePage from './DevEpisodePage';
import DatePage from './DatePage';
import ShopPage from './ShopPage';
import { MAIN_GUIDE } from '../utils/guide';
import { ACTIVITIES, getWeekCost, getWeekResult, rollDays, type Effect, type Grade } from '../utils/activity';
import type { Item } from '../utils/gacha';
import { HEROINES, SPEAKERS, getDateLabel, getEpisode, type Affection, type Episode, type Heroine } from '../utils/episode';
import { getDayEvent, getWeekIndex } from '../utils/gameDate';
import { getDateMinAffection, getMonthEvent, getMonthEventLabel, getNextDate } from '../utils/monthEvent';
import { DEFAULT_TEXT_SPEED, PROGRESS_KEYS, SETTINGS_KEYS, getNextEpisodeNumber, markCollected, saveChoices, useStoredState } from '../utils/storage';

interface Props {
  name: string;
  gameDate: string;
  // 설정의 게임 종료: 시작 화면으로
  onExit: () => void;
  // 엔딩 후 처음으로: 진행 상황을 지우고 시작 화면으로
  onGameOver: () => void;
  onProceed?: () => void;
}

const initialPlans: Activity[] = ['job', 'gym', 'meditate', 'tanning'];

// 시작 자금
const START_COINS = 0;

const initialAffection: Affection = { minji: 0, siyeong: 0, emily: 0 };

const initialDangerWarned: Record<DangerKind, boolean> = { health: false };

// 호감도는 비공개, 골드를 내야 볼 수 있음
const initialRevealed: Record<Heroine, boolean> = { minji: false, siyeong: false, emily: false };

export default function MainPage({ name, gameDate, onExit, onGameOver, onProceed }: Props) {
  // 진행 상황은 새로고침해도 유지되도록 저장
  const [storedPlans, setPlans] = useStoredState(PROGRESS_KEYS.plans, initialPlans);
  // 예전 저장에 지금은 없는 활동(공부·쉬기 등)이 남아 있으면 그 주는 기본 활동으로
  const plans = storedPlans.map((plan, i) => (plan in ACTIVITIES ? plan : initialPlans[i]));
  const [stats, setStats] = useStoredState(PROGRESS_KEYS.stats, INITIAL_STATS);
  const [coins, setCoins] = useStoredState(PROGRESS_KEYS.coins, START_COINS);
  // 에피소드 위험도가 100에 닿아 정체가 들킴 (배드 엔딩)
  const [exposed, setExposed] = useStoredState(PROGRESS_KEYS.exposed, false);
  // 이번 주 활동 비용이 모자라 진행하지 못할 때 띄우는 알림
  const [fundsAlert, setFundsAlert] = useState(false);
  const [affection, setAffection] = useStoredState(PROGRESS_KEYS.affection, initialAffection);
  const [revealed, setRevealed] = useStoredState(PROGRESS_KEYS.revealed, initialRevealed);
  const [playing, setPlaying] = useState(false);
  // 활동 움짤이 끝나면 메인 화면으로 돌아와 결과창 표시
  const [showResult, setShowResult] = useState(false);
  // 이번 주차 5일치 성공/실패 (진행하기 누를 때 정함)
  const [days, setDays] = useState<Grade[]>([]);
  const [shopOpen, setShopOpen] = useState(false);
  // 프롤로그 직후 첫 방문 가이드 (끝까지 보거나 건너뛰면 다시 안 뜸, 설정에서 다시 보기)
  const [guideOpen, setGuideOpen] = useStoredState(PROGRESS_KEYS.guidePending, false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  // 본 데이트를 다시 보는 데이트 앨범
  const [dateAlbumOpen, setDateAlbumOpen] = useState(false);
  // 히로인 선택 데이트 달: 데이트 상대를 고르는 창
  const [pickOpen, setPickOpen] = useState(false);
  // 이달의 이벤트로 진행 중인 데이트 에피소드
  const [dateEpisode, setDateEpisode] = useState<{ partner: Heroine; episode: Episode; number: number } | null>(null);
  // 데이트를 끝내고 공개하는 일러스트
  const [illustEpisode, setIllustEpisode] = useState<Episode | null>(null);
  // 스탯이 경고 수치에 닿은 걸 이미 알렸는지 (벗어났다 다시 닿으면 또 알림)
  const [dangerWarned, setDangerWarned] = useStoredState(PROGRESS_KEYS.dangerWarned, initialDangerWarned);
  const [dangerAlert, setDangerAlert] = useState<DangerKind | null>(null);
  const [devMode, setDevMode] = useStoredState(SETTINGS_KEYS.devMode, false);
  // 개발자 모드: 에피소드를 골라 바로 보는 테스트 화면
  const [devEpisodesOpen, setDevEpisodesOpen] = useState(false);
  const [volume, setVolume] = useStoredState(SETTINGS_KEYS.bgmVolume, 50);
  const [textSpeed, setTextSpeed] = useStoredState(SETTINGS_KEYS.textSpeed, DEFAULT_TEXT_SPEED);

  const week = getWeekIndex(gameDate);
  const month = Number(gameDate.split('-')[1]);
  const dayEvent = getDayEvent(gameDate);
  const monthEvent = getMonthEvent(gameDate);
  // 이 달 데이트에 필요한 호감도 (11월: 80)
  const minAffection = getDateMinAffection(gameDate);

  const changePlan = (week: number, activity: Activity) => {
    setPlans((prev) => prev.map((p, i) => (i === week ? activity : p)));
  };

  const finishActivity = useCallback(() => {
    setPlaying(false);
    setShowResult(true);
  }, []);

  // 결과창 확인 시 이번 주차 활동 결과를 반영하고 다음 주로 넘어감
  // 스탯·자금 변화량 반영 (스탯은 각자의 범위 안으로)
  const applyEffect = ({ coins: coinChange = 0, ...statChanges }: Effect) => {
    setStats((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(statChanges) as [StatKey, number][]) {
        next[key] = (next[key] ?? 0) + value;
      }
      return clampStats(next);
    });
    setCoins((prev) => prev + coinChange);
  };

  const finishWeek = () => {
    applyEffect(getWeekResult(plans[week], days));
    setShowResult(false);
    onProceed?.();
  };

  // 에피소드를 끝까지 보면 컬렉션에 기록하고 선택지 호감도와 게임에서 얻은 스탯을 반영
  const completeEpisode = (number: number, id: string, changes: Partial<Affection>, gameStats?: Effect, picks?: number[]) => {
    if (gameStats) applyEffect(gameStats);
    markCollected(number, id, gameDate);
    if (picks) saveChoices(id, picks);
    setAffection((prev) => {
      const next = { ...prev };
      for (const key of HEROINES) {
        next[key] = Math.max(0, Math.min(MAX_AFFECTION, next[key] + (changes[key] ?? 0)));
      }
      return next;
    });
  };

  // 말일 에피소드가 끝나면 다음 달로
  const finishEpisode = (changes: Partial<Affection>, gameStats?: Effect, picks?: number[]) => {
    completeEpisode(getNextEpisodeNumber(), getEpisode(month).id, changes, gameStats, picks);
    setPlaying(false);
    onProceed?.();
  };

  // 상점에서 아이템을 사용하면 스탯과 (선물 세트는) 히로인 호감도를 올림
  const applyItems = (items: Item[]) => {
    for (const item of items) applyEffect(item.stats);
    setAffection((prev) => {
      const next = { ...prev };
      for (const { gift } of items) {
        if (gift) next[gift.heroine] = Math.min(MAX_AFFECTION, next[gift.heroine] + gift.affection);
      }
      return next;
    });
  };

  // 15일 데이트가 끝나면 3주차로. 일러스트가 있으면 끝나자마자 공개
  const finishDate = (changes: Partial<Affection>, gameStats?: Effect, picks?: number[]) => {
    if (!dateEpisode) return;
    completeEpisode(dateEpisode.number, dateEpisode.episode.id, changes, gameStats, picks);
    setDateEpisode(null);
    if (dateEpisode.episode.illust) setIllustEpisode(dateEpisode.episode);
    onProceed?.();
  };

  // 히로인의 다음 데이트를 시작 (무료). 그 히로인 데이트를 다 봤으면 이벤트 없이 3주차로
  const startDate = (partner: Heroine) => {
    setPickOpen(false);
    const next = getNextDate(partner);
    if (!next) {
      onProceed?.();
      return;
    }
    setDateEpisode({ partner, episode: next.episode, number: getNextEpisodeNumber() });
    // 끝나고 공개할 일러스트를 데이트 도중에 미리 불러둠 (용량이 커서 공개 순간에 비어 보이지 않게)
    if (next.episode.illust) new Image().src = next.episode.illust;
  };

  // 15일 이달의 이벤트 시작: 정해진 히로인과 데이트 / 데이트 상대 고르기
  const startMonthEvent = () => {
    if (monthEvent.kind === 'date') {
      startDate(monthEvent.heroine);
    } else if (HEROINES.some((h) => getNextDate(h) && affection[h] >= minAffection)) {
      setPickOpen(true);
    } else {
      // 남은 데이트가 없으면 이벤트 없이 3주차로
      onProceed?.();
    }
  };

  // 에피소드에서 들키면 정체 발각, 체력 0이면 사망 엔딩
  const ending: EndingKind | null = exposed ? 'exposed' : (DANGER_KINDS.find((kind) => isGameOver(kind, stats)) ?? null);
  const healthDanger = isDanger('health', stats);

  // 들키면 에피소드를 닫고 바로 엔딩
  const expose = useCallback(() => {
    setExposed(true);
    setPlaying(false);
    setDateEpisode(null);
  }, [setExposed]);

  // 활동·장면·결과창이 끝나 메인 화면으로 돌아온 뒤에 경고·엔딩을 띄움
  const busy = playing || showResult || !!dateEpisode || !!illustEpisode || pickOpen;

  useEffect(() => {
    const danger: Record<DangerKind, boolean> = { health: healthDanger };
    // 경고 수치에서 벗어난 스탯은 다시 닿으면 또 알림
    const recovered = DANGER_KINDS.filter((kind) => dangerWarned[kind] && !danger[kind]);
    if (recovered.length > 0) {
      setDangerWarned((prev) => ({ ...prev, ...Object.fromEntries(recovered.map((kind) => [kind, false])) }));
      return;
    }
    if (ending || busy || dangerAlert) return;
    const next = DANGER_KINDS.find((kind) => danger[kind] && !dangerWarned[kind]);
    if (!next) return;
    setDangerWarned((prev) => ({ ...prev, [next]: true }));
    setDangerAlert(next);
  }, [healthDanger, ending, busy, dangerAlert, dangerWarned, setDangerWarned]);

  const proceed = () => {
    if (dayEvent === 'event') {
      startMonthEvent();
      return;
    }
    if (!dayEvent) {
      if (coins < getWeekCost(plans[week])) {
        setFundsAlert(true);
        return;
      }
      setDays(rollDays(plans[week], stats));
    }
    setPlaying(true);
  };

  const revealAffection = (heroine: Heroine) => {
    if (coins < REVEAL_PRICE || revealed[heroine]) return;
    setCoins(coins - REVEAL_PRICE);
    setRevealed({ ...revealed, [heroine]: true });
  };

  return (
    <div className="main">
      <Backdrop src={backgroundImg} />
      {/* 밝은 배경 위에 어두운 막을 덮어 고딕풍 HUD가 잘 보이게 */}
      <div className="main__shade" aria-hidden />
      {healthDanger && <DangerWarning />}
      <div className="main__left">
        <div className="school">
          <span className="school__crest">
            <Icon name="crest" />
          </span>
          <span className="school__text">
            <strong className="school__name">{name}</strong>
            <span className="school__en">PANGWOON UNIVERSITY</span>
          </span>
        </div>
        <WeekCard gameDate={gameDate} />
        <MonthPlan gameDate={gameDate} plans={plans} onChangePlan={changePlan} />
      </div>
      <img className="main__hero" src={hayeongImg} alt="하영" />
      <TopMenu
        coins={coins}
        onShop={() => setShopOpen(true)}
        onCollection={() => setCollectionOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />
      <div className="main__right">
        <StatsBox stats={stats} />
        <AffectionBox affection={affection} revealed={revealed} coins={coins} onReveal={revealAffection} />
      </div>
      {/* 하단: 대화창 + 행동 선택 창 */}
      <div className="main__bottom">
        <TalkBox className="main__talk" speaker={name}>
          오늘은 어떤 걸 해볼까?
        </TalkBox>
        <div className="main__action">
          <ActionBox
            onProceed={proceed}
            onDate={() => setDateAlbumOpen(true)}
            // 이벤트 날·말일 에피소드 날 안내
            notice={
              dayEvent === 'episode' ? (
                <>
                  <Icon name="sparkle" />
                  메인 에피소드 발생!
                </>
              ) : dayEvent === 'event' ? (
                <>
                  <Icon name="heart" />
                  {getMonthEventLabel(monthEvent)}
                </>
              ) : undefined
            }
          />
        </div>
      </div>
      {playing &&
        (dayEvent === 'episode' ? (
          <EpisodeScene
            label={`${month}월 에피소드`}
            episode={getEpisode(month)}
            number={getNextEpisodeNumber()}
            date={gameDate}
            playerName={name}
            stats={stats}
            onExposed={expose}
            onDone={finishEpisode}
            onExit={onExit}
          />
        ) : (
          <ActivityScene weekLabel={`${month}월 ${week + 1}주`} activity={plans[week]} days={days} onFinish={finishActivity} />
        ))}
      {dateEpisode && (
        <EpisodeScene
          label={`데이트 · ${SPEAKERS[dateEpisode.partner].name}`}
          episode={{ icon: '💗', ...dateEpisode.episode }}
          number={dateEpisode.number}
          date={gameDate}
          playerName={name}
          stats={stats}
          onExposed={expose}
          onDone={finishDate}
          onExit={onExit}
        />
      )}
      {illustEpisode?.illust && (
        <IllustView
          mode="reveal"
          illust={illustEpisode.illust}
          title={illustEpisode.title}
          caption={getDateLabel(illustEpisode)}
          onClose={() => setIllustEpisode(null)}
        />
      )}
      {pickOpen && <HeroinePick minAffection={minAffection} affection={affection} onPick={startDate} />}
      {dateAlbumOpen && <DatePage onClose={() => setDateAlbumOpen(false)} />}
      {showResult && <ActivityResult activity={plans[week]} days={days} onConfirm={finishWeek} />}
      {fundsAlert && (
        <FundsAlert activity={plans[week]} cost={getWeekCost(plans[week])} coins={coins} onClose={() => setFundsAlert(false)} />
      )}
      {shopOpen && (
        <ShopPage
          coins={coins}
          onSpend={(amount) => setCoins((prev) => prev - amount)}
          onUseItems={applyItems}
          onClose={() => setShopOpen(false)}
        />
      )}
      {devEpisodesOpen && (
        <DevEpisodePage name={name} gameDate={gameDate} onClose={() => setDevEpisodesOpen(false)} />
      )}
      {collectionOpen && <CollectionPage onClose={() => setCollectionOpen(false)} />}
      {guideOpen && <GuideTour steps={MAIN_GUIDE} onClose={() => setGuideOpen(false)} />}
      {dangerAlert && !ending && <DangerAlert kind={dangerAlert} stats={stats} onClose={() => setDangerAlert(null)} />}
      {ending && !busy && <BadEnding kind={ending} name={name} gameDate={gameDate} onRestart={onGameOver} />}
      {settingsOpen && (
        <SettingsModal
          volume={volume}
          onChangeVolume={setVolume}
          textSpeed={textSpeed}
          onChangeTextSpeed={setTextSpeed}
          devMode={devMode}
          onChangeDevMode={setDevMode}
          onOpenDevEpisodes={() => {
            setSettingsOpen(false);
            setDevEpisodesOpen(true);
          }}
          onOpenGuide={() => {
            setSettingsOpen(false);
            setGuideOpen(true);
          }}
          onExit={onExit}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
