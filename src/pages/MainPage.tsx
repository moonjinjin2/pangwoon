import { useCallback, useEffect, useRef, useState } from 'react';
import backgroundImg from '../img/main_background.jpg';
import hayeongImg from '../img/character/hayeong_default.png';
import MonthPlan, { type Activity } from '../components/MonthPlan';
import ActionBox from '../components/ActionBox';
import ActivityResult from '../components/ActivityResult';
import ActivityScene from '../components/ActivityScene';
import AffectionBox, { MAX_AFFECTION, REVEAL_PRICE } from '../components/AffectionBox';
import ContestScene from '../components/ContestScene';
import EpisodeScene from '../components/EpisodeScene';
import FundsAlert from '../components/FundsAlert';
import { HeartMark } from '../components/Icon';
import IllustView from '../components/IllustView';
import RentNotice from '../components/RentNotice';
import StatsBox, { clampStats, type StatKey, type Stats } from '../components/StatsBox';
import SettingsModal from '../components/SettingsModal';
import TopMenu from '../components/TopMenu';
import WeekCard from '../components/WeekCard';
import CollectionPage from './CollectionPage';
import DatePage from './DatePage';
import WardrobePage from './WardrobePage';
import { getWeekCost, getWeekResult, rollDays, type Effect, type Grade } from '../utils/activity';
import { CONTESTS, getContest } from '../utils/contest';
import { DATE_COST, HEROINES, SPEAKERS, getDateLabel, getEpisode, type Affection, type Episode, type Heroine } from '../utils/episode';
import { getDayEvent, getWeekIndex } from '../utils/gameDate';
import { RENT, RENT_DELAY_MS, START_COINS, UNPAID_STRESS } from '../utils/rent';
import { DEFAULT_TEXT_SPEED, PROGRESS_KEYS, SETTINGS_KEYS, getNextEpisodeNumber, markCollected, saveChoices, useStoredState } from '../utils/storage';

interface Props {
  name: string;
  gameDate: string;
  // 설정의 게임 종료: 시작 화면으로
  onExit: () => void;
  onProceed?: () => void;
}

const initialPlans: Activity[] = ['gym', 'study', 'job', 'rest'];

const initialStats: Stats = { health: 100, strength: 0, intellect: 0, stress: 0 };

const initialAffection: Affection = { minji: 0, siyeong: 0, emily: 0 };

// 호감도는 비공개, 골드를 내야 볼 수 있음
const initialRevealed: Record<Heroine, boolean> = { minji: false, siyeong: false, emily: false };

export default function MainPage({ name, gameDate, onExit, onProceed }: Props) {
  // 진행 상황은 새로고침해도 유지되도록 저장
  const [plans, setPlans] = useStoredState(PROGRESS_KEYS.plans, initialPlans);
  const [stats, setStats] = useStoredState(PROGRESS_KEYS.stats, initialStats);
  const [coins, setCoins] = useStoredState(PROGRESS_KEYS.coins, START_COINS);
  // 월세 연속 미납 횟수 (HOMELESS_MONTHS 번이면 노숙자 엔딩)
  const [unpaidRent, setUnpaidRent] = useStoredState(PROGRESS_KEYS.unpaidRent, 0);
  // 월세를 마지막으로 처리한 달 ('YYYY-MM')
  const [rentMonth, setRentMonth] = useStoredState(PROGRESS_KEYS.rentMonth, '');
  // 새 달이 시작될 때 띄우는 월세 납부/미납 결과창
  const [rentResult, setRentResult] = useState<{ paid: boolean; streak: number; before: number } | null>(null);
  // 이번 주 활동 비용이 모자라 진행하지 못할 때 띄우는 알림
  const [fundsAlert, setFundsAlert] = useState(false);
  const [affection, setAffection] = useStoredState(PROGRESS_KEYS.affection, initialAffection);
  const [revealed, setRevealed] = useStoredState(PROGRESS_KEYS.revealed, initialRevealed);
  const [playing, setPlaying] = useState(false);
  // 활동 움짤이 끝나면 메인 화면으로 돌아와 결과창 표시
  const [showResult, setShowResult] = useState(false);
  // 이번 주차 5일치 성공/실패 (진행하기 누를 때 정함)
  const [days, setDays] = useState<Grade[]>([]);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [affectionOpen, setAffectionOpen] = useState(false);
  const [dateListOpen, setDateListOpen] = useState(false);
  // 데이트 목록에서 고른 데이트 에피소드 (진행 중)
  const [dateEpisode, setDateEpisode] = useState<{ partner: Heroine; episode: Episode; number: number } | null>(null);
  // 데이트를 끝내고 공개하는 일러스트
  const [illustEpisode, setIllustEpisode] = useState<Episode | null>(null);
  const [volume, setVolume] = useStoredState(SETTINGS_KEYS.bgmVolume, 50);
  const [textSpeed, setTextSpeed] = useStoredState(SETTINGS_KEYS.textSpeed, DEFAULT_TEXT_SPEED);

  const week = getWeekIndex(gameDate);
  const month = Number(gameDate.split('-')[1]);
  const dayEvent = getDayEvent(gameDate);

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
    markCollected(number, id);
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

  // 15일 대회가 끝나면 결과를 반영하고 3주차로
  const finishContest = (effect: Effect) => {
    applyEffect(effect);
    setPlaying(false);
    onProceed?.();
  };

  // 데이트는 날짜를 넘기지 않음. 일러스트가 있으면 끝나자마자 공개
  const finishDate = (changes: Partial<Affection>, gameStats?: Effect, picks?: number[]) => {
    if (!dateEpisode) return;
    completeEpisode(dateEpisode.number, dateEpisode.episode.id, changes, gameStats, picks);
    setDateEpisode(null);
    if (dateEpisode.episode.illust) setIllustEpisode(dateEpisode.episode);
  };

  const startDate = (partner: Heroine, episode: Episode) => {
    if (coins < DATE_COST) return;
    setCoins((prev) => prev - DATE_COST);
    setDateListOpen(false);
    setDateEpisode({ partner, episode, number: getNextEpisodeNumber() });
    // 끝나고 공개할 일러스트를 데이트 도중에 미리 불러둠 (용량이 커서 공개 순간에 비어 보이지 않게)
    if (episode.illust) new Image().src = episode.illust;
  };

  // 그 달 월세를 아직 안 냈으면 메인 화면에 들어온 뒤 RENT_DELAY_MS 후 납부 (게임 시작 직후, 말일 에피소드 후 다음 달 1일)
  // 자금이 모자라면 미납: 자금은 그대로, 스트레스 증가, 연속 미납 횟수 증가
  const currentMonth = gameDate.slice(0, 7);
  const rentDue = rentMonth !== currentMonth;

  const chargeRent = () => {
    setRentMonth(currentMonth);
    if (coins >= RENT) {
      setCoins((prev) => prev - RENT);
      setUnpaidRent(0);
      setRentResult({ paid: true, streak: 0, before: coins });
    } else {
      applyEffect({ stress: UNPAID_STRESS });
      setUnpaidRent(unpaidRent + 1);
      setRentResult({ paid: false, streak: unpaidRent + 1, before: coins });
    }
  };

  // 타이머가 끝날 때의 최신 자금으로 계산하도록 ref로 호출
  const chargeRentRef = useRef(chargeRent);
  chargeRentRef.current = chargeRent;

  useEffect(() => {
    if (!rentDue) return;
    const timer = window.setTimeout(() => chargeRentRef.current(), RENT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [rentDue, currentMonth]);

  const proceed = () => {
    // 월세 내기 전에 진행하기·데이트를 누르면 월세부터
    if (rentDue) {
      chargeRent();
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

  const openDateList = () => {
    if (rentDue) {
      chargeRent();
      return;
    }
    setDateListOpen(true);
  };

  const revealAffection = (heroine: Heroine) => {
    if (coins < REVEAL_PRICE || revealed[heroine]) return;
    setCoins(coins - REVEAL_PRICE);
    setRevealed({ ...revealed, [heroine]: true });
  };

  const contest = getContest(gameDate);

  // 메인 화면 위에 다른 화면·창이 떠 있으면 진행하기/데이트 단축키를 막음
  const overlayOpen =
    playing ||
    showResult ||
    !!dateEpisode ||
    !!illustEpisode ||
    dateListOpen ||
    !!rentResult ||
    fundsAlert ||
    wardrobeOpen ||
    collectionOpen ||
    affectionOpen ||
    settingsOpen;

  return (
    <div className="main" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="main__left">
        <div className="profile">
          <span className="profile__avatar" style={{ backgroundImage: `url(${hayeongImg})` }} aria-hidden />
          <span className="profile__name">{name}</span>
        </div>
        <WeekCard gameDate={gameDate} plans={plans} />
        <MonthPlan gameDate={gameDate} plans={plans} onChangePlan={changePlan} />
      </div>
      <img className="main__hero" src={hayeongImg} alt="하영" />
      <TopMenu
        coins={coins}
        onWardrobe={() => setWardrobeOpen(true)}
        onCollection={() => setCollectionOpen(true)}
        onAffection={() => setAffectionOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />
      <div className="main__right">
        <StatsBox stats={stats} />
      </div>
      {/* 하단: 대화창 + 행동 선택 창 */}
      <div className="main__bottom">
        <div className="talk main__talk">
          <span className="talk__speaker">
            <HeartMark />
            {name}
          </span>
          <p className="talk__line">오늘은 어떤 걸 해볼까?</p>
          <HeartMark className="talk__next" />
        </div>
        <div className="main__action">
          {/* 대회 날·말일 에피소드 날 안내 */}
          {dayEvent === 'episode' && <span className="main__bubble">메인 에피소드 발생!</span>}
          {dayEvent === 'contest' && <span className="main__bubble">{CONTESTS[contest].label} 개최!</span>}
          <ActionBox keysEnabled={!overlayOpen} onProceed={proceed} onDate={openDateList} />
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
            onDone={finishEpisode}
          />
        ) : dayEvent === 'contest' ? (
          <ContestScene type={contest} month={month} stats={stats} onDone={finishContest} />
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
          onDone={finishDate}
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
      {dateListOpen && (
        <DatePage affection={affection} coins={coins} onSelect={startDate} onClose={() => setDateListOpen(false)} />
      )}
      {showResult && <ActivityResult activity={plans[week]} days={days} onConfirm={finishWeek} />}
      {rentResult && (
        <RentNotice {...rentResult} gameDate={gameDate} onConfirm={() => setRentResult(null)} />
      )}
      {fundsAlert && (
        <FundsAlert activity={plans[week]} cost={getWeekCost(plans[week])} coins={coins} onClose={() => setFundsAlert(false)} />
      )}
      {wardrobeOpen && (
        <WardrobePage
          coins={coins}
          onSpend={(amount) => setCoins((prev) => prev - amount)}
          onClose={() => setWardrobeOpen(false)}
        />
      )}
      {affectionOpen && (
        <AffectionBox
          affection={affection}
          revealed={revealed}
          coins={coins}
          onReveal={revealAffection}
          onClose={() => setAffectionOpen(false)}
        />
      )}
      {collectionOpen && <CollectionPage onClose={() => setCollectionOpen(false)} />}
      {settingsOpen && (
        <SettingsModal
          volume={volume}
          onChangeVolume={setVolume}
          textSpeed={textSpeed}
          onChangeTextSpeed={setTextSpeed}
          onExit={onExit}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
