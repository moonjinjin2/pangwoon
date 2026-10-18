import { useMemo } from 'react';
import type { CSSProperties } from 'react';

// 픽셀아트 꽃잎 도트 맵 (o: 외곽선, d: 그림자, f: 채움, h: 하이라이트, l: 가운데 결)
const PETAL = [
  '......ooooo.....',
  '....oohhhffoo...',
  '..oohhhhffffdoo.',
  '.ohhhhfffffffddo',
  'ohhfflllllllfddo',
  '.offfffffffddoo.',
  '..ooffffffddoo..',
  '....ooddddoo....',
  '......oooo......',
];

const COLORS: Record<string, string> = {
  o: '#e66fa7',
  d: '#f5a3c8',
  f: '#fbcfe2',
  h: '#fff3f8',
  l: '#f3a6c9',
};

function PetalSprite() {
  return (
    <svg viewBox={`0 0 ${PETAL[0].length} ${PETAL.length}`} shapeRendering="crispEdges">
      {PETAL.flatMap((row, y) =>
        [...row].map((c, x) =>
          COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[c]} /> : null,
        ),
      )}
    </svg>
  );
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// 인트로 배경 위로 벚꽃잎이 흩날리는 오버레이
export default function PetalFall({ count = 28 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: rand(20, 130),
        size: rand(24, 52),
        fall: rand(9, 18),
        delay: -rand(0, 18),
        sway: rand(2, 4),
        drift: rand(45, 85),
        tilt: rand(-30, 30),
        spin: rand(3, 7),
        opacity: rand(0.75, 1),
      })),
    [count],
  );

  return (
    <div className="petals" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.fall}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}vw`,
              '--tilt': `${p.tilt}deg`,
            } as CSSProperties
          }
        >
          <span className="petal__sway" style={{ animationDuration: `${p.sway}s`, animationDelay: `${p.delay}s` }}>
            <span className="petal__spin" style={{ animationDuration: `${p.spin}s`, animationDelay: `${p.delay}s` }}>
              <PetalSprite />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
