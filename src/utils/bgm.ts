import { useEffect, useRef } from 'react';
import { context } from './audio';
import { MAIN_EPISODE_MONTHS, getEpisode, type Episode } from './episode';
import { SETTINGS_KEYS, load, loadJSON, remove, save, setStoredState, useStoredState } from './storage';

// 배경음악 (효과음과 같은 src/sfx 폴더에 둠)
// - main_bgm: 메인 화면
// - '5월 가면무도회'처럼 'N월'로 시작: 그 달 메인 에피소드 (뒤 제목은 자유, '7,8월 바다'처럼 여러 달을 쉼표로 묶어도 됨)
// 곡이 길어서 효과음처럼 통째로 풀어 두지 않고 <audio>로 흘려 받으며 재생하고,
// 음량은 Web Audio 음량 노드로 조절함 (iOS는 <audio>의 volume을 무시해서)
const BGM_NAME = /^(main_bgm|\d+(,\d+)*월(\s.*)?)$/;

// 효과음 목록(sfx.ts)에서 배경음악 파일을 빼는 데도 씀
export function isBgmName(name: string) {
  return BGM_NAME.test(name);
}

const files = import.meta.glob<string>('../sfx/*.{mp3,wav,m4a}', { eager: true, query: '?url', import: 'default' });

const BGM: Record<string, string> = Object.fromEntries(
  Object.entries(files)
    .map(([path, url]) => [path.slice('../sfx/'.length).replace(/\.(mp3|wav|m4a)$/, '').normalize('NFC'), url])
    .filter(([name]) => isBgmName(name)),
);

export const MAIN_BGM: string | undefined = BGM.main_bgm;

// 달 번호 → 그 달 에피소드 배경음악 ('5월 가면무도회' → 5, '7,8월 바다' → 7과 8)
const MONTH_BGM: Record<number, string> = Object.fromEntries(
  Object.entries(BGM).flatMap(([name, url]) => {
    const months = name.match(/^(\d+(?:,\d+)*)월/)?.[1];
    return months ? months.split(',').map((m) => [Number(m), url] as const) : [];
  }),
);

// 메인 에피소드의 배경음악 (데이트·프롤로그나 아직 파일이 없는 달은 undefined)
// 다시 보기·테스트 화면에서도 같은 곡이 나오게 에피소드 id로 그 달을 찾음
export function episodeBgm(episode: Episode): string | undefined {
  const month = MAIN_EPISODE_MONTHS.find((m) => getEpisode(m).id === episode.id);
  return month === undefined ? undefined : MONTH_BGM[month];
}

// 곡을 바꿀 때 서서히 줄이고 키우는 시간
const FADE_MS = 800;

interface Track {
  el: HTMLAudioElement;
  gain: GainNode;
  pauseTimer?: number;
}

const tracks = new Map<string, Track>();
// 지금 틀어야 하는 곡 요청들 (나중에 연 화면이 위에 쌓임. 맨 위 요청의 곡을 틀고, null이면 무음)
const requests: { id: number; url: string | null }[] = [];
let nextId = 0;
let current: string | null = null;
let volume = 0.5;

function getTrack(url: string): Track {
  let track = tracks.get(url);
  if (track) return track;
  const ctx = context();
  const el = new Audio(url);
  el.loop = true;
  el.preload = 'auto';
  const gain = ctx.createGain();
  gain.gain.value = 0;
  ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
  track = { el, gain };
  tracks.set(url, track);
  return track;
}

function rampTo(track: Track, target: number, ms: number) {
  const { gain } = track;
  const now = context().currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
}

// 브라우저가 아직 자동 재생을 막고 있으면 실패하므로, 화면을 누르거나 키를 칠 때 다시 시도함
function tryPlay(track: Track) {
  if (track.el.paused) track.el.play().catch(() => {});
}

function update() {
  const want = requests.at(-1)?.url ?? null;
  if (want === current) return;
  if (current) {
    const old = getTrack(current);
    rampTo(old, 0, FADE_MS);
    window.clearTimeout(old.pauseTimer);
    old.pauseTimer = window.setTimeout(() => old.el.pause(), FADE_MS);
  }
  current = want;
  if (!want) return;
  const track = getTrack(want);
  window.clearTimeout(track.pauseTimer);
  // 완전히 멈췄던 곡은 처음부터 (서서히 꺼지던 도중이면 이어서)
  if (track.el.paused) track.el.currentTime = 0;
  rampTo(track, volume, FADE_MS);
  tryPlay(track);
}

let installed = false;
function installUnlock() {
  if (installed) return;
  installed = true;
  const retry = () => {
    if (current) tryPlay(getTrack(current));
  };
  for (const type of ['pointerdown', 'touchend', 'click', 'keydown']) document.addEventListener(type, retry, true);
}

// 다음 음량 변경을 서서히 바꿀 시간 (에피소드에서 저절로 낮추고 돌려놓을 때. 슬라이더를 움직일 때는 바로 반영)
let nextVolumeFadeMs = 100;

function setVolume(next: number) {
  // 여러 화면이 같은 음량을 알려 와도 진행 중인 페이드를 끊지 않게
  if (next === volume) return;
  volume = next;
  if (current) rampTo(getTrack(current), volume, nextVolumeFadeMs);
  nextVolumeFadeMs = 100;
}

// 이 화면이 떠 있는 동안 url 곡을 틂 (null·undefined면 무음, 화면이 닫히면 그 전 화면의 곡으로 돌아감)
export function useBgm(url: string | null | undefined) {
  const [bgmVolume] = useStoredState(SETTINGS_KEYS.bgmVolume, 50);

  useEffect(() => {
    setVolume(Math.min(Math.max(bgmVolume, 0), 100) / 100);
  }, [bgmVolume]);

  // 화면이 열린 순서대로 자리를 잡고, 곡이 바뀌어도 그 자리에서 바꿈 (위에 열린 화면의 곡을 덮지 않게)
  const id = useRef(-1);
  useEffect(() => {
    installUnlock();
    id.current = nextId++;
    requests.push({ id: id.current, url: null });
    return () => {
      const i = requests.findIndex((r) => r.id === id.current);
      if (i >= 0) requests.splice(i, 1);
      update();
    };
  }, []);

  useEffect(() => {
    const request = requests.find((r) => r.id === id.current);
    if (request) request.url = url ?? null;
    update();
  }, [url]);
}

// 잠시 낮춘 배경음악 음량을 돌려놓을 때 쓰는 기록 { from: 원래 음량, to: 낮춘 음량 }
// (에피소드 도중 새로고침하거나 창을 닫아도 다음에 들어오면 돌려놓음)
const LOWERED_KEY = 'bgmVolumeLowered';

interface Lowered {
  from: number;
  to: number;
}

function restoreVolume({ from, to }: Lowered) {
  remove(LOWERED_KEY);
  // 낮춘 뒤 직접 음량을 바꿨으면 그 값을 그대로 둠
  if (loadJSON<number>(SETTINGS_KEYS.bgmVolume, 50) !== to) return;
  nextVolumeFadeMs = FADE_MS;
  setStoredState(SETTINGS_KEYS.bgmVolume, from);
}

const leftover = load(LOWERED_KEY);
if (leftover !== null) {
  try {
    restoreVolume(JSON.parse(leftover) as Lowered);
  } catch {
    remove(LOWERED_KEY);
  }
}

// lower가 true인 동안 설정의 배경음악 음량을 to까지 낮추고 (이미 더 낮으면 그대로), false가 되거나 화면이 닫히면 원래대로 돌려놓음
export function useLowerBgmVolume(lower: boolean, to: number) {
  useEffect(() => {
    if (!lower) return;
    const from = loadJSON<number>(SETTINGS_KEYS.bgmVolume, 50);
    if (from <= to) return;
    const lowered: Lowered = { from, to };
    save(LOWERED_KEY, JSON.stringify(lowered));
    nextVolumeFadeMs = FADE_MS;
    setStoredState(SETTINGS_KEYS.bgmVolume, to);
    return () => restoreVolume(lowered);
  }, [lower, to]);
}
