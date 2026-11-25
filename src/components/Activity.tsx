import { ReactNode, useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Icon, { ACTIVITY_ICONS } from './Icon';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Panel from './ui/Panel';
import {
  ACTIVITIES,
  ACTIVITY_ORDER,
  DAYS_PER_WEEK,
  Effect,
  getAnimation,
  getWeekCost,
  getWeekResult,
  isGoodChange,
  type Activity,
  type Grade,
} from '../utils/activity';
import { STAT_LABELS } from './StatsBox';
import { useFreshGif } from '../utils/media';
import { playSound, usePlayOnce, type Sound } from '../utils/sfx';

// 주간 활동 화면 모음: 고르기(ActivityModal) → 진행 연출(ActivityScene) → 결과(ActivityResult)

/* ───────── 활동 고르기 ───────── */

interface ModalProps {
  title: string;
  current: Activity;
  onSelect: (activity: Activity) => void;
  onClose: () => void;
}

const GRID_ACTIVITIES = ACTIVITY_ORDER.filter((key) => key !== 'blood');

export function ActivityModal({ title, current, onSelect, onClose }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // 스케줄 카드(backdrop-filter)가 fixed 기준이 되지 않도록 body에 띄워 화면 가운데에 둠
  return createPortal(
    <Dialog title={title} icon="calendar" onClose={onClose} closeOnBackdrop className="g-activity-dialog">
      <div className="g-activities">
        {GRID_ACTIVITIES.map((key) => {
          const cost = getWeekCost(key);
          return (
            <button
              key={key}
              type="button"
              data-sfx="confirm"
              className={key === current ? 'g-activity g-activity--current' : 'g-activity'}
              onClick={() => onSelect(key)}
            >
              <span className="g-activity__icon">
                <Icon name={ACTIVITY_ICONS[key]} />
              </span>
              <span className="g-activity__label">{ACTIVITIES[key].label}</span>
              {cost > 0 && <span className="g-activity__cost">-{cost.toLocaleString()}원</span>}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        data-sfx="confirm"
        className={['g-activity g-activity--blood', current === 'blood' && 'g-activity--current'].filter(Boolean).join(' ')}
        onClick={() => onSelect('blood')}
      >
        <span className="g-activity__icon">
          <Icon name={ACTIVITY_ICONS.blood} />
        </span>
        <span className="g-activity__info">
          <span className="g-activity__label">{ACTIVITIES.blood.label}</span>
          <span className="g-activity__warning">돈을 많이 벌 수 있지만 체력이 크게 깎여요. 몸 상태를 꼭 확인하세요.</span>
        </span>
      </button>
    </Dialog>,
    document.body,
  );
}

/* ───────── 활동 진행 연출 ───────── */

const FRAME_MS = 400;
// 하루치 결과가 하나씩 뜨는 간격. 마지막 결과를 잠깐 보여준 뒤 종료
const DAY_MS = 700;
const PLAY_MS = DAY_MS * DAYS_PER_WEEK + 600;

interface SceneProps {
  // 예: '4월 1주'
  weekLabel: string;
  activity: Activity;
  // 5일치 판정 결과 (미리 정해서 넘겨줌)
  days: Grade[];
  // 재생이 끝나거나 스킵하면 호출 (결과창은 메인 화면에서 띄움)
  onFinish: () => void;
}

export function ActivityScene({ weekLabel, activity, days, onFinish }: SceneProps) {
  const info = ACTIVITIES[activity];
  // 5일치 결과는 미리 정해져 있으므로 평균 판정(성공/보통/실패)에 맞는 움짤을 처음부터 보여줌
  const animation = getAnimation(activity, days);
  const animationUrl = useFreshGif(animation);
  const [frame, setFrame] = useState(0);
  const [revealed, setRevealed] = useState(0);
  // 요일 판정이 뜰 때마다 성공·보통·실패 소리
  useEffect(() => {
    if (revealed > 0) playSound(DAY_SOUNDS[days[revealed - 1]]);
  }, [revealed, days]);

  useEffect(() => {
    // 움짤이 없을 때만 컷을 직접 넘김
    const tick = animation ? undefined : setInterval(() => setFrame((f) => (f + 1) % info.frames.length), FRAME_MS);
    const reveal = setInterval(() => setRevealed((r) => Math.min(r + 1, DAYS_PER_WEEK)), DAY_MS);
    const end = setTimeout(onFinish, PLAY_MS);
    return () => {
      clearInterval(tick);
      clearInterval(reveal);
      clearTimeout(end);
    };
  }, [animation, info.frames.length, onFinish]);

  // Enter / Space로 스킵 (꾹 누르고 있을 때 결과창까지 넘어가지 않도록 반복 입력은 무시)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        onFinish();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish]);

  return (
    <div className="g-scene" style={{ '--scene-duration': `${PLAY_MS}ms` } as CSSProperties}>
      <div className="g-scene__window">
        <Panel title={`${weekLabel} · ${info.label}`} icon={ACTIVITY_ICONS[activity]}>
          <div className="g-scene__stage">
            {animation ? (
              animationUrl && <img className="g-scene__animation" src={animationUrl} alt={info.label} />
            ) : (
              <span className="g-scene__frame" aria-hidden>{info.frames[frame]}</span>
            )}
          </div>
          <DayMarks days={days} revealed={revealed} />
          <div className="g-scene__progress" aria-hidden>
            <div className="g-scene__progress-fill" />
          </div>
        </Panel>
      </div>
      <Button className="g-scene__skip" onClick={onFinish}>
        <span>SKIP ▶▶</span>
        <span className="g-scene__skip-hint">Space / Enter</span>
      </Button>
    </div>
  );
}

const DAY_NAMES = ['월', '화', '수', '목', '금'];

const DAY_SOUNDS: Record<Grade, Sound> = { success: 'daySuccess', normal: 'daySoso', fail: 'dayFail' };

const MARK_ICONS: Record<Grade, ReactNode> = {
  success: <circle cx="10" cy="10" r="6.5" />,
  normal: <path d="M10 3.5 16.5 15.5H3.5z" />,
  fail: <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />,
};

interface DayMarkProps {
  days: Grade[];
  // 앞에서부터 몇 개를 공개할지 (기본: 전부)
  revealed?: number;
}

const GRADE_LABELS: Record<Grade, string> = { success: '성공', normal: '보통', fail: '실패' };

// 5일치 성공(○)/보통(△)/실패(✕) 표시
export default function DayMarks({ days, revealed = days.length }: DayMarkProps) {
  return (
    <ol className="days">
      {days.map((grade, i) => {
        const shown = i < revealed;
        return (
          <li key={i} className="days__item">
            <span className="days__name">{DAY_NAMES[i]}</span>
            <span
              className={shown ? `days__mark days__mark--${grade}` : 'days__mark'}
              aria-label={shown ? GRADE_LABELS[grade] : '진행 전'}
            >
              {shown && (
                <svg viewBox="0 0 20 20" aria-hidden>
                  {MARK_ICONS[grade]}
                </svg>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────── 활동 결과 ───────── */

interface ResultProps {
  activity: Activity;
  days: Grade[];
  onConfirm: () => void;
}

// 주차 활동이 끝난 뒤 메인 화면 위에 띄우는 결과창
export function ActivityResult({ activity, days, onConfirm }: ResultProps) {
  const info = ACTIVITIES[activity];
  usePlayOnce('weekResult');

  return (
    <ResultDialog
      title={
        <>
          {info.label} 완료!
        </>
      }
      changes={getWeekResult(activity, days)}
      onConfirm={onConfirm}
    >
      <DayMarks days={days} />
    </ResultDialog>
  );
}

interface ResultDialogProps {
  title: ReactNode;
  // 제목 아래 추가로 보여줄 내용 (예: 성공/실패 표시)
  children?: ReactNode;
  changes: Effect;
  onConfirm: () => void;
}

export function effectLabel(key: keyof Effect) {
  return key === 'coins' ? '자금' : STAT_LABELS[key];
}

// 스탯·자금 변화량을 보여주는 결과창 (활동 결과, 게임 결과에서 같이 씀)
export function ResultDialog({ title, children, changes, onConfirm }: ResultDialogProps) {
  const items = Object.entries(changes) as [keyof Effect, number][];

  return (
    <Dialog title="결과" icon="sparkle" onClose={onConfirm} className="g-result-dialog">
      <div className="g-result">
        <h3 className="g-result__title">{title}</h3>
        {children}
        <ul className="g-result__list">
          {items.map(([key, value]) => {
            const good = isGoodChange(key, value);
            return (
              <li key={key} className="g-result__item">
                <span>{effectLabel(key)}</span>
                <span className={good ? 'g-result__value g-result__value--good' : 'g-result__value g-result__value--bad'}>
                  {value >= 0 ? '+' : ''}
                  {value.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
        <Button className="g-result__confirm" onClick={onConfirm} autoFocus>
          확인
        </Button>
      </div>
    </Dialog>
  );
}
