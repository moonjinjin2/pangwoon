import clickUrl from '../sfx/click.wav';
import gachaUrl from '../sfx/gacha.mp3';
import resultUrl from '../sfx/gacha_result.mp3';
import cardFlipUrl from '../sfx/card_flip.wav';
import itemUseUrl from '../sfx/gacha_use.mp3';
import { load, SETTINGS_KEYS } from './storage';

// 효과음 (src/sfx). 더빙 음성처럼 <audio>로 재생해 Safari에서도 소리가 남
// click.wav: 볼펜 딸깍에서 딸·깍 두 번만 잘라낸 소리
// gacha.mp3: 가챠 연출이 시작될 때 / gacha_result.mp3: 가챠 결과가 나타날 때
// card_flip.wav: 여러 개 뽑기에서 카드를 뒤집을 때 (휙-탁, 직접 합성한 소리)
// gacha_use.mp3: 가챠 아이템을 사용할 때

export const DEFAULT_SFX_VOLUME = 70;

// 설정의 효과음 음량 (0~1)
function sfxVolume() {
  const raw = load(SETTINGS_KEYS.sfxVolume);
  const value = raw === null ? DEFAULT_SFX_VOLUME : Number(raw);
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) / 100 : DEFAULT_SFX_VOLUME / 100;
}

// 음량이 0이면 재생하지 않고 null
function play(url: string) {
  const volume = sfxVolume();
  if (volume <= 0) return null;
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(() => {});
  return audio;
}

// 버튼 딸깍
export function playClick() {
  play(clickUrl);
}

// 가챠 결과가 나타날 때
export function playGachaResult() {
  play(resultUrl);
}

// 여러 개 뽑기 결과에서 카드를 뒤집을 때
export function playCardFlip() {
  play(cardFlipUrl);
}

// 가챠 아이템을 사용할 때 (보관함에서 사용 · 뽑기 결과에서 바로 사용)
export function playItemUse() {
  play(itemUseUrl);
}

// 가챠 연출이 시작될 때 차오르는 소리
// 돌려주는 함수를 부르면 서서히 줄이며 멈춤 (연출을 건너뛰어 결과가 바로 나올 때)
export function playGachaSpin() {
  const audio = play(gachaUrl);
  if (!audio) return () => {};
  let timer = 0;
  return () => {
    if (timer) return;
    const step = audio.volume / 10;
    timer = window.setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step);
      if (audio.volume > 0) return;
      audio.pause();
      window.clearInterval(timer);
    }, 30);
  };
}

// 첫 재생이 늦지 않게 미리 받아 둠
const preloaded: HTMLAudioElement[] = [];

// 화면의 모든 버튼에 딸깍 소리 (main.tsx에서 한 번 연결)
export function installClickSound() {
  for (const url of [clickUrl, gachaUrl, resultUrl, cardFlipUrl, itemUseUrl]) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    preloaded.push(audio);
  }
  const isButton = (el: EventTarget | null) => {
    const target = (el as Element | null)?.closest?.('button, [role="button"], a[href]');
    // data-sfx="none"인 버튼은 자기 효과음을 따로 냄 (가챠 카드 뒤집기)
    if (!target || target.closest('[data-sfx="none"]')) return false;
    return !(target as HTMLButtonElement).disabled && target.getAttribute('aria-disabled') !== 'true';
  };
  // 마우스·터치는 누르는 순간 딸깍
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button === 0 && isButton(e.target)) playClick();
    },
    true,
  );
  // 키보드(Enter·Space)로 누른 버튼은 pointerdown이 없어서 click에서 (detail 0 = 키보드로 누름)
  document.addEventListener(
    'click',
    (e) => {
      if (e.detail === 0 && isButton(e.target)) playClick();
    },
    true,
  );
}
