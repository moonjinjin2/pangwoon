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
export const TEN_PULL_PRICE = 30000;

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
  // 상세 창에 보여줄 설명
  description: string;
}

// 아이콘 파일: img/items/<등급>/<이름의 공백을 _로>.png
// 파일명 한글이 자모 분리(NFD)로 저장돼 있어도 찾을 수 있게 경로를 NFC로 맞춤
const IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('../img/items/*/*.png', { eager: true, query: '?url', import: 'default' })).map(
    ([path, url]) => [path.normalize('NFC'), url],
  ),
);

function item({ stats = {}, ...rest }: Omit<Item, 'id' | 'image' | 'stats' | 'description'> & { stats?: Item['stats'] }): Item {
  return {
    ...rest,
    id: rest.name,
    stats,
    image: IMAGES[`../img/items/${rest.rarity}/${rest.name.replace(/ /g, '_')}.png`.normalize('NFC')],
    description: DESCRIPTIONS[rest.name] ?? '',
  };
}

// 아이템 설명 (상세 이미지 시안 img/items_detail 의 문구)
const DESCRIPTIONS: Record<string, string> = {
  '편의점 삼각김밥': '인간 세상 편의점에서 흔히 볼 수 있는 삼각김밥이다. 뱀파이어 대학에서 보니 이 평범한 삼각김밥이 이렇게 반가울 수가 없다.',
  '야식 통조림': '밤늦게 배가 고플 때 꺼내 먹기 좋은 통조림이다. 내용물은 뚜껑을 열어 봐야 알겠지만… 설마 피가 들어 있지는 않겠지?',
  '쿨링 생수': '시원하게 식혀 놓은 생수다. 이 대학에서는 투명한 액체를 보는 것만으로도 안심이 된다. 역시 물이 최고야!',
  '비타민 주스': '상큼한 과일 맛이 나는 비타민 주스다. 붉은색이라 처음엔 놀랐지만, 다행히 입에 넣으니 달콤한 과일 맛이 난다.',
  에너지바: '견과류와 곡물이 들어간 에너지바다. 바쁜 밤에 간단하게 먹기 좋다. 하나 더 먹으면 두 배로 힘이 나려나?',
  '혈액형 대화 카드': '혈액형에 관한 이야기가 적힌 대화 카드다. 인간 세상에서는 성격 이야기를 했는데, 여기서는 아무래도 다른 이야기를 하는 것 같다.',
  '인조 송곳니 스티커': '치아에 붙이면 뾰족한 송곳니처럼 보이는 스티커다. 이제 나도 뱀파이어처럼 보이겠지? 제발 중요한 순간에 떨어지지만 마라!',
  '체취 가림 티슈': '인간의 체취를 가리는 데 도움이 되는 티슈다. 땀이 날 때마다 한 장씩! 이 정도면 가까이 다가와도 괜찮겠지…?',
  '혈액팩 모양 석류 음료': '혈액팩처럼 생긴 용기에 석류 주스가 들어 있다. 뱀파이어들 앞에서 자연스럽게 마셔 보자. …표정 관리도 잊지 말고!',
  '수면용 귀마개': '주변 소리를 막아 주는 귀마개다. 기숙사가 아무리 시끄러워도 이것만 있으면 푹 잘 수 있겠지? 누가 깨워도 못 듣는 건 아니겠지…?',
  '따뜻한 허브차': '은은한 향이 나는 따뜻한 허브차다. 긴 밤을 보내고 마시는 차 한 잔에 몸이 조금 풀리는 것 같다. 이런 여유도 가끔은 필요하지!',
  '빗소리 플레이리스트': '잔잔한 빗소리가 담긴 플레이리스트다. 눈을 감고 듣고 있으면 복잡한 생각도 잦아든다. …근데 이거 듣다가 진짜 잠드는 거 아니야?',
  '수제 영양죽': '정성껏 끓인 따뜻한 영양죽이다. 몸에 좋다는데, 어디서 익숙한 선지해장국 냄새가 나는 것 같기도 하고… 기분 탓이겠지?',
  '철분 비타민 팩': '지친 몸을 위해 철분과 비타민을 챙길 수 있는 팩이다. 그런데 여기서 철분을 먹는다고 하니 괜히 주변 눈치가 보인다.',
  '휴대용 체취 가림 미스트': '인간의 체취를 가리기 위한 휴대용 미스트다. 외출 전에는 꼭 뿌려 주자. 오늘은 몇 번이나 뿌려야 안심이 될까?',
  '푹신한 낮잠 안대': '눈을 포근하게 감싸 주는 낮잠 안대다. 밤낮이 바뀐 생활에는 필수품! 이것만 쓰면 낮인지 밤인지도 모르고 잘 수 있을 것 같다.',
  '숙면 허브티 세트': '잠들기 전에 마시기 좋은 허브티 세트다. 따뜻한 차를 한 잔 마시고 침대에 누우면… 오늘 있었던 일도 잠시 잊을 수 있겠지?',
  '휴대용 빗': '언제 어디서든 머리를 정돈할 수 있는 작은 빗이다. 헝클어진 머리를 빗고 나니 마음도 차분해진다. 이 정도면 꽤 괜찮은데?',
  '검은 네일 스티커': '손톱에 붙이는 검은색 네일 스티커다. 손끝까지 검게 꾸미니 왠지 모르게 뱀파이어가 된 기분이다. 너무 열심히 꾸민 것 같기도 하고?',
  '향기 나는 핸드크림': '손을 부드럽게 가꿔 주는 핸드크림이다. 은은한 향을 맡으니 마음까지 편안해진다. 누군가 손을 잡아도 자신 있을 것 같은데?',
  '패션 잡지 한 장': '멋진 옷차림이 소개된 패션 잡지 한 장이다. 이대로 따라 입으면 나도 잡지 속 모델처럼 보일까? 일단 자신감부터 가져 보자.',
  '검은 넥타이': '단정한 옷차림을 완성해 주는 검은 넥타이다. 거울 앞에서 매듭을 고쳐 매니 조금은 귀족 같은데? 표정만 잘 관리하면 완벽하겠다.',
  '따뜻한 컵죽': '간편하게 데워 먹을 수 있는 컵죽이다. 따뜻한 김이 모락모락 올라오니 마음까지 든든해진다. 오늘만큼은 천천히 먹어야지.',
  '블랙 스타일링 키트': '검은색을 중심으로 꾸밀 수 있는 스타일링 키트다. 이것저것 만져 보니 거울 속에 평소와 다른 사람이 있다. 어라, 생각보다 멋진데?',
  '검은 목걸이 세트': '어두운 빛이 감도는 검은 목걸이 세트다. 목에 걸기만 했는데 뱀파이어 대학의 분위기와 잘 어울린다. 이 정도면 자연스럽게 섞이겠지?',
  '맞춤 향수 샘플': '취향에 맞는 향을 고를 수 있는 향수 샘플이다. 인간의 체취도 가리고 향기까지 좋아진다니, 한 번에 두 가지를 해결하는 기분이다!',
  '송곳니 마감제': '가짜 송곳니를 더 자연스럽게 만들어 주는 마감제다. 거울을 보며 꼼꼼하게 마무리해 보자. 이 정도면 치과 의사도 속지 않을까?',
  '뱀파이어 면접 카드': '뱀파이어 면접에 나올 법한 질문이 적힌 카드다. 인간 세상에서도 면접은 어려웠는데, 여기서도 면접 준비를 해야 하다니…!',
  '호흡 안정 오디오': '천천히 숨을 고를 수 있도록 도와주는 오디오다. 들이마시고, 내쉬고… 좋아, 이제 누가 갑자기 다가와도 당황하지 않을 수 있겠지?',
  '야식 정식': '따뜻한 음식이 푸짐하게 차려진 야식 정식이다. 오랜만에 제대로 된 식사를 보니 눈물이 날 것 같다. 오늘은 남김없이 다 먹어야지!',
  '고농축 영양제': '몸에 필요한 영양을 작은 한 알에 담은 영양제다. 이렇게 작은데 정말 괜찮은 걸까? 설명서를 보니 한 알만 먹어도 충분하다고 한다.',
  '맞춤 정장 대여권': '몸에 꼭 맞는 정장을 빌릴 수 있는 이용권이다. 거울 속 내 모습이 이렇게 멋있었다니! …빌린 옷이라는 건 아무도 모르겠지?',
  '달빛 무도회 스타일링': '달빛 아래에서 더욱 돋보이도록 꾸며 주는 무도회 스타일링이다. 이 모습으로 등장하면 히로인들도 한 번쯤 돌아보지 않을까?',
  '고급 체취 중화제': '인간의 체취를 감추는 데 도움을 주는 고급 중화제다. 평소보다 자신 있게 가까이 다가갈 수 있을 것 같다. 물론 너무 방심하면 안 되겠지만!',
  '야행성 연기 교본': '야행성 뱀파이어처럼 행동하는 방법이 적힌 교본이다. 말투부터 표정까지 따라 해 보자. 거울 속 나는 제법 그럴듯한데… 남들도 그렇게 생각할까?',
  '프리미엄 수면 세트': '편안하게 잠들 수 있도록 준비된 고급 수면 세트다. 포근하게 누워 있으니 일어나기가 싫다. 조금만 더 자면 안 될까…?',
  '작은 햇살 조명': '따뜻한 햇살처럼 방을 밝혀 주는 작은 조명이다. 보고 있으면 인간 세상의 낮이 떠오른다. 진짜 햇빛은 아니지만, 이 정도면 충분히 따뜻한걸?',
  '최상급 회복 도시락': '세계 온갖 진미를 다 때려 넣은 도시락이다. 한 입만 먹어도 온갖 향과 풍미가 입안에 퍼진다. 모든 피로가 사라질지도…?!',
  '무도회 스타일링 이용권': '무도회에 어울리는 모습으로 꾸며 주는 이용권이다. 오늘의 나는 평소와 다르다! 이 모습으로 무도회장에 들어가면 누가 먼저 알아봐 줄까?',
  '특수 위장 패키지': '인간의 체취와 어색한 모습을 감추기 위한 특수 위장 패키지다. 냄새부터 행동까지 꼼꼼하게 준비하면… 오늘만큼은 완벽한 뱀파이어가 될 수 있겠지?',
  '완전 숙면 패키지': '잠은 만병통치약!!! 이걸 입고 푹 자면 모든 근심과 걱정이 사라질 것 같은데?!! 제발 오늘만큼은 아무도 깨우지 말아 줘!',
  '은빛 머리핀 선물 세트': '은은하게 빛나는 머리핀이 담긴 선물 세트다. 평소 편한 차림을 좋아하는 민지에게 주면 어떨까? 의외로 부끄러워하는 모습을 볼 수 있을지도!',
  '양장 노트 선물 세트': '차분한 색의 양장 노트가 담긴 선물 세트다. 책을 좋아하는 시영이라면 마음에 들어 하지 않을까? 혹시 내 이야기도 적어 주려나…?',
  '달빛 키링 선물 세트': '에밀리가 좋아하는 달 모양의 키링이다. 은은하게 빛나는 달이 까칠한 에밀리와 잘 어울릴 듯하다. 선물하면 어떤 표정을 지을까?',
  '야간 잠입 준비 세트': '은행을 털러 갈 것 같은 잠입 세트다. 이걸 입으면 밤에 모습도 보이지 않고 냄새도 나지 않는다고 한다. 음… 이걸 입고 여자 기숙사에 잠입해 볼까…?',
  '심야 생존 준비 세트': '위험한 밤을 버티기 위해 필요한 물건들을 모은 세트다. 위장도 챙기고 정신도 바짝 차렸으니 오늘 밤은 무사히 넘길 수 있겠지? 제발!',
  '무도회 완벽 준비 세트': '블라디미르 가문의 유명한 디자이너가 만든 무도회 전용 의상이다. 입은 사람을 보는 이마다 매혹된다고 한다. 이걸 입으면 히로인들의 시선도 전부 내게 쏠리려나?',
};

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

// 보관함 효과 필터: 'all' 전체, 스탯 키, 'gift' 선물 세트
export type ItemFilter = 'all' | StatKey | 'gift';

export function matchesFilter(item: Item, filter: ItemFilter) {
  if (filter === 'all') return true;
  if (filter === 'gift') return !!item.gift;
  return !!item.stats[filter];
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
