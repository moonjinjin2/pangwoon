import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import Panel from './ui/Panel';

export interface GuideStep {
  title: string;
  text: string;
  // 빨간 글씨로 강조하는 주의 문구
  warn?: string;
  // 밝게 비출 화면 요소 (CSS 선택자, 여러 개면 모두 감싸는 영역). 없으면 화면 가운데에 설명만
  target?: string[];
}

interface Props {
  steps: GuideStep[];
  onClose: () => void;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

// 스포트라이트 여백, 말풍선과 스포트라이트·화면 가장자리 사이 간격
const SPOT_PAD = 8;
const GAP = 16;

// 선택자에 맞는 요소들을 모두 감싸는 영역 (하나도 없으면 null)
function measure(selectors: string[]): Box | null {
  const rects = selectors.flatMap((s) => [...document.querySelectorAll(s)]).map((el) => el.getBoundingClientRect());
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.left)) - SPOT_PAD;
  const top = Math.min(...rects.map((r) => r.top)) - SPOT_PAD;
  const right = Math.max(...rects.map((r) => r.right)) + SPOT_PAD;
  const bottom = Math.max(...rects.map((r) => r.bottom)) + SPOT_PAD;
  return { left, top, width: right - left, height: bottom - top };
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// 말풍선 위치: 스포트라이트의 오른쪽 → 왼쪽 → 아래 → 위 중 들어가는 곳 (없으면 화면 가운데)
function placeTip(spot: Box | null, tipW: number, tipH: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const center = { left: (vw - tipW) / 2, top: (vh - tipH) / 2 };
  if (!spot) return center;
  const alignY = clamp(spot.top, GAP, vh - tipH - GAP);
  const alignX = clamp(spot.left + spot.width / 2 - tipW / 2, GAP, vw - tipW - GAP);
  const candidates = [
    { left: spot.left + spot.width + GAP, top: alignY },
    { left: spot.left - tipW - GAP, top: alignY },
    { left: alignX, top: spot.top + spot.height + GAP },
    { left: alignX, top: spot.top - tipH - GAP },
  ];
  return (
    candidates.find((c) => c.left >= GAP && c.left + tipW <= vw - GAP && c.top >= GAP && c.top + tipH <= vh - GAP) ?? center
  );
}

// 메인 화면 첫 방문 가이드: 화면 요소를 하나씩 밝게 비추며 설명
export default function GuideTour({ steps, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState<Box | null>(null);
  const [tipPos, setTipPos] = useState<{ left: number; top: number } | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const step = steps[index];
  const last = index === steps.length - 1;

  const layout = useCallback(() => {
    const nextSpot = step.target ? measure(step.target) : null;
    setSpot(nextSpot);
    const tip = tipRef.current;
    if (tip) setTipPos(placeTip(nextSpot, tip.offsetWidth, tip.offsetHeight));
  }, [step]);

  useLayoutEffect(layout, [layout]);

  useEffect(() => {
    window.addEventListener('resize', layout);
    return () => window.removeEventListener('resize', layout);
  }, [layout]);

  const next = useCallback(() => (last ? onClose() : setIndex((i) => i + 1)), [last, onClose]);
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  // Enter·→: 다음, ←: 이전, Esc: 건너뛰기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, onClose]);

  return (
    <div className="guide" role="dialog" aria-modal aria-label="게임 가이드">
      <div
        className={spot ? 'guide__spot' : 'guide__spot guide__spot--none'}
        style={spot ? { left: spot.left, top: spot.top, width: spot.width, height: spot.height } : undefined}
        aria-hidden
      />
      <div ref={tipRef} className="guide__tip" style={tipPos ?? { visibility: 'hidden' }}>
        <Panel title="TIP!" icon="sparkle" extra={<span className="guide__step">{index + 1} / {steps.length}</span>}>
          <strong className="guide__title">{step.title}</strong>
          <p className="guide__text">{step.text}</p>
          {step.warn && <p className="guide__warn">{step.warn}</p>}
          <div className="guide__nav">
            <button type="button" className="guide__skip" onClick={onClose}>
              가이드 건너뛰기
            </button>
            <div className="guide__buttons">
              {index > 0 && (
                <Button className="guide__prev" onClick={prev}>
                  이전
                </Button>
              )}
              <Button onClick={next}>{last ? '시작하기' : '다음'}</Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
