import { useEffect, useRef, useState } from 'react';

// 앱 시작 때 게임에서 쓰는 이미지를 모두 미리 불러옴 (데이트 일러스트·아이템 아이콘 포함, 이후 화면에서는 따로 기다리지 않음)
// 지금 쓰지 않는 이미지도 빼서 받지 않게 함 (새 이미지를 안 쓰게 되면 여기에도 추가)
export const CORE_IMAGES = Object.values(
  import.meta.glob<string>(
    [
      '../img/**/*.{png,jpg,jpeg,gif,webp}',
      '!../img/logo.png',
      '!../img/study.gif',
      '!../img/exercise.gif',
      '!../img/work.gif',
      '!../img/background/cafe.jpg',
      '!../img/background/bar.png',
      '!../img/background/rooftop.png',
      '!../img/background/ballet_studio.png',
      '!../img/background/ballet_theater.png',
      '!../img/background/intro_background.png',
      '!../img/background/room_test.jpg',
      '!../img/character/minji/minji.png',
      '!../img/character/emily/emily.png',
      '!../img/character/hayeong/hayeong.png',
      '!../img/character/hayeong/hayeong_whole.png',
      '!../img/character/hayeong/hayeong_default.png',
      // 아직 장면에 배치하지 않은 일러스트
      '!../img/episode/00_*.png',
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
    () => { },
  );
}

// 곧 보여줄 이미지를 미리 디코딩해 둠
// (처음에 모두 불러왔어도 브라우저가 메모리를 아끼려고 디코딩한 그림을 버리면, 보여주는 순간 다시 디코딩하느라 화면이 멈칫함)
const warming = new Map<string, HTMLImageElement>();
const WARM_LIMIT = 8;

export function warmImage(url: string) {
  const prev = warming.get(url);
  if (prev) {
    // 최근에 쓴 순서로 다시 넣음
    warming.delete(url);
    warming.set(url, prev);
    return;
  }
  const img = new Image();
  img.src = url;
  img.decode().catch(() => {});
  warming.set(url, img);
  // 오래된 것부터 놓아줌
  while (warming.size > WARM_LIMIT) warming.delete(warming.keys().next().value!);
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
// 진행 막대는 실제 진행률과 경과 시간 중 느린 쪽을 따라 차오르되, 실제 진행률이 한 번에 뛰어도 정해진 속도 이상으로는 빨라지지 않음
// 다 차면 holdMs 동안 꽉 찬 모습을 보여준 뒤 fadeMs 동안 서서히 사라짐
// 가장 빠르게 차오르는 속도 (밀리초당 진행률, 바닥부터 끝까지 최소 0.8초)
const MAX_FILL_RATE = 1 / 800;

export function useMinLoading(done: boolean, progress: number, minMs: number, fadeMs: number, holdMs = 500) {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  // 프레임 반복 안에서 최신 값을 읽도록 붙잡아 둠
  const latest = useRef({ done, progress });
  latest.current = { done, progress };

  useEffect(() => {
    // 로딩 화면이 실제로 처음 그려진 프레임부터 셈
    // (처음에 이미지를 받느라 첫 프레임이 늦게 그려지면, 마운트 시점부터 세는 경우 화면이 보이자마자 시간이 다 지나 있음)
    let start: number | null = null;
    let last: number | null = null;
    let value = 0;
    let fullAt: number | null = null;
    let frame = requestAnimationFrame(function tick(now) {
      start ??= now;
      const dt = last === null ? 0 : now - last;
      last = now;
      const { done, progress } = latest.current;
      const goal = Math.min(done ? 1 : progress, (now - start) / minMs);
      value = Math.max(value, Math.min(goal, value + dt * MAX_FILL_RATE));
      setShown(value);
      if (done && value >= 1) {
        fullAt ??= now;
        // 꽉 찬 하트를 잠깐 보여준 뒤 사라지기 시작 (사라지는 동안은 프레임을 돌리지 않음)
        if (now - fullAt >= holdMs) {
          setLeaving(true);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [minMs, holdMs]);

  // 사라지는 동안은 타이머로 마무리
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setGone(true), fadeMs);
    return () => clearTimeout(timer);
  }, [leaving, fadeMs]);

  return { progress: shown, leaving, gone };
}
