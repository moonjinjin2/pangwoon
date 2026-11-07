import { useEffect, useState } from 'react';

export const NAME_KEY = 'playerName';
export const DATE_KEY = 'gameDate';

// 게임 진행 상황 (새 게임 시작 시 모두 지움)
export const PROGRESS_KEYS = {
  plans: 'plans',
  stats: 'stats',
  coins: 'coins',
  unpaidRent: 'unpaidRent',
  rentMonth: 'rentMonth',
  affection: 'affection',
  revealed: 'revealed',
  ownedOutfits: 'ownedOutfits',
  equippedOutfit: 'equippedOutfit',
  collection: 'collection',
  choices: 'choices',
  seenDates: 'seenDates',
  dangerWarned: 'dangerWarned',
} as const;

// 환경 설정 (새 게임을 시작해도 유지)
export const SETTINGS_KEYS = {
  bgmVolume: 'bgmVolume',
  textSpeed: 'textSpeed',
  // 설정의 개발자 모드 (에피소드 바로 보기 등 테스트 기능)
  devMode: 'devMode',
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

export function loadCollection() {
  return loadJSON<Collection>(PROGRESS_KEYS.collection, {});
}

// 다음에 볼 에피소드의 회차 번호 (프롤로그 #0 다음부터 본 순서대로)
export function getNextEpisodeNumber() {
  return Math.max(0, ...Object.keys(loadCollection()).map(Number)) + 1;
}

// 에피소드를 컬렉션에 기록한 회차 번호 (없으면 undefined)
export function getCollectedNumber(id: string) {
  const entry = Object.entries(loadCollection()).find(([, value]) => value === id);
  return entry && Number(entry[0]);
}

// 이미 끝까지 본 에피소드인지
export function isCollected(id: string) {
  return Object.values(loadCollection()).includes(id);
}

// 끝까지 본 에피소드를 그 회차 번호로 컬렉션에 기록 (본 게임 날짜도 함께)
export function markCollected(number: number, id: string, date: string) {
  save(PROGRESS_KEYS.collection, JSON.stringify({ ...loadCollection(), [number]: id }));
  save(PROGRESS_KEYS.seenDates, JSON.stringify({ ...loadSeenDates(), [number]: date }));
}

// 회차 번호 → 그 에피소드를 본 게임 날짜 ('YYYY-MM-DD', 앨범·데이트 기록에 시기로 표시)
export function loadSeenDates() {
  return loadJSON<Record<string, string>>(PROGRESS_KEYS.seenDates, {});
}

// 에피소드 id → 끝까지 봤을 때 고른 선택지 번호들 (나온 순서대로, 다시 보기에서 그대로 재생)
export type ChoiceRecord = Record<string, number[]>;

export function loadChoices(id: string): number[] | undefined {
  return loadJSON<ChoiceRecord>(PROGRESS_KEYS.choices, {})[id];
}

export function saveChoices(id: string, picks: number[]) {
  save(PROGRESS_KEYS.choices, JSON.stringify({ ...loadJSON<ChoiceRecord>(PROGRESS_KEYS.choices, {}), [id]: picks }));
}

// useState와 같지만 값이 바뀔 때마다 localStorage에 저장해 새로고침해도 유지됨
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadJSON(key, initial));

  useEffect(() => {
    save(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
