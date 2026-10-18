import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react';
import backgroundImg from '../img/cafe.jpg';
import desktopImg from '../img/windows.jpg';
import Box from './Box';
import ResultDialog from './ResultDialog';
import { SPEAKERS, parseGameEnd, type Affection, type Choice, type Episode, type GameEnd, type Heroine } from '../utils/episode';
import type { Effect } from '../utils/activity';
import { formatFullDate } from '../utils/gameDate';
import { DEFAULT_TEXT_SPEED, SETTINGS_KEYS, TEXT_SPEEDS, useStoredState } from '../utils/storage';

// 자동 진행 시 문장이 다 나온 뒤 기다리는 시간
const AUTO_MS = 1500;

// 게임 화면 전환 단계: 들어가는 전환 → 게임 중 → 나오는 전환(암전) → 에피소드로 복귀(밝아짐)
type GamePhase = 'enter' | 'play' | 'leave' | 'return';

// TODO(테스트용): 쯔꾸르가 아직 미완성이라 창 닫기(✕)로 나와도 엔딩 A + 예시 스탯으로 이어감
// 게임에서 game-end 메시지를 보내게 되면 {}로 바꿔서 엔딩·스탯 없이 끝나게 할 것
const EXIT_GAME_END: GameEnd = {
  ending: 'A',
  stats: { health: -20, strength: 10, intellect: 10, charm: 5, stress: 15 },
};

interface Props {
  // 상단 창 제목에 표시 (에피소드 #0, #1 …)
  number: number;
  // 상단 창에 날짜 옆에 표시 (예: '데이트 · 민지')
  label: string;
  episode: Episode;
  // 'YYYY-MM-DD'
  date: string;
  // 배경 이미지 주소, 또는 직접 그린 배경
  background?: string | ReactNode;
  playerName: string;
  // 이번 에피소드에서 선택지로 바뀐 호감도 합계, 게임에서 얻은 스탯 변화량
  onDone: (affection: Partial<Affection>, stats?: Effect) => void;
}

export default function EpisodeScene({ number, label, episode, date, background = episode.background ?? backgroundImg, playerName, onDone }: Props) {
  // 선택지를 고르면 그 답변 대사가 끼워지므로 대사 목록을 상태로 관리
  const [lines, setLines] = useState(episode.lines);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [affection, setAffection] = useState<Partial<Affection>>({});
  // 방금 고른 선택지의 호감도 변화 (다음 대사로 넘어가면 사라짐)
  const [feedback, setFeedback] = useState<Partial<Affection> | null>(null);
  const [auto, setAuto] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
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
  // 나레이션 중에도 마지막으로 말한 캐릭터 이미지를 유지해 다시 나타날 때 깜박이지 않게 함
  let shownSpeaker = line.speaker;
  for (let i = index; !shownSpeaker && i >= 0; i--) shownSpeaker = lines[i].speaker;
  // 아직 아무도 말하지 않았으면 처음 말할 캐릭터를 투명하게 깔아둠 (첫 등장도 페이드인)
  shownSpeaker ??= lines.find((l) => l.speaker)?.speaker;
  const typing = typed < text.length;
  const choosing = !typing && !!line.choices;

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
      onDone(affection, gameStats);
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
    setLines([...lines.slice(0, index + 1), ...choice.reply, ...lines.slice(index + 1)]);
    setAffection((prev) => {
      const sum = { ...prev };
      for (const [key, value] of Object.entries(choice.affection) as [Heroine, number][]) {
        sum[key] = (sum[key] ?? 0) + value;
      }
      return sum;
    });
    setFeedback(choice.affection);
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

  const feedbackItems = feedback ? (Object.entries(feedback) as [Heroine, number][]).filter(([, v]) => v !== 0) : [];

  return (
    <div className="episode" onClick={advance}>
      {typeof background === 'string' ? (
        <div className="episode__bg" style={{ backgroundImage: `url(${background})` }} />
      ) : (
        background
      )}

      {shownSpeaker && (
        <img
          className={`episode__character episode__character--${shownSpeaker}${speaker ? ' episode__character--shown' : ''}`}
          src={SPEAKERS[shownSpeaker].image}
          alt=""
        />
      )}

      <Box title={`에피소드 #${number}`} className="episode__status">
        <div className="status">
          <span className="status__icon" aria-hidden>
            {episode.icon ?? '💌'}
          </span>
          <div className="status__info">
            <strong className="status__title">{episode.title}</strong>
            <span className="status__date">
              {formatFullDate(date)} · {episode.time ?? label}
            </span>
          </div>
        </div>
      </Box>

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
        <ul className="episode__choices">
          {line.choices!.map((choice, i) => (
            <li key={i}>
              <button
                className="episode__choice"
                onClick={(e) => {
                  e.stopPropagation();
                  choose(choice);
                }}
              >
                <span className="episode__choice-key">{i + 1}</span>
                {choice.text}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="vn">
        {speakerName && (
          <div className="vn__nameplate">
            {speaker && (
              <span className={`vn__portrait vn__portrait--${line.speaker}`} style={{ backgroundImage: `url(${speaker.image})` }} aria-hidden />
            )}
            <span className="vn__name">{speakerName}</span>
          </div>
        )}
        <div className="vn__panel">
          <p className={speakerName ? 'vn__text' : 'vn__text vn__text--narration'}>{text.slice(0, typed)}</p>
          <div className="vn__controls" onClick={(e) => e.stopPropagation()}>
            <button className={auto ? 'vn__btn vn__btn--on' : 'vn__btn'} onClick={() => setAuto(!auto)}>
              <span aria-hidden>▶</span> 자동
            </button>
            <button className="vn__btn" onClick={() => setLogOpen(true)}>
              <span aria-hidden>☰</span> 로그
            </button>
            <button className="vn__btn" onClick={skip} disabled={choosing} title="ESC">
              <span aria-hidden>▶▶</span> 스킵
            </button>
            <span className={!typing && !choosing ? 'vn__next' : 'vn__next vn__next--hidden'} aria-hidden>
              ▼
            </span>
          </div>
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
        <ResultDialog title="게임 결과" changes={gameStats} onConfirm={() => onDone(affection, gameStats)} />
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
                    <p className={l.speaker || l.name ? 'vn-log__text' : 'vn-log__text vn-log__text--narration'}>{fill(l.text)}</p>
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
