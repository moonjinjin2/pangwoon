import { useEffect, useState } from 'react';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import IntroVideo from './components/IntroVideo';
import { PROLOGUE, PROLOGUE_DATE, hasMainEpisode } from './utils/episode';
import { START_GAME_DATE, getMonth, getNextWeekDate, isEpisodeDay } from './utils/gameDate';
import { DATE_KEY, PROGRESS_KEYS, clearProgress, load, markCollected, remove, save } from './utils/storage';
import LoadingScreen from './components/LoadingScreen';
import { CORE_IMAGES, useMinLoading, usePreload } from './utils/preload';

type Screen = 'start' | 'intro' | 'main';

// 지금 보고 있는 화면 (탭을 닫으면 사라지므로 새로 접속하면 시작 화면, 새로고침하면 보던 화면 유지)
const SCREEN_KEY = 'screen';

function loadScreen(hasSave: boolean): Screen {
  try {
    const saved = sessionStorage.getItem(SCREEN_KEY);
    if (saved === 'main' && hasSave) return saved;
  } catch {
    // ignore
  }
  return 'start';
}

function Game() {
  // 저장된 게임이 있는지 (게임 날짜가 저장돼 있으면 이어하기 가능)
  const [hasSave, setHasSave] = useState(() => load(DATE_KEY) !== null);
  const [gameDate, setGameDate] = useState(() => load(DATE_KEY) ?? START_GAME_DATE);
  // 처음 접속하면 시작 화면부터 (저장된 게임이 있으면 이어하기로 메인 화면), 새로고침하면 보던 화면 그대로
  const [screen, setScreen] = useState<Screen>(() => loadScreen(hasSave));

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_KEY, screen);
    } catch {
      // 저장 실패 시 새로고침하면 시작 화면부터
    }
  }, [screen]);
  // 화면 전환 (out: 검은 화면으로 어두워진 뒤 fadeTo 화면으로, in: 다시 밝아짐)
  const [fade, setFade] = useState<'out' | 'in' | null>(null);
  const [fadeTo, setFadeTo] = useState<Screen>('main');

  const fadeToScreen = (next: Screen) => {
    if (fade) return;
    setFadeTo(next);
    setFade('out');
  };

  // 오프닝 영상이 끝나거나 건너뛰면 메인 화면으로
  const handleIntroDone = () => fadeToScreen('main');

  const handleNewGame = () => {
    save(DATE_KEY, START_GAME_DATE);
    clearProgress();
    // 프롤로그는 오프닝 영상으로 대신하지만 앨범 #0에는 그대로 남김
    markCollected(0, PROLOGUE.id, PROLOGUE_DATE);
    // 메인 화면에 처음 들어가면 가이드를 보여줌
    save(PROGRESS_KEYS.guidePending, 'true');
    setHasSave(true);
    setGameDate(START_GAME_DATE);
    // 프롤로그 대신 오프닝 영상
    setScreen('intro');
  };

  const handleFadeEnd = () => {
    if (fade === 'out') {
      setScreen(fadeTo);
      setFade('in');
    } else {
      setFade(null);
    }
  };

  const fadeOverlay = fade && <div className={`fade fade--${fade}`} onAnimationEnd={handleFadeEnd} />;

  // 진행 상황은 그대로 두고 시작 화면으로 (이어하기로 돌아올 수 있음)
  const handleExit = () => setScreen('start');

  // 엔딩을 보면 게임이 끝나므로 진행 상황을 모두 지우고 시작 화면으로 (이어하기 불가)
  const handleGameOver = () => {
    clearProgress();
    remove(DATE_KEY);
    setHasSave(false);
    setGameDate(START_GAME_DATE);
    setScreen('start');
  };

  const handleProceed = () => {
    let next = getNextWeekDate(gameDate);
    // 메인 에피소드가 없는 달은 말일을 건너뛰고 다음 달로
    if (isEpisodeDay(next) && !hasMainEpisode(getMonth(next))) next = getNextWeekDate(next);
    save(DATE_KEY, next);
    setGameDate(next);
  };

  let page;
  if (screen === 'start') {
    page = (
      <StartPage
        onNewGame={handleNewGame}
        onContinue={hasSave ? () => setScreen('main') : undefined}
      />
    );
  } else if (screen === 'intro') page = <IntroVideo onDone={handleIntroDone} />;
  else
    page = <MainPage gameDate={gameDate} onExit={handleExit} onGameOver={handleGameOver} onProceed={handleProceed} />;

  return (
    <>
      {page}
      {fadeOverlay}
    </>
  );
}

// 로딩 화면을 최소 2초 보여주고, 다 차면 잠깐 머문 뒤 0.5초 동안 서서히 사라지게 함
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
