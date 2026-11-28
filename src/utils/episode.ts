import hayeongImg from '../img/character/hayeong/hayeong_main.png';
import minjiImg from '../img/character/minji/minji_default.png';
import minjiSmileImg from '../img/character/minji/minji_smile.png';
import minjiBigSmileImg from '../img/character/minji/minji_bigsmile.png';
import minjiShySmileImg from '../img/character/minji/minji_shy_smile.png';
import minjiLessImg from '../img/character/minji/minji_less.png';
import minjiSurprisedSoftImg from '../img/character/minji/minji_surprised_soft.png';
import siyeongImg from '../img/character/siyeong/siyeong_default.png';
import emilyImg from '../img/character/emily/emily_default.png';
import studyroomImg from '../img/background/studyroom.png';
import dormRoomBg from '../img/background/하영 기숙사 내부_독백.png';
import classroomBg from '../img/background/강의실_4월.png';
import ballroomBg from '../img/background/무도회_5월.png';
import barBg from '../img/background/술집_6월.png';
import poolBg from '../img/background/수영장_78월.png';
import studyroomBg from '../img/background/스터디룸_9월.png';
import maidCafeBg from '../img/background/메이드카페_10월.png';
import dormBackBg from '../img/background/11월/기숙사 뒷편_민지.png';
import nightStreetBg from '../img/background/11월/밤거리_민지.png';
import clawMachineBg from '../img/background/11월/인형뽑기_민지.png';
import alleyBg from '../img/background/11월/골목길_민지.png';
import roseGardenBg from '../img/background/11월/장미정원_에밀리.png';
import dormHallBg from '../img/background/11월/기숙사 복도_시영&민지.png';
import dormRooftopBg from '../img/background/11월/기숙사 옥상_시영.png';
import minji1Img from '../img/date_art/minji_1.png';
import minji2Img from '../img/date_art/minji_2.png';
import minji3Img from '../img/date_art/minji_3.png';
import minji4Img from '../img/date_art/minji_4.png';
import siyeong1Img from '../img/date_art/siyeong_1.png';
import siyeong2Img from '../img/date_art/siyeong_2.png';
import siyeong3Img from '../img/date_art/siyeong_3.png';
import siyeong4Img from '../img/date_art/siyeong_4.png';
import emily1Img from '../img/date_art/emily_1.png';
import emily2Img from '../img/date_art/emily_2.png';
import emily3Img from '../img/date_art/emily_3.png';
import emily4Img from '../img/date_art/emily_4.png';
import pangwoonImg from '../img/episode/pangwoon.png';
import ep01EmilyCg from '../img/episode/ep01_01.png';
import ep01SiyeongCg from '../img/episode/ep01_02.png';
import ep01MinjiCg from '../img/episode/ep01_03.png';
import ep02EmilyCg from '../img/episode/ep02_01.png';
import ep02SiyeongCg from '../img/episode/ep02_02.png';
import ep02MinjiCg from '../img/episode/ep02_03.png';
import ep03EmilyCg from '../img/episode/ep03_01.png';
import ep03SiyeongCg from '../img/episode/ep03_02.png';
import ep03MinjiCg from '../img/episode/ep03_03.png';
import ep04StudyCg from '../img/episode/ep04_00.png';
import ep04EmilyCg from '../img/episode/ep04_01.png';
import ep04SiyeongCg from '../img/episode/ep04_02.png';
import ep05Emily1Cg from '../img/episode/ep05_01.png';
import ep05SiyeongCg from '../img/episode/ep05_02.png';
import ep05MinjiCg from '../img/episode/ep05_03.png';
import type { Risk } from './storyStats';
import type { StatKey } from '../components/StatsBox';

// 히로인
export type Heroine = 'minji' | 'siyeong' | 'emily';

export const HEROINES: Heroine[] = ['minji', 'siyeong', 'emily'];

export type Speaker = 'player' | Heroine;

// 플레이어(주인공) 이름은 고정
export const PLAYER_NAME = '박하영';

export const SPEAKERS: Record<Speaker, { name: string; image: string }> = {
  player: { name: PLAYER_NAME, image: hayeongImg },
  minji: { name: '민지', image: minjiImg },
  siyeong: { name: '시영', image: siyeongImg },
  emily: { name: '에밀리', image: emilyImg },
};

// 표정 (없으면 기본 표정)
export type Expression = 'smile' | 'bigsmile' | 'shy_smile' | 'less' | 'surprised_soft';

// 캐릭터별 표정 이미지 (없는 표정은 기본 이미지로 보여줌)
export const EXPRESSIONS: Partial<Record<Speaker, Partial<Record<Expression, string>>>> = {
  minji: {
    smile: minjiSmileImg,
    bigsmile: minjiBigSmileImg,
    shy_smile: minjiShySmileImg,
    less: minjiLessImg,
    surprised_soft: minjiSurprisedSoftImg,
  },
};

// 이 캐릭터의 이 표정 이미지
export const portraitImage = (speaker: Speaker, expression?: Expression) =>
  (expression && EXPRESSIONS[speaker]?.[expression]) || SPEAKERS[speaker].image;

export type Affection = Record<Heroine, number>;

export interface Choice {
  text: string;
  // 히로인별 호감도 변화량
  affection: Partial<Affection>;
  // 스탯 변화량 (예: { mental: -3 }). 에피소드를 무사히 끝냈을 때만 반영
  stats?: Partial<Record<StatKey, number>>;
  // 선택 직후 이어지는 대사
  reply: EpisodeLine[];
  // 있으면 이 조건을 만족할 때만 선택지가 보임 (지금까지의 호감도 + 이번 에피소드에서 오른 호감도 기준)
  when?: (affection: Affection) => boolean;
  // 있으면 답변 대사가 끝나면 남은 대사 없이 에피소드를 끝냄
  ends?: boolean;
  // 있으면 이 조건을 만족할 때만 고를 수 있음 (만족하지 않으면 잠긴 채로 보이고 lockedText를 덧붙임)
  enabledWhen?: (affection: Affection) => boolean;
  lockedText?: string;
}

export interface EpisodeLine {
  // 없으면 나레이션
  speaker?: Speaker;
  // 초상화 없는 NPC 이름 (speaker가 없을 때만 씀, 예: '교수님')
  name?: string;
  // {name} → 플레이어 이름
  text: string;
  // 말하는 캐릭터의 표정. 없으면 기본 표정
  // 'smile': 미소 · 'bigsmile': 활짝 웃음 · 'shy_smile': 수줍은 미소 · 'less': 시무룩 · 'surprised_soft': 살짝 놀람
  // 같이 서 있는 다른 캐릭터는 자기가 마지막으로 말할 때의 표정을 유지함
  expression?: Expression;
  // 더빙 음성 (src/voice 아래 경로, 확장자 빼고. 예: 'ep1/민지1' → src/voice/ep1/민지1.mp3)
  // 여러 명이 같이 말하면 배열로 (동시에 재생)
  voice?: string | string[];
  // 있으면 이 대사부터 배경을 바꿈 (장면 전환)
  background?: string;
  // 있으면 이 대사부터 캐릭터 이미지를 내림 (다음에 히로인이 말하면 다시 등장)
  hidePortrait?: boolean;
  // 있으면 이 대사부터 화면 전체에 일러스트(CG)를 보여주고 캐릭터 이미지는 내림
  // 다음에 cg를 다시 지정하거나 null로 지우거나 배경이 바뀔 때까지 유지
  cg?: string | null;
  // 있으면 이 대사부터 여러 캐릭터를 같이 세움 (왼쪽부터, 최대 3명. 예: ['emily', 'minji'])
  // 그중 누가 말하는 동안 유지되고, 무대에 없는 캐릭터가 말하면 다시 그 캐릭터 1명만 섬
  stage?: Speaker[];
  // 대사창 대신 화면 효과로 보여줌 ('system-error': 대사마다 붉은 오류 창을 새로 띄움)
  effect?: 'system-error';
  // 있으면 이 대사 동안 배경을 어둡게 함 (poster가 있으면 자동으로 어두워짐)
  dim?: boolean;
  // 있으면 이 대사 동안 화면 가운데에 종이(공고문 등)를 펼쳐 보여줌
  // 같은 이미지를 이어서 쓰면 펼치는 연출 없이 그대로 두고 확대·강조만 바뀜
  poster?: Poster;
  // 있으면 이 대사가 나올 때 에피소드 위험도가 오름 (위장도만큼 줄고, 흥분 위험은 정신력으로 피할 수 있음)
  // 예: { amount: 40, kind: 'excite' } (비키니를 봄) · { amount: 30, kind: 'bleed' } (손가락을 베임) · { amount: 10, kind: 'suspect' } (거짓말을 의심받음)
  // { amount: -10, kind: 'calm' }처럼 음수면 그대로 내려감 (0 아래로는 안 내려감)
  // 선택지의 답변 대사에 넣으면 그 선택지를 골랐을 때만 오름
  risk?: Risk;
  // 이 대사에서 위험도가 100에 닿으면 에피소드의 badEnding 대신 이 장면을 보여줌 (예: 직접 정체를 드러낸 경우)
  badEnding?: EpisodeLine[];
  // 있으면 이 대사가 나올 때 선택지 없이 호감도가 바뀜 (선택지와 같이 매력 보너스 적용)
  affection?: Partial<Affection>;
  // 있으면 이 대사 후 선택지 표시
  choices?: Choice[];
  // 있으면 이 조건을 만족할 때만 나오는 대사 (호감도 기준은 Choice.when과 같음)
  when?: (affection: Affection) => boolean;
}

// 화면 가운데에 펼치는 종이 (위치·크기는 모두 이미지 기준 %)
export interface Poster {
  image: string;
  // 확대해서 볼 지점 (예: { x: 68, y: 88, scale: 2 }). 바뀌면 천천히 확대·이동
  zoom?: { x: number; y: number; scale: number };
}

// 대사 목록(선택지 답변 포함)에 위험도가 오르는 대사가 있는지
export function hasRisk(lines: EpisodeLine[]): boolean {
  return lines.some((l) => !!l.risk || l.choices?.some((c) => hasRisk(c.reply)));
}

export interface Episode {
  // 컬렉션에 기록할 때 쓰는 고유 키
  id: string;
  title: string;
  // 일러스트 (데이트를 끝내면 공개, 컬렉션 카드에도 씀. 없으면 배경 + 등장 캐릭터로 대신 그림)
  illust?: string;
  // 에피소드 배경 이미지 (없으면 기본 배경)
  background?: string;
  // 현재 상황 창 아이콘 (이모지)
  icon?: string;
  lines: EpisodeLine[];
  // 위험도가 100에 닿으면 그 대사 바로 뒤에 이어지는 배드엔딩 장면 (끝나면 정체 발각 연출)
  badEnding?: EpisodeLine[];
}

// 뱀파이어 테마에 맞춰 준비된 배경 (나머지 그림 배경은 EpisodeScene에서 임시로 school.jpg로 보여줌)
export const READY_BACKGROUNDS = new Set<string>([
  dormRoomBg,
  studyroomImg,
  classroomBg,
  ballroomBg,
  barBg,
  poolBg,
  studyroomBg,
  maidCafeBg,
  dormBackBg,
  nightStreetBg,
  clawMachineBg,
  alleyBg,
  roseGardenBg,
  dormHallBg,
  dormRooftopBg,
]);

// 11월 데이트: 호감도 80 이상이면 초대받고 데이트 상대로 고를 수 있음
const DATE_AFFECTION = 80;
const canDate = (heroine: Heroine) => (affection: Affection) => affection[heroine] >= DATE_AFFECTION;
const anyDate = (affection: Affection) => HEROINES.some((h) => affection[h] >= DATE_AFFECTION);
const noDate = (affection: Affection) => !anyDate(affection);
// 호감도가 모자라 고를 수 없는 데이트 선택지에 붙는 안내
const DATE_LOCKED = `호감도 ${DATE_AFFECTION} 필요`;

// 조건을 만족할 때만 나오는 장면
function onlyIf(when: (affection: Affection) => boolean, lines: EpisodeLine[]): EpisodeLine[] {
  return lines.map((line) => ({ ...line, when }));
}

// 루트 안 어디서 위험도 100에 닿아도 그 루트의 배드엔딩이 나오게 모든 대사(선택지 답변 포함)에 붙임
function withBadEnding(lines: EpisodeLine[], badEnding: EpisodeLine[]): EpisodeLine[] {
  return lines.map((line) => ({
    ...line,
    badEnding: line.badEnding ?? badEnding,
    ...(line.choices && { choices: line.choices.map((c) => ({ ...c, reply: withBadEnding(c.reply, badEnding) })) }),
  }));
}

// 11월 민지 루트. 둘만의 인간 세상
const MINJI_ROUTE = withBadEnding(
  [
    // 지난번에 못 놀았잖아
    { text: '민지에게 가겠다고 연락하자마자 답이 왔다.', background: dormRoomBg },
    { speaker: 'minji', text: '「빨리 나와. 기다리다 얼어 죽겠다.」', expression: 'less', voice: 'ep7/민지/민지10(카톡)' },
    { text: '나는 겉옷을 걸치고 기숙사 뒤쪽으로 나갔다. 민지는 모자를 눌러쓰고 나를 기다리고 있었다.', background: dormBackBg },
    { speaker: 'player', text: '몰래 간다더니 왜 이렇게 당당하게 서 있어?' },
    { speaker: 'minji', text: '괜찮아~ 그냥 산책 나온 줄 알겠지. 얼른 가자!', expression: 'smile', voice: 'ep7/민지/민지11' },
    { text: '민지가 알아낸 기숙사 뒤편의 비밀 통로를 지나자 익숙한 밤거리가 펼쳐졌다. 편의점 간판과 버스 정류장, 지나가는 사람들까지 전부 반가웠다.', hidePortrait: true, background: nightStreetBg },
    { speaker: 'minji', text: '와. 저번에는 알바하느라 제대로 못 봤는데, 여기 진짜 볼 거 많다.', expression: 'bigsmile', voice: 'ep7/민지/민지12' },
    { speaker: 'player', text: '그때 너 손님 피 냄새 맡고 달려들 뻔한 건 기억하지?' },
    { speaker: 'minji', text: '아 너무 쪽팔린다… 그 때는 내가 진짜 미쳤었나 봐.', expression: 'less', voice: 'ep7/민지/민지13' },
    { speaker: 'minji', text: '오늘은 안 그럴 거야. 오늘은 중요한 날이니깐.', voice: 'ep7/민지/민지14' },
    { speaker: 'player', text: '정말이지?' },
    { speaker: 'minji', text: '의심하는거야? 그럼 네가 계속 옆에서 보고 있어.', expression: 'smile', voice: 'ep7/민지/민지15' },
    // 위험 상황 ① 민지가 팔을 잡아당김
    { text: '민지가 내 팔을 잡아 자기 쪽으로 끌었다. 갑자기 몸이 가까워지자 얼굴이 뜨거워졌다.', risk: { amount: 30, kind: 'excite' } },
    // 선택지 1. 민지와 나란히 걷기
    {
      text: '민지가 내 팔을 잡은 채 나를 올려다봤다.',
      choices: [
        {
          text: '사람 많으니까 천천히 가자.',
          affection: {},
          reply: [
            { text: '나는 팔에 힘을 빼고 민지 옆으로 한 걸음 물러섰다.' },
            { speaker: 'minji', text: '뭐야, 도망가려고? 알았어. 대신 내 옆에 붙어 있어.', expression: 'less', voice: 'ep7/민지/민지16' },
          ],
        },
        {
          text: '그럼 오늘은 네가 날 이끌어 줘.',
          affection: { minji: 5 },
          reply: [
            { speaker: 'minji', text: '오? 그럼 오늘 내가 가자는 데 다 가는 거다?', expression: 'bigsmile', voice: 'ep7/민지/민지17' },
            { text: '민지는 잡고 있던 내 팔을 놓는 대신 손을 꼭 잡았다. 차가운 손과 달리 내 손은 점점 뜨거워졌다.', risk: { amount: 20, kind: 'excite' } },
          ],
        },
        {
          text: '네가 옆에 오는 게 싫어. 혼자 앞서 가.',
          affection: { minji: -15 },
          stats: { mental: -3 },
          reply: [
            { speaker: 'minji', text: '야, 너 그럼 왜 나왔어.', expression: 'less', voice: 'ep7/민지/민지18', risk: { amount: 70, kind: 'excite' } },
            { speaker: 'player', text: '미안. 불안해서 괜히 너한테 화냈어.' },
            { speaker: 'minji', text: '그럼 처음부터 불안하다고 말해야지.', expression: 'less', voice: 'ep7/민지/민지19' },
          ],
        },
      ],
    },
    { text: '민지가 길 건너편을 가리켰다. 불빛이 번쩍이는 작은 오락실이었다.' },
    { speaker: 'minji', text: '저기 가자. 나 저런 거 처음 봐.', expression: 'bigsmile', voice: 'ep7/민지/민지20' },
    { speaker: 'player', text: '저기? 사람 많을 텐데 괜찮겠어?' },
    { speaker: 'minji', text: '왜, 또 내가 사고 칠까 봐? 걱정 마. 이번엔 얌전히 있을게.', expression: 'smile', voice: 'ep7/민지/민지21' },
    { speaker: 'player', text: '그런 뜻이 아니라…….' },
    { speaker: 'minji', text: 'ㅎㅎ농담이야. 걱정되면 나만 보고 있어.', expression: 'shy_smile', voice: 'ep7/민지/민지22' },

    // 민지가 고른 인형
    { text: '오락실 안에서 민지는 인형 뽑기 기계 앞에 멈춰 섰다. 안에는 작은 토끼 인형이 잔뜩 쌓여 있었다.', background: clawMachineBg },
    { speaker: 'player', text: '토끼 좋아해?' },
    { speaker: 'minji', text: '딱히? 근데 저거 너 닮았어.', expression: 'smile', voice: 'ep7/민지/민지23' },
    { speaker: 'player', text: '어디가?' },
    { speaker: 'minji', text: '겁먹은 눈. 지금 네 표정이랑 똑같잖아.', expression: 'bigsmile', voice: 'ep7/민지/민지24' },
    { text: '민지는 동전을 넣고 집게를 움직였다. 한 번, 두 번 실패하더니 입술을 삐죽 내밀었다.' },
    { speaker: 'minji', text: '아, 이거 왜 이렇게 힘이 없어? 내가 직접 들어가는 게 빠르겠다.', expression: 'less', voice: 'ep7/민지/민지25' },
    { speaker: 'player', text: '그건 안 되지! 잠깐, 옆에 걸 잡아 봐. 이쪽이 더 잘 잡힐 것 같은데.' },
    { speaker: 'minji', text: '너 이거 해 봤어?', expression: 'surprised_soft', voice: 'ep7/민지/민지26' },
    { speaker: 'player', text: '어…… 그냥 본 적이 있어서.' },
    { speaker: 'minji', text: '너 저번 수업 때도 그러더니, 인간 세상에 대해 되게 잘 아네?', expression: 'smile', voice: 'ep7/민지/민지27' },
    { text: '심장이 철렁했다. 나는 급히 기계 안쪽을 가리켰다.' },
    { speaker: 'player', text: '거기! 지금 내려!' },
    { text: '민지가 버튼을 누르자 집게가 토끼 인형을 잡았다. 덜컹거리던 인형이 출구로 떨어졌다.' },
    { speaker: 'minji', text: '어! 됐다! 봤지? 내가 뽑았어!', expression: 'bigsmile', voice: 'ep7/민지/민지28' },
    { speaker: 'player', text: '내가 옆에서 알려줬거든?' },
    { speaker: 'minji', text: '그래. 같이 한걸로 하자. 이건 너 가져.', expression: 'smile', voice: 'ep7/민지/민지29' },
    { text: '민지는 인형에 달린 고리를 내 손에 쥐여 줬다. 나는 작은 토끼를 들어 올렸다. 가면무도회에서 민지가 썼던 토끼 가면이 떠올랐다.' },
    { speaker: 'player', text: '이거 나 주려고 뽑은 거야?' },
    { speaker: 'minji', text: '너 닮아서 주는 거야. 왜 싫어?', expression: 'shy_smile', voice: 'ep7/민지/민지30' },
    { speaker: 'player', text: '아니, 좋아. 고마워.' },
    { text: '민지는 아무렇지 않은 척 다른 쪽을 봤다. 그런데 귀가 조금 빨개진 것 같았다.' },

    // 상처에서 나는 냄새
    { text: '오락실을 나와 인형을 가방에 달려고 고리를 만졌다. 그때 고리 끝에 손가락이 긁혔다.', background: nightStreetBg },
    { speaker: 'player', text: '아…….' },
    { text: '손끝에 작은 피가 맺혔다. 민지는 아직 옆 가게의 진열장을 보고 있었다.' },
    // 위험 상황 ② 출혈 (실제 피가 나서 정신력 회피 없이 위장도만 적용) + 선택지 2. 피가 난 손가락
    {
      speaker: 'player',
      text: '(……큰일이다. 바로 가려야 해.)',
      risk: { amount: 80, kind: 'bleed' },
      choices: [
        {
          text: '손가락을 소매로 바로 감싸고 민지에게서 한 걸음 물러난다.',
          affection: {},
          reply: [
            { text: '나는 재빨리 소매로 손가락을 감쌌다. 피가 밖으로 더 번지지 않도록 꼭 눌렀다.', risk: { amount: -10, kind: 'calm' } },
            { speaker: 'minji', text: '너 갑자기 왜 그래?', expression: 'surprised_soft', voice: 'ep7/민지/민지31' },
            { speaker: 'player', text: '아, 아무것도 아니야. 조금 긁혔어.' },
          ],
        },
        {
          text: '“이 정도는 괜찮아.” 하고 인형부터 민지에게 보여 준다.',
          affection: { minji: 5 },
          reply: [
            { text: '나는 상처를 가리지 않은 채 인형을 들어 보였다. 그 사이 손끝에서 난 피 냄새가 민지 쪽으로 퍼졌다.', risk: { amount: 70, kind: 'bleed' } },
            { speaker: 'minji', text: '…응? 하영아, 너 손 다쳤어?', expression: 'surprised_soft', voice: 'ep7/민지/민지32' },
            { text: '나는 뒤늦게 손가락을 소매로 감쌌다. 민지의 눈이 내 손에서 떨어지지 않았다.' },
          ],
        },
        {
          text: '피가 난 손가락을 민지의 코앞에 내민다.',
          affection: {},
          stats: { disguise: -5 },
          reply: [
            { speaker: 'minji', text: '……잠깐. 이 냄새…… 그때 그 손님한테서 났던…….', expression: 'surprised_soft', voice: 'ep7/민지/민지33', risk: { amount: 90, kind: 'bleed' } },
            { text: '나는 뒤늦게 손을 빼 소매로 감쌌다. 피가 멈추지 않아 손끝이 떨렸다.' },
          ],
        },
      ],
    },
    { speaker: 'minji', text: '다쳤어? 손 줘 봐.', voice: 'ep7/민지/민지34' },
    { speaker: 'player', text: '별거 아니야. 조금 긁혔다니까.' },
    { speaker: 'minji', text: '아까부터 왜 그렇게 숨겨? 내가 너 잡아먹기라도 할까 봐?', expression: 'smile', voice: 'ep7/민지/민지35' },
    { text: '평소 같았으면 장난처럼 들렸을 말이었다. 하지만 민지의 시선이 내 손끝에 머문 순간, 아무 대답도 할 수 없었다.' },
    { speaker: 'minji', text: '……야. 너 진짜 무서워하는 거야?', expression: 'less', voice: 'ep7/민지/민지36' },
    { text: '나는 민지를 데리고 사람들의 발길이 뜸한 골목 입구로 물러났다. 감싼 손가락은 아직 조금 따끔거렸다.', background: alleyBg },
    { speaker: 'minji', text: '너 오늘 이상해. 나오니깐 좋아하는 것 같다 가도, 내가 가까이 가면 자꾸 겁먹고.', expression: 'less', voice: 'ep7/민지/민지37' },
    { text: '민지가 내 손을 다시 잡으려다 멈췄다.' },
    { speaker: 'minji', text: '하영아. 너 나한테 숨기는 거 있지?', voice: 'ep7/민지/민지38' },

    // 민지에게 하는 고백
    { speaker: 'player', text: '(언제까지 숨길 수 있을까. 다음에도 이렇게 다치면? 그때도 민지를 속일 수 있을까?)' },
    { speaker: 'player', text: '민지야. 나 사실…… 인간이야.' },
    { text: '민지의 표정이 굳었다.' },
    { speaker: 'minji', text: '……뭐?', expression: 'surprised_soft', voice: 'ep7/민지/민지39' },
    { speaker: 'player', text: '네가 좋아한다고 했던 냄새도…… 아마 내 피 냄새였을 거야.' },
    { speaker: 'minji', text: '…야. 그런 걸로 장난치는 거 아니야', expression: 'less', voice: 'ep7/민지/민지40' },
    { speaker: 'player', text: '장난 아니야.' },
    { text: '민지는 한동안 아무 말도 하지 않았다. 그러더니 내 쪽으로 한 걸음 다가왔다.' },
    { speaker: 'minji', text: '…그럼 너, 처음 만났을 때부터 지금까지 날 속인 거야?', expression: 'less', voice: 'ep7/민지/민지41' },
    { speaker: 'player', text: '들키면 죽을까 봐 말할 수가 없었어.' },
    { speaker: 'minji', text: '내가 네 앞에서 인간 피 먹고 싶다고 떠든 것도 다 들었잖아.', expression: 'less', voice: 'ep7/민지/민지42' },
    // 선택지 3. 민지에게 대답하기
    {
      speaker: 'minji',
      text: '…그때 무슨 생각 했어? 내가 널 잡아먹을까 봐 무서웠어?',
      expression: 'less',
      voice: 'ep7/민지/민지43',
      choices: [
        {
          text: '처음엔 무서웠어. 그래도 지금은 너를 믿고 싶어.',
          affection: { minji: 10 },
          reply: [
            { speaker: 'minji', text: '…그래. 안 무서웠다면 그게 더 이상한 거겠지.', voice: 'ep7/민지/민지44' },
            { speaker: 'minji', text: '근데 지금은 믿어 보고 싶다고? 너, 그 말 책임질 수 있어?', expression: 'shy_smile', voice: 'ep7/민지/민지45' },
          ],
        },
        {
          text: '응. 네가 날 잡아먹을까 봐 무서웠어.',
          affection: { minji: 5 },
          reply: [
            { speaker: 'minji', text: '하…… 그렇게 대놓고 들으니까 좀 상처긴 하네.', expression: 'less', voice: 'ep7/민지/민지46' },
            { speaker: 'minji', text: '…뭐, 내가 네 앞에서 했던 말들을 생각하면 그럴 수 있지.', voice: 'ep7/민지/민지47' },
          ],
        },
        {
          text: '너 같은 뱀파이어는 절대 믿을 수 없어.',
          affection: { minji: -20 },
          stats: { mental: -5 },
          reply: [
            { speaker: 'minji', text: '……그렇게 생각했으면 왜 나랑 여기까지 왔는데?', expression: 'less', voice: 'ep7/민지/민지48', risk: { amount: 70, kind: 'excite' } },
            { speaker: 'player', text: '미안해. 지금 너무 무서워서 너한테 화풀이했어. 그래도 너를 믿고 싶어.' },
            { speaker: 'minji', text: '…하아. 무서운 건 알겠는데, 그런 말까지 할 필요는 없잖아.', expression: 'less', voice: 'ep7/민지/민지49' },
          ],
        },
      ],
    },
    { text: '민지는 내 소매를 붙잡았다. 피가 배어 나온 부분을 보던 민지의 눈빛이 아까와 달라졌다.' },
    { speaker: 'minji', text: '나 지금도 네 피 냄새 맡으니까… 솔직히 엄청 먹고 싶어.', voice: 'ep7/민지/민지50' },
    { text: '나는 몸을 굳혔다. 민지의 손에 힘이 들어갔다가, 곧 천천히 풀렸다.' },
    { speaker: 'minji', text: '그래도 걱정 마. 너한테 무슨 짓 하기 싫어서 꾹 참고 있으니까.', expression: 'less', voice: 'ep7/민지/민지51' },
    { text: '민지는 내 손을 놓고 주머니를 뒤졌다. 조금 전 가게에서 받아 둔 휴지를 꺼내 내밀었다.' },
    { speaker: 'minji', text: '자, 이걸로 감아. 너 진짜 손 많이 간다?', expression: 'smile', voice: 'ep7/민지/민지52' },
    { speaker: 'player', text: '너…… 화 안 났어?' },
    { speaker: 'minji', text: '화났지. 엄청. 지금도 속았다는 생각하면 좀 짜증 나.', expression: 'less', voice: 'ep7/민지/민지53' },
    { speaker: 'minji', text: '근데 네가 인간이라고 해서 우리가 같이 보낸 시간까지 가짜가 되는 건 아니잖아.', voice: 'ep7/민지/민지54' },
    { text: '나는 휴지로 손가락을 감쌌다. 민지는 조금 떨어진 곳에서 그 모습을 가만히 보고 있었다.' },
    { speaker: 'player', text: '다른 사람들한테 말할 거야?' },
    { speaker: 'minji', text: '날 그렇게 생각한 거야? 나도 생각이란게 있거든. 네가 인간이라는 걸 알면 다른 애들이 가만히 있겠어?', expression: 'surprised_soft', voice: 'ep7/민지/민지55' },
    { speaker: 'minji', text: '대신 앞으로 나한테 솔직해지겠다고 약속해. 무서우면 무섭다고, 돌아가고 싶으면 돌아가고 싶다고 말해.', voice: 'ep7/민지/민지56' },
    { speaker: 'player', text: '……응. 노력할게.' },
    { speaker: 'minji', text: '노력 말고. 약속.', expression: 'smile', voice: 'ep7/민지/민지57' },
    { text: '민지가 손가락을 내밀었다. 나는 다치지 않은 손으로 민지의 손가락을 걸었다.' },

    // 12월로 이어지는 약속
    { text: '학교로 돌아가는 길, 민지는 아까 뽑은 토끼 인형이 내 가방에 달려 있는지 몇 번이나 확인했다.', background: nightStreetBg },
    { speaker: 'minji', text: '근데 넌 언젠가는 인간 세상으로 돌아가겠지?', voice: 'ep7/민지/민지58' },
    { speaker: 'player', text: '……응. 원래 내가 살던 곳이니까.' },
    { speaker: 'minji', text: '그럼 나는…?', expression: 'less', voice: 'ep7/민지/민지59' },
    { text: '나는 민지를 바라봤다. 민지는 앞을 보며 걸었지만 내 대답을 기다리고 있었다.' },
    { speaker: 'minji', text: '나도 같이 가고 싶다고 하면, 너는 어떨 것 같아?', expression: 'shy_smile', voice: 'ep7/민지/민지60' },
    { speaker: 'player', text: '그건…….' },
    { speaker: 'minji', text: '아, 나 그냥 지금 대답 안들을래. 12월에 답 해줘.', expression: 'smile', voice: 'ep7/민지/민지61' },
    { speaker: 'minji', text: '그때까지 나 피해 다니면 진짜 화낸다.', expression: 'bigsmile', voice: 'ep7/민지/민지62' },
    { text: '말은 그렇게 하면서도 민지는 내 다친 손이 아닌 반대쪽 손을 잡았다.' },
    { text: '나는 이번에는 피하지 않았다.' },
    { name: 'END', text: '민지와 나눈 비밀' },
  ],
  // 민지 루트 배드엔딩. 피 냄새에 이끌려
  [
    { speaker: 'minji', text: '잠깐…… 이 냄새, 인간 피야……?', expression: 'surprised_soft', voice: 'ep7/민지/민지63' },
    { text: '민지가 숨을 들이마셨다. 나를 보던 눈빛이 점점 달라졌다.' },
    { speaker: 'player', text: '민지야, 잠깐만…….' },
    { speaker: 'minji', text: '……너무…… 맛있는 냄새가 나……', expression: 'less', voice: 'ep7/민지/밈지64' },
    { text: '민지는 나를 붙잡은 손을 놓지 못했다. 내가 몸을 빼려 했지만 이미 늦었다.' },
    { text: '결국 나는 민지에게 인간의 피를 빼앗긴 채 쓰러졌다.', hidePortrait: true },
    { name: 'BAD END', text: '참지 못한 식욕' },
  ],
);

// 11월 에밀리 루트. 대답을 기다리는 정원
const EMILY_ROUTE = withBadEnding(
  [
    // 학교 뒤 정원
    { text: '에밀리에게 정원으로 가겠다고 답장을 보냈다.', background: dormRoomBg },
    { text: '학교 뒤편으로 향하자 사람들의 목소리가 멀어졌다. 정원 안쪽에는 가로등 불빛이 희미하게 닿고 있었다.', background: roseGardenBg },
    { text: '에밀리는 꽃이 핀 화단 앞에 서 있었다. 내가 다가가자 나를 보더니 살짝 고개를 돌렸다.', stage: ['emily'] },
    { speaker: 'emily', text: '왔구나. 너무 늦어서 그냥 갈려고 했는데.', voice: 'ep7/에밀리/에밀리5' },
    { speaker: 'player', text: '나 그렇게 늦지 않았는데?' },
    { speaker: 'emily', text: '그렇다면 내가 조금 일찍 온 모양이지.', voice: 'ep7/에밀리/에밀리6' },
    { text: '에밀리는 내 얼굴을 한 번 보고는 앞장서 걸었다. 나는 그 옆에 나란히 섰다.' },
    { speaker: 'player', text: '그런데 여기서 무슨 이야기를 하려고 부른 거야?' },
    { speaker: 'emily', text: '인간 세상에서 돌아온 뒤로 계속 마음에 걸리는 일이 있었는데.', voice: 'ep7/에밀리/에밀리7' },
    { speaker: 'player', text: '메이드카페에서 민지가 소란 피운 일?' },
    { speaker: 'emily', text: '손님이 다쳤을 때, 너는 민지를 막으면서도 손님의 상태를 살피더군.', voice: 'ep7/에밀리/에밀리8' },
    { speaker: 'emily', text: '그리고 그때 네게서 희미하게 나던 향이…… 손님의 피 냄새와 비슷했어.', voice: 'ep7/에밀리/에밀리9' },
    { text: '에밀리의 말에 몸이 굳었다. 그날 내 상처를 들키지 않으려고 숨겼는데, 냄새는 감추지 못한 걸까.' },
    { speaker: 'player', text: '손님 피 냄새가 내 옷에 밴 거 아닐까?' },
    { speaker: 'emily', text: '처음엔 나도 그렇게 생각했지. 하지만 네가 인간 세상에 대해 지나치게 익숙한 것도 그렇고……', voice: 'ep7/에밀리/에밀리10' },
    { speaker: 'emily', text: '그래서 네가 인간일지도 모른다고 생각했단다.', voice: 'ep7/에밀리/에밀리11' },
    { speaker: 'player', text: '……뭐?' },
    { speaker: 'emily', text: '네 입으로 직접 듣고 싶어. 너 정체가 뭐야?', voice: 'ep7/에밀리/에밀리12' },
    { speaker: 'emily', text: '하영아. 내가 잘못 짚은 거라면, 지금 말해줘.', voice: 'ep7/에밀리/에밀리13' },
    { text: '나는 입을 열었다가 다물었다. 에밀리는 재촉하지 않고 내 얼굴을 바라봤다.' },
    { speaker: 'emily', text: '지금 당장 대답하지 않아도 괜찮아. 조금 걷자. 준비가 되면 그때 이야기해 주렴.', voice: 'ep7/에밀리/에밀리14' },
    { text: '에밀리는 천천히 앞장섰다. 나는 떨리는 손을 주머니에 넣고 그 뒤를 따라갔다.' },

    // 에밀리가 보여 준 꽃
    { text: '에밀리는 정원 한쪽에 남아 있는 붉은 장미 앞에서 멈췄다.' },
    { speaker: 'emily', text: '날이 추워졌는데 아직 피어 있네. 지난번에 왔을 때보다 더 붉어진 것 같아.', voice: 'ep7/에밀리/에밀리15' },
    { text: '에밀리는 내 대답을 기다려 주려는 듯 장미를 바라봤다. 침묵이 길어지자 나도 꽃으로 시선을 돌렸다.' },
    { speaker: 'player', text: '에밀리는 꽃 좋아해?' },
    { speaker: 'emily', text: '싫어하지 않아. 빨간 장미는 아름답지만 동시에 꽤 솔직한 꽃이거든. 사랑과 욕망이라는 감정을 숨김없이 드러내니까.', voice: 'ep7/에밀리/에밀리16' },
    { speaker: 'emily', text: '그러고 보니 누군가와 여기에 온 건 처음이군.', voice: 'ep7/에밀리/에밀리17' },
    // 위험 상황 ① 에밀리가 가까이 다가옴 + 선택지 1. 장미 앞에서
    {
      text: '에밀리가 꽃을 살펴보며 내 쪽으로 몸을 기울였다. 은발이 내 어깨 가까이 흘러내렸다.',
      risk: { amount: 30, kind: 'excite' },
      choices: [
        {
          text: '여기 예쁘다. 불러 줘서 고마워.',
          affection: { emily: 5 },
          reply: [
            { speaker: 'emily', text: '내가 고른 곳이니까 당연히 아름답지.', voice: 'ep7/에밀리/에밀리18' },
            { text: '에밀리는 꽃 쪽으로 고개를 돌렸지만, 입가에 작은 미소가 걸려 있었다.' },
          ],
        },
        {
          text: '꽃보다 네가 더 눈에 들어오는데.',
          affection: { emily: 10 },
          reply: [
            { speaker: 'emily', text: '……뭐?', voice: 'ep7/에밀리/에밀리19' },
            { text: '에밀리가 갑자기 나를 돌아봤다. 얼굴이 더 가까워지자 심장이 빨리 뛰었다.', risk: { amount: 20, kind: 'excite' } },
            { speaker: 'emily', text: '그런 말을 아무렇지도 않게 하는구나. 너, 정말…….', voice: 'ep7/에밀리/에밀리20' },
            { text: '에밀리는 말을 끝내지 못하고 한 걸음 물러섰다. 귀가 조금 빨개져 있었다.' },
          ],
        },
        {
          text: '너랑 있는 건 시간 낭비야.',
          affection: { emily: -15 },
          stats: { charm: -3 },
          reply: [
            { speaker: 'emily', text: '…그렇게까지 말할 필요는 없지 않니?', voice: 'ep7/에밀리/에밀리21', risk: { amount: 70, kind: 'excite' } },
            { speaker: 'player', text: '미안해. 네가 무슨 말을 할지 무서워서 괜히 날카롭게 말했어.' },
            { speaker: 'emily', text: '괜찮아. 하지만 내 이야기는 끝까지 들어 줬으면 좋겠구나.', voice: 'ep7/에밀리/에밀리22' },
          ],
        },
      ],
    },
    { speaker: 'player', text: '그 꽃, 가까이서 봐도 돼?' },
    { speaker: 'emily', text: '조심하렴. 줄기에 가시가 있으니까.', voice: 'ep7/에밀리/에밀리23' },
    { text: '내가 꽃 쪽으로 손을 뻗은 순간, 옷소매가 가지에 걸렸다. 빼내려다가 가시에 손끝이 긁혔다.' },
    { speaker: 'player', text: '아…….' },
    // 위험 상황 ② 출혈 (실제 피가 나서 정신력 회피 없이 위장도만 적용) + 선택지 2. 가시에 긁힌 손
    {
      text: '손가락에 붉은 피가 맺혔다. 에밀리가 내 손을 바라봤다.',
      risk: { amount: 80, kind: 'bleed' },
      choices: [
        {
          text: '손수건으로 곧바로 상처를 감싼다.',
          affection: {},
          reply: [
            { text: '나는 주머니에서 손수건을 꺼내 손가락을 감쌌다.', risk: { amount: -10, kind: 'calm' } },
            { speaker: 'emily', text: '우선 상처부터 지혈하렴. 손수건을 꽉 누르고 있어.', voice: 'ep7/에밀리/에밀리24' },
          ],
        },
        {
          text: '“괜찮아.” 하고 손을 가리지 않은 채 에밀리에게 다가간다.',
          affection: {},
          reply: [
            { text: '피가 맺힌 손을 내린 채 괜찮다고 말하려는 순간, 에밀리의 표정이 굳었다.', risk: { amount: 70, kind: 'bleed' } },
            { text: '나는 뒤늦게 손수건으로 손을 감쌌다. 에밀리는 물러서지도 못한 채 내 손을 바라보고 있었다.' },
          ],
        },
        {
          text: '가시에 긁힌 손을 가리지 않은 채 에밀리에게 보여 준다.',
          affection: {},
          stats: { disguise: -5 },
          reply: [
            { text: '에밀리의 시선이 내 손끝에 고정됐다. 나는 그녀의 눈빛이 달라지는 걸 보고 급히 손수건을 꺼냈다.', risk: { amount: 90, kind: 'bleed' } },
          ],
        },
      ],
    },
    { speaker: 'emily', text: '하영아. 방금 그 냄새…….', voice: 'ep7/에밀리/에밀리25' },
    { speaker: 'player', text: '꽃 냄새 아니야?' },
    { speaker: 'emily', text: '내가 그런 것도 구별하지 못할 거라 생각하니?', voice: 'ep7/에밀리/에밀리26' },
    { text: '에밀리가 가까이 다가왔다가 멈췄다. 평소 같으면 내 반응을 놀렸을 텐데, 지금은 웃고 있지 않았다.' },
    { speaker: 'emily', text: '네 피에서 나는 향이야. 틀림없어. 내가 맡았던 인간의 피 냄새와 똑같아…….', voice: 'ep7/에밀리/에밀리27' },
    { text: '에밀리는 말끝을 흐렸다. 나는 손수건을 쥔 손에 힘을 줬다.' },
    { text: '에밀리는 이미 나를 의심하고 있었다. 더 숨기려 해도 이제는 내 입으로 말해야 할 것 같았다.' },

    // 에밀리에게 하는 고백
    { speaker: 'player', text: '에밀리. 나 네게 할 말이 있어.' },
    { speaker: 'emily', text: '뭔데?', voice: 'ep7/에밀리/에밀리28' },
    { speaker: 'player', text: '나…… 뱀파이어가 아니야. 인간이야.' },
    { speaker: 'emily', text: '…정말이었구나.', voice: 'ep7/에밀리/에밀리29' },
    { text: '에밀리는 내 손과 얼굴을 번갈아 바라봤다. 의심은 했어도 직접 듣고 나니 믿기 어려운 것 같았다.' },
    { speaker: 'emily', text: '네가 진짜 인간이라고?', voice: 'ep7/에밀리/에밀리30' },
    { speaker: 'emily', text: '처음부터? 우리가 처음 수업에서 만났을 때부터?', voice: 'ep7/에밀리/에밀리31' },
    { speaker: 'player', text: '응. 처음부터.' },
    { text: '에밀리는 나에게서 한 걸음 물러났다. 손을 뻗으면 닿을 수 있던 거리가 갑자기 멀어진 것 같았다.' },
    { speaker: 'emily', text: '역시…… 그때 내가 맡았던 향도 네 피 냄새였구나.', voice: 'ep7/에밀리/에밀리32' },
    { speaker: 'player', text: '내 피 냄새였을 거야.' },
    { speaker: 'emily', text: '잠깐…… 막상 직접 들으니 머릿속이 정리가 안 되는군.', voice: 'ep7/에밀리/에밀리33' },
    { text: '에밀리는 이마를 짚었다. 무언가 말을 하려다가 다시 입을 다물었다.' },
    { speaker: 'player', text: '미안해. 말하고 싶었는데, 네가 날 어떻게 볼지 무서웠어.' },
    { speaker: 'emily', text: '내가 널 잡아먹을까 봐?', voice: 'ep7/에밀리/에밀리34' },
    { speaker: 'player', text: '……응. 처음에는 그랬어.' },
    { speaker: 'emily', text: '처음에는?', voice: 'ep7/에밀리/에밀리35' },
    // 선택지 3. 에밀리에게 전할 말
    {
      speaker: 'player',
      text: '지금은 네가 나한테 어떤 대답을 할지 더 무서워.',
      choices: [
        {
          text: '너와 보낸 시간까지 거짓말이었던 건 아니야.',
          affection: { emily: 10 },
          reply: [
            { speaker: 'emily', text: '……참 곤란하게 만드는구나.', voice: 'ep7/에밀리/에밀리36' },
            { speaker: 'emily', text: '너를 탓하고 싶다가도, 함께했던 시간이 떠올라 쉽게 그러지도 못하겠어.', voice: 'ep7/에밀리/에밀리37' },
          ],
        },
        {
          text: '널 속여서 미안해. 화가 나는 것도 이해해.',
          affection: { emily: 5 },
          reply: [
            { speaker: 'emily', text: '화가 나지 않는다면 거짓말이겠지.', voice: 'ep7/에밀리/에밀리38' },
            { speaker: 'emily', text: '하지만 네가 왜 말하지 못했는지는 어느 정도 이해해.', voice: 'ep7/에밀리/에밀리39' },
          ],
        },
        {
          text: '네가 뭘 느끼든 나랑 상관없어.',
          affection: { emily: -20 },
          stats: { charm: -5 },
          reply: [
            { speaker: 'emily', text: '나를 속인 것도 모자라 그런 말까지 하는구나.', voice: 'ep7/에밀리/에밀리40', risk: { amount: 70, kind: 'excite' } },
            { speaker: 'player', text: '미안해. 겁이 나서 모진 말을 했어. 너와 보낸 시간은 진심이었어.' },
            { speaker: 'emily', text: '…그런 말을 이제 와서 한들 무슨 소용이겠니.', voice: 'ep7/에밀리/에밀리41' },
          ],
        },
      ],
    },
    { speaker: 'emily', text: '나는 왜인지 모르겠는데 계속 너한테 끌렸어. 근데 이유가 네 피 때문이라면…', voice: 'ep7/에밀리/에밀리42' },
    { text: '말을 잇던 에밀리가 고개를 저었다.' },
    { speaker: 'emily', text: '너와 함께 있을 때 내가 느꼈던 감정까지 전부 가짜였다고 생각하고 싶지는 않아.', voice: 'ep7/에밀리/에밀리43' },
    { speaker: 'emily', text: '그런데 네가 인간이라는 걸 알게 되니 그 기억들을 어떻게 받아들여야 할지 모르겠어.', voice: 'ep7/에밀리/에밀리44' },
    { speaker: 'player', text: '내가 인간이라서 싫어졌어?' },
    { speaker: 'emily', text: '지금 바로… 대답할 수 있는 질문은 아닌거 같아.', voice: 'ep7/에밀리/에밀리45' },
    { text: '잠깐 침묵이 흘렀다. 에밀리는 여전히 나를 바라보고 있었지만, 이전처럼 다가오지는 않았다.' },
    { speaker: 'emily', text: '다른 사람에게도 말했니?', voice: 'ep7/에밀리/에밀리46' },
    { speaker: 'player', text: '아니. 지금은 너한테만 말한 거야.' },
    { speaker: 'emily', text: '한 가지는 약속할게. 다른 사람에게 네 정체를 말하는 일은 없을 거야.', voice: 'ep7/에밀리/에밀리47' },
    { text: '나는 그제야 조금 숨을 쉴 수 있었다. 하지만 에밀리의 표정은 여전히 복잡했다.' },

    // 아직 하지 못한 대답
    { speaker: 'emily', text: '하영아. 나에게 시간을 줄 수 있니?', voice: 'ep7/에밀리/에밀리48' },
    { speaker: 'player', text: '시간?' },
    { speaker: 'emily', text: '너를 어떻게 대해야 할지, 그리고 내가 네 곁에 있어도 되는지 생각하고 싶어.', voice: 'ep7/에밀리/에밀리49' },
    { speaker: 'emily', text: '네 피 냄새를 맡고도 아무렇지 않을 자신은 없어…… 그래도 너는 나에게 특별한 사람이야.', voice: 'ep7/에밀리/에밀리50' },
    { speaker: 'player', text: '……응. 기다릴게.' },
    { speaker: 'emily', text: '미안하구나. 먼저 너를 불러 놓고 이런 부탁까지 하게 되어서.', voice: 'ep7/에밀리/에밀리51' },
    { speaker: 'player', text: '아니야. 내가 이제야 솔직히 말했잖아.' },
    { text: '에밀리는 내 손에 감긴 손수건을 한 번 더 바라봤다.' },
    { speaker: 'emily', text: '상처는 잘 가리고 다니고 오늘처럼 피가 나면 바로 숨기고.', voice: 'ep7/에밀리/에밀리52' },
    { speaker: 'player', text: '알겠어.' },
    { speaker: 'emily', text: '그리고…… 12월에 다시 여기서 만나자. 그때는 내가 먼저 이야기할게.', voice: 'ep7/에밀리/에밀리53' },
    { text: '에밀리는 나보다 먼저 정원을 나갔다. 붙잡고 싶었지만 지금은 그러지 않았다.', hidePortrait: true },
    { speaker: 'player', text: '(12월. 그때 에밀리는 나에게 어떤 말을 할까.)' },
    { text: '나는 손수건을 꼭 쥔 채 한동안 장미 앞에 서 있었다.' },
    { name: 'END', text: '아직 끝나지 않은 대답' },
  ],
  // 에밀리 루트 배드엔딩. 장미 아래의 냄새
  [
    { speaker: 'emily', text: '이 향…… 인간의 피잖아.', voice: 'ep7/에밀리/에밀리54' },
    { text: '에밀리의 시선이 내 손에 고정됐다. 가까이 다가온 얼굴에서 평소의 여유가 사라져 있었다.' },
    { speaker: 'player', text: '에밀리, 잠깐만…….' },
    { speaker: 'emily', text: '물러나…… 아니, 잠깐…….', voice: 'ep7/에밀리/에밀리55' },
    { text: '에밀리는 내 손을 놓으려 했지만 짙어진 피 냄새를 견디지 못했다.' },
    { text: '그날 밤, 나는 정원에서 정체를 들킨 채 목숨을 잃었다.', hidePortrait: true },
    { name: 'BAD END', text: '장미 아래의 인간' },
  ],
);

// 11월 시영 루트. 내가 무서워
const SIYEONG_ROUTE = withBadEnding(
  [
    // 울고 있던 이유
    { text: '시영이의 이야기를 들은 뒤 겉옷을 걸치고 다시 나왔다. 시영이는 복도 의자에 앉아 있었다. 눈가는 조금 진정됐지만 여전히 나를 보는 표정이 불안했다.', stage: ['siyeong'], background: dormHallBg },
    { speaker: 'player', text: '시영아. 어디로 가고 싶어?' },
    { speaker: 'siyeong', text: '옥상에 가자. 거기는 지금 아무도 없을 거야.', voice: 'ep7/시영/시영8' },
    { text: '우리는 말없이 기숙사 계단을 올라갔다. 옥상 문을 열자 차가운 밤바람이 불어왔다.', background: dormRooftopBg, stage: ['siyeong'] },
    { text: '시영이는 난간 앞에 섰다가 품에 꼭 쥐고 있던 작은 방울을 내려다봤다.' },
    { speaker: 'player', text: '그거…… 고양이 거야?' },
    { speaker: 'siyeong', text: '응. 학교로 데려왔을 때 달아 줬어. 내가 방에 들어가면 이 소리부터 들렸는데…….', voice: 'ep7/시영/시영9' },
    { text: '시영이는 방울을 손가락으로 살짝 움직였다. 작은 소리가 한 번 나고 멈췄다.' },
    { speaker: 'siyeong', text: '어제 물그릇이 깨지면서 그 애가 발을 다쳤어. 바로 상처를 봐줬어야 했는데…….', voice: 'ep7/시영/시영10' },
    { speaker: 'siyeong', text: '피 냄새가 나니까 갑자기 아무 생각도 안 났어. 그 애가 놀라서 벗어나려고 했는데도… 나는 멈추지 못했어.', voice: 'ep7/시영/시영11' },
    { speaker: 'player', text: '시영아…….' },
    { speaker: 'siyeong', text: '내가 매일 안아 주던 애야. 나를 보면 먼저 다가왔는데…… 내가 그 애를 죽였어.', voice: 'ep7/시영/시영12' },
    { text: '시영이는 방울을 쥔 손을 가슴에 붙였다. 한참을 고개 숙이고 있던 시영이가 다시 입을 열었다.' },
    { speaker: 'siyeong', text: '나 왜 뱀파이어로 태어났을까. 그냥 인간으로 태어났으면 좋았을 텐데…….', voice: 'ep7/시영/시영13' },
    { speaker: 'siyeong', text: '가끔은 내가 무서워. 소중한 애한테도 그런 짓을 했는데, 또 이성을 잃으면 어떡하지?', voice: 'ep7/시영/시영14' },
    { speaker: 'player', text: '많이 무서웠겠다. 혼자 계속 그 생각을 하고 있었어?' },
    { speaker: 'siyeong', text: '응. 너한테까지 이런 모습 보여 주기 싫었는데…… 혼자 있으니까 견딜 수가 없었어.', voice: 'ep7/시영/시영15' },
    { text: '시영이가 천천히 내 소매를 잡았다. 손끝이 떨리고 있었다.' },
    { speaker: 'siyeong', text: '하영아…… 잠깐만 안아도 돼?', voice: 'ep7/시영/시영16' },
    { speaker: 'player', text: '응. 괜찮아.' },
    // 위험 상황 ① 시영이 하영을 안음
    { text: '시영이가 내 허리를 끌어안았다. 나는 조심스럽게 시영이의 등을 토닥였다. 갑자기 가까워진 거리에 얼굴이 뜨거워졌다.', risk: { amount: 50, kind: 'excite' } },
    { text: '그때 시영이의 손이 멈췄다. 내 어깨에 닿아 있던 얼굴이 조금 들렸다.' },
    { speaker: 'siyeong', text: '…하영아. 너 인간이지?', voice: 'ep7/시영/시영17' },
    { speaker: 'player', text: '뭐……?' },
    { speaker: 'siyeong', text: '나 사실…어릴 때 인간을 먹어 본 적 있어. 가까이서 냄새를 맡으니까…… 확실히 알겠어.', voice: 'ep7/시영/시영18' },
    { text: '온몸이 굳었다. 들키지 않으려고 억눌렀던 두려움이 한꺼번에 밀려왔다. 긴장할수록 피가 빠르게 돌고, 냄새도 짙어질 것이다.' },
    { speaker: 'siyeong', text: '정신 차려야 해…… 하영이한테 이러면 안 돼….', voice: 'ep7/시영/시영19' },
    // 선택지 1. 정체를 알아챈 시영
    {
      text: '시영이는 나를 안은 팔을 놓으려는 듯했지만 손에 힘이 들어갔다. 떨리던 눈이 내 목을 향했다.',
      choices: [
        {
          text: '시영아, 나를 봐. 천천히 떨어져 줘.',
          affection: { siyeong: 5 },
          reply: [
            { text: '나는 숨을 천천히 내쉬며 시영이의 어깨를 붙잡았다.' },
            { speaker: 'siyeong', text: '응… 놓아야 하는데…', voice: 'ep7/시영/시영20' },
          ],
        },
        {
          text: '괜찮아. 네가 날 해치지 않을 거라고 믿어.',
          affection: { siyeong: 10 },
          reply: [
            { text: '나는 시영이를 다독이려고 안고 있던 팔에 힘을 줬다. 가까이 닿아 있는 동안 불안해진 몸에서 피가 더 빠르게 돌았다.', risk: { amount: 20, kind: 'excite' } },
          ],
        },
        {
          text: '네가 무서워. 괴물 같아.',
          affection: { siyeong: -20 },
          stats: { mental: -5 },
          reply: [
            { speaker: 'siyeong', text: '…괴물이라고…?', voice: 'ep7/시영/시영21', risk: { amount: 80, kind: 'excite' } },
            { text: '시영이의 손에 힘이 들어갔다. 나는 놀라 급히 말을 고쳤다.' },
            { speaker: 'player', text: '미안해. 무서워서 심하게 말했어. 일단 나를 놓아 줘.' },
          ],
        },
      ],
    },
    { speaker: 'siyeong', text: '하영아, 미안해. 빨리…… 나한테서 도망가.', voice: 'ep7/시영/시영22' },
    { speaker: 'player', text: '시영아, 같이 진정하자. 일단 손부터 놔 줘.' },
    { speaker: 'siyeong', text: '안 돼…… 나 또…….', voice: 'ep7/시영/시영23' },
    { text: '시영이가 갑자기 내 팔을 잡아당겼다. 나는 뒤로 물러나려 했지만 시영이는 나를 붙잡은 채 벽 쪽으로 밀어붙였다.' },
    { speaker: 'player', text: '시영아! 잠깐만!' },
    // 위험 상황 ② 몸싸움 중 피가 빠르게 돈다 + 선택지 2. 시영이를 떼어 놓기
    {
      text: '내 목을 향해 다가오는 시영이의 어깨를 붙잡고 밀어냈다. 우리는 옥상 문 앞에서 몸이 엉킨 채 휘청거렸다. 겁이 날수록 피가 빨리 돌았다.',
      risk: { amount: 60, kind: 'excite' },
      choices: [
        {
          text: '“시영아, 나야! 잠깐만 멈춰!”',
          affection: {},
          reply: [
            { text: '나는 시영이의 팔을 밀어내며 숨을 가다듬으려 했다. 내 목소리에 시영이의 손이 잠깐 멈췄다.', risk: { amount: -10, kind: 'calm' } },
          ],
        },
        {
          text: '시영이를 밀치고 옥상 문으로 뛰어간다.',
          affection: {},
          reply: [
            { text: '급하게 문을 열려다 문고리의 날카로운 부분에 손이 긁혔다. 상처에서 피가 나자 시영이의 시선이 내 손으로 쏠렸다.', risk: { amount: 70, kind: 'bleed' } },
            { text: '나는 급히 소매로 상처를 감쌌다. 뒤따라온 시영이가 다시 내 팔을 붙잡았다.' },
          ],
        },
        {
          text: '문고리에 긁힌 손을 가리지 않고 시영이를 밀어낸다.',
          affection: {},
          stats: { disguise: -5 },
          reply: [
            { text: '옥상 문고리를 잡다가 손끝이 쓸렸다. 그 손으로 시영이를 밀어내자 피 냄새가 가까이 퍼졌고 시영이의 눈빛이 흔들렸다.', risk: { amount: 90, kind: 'bleed' } },
            { speaker: 'player', text: '안 돼…… 시영아, 잠깐만!' },
            { text: '나는 뒤늦게 소매로 상처를 감쌌다.' },
          ],
        },
      ],
    },
    { speaker: 'player', text: '시영아, 무서워…… 제발 나 좀 놔 줘.' },
    { text: '그 말에 시영이의 손이 굳었다. 시영이는 내 얼굴을 바라보다가, 내 팔을 붙잡고 있던 자기 손으로 시선을 내렸다.' },
    { speaker: 'siyeong', text: '내가…… 하영이한테도…….', voice: 'ep7/시영/시영24' },
    { text: '시영이의 손가락 사이에서 아까 쥐고 있던 방울이 바닥으로 떨어졌다. 작은 소리에 시영이의 눈빛이 흔들렸다.' },
    { speaker: 'siyeong', text: '그 애한테 했던 짓을…… 너한테도 하려고 했어.', voice: 'ep7/시영/시영25' },
    { text: '시영이는 내 팔을 놓고 뒷걸음질 쳤다. 나도 벽에 기댄 채 거칠어진 숨을 골랐다.' },
    { speaker: 'player', text: '시영아…….' },
    { speaker: 'siyeong', text: '미안해. 나 진짜 너를…….', voice: 'ep7/시영/시영26' },
    { text: '시영이는 끝내 말을 잇지 못했다. 떨어진 방울을 주워 쥔 채 내 곁을 피해 옥상 문으로 달려갔다.' },
    { speaker: 'player', text: '시영아, 잠깐만!' },
    { text: '문이 닫혔다. 나는 시영이를 쫓아가지 못하고 그 자리에 서 있었다.', hidePortrait: true },
    { text: '시영이는 내가 인간이라는 걸 알아챘다. 그리고 나를 놓아줬지만, 서로에게 하고 싶은 말은 아무것도 끝내지 못했다.' },
    { text: '그날 이후 시영이에게 연락했지만 답이 오지 않았다. 다시 마주하면 무슨 말을 해야 할까. 그 답을 찾지 못한 채 11월이 지나갔다.' },
    { name: 'END', text: '닫힌 옥상 문' },
  ],
  // 시영 루트 배드엔딩. 멈추지 못한 충동
  [
    { speaker: 'siyeong', text: '하영아…… 도망가…….', voice: 'ep7/시영/시영27' },
    { text: '시영이는 나를 놓으려고 했지만 짙어진 피 냄새에 다시 내 팔을 붙잡았다.' },
    { speaker: 'player', text: '시영아, 제발……!' },
    { speaker: 'siyeong', text: '미안해…… 이번에도 멈출 수가 없어…….', voice: 'ep7/시영/시영28' },
    { text: '시영이를 밀어내려 했지만 몸에 힘이 풀렸다. 그날 밤, 나는 옥상에서 피를 빼앗기고 목숨을 잃었다.', hidePortrait: true },
    { name: 'BAD END', text: '멈추지 못한 손' },
  ],
);

// 임시 에피소드. 달(1~12)별로 지정하고, 없는 달은 DEFAULT_EPISODE
// id는 처음 나온 달 기준이라 지금 달과 다를 수 있음 (저장된 컬렉션·선택 기록과 맞추려고 바꾸지 않음)
const EPISODES: Record<number, Episode> = {
  // EP 1. 첫 수업
  4: {
    id: 'first-class',
    title: '첫 수업',
    icon: '📖',
    background: classroomBg,
    lines: [
      { text: '대학교에서 처음으로 수업을 듣는 날이다.' },
      { text: '강의실 문 앞에서 한참을 서 있었다. 안에서는 학생들이 떠드는 소리가 들려왔다.' },
      { speaker: 'player', text: '(첫 수업이라 그런지 괜히 긴장된다. 늦기 전에 자리에 앉아야겠다.)' },
      { text: '나는 심호흡을 한 번 하고 조심스럽게 문을 열었다.' },
      { text: '강의실은 내가 알던 대학교 강의실과 크게 다르지 않았다. 칠판이 있고, 책상이 줄지어 놓여 있고, 학생들은 삼삼오오 모여 얘기를 하고 있었다.' },
      { text: '평범한 대학 강의실 같았다. 창문마다 두꺼운 커튼이 쳐져 있다는 점만 빼면.' },
      { text: '나는 강의실 뒤쪽 빈자리에 앉아 가방을 무릎 위에 올렸다.' },
      { speaker: 'player', text: '(첫 수업은 어떤 내용일까.)' },
      { text: '시간표를 한 번 더 확인하고 앞을 바라봤다.' },
      { text: '잠시 뒤, 교수가 강의실에 들어왔다. 떠들던 학생들이 하나둘 입을 다물었다.' },
      { name: '교수', text: '반갑습니다. 이번 학기 현대 사회 생존학을 맡은 교수입니다.' },
      { text: '교수는 칠판에 ‘인간 사회’라고 적었다. 그 아래에는 ‘생존’이라는 단어가 적혔다.' },
      { speaker: 'player', text: '(‘인간 사회’라니. 우리가 사는 사회를 말하는 건가?)' },
      { speaker: 'player', text: '(강의 이름이 현대 사회 생존학이어서 취업이나 사회생활에 관한 수업인 줄 알았다.)' },
      { name: '교수', text: '여러분은 대학을 마친 뒤 우리가 사는 차원을 떠나 인간들 사이에서 살아가게 됩니다.' },
      { speaker: 'player', text: '(……차원?)' },
      { text: '나는 시간표를 다시 확인했다. 현대 사회 생존학. 강의실을 잘못 찾아온 건 아닌데.' },
      { text: '교수의 말을 듣던 옆자리 학생들이 작은 목소리로 이야기했다.' },
      { name: '학생 1', text: '야, 너 인간 세상 가 본 적 있어?' },
      { name: '학생 2', text: '아니. 근데 나가면 제일 먼저 인간부터 보고 싶어.' },
      { name: '학생 1', text: '보기만 하게?' },
      { name: '학생 2', text: '뭐, 기회가 되면 맛도 봐야지.' },
      { speaker: 'player', text: '(……맛을 봐?)' },
      { speaker: 'player', text: '(내가 방금 제대로 들은 건가. 사람을 보러 가서 맛을 본다고?)' },
      { text: '어떤 게임 이야기를 하는 건가. 둘 다 웃지도 않고 이야기하니 괜히 끼어들기가 어려웠다.' },
      { name: '교수', text: '스무 살이 되는 해부터 인간 세상에 갈 수 있고, 그곳에서 여든 살까지 살아남아야 진정한 뱀파이어로 인정받아 다시 돌아올 수 있죠.' },
      { speaker: 'player', text: '(……뱀파이어?)' },
      { text: '나는 고개를 들어 강의실을 둘러봤다. 누군가는 책을 펴고 있었고, 누군가는 태연하게 필기하고 있었다.' },
      { speaker: 'player', text: '(다들 아무렇지도 않다. 방금 들은 게 수업을 위한 설정인가?)' },
      { name: '교수', text: '당장 혼자 보내지는 않습니다. 앞으로 4년 동안 인간의 생활 방식과 심리, 예절을 배우고 현장 실습도 나갈 겁니다.' },
      { name: '교수', text: '인간들은 뱀파이어가 존재한다는 사실을 모릅니다. 여러분이 무엇을 먹는지도, 어떤 생활을 하는지도 모르죠.' },
      { name: '교수', text: '그들에게 정체를 들키지 않고 살아가는 것. 그게 이 수업의 목적입니다.' },
      { speaker: 'player', text: '(인간에게 정체를 들키지 않는다고? 대학 첫 수업에 이런 걸 배우는 거였어?)' },
      { text: '설정이라고 하기에는 교수의 목소리가 너무 진지했다.' },
      { name: '교수', text: '주로 밤에 활동해야 하니 야간에 일할 수 있는 직업을 선택하는 학생들이 많습니다. 편의점, 호텔, 병원처럼요.' },
      { speaker: 'minji', text: '교수님, 그럼 인간들이랑 매일 붙어 있어야 하는 거예요?', voice: 'ep1/민지/민지1' },
      { name: '교수', text: '직업에 따라 다르겠지만, 그럴 수도 있겠죠.' },
      { speaker: 'minji', text: '와…… 맨날 보고 있으면 그냥 한 번쯤 먹고 싶어질 것 같은데.', expression: 'smile', voice: 'ep1/민지/민지2' },
      { text: '말을 마친 앞줄 여자애가 옆을 돌아보며 웃었다. 입술 사이로 보인 송곳니가 조금씩 길어졌다.' },
      { text: '방금까지는 저렇지 않았는데. 나는 눈을 비비고 다시 봤다. 여자애는 아무 일도 없다는 듯 입을 다물었다.' },
      { text: '주변을 둘러봤지만 그걸 이상하게 보는 사람은 아무도 없었다.', hidePortrait: true },
      { name: '교수', text: '그 욕구를 들키지 않는 법을 배우는 겁니다. 눈앞의 인간에게 정신이 팔려서 정체가 드러나면, 다른 인간들과 섞여 사는 건 어려워지니까요.' },
      { text: '뒤쪽에서 몇몇 학생이 고개를 끄덕였다. 나는 굳은 손으로 가방끈을 움켜쥐었다.' },
      { speaker: 'player', text: '(처음엔 학생들이 이상한 농담을 한다고 생각했다. 교수님도 수업을 위해 설정을 잡은 줄 알았다.)' },
      { speaker: 'player', text: '(그런데 방금 본 건 뭘까. 정말 이곳이 뱀파이어가 다니는 학교라면…….)' },
      { speaker: 'player', text: '(그리고 저 애들이 말하는 인간이 나라는 걸 알게 되면?)' },
      { text: '나는 자리에서 일어나려다 멈췄다. 문까지 가려면 다른 학생들 사이를 지나가야 한다.' },
      { speaker: 'player', text: '(지금 갑자기 나갔다가 주목받으면 어떡하지. 일단 수업이 끝날 때까지 조용히 있어 보자.)' },

      // 네 사람이 한 조
      { name: '교수', text: '첫날부터 실제 상황을 생각해 봅시다. 네 명씩 조를 만들어서 자료를 나눠 드릴게요.' },
      { speaker: 'player', text: '(네 명씩……? 혼자 조용히 앉아 있으면 끝날 줄 알았는데.)' },
      { text: '교수는 명단을 보며 이름을 불렀다.' },
      { name: '교수', text: '{name}, 송민지, 에밀리, 서시영 학생이 한 조입니다. 저쪽 빈 책상에 모이세요.' },
      { text: '앞줄에 앉아 있던 여자애가 의자를 뒤로 밀고 일어났다.' },
      { speaker: 'minji', text: '아, 첫날부터 조별 과제야?', expression: 'less', voice: 'ep1/민지/민지3' },
      { text: '은발의 여자애가 책을 챙기며 그쪽을 바라봤다.' },
      { speaker: 'emily', text: '불만이 있다면 교수님께 직접 말씀드리렴. 들릴 만큼 중얼거리지 말고.', stage: ['minji', 'emily'], voice: 'ep1/에밀리/에밀리1' },
      { speaker: 'minji', text: '내가 너한테 말했냐?', expression: 'less', voice: 'ep1/민지/민지4' },
      { speaker: 'emily', text: '듣기 싫어도 들렸으니까 하는 말이지.', voice: 'ep1/에밀리/에밀리2' },
      { text: '둘은 잠깐 서로를 노려봤지만, 교수가 자료를 들고 다가오자 각자 자리에 앉았다.' },
      { text: '마지막으로 검은 머리의 여자애가 책을 안고 조용히 걸어왔다. 내 맞은편에 앉더니 작게 고개를 숙였다.' },
      { speaker: 'siyeong', text: '서시영이라고 해요…… 잘 부탁드려요.', stage: ['minji', 'siyeong', 'emily'], voice: 'ep1/시영/시영1' },
      { speaker: 'player', text: '아, 응. 나는 {name}이야.' },
      { speaker: 'emily', text: '소개는 다 끝난 거니? 그럼 일단 읽어 보자. 수업이 끝나기 전까지 제출해야 하니깐.', voice: 'ep1/에밀리/에밀리3' },
      { text: '교수가 우리 조의 책상에 상황이 적힌 종이와 빈 답안지를 내려놓았다.' },
      { name: '과제', text: '[상황: 인간 세상의 카페에서 마감 근무를 하고 있다. 함께 일하던 인간 동료가 식기를 정리하다 컵을 깨뜨려 손을 베었고, 매장 안에는 아직 나가기 전인 손님들이 남아 있다.]' },
      { name: '과제', text: '[뱀파이어의 정체를 들키지 않고 상황을 수습하는 방법을 순서대로 적으시오.]' },
      { speaker: 'player', text: '(……왜 하필 사람이 다치는 상황이야.)' },
      { speaker: 'minji', text: '인간이 다쳤으면 피가 나겠네.', voice: 'ep1/민지/민지5' },
      { speaker: 'siyeong', text: '손님도 있으니까…… 바로 다가가면 안 되겠죠?', voice: 'ep1/시영/시영2' },
      { speaker: 'minji', text: '손님부터 내보내면 되지. 그다음에 둘이 남으면…….', expression: 'smile', voice: 'ep1/민지/민지6' },
      { speaker: 'emily', text: '손님을 내보낸 뒤 동료까지 사라지면 당연히 범인은 너겠지. 머리는 폼으로 있니?', voice: 'ep1/에밀리/에밀리4' },
      { speaker: 'minji', text: '왜 지랄이야? 장난친 거지!', expression: 'less', voice: 'ep1/민지/민지7' },
      { speaker: 'emily', text: '네 표정만 봐도 너가 뭘 할지 눈에 보여.', voice: 'ep1/에밀리/에밀리5' },
      { speaker: 'player', text: '일단은…… 다친 사람이 얼마나 다쳤는지 확인해야 하지 않을까?' },
      { text: '세 사람의 시선이 나에게 향했다.' },
      { speaker: 'player', text: '많이 다쳤으면 도움을 불러야 할 수도 있으니까.' },
      { speaker: 'siyeong', text: '아…… 그렇네요. 도움을 부를 곳도 적어야겠네요.', voice: 'ep1/시영/시영3' },
      { text: '시영이는 답안지 위에 연필을 올렸다. 잠시 망설이다가 나를 봤다.' },
      { speaker: 'siyeong', text: '인간 세상에서는…… 어디에… 연락해야 하는 거지…?', voice: 'ep1/시영/시영4' },
      { speaker: 'player', text: '응급 상황이면 119에…….' },
      { text: '말을 끝내기도 전에 입을 다물었다.' },
      { speaker: 'player', text: '(아, 나도 모르게 대답해 버렸다.)' },
      { speaker: 'minji', text: '119? 그게 뭔데?', expression: 'surprised_soft', voice: 'ep1/민지/민지8' },
      { speaker: 'player', text: '그게…….' },
      { text: '우리 쪽을 지나가던 교수가 발을 멈췄다.' },
      { name: '교수', text: '{name} 학생은 그 번호를 어디서 알았죠?' },
      { speaker: 'player', text: '(갑자기 머릿속이 하얘졌다. 내가 인간이라는 걸 들킨 건 아니겠지?)' },
      // 위험 상황 ① 교수의 질문에 당황함
      { text: '당황해서 피가 빠르게 도는 게 느껴졌다. 진정해야 하는데 자꾸 입이 말랐다.', risk: { amount: 10, kind: 'excite' } },
      // 선택지 1. 어떻게 알았다고 대답할까 (위험도 100에 닿으면 즉시 배드엔딩)
      {
        speaker: 'player',
        text: '(뭐라고 대답하지……?)',
        choices: [
          {
            text: '인간 사회에 관한 자료를 찾아보다가 봤어요.',
            affection: {},
            reply: [
              { name: '교수', text: '미리 공부해 왔군요. 나라에 따라 번호가 다를 수 있으니 실습을 나가기 전에는 해당 지역의 번호를 확인해야 합니다.' },
              { speaker: 'player', text: '네. 조심할게요.' },
              { speaker: 'player', text: '(다행이다. 더 묻지는 않는 것 같다.)' },
            ],
          },
          {
            text: '그냥…… 알고 있었어요.',
            affection: {},
            reply: [
              { name: '교수', text: '그냥 알고 있었다고요?', risk: { amount: 20, kind: 'excite' } },
              { speaker: 'player', text: '아, 그게…… 전에 인간 사회에 관한 걸 찾아보다가 본 것 같아요.' },
              { text: '급하게 말을 고쳤다. 교수는 나를 잠시 바라보다가 답안지를 내려다봤다.' },
              { name: '교수', text: '알고 있는 건 좋지만, 어디서 본 정보인지 확인하는 습관도 들이세요. 잘못된 정보는 실습에서 위험해질 수 있습니다.' },
            ],
          },
          {
            text: '제가 인간이라서 당연히 알죠.',
            affection: {},
            reply: [
              // 직접 정체를 드러내 즉시 발각 (위장도·정신력으로 피할 수 없음)
              { text: '교수의 표정이 굳었다. 교실 안의 시선이 한꺼번에 내게 쏠렸다.', risk: { amount: 100, kind: 'reveal' } },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '너 그런 것도 미리 찾아본 거야? 생각보다 뭘 좀 많이 아네?', expression: 'smile', stage: ['minji', 'siyeong', 'emily'], voice: 'ep1/민지/민지9' },
      { speaker: 'player', text: '아…… 그냥 조금.' },
      { speaker: 'emily', text: '적어도 아무 생각 없이 말하는 것보다는 확실히 낫네.', voice: 'ep1/에밀리/에밀리6' },
      { speaker: 'minji', text: '뭐? 너 지금 나한테 하는 말이지?', expression: 'less', voice: 'ep1/민지/민지10' },
      { speaker: 'emily', text: '찔린다면 네 얘기겠지.', voice: 'ep1/에밀리/에밀리7' },
      { text: '또 싸우려는 건가. 나는 얼른 답안지를 가리켰다.' },
      { speaker: 'player', text: '그래서…… 이제 뭘 먼저 적을까?' },

      // 조별 답안
      { speaker: 'siyeong', text: '다친 사람을 도우면서…… 다른 손님들에게 이상하게 보이지 않아야 해요.', voice: 'ep1/시영/시영5' },
      { speaker: 'minji', text: '손님들 있으면 귀찮으니까, 난 일단 가게 앞부터 정리할래.', voice: 'ep1/민지/민지11' },
      { speaker: 'emily', text: '가게를 네 마음대로 비울 수 있을 것 같니? 점장한테 연락해서 상황을 알리는 게 먼저지.', voice: 'ep1/에밀리/에밀리8' },
      { speaker: 'siyeong', text: '구급상자는…… 중요하니깐… 어디에 있는지 알아 둬야 할 것 같아요.', voice: 'ep1/시영/시영6' },
      { text: '셋 다 한마디씩 했지만, 답안지에는 아직 아무것도 적히지 않았다.' },
      { text: '시영이가 연필을 든 채 나를 바라봤다.' },
      // 선택지 2. 어떤 의견부터 적을까
      {
        speaker: 'siyeong',
        text: '하영아, 뭘 먼저 쓰면 좋을까?',
        voice: 'ep1/시영/시영7',
        choices: [
          {
            text: '에밀리 말대로 점장에게 연락하는 것부터 적자.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '그래. 혼자 처리할 수 없을 때는 책임자부터 불러야지.', voice: 'ep1/에밀리/에밀리9' },
              { speaker: 'minji', text: 'ㅎ, 지 말 맞다고 하니까 표정 풀리는 거 봐.', expression: 'smile', voice: 'ep1/민지/민지12' },
              { speaker: 'emily', text: '시끄러워. 나머지 의견도 이어서 적으면 되잖니.', voice: 'ep1/에밀리/에밀리10' },
            ],
          },
          {
            text: '민지 말대로 다른 손님들이 다치지 않게 입구부터 정리하자.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '그렇지. 사람들 계속 들어오면 더 정신없잖아.', expression: 'bigsmile', voice: 'ep1/민지/민지13' },
              { speaker: 'emily', text: '입구만 막고 끝낼 생각은 설마… 아니겠지?', voice: 'ep1/에밀리/에밀리11' },
              { speaker: 'minji', text: '알아서 다음 것도 적을 거거든? 좀 기다려 봐.', expression: 'less', voice: 'ep1/민지/민지14' },
            ],
          },
          {
            text: '시영이 말대로 구급상자를 가져와서 옆에 두자.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '내 의견…… 괜찮았어?', voice: 'ep1/시영/시영11' },
              { speaker: 'player', text: '응. 바로 필요한 물건이 어디 있는지 알아야 하니까.' },
              { speaker: 'siyeong', text: '알겠어. 그럼 내가 적을게.', voice: 'ep1/시영/시영9' },
              { text: '시영이는 아까보다 조금 빠르게 답안지를 채워 나갔다.' },
            ],
          },
          {
            text: '셋 다 쓸모없는 의견이야. 그냥 내 말대로 해.',
            affection: { minji: -15, emily: -15, siyeong: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'minji', text: '야, 네가 뭔데 남의 말을 그렇게 잘라?', expression: 'less', risk: { amount: 40, kind: 'excite' }, voice: 'ep1/민지/민지15' },
              { speaker: 'emily', text: '의견을 말하라고 해 놓고 모욕할 생각이었니?', voice: 'ep1/에밀리/에밀리12' },
              { speaker: 'player', text: '미안해. 너무 예민하게 말했어. 너희 의견도 같이 적자.' },
              { speaker: 'siyeong', text: '……응. 그럼 다시 이야기해 보자.' },
            ],
          },
        ],
      },
      { text: '네 사람은 손님이 다치지 않도록 주변을 정리하고, 점장에게 알리고, 필요한 구급 물품을 준비한다는 순서로 답안을 완성했다.', stage: ['minji', 'siyeong', 'emily'] },
      { text: '상태가 심각하면 인간 세상의 응급 연락처에 도움을 요청하는 것도 적었다.' },
      { speaker: 'minji', text: '됐다. 이 정도면 괜찮은 거 아니야?', expression: 'smile', voice: 'ep1/민지/민지16' },
      { speaker: 'emily', text: '아직 하나 빠졌어. 네가 피 냄새 맡고 달려드는 걸 어떻게 막을 건지.', voice: 'ep1/에밀리/에밀리13' },
      { speaker: 'minji', text: '아, 진짜. 너는 피 냄새 나면 아무렇지도 않나 보지?', expression: 'less', voice: 'ep1/민지/민지17' },
      { speaker: 'emily', text: '적어도 사람들 앞에서 침 흘리고 있지는 않겠지.', voice: 'ep1/에밀리/에밀리14' },
      { text: '교수가 두 사람의 목소리를 듣고 우리 조에 다가왔다.' },
      { name: '교수', text: '좋은 지적이 나왔군요. 상황은 정리했지만, 다친 인간 곁에는 여전히 여러분이 있습니다.' },
      { name: '교수', text: '상처에서 나는 냄새를 맡고 본능이 올라온다면 어떻게 해야 하죠?' },
      { speaker: 'minji', text: '잠깐 자리를 비우면 되지 않아요? 계속 쳐다보고 있으면 더 땡길 거 같은데.', voice: 'ep1/민지/민지18' },
      { name: '교수', text: '그렇습니다. 다른 사람에게 상황을 맡기고 냄새에서 벗어나는 것도 방법이에요. 다만 이유 없이 달아나거나 노골적으로 피를 탐내면 인간들도 이상하게 여기겠죠.' },
      { speaker: 'siyeong', text: '냄새가…… 그렇게 강하게 나나요?', voice: 'ep1/시영/시영10' },
      { name: '교수', text: '살아 있는 인간의 따뜻한 피는 보관된 피와 다릅니다. 특히 이성의 피 냄새에 강하게 끌려 흥분하거나 본능을 억누르기 어려워지는 경우도 있죠.' },
      { name: '교수', text: '피를 흘리지 않더라도 긴장하거나 흥분해서 피가 빠르게 돌면, 평소보다 체취가 짙어질 수 있습니다. 상처가 나면 냄새는 훨씬 직접적으로 퍼지고요.' },
      { speaker: 'player', text: '(피를 흘리지 않아도……?)' },
      { speaker: 'player', text: '(그럼 내가 겁을 먹거나 흥분하는 것만으로도 위험해질 수 있다는 거잖아.)' },
      { name: '교수', text: '평소의 체취만으로 상대가 인간인지 바로 알 수 있는 건 아닙니다. 하지만 냄새가 짙어지거나 피가 직접 드러난다면 이야기가 달라지죠.' },
      { speaker: 'minji', text: '와…… 그럼 실제로 맡으면 진짜 못 참을 수도 있겠네.', expression: 'surprised_soft', voice: 'ep1/민지/민지19' },
      { name: '교수', text: '그래서 배우는 겁니다. 눈앞의 인간에게 이끌리더라도 자신의 정체를 감출 수 있어야 인간 사회에 남을 수 있으니까요.' },
      { speaker: 'player', text: '(나는 피 냄새가 나지 않게 조심해야 한다. 이 학교에서 살아나갈 수 있을까…….)', hidePortrait: true },
    ],
    badEnding: [
      { name: '교수', text: '방금 인간이라고 했습니까?' },
      { text: '입을 막았지만 이미 늦었다.', hidePortrait: true },
      { name: 'BAD END', text: '직접 드러난 비밀' },
    ],
  },
  // EP 2. 가면무도회
  5: {
    id: 'month-4',
    title: '가면무도회',
    icon: '🎭',
    lines: [
      // 가면무도회의 초대
      { text: '문자가 날아왔다.', background: dormRoomBg },
      { text: '오랜 전통에 따라 가면무도회가 열리니 각자 알맞은 가면을 쓰고 파티에 오라고 한다.' },
      { speaker: 'player', text: '(과연 뱀파이어 대학다운 모습이다. 나가긴 가야겠지…)' },
      { text: '근처 문구점에서 가면을 사서 무도회장으로 갔다.' },

      // 무도회장
      { speaker: 'player', text: '(대학교에 이런 장소가…?)', background: ballroomBg },
      { text: '위대한 개츠비도 이런 성대한 파티를 열 수 없을 것 같은 파티가 열리고 있었다.' },
      { text: '어지러워서 구경만 하고 있던 도중 누가 뒤에서 건드렸다.' },
      { text: '토끼 가면을 쓴, 약간 키 작은 여자였다. 낯익은 목소리를 듣고 누군지 알 수 있었다.', cg: ep01MinjiCg },
      { speaker: 'minji', text: '야, 너 혼자 여기서 뭐 해?', voice: 'ep2/민지/민지1' },
      { speaker: 'player', text: '아, 민지야. 그냥 구경하고 있었어…' },
      { speaker: 'minji', text: '뭐 이런 거 처음 본 것 마냥 구경하고 있어?', voice: 'ep2/민지/민지2', cg: null },
      { speaker: 'minji', text: '여기 포도주 맛있더라~. 소 피가 들어가서 그런가 더 풍미가 돋아.', expression: 'smile', voice: 'ep2/민지/민지3' },
      { speaker: 'player', text: '(소 피?…)' },
      { text: '한 모금 마셔보려고 했는데 그 마음이 싹 가셨다.' },
      { speaker: 'minji', text: '음? 안 먹는 걸 보니 귀족 자제분이신가? 아니면 인간 피가 아니라서 안 먹는 거야?', voice: 'ep2/민지/민지4' },
      { speaker: 'player', text: '아… 아니. 그냥 내가 오늘 속이 좀.' },
      { speaker: 'minji', text: '그냥 술을 싫어하나? 그럴 수 있지! 나는 완전 좋아하는데~', expression: 'bigsmile', voice: 'ep2/민지/민지5' },
      { speaker: 'minji', text: '살아있는 인간 피가 들어간 포도주를 먹는 게 내 소원인데… 특히 20대 남자 피.', expression: 'shy_smile', voice: 'ep2/민지/민지6' },
      { speaker: 'minji', text: '완전 드라이한 맛으로 풍미가 몸속 구석구석 퍼진다던데~ 음.', expression: 'smile', voice: 'ep2/민지/민지7' },
      { speaker: 'player', text: '(아… 진짜 도망치고 싶다. 도저히 제정신으로 대화할 수가 없네.)' },
      // 선택지 1. 민지에게 대답하기 (위험도 100에 닿으면 즉시 배드엔딩)
      {
        speaker: 'player',
        text: '(정신 차리자. 들키면 바로 도축행이다…)',
        choices: [
          {
            text: '응, 나도야… 한 번 먹어보고 싶네.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '그래? 너 뭘 좀 아는 애구나?! 다음에 같이 먹어보자!', expression: 'bigsmile', voice: 'ep2/민지/민지8' },
              { speaker: 'player', text: '(같이는 무슨… 내가 그 포도주가 될 것 같은데.)' },
            ],
          },
          {
            text: '나는 아직 잘 모르겠어.',
            affection: { minji: 5 },
            reply: [{ speaker: 'minji', text: '하긴, 아직 안 먹어봤으면 모르지. 나중에 같이 도전해 보자.', expression: 'smile', voice: 'ep2/민지/민지9' }],
          },
          {
            text: '그런 얘기는 좀 무서운데…',
            affection: { minji: -5 },
            reply: [{ speaker: 'minji', text: '에이, 뭘 그런 걸로 무서워해. 너 생각보다 겁이 많구나?', expression: 'less', voice: 'ep2/민지/민지10' }],
          },
          {
            text: '인간 피를 먹고 싶다니, 너 진짜 역겹다.',
            affection: { minji: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'minji', text: '뭐? 지금 나한테 뭐라고 했어?', expression: 'less', voice: 'ep2/민지/민지11' },
              { text: '민지가 내 쪽으로 다가왔다. 괜히 다투다 피 냄새까지 짙어질까 봐 긴장됐다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안. 내가 너무 예민하게 말했어.' },
              { speaker: 'minji', text: '다음부터 말조심해.', expression: 'less', voice: 'ep2/민지/민지12' },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '근데 너 내 가면 쓴 모습도 바로 알아보네?', expression: 'smile', voice: 'ep2/민지/민지13' },
      { speaker: 'player', text: '목소리 듣자마자 알았어…' },
      { text: '민지가 웃으며 내 손을 덥석 잡았다.' },
      // 위험 상황 ① 민지가 손을 잡음
      { text: '갑자기 여자와 손을 잡으니 좀 흥분이 됐다. 심장이 괜히 빠르게 뛰었다.', risk: { amount: 20, kind: 'excite' } },
      { speaker: 'minji', text: '오늘도 너한테 맛있는 냄새가 난다…?', expression: 'surprised_soft', voice: 'ep2/민지/민지14' },
      { text: '민지는 내 목으로 코끝을 다가가 냄새를 맡으려고 한다.' },
      { speaker: 'emily', text: '야, 송민지. 뭐하냐?', stage: ['minji', 'emily'], voice: 'ep2/에밀리/에밀리1' },
      { text: '갑작스러운 목소리에 뒤를 돌아보니 은발의 에밀리가 고양이 가면을 쓰고 서 있었다.', cg: ep01EmilyCg },
      { speaker: 'minji', text: '아니 얘 좀 향기가 좋아서.', voice: 'ep2/민지/민지15', cg: null },
      { speaker: 'emily', text: '그렇다고 그렇게 달라붙냐? 천박하게.', voice: 'ep2/에밀리/에밀리2' },
      { speaker: 'minji', text: '응…? 너 진짜 죽을래?', expression: 'less', voice: 'ep2/민지/민지16' },
      { text: '두 여자가 나를 두고 싸우는데 기쁘지 않고 그냥 무서웠다.' },
      { speaker: 'siyeong', text: '그… 그만하세요.', stage: ['minji', 'siyeong', 'emily'], voice: 'ep2/시영/시영1', cg: ep01SiyeongCg },
      { text: '유령 가면을 쓴 시영이가 조심스럽게 말했다.' },
      { speaker: 'siyeong', text: '벌써부터 싸우면… 퇴학당해요…', voice: 'ep2/시영/시영2' },
      { speaker: 'minji', text: '아오 내가 착하니깐 한 번만 봐준다. 너 진짜 말 조심해라, 에밀리.', expression: 'less', voice: 'ep2/민지/민지17', cg: null },
      { speaker: 'minji', text: '나는 귀족 자제라고 봐주는 거 없어.', expression: 'less', voice: 'ep2/민지/민지18' },
      { speaker: 'emily', text: '…천박하게. 이래서 못 사는 애들이랑 상종하는 게 아니라니깐.', voice: 'ep2/에밀리/에밀리3' },
      { speaker: 'minji', text: '아, 진짜 현피 뜰까…?', expression: 'less', voice: 'ep2/민지/민지19' },
      { speaker: 'siyeong', text: '그… 그만요.', voice: 'ep2/시영/시영3' },
      { speaker: 'minji', text: '아니 시영아… 얘 말하는 것 좀 봐. 내가 화가 나는 게 당연한 거 아냐?', expression: 'less', voice: 'ep2/민지/민지20' },
      { speaker: 'minji', text: '근데 너 아까부터 왜 나만 막아? 너도 뒤질래?', expression: 'less', voice: 'ep2/민지/민지21' },
      { speaker: 'siyeong', text: '아… 아니요!!! 죄송해요… 저분은 좀 많이 무서워서…', voice: 'ep2/시영/시영4' },
      { speaker: 'minji', text: '뭐, 너도 죽자.', expression: 'less', voice: 'ep2/민지/민지22' },
      { text: '상황이 더 커지기 전, 대기하고 있던 선도부 무리가 다가와 민지를 끌고 갔다.', stage: ['siyeong', 'emily'] },

      // 에밀리의 질문
      { text: '고양이 가면을 쓴 에밀리도 끌려가는 민지를 바라보다가 말을 걸었다.' },
      { speaker: 'emily', text: '너도 귀족 자제인가? 계속 식욕이 도는 게 좋은 향수를 쓰는 것 같네.', voice: 'ep2/에밀리/에밀리4' },
      { speaker: 'emily', text: '음. 어떤 걸 쓰는지 알 수 있나?', voice: 'ep2/에밀리/에밀리5' },
      { speaker: 'player', text: '(돈 없어서 향수 안 쓰는데…)' },
      // 선택지 2. 무슨 향수를 쓰냐는 질문 (긴장해서 피 냄새가 짙어짐: 정신력 회피 후 위장도 적용)
      {
        speaker: 'player',
        text: '(뭔가 안 쓴다고 하면 들킬 것 같다.)',
        choices: [
          {
            text: '에르메스 향수야.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '그 브랜드에선 이런 향이 없는 거로 아는데?', voice: 'ep2/에밀리/에밀리6' },
              { text: '아… 괜히 아는 척했나. 에밀리의 눈빛에 긴장하자 피 냄새가 조금 짙어졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '향수는 안 뿌려.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '그럼 네 체향인 건가…? 그렇군…', voice: 'ep2/에밀리/에밀리7' },
              { text: '에밀리는 잠시 나를 바라보더니 고개를 돌렸다.' },
            ],
          },
          {
            text: '그건 알려 줄 수 없어.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '허. 알려줄 수 없다니… 그다지 궁금하지도 않았어. 흥미가 떨어졌다. 이만 가보도록 하지.', risk: { amount: 10, kind: 'excite' }, voice: 'ep2/에밀리/에밀리8' },
            ],
          },
          {
            text: '네가 알 필요 없어. 향수도 모르는 게 귀족이야?',
            affection: { emily: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'emily', text: '방금 뭐라고 했니?', voice: 'ep2/에밀리/에밀리9' },
              { text: '그녀가 정색하자 당황한 몸에서 피가 빠르게 돌았다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 그렇게 말하려던 건 아니었어.' },
              { speaker: 'emily', text: '생각을 좀 하고 말하렴.', voice: 'ep2/에밀리/에밀리10' },
            ],
          },
        ],
      },

      // 시영의 부탁
      { text: '옆에 있던 시영이도 나에게 말을 걸었다.' },
      { speaker: 'siyeong', text: '하영아… 너도 여기 있었구나.', stage: ['siyeong'], voice: 'ep2/시영/시영5' },
      { speaker: 'siyeong', text: '내가 원래 말을 잘 못 거는데… 냄새에 이끌려 오니깐 너 앞이었어.', voice: 'ep2/시영/시영6' },
      { speaker: 'siyeong', text: '뭔가 너한테 본능적으로 끌리는 느낌… 앗, 내가 무슨 말을 하는 거지… 미안… 다 잊어줘.', voice: 'ep2/시영/시영7' },
      { speaker: 'siyeong', text: '그… 부탁이 있는데… 혹시 손목 한 번만 물어봐도 될까…?', voice: 'ep2/시영/시영8' },
      { speaker: 'player', text: '뭐, 뭐라고?' },
      { speaker: 'player', text: '(잠깐, 손목을 문다고? 여기서 피가 나면 바로 끝이다. 뭐라고 대답해야 하지?)' },
      // 선택지 3. 시영의 부탁
      {
        text: '시영이는 내가 소매로 가린 손목을 잠깐 바라봤다. 무언가 떠올린 듯했지만 이내 시선을 내렸다.',
        choices: [
          {
            text: '손목은 안 돼. 대신 저기서 음료라도 마실래?',
            affection: {},
            reply: [
              { speaker: 'siyeong', text: '아… 응. 괜히 이상한 부탁해서 미안해.', voice: 'ep2/시영/시영9' },
              { text: '나는 손목을 뒤로 감추고 가볍게 웃었다. 일단 물리는 건 피했다.' },
            ],
          },
          {
            text: '손목은 좀 그렇고… 손 정도는 잡아도 돼.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '소, 손을…? 그럼 잠깐만…', voice: 'ep2/시영/시영10' },
              { text: '시영이 조심스럽게 내 손을 잡았다. 가까이서 얼굴을 보니 또 심장이 빨라지기 시작했다.', risk: { amount: 30, kind: 'excite' } },
            ],
          },
          {
            text: '너라면… 한 번 정도는 괜찮아.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…?', voice: 'ep2/시영/시영11' },
              { text: '시영이 내 손목을 붙잡고 천천히 가까이 다가왔다.' },
              { speaker: 'player', text: '(어쩌려고 이런 말을 한 거지? 심장이 터질 듯이 뛰었다.)', risk: { amount: 70, kind: 'excite' } },
            ],
          },
          {
            text: '좋아. 지금 내 손목을 물어 봐.',
            affection: {},
            reply: [
              { speaker: 'siyeong', text: '……정말?', voice: 'ep2/시영/시영12' },
              // 실제로 피가 나 즉시 발각 (위장도·정신력으로 피할 수 없음)
              {
                text: '송곳니가 손목에 닿자 피가 흘렀다. 붉게 맺힌 피의 냄새가 곧바로 주위로 퍼졌다.',
                risk: { amount: 100, kind: 'reveal' },
                badEnding: [
                  { text: '시영의 눈빛이 달라졌다. 나는 뒤늦게 손목을 감쌌지만 이미 늦었다.', hidePortrait: true },
                  { name: 'BAD END', text: '직접 드러난 비밀' },
                ],
              },
            ],
          },
        ],
      },
      { speaker: 'siyeong', text: '아 아냐… 포도주를 너무 많이 마셨나… 계속 이상한 말을 하네… 미안해.', voice: 'ep2/시영/시영13' },
      { text: '시영은 얼굴을 붉히며 한 걸음 뒤로 물러났다. 다행히 물리지는 않았다.' },
      { speaker: 'siyeong', text: '이만 나도 가 볼게… 더 있으면 계속 실수할 거 같아.', voice: 'ep2/시영/시영14' },
      { text: '이렇게 가면무도회는 끝났다.', hidePortrait: true },
      { text: '하나 알 수 있는 점은 살아남기 위해서 정신을 똑바로 차려야 한다는 점이었다.' },
      { speaker: 'player', text: '(너무 피곤하다…)' },
      { speaker: 'player', text: '(다음 수업에도 세 명을 마주칠 텐데… 최대한 조심해야겠다.)' },
    ],
    badEnding: [
      { speaker: 'siyeong', text: '잠깐만… 하영이한테서 나는 이 냄새…?' },
      { text: '시영의 시선이 내 손목에 멈췄다. 긴장해서 피가 빨리 돌자 인간의 피 냄새가 짙어졌다.' },
      { name: '주변 학생', text: '이 냄새… 인간의 피잖아.' },
      { text: '주변에 있던 뱀파이어들이 하나둘 고개를 돌렸다. 도망치려고 했지만 이미 사람들이 내 앞을 막고 있었다.', hidePortrait: true },
      { text: '나는 가면도 벗지 못한 채 무도회장에서 죽었다.' },
      { name: 'BAD END', text: '가면 뒤의 인간' },
    ],
  },
  // EP 3. 기말고사 뒤 술자리
  6: {
    id: 'month-5',
    title: '기말고사 뒤 술자리',
    icon: '🍷',
    lines: [
      { text: '기말고사가 끝난 기념으로 술자리가 열렸다. 바로 도망가고 싶었지만 다 참여하라고 해서 결국 가게 됐다.', background: dormRoomBg },

      // 기말고사 뒤 술자리
      { text: '여기 음식은 고기와 포도주가 전부였다.', background: barBg },
      { text: '그래서 고기 요리는 진짜 차원이 달랐다. 레어를 싫어하는데 딱 알맞은 굽기였다.' },
      { text: '나도 모르게 고기를 먹으면서 포도주를 마시게 됐다.' },
      { text: '한 잔을 비우고 나니 얼굴이 뜨거워졌다. 술기운 때문인지 심장도 조금씩 빨리 뛰기 시작했다.' },
      // 위험 상황 ① 포도주
      { speaker: 'player', text: '(아, 맞다. 흥분하면 안 되는데. 벌써부터 이러면 어떡하지?)', risk: { amount: 20, kind: 'excite' } },
      { speaker: 'minji', text: '야, 너 오랜만이다. 가면무도회 때 그 웃긴 가면 너 맞지?', expression: 'smile', voice: 'ep3/민지/민지1' },
      { text: '고개를 돌리자 송민지가 내 옆자리에 털썩 앉았다.' },
      { speaker: 'minji', text: '하.. 그때 선도부한테 끌려간거 아직도 어이없네. 뭐 그래도 오늘은 막을 사람은 없잖아?', expression: 'less', voice: 'ep3/민지/민지2' },
      { speaker: 'player', text: '뭘 하려고…?' },
      { speaker: 'minji', text: '야, 좀 더 가까이 와 봐.', expression: 'shy_smile', voice: 'ep3/민지/민지3' },
      { speaker: 'minji', text: '음, 너 옆에 앉으니까 이제 확실해졌다. 너 옆에 있으면 좀 오싹오싹하고 흥분되는 게…', expression: 'shy_smile', voice: 'ep3/민지/민지4' },
      { speaker: 'player', text: '흥분되는 게…?' },
      { text: '약간 눈이 돌아 있는 듯한 모습으로 나를 바라봐서 들키는 건가 무서웠다.' },
      { speaker: 'minji', text: '나 아무래도 너 좋아하나봐ㅋㅋ 너 나랑 사귈래?', expression: 'bigsmile', voice: 'ep3/민지/민지5', cg: ep03MinjiCg },
      { text: '…응? 너무 뜬금없이 고백을 받아 그냥 벙지게 되었다.' },
      { text: '뭔가 그동안 살 생각만 하니까 예쁘다고 생각이 들지 않았는데, 송민지는 귀여우면서 예뻐서 나도 모르게 볼이 빨개졌다.' },
      // 위험 상황 ② 민지의 고백 + 선택지 1. 민지의 갑작스러운 고백
      {
        text: '잠깐, 사귀자고? 심장이 뛰는 게 느껴질 정도로 빨라졌다.',
        risk: { amount: 20, kind: 'excite' },
        choices: [
          {
            text: '나도 너랑 더 친해지고 싶어.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '아 진짜? 나 그럼 기대해도 되는건가? 흐흥~', expression: 'bigsmile', voice: 'ep3/민지/민지6', cg: null },
              { speaker: 'player', text: '(아니, 친해지고 싶다고 했지 사귀겠다고는 안 했는데…)' },
            ],
          },
          {
            text: '갑자기라 좀 놀랐어.',
            affection: { minji: 5 },
            reply: [{ speaker: 'minji', text: '하긴, 내가 좀 갑작스러웠지? 그래도 잘 생각해 봐!', expression: 'smile', voice: 'ep3/민지/민지7', cg: null }],
          },
          {
            text: '장난은 그만해.',
            affection: { minji: -5 },
            reply: [{ speaker: 'minji', text: '이게 장난같아? 진지하게 말한건데… 너 은근 상처 준다.', expression: 'less', voice: 'ep3/민지/민지8', cg: null }],
          },
          {
            text: '너랑 친해지고 싶은 사람은 없을걸?',
            affection: { minji: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'minji', text: '야, 내가 고백하니깐 만만하냐?', expression: 'less', voice: 'ep3/민지/민지9', cg: null },
              { text: '민지가 잔을 내려놓고 내 얼굴을 노려봤다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 갑자기 놀라서 말이 심했어.' },
              { speaker: 'minji', text: '상처 받았어. 다음에도 그렇게 말하기만 해봐.', expression: 'less', voice: 'ep3/민지/민지10' },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '야, 너 또 얘 괴롭히니?', stage: ['minji', 'emily'], voice: 'ep3/에밀리/에밀리1' },
      { text: '은발 초미녀가 말을 걸었다.' },
      { text: '진짜 다행이다. 민지가 더 다가왔으면 심장이 더 빨리 뛰어서 피 냄새가 짙어졌을 것이다.' },
      { text: '개총과 수업에서 봤던 에밀리였다. 귀족 자제라 그런지 여전히 싸가지가 좀 없는 듯했다.' },
      { speaker: 'minji', text: '아, 또 너냐. 내가 그때 너 때문에 창피당한 거 생각하면 진짜…', expression: 'less', voice: 'ep3/민지/민지11' },
      { speaker: 'emily', text: '뭐, 니가 잘못한 건데. 창피할게 있니? 행동을 똑바로 하면 그럴 일도 없었을텐데. 에휴..', voice: 'ep3/에밀리/에밀리2' },
      { speaker: 'minji', text: '와, 내가 원래 이런 애가 아니거든? 근데 너는 진짜… 죽이고 싶다. 현피 뜰래?', expression: 'less', voice: 'ep3/민지/민지12' },
      { speaker: 'emily', text: '뭐래 꺼져. 그런 저급한 단어를 쓰다니.. 수준하곤.', voice: 'ep3/에밀리/에밀리3' },
      { speaker: 'player', text: '(아니, 지금 막으러 온 거 아니었어? 둘이 또 싸우려고 하는데…)' },
      { speaker: 'emily', text: '흠, 이 냄새가 오랜만이라 그런가? 더 끌리네.', voice: 'ep3/에밀리/에밀리4' },
      { speaker: 'emily', text: '그래서 오늘도 어떤 향수 쓰는지 안 알려줄거니?', voice: 'ep3/에밀리/에밀리5' },
      { speaker: 'player', text: '향수? 그 얘기를 또 왜…' },
      { speaker: 'emily', text: '계속 궁금했거든. 진짜 니 향인지.', voice: 'ep3/에밀리/에밀리6' },
      { text: '에밀리가 냄새를 맡으려 가까이 왔다.', cg: ep03EmilyCg },

      // 쏟아진 포도주
      { text: '그때 잔을 들고 다가오던 서시영이 에밀리와 나를 번갈아 봤다. 시영의 눈빛이 갑자기 이상해졌다.', stage: ['minji', 'siyeong', 'emily'], cg: null },
      { speaker: 'siyeong', text: '…너무 가까운거 아니에요….?', voice: 'ep3/시영/시영1' },
      { text: '갑자기 서시영이 빈손으로 에밀리를 힘껏 밀쳤다.' },
      { speaker: 'siyeong', text: '하영이한테 떨어져요!', voice: 'ep3/시영/시영2' },
      { text: '그 바람에 시영이 들고 있던 포도주 잔이 기울었다. 붉은 포도주가 에밀리의 흰 셔츠 위로 쏟아졌다.' },
      { speaker: 'emily', text: '…이게 뭐하는 짓이야?!', voice: 'ep3/에밀리/에밀리7' },
      { speaker: 'siyeong', text: '앗… 죄, 죄송해요!', voice: 'ep3/시영/시영3' },
      { text: '젖은 흰 셔츠 너머로 에밀리가 입은 검은색 브래지어의 윤곽이 비쳤다.' },
      { text: '에밀리는 자기 옷을 내려다보더니 얼굴이 빨개져서 급하게 팔로 몸을 가렸다.' },
      { speaker: 'emily', text: '뭘 보고 있어. 다 고개 돌려!', voice: 'ep3/에밀리/에밀리8' },
      { text: '아니, 이런 상황에서 왜 하필 내 쪽을 보는 거야. 나도 모르게 얼굴이 뜨거워지고 심장이 빠르게 뛰었다.' },
      // 선택지 2. 당황한 에밀리에게 (위험 상황 ③, 위험도 100에 닿으면 즉시 배드엔딩)
      {
        speaker: 'player',
        text: '(정신 차려, {name}. 여기서 피 냄새가 짙어지면 진짜 끝이다…!)',
        choices: [
          {
            text: '에밀리, 잠깐! 이거라도 가려!',
            affection: { emily: 5 },
            reply: [
              { text: '나는 고개를 돌린 채 입고 있던 겉옷을 벗어 에밀리에게 내밀었다.' },
              { speaker: 'emily', text: '…고, 고맙다. 그리고 계속 돌아보고 있어.', voice: 'ep3/에밀리/에밀리9' },
              { text: '에밀리가 옷을 받아 몸을 가렸다. 그래도 심장이 조금은 빨라졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '내가 가려줄게, 이쪽으로 와.',
            affection: { emily: 10 },
            reply: [
              { text: '나는 겉옷을 펼쳐 들고 에밀리 앞으로 다가갔다. 가까이 서자 심장이 더 빠르게 뛰었다.', risk: { amount: 40, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '너…너무 가까운데… 그래도... 고맙다.', voice: 'ep3/에밀리/에밀리10' },
              { text: '에밀리는 황급히 내 겉옷을 받아 몸을 가렸다.' },
            ],
          },
          {
            text: '어… 에밀리…',
            affection: {},
            reply: [
              { text: '너무 당황해서 고개를 돌려야 한다는 생각도 늦었다. 심장이 빨리 뛰고 피 냄새가 짙어졌다.', risk: { amount: 60, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '야, 미쳤니? 고개 돌리라고.', voice: 'ep3/에밀리/에밀리11' },
              { text: '나는 화들짝 놀라 뒤를 돌아봤다. 하지만 이미 너무 늦은 건 아닐까?' },
            ],
          },
          {
            text: '에밀리가 수건을 달라고 해도 계속 쳐다보며 놀린다.',
            affection: { emily: -15 },
            stats: { charm: -3 },
            reply: [
              { speaker: 'emily', text: '야! 뭘 보고만 있어? 수건 달라고!', voice: 'ep3/에밀리/에밀리12' },
              { text: '얼굴이 뜨거워지자 나는 뒤늦게 고개를 돌리고 수건을 건넸다.', risk: { amount: 60, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'player', text: '미안해. 내가 잘못했어.' },
              { speaker: 'emily', text: '이번만 넘어가주도록 하지.', voice: 'ep3/에밀리/에밀리13' },
            ],
          },
        ],
      },
      { text: '에밀리는 시영에게 무슨 일을 당했는지 모르는 표정으로 상황을 파악하려고 했다. 평소와 다른 모습이 조금 웃겼다.' },
      { speaker: 'emily', text: '감히…? 이게 대체 뭐 하는 짓이지?', voice: 'ep3/에밀리/에밀리14' },
      { speaker: 'siyeong', text: '죄, 죄송해요… 그치만 하영이한테 너무 가까이 붙어서…', voice: 'ep3/시영/시영4' },
      { speaker: 'minji', text: '캬하하하하! 꼴이 좋아! 시영아 진짜 잘했어.', expression: 'bigsmile', voice: 'ep3/민지/민지13' },
      { speaker: 'emily', text: '너 지금 웃었니? 너도 같이 죽고 싶은가 봐.', voice: 'ep3/에밀리/에밀리17' },
      { speaker: 'minji', text: '어우, 귀족님 화나셨네~ 소인은 이만 돌아볼게요~', expression: 'smile', voice: 'ep3/민지/민지14' },
      // 선택지 3. 시영에게 말하기
      {
        speaker: 'siyeong',
        text: '하영이는…. 제가 이미 찜해뒀단 말이에요!',
        cg: ep03SiyeongCg,
        voice: 'ep3/시영/시영5',
        choices: [
          {
            text: '시영아, 괜찮아? 에밀리한텐 같이 사과하자.',
            affection: { siyeong: 5 },
            reply: [{ speaker: 'siyeong', text: '좀 무서워서... 사과하러… 같이… 가줄래…?', voice: 'ep3/시영/시영6' }],
          },
          {
            text: '다들 진정해. 차례대로 얘기하자.',
            affection: { siyeong: 5 },
            reply: [{ speaker: 'siyeong', text: '네… 일단 진정할게요.', voice: 'ep3/시영/시영7' }],
          },
          {
            text: '시영아, 좀 무섭다…',
            affection: { siyeong: -5 },
            reply: [{ speaker: 'siyeong', text: '아… 미안해. 무섭게 하려던 건 아니었는데…', voice: 'ep3/시영/시영8' }],
          },
          {
            text: '네가 분위기 다 망쳤어. 그냥 가.',
            affection: { siyeong: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'siyeong', text: '……미안해. 내가 갑자기 급발진을 해서…. 많이 화났지…', voice: 'ep3/시영/시영9' },
              { text: '시영이가 손을 떨며 고개를 숙이자 나는 내가 심하게 말했다는 걸 깨달았다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 일부러 그런 것도 아닌데 내가 화풀이했어.' },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '아니 그건… 아닌거 같은데. 방금 너가 한 행동은 좋았지만, 하영이는 양보 못 해.', voice: 'ep3/민지/민지15', cg: null },
      { speaker: 'emily', text: '다 닥쳐, 좋은 말로 할 때. 이래서 귀족은 귀족끼리가 어울리는 법. 어디 가문도 없는 놈들이…', voice: 'ep3/에밀리/에밀리15' },
      { speaker: 'minji', text: '아니, 네가 뭔데 끼어들어? 옷이나 가리고 있어.', expression: 'less', voice: 'ep3/민지/민지16' },
      { speaker: 'emily', text: '야, 송민지. 너 한마디만 더 해라?', voice: 'ep3/에밀리/에밀리16' },
      { speaker: 'siyeong', text: '하영이는… 두 분한테 안 줄 거예요.', voice: 'ep3/시영/시영10' },
      { text: '세 명이 날 두고 싸우는데 이게 대체 좋아해야 하는지 무서워해야 하는지 모르겠지만, 초절정 미녀들이 날 두고 싸우다니 그냥 좋았다.' },
      { text: '물론 심장이 또 뛰기 시작하면 좋다고만 할 수는 없겠지만…' },
      { text: '나는 조용히 물 한 잔을 마시며 다시 한번 마음을 가라앉혔다.', hidePortrait: true },
    ],
    badEnding: [
      { speaker: 'siyeong', text: '잠깐만… 하영이한테서 나는 이 냄새…' },
      { text: '시영이 내 쪽을 바라봤다. 손으로 가슴을 누르며 진정하려고 했지만 이미 늦었다.' },
      { speaker: 'minji', text: '하영아? 이 냄새… 설마…', expression: 'surprised_soft' },
      { speaker: 'emily', text: '인간의 피다.' },
      { text: '순식간에 주변이 조용해졌다. 그러더니 여기저기서 의자가 밀리는 소리가 났다.', hidePortrait: true },
      { text: '도망치려고 자리에서 일어났지만 학생들이 이미 내 앞을 막고 있었다.' },
      { text: '결국 나는 술자리에서 정체를 들킨 채 죽었다.' },
      { name: 'BAD END', text: '술자리의 인간' },
    ],
  },
  // EP 4. 워터파크 (여름방학)
  7: {
    id: 'month-7',
    title: '에밀리 가문의 워터파크',
    icon: '🌊',
    lines: [
      { text: '오늘은 에밀리 가문 전용의 워터파크를 가기로 한 날이다.', background: dormRoomBg },
      { speaker: 'player', text: '(내가 여자랑 워터파크를 가다니…… 그것도 여자 3명이랑…… 이게 대체 무슨 복이란 말인가.)' },
      { text: '뱀파이어라는 점을 제외하고는 일반 사람과 똑같아서 이제는 별다른 느낌이 들지 않는다.' },
      { text: '근데 오늘은 비키니 볼 생각에 벌써 흥분되기 시작했다. 하, 오늘은 진짜 조심해야 하는데.' },
      { text: '내가 흥분하면 심장이 빨리 뛰고 피도 빠르게 돌아서 피 냄새가 짙어진다. 냄새를 들키면 큰일이니까 최대한 진정하자.' },
      { text: '에밀리의 워터파크는 그냥 다른 느낌이었다. 실내에 바다를 그대로 옮겨 놓은 듯한 커다란 파도풀이 있었다.', background: poolBg },
      { speaker: 'player', text: '(나는 또 피로 되어 있는 워터파크인 줄 알고 좀 많이 놀랐네.)' },

      // 워터파크에 도착
      { speaker: 'minji', text: '야, 뭐해ㅐㅐ. {name}, 너 왜 아직도 바지 입고 있어! 안 벗으면 내가 벗긴다?', expression: 'bigsmile', voice: 'ep4/민지/민지1' },
      { speaker: 'emily', text: '아, 벌써 현기증이 날거 같네. 그냥 {name}만 초대하는 건데.', stage: ['minji', 'emily'], voice: 'ep4/에밀리/에밀리1' },
      { speaker: 'siyeong', text: '제, 제가 벗길게요!', stage: ['minji', 'siyeong', 'emily'], voice: 'ep4/시영/시영1' },
      { speaker: 'player', text: '진짜 뭐라는 거야.' },
      { text: '나는 뒤를 돌아봤다.' },
      { speaker: 'player', text: '헉.' },
      // TODO(CG): 여자 세 명의 비키니 샷 (준비되면 일러스트로 교체)
      { text: '에밀리는 도도하게 서 있고, 민지는 당당하게 웃고 있다. 시영이는 얼굴을 붉힌 채 나를 바라본다.' },
      { speaker: 'player', text: '(셋 다 비키니잖아…… 아니, 다 너무 예쁜데? 나 이거 눈을 어디다 둬야 하는 거야?!)' },
      { speaker: 'player', text: '(아, 보지 말아야 하는데 눈이 자꾸 간다…….)' },
      // 위험 상황 ① 수영복을 처음 보고 당황
      { text: '순간 얼굴이 조금 뜨거워졌다. 놀란 건 맞지만 아직은 괜찮겠지……?', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'emily', text: '{name}. 왜 그렇게 빤히 보는거지? 내 비키니가 그렇게 잘 어울리나?', cg: ep05Emily1Cg, voice: 'ep4/에밀리/에밀리2' },
      { speaker: 'player', text: '어…… 응. 진짜 잘 어울려.' },
      { text: '에밀리가 잠시 시선을 피했다가 다시 나를 본다.' },
      { speaker: 'emily', text: '흥. 그런 건 굳이 말 안해도 알아.', affection: { emily: 5 }, voice: 'ep4/에밀리/에밀리3' },
      { text: '나는 괜히 더 쳐다봤다가 들킬까 봐 한 번 숨을 고르고 고개를 돌렸다.', cg: null },
      { speaker: 'minji', text: '야 너 어디봐. 이 누님의 모습을 제대로 봐 둬야지. 인생에 한 번밖에 없는 기회라고.', expression: 'smile', voice: 'ep4/민지/민지2' },
      { speaker: 'minji', text: '뭐 나랑 사귀면 평생 볼 수도 있고?', expression: 'shy_smile', voice: 'ep4/민지/민지3' },
      { speaker: 'siyeong', text: '어..어! 저랑 사귀면 더한 것도 보여드릴게요!', voice: 'ep4/시영/시영2' },
      { speaker: 'emily', text: '어…? 미친건가? 하… 그냥 닥치고 있어. 수준 떨어지게 하지 말고.', voice: 'ep4/에밀리/에밀리4' },
      { speaker: 'player', text: '(뱀파이어 학교 만세! 대만세! 조상님 감사합니다ㅠㅠㅠㅠ……)' },
      // 위험 상황 ② 두 사람의 장난에 당황
      { text: '아니, 이러면 안 되는데. 방금 말에 또 조금 흥분해 버렸다.', risk: { amount: 10, kind: 'excite' } },

      // 민지와 파도풀
      { text: '민지가 먼저 파도풀에 뛰어들었다가 물가로 올라온다. 젖은 머리카락을 뒤로 넘기자 어깨에 물방울이 맺힌다.', stage: ['minji'], cg: ep05MinjiCg },
      { speaker: 'player', text: '(물에 젖은 민지를 보니까 평소랑 또 다른 느낌이었다. 아…… 진짜 심장 좀 진정해라.)' },
      { text: '그때 파도가 한 번 더 밀려와 민지가 발을 헛디뎠다. 옆에 있던 나를 잡으면서 민지의 허벅지가 내 다리에 살짝 스쳤다.', cg: null },
      { speaker: 'minji', text: '꺅! 야, 미안. 이건 진짜 실수야!', expression: 'surprised_soft', voice: 'ep4/민지/민지4' },
      { speaker: 'player', text: '아, 알아! 너 괜찮아?' },
      { text: '민지는 내 팔을 잡고 일어서더니 내 얼굴을 빤히 봤다.' },
      // 선택지 1. 민지에게 대답하기 (고른 위험도 하나만 적용)
      {
        speaker: 'minji',
        text: '하영아, 근데 왜 그렇게 봐? 내 수영복 예뻐?',
        expression: 'shy_smile',
        voice: 'ep4/민지/민지5',
        choices: [
          {
            text: '일단 안 다쳐서 다행이다. 미끄러우니까 조심해.',
            affection: {},
            reply: [
              { text: '나는 민지가 균형을 잡은 걸 확인하고 자연스럽게 한 걸음 물러섰다.' },
              { speaker: 'minji', text: '에이, 걱정하는 거야? 나 생각보다 튼튼해!', expression: 'smile', voice: 'ep4/민지/민지6' },
            ],
          },
          {
            text: '어…… 응. 잘 어울려.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '그렇게 볼 거면 그냥 처음부터 이쁘다고 하지~', expression: 'smile', voice: 'ep4/민지/민지7' },
              { text: '민지가 웃으면서 더 다가오자 나도 모르게 얼굴이 조금 빨개졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '너무 예뻐서 계속 쳐다보게 돼.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '뭐야, 오늘 왜 이렇게 솔직해? 너 자꾸 그러면 나 헷갈린다?', expression: 'shy_smile', voice: 'ep4/민지/민지8' },
              { text: '민지랑 계속 가까이 있으니 점점 더 두근거렸다. 아, 피 냄새가 짙어지면 안 되는데…….', risk: { amount: 20, kind: 'excite' } },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '오늘 하루만이라도 얌전히 굴 수는 없겠니?', stage: ['minji', 'emily'], voice: 'ep4/에밀리/에밀리5' },
      { speaker: 'minji', text: '왜? 너도 하영이가 잡아줬으면 좋겠어?', expression: 'smile', voice: 'ep4/민지/민지9' },
      { speaker: 'emily', text: '흥. 내가 너랑 같은 줄 알아?', voice: 'ep4/에밀리/에밀리6' },

      // 시영의 수건
      { text: '파도풀 옆에는 네 사람의 수건이 놓여 있다. 그 옆에는 물놀이 중 다칠 때 쓸 수 있는 간이 구급함도 있었다.', hidePortrait: true },
      { text: '시영이 수건 옆에서 조심스럽게 나를 불렀다.' },
      { speaker: 'siyeong', text: '저…… 하영아. 내 수영복은…… 어때?', cg: ep05SiyeongCg, voice: 'ep4/시영/시영3' },
      { speaker: 'player', text: '어? 응, 시영이도 진짜 잘 어울려. 예뻐.' },
      { text: '시영이 얼굴을 붉히며 수건을 살짝 끌어당긴다.' },
      { speaker: 'siyeong', text: '그, 그렇게 보면 부끄러워… 그래도 하영이가 봐주는건 좋아..', affection: { siyeong: 5 }, voice: 'ep4/시영/시영4' },
      // 위험 상황 ③ 시영과의 대화
      { speaker: 'player', text: '(아까는 더한 것도 보여 줄 수 있다더니…… 이렇게 부끄러워하니까 또 귀엽네…….)', risk: { amount: 10, kind: 'excite' } },

      // 파도풀의 소동
      { speaker: 'minji', text: '우리 하영이 놀리는 재미가 있네. 시영아 뭐해? 이리 와봐.', expression: 'bigsmile', stage: ['minji', 'siyeong', 'emily'], cg: null, voice: 'ep4/민지/민지10' },
      { text: '민지가 시영에게 눈치를 준다. 둘은 에밀리의 양옆으로 다가갔다.' },
      { speaker: 'siyeong', text: '지, 진짜로 해요…?', voice: 'ep4/시영/시영5' },
      { speaker: 'minji', text: '당연하지. 내가 다리 할게.', expression: 'smile', voice: 'ep4/민지/민지11' },
      { text: '민지가 에밀리의 무릎을 차 무릎을 꿇리고 다리를 잡았다.' },
      { speaker: 'minji', text: '시영아 빨리 와! 뭐해!', expression: 'bigsmile', voice: 'ep4/민지/민지12' },
      { speaker: 'siyeong', text: '어…어…네!', voice: 'ep4/시영/시영6' },
      { text: '시영이 에밀리의 손을 잡는다.' },
      { name: '민지·시영', text: '하나, 둘, 셋!!!!', voice: ['ep4/민지/민지13', 'ep4/시영/시영7'] },
      { text: '그냥 파도풀에 던지는 장난이었지만 에밀리는 굉장히 과장되게 멀리멀리 날아갔다. 무슨 사람을 공 던지듯이……?' },
      { text: '에밀리는 저 멀리 떨어진 뒤 사람을 죽일 듯한 표정으로 접영을 하며 헤엄쳐 왔다.' },
      { text: '그런데 파도풀 가장자리에 닿을 때 물에 휩쓸린 비키니 끈이 풀려버렸다. 에밀리는 깜짝 놀라 수영복을 붙잡았다.' },
      { speaker: 'emily', text: '꺄악! 야, 너네 때문에 끈 풀렸잖아! 미친 거 아니야?!', voice: 'ep4/에밀리/에밀리7' },
      { speaker: 'emily', text: '{name}, 거기 수건 좀 줘!', voice: 'ep4/에밀리/에밀리8' },
      // 선택지 2. 당황한 에밀리를 도와주기 (고른 위험도 하나만 적용)
      {
        speaker: 'player',
        text: '(어, 어?! 지금 어떻게 해야 하지? 수건은 바로 내 옆에 있다.)',
        choices: [
          {
            text: '시선을 돌린 채 옆에 있던 수건을 바로 건네준다.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'player', text: '에밀리, 여기! 나, 나 아무것도 못 봤어!!' },
              { text: '나는 에밀리 쪽을 보지 않고 수건만 건넸다. 놀라긴 했지만 수건을 찾는 데 집중하니 금방 정신이 들었다.' },
              { speaker: 'emily', text: '……고마운데, 절대로 고개 돌리지 마.', voice: 'ep4/에밀리/에밀리9' },
            ],
          },
          {
            text: '너무 놀라 잠깐 그 자리에 굳어 있는다.',
            affection: { emily: -5 },
            reply: [
              { speaker: 'player', text: '어…… 어?!', risk: { amount: 10, kind: 'excite' } },
              { text: '에밀리는 내가 멈춰 있는 사이 직접 수건을 잡아당겨 몸을 감쌌다. 나는 뒤늦게야 고개를 돌렸다.' },
              { speaker: 'emily', text: '수건 달라고 했잖아! 왜 멀뚱히 서 있어?!', voice: 'ep4/에밀리/에밀리10' },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '송민지, 서시영 너희 둘은 진짜 후회하게 만들어 주지.', voice: 'ep4/에밀리/에밀리11' },
      { speaker: 'minji', text: '음, 저거는 잡히면 진짜 죽일 기세인데?', stage: ['minji', 'siyeong', 'emily'], voice: 'ep4/민지/민지14' },
      { speaker: 'siyeong', text: '……저 어떡해요….?', voice: 'ep4/시영/시영8' },

      // 시영이의 손
      { speaker: 'minji', text: '어ㅎㅎ, 빈틈 찾았다! 하영아, 빨리 시영이 팔 잡아!!!', expression: 'bigsmile', voice: 'ep4/민지/민지15' },
      { speaker: 'player', text: '어, 어?' },
      { text: '나도 모르게 시영이의 팔을 잡아 버렸다.' },
      { speaker: 'siyeong', text: '하영이가…… 내 손을……!', stage: ['siyeong'], voice: 'ep4/시영/시영9' },
      { text: '시영이 얼굴을 붉힌 채 내 손을 꼭 잡는다.' },
      { speaker: 'siyeong', text: '하영아…… 손 놓지마….', voice: 'ep4/시영/시영10' },
      // 선택지 3. 시영에게 대답하기 (진정하면 위험도 감소)
      {
        text: '시영이 손은 차가운데 내 손은 점점 뜨거워지는 느낌이었다. 아, 또 흥분하면 안 되는데…….',
        choices: [
          {
            text: '잠깐만. 다들 뭐 하려는지부터 들어보자.',
            affection: {},
            reply: [
              { text: '나는 손에 힘을 조금 빼고 숨을 골랐다. 잠깐이나마 진정하니 몸의 열이 가라앉았다.', risk: { amount: -10, kind: 'calm' } },
              { speaker: 'siyeong', text: '응… 그래도 손은 잡고 있어도 돼?', voice: 'ep4/시영/시영11' },
            ],
          },
          {
            text: '응, 조금만 더 잡고 있을게.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…? 좋아…', voice: 'ep4/시영/시영12' },
              { text: '시영이가 기쁜 듯 웃었다. 그 얼굴을 보니 나도 살짝 두근거렸다.' },
            ],
          },
          {
            text: '나도 시영이 손 좀 더 잡고 싶었어.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '하영이도…? 그럼 더 꽉 잡고 있자..', voice: 'ep4/시영/시영13' },
              { text: '시영이가 내 쪽으로 바짝 다가왔다. 가까이서 손을 잡고 있으니 점점 흥분이 됐다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '하영아, 앞에 에밀리 쪽으로 던져!', expression: 'bigsmile', stage: ['minji', 'siyeong'], voice: 'ep4/민지/민지16' },
      { speaker: 'player', text: '? 뭐라고?' },
      { speaker: 'siyeong', text: '네?! 자, 잠깐만요!!', voice: 'ep4/시영/시영14' },
      { speaker: 'minji', text: '하나, 둘, 셋!!!', expression: 'bigsmile', voice: 'ep4/민지/민지17' },
      { text: '시영이 에밀리 쪽으로 날아가며 물보라가 일어난다.' },
      { speaker: 'siyeong', text: '꺄아아아악!!', voice: 'ep4/시영/시영15' },
      { speaker: 'emily', text: '야! 너희 진짜 미친거야!?', stage: ['minji', 'siyeong', 'emily'], voice: 'ep4/에밀리/에밀리12' },
      { text: '시영은 정확히 에밀리와 적중했다. 나는 둘을 말리려고 급하게 다가가다가 물가에서 발을 헛디뎠다.' },
      { text: '넘어지지 않으려고 바닥에 짚은 손바닥이 쓸렸다. 손을 들어보니 작게 상처가 나서 피가 배어 나오고 있었다.' },
      // 위험 상황 ④ 출혈 (실제 피가 나서 정신력 회피 없이 위장도만 적용) + 선택지 4. 손바닥에서 피가 났을 때
      {
        speaker: 'player',
        text: '(……잠깐. 이거 내 피잖아?! 피 냄새가 퍼지기 전에 가려야 해!)',
        risk: { amount: 20, kind: 'bleed' },
        choices: [
          {
            text: '곧바로 수건으로 손을 감싸고 구급함에서 방수 밴드를 붙인다.',
            affection: {},
            reply: [
              { text: '나는 수건으로 손을 감싼 채 잠깐 구급함 쪽으로 물러났다.' },
              { text: '빨리 상처를 가린 덕분에 피가 더 번지지 않았고, 잠시 뒤 피 냄새도 옅어졌다.', risk: { amount: -10, kind: 'calm' } },
              { speaker: 'minji', text: '하영아, 갑자기 어디 가?', expression: 'surprised_soft', voice: 'ep4/민지/민지18' },
              { speaker: 'player', text: '아, 아니! 나 잠깐 수건 좀 쓰려고!' },
            ],
          },
          {
            text: '“이 정도는 괜찮겠지.” 하고 상처를 그대로 둔다.',
            affection: {},
            reply: [
              { text: '별일 아닐 거라 생각했는데 물기 사이로 피가 더 번졌다. 그제야 나는 놀라서 수건으로 손을 감쌌다.', risk: { amount: 40, kind: 'bleed' } },
              { speaker: 'siyeong', text: '하영아…? 여기서 나는 이 냄새…', voice: 'ep4/시영/시영16' },
              { text: '아직 눈치채지 못한 것 같다. 하지만 이미 퍼진 피 냄새를 바로 없앨 수는 없었다.' },
            ],
          },
        ],
      },
      { text: '그다음에 흥분한 에밀리와의 난장판으로 낭만적인 워터파크 여행이 아니라 정말 시끌벅적하게 끝났는데, 그게 나름 추억이었다. 절대 잊을 수 없는?', stage: ['minji', 'siyeong', 'emily'] },
      // TODO(CG): 회상 CG (준비되면 일러스트로 교체)
      { text: '물에 젖은 세 사람이 파도풀에 있다. 민지는 웃고 있고, 에밀리는 수건을 붙잡은 채 민지를 노려본다. 시영이는 얼굴을 붉힌 채 내 옆에 붙어 있다.' },
    ],
    badEnding: [
      { speaker: 'minji', text: '어…? 잠깐만. 이 낯선 냄새 뭐야?', expression: 'surprised_soft', stage: ['minji', 'siyeong', 'emily'], voice: 'ep4/민지/민지19' },
      { speaker: 'siyeong', text: '하영이한테… 수업 시간에 맡아본… 인간 피 냄새가 나요…', voice: 'ep4/시영/시영17' },
      { speaker: 'emily', text: '너 설마… 인간이었니…?', voice: 'ep4/에밀리/에밀리13' },
      { text: '피 냄새를 맡은 세 사람의 시선이 동시에 나를 향했다. 이미 너무 늦었다.' },
      { text: '에밀리가 부르자 멀리 있던 가문의 직원들이 다가왔다. 나는 빠져나갈 틈도 없이 그 자리에서 붙잡혔다.', hidePortrait: true },
      { text: '결국 즐거울 줄만 알았던 워터파크에서 정체를 들키고 죽었다.' },
      { name: 'BAD END', text: '피 냄새가 퍼진 워터파크' },
    ],
  },
  // EP 5. 중간고사 공부모임
  9: {
    id: 'month-6',
    title: '중간고사 공부모임',
    icon: '📚',
    lines: [
      { speaker: 'player', text: '(1학기는 생존에 신경을 쓰다보니 성적이 너무 망했어. 공부를 하긴 해야겠지……)', background: studyroomBg },
      { text: '얼떨결에 그 멤버로 도서관에서 공부하게 되었다……' },
      { speaker: 'siyeong', text: '모르는거 다 물어봐. 내가 다…… 알려줄게……', stage: ['minji', 'siyeong', 'emily'], voice: 'ep5/시영/시영1' },
      { speaker: 'siyeong', text: '나에 대한 것도……ㅎ', voice: 'ep5/시영/시영2' },
      { speaker: 'minji', text: '시영아, 지금 너 얼굴 진짜 무서워.', expression: 'less', voice: 'ep5/민지/민지1' },
      { text: '시영이의 가방에서 작은 방울 소리가 났다. 가방을 열던 시영이는 안에 달린 방울을 조심스럽게 만졌다.' },
      { speaker: 'player', text: '그 방울은 뭐야?' },
      { speaker: 'siyeong', text: '집에서 키우는 고양이꺼야. 내가 이걸 흔들면 자다가도 달려와.', voice: 'ep5/시영/시영3' },
      { speaker: 'player', text: '고양이를 키웠구나.' },
      { speaker: 'siyeong', text: '응. 다음에 사진 보여 줄게. 나를 보면 먼저 다가오는 게 정말 귀여워.', voice: 'ep5/시영/시영4' },
      { text: '시영이는 내 옆으로 의자를 끌고 오더니 갑자기 머리끈을 꺼냈다.' },
      { speaker: 'siyeong', text: '으으… 아… 머리가 자꾸 내려와서… 머리 좀… 묶어야 겠다…', voice: 'ep5/시영/시영5' },
      { text: '아니, 머리 묶는데 왜 이상한 소리를 내는 거야. 시영이는 일부러 내 쪽을 힐끔 보면서 머리를 천천히 묶었다.' },
      { text: '머리를 묶으니 목덜미가 보였다. 괜히 시선을 어디에 둬야 할지 모르겠고 심장이 조금씩 빨리 뛰는 것 같았다.' },
      // 선택지 1. 시영의 묶은 머리 (흥분 위험 ①, 생존 시 호감도 적용)
      {
        speaker: 'siyeong',
        text: '하영아… 나 머리 묶은 거… 어때?',
        voice: 'ep5/시영/시영6',
        choices: [
          {
            text: '머리 묶으니까 공부하기 편하겠다.',
            affection: {},
            reply: [
              { speaker: 'siyeong', text: '응… 이제 하영이한테 문제 더 잘 알려줄 수 있겠다…ㅎ', risk: { amount: 10, kind: 'excite' }, voice: 'ep5/시영/시영7' },
            ],
          },
          {
            text: '시영아, 머리 묶으니까 잘 어울려.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…? 그럼 앞으로 하영이 앞에서는 계속 묶고 있을게…', voice: 'ep5/시영/시영8' },
              { text: '이렇게 좋아할 줄 알았으면 좀 더 덤덤하게 말할걸… 심장이 점점 빨라진다.', risk: { amount: 20, kind: 'excite' } },
            ],
          },
          {
            text: '그렇게 가까이 있으면 나도 두근거리잖아.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '하영이도 두근거려…? 나랑 똑같네… 그럼 조금만 더 가까이 가도 돼…?', voice: 'ep5/시영/시영9' },
              { text: '시영이가 더 가까이 다가왔다. 아, 내가 왜 그런 말을 했지? 심장이 터질 것 같다.', risk: { amount: 40, kind: 'excite' } },
            ],
          },
          {
            text: '네가 뭘 해도 안 어울려. 쳐다보지 마.',
            affection: { siyeong: -15 },
            stats: { charm: -3 },
            reply: [
              { speaker: 'siyeong', text: '…아… 그렇게까지 말할 줄은 몰랐어… 알겠어… 이제 안 쳐다볼게…', voice: 'ep5/시영/시영10' },
              { text: '시영이의 표정을 보자 내가 무슨 말을 했는지 뒤늦게 실감났다.', risk: { amount: 50, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 당황해서 심하게 말했어.' },
            ],
          },
        ],
      },

      // 공부는 뒷전
      { speaker: 'minji', text: '하영아…… 나 문제 좀 알려줘. 이거, 이거, 이것까지!!!!!!! 하나도 모르겠어.', expression: 'bigsmile', voice: 'ep5/민지/민지2' },
      { speaker: 'minji', text: '어 잘 안들리는데… 좀만 더 붙어서 설명해줄래?', expression: 'shy_smile', voice: 'ep5/민지/민지3' },
      { text: '민지가 내 쪽으로 바짝 붙어오자 에밀리가 민지의 책을 날려버리면서 말했다.' },
      { speaker: 'emily', text: '하…… 공부할 생각이 없다면 방해라도 하지 말지.', voice: 'ep5/에밀리/에밀리1' },
      { speaker: 'emily', text: '입만 움직이지 말고 머리도 좀 써보렴. 머리는 장식이니?', voice: 'ep5/에밀리/에밀리2' },
      { speaker: 'minji', text: '너 연필로 찍혀 본 적 없지? 내가 색다른 경험 좀 시켜 줄까?', expression: 'smile', voice: 'ep5/민지/민지4' },
      { speaker: 'player', text: '얘들아 제발 조용히 좀 해줘ㅠㅠㅠㅠ 나도 공부 좀 하자.' },
      { text: '내가 너무나도 실수했다. 얘네들이 그래도 상위권이고 그나마 같이 하자고 해서 도움이 될 줄 알았는데 공부에 집중을 하나도 못 하겠다.' },
      { speaker: 'minji', text: '그래. 하영이 집중해야 한다니깐 진짜 공부하자.', voice: 'ep5/민지/민지5' },
      { text: '민지가 다시 주워 온 책을 펴는 척하더니 나한테 바짝 다가와 귓속말했다.' },
      { speaker: 'minji', text: '모르는 문제 있으면 이따가 밖으로 몰래 부를게ㅎㅎ. 하영아~', expression: 'shy_smile', voice: 'ep5/민지/민지6' },
      { speaker: 'player', text: '힉!!!' },
      { text: '갑자기 귀에 바람이 닿아서 놀랐다. 얼굴이 뜨거워지고 심장도 두근거리기 시작했다.' },
      { speaker: 'minji', text: '으으으… 아, 가슴 무거워. 공부하기 힘들다..', voice: 'ep5/민지/민지7' },
      { text: '민지는 일부러 들으라는 듯 이상한 소리를 내더니 가슴을 책상 위에 턱 올려놓고 나를 바라봤다.' },
      { speaker: 'minji', text: '하영아, 이렇게 있으면 더 편할까?', expression: 'shy_smile', voice: 'ep5/민지/민지8' },
      // 선택지 2. 민지의 귓속말 (흥분 위험 ②, 귓속말과 책상 장면을 합쳐 한 번만 판정)
      {
        text: '아니 얘도 대체 왜 이러는 거야. 지금 기말고사 공부하러 온 거 맞아?',
        choices: [
          {
            text: '여기 이 문제부터 풀어보자.',
            affection: {},
            reply: [
              { speaker: 'minji', text: '에이, 반응이 왜 그래. 알았어, 진짜 공부할게.', expression: 'less', voice: 'ep5/민지/민지9' },
              { text: '나는 애써 문제집을 바라봤다. 그래도 아직 심장이 조금 빨랐다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '그렇게 가까이 오니까 집중이 안 되잖아.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '어? 나 때문에 집중이 안 돼? 그럼 좀 더 가까이 가볼까?', expression: 'smile', voice: 'ep5/민지/민지10' },
              { speaker: 'player', text: '아, 아니! 그런 뜻이 아닌데…!', risk: { amount: 30, kind: 'excite' } },
            ],
          },
          {
            text: '둘이 몰래 나가서 더 가까이 알려줄까?',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '뭐야, 너도 나랑 단둘이 있고 싶었구나? 지금 나갈까?', expression: 'bigsmile', voice: 'ep5/민지/민지11' },
              { speaker: 'player', text: '지, 지금 말고… 일단 공부부터 하자!' },
              { text: '내가 무슨 소리를 한 거지. 민지가 웃으면서 더 다가오자 심장이 미친 듯이 뛰었다.', risk: { amount: 50, kind: 'excite' } },
            ],
          },
          {
            text: '넌 공부 못 하니까 그냥 가만히 있어.',
            affection: { minji: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'minji', text: '뭐? 네가 나보다 잘하면 얼마나 잘한다고.', expression: 'less', voice: 'ep5/민지/민지12' },
              { text: '민지가 의자를 밀며 일어나자 나는 급히 손을 내저었다.', risk: { amount: 50, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 집중이 안 돼서 괜히 너한테 화냈어.' },
            ],
          },
        ],
      },
      { text: '그때 시영이가 필통에서 슬며시 가위를 꺼내길래 얼른 집어넣게 했다.' },
      { speaker: 'player', text: '시, 시영아. 가위는 왜 꺼내는 거야? 다시 넣자…' },
      { speaker: 'siyeong', text: '아… 그냥… 연필을 깎으려고…', voice: 'ep5/시영/시영11' },
      { speaker: 'emily', text: '시영아, 어디 아프니? 그거 샤프잖아.', voice: 'ep5/에밀리/에밀리3' },

      // 에밀리와 단둘이
      { speaker: 'emily', text: '음, 벌써 시간이 이렇게 됐네. 조금만 쉴까?', voice: 'ep5/에밀리/에밀리4' },
      { text: '민지는 자고 있고 시영이는 집중하고 있었다. 민지 자고 있는 모습이 꽤나 귀여워 보이기도 했다.', cg: ep04StudyCg },
      { speaker: 'player', text: '음, 그러면 커피 좀 먹을까?', cg: null },
      { speaker: 'emily', text: '좋은 생각이다. 시영아, 너 할거 없지. 커피 좀 사와.', voice: 'ep5/에밀리/에밀리5' },
      { speaker: 'siyeong', text: '내…내가…왜… 가야해…', stage: ['siyeong', 'emily'], voice: 'ep5/시영/시영12' },
      { speaker: 'emily', text: '둘이서 할 이야기가 있는데, 하.. 좀 다녀오지 그래?', voice: 'ep5/에밀리/에밀리6' },
      { speaker: 'siyeong', text: '단…둘이…? 그럼 안 가고 싶은데…', voice: 'ep5/시영/시영13' },
      { text: '에밀리가 눈을 부릅뜨며 시영이를 노려봤다.' },
      { speaker: 'siyeong', text: '히익!!! 아… 알겠어, 다녀올게…ㅠㅠㅠ', voice: 'ep5/시영/시영14' },
      { text: '시영이가 커피를 가지러 가고, 자고 있는 민지를 빼면 나와 에밀리 둘만 남았다.', stage: ['emily'] },
      { speaker: 'emily', text: '드디어 갔네. 둘이서만 공부하는 게 너한테도 더 좋았을 텐데 쓰레기들이 너무 많이 꼈다. 그치?', voice: 'ep5/에밀리/에밀리7' },
      { speaker: 'emily', text: '전부터 궁금했는데. 너는 어디 가문이지? 말하기 싫으면 말 안 해도 돼.', voice: 'ep5/에밀리/에밀리8' },
      { speaker: 'player', text: '아…… 대체 뭐라고 답해야 하지……' },
      { text: '에밀리가 내 손목을 보더니 의자를 조금씩 내 쪽으로 끌고 왔다.' },
      { speaker: 'emily', text: '쉬는시간이고 나랑 단 둘이 있는데 굳이 책만 보고 있을 필요는 없지 않나?', voice: 'ep5/에밀리/에밀리9' },
      { speaker: 'player', text: '채, 책 말고 뭘 보려고…?' },
      { speaker: 'emily', text: '글쎄… 근데 도서관이… 좀… 더운 거 같지 않니?', voice: 'ep5/에밀리/에밀리10' },
      { text: '에밀리가 갑자기 단추를 하나씩 풀기 시작했다.' },
      { speaker: 'player', text: '뭐, 뭐라고?!' },
      { speaker: 'emily', text: '후후 대체 뭘 기대하는거지? 단추 2개만 풀었을 뿐인데, 쫄기는ㅋ', voice: 'ep5/에밀리/에밀리11' },
      { text: '얘 지금 무슨 말을 하는 거야?! 얼굴은 뜨겁고, 에밀리는 자꾸 가까이 오고, 심장은 점점 더 빨라진다.' },
      // 선택지 3. 에밀리의 유혹 (흥분 위험 ③, 위험도 100에 닿으면 즉시 배드엔딩)
      {
        speaker: 'emily',
        text: '얼굴이 빨개졌군. 내가 이렇게 다가오는게 싫지만은 않은 모양이지?',
        voice: 'ep5/에밀리/에밀리12',
        choices: [
          {
            text: '그런 이야기는 그만하고, 문제부터 풀자.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '흥, 재미없는 녀석. 그래 내가 특별히 알려주도록 하지.', voice: 'ep5/에밀리/에밀리13' },
              { text: '나는 손목을 슬쩍 감추고 다시 책을 폈다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '네가 그렇게 말하니까 더 긴장되잖아.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '내 말 한마디에 긴장하는 건가? 후후, 생각보다 귀엽네?', voice: 'ep5/에밀리/에밀리14' },
              { text: '에밀리가 웃으며 조금 더 다가왔다. 피 냄새가 짙어져서 들키는 건 아니겠지…?', risk: { amount: 40, kind: 'excite' } },
            ],
          },
          {
            text: '손목이 궁금하면 더 가까이 와서 봐.',
            affection: { emily: 10 },
            reply: [
              { speaker: 'emily', text: '…정말 내가 가까이 가도 괜찮겠니?', voice: 'ep5/에밀리/에밀리15' },
              { text: '에밀리가 내 손목을 잡고 천천히 얼굴을 가까이했다. 그 순간 심장이 터질 듯이 뛰기 시작했다.' },
              { speaker: 'player', text: '(잠깐만, 나 지금 무슨 짓을 한 거야!!! 이러다 진짜 들키겠는데?!)', risk: { amount: 60, kind: 'excite' } },
            ],
          },
          {
            text: '네 향기 때문에 역겨우니까 꺼져.',
            affection: { emily: -15 },
            stats: { charm: -3 },
            reply: [
              { speaker: 'emily', text: '……흥. 내가 너한테 그런 모욕까지 들어야 하나?', voice: 'ep5/에밀리/에밀리16' },
              { text: '에밀리가 차갑게 나를 바라봤다. 나는 그제야 말을 너무 심하게 했다는 걸 깨달았다.', risk: { amount: 60, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 당황해서 상처 주는 말을 했어.' },
            ],
          },
        ],
      },
      { text: '에밀리가 무언가 더 말하려던 순간, 문 쪽에서 익숙한 목소리가 들렸다.' },

      // 쏟아진 커피
      { speaker: 'siyeong', text: '커피…… 가…… 가져왔어ㅓㅓㅓㅓㅓㅓ!!!', stage: ['minji', 'siyeong', 'emily'], voice: 'ep5/시영/시영15', cg: ep04SiyeongCg },
      { text: '시영이가 문턱에 걸려 넘어지면서 커피를 에밀리한테 부어버렸고, 그 커피가 민지와 나한테도 튀었다.' },
      { speaker: 'minji', text: '아! 뜨, 뜨거워어어어!!!!!!', expression: 'surprised_soft', voice: 'ep5/민지/민지13' },
      { text: '에밀리가 정통으로 맞아버려 그 도도하던 에밀리가 그렇게 날뛰는 모습을 처음 봤다. 그냥 막 펄쩍펄쩍하고 뛰는 게 개웃겼다.', cg: ep04EmilyCg },
      { speaker: 'emily', text: '아 뜨거워!!! 야, 서시영! 너 지금 뭐 하는 거야!!!', voice: 'ep5/에밀리/에밀리17' },
      { speaker: 'siyeong', text: '아… 죄, 죄송해요… 일부러 그런 게 아니라…', voice: 'ep5/시영/시영16', cg: null },
      { speaker: 'emily', text: '너 지난번 술자리에서도 그러더니!!!', voice: 'ep5/에밀리/에밀리18' },
      { text: '에밀리는 뜨거움이 가신 뒤에 시영이의 귓방망이를 개 세게 때렸다.' },
      { speaker: 'siyeong', text: '아…아…아…', voice: 'ep5/시영/시영17' },
      { speaker: 'emily', text: '감히… 사과하면 다 해결될 줄 알아? 내 얼굴에 화상이라도 남았으면 어쩌려고!', voice: 'ep5/에밀리/에밀리19' },
      { text: '에밀리가 또 때리려고 하는 걸 내가 가서 간신히 막았다.' },
      { speaker: 'player', text: '일부러 한 거 아니니까 거기까지만 하자.' },
      { text: '에밀리는 억울하다는 듯이 나를 바라봤다.' },
      { speaker: 'emily', text: '아니 ……내가 얼마나 놀랐는지 봤잖아. 그런데 나보고 참으라고?', voice: 'ep5/에밀리/에밀리20' },
      { text: '에밀리는 갑자기 눈물을 보이면서 그냥 가버렸다.', stage: ['minji', 'siyeong'] },
      { speaker: 'player', text: '(아, 많이 밉보인 것 같은데… 어쩌지…)' },
      { speaker: 'minji', text: '저 싸가지가 울기도 하네? 시영아 잘했어! 그래도 내 셔츠 세탁비는 네가 내라?', expression: 'smile', voice: 'ep5/민지/민지14' },
      { speaker: 'player', text: '민지…야, 제발 눈치 좀…' },
      { speaker: 'minji', text: '아니, 받을거는 받아야지!!', expression: 'less', voice: 'ep5/민지/민지15' },
      { text: '시영이는 뺨을 맞은 그 상태에서 울먹거리고 있었다.' },
      { speaker: 'siyeong', text: '히그히극… 제가 하는 일 다 이런 식으로 되고… 말도 잘 못하고…흑흑', voice: 'ep5/시영/시영18' },
      { speaker: 'player', text: '아냐, 시영이 과탑이잖아. 에밀리도 순간적으로 화나서 그랬을 거야.' },
      { speaker: 'player', text: '너무 걱정하지 말고 표정 풀어. 공부 다시 하자. 나 모르는 부분들이 너무 많더라.' },
      { speaker: 'minji', text: '어! 나도! 모르는 문제 많아!', expression: 'bigsmile', voice: 'ep5/민지/민지16' },
      { text: '민지도 신나서 따라붙었다. 민지의 책을 다시 내 쪽으로 당겨 같이 문제를 보기 시작했다.' },
    ],
  },
  // EP 6. 메이드카페의 첫 출근
  10: {
    id: 'month-9',
    title: '메이드카페의 첫 출근',
    icon: '☕',
    background: maidCafeBg,
    lines: [
      // 고수익 아르바이트
      { text: '인간 사회 적응 실습으로 인간 세상에 온 첫날이었다.' },
      { text: '네 사람은 생활비를 벌기 위해 밤에 할 수 있는 아르바이트를 찾던 중, 민지가 발견한 공고 앞에 모여 있었다.' },
      { name: 'SYSTEM', text: '「야간 메이드카페 단기 아르바이트 모집」 일주일 근무 / 높은 시급 / 식사 제공' },
      { speaker: 'minji', text: '야, 여기봐. 다른 가게보다 돈을 더 많이 주는데?', expression: 'bigsmile', voice: 'ep6/민지/민지1' },
      { speaker: 'player', text: '그러네. 다른 데보다 훨씬 많이 준다.' },
      { speaker: 'emily', text: '……메이드카페? 그게 뭐지..?', stage: ['minji', 'emily'], voice: 'ep6/에밀리/에밀리1' },
      { speaker: 'minji', text: '뭐하는지 뭐가 중요해. 돈 더 준다잖아!', voice: 'ep6/민지/민지2' },
      { speaker: 'emily', text: '하, 너는 돈이 중요하니? 어떤 일을 하는지가 중요하지.', voice: 'ep6/에밀리/에밀리2' },
      { speaker: 'minji', text: '그럼 넌 빠져. 우리끼리 갈게.', expression: 'smile', voice: 'ep6/민지/민지3' },
      { speaker: 'emily', text: '뭐… 누가 안 간다고 했니?', voice: 'ep6/에밀리/에밀리3' },
      { speaker: 'siyeong', text: '저는… 하영이가 가면 갈래요.', stage: ['minji', 'siyeong', 'emily'], voice: 'ep6/시영/시영1' },
      { text: '결국 네 사람은 함께 메이드카페를 찾아갔고, 일손이 필요했던 점장은 그날 밤부터 일해 볼 수 있겠냐고 물었다.' },
      { text: '나는 집사복을, 세 사람은 메이드복을 받아 들고 탈의실로 들어갔다.', hidePortrait: true },

      // 메이드복을 입은 세 사람
      { text: '먼저 나온 건 민지였다. 짧은 프릴이 달린 앞치마를 정리하던 민지가 나를 보더니 한 바퀴 돌아 보였다.' },
      { speaker: 'minji', text: '어때? 나 이런 것도 잘 어울리지?', expression: 'bigsmile', voice: 'ep6/민지/민지4' },
      { speaker: 'player', text: '어… 응. 생각보다 잘 어울리는데?' },
      { speaker: 'minji', text: '생각보다?', expression: 'less', voice: 'ep6/민지/민지5' },
      { speaker: 'player', text: '아니, 그게 아니라…' },
      { speaker: 'minji', text: 'ㅋㅋㅋ 당황하는 모습 좀 봐 너무 귀여운거 아니야?', expression: 'bigsmile', voice: 'ep6/민지/민지6' },
      { text: '민지가 내 집사복 넥타이를 손가락으로 툭 건드렸다. 가까이 다가온 얼굴을 보고 있자 괜히 시선을 어디에 둬야 할지 모르겠다.' },
      // 위험 상황 ① 민지가 가까이 다가옴
      { text: '얼굴이 뜨거워지고 심장이 조금 빨라졌다. 이러다 내 피 냄새가 짙어질지도 모른다. 나는 들키지 않게 숨을 골랐다.', risk: { amount: 10, kind: 'excite' } },
      { text: '그때 에밀리가 탈의실에서 나왔다. 단정하게 입은 메이드복이 평소의 도도한 모습과는 또 다른 느낌이었다.', stage: ['minji', 'emily'] },
      { speaker: 'minji', text: '와. 귀족 아가씨가 메이드복을 다 입네?', expression: 'smile', voice: 'ep6/민지/민지7' },
      { speaker: 'emily', text: '이정도야. 어려운 일도 아니지.', voice: 'ep6/에밀리/에밀리4' },
      { speaker: 'minji', text: '그래? 아까 탈의실에서는 “프릴은 왜 이렇게 많은 거야” 하던데~', expression: 'smile', voice: 'ep6/민지/민지8' },
      { speaker: 'emily', text: '넌 그걸 또 몰래 훔쳐 듣니?', voice: 'ep6/에밀리/에밀리5' },
      { speaker: 'minji', text: '네 목소리가 큰거야.', voice: 'ep6/민지/민지9' },
      { speaker: 'emily', text: '야, 송민지. 봐주는 것도 한계가 있어.', voice: 'ep6/에밀리/에밀리6' },
      { text: '두 사람이 서로 노려보는 사이, 시영이가 탈의실 문을 조금 열고 고개를 내밀었다.' },
      { speaker: 'siyeong', text: '그… 저… 나가도 돼요?', stage: ['minji', 'siyeong', 'emily'], voice: 'ep6/시영/시영2' },
      { speaker: 'player', text: '응? 당연하지.' },
      { text: '시영이는 앞치마 끝을 만지작거리며 천천히 나왔다. 내 쪽을 보다가 눈이 마주치자 바로 시선을 내렸다.' },
      { speaker: 'siyeong', text: '하영아… 이상하지 않아?', voice: 'ep6/시영/시영3' },
      { speaker: 'player', text: '아니. 잘 어울려.' },
      { speaker: 'siyeong', text: '저, 정말?', voice: 'ep6/시영/시영4' },
      { speaker: 'player', text: '응. 예뻐.' },
      { text: '시영이의 얼굴이 빨개졌다. 그러더니 내 옆으로 와서 작은 목소리로 말했다.' },
      { speaker: 'siyeong', text: '내 첫 메이드복을 하영이가 처음으로 본거네…', voice: 'ep6/시영/시영5' },
      { speaker: 'minji', text: '어? 우리도 여기 있는데?', expression: 'surprised_soft', voice: 'ep6/민지/민지10' },
      { speaker: 'siyeong', text: '…나왔을 때… 하영이가 제일 먼저 봤어요…', voice: 'ep6/시영/시영6' },

      // 하영이 손님 역할
      { text: '영업이 시작되기 전, 점장은 네 사람에게 인사와 주문받는 법을 알려 줬다.', hidePortrait: true },
      { name: '점장', text: '처음이니까 서로 손님 역할을 해 보면서 연습해 보세요. 저는 주방 준비하고 있을게요.' },
      { text: '점장이 자리를 비우자 민지가 메뉴판을 들어 올렸다.', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'minji', text: '이런 일 쯤이야. 사람이랑 말하는거, 내가 제일 잘하는건데?', expression: 'bigsmile', voice: 'ep6/민지/민지11' },
      { speaker: 'emily', text: '말만 잘하면 뭐해. 메뉴판을 거꾸로 드는데.', voice: 'ep6/에밀리/에밀리7' },
      { speaker: 'minji', text: '아…, 또 화나게 만드네', expression: 'less', voice: 'ep6/민지/민지12' },
      { speaker: 'siyeong', text: '그…그만요… 저희끼리 뭉쳐야죠…', voice: 'ep6/시영/시영7' },
      { speaker: 'minji', text: '그럼 너가 먼저 해보던가. 하영아, 네가 손님 해.', voice: 'ep6/민지/민지13' },
      { speaker: 'player', text: '내가?' },
      { speaker: 'minji', text: '응. 우리 둘 중에 누가 더 잘하는지 골라 줘.', expression: 'smile', voice: 'ep6/민지/민지14' },
      { speaker: 'siyeong', text: '저…도 해도 될까요…?', voice: 'ep6/시영/시영8' },
      { speaker: 'emily', text: '시영이 너도?', voice: 'ep6/에밀리/에밀리8' },
      { speaker: 'siyeong', text: '네. 저도 하영이 시중 들고 싶어요…', voice: 'ep6/시영/시영9' },
      { text: '결국 나는 테이블에 앉았고, 세 사람은 돌아가며 나를 손님으로 응대하기로 했다.', hidePortrait: true },

      // 민지의 시중
      { text: '민지가 내 앞에 메뉴판을 놓으며 활짝 웃었다.', stage: ['minji'] },
      { speaker: 'minji', text: '어서 오세요, 주인님. 오늘은 어떤 걸로 준비해 드릴까요?', expression: 'bigsmile', voice: 'ep6/민지/민지15' },
      { text: '평소와 다르게 상냥한 목소리였다. 내가 메뉴판을 보는 동안 민지는 의자를 내 옆으로 살짝 끌어왔다.' },
      { speaker: 'player', text: '손님 옆에 앉아도 되는 거야?' },
      { speaker: 'minji', text: '주인님은 내가 옆에 있으면 싫어?', expression: 'shy_smile', voice: 'ep6/민지/민지16' },
      { speaker: 'player', text: '싫은 건 아닌데…' },
      { speaker: 'minji', text: '그럼 됐네.', expression: 'smile', voice: 'ep6/민지/민지17' },
      { text: '민지가 손을 뻗어 조금 비뚤어진 내 넥타이를 바로잡았다. 손끝이 목 가까이에 닿자 나도 모르게 몸이 굳었다.' },
      { speaker: 'minji', text: '흐흥, 역시 내 손을 거치니까 훨씬 낫네.', expression: 'smile', voice: 'ep6/민지/민지18' },
      { speaker: 'player', text: '원래는 아니었다는 거야?' },
      { speaker: 'minji', text: '원래는 귀여웠고, 지금은 좀 멋있다는 거지~', expression: 'shy_smile', voice: 'ep6/민지/민지19' },
      { text: '민지는 내 반응을 살피더니 만족한 듯 웃었다.' },
      { speaker: 'minji', text: '이따가 누구 고를거야? 나 고르면 오늘 서.비.스가 있을지…도…?', expression: 'bigsmile', voice: 'ep6/민지/민지20' },

      // 에밀리의 시중
      { text: '민지가 물러나자 에밀리가 찻잔과 접시를 들고 내 앞으로 왔다. 찻잔을 조심스럽게 내려놓은 뒤, 메뉴판을 펼쳐 보였다.', stage: ['emily'] },
      { speaker: 'emily', text: '오늘의 차를 준비해 드렸습니다. 단맛이 필요하시면 말씀해주세요.', voice: 'ep6/에밀리/에밀리10' },
      { speaker: 'player', text: '어… 고마워.' },
      { speaker: 'emily', text: '손님께서는 편하게 말씀하셔도 됩니다. 다른 필요한 것은 없으신가요?', voice: 'ep6/에밀리/에밀리11' },
      { text: '아까 민지와 다툴 때와는 달리 말투도, 표정도 완벽하게 메이드 같았다.' },
      { speaker: 'minji', text: '오, 좀 하는데? 집에서 맨날 시중만 받던 애가.', expression: 'smile', stage: ['minji', 'emily'], voice: 'ep6/민지/민지21' },
      { speaker: 'emily', text: '지금 집중하고 있으니, 조용히 하렴.', voice: 'ep6/에밀리/에밀리9' },
      { text: '에밀리는 다시 나를 바라보더니 살짝 몸을 숙였다.', stage: ['emily'] },
      { speaker: 'emily', text: '박하, 아니… 주인님. 제 시중은 마음에 드시나요?', voice: 'ep6/에밀리/에밀리12' },
      { text: '얼굴이 가까워지자 찻잔을 들려던 손이 멈췄다.' },
      // 위험 상황 ② 에밀리의 얼굴이 가까워짐
      { speaker: 'player', text: '(너무 가까운데… 진정하자. 피 냄새가 짙어지기라도 하면 큰일이다.)', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'player', text: '으, 응. 잘하는 것 같아.' },
      { speaker: 'emily', text: '그것…뿐인가요?', voice: 'ep6/에밀리/에밀리13' },
      { speaker: 'player', text: '잘 어울리고… 예뻐.' },
      { speaker: 'emily', text: '뭐…?', voice: 'ep6/에밀리/에밀리14' },
      { text: '에밀리는 대답하지 않고 몸을 일으켰다. 귀가 살짝 빨개진 것 같았지만 모르는 척했다.' },
      { speaker: 'emily', text: '흥. 보는 눈은 있어가지고.', voice: 'ep6/에밀리/에밀리15' },

      // 시영의 시중
      { text: '마지막으로 시영이가 내 앞에 섰다. 두 손을 앞에 모으고 한참을 망설이더니 조심스럽게 입을 열었다.', stage: ['siyeong'] },
      { speaker: 'siyeong', text: '어서 오세요… 주인님.', voice: 'ep6/시영/시영10' },
      { speaker: 'minji', text: '목소리가 너무 작아. 손님이 못 듣겠다.', stage: ['minji', 'siyeong'], voice: 'ep6/민지/민지22' },
      { speaker: 'siyeong', text: '아… 죄송해요. 다시…', voice: 'ep6/시영/시영11' },
      { speaker: 'player', text: '나는 잘 들었어. 천천히 해도 돼.' },
      { text: '내 말에 시영이는 작게 고개를 끄덕였다. 그리고 내 앞에 놓인 찻잔을 보고는 냅킨을 가져와 옆에 놓았다.', stage: ['siyeong'] },
      { speaker: 'siyeong', text: '저… 혹시 뜨거우시면 이 냅킨 쓰세요. 아까 손을 급하게 떼시는 걸 봐서…', voice: 'ep6/시영/시영12' },
      { speaker: 'player', text: '그거 봤어?' },
      { speaker: 'siyeong', text: '네. 계속 보고 있었어요…', voice: 'ep6/시영/시영13' },
      { text: '시영이는 수줍게 웃더니 내 손 가까이에 자기 손을 살짝 올렸다.' },
      // 위험 상황 ③ 시영의 손이 가까이 다가옴
      { text: '차가운 손이 가까이 오자 조금 진정됐던 심장이 다시 빨라졌다. 나는 시선을 찻잔으로 옮기고 천천히 숨을 내쉬었다.', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'siyeong', text: '주인님…제가 옆에 앉아도 되…될까요…?', voice: 'ep6/시영/시영14' },
      { speaker: 'player', text: '어…어 앉아도 되지…?' },
      { speaker: 'siyeong', text: '하영…아… 아니… 주인님… 제…제가 음식 먹여드려도 되…될까요…?', voice: 'ep6/시영/시영15' },
      { text: '옆에서 듣고 있던 에밀리가 한숨을 쉬었다.', stage: ['siyeong', 'emily'] },
      { speaker: 'emily', text: '듣고 있는 내가 다 답답하네. 손님이 기다리다 지쳐서 돌아가겠어.', voice: 'ep6/에밀리/에밀리16' },
      { speaker: 'siyeong', text: '…왜… 그러세요…ㅠㅠ', voice: 'ep6/시영/시영16' },
      { speaker: 'emily', text: '아… 그렇게까지 상처받을 일인가? ……미안하다. 말이 좀 심했어.', voice: 'ep6/에밀리/에밀리17' },
      { speaker: 'minji', text: '캬~ 역시 귀족님. 인성부터 남다르시네?', expression: 'less', stage: ['minji', 'siyeong', 'emily'], voice: 'ep6/민지/민지23' },

      // 누구의 시중을 받고 싶은가? (선택지 1. 고른 히로인에게만 호감도)
      {
        text: '세 사람의 시선이 동시에 나를 향했다. 다들 정말 내가 누구를 고를지 기다리고 있었다.',
        choices: [
          {
            text: '나는 민지의 시중이 제일 좋았어.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '역시! 하영이는 나 고를 줄 알았다니까.', expression: 'bigsmile', voice: 'ep6/민지/민지24' },
              { speaker: 'emily', text: '방금 손님 옆에 멋대로 앉았는데도?', voice: 'ep6/에밀리/에밀리18' },
              { speaker: 'minji', text: '손님이 좋다잖아. 그렇지, 주인님?', expression: 'shy_smile', voice: 'ep6/민지/민지25' },
              { text: '민지가 내 어깨에 팔을 살짝 걸쳤다. 기분 좋게 웃는 모습을 보니 나도 괜히 얼굴이 뜨거워졌다.' },
              { speaker: 'siyeong', text: '…제가… 더 분발할게요…', voice: 'ep6/시영/시영17' },
            ],
          },
          {
            text: '나는 에밀리의 시중을 받고 싶어.',
            affection: { emily: 10 },
            reply: [
              { speaker: 'emily', text: '흠. 당연한 결과로군.', voice: 'ep6/에밀리/에밀리19' },
              { speaker: 'minji', text: '풉, 당연한 결과래. 아까 하영이한테 얼굴 들이밀던 건 누구였더라?', expression: 'less', voice: 'ep6/민지/민지26' },
              { speaker: 'emily', text: '손님과 눈을 맞춘 것뿐이야.', voice: 'ep6/에밀리/에밀리20' },
              { speaker: 'player', text: '그래도 진짜 잘 어울렸어.' },
              { speaker: 'emily', text: '…너는 참 사람을 부끄럽게 만드는 재주가 있군.', voice: 'ep6/에밀리/에밀리21' },
              { text: '에밀리는 고개를 돌렸지만, 입가에 미소가 살짝 걸려 있었다.' },
            ],
          },
          {
            text: '나는 시영이의 시중을 받고 싶어.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말? 나 골라 준 거야?', voice: 'ep6/시영/시영18' },
              { speaker: 'player', text: '응. 내가 필요한 것도 먼저 챙겨 줬잖아.' },
              { speaker: 'siyeong', text: '그럼… 오늘은 내가 계속 챙겨도 돼?', voice: 'ep6/시영/시영19' },
              { speaker: 'minji', text: '야, 이제 연습 끝났어. 진짜 손님 챙겨야지. 일 안 할거야?', expression: 'less', voice: 'ep6/민지/민지27' },
              { speaker: 'siyeong', text: '알아요. 그래도 하영이는 제가 챙길 거예요.', voice: 'ep6/시영/시영20' },
              { text: '시영이는 내 옆에 서서 내 소매를 살짝 붙잡았다.' },
            ],
          },
          {
            text: '셋 다 별로야. 다들 그만 좀 해.',
            affection: { minji: -15, emily: -15, siyeong: -15 },
            stats: { charm: -5 },
            reply: [
              { speaker: 'minji', text: '야, 고르라고 했지. 무시하라고 했어?', expression: 'less', voice: 'ep6/민지/민지28', risk: { amount: 60, kind: 'excite' } },
              { speaker: 'emily', text: '지금 그게 무슨 무례한 태도지?', voice: 'ep6/에밀리/에밀리22' },
              { speaker: 'siyeong', text: '…열심히 했는데.', voice: 'ep6/시영/시영21' },
              { speaker: 'player', text: '미안해. 내가 괜히 심하게 말했어.' },
            ],
          },
        ],
      },
      { text: '주방에서 나온 점장이 우리 쪽을 바라봤다.' },
      { name: '점장', text: '연습은 다 했어요? 이제 곧 문 열게요.' },
      { speaker: 'minji', text: '네! 저희 준비됐어요!', expression: 'bigsmile', voice: 'ep6/민지/민지29' },

      // 첫 손님과 피 냄새
      { text: '처음에는 생각보다 일이 잘 풀렸다.', hidePortrait: true },
      { text: '민지는 밝게 손님을 맞이했고, 에밀리는 차분하게 주문을 받았다. 시영이는 내 옆에서 주문서를 정리하며 빠진 것이 없는지 확인했다.' },
      { speaker: 'player', text: '(이 정도면 오늘 무사히 끝낼 수 있겠는데?)' },
      { text: '그때 민지가 차를 가져다준 테이블에서 작은 소리가 났다.' },
      { name: '손님', text: '아…' },
      { text: '손님이 찻잔을 들다가 금이 가 있던 손잡이가 부러진 것이다. 깨진 부분에 손가락이 긁혔는지, 손끝에 붉은 피가 맺혔다.' },
      { speaker: 'minji', text: '손님, 괜찮으세…', expression: 'surprised_soft', stage: ['minji'], voice: 'ep6/민지/민지30' },
      { text: '말을 하던 민지가 그대로 얼어붙었다. 손님의 손끝에서 뿜어져 나온 따뜻한 피 냄새가 코끝을 찔렀다.' },
      { text: '민지의 동공이 미세하게 흔들리더니, 순식간에 초점이 흐려졌다. 식도를 타고 뜨거운 갈증이 치밀어 오르는 듯, 민지가 거친 숨을 들이켰다.' },
      { speaker: 'minji', text: '…피?', voice: 'ep6/민지/민지31' },
      { name: '손님', text: '네? 저기, 직원분…?' },
      { text: '민지가 테이블을 짚으며 몸을 확 기울였다. 이성을 잃은 짐승처럼, 피가 맺힌 손님의 손가락을 향해 맹렬히 달려든 것이다.' },
      { text: '나는 반사적으로 몸을 날려 두 사람 사이로 끼어들었다.' },
      { speaker: 'player', text: '민지야, 안 돼!!' },
      { speaker: 'minji', text: '비켜…! 저거, 저거 내 거야…!', expression: 'less', voice: 'ep6/민지/민지32' },
      { text: '민지의 눈빛이 완전히 돌아 있었다. 평소처럼 장난기 어린 표정은 온데간데없고, 오직 먹잇감을 노리는 포식자의 얼굴이었다.' },
      { text: '나는 필사적으로 민지의 허리와 팔을 끌어안고 뒤로 잡아당겼다. 하지만 뱀파이어의 완력은 인간인 내가 감당하기엔 너무 셌다. 민지가 나를 매단 채로 한 걸음씩 손님에게 다가갔다.' },
      { name: '손님', text: '으악! 뭐, 뭐야! 이 사람 왜 이래요?!' },
      { text: '겁에 질린 손님이 의자째 뒤로 나자빠졌다. 그 사이 카운터에서 뛰쳐나온 점장이 손님을 감싸 안으며 뒤로 물러섰다.' },
      { text: '하지만 민지는 멈추지 않았다. 나를 뿌리치려 팔을 휘두르며 기어코 손님 쪽으로 다시 달려들려 했다.' },
      { speaker: 'minji', text: '이거 놔! 저거 내꺼라니깐?', expression: 'less', voice: 'ep6/민지/민지33' },
      { speaker: 'player', text: '에밀리! 시영아! 빨리 좀 도와줘!!' },
      { text: '사태의 심각성을 깨달은 에밀리가 비명을 지르듯 소리치며 달려와 민지의 반대쪽 팔과 어깨를 온몸으로 짓눌렀다.', stage: ['minji', 'emily'] },
      { speaker: 'emily', text: '야, 송민지! 정신 안 차려?! 여기서 물면 다 끝장이야!', voice: 'ep6/에밀리/에밀리23' },
      { speaker: 'minji', text: '아, 시끄러워! 저리 꺼져!', expression: 'less', voice: 'ep6/민지/민지34' },
      { speaker: 'emily', text: '이성을 완전히 잃었네…! 시영아, 다리 잡아!', voice: 'ep6/에밀리/에밀리24' },
      { text: '시영이까지 달려들어 민지의 다리와 허리를 껴안았다. 네 사람이 한 덩어리가 되어 바닥을 뒹굴듯 몸싸움을 벌였다. 민지가 발버둥 칠 때마다 주변 테이블과 의자가 요란한 소리를 내며 쓰러졌다.', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'siyeong', text: '민지야, 진정해! 나 따라서 심호흡해!', voice: 'ep6/시영/시영22' },
      { speaker: 'minji', text: '놔, 놓으라고……!', expression: 'less', voice: 'ep6/민지/민지35' },
      { text: '한참을 씩씩거리며 몸부림치던 민지는, 세 사람이 온몸으로 찍어 누른 채 숨을 막고 나서야 겨우 거친 숨을 몰아쉬며 힘을 풀었다.' },
      { name: '점장', text: '……지금 뭐 하는 겁니까?!' },
      { text: '싸늘하게 가라앉은 목소리에 고개를 들자, 사색이 된 점장이 우리를 내려다보고 있었다. 주변 손님들은 이미 구석으로 피신해 경악한 표정으로 스마트폰을 쥐고 있었다.' },
      { speaker: 'player', text: '저, 점장님, 그게…' },
      { speaker: 'minji', text: '저…정말 죄송합니다…', expression: 'less', voice: 'ep6/민지/민지36' },
      { name: '점장', text: '손님이 다쳤는데 직원이 손님한테 달려들면 어떡해요! 사람 물기라도 할 기세였잖아요!' },
      { text: '점장은 바닥에 나뒹구는 깨진 찻잔과 엉망이 된 홀, 그리고 바닥에 엉켜 있는 우리 네 사람을 번갈아 봤다.' },
      { name: '점장', text: '당장 옷 갈아입고 나가세요. 오늘 근무비는 드릴 테니, 내일부터는 절대 나오지 마세요!' },
      { speaker: 'player', text: '네? 점장님, 잠깐만요…' },
      { name: '점장', text: '한 번만 더 소란 피우면 경찰 부릅니다!' },
      { text: '그렇게 우리의 메이드카페 아르바이트는 첫날, 그것도 오픈 한 시간 만에 최악의 형태로 끝이 났다.', hidePortrait: true },
    ],
  },
  // EP 7. 기숙사의 밤 (호감도 80 이상인 히로인과 데이트)
  11: {
    id: 'month-11',
    title: '기숙사의 밤',
    icon: '🌙',
    background: dormRoomBg,
    lines: [
      // 공통 스토리
      { text: '어느덧 11월이 되었다. 기숙사 창문을 열자 차가운 바람이 들어왔다.' },
      { text: '인간 세상에서 돌아온 지도 시간이 꽤 지났다. 그날 메이드카페에서 손님이 다치고, 피 냄새에 이끌린 민지를 겨우 말렸던 일이 아직도 생생하다.' },
      { text: '나는 휴대폰을 켰다. 인간 세상에서 찍었던 거리 사진 한 장이 남아 있었다. 환하게 켜진 가게들과 늦은 시간까지 걷고 있는 사람들.' },
      { text: '그곳에 있을 때는 당연했던 풍경인데, 지금 보니 괜히 오래 바라보게 된다.' },
      { speaker: 'player', text: '……돌아가고 싶다.' },
      { text: '말하고 나서야 내 목소리가 생각보다 컸다는 걸 알았다. 나는 급히 방문 쪽을 바라봤다.' },
      { text: '다행히 복도는 조용했다. 나는 휴대폰을 내려놓고 창문을 닫았다.' },
      // 공통 선택지. 먼저 연락할 사람 (④를 고르면 초대·데이트 없이 11월 종료)
      {
        text: '창문을 닫고 나니 오늘은 먼저 누군가에게 연락하고 싶어졌다. 나는 휴대폰을 다시 들었다.',
        choices: [
          {
            text: '민지에게 “저번 일 이후로 괜찮았어? 계속 신경 쓰였어.” 하고 연락한다.',
            affection: { minji: 10 },
            reply: [{ speaker: 'minji', text: '「뭐야, 나 걱정했어? 나도 너한테 할 말 있었는데.」', expression: 'smile', voice: 'ep7/민지/민지1' }],
          },
          {
            text: '에밀리에게 “그때 네가 함께 막아 줘서 고마웠어.” 하고 연락한다.',
            affection: { emily: 10 },
            reply: [{ speaker: 'emily', text: '「마침 나도 너에게 할 이야기가 있어.」', voice: 'ep7/에밀리/에밀리1' }],
          },
          {
            text: '시영에게 “지난번에 네가 옆에 있어서 안심됐어. 오늘은 괜찮아?” 하고 연락한다.',
            affection: { siyeong: 10 },
            reply: [{ speaker: 'siyeong', text: '「고마워…… 조금 있다가 만나서 얘기해도 될까?」', voice: 'ep7/시영/시영1' }],
          },
          {
            text: '세 사람에게 “너희 같은 뱀파이어는 전부 괴물이야. 다시 연락하지 마.”라고 보낸다.',
            affection: { minji: -15, emily: -15, siyeong: -15 },
            stats: { mental: -5 },
            ends: true,
            reply: [
              { speaker: 'minji', text: '「뭐? 너 진짜 우리를 그렇게 생각하고 있었어?」', expression: 'less', voice: 'ep7/민지/민지2' },
              { speaker: 'emily', text: '「그동안 내가 너를 잘못 봤던 모양이군.」', voice: 'ep7/에밀리/에밀리2' },
              { speaker: 'siyeong', text: '「……알겠어. 더는 찾아가지 않을게.」', voice: 'ep7/시영/시영2' },
              { text: '그날 세 사람은 더 이상 연락하지 않았다. 나는 내 말이 담긴 화면을 바라보다가 휴대폰을 껐다.', hidePortrait: true },
              { name: 'END', text: '스스로 끊은 연락' },
            ],
          },
        ],
      },

      // 민지의 방문 (민지 호감도 80 이상)
      ...onlyIf(canDate('minji'), [
        { text: '똑똑똑!', hidePortrait: true },
        { speaker: 'minji', text: '{name}! 너 안에 있지? 문 열어 봐.', expression: 'bigsmile', voice: 'ep7/민지/민지3' },
        { text: '문을 열자 민지가 주위를 한 번 살피더니 내 방 안으로 고개를 들이밀었다.' },
        { speaker: 'player', text: '왜? 무슨 일 있어?' },
        { speaker: 'minji', text: '쉿. 목소리 좀 낮춰 봐.', voice: 'ep7/민지/민지4' },
        { text: '민지는 복도에 아무도 없는 걸 확인하고 내 쪽으로 바짝 다가왔다.' },
        { speaker: 'minji', text: '우리 저번에 인간 세상 갔을 때 재밌는 게 너무 많더라고~~ 경치도 좋고 맛있는 것도 많고~', expression: 'bigsmile', voice: 'ep7/민지/민지5' },
        { speaker: 'player', text: '그랬지. 근데 갑자기 그 얘기는 왜?' },
        { speaker: 'minji', text: '나랑 몰래 나가자. 내가 비밀 통로를 알아냈어.', expression: 'shy_smile', voice: 'ep7/민지/민지6' },
        { speaker: 'player', text: '뭐? 몰래?' },
        { speaker: 'minji', text: '응. 다른 애들 말고 단둘이.', voice: 'ep7/민지/민지7' },
        { speaker: 'minji', text: '왜, 싫어……?', expression: 'less', voice: 'ep7/민지/민지8' },
        { speaker: 'player', text: '(인간 세상에 다시 갈 수 있다고? 반갑기도 했지만 민지와 단둘이라니 걱정부터 앞섰다.)' },
        { speaker: 'minji', text: '나 너 기다릴 거야. 알겠지?', expression: 'smile', voice: 'ep7/민지/민지9' },
        { text: '민지는 내 대답을 재촉하듯 바라보다가 복도 쪽으로 걸어갔다.' },
      ]),

      // 에밀리의 초대 (에밀리 호감도 80 이상)
      ...onlyIf(canDate('emily'), [
        { text: '휴대폰이 짧게 울렸다. 에밀리에게서 온 문자였다.', hidePortrait: true },
        { speaker: 'emily', text: '「오늘 밤 학교 뒤 정원으로 올 수 있니? …긴히 할 이야기가 있는데……」', voice: 'ep7/에밀리/에밀리3' },
        { text: '곧이어 문자가 하나 더 왔다.' },
        { speaker: 'emily', text: '「다른 아이들에게는 말하지 말고. 너와 단둘이 이야기하고 싶으니까.」', voice: 'ep7/에밀리/에밀리4' },
        { speaker: 'player', text: '(정원에서 단둘이? 에밀리가 무슨 일로 나를 부른 걸까.)' },
        { speaker: 'player', text: '(저번 인간 세상 실습에서 내 모습을 보고 뭔가 눈치챈 걸까. 설마 내가 인간이라는 걸…….)' },
      ]),

      // 울면서 찾아온 시영 (시영 호감도 80 이상)
      ...onlyIf(canDate('siyeong'), [
        { text: '잠시 뒤 방문을 두드리는 소리가 났다. 작고 조심스러운 소리였다.', hidePortrait: true },
        { text: '문을 열자 시영이가 서 있었다. 내 얼굴을 보자마자 시영이는 고개를 숙였다.', stage: ['siyeong'] },
        { speaker: 'player', text: '시영아? 무슨 일이야?' },
        { speaker: 'siyeong', text: '하영아…… 나, 어떡하지.', voice: 'ep7/시영/시영3' },
        { text: '시영이의 목소리가 떨렸다. 자세히 보니 눈가가 빨갰다.' },
        { speaker: 'player', text: '시영아, 천천히 말해 봐.' },
        { speaker: 'siyeong', text: '학교에 와서 내가 키우던 고양이…… 전에 얘기했었지.', voice: 'ep7/시영/시영4' },
        { speaker: 'siyeong', text: '어제 그 애가 죽었어… 나때문이야…', voice: 'ep7/시영/시영5' },
        { text: '시영이는 말을 마치자마자 눈물을 흘렸다. 나는 무슨 말을 해야 할지 몰라 잠시 서 있었다.' },
        { speaker: 'player', text: '…그랬구나. 시영아, 나 여기 있어.' },
        { speaker: 'siyeong', text: '방에 혼자 있으니까 자꾸 생각나서… 혼자 있고 싶지 않아…', voice: 'ep7/시영/시영6' },
        { text: '시영이는 눈물을 훔치고 내 소매를 꼭 붙잡았다.' },
        { speaker: 'siyeong', text: '나랑 잠깐 나갈래? 너랑 둘이 있고 싶어.', voice: 'ep7/시영/시영7' },
        { speaker: 'player', text: '응. 우선 내가 네 곁에 있어 줄게.' },
        { text: '나는 시영이를 복도의 의자에 앉히고 잠시 이야기를 들어 주었다.', background: dormHallBg, stage: ['siyeong'] },
      ]),

      // 데이트 상대 선택 (세 히로인 모두 보이고, 호감도 80 이상인 히로인만 고를 수 있음)
      {
        text: '오늘 밤은 누구와 함께할까?',
        hidePortrait: true,
        choices: [
          { text: '민지와 함께 몰래 인간 세상으로 간다.', affection: {}, enabledWhen: canDate('minji'), lockedText: DATE_LOCKED, reply: MINJI_ROUTE },
          { text: '에밀리가 부른 학교 뒤 정원으로 간다.', affection: {}, enabledWhen: canDate('emily'), lockedText: DATE_LOCKED, reply: EMILY_ROUTE },
          { text: '시영이와 함께 나가 이야기를 듣는다.', affection: {}, enabledWhen: canDate('siyeong'), lockedText: DATE_LOCKED, reply: SIYEONG_ROUTE },
          // 아무도 고를 수 없을 때만 나옴 (세 히로인 모두 호감도 80 미만)
          {
            text: '오늘 밤은 혼자 보낸다.',
            affection: {},
            when: noDate,
            reply: [
              { text: '나는 다시 휴대폰에 켜 둔 인간 세상의 사진을 바라봤다. 누군가에게 속마음을 털어놓고 싶었지만, 아직은 누구도 믿을 만큼 가까워지지 못한 것 같다.', hidePortrait: true },
              { speaker: 'player', text: '조금만 더 버티자…….' },
              { text: '나는 휴대폰을 끄고 침대에 누웠다. 창문 밖에는 차가운 밤이 이어지고 있었다.' },
            ],
          },
        ],
      },
    ],
  },
};

const DEFAULT_EPISODE: Episode = {
  id: 'month-default',
  title: '한 달을 돌아보며',
  icon: '📅',
  lines: [
    { text: '어느새 한 달이 지나갔다. 강의가 끝나자 시영이 머뭇거리며 다가온다.' },
    {
      speaker: 'siyeong',
      text: '저, 저기…! 하영 씨, 이번 달은… 어떠셨어요?',
      choices: [
        {
          text: '정신없었지만 조금 성장한 것 같아.',
          affection: { siyeong: 10 },
          reply: [{ speaker: 'siyeong', text: '그쵸…! 저 다 봤어요. 하영 씨 요즘 진짜 열심히 하는 거.' }],
        },
        {
          text: '음… 그냥 그랬지, 뭐.',
          affection: { siyeong: 0 },
          reply: [{ speaker: 'siyeong', text: '그, 그렇구나… 다음 달엔 제가 좀 더 재밌게 해드릴 수 있으면 좋겠어요.' }],
        },
        {
          text: '시영이랑 자주 봐서 좋았어.',
          affection: { siyeong: 15 },
          reply: [{ speaker: 'siyeong', text: '헤헤… 저, 저도요. 사실 제일 기다린 게 그 시간이었어요.' }],
        },
      ],
    },
    { speaker: 'siyeong', text: '다음 달에도… 오늘처럼 같이 있어도 되죠?' },
  ],
};

export function getEpisode(month: number) {
  return EPISODES[month] ?? DEFAULT_EPISODE;
}

// 메인 에피소드가 없는 달 (말일 에피소드 없이 바로 다음 달로)
const NO_EPISODE_MONTHS = new Set([8]);

export function hasMainEpisode(month: number) {
  return !NO_EPISODE_MONTHS.has(month);
}

// 메인 에피소드가 나오는 달 (4~12월 중 에피소드 없는 달 빼고)
export const MAIN_EPISODE_MONTHS = Array.from({ length: 9 }, (_, i) => i + 4).filter(hasMainEpisode);

// 대본이 들어간 메인 에피소드 (아직 없으면 undefined)
export function getMainEpisode(month: number): Episode | undefined {
  return EPISODES[month];
}

// 데이트 에피소드 (히로인별 순서대로)
export const DATE_EPISODES: Record<Heroine, Episode[]> = {
  // 첫 만남(4월) → 9~11월 히로인 선택 데이트: 기획 고민 → 축제의 질투 → 모교 타임캡슐
  minji: [
    {
      id: 'date-minji-1',
      title: '대학 와서도 너냐?',
      illust: minji1Img,
      background: studyroomImg,
      lines: [
        // SCENE 1. 익숙한 얼굴 — 캠퍼스
        { text: '개강총회 다음 날. {name}은 강의실을 찾기 위해 캠퍼스를 걷고 있다.' },
        { text: '그때 뒤에서 누군가 {name}의 어깨를 툭 친다.' },
        { speaker: 'minji', text: '야! 하영아!', expression: 'bigsmile' },
        { speaker: 'player', text: '어, 송민지.' },
        { speaker: 'minji', text: '뭐야, 반응 왜 이렇게 심심해?', expression: 'less' },
        { speaker: 'player', text: '어제도 봤잖아.' },
        { speaker: 'minji', text: '아니, 대학에서 고등학교 친구 만나면 좀 반가워해야 하는 거 아니냐?', expression: 'less' },
        { speaker: 'player', text: '어제 개총에서도 계속 붙어 있었는데?' },
        { speaker: 'minji', text: '아, 그랬나..?', expression: 'shy_smile' },
        { text: '민지는 자연스럽게 {name}의 옆에 선다.' },
        { speaker: 'minji', text: '근데 너 강의실 어디야?' },
        { speaker: 'player', text: '공학관 302호.' },
        { speaker: 'minji', text: '어? 나도 거긴데?', expression: 'surprised_soft' },
        { speaker: 'player', text: '같은 수업인가 보네.' },
        {
          speaker: 'minji',
          text: '와, 대학교까지… 참 질긴 인연이다',
          expression: 'smile',
          choices: [
            {
              text: '왜? 난 너랑 같은 수업이라 좋은데.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '…어?', expression: 'surprised_soft' },
                { speaker: 'player', text: '아는 사람 있으면 편하잖아.' },
                { speaker: 'minji', text: '아, 뭐야! 난 또 무슨 말이라고. ㅋㅋㅋ', expression: 'shy_smile' },
              ],
            },
            {
              text: '잘됐네. 같이 가자.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '오케이! 길은 알지?', expression: 'smile' },
                { speaker: 'player', text: '응. 이쪽이야.' },
                { speaker: 'minji', text: '역시 너 따라오길 잘했다.', expression: 'bigsmile' },
              ],
            },
            {
              text: '그러게. 대학 와서도 못 벗어나네.',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '야! 그건 내가 할 말이거든?', expression: 'less' },
                { speaker: 'player', text: '먼저 아는 척한 건 너잖아.' },
                { speaker: 'minji', text: '아오, 진짜 얄미워!', expression: 'less' },
              ],
            },
          ],
        },
        { speaker: 'minji', text: '(대학 와서도 얘랑 같이 다니게 될 줄이야. 뭐… 나쁘진 않네.)', expression: 'smile' },
      ],
    },
  ],
  // 첫 만남(5월) → 9~11월 히로인 선택 데이트: 괴담 취향 → 축제 귀신의 집 → 괴담 전시회 초대
  siyeong: [
    {
      id: 'date-siyeong-1',
      title: '어색한 두 사람',
      illust: siyeong1Img,
      background: studyroomImg,
      lines: [
        // SCENE 1. 두 번째 만남 — 도서관
        { text: '과제를 하기 위해 도서관을 찾은 {name}. 빈자리를 찾던 중 혼자 노트북을 보고 있는 시영을 발견한다.' },
        { speaker: 'player', text: '어, 서시영?' },
        { speaker: 'siyeong', text: '…아, 하영님. 안녕하세요.' },
        { speaker: 'player', text: '여기 앉아도 돼?' },
        { speaker: 'siyeong', text: '…네. 아무도 없어요.' },
        { text: '{name}이 자리에 앉자 두 사람 사이에 어색한 침묵이 흐른다.' },
        { speaker: 'player', text: '과제 중이야?' },
        { speaker: 'siyeong', text: '네… 프로그래밍 과제요.' },
        { speaker: 'player', text: '어려워?' },
        { speaker: 'siyeong', text: '…아니요. 거의 다 끝났어요.' },
        { speaker: 'player', text: '벌써? 난 아직 시작도 못 했는데.' },
        {
          text: '시영은 무슨 말을 해야 할지 몰라 노트북 화면만 바라본다.',
          choices: [
            {
              text: '혹시 나중에 모르는 거 있으면 물어봐도 돼?',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…저한테요?' },
                { speaker: 'player', text: '응. 잘하는 것 같아서.' },
                { speaker: 'siyeong', text: '…네. 제가 아는 거라면 도와드릴게요.' },
              ],
            },
            {
              text: '과제 빨리 끝냈네. 대단하다.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…아, 감사합니다.' },
                { speaker: 'player', text: '나도 얼른 해야겠다.' },
                { speaker: 'siyeong', text: '…네. 힘내세요.' },
              ],
            },
            {
              text: '그럼 난 과제 좀 할게.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…네.' },
                { speaker: 'player', text: '그럴 일은 없겠지만 필요하면 불러.' },
                { speaker: 'siyeong', text: '…아, 알겠습니다.' },
              ],
            },
          ],
        },

        // SCENE 2. 작은 실수
        { text: '잠시 후, {name}이 노트북으로 과제를 하던 중 화면을 보며 한숨을 쉰다.' },
        { speaker: 'player', text: '아… 왜 안 되지?' },
        { text: '시영은 옆에서 조심스럽게 화면을 바라본다.' },
        { speaker: 'siyeong', text: '…저기.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…괄호가 하나 빠진 것 같아요.' },
        { speaker: 'player', text: '어? 진짜네.' },
        { text: '{name}이 코드를 수정하자 프로그램이 정상적으로 실행된다.' },
        { speaker: 'player', text: '와, 고마워. 덕분에 살았다.' },
        { speaker: 'siyeong', text: '…아니에요.' },
        { speaker: 'player', text: '너 진짜 잘한다.' },
        { speaker: 'siyeong', text: '…그냥 자주 해봐서요.' },
        {
          text: '시영은 다시 자신의 노트북을 바라보지만 입가에 작은 미소가 떠오른다.',
          choices: [
            {
              text: '다음에도 같이 과제할래? 너랑 하니까 든든한데.',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…저, 저랑요?' },
                { speaker: 'player', text: '응. 혼자 하는 것보다 좋을 것 같아서.' },
                { speaker: 'siyeong', text: '…네. 저도 좋아요.' },
              ],
            },
            {
              text: '고마워. 다음에 음료수라도 사줄게.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…그렇게까지 안 하셔도 되는데.' },
                { speaker: 'player', text: '도움받았으니까.' },
                { speaker: 'siyeong', text: '…그럼 감사히 받을게요.' },
              ],
            },
            {
              text: '이제 되네. 나머지는 혼자 할 수 있겠다.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 네.' },
                { speaker: 'player', text: '고마워.' },
                { speaker: 'siyeong', text: '…도움이 됐다니 다행이에요.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '과제를 마친 {name}이 짐을 정리한다.' },
        { speaker: 'player', text: '나 먼저 갈게. 다음에 봐.' },
        { speaker: 'siyeong', text: '…네. 조심히 가세요.' },
        { text: '{name}이 도서관을 나가려는 순간, 시영이 작은 목소리로 부른다.' },
        { speaker: 'siyeong', text: '…하영님.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…다음에 과제하다 막히시면 말씀해 주세요.' },
        { speaker: 'player', text: '응. 고마워, 시영아.' },
        { text: '{name}이 떠난 뒤 시영은 다시 노트북을 바라본다.' },
        { speaker: 'siyeong', text: '(…생각보다 이야기하기 편한 분이네요.)' },
      ],
    },
  ],
  // 첫 만남(6월) → 9~11월 히로인 선택 데이트: 우산 → 축제 사격 내기 → 발레 공연 초대
  emily: [
    {
      id: 'date-emily-1',
      title: '마음에 안 드는 스케치',
      illust: emily1Img,
      background: studyroomImg,
      lines: [
        // SCENE 1. 마음에 안 드는 그림 — 실습실
        { text: '수업이 끝난 실습실. 대부분의 학생이 돌아간 가운데 에밀리는 태블릿 앞에 앉아 그림을 수정하고 있다.' },
        { text: '{name}은 두고 온 충전기를 찾으러 실습실에 들어온다.' },
        { speaker: 'player', text: '아직 안 갔어?' },
        { speaker: 'emily', text: '보면 몰라? 과제 중이잖아.' },
        { speaker: 'player', text: '캐릭터 디자인?' },
        { speaker: 'emily', text: '응. 근데 영 마음에 안 들어.' },
        { text: '에밀리는 스타일러스로 캐릭터의 얼굴을 몇 번 수정하더니 한숨을 쉰다.' },
        { speaker: 'emily', text: '아, 진짜 왜 이렇게 어색하지?' },
        { speaker: 'player', text: '표정이?' },
        { speaker: 'emily', text: '뭐?' },
        { speaker: 'player', text: '눈은 웃고 있는데 입은 화난 것 같아서.' },
        { text: '에밀리는 화면을 다시 살펴본다.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'emily', text: '그러네?' },
        { text: '에밀리는 입꼬리 부분을 수정한다.' },
        { speaker: 'emily', text: '하. 몇 시간째 보고 있었는데 그걸 못 봤네.' },
        { speaker: 'player', text: '오래 보면 그럴 수 있지.' },
        { speaker: 'emily', text: '너 그림 볼 줄 알아?' },
        { speaker: 'player', text: '잘은 몰라. 그냥 어색해 보여서.' },
        { speaker: 'emily', text: '흥. 그래도 보는 눈은 있네.' },
        { text: '에밀리는 수정한 그림을 {name} 쪽으로 돌린다.' },
        {
          speaker: 'emily',
          text: '자, 그럼 이것도 봐봐. 어느 쪽이 나아?',
          choices: [
            {
              text: '왼쪽. 표정이 캐릭터 성격이랑 더 잘 맞아.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '오, 이유까지 말하네?' },
                { speaker: 'player', text: '네가 설명한 성격이랑 잘 어울리니까.' },
                { speaker: 'emily', text: '흥. 생각보다 보는 눈이 있네.' },
              ],
            },
            {
              text: '왼쪽이 더 괜찮은 것 같아.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '왜?' },
                { speaker: 'player', text: '좀 더 자연스러워 보여.' },
                { speaker: 'emily', text: '나도 그렇게 생각하긴 했어.' },
              ],
            },
            {
              text: '둘 다 비슷한데? 아무거나 해.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '뭐? 아무거나?' },
                { speaker: 'player', text: '큰 차이는 없어 보여서.' },
                { speaker: 'emily', text: '하아… 괜히 물어봤네.' },
              ],
            },
          ],
        },

        // SCENE 2. 완성된 그림
        { text: '에밀리는 수정한 그림을 저장한다.' },
        { speaker: 'emily', text: '됐어. 이 정도면 괜찮겠네.' },
        { speaker: 'player', text: '다행이네.' },
        { speaker: 'emily', text: '근데 너 아까부터 왜 안 가?' },
        { speaker: 'player', text: '충전기 찾으러 왔는데.' },
        { speaker: 'emily', text: '그럼 찾았으면 가면 되잖아.' },
        { speaker: 'player', text: '네가 계속 물어봐서.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'emily', text: '하, 그건 그렇네.' },
        { text: '에밀리는 잠시 머뭇거리다가 화면을 다시 보여준다.' },
        { speaker: 'emily', text: '마지막으로 하나만 더 물어볼게.' },
        { speaker: 'player', text: '응.' },
        {
          speaker: 'emily',
          text: '이거 지금 제출해도 괜찮을 것 같아?',
          choices: [
            {
              text: '네가 그린 그림이니까 네가 만족하는 게 중요하지.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '내가 만족하는 게 중요하다고?' },
                { speaker: 'player', text: '응. 네 작품이잖아.' },
                { speaker: 'emily', text: '…흥. 그런 말은 좀 마음에 드네.' },
              ],
            },
            {
              text: '조금 쉬었다가 다시 보면 괜찮을 거야.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '…그럴까?' },
                { speaker: 'player', text: '오래 봐서 더 어색하게 느껴질 수도 있어.' },
                { speaker: 'emily', text: '그래. 잠깐 쉬어야겠네.' },
              ],
            },
            {
              text: '그 정도면 됐잖아. 그냥 제출해.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '난 아직 마음에 안 드는데?' },
                { speaker: 'player', text: '과제 기준으로는 충분해 보여서.' },
                { speaker: 'emily', text: '하아… 넌 예술가의 마음을 몰라.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '에밀리는 가방을 챙기며 자리에서 일어난다.' },
        { speaker: 'emily', text: '아무튼 오늘은 도움 좀 됐어.' },
        { speaker: 'player', text: '다행이네.' },
        { speaker: 'emily', text: '다음에도 그림 봐달라고 하면 제대로 봐줘야 해.' },
        { speaker: 'player', text: '알겠어.' },
        { speaker: 'emily', text: '흥. 약속했다?' },
        { text: '에밀리는 먼저 실습실을 나선다.' },
        { speaker: 'emily', text: '(…생각보다 괜찮은 애네.)' },
      ],
    },
  ],
};

// 데이트 에피소드 이름표 (예: '에밀리 · 데이트 1'). 데이트가 아니면 undefined
export function getDateLabel(episode: Episode) {
  for (const partner of HEROINES) {
    const order = DATE_EPISODES[partner].findIndex((e) => e.id === episode.id);
    if (order !== -1) return `${SPEAKERS[partner].name} · 데이트 ${order + 1}`;
  }
}

// 새 게임 시작 직후 한 번 보는 프롤로그 (오프닝)
export const PROLOGUE_DATE = '2026-03-02';

export const PROLOGUE: Episode = {
  id: 'prologue',
  title: '오프닝',
  icon: '📮',
  lines: [
    { speaker: 'player', text: '내 이름은 {name}, 23살.' },
    { speaker: 'player', text: '평범한 남중을 나와 특성화 남고에 진학한 탓에 만나본 여자는 0명, 대화해본 여자도… 손에 꼽는다.' },
    { speaker: 'player', text: '특성화고를 졸업한 뒤에는 3년 동안 뼈 빠지게 회사에 다니며 재직 기간을 채웠다.' },
    { speaker: 'player', text: '그리고 드디어, 재직자 특별전형으로 대학교 원서를 넣을 수 있게 되었다.' },
    { speaker: 'player', text: '...거기까지는 좋았다.' },
    { text: '"{name} 씨, 오늘부터 일이 좀 많을 것 같아. 사정 알지? 조금만 고생해 줘."' },
    { text: '원서 접수 3개월 전, 친하게 지내던 동기들이 줄줄이 퇴사했고 팀장님은 육아휴직에 들어갔다.' },
    { text: '회사는 요즘은 AI로 대체할 수 있다며 사람을 아예 뽑지 않았고, 모든 업무가 나한테 떨어졌다.' },
    // { speaker: 'player', text: '(인수인계 없이 사라진 동기, 2년 육아휴직을 떠난 팀장님, 하루 10번씩 30분짜리 담배 타임을 즐기는 대리님… 이 회사는 답이 없다. 빨리 탈출해야겠다.)' },
    // 모집 공고: 어두운 배경 → 종이가 펼쳐짐 → '4년간 숙식비 전액 무료' 부분 확대 → 다시 독백
    { text: '그리고 그 결과는 하나였다.', dim: true },
    { text: '일에 치이다가 대학교 원서 접수 기간을 전부 놓쳤다.', dim: true },
    { text: '남은 건 이름도 처음 들어보는 입시 사이트에 딱 하나 떠 있던 모집 공고뿐.', poster: { image: pangwoonImg } },
    {
      speaker: 'player',
      text: '1년을 더 기다려…? 다니면서 편입하기엔 돈이 없는데.',
      poster: { image: pangwoonImg },
    },
    {
      speaker: 'player',
      text: '(4년간 숙식비가... 무료?)',
      poster: { image: pangwoonImg, zoom: { x: 68, y: 87, scale: 2.2 } },
    },
    { text: '나는 그날 바로 지옥 같은 회사에 사표를 내고, 대학 생활에 올인하기로 했다.', dim: true },
    { text: '…그렇게 아무 생각 없이 입학하는 게 아니었다.', dim: true },
  ],
};

// 전체 에피소드 목록 (컬렉션에 기록된 id로 에피소드를 찾을 때 씀)
export const EPISODE_CATALOG: Episode[] = [
  PROLOGUE,
  ...Object.values(EPISODES),
  DEFAULT_EPISODE,
  ...HEROINES.flatMap((h) => DATE_EPISODES[h]),
];

// 개발자 모드 에피소드 선택 화면에 보여줄 메인 에피소드 (프롤로그, 달별, 기본)
export const MAIN_EPISODE_LIST: { label: string; episode: Episode }[] = [
  { label: '프롤로그', episode: PROLOGUE },
  ...Object.entries(EPISODES).map(([month, episode]) => ({ label: `${month}월`, episode })),
  { label: '기본', episode: DEFAULT_EPISODE },
];

// 다시 보기용 대사: 고른 선택지를 주인공 대사로 바꾸고 그 답변을 바로 이어 붙임
// (선택 기록이 생기기 전에 본 에피소드는 기록이 없으므로 첫 번째 선택지로 보여줌)
export function getReplayLines(lines: EpisodeLine[], picks: number[]): EpisodeLine[] {
  let k = 0;
  // 에피소드를 끝내는 선택지를 골랐으면 그 뒤 대사는 넣지 않음
  let ended = false;
  const expand = (list: EpisodeLine[]): EpisodeLine[] => {
    const result: EpisodeLine[] = [];
    for (const line of list) {
      if (ended) break;
      if (!line.choices) {
        result.push(line);
        continue;
      }
      const choice = line.choices[picks[k++]] ?? line.choices[0];
      const { choices: _choices, ...rest } = line;
      result.push(rest, { speaker: 'player' as const, text: choice.text }, ...expand(choice.reply));
      if (choice.ends) ended = true;
    }
    return result;
  };
  return expand(lines);
}

// 에피소드에 나오는 일러스트(CG) 목록 (선택지 답변 속 CG·데이트 일러스트 포함, 나오는 순서대로, 중복 없이)
export function getEpisodeCgs(episode: Episode): string[] {
  const cgs: string[] = [];
  const collect = (lines: EpisodeLine[]) => {
    for (const l of lines) {
      if (l.cg) cgs.push(l.cg);
      l.choices?.forEach((c) => collect(c.reply));
    }
  };
  collect(episode.lines);
  if (episode.illust) cgs.push(episode.illust);
  return [...new Set(cgs)];
}

// 에피소드에서 히로인별로 오른 호감도 (고른 선택지 기준, 기록이 없으면 첫 번째 선택지. 매력 보너스는 빼고 원래 수치로)
// 선택지 순서는 getReplayLines와 같게 셈
export function getEpisodeAffection(lines: EpisodeLine[], picks: number[]): Partial<Affection> {
  const gained: Partial<Affection> = {};
  const add = (affection?: Partial<Affection>) => {
    for (const [heroine, value] of Object.entries(affection ?? {}) as [Heroine, number][]) gained[heroine] = (gained[heroine] ?? 0) + value;
  };
  let k = 0;
  let ended = false;
  const walk = (list: EpisodeLine[]) => {
    for (const line of list) {
      if (ended) return;
      add(line.affection);
      if (!line.choices) continue;
      const choice = line.choices[picks[k++]] ?? line.choices[0];
      add(choice.affection);
      walk(choice.reply);
      if (choice.ends) ended = true;
    }
  };
  walk(lines);
  return gained;
}

// 에피소드의 대표 캐릭터: 이번 에피소드에서 호감도가 가장 많이 오른 히로인
// gained는 끝까지 봤을 때 저장한 실제 값. 없으면(저장 기능 전에 본 에피소드) 고른 선택지로 다시 계산
// 오른 히로인이 없으면 주인공이 아닌 첫 화자, 그것도 없으면 주인공. 동점이면 먼저 말한 히로인
export function getMainSpeaker(episode: Episode, picks: number[] = [], saved?: Partial<Affection>): Speaker {
  const first = episode.lines.find((l) => l.speaker && l.speaker !== 'player')?.speaker;
  const gained = Object.entries(saved ?? getEpisodeAffection(episode.lines, picks)) as [Heroine, number][];
  const best = gained
    .filter(([, value]) => value > 0)
    .sort(([a, x], [b, y]) => y - x || Number(b === first) - Number(a === first))[0]?.[0];
  return best ?? first ?? 'player';
}
