import { useEffect } from 'react';
import { loopSound } from '../utils/sfx';

interface Props {
  // 0~1
  progress: number;
  // 다 불러와서 서서히 사라지는 중
  leaving?: boolean;
}

// 심전도 선: 하트 양옆에 박동 파형, 하트 안은 평평하게 지나감 (viewBox 600x200, 기준선 y=100)
const ECG_PATH =
  'M0 100 H120 L132 92 L142 100 H156 L166 112 L178 30 L192 168 L204 86 L214 100 H386 L396 112 L408 30 L422 168 L434 86 L444 100 H458 L468 92 L478 100 H600';
const HEART_PATH =
  'M300 158 C262 130 238 108 238 82 C238 62 252 48 270 48 C284 48 294 56 300 68 C306 56 316 48 330 48 C348 48 362 62 362 82 C362 108 338 130 300 158 Z';
// 하트 위아래 끝 (차오르는 높이 계산용)
const HEART_TOP = 48;
const HEART_HEIGHT = 110;

// 이미지를 다 불러오기 전까지 깨진 그림 대신 보여주는 화면
export default function LoadingScreen({ progress, leaving = false }: Props) {
  const percent = Math.round(progress * 100);

  // 불러오는 동안 심장 소리 (사라지기 시작하면 서서히 멈춤)
  // 브라우저는 사용자가 화면을 누르기 전에는 소리를 막아서, 처음 접속하면 들리지 않을 수 있음
  useEffect(() => {
    if (!leaving) return loopSound('startHeartbeat');
  }, [leaving]);

  // 뒤에 미리 깔린 화면(시작 화면의 Enter 등)에 키 입력이 가지 않게 먼저 받아서 막음
  useEffect(() => {
    if (leaving) return;
    const block = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('keydown', block, true);
    return () => window.removeEventListener('keydown', block, true);
  }, [leaving]);
  return (
    <div className={leaving ? 'loading loading--leaving' : 'loading'} role="progressbar" aria-label="불러오는 중" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <svg className="loading__ecg" viewBox="0 0 600 200" aria-hidden="true">
        <defs>
          <clipPath id="loading-heart-clip">
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
        {/* 흐린 바탕 선 */}
        <path className="loading__ecg-base" d={ECG_PATH} />
        {/* 왼쪽→오른쪽으로 흐르는 빛줄기 (넓고 흐린 꼬리 + 좁고 밝은 머리) */}
        <path className="loading__ecg-tail" d={ECG_PATH} pathLength={100} />
        <path className="loading__ecg-pulse" d={ECG_PATH} pathLength={100} />
        <circle className="loading__ecg-dot" r="4">
          <animateMotion dur="2s" repeatCount="indefinite" path={ECG_PATH} keyPoints="0;1;1" keyTimes="0;0.877;1" calcMode="linear" />
        </circle>
        {/* 진행률만큼 아래부터 차오르는 하트 */}
        <g className="loading__heart">
          {/* 자르는 모양은 g에 걸어야 사각형을 내려도 하트 모양이 따라 움직이지 않음 */}
          <g clipPath="url(#loading-heart-clip)">
            <rect
              className="loading__heart-fill"
              x="230"
              y={HEART_TOP}
              width="140"
              height={HEART_HEIGHT}
              style={{ transform: `translateY(${(1 - progress) * HEART_HEIGHT}px)` }}
            />
          </g>
          <path className="loading__heart-line" d={HEART_PATH} />
        </g>
      </svg>
      <p className="loading__text">LOADING…</p>
      <span className="loading__percent">{percent}%</span>
    </div>
  );
}
