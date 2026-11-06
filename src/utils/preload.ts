import { useEffect, useState } from 'react';

// 앱 시작 때 미리 불러올 이미지 (데이트 일러스트는 용량이 커서 컬렉션·데이트 화면을 열 때 필요한 것만 불러옴)
// 지금 쓰지 않는 이미지도 빼서 받지 않게 함 (새 이미지를 안 쓰게 되면 여기에도 추가)
export const CORE_IMAGES = Object.values(
  import.meta.glob<string>(
    [
      '../img/**/*.{png,jpg,jpeg,gif,webp}',
      '!../img/date_art/**',
      '!../img/logo.png',
      '!../img/room3.png',
      '!../img/character/hayeong/hayeong.png',
      '!../img/character/emily/emily.png',
      '!../img/character/minji/minji.png',
    ],
    { eager: true, query: '?url', import: 'default' },
  ),
);

// 불러온 이미지를 붙잡아 둬서 브라우저 메모리 캐시에서 바로 그려지게 함
const loaded = new Map<string, HTMLImageElement>();

function loadImage(url: string) {
  if (loaded.has(url)) return Promise.resolve();
  const img = new Image();
  img.src = url;
  // 실패해도 로딩 화면에서 멈추지 않게 그냥 넘어감
  return img.decode().then(
    () => void loaded.set(url, img),
    () => {},
  );
}

// 이미지를 모두 불러올 때까지 진행률(0~1)을 알려줌. 이미 불러온 이미지는 바로 끝남
export function usePreload(urls: string[]) {
  const pending = urls.filter((url) => !loaded.has(url));
  const [count, setCount] = useState(0);
  const key = pending.join('|');

  useEffect(() => {
    let alive = true;
    setCount(0);
    for (const url of key ? key.split('|') : []) {
      loadImage(url).then(() => {
        if (alive) setCount((c) => c + 1);
      });
    }
    return () => {
      alive = false;
    };
  }, [key]);

  const total = pending.length;
  return { done: count >= total, progress: total ? count / total : 1 };
}

// 로딩 화면을 최소 minMs 동안 보여줌 (이미 캐시돼 있어 바로 끝나면 화면이 번쩍 지나가 깜박이는 것처럼 보이므로)
// 진행 막대는 실제 진행률과 경과 시간 중 느린 쪽을 따라 부드럽게 차오르고, 다 차면 fadeMs 동안 서서히 사라짐
export function useMinLoading(done: boolean, progress: number, minMs: number, fadeMs: number) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // 로딩 화면이 실제로 처음 그려진 프레임부터 셈
    // (처음에 이미지를 받느라 첫 프레임이 늦게 그려지면, 마운트 시점부터 세는 경우 화면이 보이자마자 시간이 다 지나 있음)
    let start: number | null = null;
    let frame = requestAnimationFrame(function tick(now) {
      start ??= now;
      const t = now - start;
      setElapsed(t);
      if (t < minMs + fadeMs) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [minMs, fadeMs]);

  const shownProgress = Math.min(progress, elapsed / minMs);
  const full = done && elapsed >= minMs;
  // 다 찬 순간부터 사라지기 시작
  const [fadeStart, setFadeStart] = useState<number | null>(null);
  useEffect(() => {
    if (full && fadeStart === null) setFadeStart(elapsed);
  }, [full, fadeStart, elapsed]);

  // 진행이 끝나도 렌더링 프레임이 멈추지 않게, 사라지는 동안은 타이머로 마무리
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (fadeStart === null) return;
    const timer = setTimeout(() => setGone(true), fadeMs);
    return () => clearTimeout(timer);
  }, [fadeStart, fadeMs]);

  return { progress: full ? 1 : shownProgress, leaving: fadeStart !== null, gone };
}
