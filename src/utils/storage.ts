import { useEffect, useState } from 'react';

export const NAME_KEY = 'playerName';
export const DATE_KEY = 'gameDate';

// 게임 진행 상황 (새 게임·Exit 시 모두 지움)
export const PROGRESS_KEYS = {
  plans: 'plans',
  stats: 'stats',
  coins: 'coins',
  affection: 'affection',
  revealed: 'revealed',
  ownedOutfits: 'ownedOutfits',
  equippedOutfit: 'equippedOutfit',
  collection: 'collection',
} as const;

// 환경 설정 (Exit 해도 유지)
export const SETTINGS_KEYS = {
  bgmVolume: 'bgmVolume',
  textSpeed: 'textSpeed',
} as const;

// 대사 한 글자가 나오는 간격(ms)
export const TEXT_SPEEDS = [
  { key: 'slow', label: '느리게', ms: 70 },
  { key: 'normal', label: '보통', ms: 40 },
  { key: 'fast', label: '빠르게', ms: 15 },
] as const;

export type TextSpeed = (typeof TEXT_SPEEDS)[number]['key'];

export const DEFAULT_TEXT_SPEED: TextSpeed = 'normal';

export function load(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 실패 시에도 현재 세션에서는 계속 진행
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearProgress() {
  for (const key of Object.values(PROGRESS_KEYS)) remove(key);
}

function isPlainObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 저장된 JSON을 불러옴 (없거나 깨졌으면 기본값, 객체는 기본값 위에 덮어씌워 새 필드도 채움)
function loadJSON<T>(key: string, fallback: T): T {
  const raw = load(key);
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (isPlainObject(fallback)) return isPlainObject(parsed) ? { ...fallback, ...parsed } : fallback;
    return typeof parsed === typeof fallback ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// 컬렉션: 에피소드 번호(#0, #1 …) → 그때 본 에피소드 id
export type Collection = Record<string, string>;

// 끝까지 본 에피소드를 그 회차 번호로 컬렉션에 기록
export function markCollected(number: number, id: string) {
  const collected = loadJSON<Collection>(PROGRESS_KEYS.collection, {});
  save(PROGRESS_KEYS.collection, JSON.stringify({ ...collected, [number]: id }));
}

// useState와 같지만 값이 바뀔 때마다 localStorage에 저장해 새로고침해도 유지됨
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadJSON(key, initial));

  useEffect(() => {
    save(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
