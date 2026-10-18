import { useState } from 'react';
import StartPage from './pages/StartPage';
import SetNamePage from './pages/SetNamePage';
import MainPage from './pages/MainPage';
import EpisodeScene from './components/EpisodeScene';
import PubBackdrop from './components/PubBackdrop';
import { PROLOGUE, PROLOGUE_DATE } from './utils/episode';
import { START_GAME_DATE, getNextWeekDate } from './utils/gameDate';
import { DATE_KEY, NAME_KEY, clearProgress, load, markCollected, remove, save } from './utils/storage';

type Screen = 'start' | 'setName' | 'prologue' | 'main';

export default function App() {
  const [name, setName] = useState<string | null>(() => load(NAME_KEY));
  const [gameDate, setGameDate] = useState(() => load(DATE_KEY) ?? START_GAME_DATE);
  const [screen, setScreen] = useState<Screen>(() => (name ? 'main' : 'start'));
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

  const handleLogout = () => {
    remove(NAME_KEY);
    remove(DATE_KEY);
    clearProgress();
    setName(null);
    setGameDate(START_GAME_DATE);
    setScreen('start');
  };

  const handleProceed = () => {
    const next = getNextWeekDate(gameDate);
    save(DATE_KEY, next);
    setGameDate(next);
  };

  if (screen === 'start') return <StartPage onEnter={() => setScreen('setName')} />;
  if (screen === 'setName') return <SetNamePage onSubmit={handleNameSubmit} />;
  if (screen === 'prologue')
    return (
      <>
        <EpisodeScene
          number={0}
          label="프롤로그"
          episode={PROLOGUE}
          date={PROLOGUE_DATE}
          background={<PubBackdrop />}
          playerName={name ?? ''}
          onDone={handlePrologueDone}
        />
        {fadeOverlay}
      </>
    );
  return (
    <>
      <MainPage name={name ?? ''} gameDate={gameDate} onLogout={handleLogout} onProceed={handleProceed} />
      {fadeOverlay}
    </>
  );
}
