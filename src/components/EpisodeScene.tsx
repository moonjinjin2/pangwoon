import { useEffect, useState, type ReactNode } from 'react';
import backgroundImg from '../img/room.jpg';
import Box from './Box';
import { SPEAKERS, type Affection, type Choice, type Episode, type Heroine } from '../utils/episode';
import { formatFullDate } from '../utils/gameDate';

const TYPE_MS = 40;
// 자동 진행 시 문장이 다 나온 뒤 기다리는 시간
const AUTO_MS = 1500;

interface Props {
  // 현재 상황 창에 날짜 옆에 표시 (예: '데이트 · 민지')
  label: string;
  episode: Episode;
  // 'YYYY-MM-DD'
  date: string;
  // 배경 이미지 주소, 또는 직접 그린 배경
  background?: string | ReactNode;
  playerName: string;
  // 이번 에피소드에서 선택지로 바뀐 호감도 합계
  onDone: (affection: Partial<Affection>) => void;
}

export default function EpisodeScene({ label, episode, date, background = backgroundImg, playerName, onDone }: Props) {
  // 선택지를 고르면 그 답변 대사가 끼워지므로 대사 목록을 상태로 관리
  const [lines, setLines] = useState(episode.lines);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [affection, setAffection] = useState<Partial<Affection>>({});
  // 방금 고른 선택지의 호감도 변화 (다음 대사로 넘어가면 사라짐)
  const [feedback, setFeedback] = useState<Partial<Affection> | null>(null);
  const [auto, setAuto] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const fill = (text: string) => text.split('{name}').join(playerName);
  const nameOf = (speaker: keyof typeof SPEAKERS) => (speaker === 'player' ? playerName : SPEAKERS[speaker].name);

  const line = lines[index];
  const text = fill(line.text);
  const speaker = line.speaker && SPEAKERS[line.speaker];
  const speakerName = line.speaker && nameOf(line.speaker);
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
      img.decode().catch(() => {});
    }
  }, []);

  // 한 글자씩 타이핑
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setTyped((t) => t + 1), TYPE_MS);
    return () => clearTimeout(timer);
  }, [typing, typed]);

  const next = () => {
    setIndex(index + 1);
    setTyped(0);
  };

  // 타이핑 중이면 문장을 바로 다 보여주고, 아니면 다음 대사로 (선택지가 떠 있으면 무시)
  const advance = () => {
    if (typing) {
      setTyped(text.length);
    } else if (choosing) {
      return;
    } else if (index < lines.length - 1) {
      setFeedback(null);
      next();
    } else {
      onDone(affection);
    }
  };

  // 다음 선택지까지 건너뜀 (선택지가 더 없으면 에피소드 종료)
  const skip = () => {
    if (choosing) return;
    const target = lines.findIndex((l, i) => i >= index && l.choices);
    if (target === -1) {
      onDone(affection);
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
    if (!auto || typing || choosing || logOpen) return;
    const timer = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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

      <Box title="현재 상황" className="episode__status">
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
        {speaker && (
          <div className="vn__nameplate">
            <span className={`vn__portrait vn__portrait--${line.speaker}`} style={{ backgroundImage: `url(${speaker.image})` }} aria-hidden />
            <span className="vn__name">{speakerName}</span>
          </div>
        )}
        <div className="vn__panel">
          <p className={speaker ? 'vn__text' : 'vn__text vn__text--narration'}>{text.slice(0, typed)}</p>
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
                    {l.speaker && <span className="vn-log__name">{nameOf(l.speaker)}</span>}
                    <p className={l.speaker ? 'vn-log__text' : 'vn-log__text vn-log__text--narration'}>{fill(l.text)}</p>
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
