import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react';
import backgroundImg from '../img/background/cafe.jpg';
import desktopImg from '../img/windows.jpg';
import Box from './Box';
import ResultDialog from './ResultDialog';
import { HeartMark } from './Icon';
import { SPEAKERS, getReplayLines, parseGameEnd, type Affection, type Choice, type Episode, type GameEnd, type Heroine, type Speaker } from '../utils/episode';
import type { Effect } from '../utils/activity';
import { getWeekIndex } from '../utils/gameDate';
import { DEFAULT_TEXT_SPEED, SETTINGS_KEYS, TEXT_SPEEDS, useStoredState } from '../utils/storage';

// 자동 진행 시 문장이 다 나온 뒤 기다리는 시간
const AUTO_MS = 1500;

// 게임 화면 전환 단계: 들어가는 전환 → 게임 중 → 나오는 전환(암전) → 에피소드로 복귀(밝아짐)
type GamePhase = 'enter' | 'play' | 'leave' | 'return';

// TODO(테스트용): 쯔꾸르가 아직 미완성이라 창 닫기(✕)로 나와도 엔딩 A + 예시 스탯으로 이어감
// 게임에서 game-end 메시지를 보내게 되면 {}로 바꿔서 엔딩·스탯 없이 끝나게 할 것
const EXIT_GAME_END: GameEnd = {
  ending: 'A',
  stats: { health: -20, strength: 10, intellect: 10, stress: 15 },
};

interface Props {
  // 상단 창 제목에 표시 (에피소드 #0, #1 …)
  number: number;
  // 상단 창에 표시 (예: '데이트 · 민지'). 첫 부분은 태그로, 나머지는 날짜 옆에
  label: string;
  episode: Episode;
  // 'YYYY-MM-DD' (다시 보기처럼 날짜가 없으면 현재 상황 창에 날짜를 빼고 보여줌)
  date?: string;
  // 배경 이미지 주소, 또는 직접 그린 배경
  background?: string | ReactNode;
  playerName: string;
  // 주인공 대사에서도 주인공 이미지를 보여줄지 (기본은 대사만)
  showPlayer?: boolean;
  // 컬렉션에서 다시 볼 때 그때 고른 선택지 번호들 (선택지 대신 고른 대사가 바로 나오고, 호감도는 바뀌지 않음)
  replay?: number[];
  // 이번 에피소드에서 선택지로 바뀐 호감도 합계, 게임에서 얻은 스탯 변화량, 고른 선택지 번호들
  onDone: (affection: Partial<Affection>, stats?: Effect, picks?: number[]) => void;
}

export default function EpisodeScene({ number, label, episode, date, background = episode.background ?? backgroundImg, playerName, showPlayer = false, replay, onDone }: Props) {
  // 선택지를 고르면 그 답변 대사가 끼워지므로 대사 목록을 상태로 관리
  const [lines, setLines] = useState(() => (replay ? getReplayLines(episode.lines, replay) : episode.lines));
  // 고른 선택지 번호 (나온 순서대로 기록해 다시 보기에 씀)
  const [picks, setPicks] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [affection, setAffection] = useState<Partial<Affection>>({});
  // 방금 고른 선택지의 호감도 변화 (다음 대사로 넘어가면 사라짐)
  const [feedback, setFeedback] = useState<Partial<Affection> | null>(null);
  const [auto, setAuto] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  // 선택지에서 강조된 항목 (방향키·마우스로 고르고 Enter/Space로 선택)
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase | null>(null);
  // 게임이 끝나며 알려준 엔딩·스탯 (게임 종료 버튼으로 나오면 빈 값)
  const [gameEnd, setGameEnd] = useState<GameEnd | null>(null);
  const [gameResultOpen, setGameResultOpen] = useState(false);
  // 설정에서 고른 텍스트 속도 (에피소드 도중에는 설정을 열 수 없으므로 시작할 때 한 번만 읽음)
  const [textSpeed] = useStoredState(SETTINGS_KEYS.textSpeed, DEFAULT_TEXT_SPEED);
  const typeMs = (TEXT_SPEEDS.find((s) => s.key === textSpeed) ?? TEXT_SPEEDS[1]).ms;

  const fill = (text: string) => text.split('{name}').join(playerName);
  const nameOf = (speaker: keyof typeof SPEAKERS) => (speaker === 'player' ? playerName : SPEAKERS[speaker].name);

  const line = lines[index];
  const text = fill(line.text);
  const speaker = line.speaker && SPEAKERS[line.speaker];
  const speakerName = line.speaker ? nameOf(line.speaker) : line.name;
  // 주인공은 이미지 없이 대사만 나오고 (showPlayer면 주인공 이미지도 보여줌),
  // 히로인 이미지는 주인공 대사·나레이션 중에도 유지해 번갈아 깜박이지 않게 함
  const portraitOf = (l: (typeof lines)[number]) => (l.speaker && (showPlayer || l.speaker !== 'player') ? l.speaker : undefined);
  // 이번 장면의 시작: 배경이 바뀌거나(장면 전환) 이미지를 내리는 대사. 그보다 앞에서 나온 캐릭터는 이어서 보여주지 않음
  let sceneStart = index;
  while (sceneStart > 0 && !lines[sceneStart].background && !lines[sceneStart].hidePortrait) sceneStart--;
  // 이번 장면의 무대: 보통은 마지막으로 말한 캐릭터 1명
  // 대사에 stage가 있으면 그 대사부터 지정한 캐릭터들을 같이 세우고,
  // 그중 누가 말하는 동안 유지함 (무대에 없는 캐릭터가 말하면 다시 그 캐릭터 1명)
  let stage: Speaker[] = [];
  for (let i = sceneStart; i <= index; i++) {
    const s = portraitOf(lines[i]);
    if (s && !stage.includes(s)) stage = [s];
    if (lines[i].stage) stage = lines[i].stage!;
  }
  // 이번 장면에 이미 등장한 캐릭터가 있으면 이미지 없는 주인공 대사 중에도 계속 보여줌
  const portraitVisible = stage.length > 0 && !!speaker;
  // 아직 아무도 등장하지 않았으면 다음에 등장할 캐릭터를 투명하게 깔아둠 (첫 등장도 페이드인)
  const upcoming = lines.slice(index).map(portraitOf).find(Boolean);
  const shownSpeakers = stage.length > 0 ? stage : upcoming ? [upcoming] : [];
  // 1명이면 가운데, 2명이면 좌우, 3명이면 좌·중·우 (화면 너비 기준 %)
  const stagePositions = [[50], [50], [30, 70], [28, 50, 72]][Math.min(shownSpeakers.length, 3)];
  const typing = typed < text.length;
  const choosing = !typing && !!line.choices;
  // 시스템 오류 효과: 오류 대사마다 창을 새로 띄움
  const systemError = line.effect === 'system-error';
  // 장면 전환: 지금까지 나온 대사 중 마지막으로 지정된 배경 (없으면 에피소드 배경)
  let lineBackground: string | undefined;
  for (let i = index; !lineBackground && i >= 0; i--) lineBackground = lines[i].background;
  const shownBackground = lineBackground ?? background;

  // 캐릭터 이미지를 미리 불러와서 처음 등장할 때 비어 보이지 않게 함
  useEffect(() => {
    for (const { image } of Object.values(SPEAKERS)) {
      const img = new Image();
      img.src = image;
      img.decode().catch(() => { });
    }
  }, []);

  // 한 글자씩 타이핑
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setTyped((t) => t + 1), typeMs);
    return () => clearTimeout(timer);
  }, [typing, typed, typeMs]);

  const next = () => {
    setIndex(index + 1);
    setTyped(0);
  };

  const gameStats = gameEnd?.stats;
  const hasGameStats = !!gameStats && Object.keys(gameStats).length > 0;

  // 에피소드 종료 (게임에서 얻은 스탯이 있으면 결과창을 먼저 보여줌)
  const finish = () => {
    if (hasGameStats && !gameResultOpen) {
      setGameResultOpen(true);
    } else {
      onDone(affection, gameStats, picks);
    }
  };

  // 다음 대사로 (마지막 대사였으면 에피소드 종료)
  const proceed = (current = lines) => {
    if (index < current.length - 1) {
      setFeedback(null);
      next();
    } else {
      finish();
    }
  };

  // 타이핑 중이면 문장을 바로 다 보여주고, 아니면 다음 대사로 (선택지가 떠 있거나 게임 중이면 무시)
  const advance = () => {
    if (gamePhase || gameResultOpen) {
      return;
    } else if (typing) {
      setTyped(text.length);
    } else if (choosing) {
      return;
    } else if (line.game) {
      setGamePhase('enter');
    } else {
      proceed();
    }
  };

  const endGame = (end: GameEnd) => {
    setGameEnd(end);
    setGamePhase('leave');
  };

  // 전환 효과가 끝날 때마다 다음 단계로
  const onWarpEnd = (e: AnimationEvent) => {
    if (e.target !== e.currentTarget) return;
    if (gamePhase === 'enter') {
      setGamePhase('play');
    } else if (gamePhase === 'leave') {
      setGamePhase('return');
      // 게임이 알려준 엔딩의 대사를 게임 바로 뒤에 끼워 넣고 이어서 진행
      const ending = gameEnd?.ending ? line.gameEndings?.[gameEnd.ending] : undefined;
      const current = ending ? [...lines.slice(0, index + 1), ...ending, ...lines.slice(index + 1)] : lines;
      setLines(current);
      proceed(current);
    } else {
      setGamePhase(null);
    }
  };

  // 게임 쪽에서 끝났다고 알려주면 에피소드로 돌아옴
  useEffect(() => {
    if (gamePhase !== 'play') return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const end = parseGameEnd(e.data);
      if (end) endGame(end);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [gamePhase]);

  // 다음 선택지(또는 게임)까지 건너뜀 (더 없으면 에피소드 종료)
  const skip = () => {
    if (choosing || gamePhase || gameResultOpen) return;
    const target = lines.findIndex((l, i) => i >= index && (l.choices || l.game));
    if (target === -1) {
      finish();
      return;
    }
    setFeedback(null);
    setIndex(target);
    setTyped(Infinity);
  };

  const choose = (choice: Choice) => {
    setChoiceIndex(0);
    setPicks((prev) => [...prev, line.choices!.indexOf(choice)]);
    setLines([...lines.slice(0, index + 1), ...choice.reply, ...lines.slice(index + 1)]);
    setAffection((prev) => {
      const sum = { ...prev };
      for (const [key, value] of Object.entries(choice.affection) as [Heroine, number][]) {
        sum[key] = (sum[key] ?? 0) + value;
      }
      return sum;
    });
    // 다시 보기에서는 호감도가 바뀌지 않으므로 표시하지 않음
    if (!replay) setFeedback(choice.affection);
    next();
  };

  // 자동 진행
  useEffect(() => {
    if (!auto || typing || choosing || logOpen || gamePhase || gameResultOpen) return;
    const timer = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 게임 중에는 키 입력을 게임에 맡기고, 결과창에서는 확인 버튼이 받음
      if (gamePhase || gameResultOpen) return;
      if (logOpen) {
        if (e.key === 'Escape') setLogOpen(false);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        skip();
      } else if (choosing && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const count = line.choices!.length;
        setChoiceIndex((prev) => (prev + (e.key === 'ArrowUp' ? count - 1 : 1)) % count);
      } else if (choosing && e.key === 'Enter') {
        // 스페이스는 대사 넘기기용이라 연타하다 선택지가 골라지지 않게 Enter로만 선택
        e.preventDefault();
        choose(line.choices![choiceIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      } else if (choosing) {
        // 숫자 키로 선택
        const choice = line.choices![Number(e.key) - 1];
        if (choice) choose(choice);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const [tag, ...labelRest] = label.split(' · ');
  const dateText = date && `${Number(date.split('-')[1])}월 ${getWeekIndex(date) + 1}주차`;
  const subtitle = [dateText, episode.time ?? labelRest.join(' · ')].filter(Boolean).join(' · ');

  const feedbackItems = feedback ? (Object.entries(feedback) as [Heroine, number][]).filter(([, v]) => v !== 0) : [];

  return (
    <div className="episode" onClick={advance}>
      {typeof shownBackground === 'string' ? (
        // 배경이 바뀌면 새로 그려서 페이드인
        <div key={shownBackground} className="episode__bg" style={{ backgroundImage: `url(${shownBackground})` }} />
      ) : (
        shownBackground
      )}

      <div className="episode__cast">
        {shownSpeakers.map((s, i) => (
          <img
            key={s}
            className={`episode__character episode__character--${s}${portraitVisible ? ' episode__character--shown' : ''}`}
            style={{ left: `${stagePositions[i]}%` }}
            src={SPEAKERS[s].image}
            alt=""
          />
        ))}
      </div>

      <section className="hud-card episode__status" onClick={(e) => e.stopPropagation()}>
        <header className="hud-card__head">
          <HeartMark />
          <h3 className="hud-card__title">EPISODE #{number}</h3>
          <span className="episode__tag">{tag}</span>
        </header>
        <strong className="episode__title">{episode.title}</strong>
        <span className="episode__sub">{subtitle}</span>
      </section>

      {feedbackItems.length > 0 && (
        <div className="episode__affection">
          {feedbackItems.map(([key, value]) => (
            <span key={key} className={value > 0 ? 'episode__affection--up' : 'episode__affection--down'}>
              {value > 0 ? '♥' : '💔'} {SPEAKERS[key].name} 호감도 {value > 0 ? '+' : ''}
              {value}
            </span>
          ))}
        </div>
      )}

      {choosing && (
        <section className="hud-card episode__choices" onClick={(e) => e.stopPropagation()}>
          <header className="hud-card__head">
            <HeartMark />
            <h3 className="hud-card__title">Choice</h3>
          </header>
          <ul className="action__list">
            {line.choices!.map((choice, i) => (
              <li key={i}>
                <button
                  className={choiceIndex === i ? 'action__item action__item--selected' : 'action__item'}
                  onMouseEnter={() => setChoiceIndex(i)}
                  onFocus={() => setChoiceIndex(i)}
                  onClick={() => choose(choice)}
                >
                  <HeartMark className="action__cursor" />
                  <span className="action__label">{fill(choice.text)}</span>
                  <kbd className="action__key">{i + 1}</kbd>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {systemError && (
        <div className="sys-error">
          <div key={index} className="sys-error__window" role="alert">
            <div className="sys-error__title">⚠ SYSTEM ERROR</div>
            <p className="sys-error__text">
              {text.slice(0, typed)}
              <span className="sys-error__cursor" aria-hidden>_</span>
            </p>
          </div>
        </div>
      )}

      <div className="talk episode__talk">
        {speakerName && (
          <span className={line.speaker === 'player' ? 'talk__speaker talk__speaker--player' : 'talk__speaker'}>
            {/* 캐릭터면 얼굴, 이미지 없는 NPC(교수님 등)는 하트 */}
            {line.speaker ? (
              <span className={`talk__face face face--${line.speaker}`} style={{ backgroundImage: `url(${SPEAKERS[line.speaker].image})` }} aria-hidden />
            ) : (
              <HeartMark />
            )}
            {speakerName}
          </span>
        )}
        <p className={speakerName ? 'talk__line' : 'talk__line talk__line--narration'}>{systemError ? '' : text.slice(0, typed)}</p>
        <HeartMark className={!typing && !choosing ? 'talk__next' : 'talk__next talk__next--hidden'} />
        <div className="talk__controls" onClick={(e) => e.stopPropagation()}>
          <button className={auto ? 'talk__btn talk__btn--on' : 'talk__btn'} onClick={() => setAuto(!auto)}>
            <svg viewBox="0 0 10 10" aria-hidden>
              <path d="M2 1l7 4-7 4z" />
            </svg>
            자동
          </button>
          <button className="talk__btn" onClick={() => setLogOpen(true)}>
            <svg viewBox="0 0 10 10" aria-hidden>
              <path d="M1 2h8v1.2H1zM1 4.4h8v1.2H1zM1 6.8h8V8H1z" />
            </svg>
            로그
          </button>
          <button className="talk__btn" onClick={skip} disabled={choosing} title="ESC">
            <svg viewBox="0 0 10 10" aria-hidden>
              <path d="M0 1.5l5 3.5-5 3.5zM5 1.5l5 3.5-5 3.5z" />
            </svg>
            스킵
          </button>
        </div>
      </div>

      {line.game && (gamePhase === 'play' || gamePhase === 'leave') && (
        // 바탕화면 위에 뜬 프로그램 창처럼 게임을 띄움
        <div className="episode__game" style={{ backgroundImage: `url(${desktopImg})` }} onClick={(e) => e.stopPropagation()}>
          <div className="game-window">
            <div className="game-window__titlebar">
              <span className="game-window__title">{line.gameTitle ?? line.game}</span>
              <button
                className="game-window__close"
                onClick={() => endGame(EXIT_GAME_END)}
                disabled={gamePhase === 'leave'}
                aria-label="게임 종료"
                title="게임 종료"
              >
                ✕
              </button>
            </div>
            <iframe
              className="game-window__frame"
              src={`${import.meta.env.BASE_URL}${line.game}/index.html`}
              title={line.gameTitle ?? '게임'}
              allow="autoplay; fullscreen"
              // 바로 키보드로 조작할 수 있게 게임에 포커스
              onLoad={(e) => e.currentTarget.contentWindow?.focus()}
            />
          </div>
        </div>
      )}

      {gamePhase && gamePhase !== 'play' && (
        // 단계마다 새로 그려야 애니메이션이 처음부터 다시 재생됨 (같은 요소면 leave → return에서 멈춤)
        <div key={gamePhase} className={`warp warp--${gamePhase}`} onAnimationEnd={onWarpEnd} onClick={(e) => e.stopPropagation()}>
          {gamePhase === 'enter' && (
            <div className="warp__message">
              <p className="warp__error">SYSTEM ERROR</p>
              <p>외부 접속자를 강제 소환합니다.</p>
            </div>
          )}
        </div>
      )}

      {gameResultOpen && gameStats && (
        <ResultDialog title="게임 결과" changes={gameStats} onConfirm={() => onDone(affection, gameStats, picks)} />
      )}

      {logOpen && (
        <div className="modal" onClick={(e) => {
          e.stopPropagation();
          setLogOpen(false);
        }}>
          <div className="vn-log" role="dialog" aria-modal aria-label="로그" onClick={(e) => e.stopPropagation()}>
            <Box title="로그" onClose={() => setLogOpen(false)}>
              <ol className="vn-log__list">
                {lines.slice(0, index + 1).map((l, i) => (
                  <li key={i} className="vn-log__item">
                    {(l.speaker || l.name) && <span className="vn-log__name">{l.speaker ? nameOf(l.speaker) : l.name}</span>}
                    <p className={l.speaker || l.name ? 'vn-log__text' : 'vn-log__text vn-log__text--narration'}>
                      {l.effect === 'system-error' && '[SYSTEM ERROR] '}
                      {fill(l.text)}
                    </p>
                  </li>
                ))}
              </ol>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}
