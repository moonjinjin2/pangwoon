import { useEffect, useRef } from 'react';
import { load, SETTINGS_KEYS } from './storage';
import type { Rarity } from './gacha';

// 효과음 (src/sfx). 더빙 음성처럼 <audio>로 재생해 Safari에서도 소리가 남
// 파일 이름 앞 번호(01_ ~ 21_)로 찾으므로, 효과음 목록 번호대로 파일을 넣기만 하면 자동으로 적용됨 (없는 번호는 조용히 넘어감)
const files = import.meta.glob<string>('../sfx/*.{mp3,wav}', { eager: true, query: '?url', import: 'default' });

// '01' 같은 번호, 번호가 없는 파일은 이름 그대로 ('click', 'card_flip', 'gacha_ing')
// macOS에서 넣은 한글 파일 이름은 자모가 분리된 형태(NFD)라 NFC로 맞춤
const FILES: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => {
    const name = path.slice('../sfx/'.length).replace(/\.(mp3|wav)$/, '').normalize('NFC');
    return [name.match(/^(\d+)_/)?.[1] ?? name, url];
  }),
);

// 효과음 목록 번호
const SOUNDS = {
  select: '01', // 메뉴·선택지 등 기본 클릭
  back: '02', // 뒤로 가거나 창을 닫을 때
  confirm: '03', // 일정 확정·진행하기
  page: '04', // 가이드 다음 장·로그·앨범 열기
  startHeartbeat: '05', // 처음 로딩 화면
  speech: '06', // 대사 출력
  likability: '07', // 호감도 상승 문구
  fastHeartbeat: '08', // 건강 위험·위험도 높음 (반복)
  exposed: '09', // 정체 발각
  warning: '10', // 위험 안내문구
  dead: '11', // 배드엔딩
  daySuccess: '12', // 요일 판정 성공
  daySoso: '13', // 요일 판정 보통
  dayFail: '14', // 요일 판정 실패
  weekResult: '15', // 주간 활동 합산 결과창
  coins: '16', // 가챠 결제
  gachaOpen: '17', // 가챠 개봉 연출
  itemNR: '18', // N·R 등급 공개
  itemSR: '19', // SR·SSR 등급 공개
  itemSSS: '20', // SSS 등급 공개
  itemUse: '21', // 아이템 사용
  cardFlip: 'card_flip', // 여러 개 뽑기에서 카드 뒤집기 (휙-탁, 직접 합성한 소리)
} as const;

export type Sound = keyof typeof SOUNDS;

// 아직 파일이 없는 번호는 임시 소리로 대신함
const FALLBACKS: Partial<Record<Sound, string>> = {
  select: 'click', // 볼펜 딸깍에서 딸·깍 두 번만 잘라낸 소리
  back: 'click',
  confirm: 'click',
  page: 'click',
  gachaOpen: 'gacha_ing', // 약 3.9초 동안 점점 커지는 소리 (결과가 나오기 전 연출 4초에 맞춤)
};

function soundUrl(sound: Sound) {
  const fallback = FALLBACKS[sound];
  return FILES[SOUNDS[sound]] ?? (fallback ? FILES[fallback] : undefined);
}

export const DEFAULT_SFX_VOLUME = 70;

// 설정의 효과음 음량 (0~1)
function sfxVolume() {
  const raw = load(SETTINGS_KEYS.sfxVolume);
  const value = raw === null ? DEFAULT_SFX_VOLUME : Number(raw);
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) / 100 : DEFAULT_SFX_VOLUME / 100;
}

// 파일이 없거나 음량이 0이면 재생하지 않고 null
export function playSound(sound: Sound) {
  const url = soundUrl(sound);
  const volume = sfxVolume();
  if (!url || volume <= 0) return null;
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(() => {});
  return audio;
}

// 화면이 처음 뜰 때(when이 처음 true가 될 때) 한 번만 재생
// (개발 모드 StrictMode에서 효과가 두 번 돌아도 한 번만 울림)
export function usePlayOnce(sound: Sound, when = true) {
  const played = useRef(false);
  useEffect(() => {
    if (!when || played.current) return;
    played.current = true;
    playSound(sound);
  }, [sound, when]);
}

// 서서히 줄이며 멈춤
function fadeOut(audio: HTMLAudioElement) {
  const step = audio.volume / 10;
  const timer = window.setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);
    if (audio.volume > 0) return;
    audio.pause();
    window.clearInterval(timer);
  }, 30);
}

// 돌려준 함수를 부르면 (한 번만) 서서히 멈춤
function stopper(audio: HTMLAudioElement | null) {
  let stopped = false;
  return () => {
    if (!audio || stopped) return;
    stopped = true;
    fadeOut(audio);
  };
}

// 반복 재생 (심장 소리)
export function loopSound(sound: Sound) {
  const audio = playSound(sound);
  if (audio) audio.loop = true;
  return stopper(audio);
}

// 임시 소리 gacha_ing.mp3 맨 끝(3.9초)의 '틱' 잡음 직전에 멈춤
const GACHA_ING_END_MS = 3880;

// 가챠 개봉 연출 소리 (연출을 건너뛰어 결과가 바로 나오면 멈춤)
export function playGachaOpen() {
  const audio = playSound('gachaOpen');
  if (audio && !FILES[SOUNDS.gachaOpen]) {
    audio.addEventListener('playing', () => window.setTimeout(() => audio.pause(), GACHA_ING_END_MS), { once: true });
  }
  return stopper(audio);
}

// 등급별 아이템 공개 소리
export function playItemReveal(rarity: Rarity) {
  playSound(rarity === 'SSS' ? 'itemSSS' : rarity === 'SR' || rarity === 'SSR' ? 'itemSR' : 'itemNR');
}

// 첫 재생이 늦지 않게 미리 받아 둠
const preloaded: HTMLAudioElement[] = [];

// 버튼 클릭 소리 종류: 버튼에 data-sfx="back | confirm | page"를 달면 그 소리, none이면 소리 없음 (자기 효과음을 따로 내는 버튼)
// 닫기·뒤로 버튼(aria-label)은 따로 달지 않아도 돌아가기 소리
export type ClickSound = 'back' | 'confirm' | 'page' | 'none';
const CLICK_SOUNDS: Record<string, Sound> = { back: 'back', confirm: 'confirm', page: 'page' };
const BACK_SELECTOR = '[aria-label="닫기"], [aria-label="뒤로"]';

function clickSound(el: EventTarget | null): Sound | null {
  const target = (el as Element | null)?.closest?.('button, [role="button"], a[href]');
  if (!target || (target as HTMLButtonElement).disabled || target.getAttribute('aria-disabled') === 'true') return null;
  const kind = target.closest('[data-sfx]')?.getAttribute('data-sfx');
  if (kind === 'none') return null;
  if (kind && CLICK_SOUNDS[kind]) return CLICK_SOUNDS[kind];
  return target.matches(BACK_SELECTOR) ? 'back' : 'select';
}

// 화면의 모든 버튼에 클릭 소리 (main.tsx에서 한 번 연결)
export function installClickSound() {
  for (const url of new Set(Object.values(FILES))) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    preloaded.push(audio);
  }
  // 마우스·터치는 누르는 순간
  document.addEventListener(
    'pointerdown',
    (e) => {
      const sound = e.button === 0 ? clickSound(e.target) : null;
      if (sound) playSound(sound);
    },
    true,
  );
  // 키보드(Enter·Space)로 누른 버튼은 pointerdown이 없어서 click에서 (detail 0 = 키보드로 누름)
  document.addEventListener(
    'click',
    (e) => {
      const sound = e.detail === 0 ? clickSound(e.target) : null;
      if (sound) playSound(sound);
    },
    true,
  );
}
