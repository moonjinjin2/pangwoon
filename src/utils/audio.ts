// 효과음·더빙 음성 공용 재생기 (Web Audio)
// 소리마다 <audio>를 새로 만들면 브라우저 재생기가 계속 쌓여서, 에피소드 중반부터 대사를 넘길 때 화면이 멈칫함
// 그래서 파일은 한 번만 받아 풀어 두고(AudioBuffer), 재생할 때는 가벼운 재생 노드만 만들었다가 끝나면 버림

type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;

export function context() {
  if (ctx) return ctx;
  const Ctor: AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: AudioContextCtor }).webkitAudioContext;
  ctx = new Ctor();
  // iOS Safari: 무음 스위치를 켜 둬도 <audio>처럼 소리가 나게 함 (지원하는 버전에서만)
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session) session.type = 'playback';
  // 브라우저는 사용자가 화면을 누르기 전에는 소리를 막아 두므로, 누르거나 키를 칠 때마다 다시 켬
  // (Safari·iOS는 클릭·터치가 끝나는 순간에만 풀어 주고, 그 순간에 실제로 소리를 한 번 내야 풀리기도 해서 무음을 짧게 재생)
  const unlock = () => {
    if (!ctx || ctx.state === 'running') return;
    ctx.resume().catch(() => {});
    const silent = ctx.createBufferSource();
    silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    silent.connect(ctx.destination);
    silent.start(0);
  };
  for (const type of ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown']) {
    document.addEventListener(type, unlock, true);
  }
  return ctx;
}

// 풀어 둔 소리 (최근에 쓴 것부터 남기고 오래된 것은 버림. 더빙 음성까지 모두 들고 있으면 메모리를 많이 씀)
const CACHE_LIMIT = 48;
const buffers = new Map<string, Promise<AudioBuffer | null>>();

// 소리 파일을 받아 풀어 둠 (곧 재생할 소리를 미리 준비할 때도 씀)
export function loadSound(url: string): Promise<AudioBuffer | null> {
  const cached = buffers.get(url);
  if (cached) {
    buffers.delete(url);
    buffers.set(url, cached);
    return cached;
  }
  const audio = context();
  const loading = fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => audio.decodeAudioData(data))
    .catch(() => null);
  buffers.set(url, loading);
  while (buffers.size > CACHE_LIMIT) buffers.delete(buffers.keys().next().value!);
  return loading;
}

export interface Playback {
  // 음량 (0~1)
  setVolume(volume: number): void;
  // 바로 멈춤
  stop(): void;
  // 서서히 줄이며 멈춤
  fadeOut(ms?: number): void;
  // 끝까지 재생했거나, 멈췄거나, 재생할 수 없을 때 끝남
  ended: Promise<void>;
}

interface PlayOptions {
  volume?: number;
  loop?: boolean;
  // 앞에서부터 이 길이(초)만 재생
  duration?: number;
}

// 소리가 막혀 있는지(사용자가 아직 화면을 누르지 않음) 확인하기까지 기다리는 시간
// (Safari는 오디오를 다시 켜는 데 시간이 걸려서 너무 짧으면 첫 클릭 소리가 끊김)
const BLOCKED_CHECK_MS = 1000;

export function playUrl(url: string, { volume = 1, loop = false, duration }: PlayOptions = {}): Playback {
  const audio = context();
  const gain = audio.createGain();
  gain.gain.value = volume;
  gain.connect(audio.destination);

  let source: AudioBufferSourceNode | null = null;
  let done = false;
  let finish!: () => void;
  const ended = new Promise<void>((resolve) => (finish = resolve));

  const stop = () => {
    if (done) return;
    done = true;
    try {
      source?.stop();
    } catch {
      // 아직 시작 전이면 무시
    }
    gain.disconnect();
    finish();
  };

  if (audio.state !== 'running') {
    audio.resume().catch(() => {});
    // 자동 재생이 막혀 있으면 소리 없이 끝난 것으로 처리 (자동 진행이 음성을 기다리며 멈추지 않게)
    window.setTimeout(() => {
      if (audio.state !== 'running') stop();
    }, BLOCKED_CHECK_MS);
  }

  loadSound(url).then((buffer) => {
    if (done) return;
    if (!buffer) {
      stop();
      return;
    }
    source = audio.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(gain);
    source.addEventListener('ended', stop);
    // Safari는 길이 자리에 undefined를 넘기면 0초로 받아 소리가 안 나므로, 길이가 없으면 아예 넘기지 않음
    if (duration === undefined) source.start(0);
    else source.start(0, 0, duration);
  });

  return {
    setVolume(next) {
      gain.gain.value = next;
    },
    stop,
    fadeOut(ms = 300) {
      if (done) return;
      const now = audio.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + ms / 1000);
      window.setTimeout(stop, ms);
    },
    ended,
  };
}
