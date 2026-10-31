import { useEffect, useState } from 'react';
import StartPage from './pages/StartPage';
import SetNamePage from './pages/SetNamePage';
import MainPage from './pages/MainPage';
import EpisodeScene from './components/EpisodeScene';
import barImg from './img/bar_background.jpg';
import { PROLOGUE, PROLOGUE_DATE } from './utils/episode';
import { START_GAME_DATE, getNextWeekDate } from './utils/gameDate';
import { DATE_KEY, NAME_KEY, clearProgress, load, markCollected, save } from './utils/storage';
import LoadingScreen from './components/LoadingScreen';
import { CORE_IMAGES, useMinLoading, usePreload } from './utils/preload';

type Screen = 'start' | 'setName' | 'prologue' | 'main';

// 지금 보고 있는 화면 (탭을 닫으면 사라지므로 새로 접속하면 시작 화면, 새로고침하면 보던 화면 유지)
const SCREEN_KEY = 'screen';

function loadScreen(hasName: boolean): Screen {
  try {
    const saved = sessionStorage.getItem(SCREEN_KEY);
    if (saved === 'setName') return saved;
    if ((saved === 'prologue' || saved === 'main') && hasName) return saved;
  } catch {
    // ignore
  }
  return 'start';
}

function Game() {
  const [name, setName] = useState<string | null>(() => load(NAME_KEY));
  const [gameDate, setGameDate] = useState(() => load(DATE_KEY) ?? START_GAME_DATE);
  // 처음 접속하면 시작 화면부터 (저장된 게임이 있으면 이어하기로 메인 화면), 새로고침하면 보던 화면 그대로
  const [screen, setScreen] = useState<Screen>(() => loadScreen(!!name));

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_KEY, screen);
    } catch {
      // 저장 실패 시 새로고침하면 시작 화면부터
    }
  }, [screen]);
  // 프롤로그 → 메인 화면 전환 (out: 검은 화면으로 어두워짐, in: 다시 밝아짐)
  const [fade, setFade] = useState<'out' | 'in' | null>(null);

  const handleNameSubmit = (newName: string) => {
    save(NAME_KEY, newName);
    save(DATE_KEY, START_GAME_DATE);
    clearProgress();
    setName(newName);
    setGameDate(START_GAME_DATE);
    setScreen('prologue');
  };

  const handlePrologueDone = () => {
    markCollected(0, PROLOGUE.id);
    if (!fade) setFade('out');
  };

  const handleFadeEnd = () => {
    if (fade === 'out') {
      setScreen('main');
      setFade('in');
    } else {
      setFade(null);
    }
  };

  const fadeOverlay = fade && <div className={`fade fade--${fade}`} onAnimationEnd={handleFadeEnd} />;

  // 진행 상황은 그대로 두고 시작 화면으로 (이어하기로 돌아올 수 있음)
  const handleExit = () => setScreen('start');

  const handleProceed = () => {
    const next = getNextWeekDate(gameDate);
    save(DATE_KEY, next);
    setGameDate(next);
  };

  if (screen === 'start')
    return <StartPage onNewGame={() => setScreen('setName')} onContinue={name ? () => setScreen('main') : undefined} />;
  if (screen === 'setName') return <SetNamePage onSubmit={handleNameSubmit} />;
  if (screen === 'prologue')
    return (
      <>
        <EpisodeScene
          number={0}
          label="프롤로그"
          episode={PROLOGUE}
          date={PROLOGUE_DATE}
          background={barImg}
          playerName={name ?? ''}
          showPlayer
          onDone={handlePrologueDone}
        />
        {fadeOverlay}
      </>
    );
  return (
    <>
      <MainPage name={name ?? ''} gameDate={gameDate} onExit={handleExit} onProceed={handleProceed} />
      {fadeOverlay}
    </>
  );
}

// 로딩 화면을 최소 2초 보여주고 0.5초 동안 서서히 사라지게 함
const MIN_LOADING_MS = 2000;
const LOADING_FADE_MS = 500;

export default function App() {
  // 화면을 옮길 때 이미지가 깨져 보이지 않게 처음에 모두 불러옴
  const { done, progress } = usePreload(CORE_IMAGES);
  const loading = useMinLoading(done, progress, MIN_LOADING_MS, LOADING_FADE_MS);
  // 이미지를 다 불러오면 게임 화면을 로딩 화면 뒤에 미리 깔아 둠
  return (
    <>
      {done && <Game />}
      {!loading.gone && <LoadingScreen progress={loading.progress} leaving={loading.leaving} />}
    </>
  );
}
