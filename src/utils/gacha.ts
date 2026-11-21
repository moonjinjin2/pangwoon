import { STAT_KEYS, STAT_LABELS, type StatKey } from '../components/StatsBox';
import { SPEAKERS, type Heroine } from './episode';

export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'SSS';

// 낮은 등급부터
export const RARITIES: Rarity[] = ['N', 'R', 'SR', 'SSR', 'SSS'];

// 등급별 뽑힐 확률(%)과 표시 색 (확률은 임시, 기획 확정 전)
export const RARITY_META: Record<Rarity, { rate: number; color: string }> = {
  N: { rate: 50, color: '#9a98a6' },
  R: { rate: 30, color: '#4f8ee0' },
  SR: { rate: 14, color: '#a35fd8' },
  SSR: { rate: 5, color: '#e8b23a' },
  SSS: { rate: 1, color: '#ff6fae' },
};

// 뽑기 가격 (1회 25,000원 — 학사 알바만 한 달 하면 평균 7~8회). 10회 뽑기는 SR 이상 1개 확정
export const PULL_PRICE = 25000;
export const TEN_PULL_PRICE = 50000;

export interface Item {
  // 아이템 이름을 그대로 id로 씀
  id: string;
  name: string;
  rarity: Rarity;
  // 아이템 효과 (오르는 스탯만)
  stats: Partial<Record<StatKey, number>>;
  // 선물 세트: 이 히로인의 호감도가 오름
  gift?: { heroine: Heroine; affection: number };
  image: string;
}

// 아이콘 파일: img/items/<등급>/<이름의 공백을 _로>.png
// 파일명 한글이 자모 분리(NFD)로 저장돼 있어도 찾을 수 있게 경로를 NFC로 맞춤
const IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('../img/items/*/*.png', { eager: true, query: '?url', import: 'default' })).map(
    ([path, url]) => [path.normalize('NFC'), url],
  ),
);

function item({ stats = {}, ...rest }: Omit<Item, 'id' | 'image' | 'stats'> & { stats?: Item['stats'] }): Item {
  return { ...rest, id: rest.name, stats, image: IMAGES[`../img/items/${rest.rarity}/${rest.name.replace(/ /g, '_')}.png`.normalize('NFC')] };
}

export const ITEMS: Item[] = [
  item({ name: '편의점 삼각김밥', rarity: 'N', stats: { health: 2 } }),
  item({ name: '야식 통조림', rarity: 'N', stats: { health: 2 } }),
  item({ name: '쿨링 생수', rarity: 'N', stats: { mental: 1, health: 1 } }),
  item({ name: '비타민 주스', rarity: 'N', stats: { mental: 1, health: 2 } }),
  item({ name: '에너지바', rarity: 'N', stats: { charm: 1, health: 2 } }),
  item({ name: '휴대용 빗', rarity: 'N', stats: { charm: 1 } }),
  item({ name: '검은 네일 스티커', rarity: 'N', stats: { charm: 1, mental: 1 } }),
  item({ name: '향기 나는 핸드크림', rarity: 'N', stats: { charm: 1, health: 1 } }),
  item({ name: '패션 잡지 한 장', rarity: 'N', stats: { charm: 1, mental: 1 } }),
  item({ name: '검은 넥타이', rarity: 'N', stats: { charm: 1 } }),
  item({ name: '혈액형 대화 카드', rarity: 'N', stats: { disguise: 1 } }),
  item({ name: '인조 송곳니 스티커', rarity: 'N', stats: { disguise: 1, health: 1 } }),
  item({ name: '체취 가림 티슈', rarity: 'N', stats: { disguise: 1 } }),
  item({ name: '혈액팩 모양 석류 음료', rarity: 'N', stats: { disguise: 1, health: 1 } }),
  item({ name: '수면용 귀마개', rarity: 'N', stats: { mental: 2 } }),
  item({ name: '따뜻한 허브차', rarity: 'N', stats: { mental: 1, health: 1 } }),
  item({ name: '빗소리 플레이리스트', rarity: 'N', stats: { charm: 1, mental: 1 } }),
  item({ name: '수제 영양죽', rarity: 'R', stats: { health: 4 } }),
  item({ name: '철분 비타민 팩', rarity: 'R', stats: { mental: 1, health: 3 } }),
  item({ name: '따뜻한 컵죽', rarity: 'R', stats: { charm: 1, health: 3 } }),
  item({ name: '블랙 스타일링 키트', rarity: 'R', stats: { charm: 3 } }),
  item({ name: '검은 목걸이 세트', rarity: 'R', stats: { charm: 2, mental: 1 } }),
  item({ name: '맞춤 향수 샘플', rarity: 'R', stats: { charm: 2, health: 1 } }),
  item({ name: '휴대용 체취 가림 미스트', rarity: 'R', stats: { disguise: 2 } }),
  item({ name: '송곳니 마감제', rarity: 'R', stats: { disguise: 2, charm: 1 } }),
  item({ name: '뱀파이어 면접 카드', rarity: 'R', stats: { disguise: 2, mental: 1 } }),
  item({ name: '푹신한 낮잠 안대', rarity: 'R', stats: { mental: 3 } }),
  item({ name: '숙면 허브티 세트', rarity: 'R', stats: { mental: 2, health: 1 } }),
  item({ name: '호흡 안정 오디오', rarity: 'R', stats: { charm: 1, mental: 2 } }),
  item({ name: '야식 정식', rarity: 'SR', stats: { mental: 1, health: 6 } }),
  item({ name: '고농축 영양제', rarity: 'SR', stats: { health: 6 } }),
  item({ name: '맞춤 정장 대여권', rarity: 'SR', stats: { charm: 4, mental: 1 } }),
  item({ name: '달빛 무도회 스타일링', rarity: 'SR', stats: { charm: 4, health: 2 } }),
  item({ name: '고급 체취 중화제', rarity: 'SR', stats: { disguise: 3, mental: 1 } }),
  item({ name: '야행성 연기 교본', rarity: 'SR', stats: { disguise: 3, charm: 1 } }),
  item({ name: '프리미엄 수면 세트', rarity: 'SR', stats: { mental: 5, health: 2 } }),
  item({ name: '작은 햇살 조명', rarity: 'SR', stats: { mental: 5 } }),
  item({ name: '최상급 회복 도시락', rarity: 'SSR', stats: { mental: 2, health: 8 } }),
  item({ name: '무도회 스타일링 이용권', rarity: 'SSR', stats: { charm: 6, health: 2 } }),
  item({ name: '특수 위장 패키지', rarity: 'SSR', stats: { disguise: 4, charm: 1 } }),
  item({ name: '완전 숙면 패키지', rarity: 'SSR', stats: { mental: 7, health: 2 } }),
  item({ name: '은빛 머리핀 선물 세트', rarity: 'SSS', gift: { heroine: 'minji', affection: 10 } }),
  item({ name: '양장 노트 선물 세트', rarity: 'SSS', gift: { heroine: 'siyeong', affection: 10 } }),
  item({ name: '달빛 키링 선물 세트', rarity: 'SSS', gift: { heroine: 'emily', affection: 10 } }),
  item({ name: '야간 잠입 준비 세트', rarity: 'SSS', stats: { disguise: 3, charm: 2, mental: 2 } }),
  item({ name: '심야 생존 준비 세트', rarity: 'SSS', stats: { disguise: 2, mental: 3, health: 5 } }),
  item({ name: '무도회 완벽 준비 세트', rarity: 'SSS', stats: { disguise: 2, charm: 3, health: 4 } }),
];

const itemById = new Map(ITEMS.map((i) => [i.id, i]));

export function getItem(id: string) {
  return itemById.get(id);
}

// 아이템 id → 보유 개수
export type ItemInventory = Record<string, number>;

const itemsByRarity = Object.fromEntries(RARITIES.map((r) => [r, ITEMS.filter((i) => i.rarity === r)])) as Record<Rarity, Item[]>;

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

// 등급별 확률로 등급을 정하고 그 등급 안에서는 똑같은 확률로 고름 (minRarity보다 낮은 등급은 제외)
function rollItem(minRarity: Rarity = 'N') {
  const pool = RARITIES.slice(RARITIES.indexOf(minRarity));
  let roll = Math.random() * pool.reduce((sum, r) => sum + RARITY_META[r].rate, 0);
  const rarity = pool.find((r) => (roll -= RARITY_META[r].rate) < 0) ?? pool[pool.length - 1];
  return pick(itemsByRarity[rarity]);
}

export function rarityRank(rarity: Rarity) {
  return RARITIES.indexOf(rarity);
}

// count번 뽑기. 10회 뽑기는 마지막 한 번을 SR 이상으로 보장
export function pullItems(count: number) {
  const items = Array.from({ length: count }, () => rollItem());
  if (count >= 10 && items.every((i) => rarityRank(i.rarity) < rarityRank('SR'))) items[count - 1] = rollItem('SR');
  return items;
}

// 아이템들의 효과를 합친 항목 (예: [{ label: '체력', value: 4 }, { label: '민지 ♥', value: 10 }])
export function getEffectParts(items: Item[]) {
  const parts = STAT_KEYS.map((key) => ({ label: STAT_LABELS[key], value: items.reduce((sum, item) => sum + (item.stats[key] ?? 0), 0) })).filter(
    ({ value }) => value > 0,
  );
  for (const { gift } of items) if (gift) parts.push({ label: `${SPEAKERS[gift.heroine].name} ♥`, value: gift.affection });
  return parts;
}

export function describeEffects(items: Item[]) {
  return getEffectParts(items)
    .map(({ label, value }) => `${label} +${value}`)
    .join(' · ');
}
