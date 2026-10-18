import { useCallback, useState } from 'react';
import backgroundImg from '../img/room3.png';
import hayeongImg from '../img/character/hayeong.png';
import proceedBtnImg from '../img/btn_proceed2.png';
import MonthPlan, { type Activity } from '../components/MonthPlan';
import ActivityResult from '../components/ActivityResult';
import ActivityScene from '../components/ActivityScene';
import AffectionBox, { MAX_AFFECTION, REVEAL_PRICE } from '../components/AffectionBox';
import EpisodeScene from '../components/EpisodeScene';
import StatsBox, { MAX_STAT, type StatKey, type Stats } from '../components/StatsBox';
import SettingsModal from '../components/SettingsModal';
import TopMenu from '../components/TopMenu';
import CollectionPage from './CollectionPage';
import WardrobePage from './WardrobePage';
import { getWeekResult, rollDays } from '../utils/activity';
import { HEROINES, SPEAKERS, getDateEpisode, getEpisode, type Affection, type Heroine } from '../utils/episode';
import { formatShortDate, getDayEvent, getEpisodeNumber, getMonthIndex, getWeekIndex } from '../utils/gameDate';
import { DEFAULT_TEXT_SPEED, PROGRESS_KEYS, SETTINGS_KEYS, markCollected, useStoredState } from '../utils/storage';

interface Props {
  name: string;
  gameDate: string;
  onLogout: () => void;
  onProceed?: () => void;
}

const initialPlans: Activity[] = ['gym', 'study', 'job', 'rest'];

const initialStats: Stats = { health: MAX_STAT, strength: 0, intellect: 0, charm: 0, stress: 0 };

const initialCoins = 482500;

const initialAffection: Affection = { minji: 0, siyeong: 0, emily: 0 };

// 호감도는 비공개, 골드를 내야 볼 수 있음
const initialRevealed: Record<Heroine, boolean> = { minji: false, siyeong: false, emily: false };

export default function MainPage({ name, gameDate, onLogout, onProceed }: Props) {
  // 진행 상황은 새로고침해도 유지되도록 저장
  const [plans, setPlans] = useStoredState(PROGRESS_KEYS.plans, initialPlans);
  const [stats, setStats] = useStoredState(PROGRESS_KEYS.stats, initialStats);
  const [coins, setCoins] = useStoredState(PROGRESS_KEYS.coins, initialCoins);
  const [affection, setAffection] = useStoredState(PROGRESS_KEYS.affection, initialAffection);
  const [revealed, setRevealed] = useStoredState(PROGRESS_KEYS.revealed, initialRevealed);
  const [playing, setPlaying] = useState(false);
  // 활동 움짤이 끝나면 메인 화면으로 돌아와 결과창 표시
  const [showResult, setShowResult] = useState(false);
  // 이번 주차 5일치 성공/실패 (진행하기 누를 때 정함)
  const [days, setDays] = useState<boolean[]>([]);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
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
  const finishWeek = () => {
    const { coins: coinChange = 0, ...statChanges } = getWeekResult(plans[week], days);
    setStats((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(statChanges) as [StatKey, number][]) {
        next[key] = Math.max(0, Math.min(MAX_STAT, next[key] + value));
      }
      return next;
    });
    setCoins((prev) => prev + coinChange);
    setShowResult(false);
    onProceed?.();
  };

  // 데이트(15일)·에피소드(말일)가 끝나면 선택지 호감도를 반영하고 다음 날짜로
  const finishEpisode = (changes: Partial<Affection>) => {
    markCollected(getEpisodeNumber(gameDate), eventEpisode().episode.id);
    setAffection((prev) => {
      const next = { ...prev };
      for (const key of HEROINES) {
        next[key] = Math.max(0, Math.min(MAX_AFFECTION, next[key] + (changes[key] ?? 0)));
      }
      return next;
    });
    setPlaying(false);
    onProceed?.();
  };

  const revealAffection = (heroine: Heroine) => {
    if (coins < REVEAL_PRICE || revealed[heroine]) return;
    setCoins(coins - REVEAL_PRICE);
    setRevealed({ ...revealed, [heroine]: true });
  };

  const eventEpisode = () => {
    if (dayEvent === 'date') {
      const { partner, episode } = getDateEpisode(getMonthIndex(gameDate));
      return { label: `데이트 · ${SPEAKERS[partner].name}`, episode: { icon: '💗', ...episode } };
    }
    return { label: `${month}월 에피소드`, episode: getEpisode(month) };
  };

  return (
    <div className="main" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
      <div className="main__left">
        <div className="profile">
          <span className="profile__avatar" style={{ backgroundImage: `url(${hayeongImg})` }} aria-hidden />
          <span className="profile__name">{name}</span>
        </div>
        <p>
          <span className="main__date" style={{ fontSize: '2.5rem', marginRight: '10px' }}>TODAY</span>
          <span className="main__date">{formatShortDate(gameDate)}</span>
        </p>
        <MonthPlan gameDate={gameDate} plans={plans} onChangePlan={changePlan} />
      </div>
      <img className="main__hero" src={hayeongImg} alt="하영" />
      <div className="episode__dialog main__dialog">
        <span className="episode__speaker">{name}</span>
        <p className="episode__text">오늘은 어떤 걸 해볼까?</p>
      </div>
      <TopMenu coins={coins} onWardrobe={() => setWardrobeOpen(true)} onCollection={() => setCollectionOpen(true)} onSettings={() => setSettingsOpen(true)} />
      <div className="main__right">
        <StatsBox stats={stats} />
      </div>
      <button
        className="main__proceed"
        onClick={() => {
          setDays(rollDays(plans[week]));
          setPlaying(true);
        }}
      >
        {/* 4주 활동을 다 마치고 말일 에피소드만 남았을 때 안내 */}
        {dayEvent === 'episode' && <span className="main__bubble">메인 에피소드 발생!</span>}
        <img src={proceedBtnImg} alt="진행하기" />
      </button>
      {playing &&
        (dayEvent ? (
          <EpisodeScene {...eventEpisode()} number={getEpisodeNumber(gameDate)} date={gameDate} playerName={name} onDone={finishEpisode} />
        ) : (
          <ActivityScene weekLabel={`${month}월 ${week + 1}주`} activity={plans[week]} days={days} onFinish={finishActivity} />
        ))}
      {showResult && <ActivityResult activity={plans[week]} days={days} onConfirm={finishWeek} />}
      {wardrobeOpen && (
        <WardrobePage
          coins={coins}
          onSpend={(amount) => setCoins((prev) => prev - amount)}
          onClose={() => setWardrobeOpen(false)}
        />
      )}
      {collectionOpen && <CollectionPage onClose={() => setCollectionOpen(false)} />}
      {settingsOpen && (
        <SettingsModal
          volume={volume}
          onChangeVolume={setVolume}
          textSpeed={textSpeed}
          onChangeTextSpeed={setTextSpeed}
          onExit={onLogout}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
