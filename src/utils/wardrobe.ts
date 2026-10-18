export type Category = 'top' | 'bottom';

export interface Outfit {
  id: string;
  category: Category;
  name: string;
  desc: string;
  price: number;
  // 아이콘 색상
  color: string;
  // 미리보기 때 캐릭터 옷에 입힐 색 (없으면 원본 그대로)
  tint?: string;
}

// 전신 이미지에서 부위별 세로 범위(%)와 색 입히는 방식
// 어두운 옷(후드·바지)은 screen, 흰 운동화는 multiply 로 색을 입힘
export const CATEGORY_META: Record<Category, { tab: string; label: string; region: [number, number]; blend: 'screen' | 'multiply' }> = {
  top: { tab: 'TOP', label: '상의', region: [14.5, 47], blend: 'screen' },
  bottom: { tab: 'BOTTOM', label: '하의', region: [47, 93], blend: 'screen' },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

export const OUTFITS: Outfit[] = [
  { id: 'hoodie_black', category: 'top', name: '검정 후드집업', desc: '늘 입던 편한 후드.', price: 0, color: '#3a3a46' },
  { id: 'hoodie_navy', category: 'top', name: '네이비 후드집업', desc: '단정해 보이는 남색 후드.', price: 12000, color: '#34508f', tint: '#2f4a8a' },
  { id: 'hoodie_gray', category: 'top', name: '회색 후드집업', desc: '무난함의 끝판왕.', price: 12000, color: '#9a9aa8', tint: '#8d8d9a' },
  { id: 'hoodie_pink', category: 'top', name: '핑크 후드집업', desc: '용기가 필요한 색.', price: 18000, color: '#f49ac1', tint: '#e07aa6' },
  { id: 'hoodie_mint', category: 'top', name: '민트 후드집업', desc: '상큼한 봄 느낌.', price: 18000, color: '#7fd6b8', tint: '#5fbf9f' },
  { id: 'hoodie_lilac', category: 'top', name: '라일락 후드집업', desc: '은은한 보랏빛.', price: 22000, color: '#b48cf2', tint: '#9c78d8' },
  { id: 'hoodie_red', category: 'top', name: '빨간 후드집업', desc: '눈에 확 띄는 강렬함.', price: 25000, color: '#d9534f', tint: '#c8403c' },
  { id: 'hoodie_cream', category: 'top', name: '크림 후드집업', desc: '부드러운 아이보리.', price: 30000, color: '#efe3c4', tint: '#e2d3ae' },

  { id: 'pants_black', category: 'bottom', name: '검정 트레이닝 바지', desc: '편한 게 최고.', price: 0, color: '#3a3a46' },
  { id: 'pants_gray', category: 'bottom', name: '회색 트레이닝 바지', desc: '집 앞 편의점 전용.', price: 12000, color: '#9a9aa8', tint: '#8d8d9a' },
  { id: 'pants_denim', category: 'bottom', name: '청바지', desc: '실패 없는 데님.', price: 15000, color: '#4a6fa8', tint: '#40639c' },
  { id: 'pants_beige', category: 'bottom', name: '베이지 면바지', desc: '깔끔한 데이트룩.', price: 15000, color: '#c9ae86', tint: '#b89c74' },
  { id: 'pants_khaki', category: 'bottom', name: '카키 카고바지', desc: '주머니가 많다.', price: 18000, color: '#7d8a55', tint: '#6e7a48' },
];

const outfitById = new Map(OUTFITS.map((o) => [o.id, o]));

export function getOutfit(id: string) {
  return outfitById.get(id);
}

export type Equipped = Record<Category, string>;

export const DEFAULT_EQUIPPED: Equipped = { top: 'hoodie_black', bottom: 'pants_black' };

// 기본 지급(0원) 아이템은 처음부터 보유
export const DEFAULT_OWNED = OUTFITS.filter((o) => o.price === 0).map((o) => o.id);
