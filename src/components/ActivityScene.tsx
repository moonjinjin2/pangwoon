import { useEffect, useState, type CSSProperties } from 'react';
import DayMarks from './DayMarks';
import { ACTIVITY_ICONS } from './Icon';
import Button from './ui/Button';
import Panel from './ui/Panel';
import { ACTIVITIES, DAYS_PER_WEEK, type Activity, type Grade } from '../utils/activity';

const FRAME_MS = 400;
// 하루치 결과가 하나씩 뜨는 간격. 마지막 결과를 잠깐 보여준 뒤 종료
const DAY_MS = 700;
const PLAY_MS = DAY_MS * DAYS_PER_WEEK + 600;

interface Props {
  // 예: '4월 1주'
  weekLabel: string;
  activity: Activity;
  // 5일치 판정 결과 (미리 정해서 넘겨줌)
  days: Grade[];
  // 재생이 끝나거나 스킵하면 호출 (결과창은 메인 화면에서 띄움)
  onFinish: () => void;
}

export default function ActivityScene({ weekLabel, activity, days, onFinish }: Props) {
  const info = ACTIVITIES[activity];
  const [frame, setFrame] = useState(0);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    // 움짤이 없을 때만 컷을 직접 넘김
    const tick = info.animation ? undefined : setInterval(() => setFrame((f) => (f + 1) % info.frames.length), FRAME_MS);
    const reveal = setInterval(() => setRevealed((r) => Math.min(r + 1, DAYS_PER_WEEK)), DAY_MS);
    const end = setTimeout(onFinish, PLAY_MS);
    return () => {
      clearInterval(tick);
      clearInterval(reveal);
      clearTimeout(end);
    };
  }, [info.animation, info.frames.length, onFinish]);

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
            {info.animation ? (
              <img className="g-scene__animation" src={info.animation} alt={info.label} />
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
