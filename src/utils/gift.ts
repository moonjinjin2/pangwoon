import type { Heroine } from './episode';

export interface Gift {
  id: string;
  name: string;
  // 이 선물을 좋아하는 히로인
  heroine: Heroine;
  // 선물하면 오르는 호감도
  affection: number;
  price: number;
  // 아이템 이미지 (없으면 빈 칸)
  image?: string;
}

// 가격은 임시 (기획 확정 전)
export const GIFTS: Gift[] = [
  { id: 'dessert', name: '고급 디저트', heroine: 'emily', affection: 5, price: 30000 },
  { id: 'bouquet', name: '작은 꽃다발', heroine: 'emily', affection: 5, price: 40000 },
  { id: 'perfume', name: '미니 향수', heroine: 'emily', affection: 5, price: 60000 },
  { id: 'fan', name: '미니 선풍기', heroine: 'siyeong', affection: 5, price: 25000 },
  { id: 'bookmark', name: '금속 책갈피', heroine: 'siyeong', affection: 5, price: 20000 },
  { id: 'notebook', name: '무지노트', heroine: 'siyeong', affection: 5, price: 10000 },
  { id: 'energy_drink', name: '에너지 드링크', heroine: 'minji', affection: 5, price: 5000 },
  { id: 'keyring', name: '게임 캐릭터 키링', heroine: 'minji', affection: 5, price: 15000 },
];

// 선물 id → 보유 개수
export type GiftInventory = Record<string, number>;
