import hayeongImg from '../img/character/hayeong/hayeong_main.png';
import minjiImg from '../img/character/minji/minji_default.png';
import minjiSmileImg from '../img/character/minji/minji_smile.png';
import minjiBigSmileImg from '../img/character/minji/minji_bigsmile.png';
import minjiShySmileImg from '../img/character/minji/minji_shy_smile.png';
import minjiLessImg from '../img/character/minji/minji_less.png';
import minjiSurprisedSoftImg from '../img/character/minji/minji_surprised_soft.png';
import siyeongImg from '../img/character/siyeong/siyeong_default.png';
import emilyImg from '../img/character/emily/emily_default.png';
import campusSpringImg from '../img/background/campus_spring.png';
import classroomImg from '../img/background/classroom.png';
import barImg from '../img/background/bar.png';
import corridorImg from '../img/background/corridor.png';
import clubRoomImg from '../img/background/club_room.png';
import universityGateImg from '../img/background/university_gate.png';
import gameDevRoomImg from '../img/background/game_dev_room.png';
import lakeTrailImg from '../img/background/lake_trail.png';
import studyroomImg from '../img/background/studyroom.png';
import roomImg from '../img/background/room.png';
import ballroomImg from '../img/background/ballroom.png';
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

// 히로인
export type Heroine = 'minji' | 'siyeong' | 'emily';

export const HEROINES: Heroine[] = ['minji', 'siyeong', 'emily'];

export type Speaker = 'player' | Heroine;

export const SPEAKERS: Record<Speaker, { name: string; image: string }> = {
  // 플레이어 이름은 진행 시 입력한 이름으로 표시
  player: { name: '', image: hayeongImg },
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
  // 선택 직후 이어지는 대사
  reply: EpisodeLine[];
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
  // 있으면 이 대사가 나올 때 선택지 없이 호감도가 바뀜 (선택지와 같이 매력 보너스 적용)
  affection?: Partial<Affection>;
  // 있으면 이 대사 후 선택지 표시
  choices?: Choice[];
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
  // 현재 상황 창에 날짜 옆에 표시 (예: '저녁')
  time?: string;
  lines: EpisodeLine[];
  // 위험도가 100에 닿으면 그 대사 바로 뒤에 이어지는 배드엔딩 장면 (끝나면 정체 발각 연출)
  badEnding?: EpisodeLine[];
}

// 뱀파이어 테마에 맞춰 준비된 배경 (나머지 그림 배경은 EpisodeScene에서 임시로 school.jpg로 보여줌)
export const READY_BACKGROUNDS = new Set<string>([roomImg, ballroomImg, barImg, studyroomImg]);

// 임시 에피소드. 달(1~12)별로 지정하고, 없는 달은 DEFAULT_EPISODE
const EPISODES: Record<number, Episode> = {
  // EP 1. 개강총회 (가면무도회)
  4: {
    id: 'month-4',
    title: '개강총회',
    icon: '🎭',
    time: '밤',
    lines: [
      { text: '문자가 날아왔다.', background: roomImg },
      { name: 'SYSTEM', text: '[신입생 개강총회 안내] 오랜 전통에 따라 이번 개강총회는 가면무도회로 진행됩니다.' },
      { name: 'SYSTEM', text: '참석자는 각자 어울리는 가면을 착용하고 오시기 바랍니다. — 학생회 —' },
      { speaker: 'player', text: '(과연 뱀파이어 대학다운 모습이다.)' },
      { speaker: 'player', text: '(나가긴 가야겠지. 아니면 손목이 터져 죽을 수도 있으니…)' },
      { text: '근처 문구점에서 가면을 사서 무도회장으로 갔다.' },

      // 무도회장
      { speaker: 'player', text: '(대학교에 이런 장소가….?)', background: ballroomImg },
      { text: '위대한 개츠비도 이런 성대한 파티를 열 수 없을 것 같은 파티가 열리고 있었다.' },
      { text: '사람들은 하나같이 화려한 가면을 쓰고 잔을 부딪치고 있었다.' },
      { text: '자세히 보니 잔에 담긴 붉은 액체가 조금씩 색이 다르다.' },
      { speaker: 'player', text: '(저거 다 포도주겠지?)' },
      { speaker: 'player', text: '(…포도주가 맞나?)' },
      { text: '어지러워서 구경만 하고 있던 도중, 누가 뒤에서 건드렸다.' },
      { text: '토끼 가면을 쓴, 약간 키 작은 여자가 말을 걸었다.', cg: ep01MinjiCg },
      { speaker: 'minji', text: '야 너 혼자 여기서 뭐해.', voice: 'ep1/민지1' },
      { speaker: 'player', text: '아, 아니 그냥 구경하고 있었어…' },
      { speaker: 'minji', text: '뭐 이런 거 처음 본 것 마냥 구경하고 있어?', voice: 'ep1/민지2', cg: null },
      { speaker: 'minji', text: '여기 포도주 맛있더라. 소 피를 섞어서 더 풍미가 돋아.', expression: 'smile', voice: 'ep1/민지3' },
      { speaker: 'player', text: '(소 피?…)' },
      { text: '한 모금 마셔보려고 했는데 그 마음이 싹 가셨다.' },
      { speaker: 'minji', text: '음? 안 먹는 걸 보니 귀족 자제분인가? 인간 피 아니면 안 먹는 거야?', voice: 'ep1/민지4' },
      { speaker: 'player', text: '아… 아니. 그냥 내가 오늘 속이 좀.' },
      {
        speaker: 'minji',
        text: '그냥 술을 싫어하나? 그럴 수 있지! 나는 완전 좋아하는데~',
        expression: 'bigsmile',
        voice: 'ep1/민지5',
        choices: [
          {
            text: '나중에 네가 좋아하는 거 추천해 줘.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '오~ 그래? 약속한 거다?', expression: 'smile', voice: 'ep1/민지 호감1-1' },
              { speaker: 'minji', text: '내가 진짜 맛있는 걸로 골라줄게!', expression: 'bigsmile', voice: 'ep1/민지 호감1-2' },
            ],
          },
          {
            text: '난 이런 자리에 오니까 좀 정신이 없어서.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '아, 나도 처음 왔을 땐 그랬어.', voice: 'ep1/민지 호감2-1' },
              { speaker: 'minji', text: '뭐 하다 보면 적응되겠지!', expression: 'smile', voice: 'ep1/민지 호감2-2' },
            ],
          },
          {
            text: '너는 그런 걸 진짜 맛있게 먹어?',
            affection: { minji: -5 },
            reply: [
              { speaker: 'minji', text: '뭐야, 왜 그렇게 이상한 눈으로 봐?', expression: 'less', voice: 'ep1/민지 호감3-1' },
              { speaker: 'minji', text: '진짜 맛있다니까?', expression: 'less', voice: 'ep1/민지 호감3-2' },
            ],
          },
        ],
      },
      { text: '민지는 들고 있던 잔을 한 번 흔들더니 눈을 반짝였다.' },
      { speaker: 'minji', text: '살아있는 인간 피를 섞은 포도주를 먹는 게 내 소원이야… 특히 20대 남자 피.', expression: 'shy_smile', voice: 'ep1/민지6' },
      { speaker: 'minji', text: '완전 드라이한 맛으로 풍미가 몸속 구석구석 퍼진다던데~ 음.', expression: 'smile', voice: 'ep1/민지7' },
      { speaker: 'player', text: '(아… 진짜 도망치고 싶다. 도저히 제정신으로 대화할 수가 없네.)' },
      { speaker: 'player', text: '(정신 차리자. 들키면 바로 도축행이다…)' },
      { speaker: 'player', text: '응 나도야… 한 번 먹어보고 싶네.' },
      { speaker: 'minji', text: '그래? 귀족 자제는 아니었구나! 아 이름 교환을 안 했네. 나는 송민지라고 해.', expression: 'bigsmile', voice: 'ep1/민지8' },
      { text: '민지가 내 쪽으로 손을 내밀었다.' },
      { speaker: 'player', text: '나는… {name}(이)라고 해…' },
      { text: '나는 민지의 손을 잡았다.' },
      { text: '오랜만에 여자와 손을 잡으니 좀 흥분이 됐다.' },
      { text: '심장이 점점 빠르게 뛰기 시작했다.' },
      // 위험 상황 ① 악수
      { speaker: 'player', text: '(안 돼. 여기서 심장이 빨라지면…)', risk: { amount: 40, kind: 'excite' } },
      { speaker: 'minji', text: '너 좀 맛있는 냄새가 난다…?', expression: 'surprised_soft', voice: 'ep1/민지9' },
      { text: '민지는 내 목으로 코끝을 다가가 냄새를 맡으려고 한다.' },
      { text: '점점 가까워지는 얼굴에 몸이 굳었다.' },
      { speaker: 'player', text: '(이대로 냄새를 맡으면…)' },
      { speaker: 'emily', text: '야 뭐하냐? 송민지.', stage: ['minji', 'emily'], voice: 'ep1/에밀리1' },
      { text: '갑작스러운 목소리에 뒤를 돌아보니, 말도 못 걸 만큼 아름다운 은발의 미녀가 고양이 가면을 쓰고 있었다.', cg: ep01EmilyCg },
      { speaker: 'minji', text: '아니 얘 좀 향기가 좋아서.', voice: 'ep1/민지9', cg: null },
      { speaker: 'emily', text: '그렇다고 처음 보는 사람한테 그렇게 다가가냐? 천박하게.', voice: 'ep1/에밀리2' },
      { speaker: 'minji', text: '응…? 너 진짜 죽을래?', expression: 'less', voice: 'ep1/민지10' },
      { text: '두 여자가 나를 두고 싸우는데 기쁘지 않고 그냥 무서웠다.' },
      { speaker: 'siyeong', text: '그… 그만하세요.', stage: ['minji', 'siyeong', 'emily'], voice: 'ep1/시영1', cg: ep01SiyeongCg },
      { text: '음침하게 생기고 뭔가 공부 잘할 것 같이 생긴 애가 유령 가면을 쓰고 말했다.' },
      { speaker: 'siyeong', text: '벌써부터 싸우면… 퇴학 당해요…', voice: 'ep1/시영2' },
      { speaker: 'minji', text: '어우 그냥 내가 착하니까 한 번 참는다. 너 진짜 말 조심해라 에밀리.', expression: 'less', voice: 'ep1/민지11', cg: null },
      { speaker: 'minji', text: '귀족 자제라고 나는 봐주지 않아.', expression: 'less', voice: 'ep1/민지12' },
      { speaker: 'emily', text: '…천박하게. 이래서 못 사는 애들이랑 상종하지 말아야 한다니까.', voice: 'ep1/에밀리3' },
      { speaker: 'minji', text: '아 진짜 현피 뜰까…?', expression: 'less', voice: 'ep1/민지13' },
      { speaker: 'siyeong', text: '그… 그만요.', voice: 'ep1/시영3' },
      { speaker: 'minji', text: '아니 시영아… 얘 말하는 것 좀 봐. 내가 화가 나 안 나?', expression: 'less', voice: 'ep1/민지14' },
      { speaker: 'minji', text: '근데 너 아까부터 왜 나만 막는 거야?', voice: 'ep1/민지15' },
      { speaker: 'minji', text: '너도 뒤질래?', expression: 'less', voice: 'ep1/민지16' },
      { speaker: 'siyeong', text: '아… 아니요!!! 죄송해요… 저분은 무서워서…', voice: 'ep1/시영4' },
      { speaker: 'minji', text: '뭐, 너도 죽자.', expression: 'less', voice: 'ep1/민지17' },
      { text: '상황이 더 커지기 전, 대기하고 있던 선도부 무리가 다가와 민지라는 아이를 끌고 갔다.' },
      { speaker: 'minji', text: '아니 잠깐만요! 제가 피해자인데요?!', expression: 'surprised_soft', voice: 'ep1/민지18' },
      { text: '민지는 끌려가면서도 에밀리를 노려봤다.' },
      { speaker: 'minji', text: '야! 너 나중에 보자!', expression: 'less', voice: 'ep1/민지20' },
      { text: '에밀리라고 불린 고양이 가면의 여성은 끌려가는 민지를 가만히 바라보다가 말을 걸었다.', stage: ['siyeong', 'emily'] },
      { speaker: 'emily', text: '너도 귀족 자제인가? 계속 식욕이 도는 게 좋은 향수를 쓰는 것 같군.', voice: 'ep1/에밀리4' },
      { speaker: 'emily', text: '음. 어떤 걸 쓰는지 알 수 있나?', voice: 'ep1/에밀리5' },
      { speaker: 'player', text: '(돈 없어서 향수 안 쓰는데…)' },
      // 위험 상황 ② 향수에 대한 대답 (긴장해서 피 냄새가 짙어짐: 정신력 회피 후 위장도 적용)
      {
        speaker: 'player',
        text: '(뭔가 안 쓴다고 하면 들킬 것 같다.)',
        choices: [
          {
            text: '에르메스 향수야.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '그 브랜드에선 이런 향이 없는 거로 아는데?', voice: 'ep1/에밀리 호감1-1' },
              { speaker: 'player', text: '어… 그게…' },
              { text: '에밀리의 눈썹이 살짝 올라갔다.', risk: { amount: 10, kind: 'excite' } },
              { speaker: 'player', text: '(아무거나 둘러댄 게 잘못이었나?)' },
            ],
          },
          {
            text: '향수는 안 뿌려.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '그럼 그게 네 체향인 건가…? 그렇군…', voice: 'ep1/에밀리 호감2-1' },
              { text: '에밀리는 잠깐 나를 바라보더니 고개를 돌렸다.' },
              { speaker: 'emily', text: '특이하군. 향수를 쓰지 않는데도 이런 향이 나다니.', voice: 'ep1/에밀리 호감2-2' },
              { speaker: 'player', text: '(괜히 둘러대는 것보다 솔직하게 말하는 게 나았나 보다.)' },
            ],
          },
          {
            text: '그건 알려 줄 수 없어.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '흠. 알려줄 수 없다니… 별로 궁금하지도 않았어.', risk: { amount: 10, kind: 'excite' }, voice: 'ep1/에밀리 호감3-1' },
              { speaker: 'emily', text: '흥미가 떨어졌다. 이만 가보도록 하지.', voice: 'ep1/에밀리 호감3-2' },
              { text: '에밀리는 고개를 돌리고는 그대로 가버렸다.' },
              { speaker: 'player', text: '(…궁금해서 먼저 물어본 거 아니었나?)' },
            ],
          },
        ],
      },
      { text: '잠시 정신을 차리기도 전에, 옆에 있던 유령 가면의 여자애도 말을 걸었다.' },
      { speaker: 'siyeong', text: '나는… 서시영이라고 해.', stage: ['siyeong'], voice: 'ep1/시영5' },
      { speaker: 'siyeong', text: '나도 원래 말을 잘 못 거는데… 냄새에 이끌려 오니 너 앞이었어.', voice: 'ep1/시영6' },
      { speaker: 'siyeong', text: '뭔가 너한테 이끌리는 느낌…', voice: 'ep1/시영7' },
      { text: '시영은 내 얼굴을 가만히 바라봤다.' },
      { text: '유령 가면 때문에 표정은 잘 안 보이는데, 왠지 눈을 피하기가 어려웠다.' },
      { speaker: 'siyeong', text: '앗, 내가 무슨 말을 하는 거지… 다 잊어줘.', voice: 'ep1/시영8' },
      { speaker: 'player', text: '아, 응…' },
      { speaker: 'siyeong', text: '아, 아니… 혹시 손목 한 번만 물어도 될까…?', voice: 'ep1/시영9' },
      { speaker: 'player', text: '뭐, 뭐라고?' },
      { text: '시영의 시선이 내 손목으로 내려갔다.' },
      { text: '웃으면서 하는 말도 아니었다.' },
      // 위험 상황 ③ 시영의 부탁
      {
        speaker: 'player',
        text: '(진심이야…?)',
        choices: [
          {
            text: '미안, 그건 조금 무서운데…',
            affection: {},
            reply: [
              { text: '나는 천천히 손목을 뒤로 감췄다.' },
              { speaker: 'siyeong', text: '아… 그렇지. 갑자기 이런 말 하면 무섭겠지…', voice: 'ep1/시영 호감1-1' },
              { text: '시영은 민망한 듯 가면을 살짝 만졌다.' },
              { speaker: 'player', text: '대신… 다음에 음료수라도 같이 마실래?' },
              { speaker: 'siyeong', text: '어… 응.', voice: 'ep1/시영 호감1-2' },
              { text: '시영의 목소리가 조금 작아졌지만, 싫은 눈치는 아니었다.' },
            ],
          },
          {
            text: '손목은 좀 그렇고… 손 정도는 잡아도 돼.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '소, 손…?', voice: 'ep1/시영 호감2-1' },
              { speaker: 'player', text: '아까 민지랑도 악수했으니까. 우리도 인사는 해야지.' },
              { text: '시영은 조심스럽게 내 손을 잡았다.' },
              { text: '생각보다 손이 차갑다.' },
              { text: '그런데 내 손은 점점 뜨거워지는 것 같았다.' },
              { speaker: 'player', text: '(이러면 또 심장이…)' },
              { speaker: 'siyeong', text: '손이… 따뜻하네.', voice: 'ep1/시영 호감2-2' },
              { text: '시영이 내 손목 쪽으로 손가락을 조금 옮겼다.' },
              { speaker: 'player', text: '(잠깐, 거기는 맥박이 느껴질 텐데.)', risk: { amount: 50, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { text: '시영은 갑자기 정신이 든 듯 내 손을 놓았다.' },
            ],
          },
          {
            text: '너라면… 한 번 정도는 괜찮아.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '…정말?', voice: 'ep1/시영 호감3-1' },
              { speaker: 'player', text: '(내가 왜 그랬지? 입이 먼저 나가버렸다.)' },
              { speaker: 'player', text: '아, 아니. 그러니까…' },
              { speaker: 'siyeong', text: '나… 진짜 물어버릴지도 모르는데.', voice: 'ep1/시영 호감3-2' },
              { text: '시영이 내 손목을 잡고 천천히 입을 가까이 가져왔다.' },
              { text: '가면 아래로 뾰족한 송곳니가 보였다.' },
              { text: '심장이 미친 듯이 뛰기 시작했다.' },
              { speaker: 'player', text: '(아, 잠깐만. 진짜 물겠다는 거야?)', risk: { amount: 90, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { text: '시영은 내 손목 바로 앞에서 멈췄다.' },
              { text: '나를 한 번 올려다보더니, 송곳니를 감추고 손을 놓았다.' },
            ],
          },
        ],
      },
      { speaker: 'siyeong', text: '아 아냐… 포도주를 너무 많이 마셨나… 계속 이상한 말을 하네… 미안해.', voice: 'ep1/시영 위험1' },
      { speaker: 'player', text: '아, 아니야…' },
      { speaker: 'player', text: '(다행이다. 진짜 물리는 줄 알았다.)' },
      { speaker: 'siyeong', text: '이만 나도 가 볼게… 뭔가 계속 실수할 것 같네.', voice: 'ep1/시영 위험2' },
      { text: '시영은 몇 걸음 가다가 나를 한 번 돌아봤다.' },
      { speaker: 'siyeong', text: '{name}.', voice: 'ep1/시영 위험3' },
      { speaker: 'player', text: '응?' },
      { speaker: 'siyeong', text: '우리… 다음에 또 볼 수 있겠지?', voice: 'ep1/시영 위험4' },
      { speaker: 'player', text: '같은 학교니까… 아마?' },
      { speaker: 'siyeong', text: '아… 그렇지.', voice: 'ep1/시영 위험5' },
      { text: '시영은 조금 부끄러운 듯 고개를 숙이고 사람들 사이로 사라졌다.', hidePortrait: true },
      { text: '이렇게 가면무도회는 끝났다.' },
      { text: '하나 알 수 있는 점은, 살아남기 위해서 정신을 똑바로 차려야 한다는 점이었다.' },
      { speaker: 'player', text: '(너무 피곤하다…)' },
    ],
    badEnding: [
      { speaker: 'siyeong', text: '잠깐만… {name}한테서 나는 이 냄새…?' },
      { text: '시영의 시선이 내 손목에 멈췄다. 긴장해서 피가 빨리 돌자 인간의 피 냄새가 짙어졌다.' },
      { name: '주변 학생', text: '이 냄새… 인간의 피잖아.' },
      { text: '주변에 있던 뱀파이어들이 하나둘 고개를 돌렸다. 도망치려고 했지만 이미 사람들이 내 앞을 막고 있었다.', hidePortrait: true },
      { text: '나는 가면도 벗지 못한 채 무도회장에서 죽었다.' },
      { name: 'BAD END', text: '가면 뒤의 인간' },
    ],
  },
  // EP 2. 중간고사 뒤 술자리
  5: {
    id: 'month-5',
    title: '중간고사 뒤 술자리',
    icon: '🍷',
    time: '밤',
    lines: [
      // 뱀파이어 대학에서의 수업
      { text: '그동안 수업은 대체적으로 현대 사회 생존학이나 인간 심리학, 예절, 혈액양조학, 우주학 등 다양하게 배웠다.', background: roomImg },
      { text: '그래서 알게 된 점은 뱀파이어는 다른 차원에 살아가고 있고, 20살이 되던 해에 인간 세상을 가서 80살까지 살아남아야 진정한 뱀파이어로 인정받고 다시 넘어갈 수 있다는 것이었다.' },
      { text: '그래서 대학교 4년 동안 생존에 관한 수업을 받고, 야간 직종으로 인간과 섞여 살아간다는 걸 알았다.' },
      { text: '또한 이성의 피에 이끌리는데, 뜨거운 피의 냄새만 맡아도 발정하게 되는 경향이 있다는 걸 알게 되었다.', },
      { text: '그래서 가면무도회 때 왜 그렇게 나한테 좋은 냄새가 난다고 했는지 알게 되었다.' },
      { speaker: 'player', text: '(내가 흥분하거나 심장이 빠르게 뛰는 건 최대한 자제해야겠다.)', cg: null },
      { speaker: 'player', text: '(그리고 최대한 아싸처럼 지내야겠다.)' },
      { text: '이러면서 5월에 술자리를 가지게 되었다.' },
      { text: '바로 도망가고 싶었지만 중간고사가 끝난 기념으로 다 참여하라고 해서 결국 참여하게 됐다.' },

      // 중간고사 뒤 술자리
      { text: '여기 음식은 고기와 포도주가 전부였다.', background: barImg },
      { text: '그래서 고기 요리는 진짜 차원이 달랐다. 레어를 싫어하는데 딱 알맞은 굽기였다.' },
      { text: '나도 모르게 고기를 먹으면서 포도주를 마시게 됐다.' },
      { text: '한 잔을 비우고 나니 얼굴이 뜨거워졌다. 술기운 때문인지 심장도 조금씩 빨리 뛰기 시작했다.' },
      // 위험 상황 ① 포도주
      { speaker: 'player', text: '(아, 맞다. 흥분하면 안 되는데. 벌써부터 이러면 어떡하지?)', risk: { amount: 20, kind: 'excite' } },
      { speaker: 'minji', text: '야, 너 오랜만이다. 가면무도회 때 그 웃긴 가면 너 맞지?', expression: 'smile', voice: 'ep2/민지1' },
      { text: '고개를 돌리자 송민지가 내 옆자리에 털썩 앉았다.' },
      { speaker: 'minji', text: '그때 선도부한테 끌려가서 정신이 없었어. 너 이름이… 뭐였지?', voice: 'ep2/민지2' },
      { speaker: 'player', text: '나는 {name}…' },
      { speaker: 'minji', text: '아, 맞다. {name}!', expression: 'bigsmile', voice: 'ep2/민지3' },
      { speaker: 'minji', text: '음, 역시 너 옆에 앉으니까 더 알 것 같아. 너 옆에 있으면 좀 오싹오싹하고 흥분되는 게…', expression: 'shy_smile', voice: 'ep2/민지4' },
      { speaker: 'player', text: '흥분되는 게…?' },
      { text: '약간 눈이 돌아 있는 듯한 모습으로 나를 바라봐서 들키는 건가 무서웠다.' },
      { speaker: 'minji', text: '너를 좋아하는 것 같아… 너 나랑 사귀자!!', expression: 'bigsmile', voice: 'ep2/민지5', cg: ep03MinjiCg },
      { speaker: 'player', text: '(…응?)' },
      { text: '너무 뜬금없이 고백을 받아 그냥 벙지게 되었다.' },
      { text: '뭔가 그동안 살 생각만 하니까 예쁘다고 생각이 들지 않았는데, 송민지는 귀여우면서 예뻐서 나도 모르게 볼이 빨개졌다.' },
      // 위험 상황 ② 민지의 고백
      { text: '잠깐, 사귀자고? 심장이 뛰는 게 느껴질 정도로 빨라졌다.', risk: { amount: 20, kind: 'excite' } },
      // 선택지 1. 민지의 갑작스러운 고백
      {
        speaker: 'player',
        text: '(뭐라고 대답하지…?)',
        cg: null,
        choices: [
          {
            text: '나도 너랑 더 친해지고 싶어.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '오? 그럼 가능성 있다는 거네? 좋았어!', expression: 'bigsmile', voice: 'ep2/민지 호감1' },
              { speaker: 'player', text: '(아니, 친해지고 싶다고 했지 사귀겠다고는 안 했는데…)' },
            ],
          },
          {
            text: '갑자기라 좀 놀랐어.',
            affection: { minji: 5 },
            reply: [{ speaker: 'minji', text: '하긴, 내가 좀 갑작스러웠지? 그래도 잘 생각해 봐!', expression: 'smile', voice: 'ep2/민지 호감2' }],
          },
          {
            text: '장난은 그만해.',
            affection: { minji: -5 },
            reply: [{ speaker: 'minji', text: '뭐야, 나 나름 진지했는데? 너 은근 상처 준다.', expression: 'less', voice: 'ep2/민지 호감3' }],
          },
        ],
      },
      { speaker: 'emily', text: '야, 또 얘 괴롭히지?', stage: ['minji', 'emily'], voice: 'ep2/에밀리1' },
      { text: '은발 초미녀가 말을 걸었다.' },
      { text: '진짜 다행이다. 민지가 더 다가왔으면 심장 두근거리는 걸 멈출 수 없어서 들켰을 것이다.' },
      { text: '에밀리라는 애였고, 얘는 귀족 자제로 싸가지가 좀 없는 듯했다.' },
      { speaker: 'minji', text: '아, 또 너냐. 내가 그때 너 때문에 창피당한 거 생각하면 진짜…', expression: 'less', voice: 'ep2/민지6' },
      { speaker: 'emily', text: '뭐, 네가 잘못한 건데. 창피할 것도 따로 있나. 행동을 바르게 하면 그럴 일도 없거든.', voice: 'ep2/에밀리2 쯧쯧 삭제' },
      { speaker: 'minji', text: '와, 진짜 내가 원래 이런 애가 아닌데 너는 진짜… 죽이고 싶다. 현피 한 번만 뜨면 안 될까?', expression: 'less', voice: 'ep2/민지7' },
      { speaker: 'emily', text: '꺼져. 혼자나 하시고.', voice: 'ep2/에밀리3' },
      { speaker: 'player', text: '(아니, 지금 막으러 온 거 아니었어? 둘이 또 싸우려고 하는데…)' },
      { speaker: 'emily', text: '흠, 오랜만에 이 냄새를 맡으니 더 이끌리네.', voice: 'ep2/에밀리4' },
      { speaker: 'emily', text: '다시 한 번 더 물어보도록 하지. 너 향수를 뭐 쓴다고?', voice: 'ep2/에밀리5' },
      { speaker: 'player', text: '안… 안 쓴다니까…' },
      { speaker: 'emily', text: '안 쓴다고? 그럼 그냥 너 향기라는 건가…', voice: 'ep2/에밀리6' },
      { text: '에밀리가 냄새를 맡으려 가까이 왔다.', cg: ep03EmilyCg },

      // 쏟아진 포도주
      { text: '그때 잔을 들고 다가오던 서시영이 에밀리와 나를 번갈아 봤다. 시영의 눈빛이 갑자기 이상해졌다.', stage: ['minji', 'siyeong', 'emily'], cg: null },
      { speaker: 'siyeong', text: '…너무 가까워요.', voice: 'ep2/시영1' },
      { text: '갑자기 서시영이 빈손으로 에밀리를 힘껏 밀쳤다.' },
      { speaker: 'siyeong', text: '내 거야!!!!!', voice: 'ep2/시영2' },
      { text: '그 바람에 시영이 들고 있던 포도주 잔이 기울었다. 붉은 포도주가 에밀리의 흰 셔츠 위로 쏟아졌다.' },
      { speaker: 'emily', text: '…뭐?', voice: 'ep2/에밀리7' },
      { speaker: 'siyeong', text: '앗… 죄, 죄송해요!', voice: 'ep2/시영3' },
      { text: '젖은 흰 셔츠 너머로 에밀리가 입은 검은색 브래지어의 윤곽이 비쳤다.' },
      { text: '에밀리는 자기 옷을 내려다보더니 얼굴이 빨개져서 급하게 팔로 몸을 가렸다.' },
      { speaker: 'emily', text: '야! 다들 저리 좀 돌아봐!', voice: 'ep2/에밀리8' },
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
              { speaker: 'emily', text: '…고, 고맙다. 그리고 계속 돌아보고 있어.', voice: 'ep2/에밀리 호감1' },
              { text: '에밀리가 옷을 받아 몸을 가렸다. 그래도 심장이 조금은 빨라졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '내가 가려줄게, 이쪽으로 와.',
            affection: { emily: 10 },
            reply: [
              { text: '나는 겉옷을 펼쳐 들고 에밀리 앞으로 다가갔다. 가까이 서자 심장이 더 빠르게 뛰었다.', risk: { amount: 40, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '이, 이렇게 가까이 오라는 뜻은 아니었는데… 그래도 고맙다.', voice: 'ep2/에밀리 호감2' },
              { text: '에밀리는 황급히 내 겉옷을 받아 몸을 가렸다.' },
            ],
          },
          {
            text: '어… 에밀리…',
            affection: {},
            reply: [
              { text: '너무 당황해서 고개를 돌려야 한다는 생각도 늦었다. 심장이 빨리 뛰고 피 냄새가 짙어졌다.', risk: { amount: 60, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '야, 너도 돌아보라고!', voice: 'ep2/에밀리 호감3' },
              { text: '나는 화들짝 놀라 뒤를 돌아봤다. 하지만 이미 너무 늦은 건 아닐까?' },
            ],
          },
        ],
      },
      { text: '에밀리는 시영에게 무슨 일을 당했는지 모르는 표정으로 상황을 파악하려고 했다. 평소와 다른 모습이 조금 웃겼다.' },
      { speaker: 'emily', text: '감히…? 이게 대체 뭐 하는 짓이지?', voice: 'ep2/에밀리9' },
      { speaker: 'siyeong', text: '죄, 죄송해요… 그치만 {name}한테 너무 가까이 붙어서…', voice: 'ep2/시영4' },
      { speaker: 'minji', text: '캬하하하하! 꼴이 좋아! 시영아 잘했어, 꼴이 좋아!', expression: 'bigsmile', voice: 'ep2/민지8' },
      { speaker: 'emily', text: '너 지금 웃었냐? 너도 같이 죽고 싶어?', voice: 'ep2/에밀리10' },
      { speaker: 'minji', text: '어우, 귀족님 화나셨네. 알았어, 돌아볼게. 돌아보면 되잖아!', expression: 'smile', voice: 'ep2/민지9' },
      // 선택지 3. 시영에게 말하기
      {
        speaker: 'siyeong',
        text: '{name}은(는) 내 거예요… 내가 찜해놨어요!!!!!',
        cg: ep03SiyeongCg,
        voice: 'ep2/시영5',
        choices: [
          {
            text: '시영아, 괜찮아? 에밀리한텐 같이 사과하자.',
            affection: { siyeong: 10 },
            reply: [{ speaker: 'siyeong', text: '{name}이(가) 같이 가준다면… 저도 제대로 사과할게요.', voice: 'ep2/시영 호감1' }],
          },
          {
            text: '다들 진정해. 차례대로 얘기하자.',
            affection: { siyeong: 5 },
            reply: [{ speaker: 'siyeong', text: '네… 일단 진정할게요.', voice: 'ep2/시영 호감2' }],
          },
          {
            text: '시영아, 좀 무섭다…',
            affection: { siyeong: -5 },
            reply: [{ speaker: 'siyeong', text: '아… 미안해요. 무섭게 하려던 건 아닌데…', voice: 'ep2/시영 호감3' }],
          },
        ],
      },
      { speaker: 'minji', text: '아니 그건… 아니야. 내 거야, 시영아. 방금 건 씹호감 행동이었지만 {name}은(는) 양보 못 해.', voice: 'ep2/민지10', cg: null },
      { speaker: 'emily', text: '다 꺼져, 좋은 말로 할 때. 귀족은 귀족끼리가 어울리는 법.', voice: 'ep2/에밀리11-1 꺼져로 변경' },
      { speaker: 'emily', text: '어디 가문도 없는 거지들이 넘보는 것인가.', voice: 'ep2/에밀리11-2 거지로 변경' },
      { speaker: 'minji', text: '아니, 네가 뭔데 끼어들어? 방금까지 옷 가리고 있었으면서!', expression: 'less', voice: 'ep2/민지11' },
      { speaker: 'emily', text: '야, 송민지. 너 진짜 한 번만 더 말해 봐.', voice: 'ep2/에밀리12' },
      { speaker: 'siyeong', text: '{name}은(는)… 두 분한테 안 줄 거예요.', voice: 'ep2/시영6' },
      { text: '세 명이 날 두고 싸우는데 이게 대체 좋아해야 하는지 무서워해야 하는지 모르겠지만, 초절정 미녀들이 날 두고 싸우다니 그냥 좋았다.' },
      { text: '물론 심장이 또 뛰기 시작하면 좋다고만 할 수는 없겠지만…' },
      { text: '나는 조용히 물 한 잔을 마시며 다시 한번 마음을 가라앉혔다.', hidePortrait: true },
    ],
    badEnding: [
      { speaker: 'siyeong', text: '잠깐만… {name}한테서 나는 이 냄새…' },
      { text: '시영이 내 쪽을 바라봤다. 손으로 가슴을 누르며 진정하려고 했지만 이미 늦었다.' },
      { speaker: 'minji', text: '{name}? 이 냄새… 설마…', expression: 'surprised_soft' },
      { speaker: 'emily', text: '인간의 피다.' },
      { text: '순식간에 주변이 조용해졌다. 그러더니 여기저기서 의자가 밀리는 소리가 났다.', hidePortrait: true },
      { text: '도망치려고 자리에서 일어났지만 학생들이 이미 내 앞을 막고 있었다.' },
      { text: '결국 나는 술자리에서 정체를 들킨 채 죽었다.' },
      { name: 'BAD END', text: '술자리의 인간' },
    ],
  },
  // EP 3. 기말고사 공부모임
  6: {
    id: 'month-6',
    title: '기말고사 공부모임',
    icon: '📚',
    time: '오후',
    lines: [
      { text: '이제는 기말고사 기간이 되었고, 뱀파이어랑 우리 생각이 다른지 중간고사를 너무 망쳐서 같이 공부할 사람을 찾다가 어쩌다 그 3명이랑 공부를 하게 되었다.', background: studyroomImg },
      { speaker: 'player', text: '(그래도 얘네들이 상위권이니까 공부하는 데 도움이 되겠지…?)' },
      { speaker: 'siyeong', text: '어떤 게 궁금해ㅐㅐㅐㅐ 다 물어봐. 내가 다…… 모두…… 다 알려줄게……', stage: ['minji', 'siyeong', 'emily'], voice: 'ep3/시영1' },
      { speaker: 'siyeong', text: '나에 대한 것도……ㅎ', voice: 'ep3/시영2' },
      { speaker: 'minji', text: '시영아, 지금 너 얼굴 너무 무서워.', expression: 'less', voice: 'ep3/민지1' },
      { text: '시영이는 내 옆으로 의자를 끌고 오더니 갑자기 머리끈을 꺼냈다.' },
      { speaker: 'siyeong', text: '으으… 아… 머리가 자꾸 내려와서… {name}, 나 머리 좀 묶을게…', voice: 'ep3/시영3' },
      { text: '아니, 머리 묶는데 왜 이상한 소리를 내는 거야. 시영이는 일부러 내 쪽을 힐끔 보면서 머리를 천천히 묶었다.' },
      { text: '머리를 묶으니 목덜미가 보였다. 괜히 시선을 어디에 둬야 할지 모르겠고 심장이 조금씩 빨리 뛰는 것 같았다.' },
      // 선택지 1. 시영의 묶은 머리 (흥분 위험 ①, 생존 시 호감도 적용)
      {
        speaker: 'siyeong',
        text: '{name}… 나 머리 묶은 거… 어때?',
        voice: 'ep3/시영4',
        choices: [
          {
            text: '머리 묶으니까 공부하기 편하겠다.',
            affection: {},
            reply: [
              { speaker: 'siyeong', text: '응… 이제 {name}한테 문제도 더 잘 알려줄 수 있겠다…ㅎ', risk: { amount: 10, kind: 'excite' }, voice: 'ep3/시영 호감1' },
            ],
          },
          {
            text: '시영아, 머리 묶으니까 잘 어울려.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…? 그럼 앞으로 {name} 앞에서는 계속 묶고 있을게…', voice: 'ep3/시영 호감2' },
              { text: '이렇게 좋아할 줄 알았으면 좀 더 덤덤하게 말할걸… 심장이 점점 빨라진다.', risk: { amount: 20, kind: 'excite' } },
            ],
          },
          {
            text: '그렇게 가까이 있으면 나도 두근거리잖아.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '{name}도 두근거려…? 나랑 똑같네…ㅎ', voice: 'ep3/시영 호감3' },
              { text: '시영이가 더 가까이 다가왔다. 아, 내가 왜 그런 말을 했지? 심장이 터질 것 같다.', risk: { amount: 40, kind: 'excite' } },
            ],
          },
        ],
      },

      // 공부는 뒷전
      { speaker: 'minji', text: '{name}…… 나는 문제 좀 알려줄래?! 나는 이거, 이거, 이것까지!!!!!!! 다 모르겠어.', expression: 'bigsmile', voice: 'ep3/민지2' },
      { speaker: 'minji', text: '좀만 더 붙어서 설명해줘.', expression: 'shy_smile', voice: 'ep3/민지3' },
      { text: '민지가 내 쪽으로 바짝 붙어오자 에밀리가 민지의 책을 날려버리면서 말했다.' },
      { speaker: 'emily', text: '에휴 진짜 저급하다. 진짜 꺼지고 {name} 편하게 공부하게 다 꺼져.', voice: 'ep3/에밀리1' },
      { speaker: 'emily', text: '시끄러워서 집중을 할 수가 없네.', voice: 'ep3/에밀리2' },
      { speaker: 'emily', text: '혹시 연필로 찍혀 본 적은 없는 거지? 내가 경험시켜줘도 될까?', voice: 'ep3/에밀리3' },
      { speaker: 'player', text: '얘들아 제발 조용히 좀 해줘ㅠㅠㅠㅠ 나도 공부 좀 하자.' },
      { text: '내가 너무나도 실수했다. 얘네들이 그래도 상위권이고 그나마 같이 하자고 해서 도움이 될 줄 알았는데 공부에 집중을 하나도 못 하겠다.' },
      { speaker: 'minji', text: '그래그래 다 닥쳐. 진짜 집중하자.', voice: 'ep3/민지4' },
      { text: '민지가 다시 주워 온 책을 펴는 척하더니 나한테 바짝 다가와 귓속말했다.' },
      { speaker: 'minji', text: '모르는 문제 있으면 이따가 같이 몰래 나가서 물어볼게, {name}.', expression: 'shy_smile', voice: 'ep3/민지5' },
      { speaker: 'player', text: '힉!!!' },
      { text: '갑자기 귀에 바람이 닿아서 놀랐다. 얼굴이 뜨거워지고 심장도 두근거리기 시작했다.' },
      { speaker: 'minji', text: '으으으… 아, 가슴 무거워. 공부 못 하겠다.', voice: 'ep3/민지6' },
      { text: '민지는 일부러 들으라는 듯 이상한 소리를 내더니 가슴을 책상 위에 턱 올려놓고 나를 바라봤다.' },
      { speaker: 'minji', text: '{name}, 나 이렇게 힘든데 좀 봐주면 안 돼?', expression: 'shy_smile', voice: 'ep3/민지7' },
      // 선택지 2. 민지의 귓속말 (흥분 위험 ②, 귓속말과 책상 장면을 합쳐 한 번만 판정)
      {
        text: '아니 얘도 대체 왜 이러는 거야. 지금 기말고사 공부하러 온 거 맞아?',
        choices: [
          {
            text: '여기 이 문제부터 풀어보자.',
            affection: {},
            reply: [
              { speaker: 'minji', text: '에이, 반응이 왜 그래. 알았어, 일단 이거부터 알려줘.', expression: 'less', voice: 'ep3/민지 호감1' },
              { text: '나는 애써 문제집을 바라봤다. 그래도 아직 심장이 조금 빨랐다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '그렇게 가까이 오니까 집중이 안 되잖아.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '어? 나 때문에 집중이 안 돼? 그럼 좀 더 가까이 가볼까?', expression: 'smile', voice: 'ep3/민지 호감2' },
              { speaker: 'player', text: '아, 아니! 그런 뜻이 아닌데…!', risk: { amount: 30, kind: 'excite' } },
            ],
          },
          {
            text: '둘이 몰래 나가서 더 가까이 알려줄까?',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '뭐야, 너도 나랑 단둘이 있고 싶었어? 지금 나갈까?', expression: 'bigsmile', voice: 'ep3/민지 호감3' },
              { speaker: 'player', text: '지, 지금 말고… 일단 공부부터 하자!' },
              { text: '내가 무슨 소리를 한 거지. 민지가 웃으면서 더 다가오자 심장이 미친 듯이 뛰었다.', risk: { amount: 50, kind: 'excite' } },
            ],
          },
        ],
      },
      { text: '그때 시영이가 필통에서 슬며시 가위를 꺼내길래 얼른 집어넣게 했다.' },
      { speaker: 'player', text: '시, 시영아. 가위는 왜 꺼내는 거야? 다시 넣자…' },
      { speaker: 'siyeong', text: '아… 그냥… 연필을 깎으려고…', voice: 'ep3/시영5' },
      { text: '시영아, 그거 샤프잖아…' },

      // 에밀리와 단둘이
      { speaker: 'emily', text: '음, 집중 많이 했네. 조금만 쉴까?', voice: 'ep3/에밀리4' },
      { text: '민지는 자고 있고 시영이는 집중하고 있었다. 민지 자고 있는 모습이 꽤나 귀여워 보이기도 했다.', cg: ep04StudyCg },
      { speaker: 'player', text: '음, 그러면 커피 좀 먹을까?', cg: null },
      { speaker: 'emily', text: '좋은 생각이다. 시영아, 커피 좀 가져오도록.', voice: 'ep3/에밀리5' },
      { speaker: 'siyeong', text: '내…… 내가…… 왜……', stage: ['siyeong', 'emily'], voice: 'ep3/시영6' },
      { speaker: 'emily', text: '둘이서 할 이야기가 있어서 어쩔 수 없다. 빨리 다녀오도록……', voice: 'ep3/에밀리6' },
      { speaker: 'siyeong', text: '하…… {name}(이)랑 두…… 둘이……? 그럼 안…… 갈래……', voice: 'ep3/시영7' },
      { text: '에밀리가 눈을 부릅뜨며 시영이를 노려봤다.' },
      { speaker: 'siyeong', text: '히익!!! 아…… 알겠어, 다녀올게……ㅠㅠㅠ', voice: 'ep3/시영8' },
      { text: '시영이가 커피를 가지러 가고, 자고 있는 민지를 빼면 나와 에밀리 둘만 남았다.', stage: ['emily'] },
      { speaker: 'emily', text: '드디어 갔네. 둘이서만 공부하는 게 너한테도 더 좋았을 텐데 쓰레기들이 너무 많이 꼈군.', voice: 'ep3/에밀리7 갔네로 변경' },
      { speaker: 'emily', text: '그래, 너는 인간의 어느 부위를 좋아하지? 나는 아무래도 손목의 피를 좋아한다네. 제일 깔끔하고 고급진 맛이 난다랄까.', voice: 'ep3/에밀리8' },
      { speaker: 'player', text: '(아…… 대체 뭐라고 답해야 하지……)' },
      { text: '에밀리가 내 손목을 보더니 의자를 조금씩 내 쪽으로 끌고 왔다.' },
      { speaker: 'emily', text: '이렇게 단둘이 있으니 굳이 책만 보고 있을 필요는 없지 않나?', voice: 'ep3/에밀리9' },
      { speaker: 'player', text: '채, 책 말고 뭘 보려고…?' },
      { speaker: 'emily', text: '글쎄. 네 손목에 내 입술을 가까이 대면… 그때도 그렇게 아무렇지 않은 척할 수 있나 궁금하군.', voice: 'ep3/에밀리10' },
      { speaker: 'player', text: '뭐, 뭐라고?!' },
      { speaker: 'emily', text: '걱정하지 마라. 네가 원하기 전까지는… 물지 않을 테니.', voice: 'ep3/에밀리11' },
      { text: '얘 지금 무슨 말을 하는 거야?! 얼굴은 뜨겁고, 에밀리는 자꾸 가까이 오고, 심장은 점점 더 빨라진다.' },
      // 선택지 3. 에밀리의 유혹 (흥분 위험 ③, 위험도 100에 닿으면 즉시 배드엔딩)
      {
        speaker: 'emily',
        text: '얼굴이 빨개졌군. 내가 그렇게 가까이 오는 게 싫지만은 않은 모양이지?',
        voice: 'ep3/에밀리12',
        choices: [
          {
            text: '그런 이야기는 그만하고, 문제부터 풀자.',
            affection: {},
            reply: [
              { speaker: 'emily', text: '흥, 재미없는 녀석. 그래도 내가 특별히 알려주도록 하지.', voice: 'ep3/에밀리 호감1' },
              { text: '나는 손목을 슬쩍 감추고 다시 책을 폈다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '네가 그렇게 말하니까 더 긴장되잖아.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '내 말 한마디에 긴장하는 건가? 후후, 생각보다 귀여운 구석이 있군.', voice: 'ep3/에밀리 호감2' },
              { text: '에밀리가 웃으며 조금 더 다가왔다. 피 냄새가 짙어져서 들키는 건 아니겠지…?', risk: { amount: 40, kind: 'excite' } },
            ],
          },
          {
            text: '손목이 궁금하면 더 가까이 와서 봐.',
            affection: { emily: 10 },
            reply: [
              { speaker: 'emily', text: '…정말 내가 가까이 가도 괜찮겠나?', voice: 'ep3/에밀리 호감3' },
              { text: '에밀리가 내 손목을 잡고 천천히 얼굴을 가까이했다. 그 순간 심장이 터질 듯이 뛰기 시작했다.' },
              { speaker: 'player', text: '(잠깐만, 나 지금 무슨 짓을 한 거야!!! 이러다 진짜 들키겠는데?!)', risk: { amount: 60, kind: 'excite' } },
            ],
          },
        ],
      },
      { text: '에밀리가 무언가 더 말하려던 순간, 문 쪽에서 익숙한 목소리가 들렸다.' },

      // 쏟아진 커피
      { speaker: 'siyeong', text: '커피…… 가…… 가져왔어ㅓㅓㅓㅓㅓㅓ!!!', stage: ['minji', 'siyeong', 'emily'], voice: 'ep3/시영9', cg: ep04SiyeongCg },
      { text: '시영이가 문턱에 걸려 넘어지면서 커피를 에밀리한테 부어버렸고, 그 커피가 민지와 나한테도 튀었다.' },
      { speaker: 'minji', text: '아 뜨ㅡ드드드드드거워ㅓ!!!!!!!!', expression: 'surprised_soft', voice: 'ep3/민지8' },
      { text: '에밀리가 정통으로 맞아버려 그 도도하던 에밀리가 그렇게 날뛰는 모습을 처음 봤다. 그냥 막 펄쩍펄쩍하고 뛰는 게 개웃겼다.', cg: ep04EmilyCg },
      { speaker: 'emily', text: '아 뜨거워!!! 야, 서시영! 너 지금 뭐 하는 거야!!!', voice: 'ep3/에밀리13' },
      { speaker: 'siyeong', text: '아… 아… 죄, 죄송해요…… 일부러 그런 게 아니라……', voice: 'ep3/시영10', cg: null },
      { speaker: 'emily', text: '너 지난번 술자리에서도 그러더니!!!', voice: 'ep3/에밀리14' },
      { text: '에밀리는 뜨거움이 가신 뒤에 시영이의 귓방망이를 개 세게 때렸다.' },
      { speaker: 'siyeong', text: '아……', voice: 'ep3/시영11' },
      { speaker: 'emily', text: '감히……? 내가 피부에 화상이라도 입었으면 어쩌려고! 진짜 미친 건가?!', voice: 'ep3/에밀리15' },
      { text: '에밀리가 또 때리려고 하는 걸 내가 가서 간신히 막았다.' },
      { speaker: 'player', text: '일부러 한 거 아니니까 거기까지만 하자.' },
      { text: '에밀리는 억울하다는 듯이 나를 바라봤다.' },
      { speaker: 'emily', text: '아니 얘가 한 짓을 봐. 내 얼굴이 이렇게 화상을 입었을지도 모르는데……', voice: 'ep3/에밀리16 봐로 변경' },
      { text: '에밀리는 갑자기 눈물을 보이면서 그냥 가버렸다.', stage: ['minji', 'siyeong'] },
      { speaker: 'player', text: '(아, 많이 밉보인 것 같은데…… 어쩌지……)' },
      { speaker: 'minji', text: '에휴, 저 싸가지. 아주 꼴이 좋아. 시영아 잘했어! 셔츠 세탁비는 청구할게.', expression: 'smile', voice: 'ep3/민지9' },
      { speaker: 'player', text: '민지……야, 제발 눈치 좀……' },
      { speaker: 'minji', text: '아니, 할 건 해야지!!!', expression: 'less', voice: 'ep3/민지10' },
      { text: '시영이는 뺨을 맞은 그 상태에서 울먹거리고 있었다.' },
      { speaker: 'siyeong', text: '히그히극… 제가 하는 일 다 이런 식으로 되고… 잘하는 것도 없고… 흑흐그흐엉…', voice: 'ep3/시영12' },
      { speaker: 'player', text: '아냐, 시영이 과탑이잖아. 에밀리도 순간적으로 화나서 그랬을 거야.' },
      { speaker: 'player', text: '너무 걱정하지 말고 표정 풀어. 공부 다시 하자. 나 모르는 부분들이 너무 많더라.' },
      { speaker: 'minji', text: '어! 내가, 내가, 내가 알려줄게!!!!', expression: 'bigsmile', voice: 'ep3/민지11' },
      { text: '민지도 신나서 따라붙었다. 민지의 책을 다시 내 쪽으로 당겨 같이 문제를 보기 시작했다.' },

      // 다시 함께 공부하기
      { text: '그러던 중 에밀리가 다시 돌아왔다. 가방을 두고 갔던 것이다.', stage: ['minji', 'siyeong', 'emily'] },
      { text: '우리가 다 쳐다보니까 에밀리도 미안했는지 시영이에게 말했다.' },
      { speaker: 'emily', text: '시영아… 미안하다.', voice: 'ep3/에밀리17' },
      { speaker: 'siyeong', text: '아니에요… 저도 일부러 그런 건 아니었지만… 죄송해요.', voice: 'ep3/시영13' },
      { text: '나도 그 모습을 보고 안쓰러워서 에밀리에게 말했다.' },
      { speaker: 'player', text: '다시 앉아, 에밀리. 다 같이 다시 공부하자.' },
      { speaker: 'minji', text: '응응, 앉아라 왕싸가지. 뭐 혼자 집 가서 할 것도 없잖아.', expression: 'smile', voice: 'ep3/민지12' },
      { speaker: 'emily', text: '흥, 그렇도록 하지. 내가 미안하니까 이번 기말고사가 끝나면 우리 가문의 전용 워터파크에 초대해주지……', voice: 'ep3/에밀리18' },
      { speaker: 'minji', text: '워터파크?! 진짜?!', expression: 'bigsmile', voice: 'ep3/민지13' },
      { speaker: 'siyeong', text: '{name}(이)랑… 같이 가는 거야…?', voice: 'ep3/시영14' },
      { speaker: 'player', text: '워터파크라니, 갑자기?!' },
      { name: '다 같이', text: '야호ㅗㅗㅗ 너무 좋아ㅏㅏㅏ!!!', voice: ['ep3/에밀리19', 'ep3/시영15'] },
      { text: '이렇게 기말고사 공부를 하다가 갑자기 워터파크까지 가게 되었다.', hidePortrait: true },
      { speaker: 'player', text: '(근데 우리… 오늘 공부는 얼마나 한 거지?)' },
    ],
  },
  // EP 4. 워터파크 (여름방학)
  7: {
    id: 'month-7',
    title: '에밀리 가문의 워터파크',
    icon: '🌊',
    time: '낮',
    lines: [
      { text: '오늘은 에밀리 가문 전용의 워터파크를 가기로 한 날이다.', background: roomImg },
      { speaker: 'player', text: '(내가 여자랑 워터파크를 가다니…… 그것도 여자 3명이랑…… 이게 대체 무슨 복이란 말인가.)' },
      { text: '뱀파이어라는 점을 제외하고는 일반 사람과 똑같아서 이제는 별다른 느낌이 들지 않는다.' },
      { text: '근데 오늘은 비키니 볼 생각에 벌써 흥분되기 시작했다. 하, 오늘은 진짜 조심해야 하는데.' },
      { text: '내가 흥분하면 심장이 빨리 뛰고 피도 빠르게 돌아서 피 냄새가 짙어진다. 냄새를 들키면 큰일이니까 최대한 진정하자.' },
      { text: '에밀리의 워터파크는 그냥 다른 느낌이었다. 실내에 바다를 그대로 옮겨 놓은 듯한 커다란 파도풀이 있었다.' },
      { speaker: 'player', text: '(나는 또 피로 되어 있는 워터파크인 줄 알고 좀 많이 놀랐네.)' },

      // 워터파크에 도착
      { speaker: 'minji', text: '야, 뭐해ㅐㅐㅐ. {name}, 빨리 바지 안 벗어? 내가 벗긴다?', expression: 'bigsmile' },
      { speaker: 'emily', text: '아, 벌써 현기증이 날 것 같군. {name}만 초대하는 건데.', stage: ['minji', 'emily'] },
      { speaker: 'siyeong', text: '제, 제가 벗길래요!', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'player', text: '진짜 뭐라는 거야.' },
      { text: '나는 뒤를 돌아봤다.' },
      { speaker: 'player', text: '헉.' },
      // TODO(CG): 여자 세 명의 비키니 샷 (준비되면 일러스트로 교체)
      { text: '에밀리는 도도하게 서 있고, 민지는 당당하게 웃고 있다. 시영이는 얼굴을 붉힌 채 나를 바라본다.' },
      { speaker: 'player', text: '(셋 다 비키니잖아…… 아니, 다 너무 예쁜데? 나 이거 눈을 어디다 둬야 하는 거야?!)' },
      { speaker: 'player', text: '(아, 보지 말아야 하는데 눈이 자꾸 간다…….)' },
      // 위험 상황 ① 수영복을 처음 보고 당황
      { text: '순간 얼굴이 조금 뜨거워졌다. 놀란 건 맞지만 아직은 괜찮겠지……?', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'emily', text: '{name}. 왜 그렇게 빤히 보는 건가? 내 비키니가 그렇게 잘 어울리나?', cg: ep05Emily1Cg },
      { speaker: 'player', text: '어…… 응. 진짜 잘 어울려.' },
      { text: '에밀리가 잠시 시선을 피했다가 다시 나를 본다.' },
      { speaker: 'emily', text: '흥. 그런 건 굳이 말하지 않아도 알지만.', affection: { emily: 5 } },
      { text: '나는 괜히 더 쳐다봤다가 들킬까 봐 한 번 숨을 고르고 고개를 돌렸다.', cg: null },
      { speaker: 'minji', text: '얘 뭐 해, 갑자기. 이 누님의 모습을 제대로 봐 둬야지. 인생에 한 번밖에 없는 기회라고.', expression: 'smile' },
      { speaker: 'minji', text: '아니면 나랑 사귀면 몇 번 더 추가될 수도 있고.', expression: 'shy_smile' },
      { speaker: 'siyeong', text: '저랑 사귀면 더한 것도 보여 줄 수 있어요!!!' },
      { speaker: 'emily', text: '어…… 얘가 대체 무슨 말이람!??? 좀 다 닥쳐. 상스러우니까.' },
      { speaker: 'player', text: '(뱀파이어 학교 만세! 대만세! 조상님 감사합니다ㅠㅠㅠㅠ……)' },
      // 위험 상황 ② 두 사람의 장난에 당황
      { text: '아니, 이러면 안 되는데. 방금 말에 또 조금 흥분해 버렸다.', risk: { amount: 10, kind: 'excite' } },

      // 민지와 파도풀
      { text: '민지가 먼저 파도풀에 뛰어들었다가 물가로 올라온다. 젖은 머리카락을 뒤로 넘기자 어깨에 물방울이 맺힌다.', stage: ['minji'], cg: ep05MinjiCg },
      { speaker: 'player', text: '(물에 젖은 민지를 보니까 평소랑 또 다른 느낌이었다. 아…… 진짜 심장 좀 진정해라.)' },
      { text: '그때 파도가 한 번 더 밀려와 민지가 발을 헛디뎠다. 옆에 있던 나를 잡으면서 민지의 허벅지가 내 다리에 살짝 스쳤다.', cg: null },
      { speaker: 'minji', text: '으악! 야, 이건 내가 일부러 그런 거 아니거든?!', expression: 'surprised_soft' },
      { speaker: 'player', text: '아, 알아! 너 괜찮아?' },
      { text: '민지는 내 팔을 잡고 일어서더니 내 얼굴을 빤히 봤다.' },
      // 선택지 1. 민지에게 대답하기 (고른 위험도 하나만 적용)
      {
        speaker: 'minji',
        text: '{name}, 왜 그렇게 봐? 내 수영복 예뻐?',
        expression: 'shy_smile',
        choices: [
          {
            text: '일단 안 다쳐서 다행이다. 미끄러우니까 조심해.',
            affection: {},
            reply: [
              { text: '나는 민지가 균형을 잡은 걸 확인하고 자연스럽게 한 걸음 물러섰다.' },
              { speaker: 'minji', text: '에이, 걱정하는 거야? 나 생각보다 튼튼해!', expression: 'smile' },
            ],
          },
          {
            text: '어…… 응. 잘 어울려.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '그렇게 볼 거면 그냥 예쁘다고 말하지~', expression: 'smile' },
              { text: '민지가 웃으면서 더 다가오자 나도 모르게 얼굴이 조금 빨개졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '너무 예뻐서 계속 쳐다보게 돼.',
            affection: { minji: 10 },
            reply: [
              { speaker: 'minji', text: '뭐야, 오늘 왜 이렇게 솔직해? 너 자꾸 그러면 나 설레는데?', expression: 'shy_smile' },
              { text: '민지랑 계속 가까이 있으니 점점 더 두근거렸다. 아, 피 냄새가 짙어지면 안 되는데…….', risk: { amount: 20, kind: 'excite' } },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '들떠서 소란 피우지 마라. 쯧쯧.', stage: ['minji', 'emily'] },
      { speaker: 'minji', text: '왜? 너도 {name}이(가) 봐 줬으면 좋겠어?', expression: 'smile' },
      { speaker: 'emily', text: '뭐? 야, 말 조심해.' },

      // 시영의 수건
      { text: '파도풀 옆에는 네 사람의 수건이 놓여 있다. 그 옆에는 물놀이 중 다칠 때 쓸 수 있는 간이 구급함도 있었다.', hidePortrait: true },
      { text: '시영이 수건 옆에서 조심스럽게 나를 불렀다.' },
      { speaker: 'siyeong', text: '저…… {name}. 내 수영복은…… 어때?', cg: ep05SiyeongCg },
      { speaker: 'player', text: '어? 응, 시영이도 진짜 잘 어울려. 예뻐.' },
      { text: '시영이 얼굴을 붉히며 수건을 살짝 끌어당긴다.' },
      { speaker: 'siyeong', text: '그, 그렇게 쳐다보니까 부끄러워요…… 그래도 {name}한테는 계속 보여 주고 싶어.', affection: { siyeong: 5 } },
      // 위험 상황 ③ 시영과의 대화
      { speaker: 'player', text: '(아까는 더한 것도 보여 줄 수 있다더니…… 이렇게 부끄러워하니까 또 귀엽네…….)', risk: { amount: 10, kind: 'excite' } },

      // 파도풀의 소동
      { speaker: 'minji', text: 'ㅋㅋㅋ 우리 {name} 놀리는 재미가 있네. 뭐 해, 시영아?', expression: 'bigsmile', stage: ['minji', 'siyeong', 'emily'], cg: null },
      { text: '민지가 시영에게 눈치를 준다. 둘은 에밀리의 양옆으로 다가갔다.' },
      { speaker: 'siyeong', text: '지, 진짜로 하는 건가요……?' },
      { speaker: 'minji', text: '당연하지. 내가 다리 할게.', expression: 'smile' },
      { text: '민지가 에밀리의 무릎을 차 무릎을 꿇리고 다리를 잡았다.' },
      { speaker: 'minji', text: '시영, 뭐 해!!!', expression: 'bigsmile' },
      { speaker: 'siyeong', text: '오, 오!!!!' },
      { text: '시영이 에밀리의 손을 잡는다.' },
      { name: '민지·시영', text: '하나, 둘, 셋!!!!' },
      { text: '그냥 파도풀에 던지는 장난이었지만 에밀리는 굉장히 과장되게 멀리멀리 날아갔다. 무슨 사람을 공 던지듯이……?' },
      { text: '에밀리는 저 멀리 떨어진 뒤 사람을 죽일 듯한 표정으로 접영을 하며 헤엄쳐 왔다.' },
      { text: '그런데 파도풀 가장자리에 닿을 때 물에 휩쓸린 비키니 끈이 풀려버렸다. 에밀리는 깜짝 놀라 수영복을 붙잡았다.' },
      { speaker: 'emily', text: '꺄악! 야, 송민지! 너 때문에 끈 풀렸잖아! 미친 거 아니야?!' },
      { speaker: 'emily', text: '{name}, 거기 수건 좀 줘!' },
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
              { speaker: 'emily', text: '…고맙다. 그리고 계속 돌아보지 마!' },
            ],
          },
          {
            text: '너무 놀라 잠깐 그 자리에 굳어 있는다.',
            affection: { emily: -5 },
            reply: [
              { speaker: 'player', text: '어…… 어?!', risk: { amount: 10, kind: 'excite' } },
              { text: '에밀리는 내가 멈춰 있는 사이 직접 수건을 잡아당겨 몸을 감쌌다. 나는 뒤늦게야 고개를 돌렸다.' },
              { speaker: 'emily', text: '수건을 달라고 했잖아! 왜 멀뚱히 서 있어?!' },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '{name}, 넌 돌아보지 마! 너희 둘은 진짜 죽었어!' },
      { speaker: 'minji', text: '음, 저거는 잡히면 진짜 죽일 기세인데?', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'siyeong', text: '……어떡하죠……???????' },

      // 시영이의 손
      { speaker: 'minji', text: '음, 찾았다. 빈틈의 실!! {name}, 시영이 팔 잡아!!!', expression: 'bigsmile' },
      { speaker: 'player', text: '어, 어?' },
      { text: '나도 모르게 시영이의 팔을 잡아 버렸다.' },
      { speaker: 'siyeong', text: '{name}이(가)…… 내 손을……!', stage: ['siyeong'] },
      { text: '시영이 얼굴을 붉힌 채 내 손을 꼭 잡는다.' },
      { speaker: 'siyeong', text: '{name}…… 조금만 더 이렇게 있으면 안 돼?' },
      // 선택지 3. 시영에게 대답하기 (진정하면 위험도 감소)
      {
        text: '시영이 손은 차가운데 내 손은 점점 뜨거워지는 느낌이었다. 아, 또 흥분하면 안 되는데…….',
        choices: [
          {
            text: '잠깐만. 다들 뭐 하려는지부터 들어보자.',
            affection: {},
            reply: [
              { text: '나는 손에 힘을 조금 빼고 숨을 골랐다. 잠깐이나마 진정하니 몸의 열이 가라앉았다.', risk: { amount: -10, kind: 'calm' } },
              { speaker: 'siyeong', text: '응… 그래도 손은 잡고 있어도 돼?' },
            ],
          },
          {
            text: '응, 조금만 더 잡고 있을게.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…? 그럼 조금만 더…ㅎ' },
              { text: '시영이가 기쁜 듯 웃었다. 그 얼굴을 보니 나도 살짝 두근거렸다.' },
            ],
          },
          {
            text: '나도 시영이 손 좀 더 잡고 싶었어.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '{name}도…? 그럼 계속 이렇게 있자…' },
              { text: '시영이가 내 쪽으로 바짝 다가왔다. 가까이서 손을 잡고 있으니 점점 흥분이 됐다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '잘했어!! 에밀리 맞추는 거야!!!', expression: 'bigsmile', stage: ['minji', 'siyeong'] },
      { speaker: 'player', text: '…? 뭐라고?' },
      { speaker: 'siyeong', text: '네??' },
      { speaker: 'minji', text: '하나, 셋!!!', expression: 'bigsmile' },
      { text: '시영이 에밀리 쪽으로 날아가며 물보라가 일어난다.' },
      { speaker: 'siyeong', text: '꺄아아아악!!' },
      { speaker: 'emily', text: '야! 너희 진짜 미친 거 아니야?!', stage: ['minji', 'siyeong', 'emily'] },
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
              { speaker: 'minji', text: '{name}, 갑자기 어디 가?', expression: 'surprised_soft' },
              { speaker: 'player', text: '아, 아니! 나 잠깐 수건 좀 쓰려고!' },
            ],
          },
          {
            text: '“이 정도는 괜찮겠지.” 하고 상처를 그대로 둔다.',
            affection: {},
            reply: [
              { text: '별일 아닐 거라 생각했는데 물기 사이로 피가 더 번졌다. 그제야 나는 놀라서 수건으로 손을 감쌌다.', risk: { amount: 40, kind: 'bleed' } },
              { speaker: 'siyeong', text: '{name}…? 여기서 나는 이 냄새…' },
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
      { speaker: 'minji', text: '어…? 잠깐만. 이거 무슨 냄새야?', expression: 'surprised_soft', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'siyeong', text: '{name}한테서… 인간의 피 냄새가 나요…' },
      { speaker: 'emily', text: '설마… 네가 인간이었다고?' },
      { text: '피 냄새를 맡은 세 사람의 시선이 동시에 나를 향했다. 이미 너무 늦었다.' },
      { text: '에밀리가 부르자 멀리 있던 가문의 직원들이 다가왔다. 나는 빠져나갈 틈도 없이 그 자리에서 붙잡혔다.', hidePortrait: true },
      { text: '결국 즐거울 줄만 알았던 워터파크에서 정체를 들키고 죽었다.' },
      { name: 'BAD END', text: '피 냄새가 퍼진 워터파크' },
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
      text: '저, 저기…! {name} 씨, 이번 달은… 어떠셨어요?',
      choices: [
        {
          text: '정신없었지만 조금 성장한 것 같아.',
          affection: { siyeong: 10 },
          reply: [{ speaker: 'siyeong', text: '그쵸…! 저 다 봤어요. {name} 씨 요즘 진짜 열심히 하는 거.' }],
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

// 데이트 에피소드 (히로인별 순서대로)
export const DATE_EPISODES: Record<Heroine, Episode[]> = {
  // 첫 만남(4월) → 9~11월 히로인 선택 데이트: 기획 고민 → 축제의 질투 → 모교 타임캡슐
  minji: [
    {
      id: 'date-minji-1',
      title: '대학 와서도 너냐?',
      illust: minji1Img,
      background: campusSpringImg,
      time: '오후',
      lines: [
        // SCENE 1. 익숙한 얼굴 — 캠퍼스
        { text: '개강총회 다음 날. {name}은(는) 강의실을 찾기 위해 캠퍼스를 걷고 있다.' },
        { text: '그때 뒤에서 누군가 {name}의 어깨를 툭 친다.' },
        { speaker: 'minji', text: '야! {name}!', expression: 'bigsmile' },
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

        // SCENE 2. 대학 생활의 시작 — 강의실
        { text: '두 사람은 강의실에 도착해 나란히 앉는다.', background: classroomImg },
        { speaker: 'minji', text: '야, 근데 어제 개총 재밌지 않았냐?', expression: 'smile' },
        { speaker: 'player', text: '응. 생각보다 사람 많더라.' },
        { speaker: 'minji', text: '그치? 나 벌써 친해진 애들도 있어.', expression: 'smile' },
        { speaker: 'player', text: '역시 빠르네.' },
        { speaker: 'minji', text: '당연하지. 대학 왔으면 친구 많이 사귀어야지!', expression: 'bigsmile' },
        { text: '민지는 주변을 둘러보다가 {name}에게 장난스럽게 묻는다.' },
        { speaker: 'minji', text: '야, 너 대학 와서 제일 하고 싶은 게 뭐냐?', expression: 'smile' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'minji', text: '그냥! 연애든 동아리든 뭐든 있을 거 아냐.' },
        { speaker: 'player', text: '넌?' },
        { speaker: 'minji', text: '난 일단 재밌게 놀고 싶어. 그리고 게임도 제대로 만들어 보고 싶고.', expression: 'smile' },
        { speaker: 'player', text: '고등학교 때랑 똑같네.' },
        {
          speaker: 'minji',
          text: '야, 꿈이 한결같은 게 좋은 거지!',
          expression: 'bigsmile',
          choices: [
            {
              text: '너랑 게임 하나 제대로 만들어 보고 싶어.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '…나랑?', expression: 'surprised_soft' },
                { speaker: 'player', text: '응. 고등학교 때 못 만들었잖아.' },
                { speaker: 'minji', text: '오, 좋아! 이번엔 진짜 완성하는 거다?', expression: 'bigsmile' },
              ],
            },
            {
              text: '일단 대학 생활에 적응하는 게 먼저지.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: 'ㅋㅋㅋ 너답다.', expression: 'smile' },
                { speaker: 'player', text: '아직 모르는 게 많으니까.' },
                { speaker: 'minji', text: '그럼 이 누나가 대학 생활 좀 알려줄게!', expression: 'bigsmile' },
              ],
            },
            {
              text: '아직 딱히 생각 안 해봤어.',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '에이, 재미없게!', expression: 'less' },
                { speaker: 'player', text: '이제 입학했잖아.' },
                { speaker: 'minji', text: '그럼 이 누나가 재밌는 곳에 많이 데려가 줄게.', expression: 'smile' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '수업이 시작되기 전, 민지는 {name}의 팔을 툭 친다.' },
        { speaker: 'minji', text: '야, 우리 대학에서도 잘 지내보자.', expression: 'smile' },
        { speaker: 'player', text: '갑자기 왜?' },
        { speaker: 'minji', text: '그냥. 아는 사람이 너밖에 없는 건 아니지만….' },
        { speaker: 'player', text: '응.' },
        { speaker: 'minji', text: '그래도 네가 있으니까 좀 든든하긴 하네.', expression: 'shy_smile' },
        { speaker: 'player', text: '나도.' },
        { speaker: 'minji', text: '…….', expression: 'surprised_soft' },
        { speaker: 'minji', text: '야! 그런 건 좀 장난스럽게 받아쳐야지!', expression: 'shy_smile' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'minji', text: '아, 몰라! 수업이나 들어!', expression: 'shy_smile' },
        { text: '민지는 웃으며 앞을 바라본다.' },
        { speaker: 'minji', text: '(대학 와서도 얘랑 같이 다니게 될 줄이야. 뭐… 나쁘진 않네.)', expression: 'smile' },
      ],
    },
    {
      id: 'date-minji-2',
      title: '네가 제일 잘 알잖아',
      illust: minji2Img,
      background: classroomImg,
      time: '오후',
      lines: [
        // SCENE 1. 기획 발표의 위기 — 강의실
        { text: '게임 기획 수업이 끝난 강의실. 민지는 발표 자료를 바라보며 한숨을 쉬고 있다.' },
        { speaker: 'player', text: '송민지, 안 가?' },
        { speaker: 'minji', text: '야, 나 지금 심각하거든?', expression: 'less' },
        { speaker: 'player', text: '왜? 발표 망했어?' },
        { speaker: 'minji', text: '아니! 망한 건 아닌데….', expression: 'less' },
        { text: '민지는 노트북 화면을 {name}에게 보여준다.' },
        { speaker: 'minji', text: '교수님이 내 기획서 보고 아이디어는 좋은데 구체성이 부족하대.', expression: 'less' },
        { speaker: 'player', text: '틀린 말은 아니네.' },
        { speaker: 'minji', text: '야! 친구면 위로부터 해야 하는 거 아니냐?', expression: 'less' },
        { speaker: 'player', text: '그럼 잘했어.' },
        { speaker: 'minji', text: '아, 진짜 킹받네!', expression: 'less' },
        { text: '민지는 책상에 엎드린다.' },
        { speaker: 'minji', text: '하아… 나 게임 기획이랑 안 맞나?', expression: 'less' },
        { speaker: 'player', text: '갑자기?' },
        {
          speaker: 'minji',
          text: '너도 알잖아. 난 맨날 아이디어만 많고 정리는 못 하잖아.',
          expression: 'less',
          choices: [
            {
              text: '근데 네 아이디어 덕분에 시작한 것도 많잖아.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '…뭐야. 갑자기 칭찬?', expression: 'surprised_soft' },
                { speaker: 'player', text: '고등학교 때도 네가 먼저 하자고 했잖아.' },
                { speaker: 'minji', text: '…그걸 아직도 기억하네?', expression: 'shy_smile' },
              ],
            },
            {
              text: '연습하면 늘겠지. 처음부터 잘하는 사람이 어딨어.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '그렇긴 한데….' },
                { speaker: 'player', text: '아직 1학년이잖아.' },
                { speaker: 'minji', text: '하긴. 벌써 포기하기엔 좀 이르지?', expression: 'smile' },
              ],
            },
            {
              text: '교수님 말대로 좀 더 구체적으로 써봐.',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '야, 그걸 몰라서 이러겠냐?', expression: 'less' },
                { speaker: 'player', text: '일단 부족한 부분부터 고쳐야지.' },
                { speaker: 'minji', text: '하아… 넌 진짜 현실적이다.', expression: 'less' },
              ],
            },
          ],
        },

        // SCENE 2. 오래된 기억
        { text: '민지는 기획서를 수정하다가 {name}을(를) 바라본다.' },
        { speaker: 'minji', text: '야, 근데 너 기억나?' },
        { speaker: 'player', text: '뭐?' },
        { speaker: 'minji', text: '고등학교 때 내가 게임 만들겠다고 난리 쳤던 거.', expression: 'smile' },
        { speaker: 'player', text: '기억나지. 쉬는 시간마다 떠들었잖아.' },
        { speaker: 'minji', text: 'ㅋㅋㅋ 그땐 진짜 뭐든 만들 수 있을 줄 알았는데.', expression: 'bigsmile' },
        { speaker: 'player', text: '지금도 만들 수 있잖아.' },
        { speaker: 'minji', text: '…그렇게 쉽게 말하냐?', expression: 'surprised_soft' },
        { speaker: 'player', text: '네가 포기만 안 하면.' },
        { text: '민지는 잠시 {name}을(를) 바라본다.' },
        { speaker: 'minji', text: '…야. 너 가끔 그런 말 하면 좀 멋있는 거 알아?', expression: 'shy_smile' },
        { speaker: 'player', text: '갑자기?' },
        {
          speaker: 'minji',
          text: '아, 됐어! 못 들은 걸로 해!',
          expression: 'shy_smile',
          choices: [
            {
              text: '너도 가끔 멋있어. 진지하게 할 때.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '……뭐?', expression: 'surprised_soft' },
                { speaker: 'player', text: '아까 발표할 때도 그렇고.' },
                { speaker: 'minji', text: '…야, 그런 말 갑자기 하지 마.', expression: 'shy_smile' },
              ],
            },
            {
              text: '칭찬 고맙다.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: 'ㅋㅋㅋ 아, 진짜.', expression: 'bigsmile' },
                { speaker: 'player', text: '왜?' },
                { speaker: 'minji', text: '너는 부끄러운 것도 없냐?', expression: 'smile' },
              ],
            },
            {
              text: '뭐 잘못 먹었어?',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '야! 내가 칭찬을 못 해!', expression: 'less' },
                { speaker: 'player', text: '평소랑 달라서.' },
                { speaker: 'minji', text: '하아… 다시는 안 한다.', expression: 'less' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '민지는 노트북을 닫으며 자리에서 일어난다.' },
        { speaker: 'minji', text: '야, 나 배고파. 밥 먹으러 가자.', expression: 'smile' },
        { speaker: 'player', text: '기획서 수정은?' },
        { speaker: 'minji', text: '밥 먹고 할 거야!', expression: 'bigsmile' },
        { speaker: 'player', text: '그래. 뭐 먹을래?' },
        { speaker: 'minji', text: '학식! 오늘 돈 없어.', expression: 'smile' },
        { text: '두 사람은 강의실을 나선다.' },
        { speaker: 'minji', text: '야, {name}.' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'minji', text: '아까 해준 말… 고마웠다.', expression: 'shy_smile' },
        { speaker: 'player', text: '뭘.' },
        { speaker: 'minji', text: '아, 두 번 말하게 하지 마!', expression: 'shy_smile' },
        { text: '민지는 {name}의 등을 가볍게 툭 친다.' },
        { speaker: 'minji', text: '(…역시 얘는 내가 무슨 생각 하는지 잘 안다니까.)', expression: 'smile' },
      ],
    },
    // 축제 배경 이미지가 생기면 바꾸기
    {
      id: 'date-minji-3',
      title: '친구라며, 왜 신경 쓰이는데?',
      illust: minji3Img,
      background: campusSpringImg,
      time: '저녁',
      lines: [
        // SCENE 1. 예상치 못한 질투 — 축제 먹거리 부스
        { text: '축제로 북적이는 캠퍼스.' },
        { text: '민지는 {name}와(과) 만나기로 한 먹거리 부스 앞에서 기다리고 있다.' },
        { speaker: 'minji', text: '아, 얘 왜 이렇게 안 와?', expression: 'less' },
        { text: '그때 멀리서 {name}이(가) 다른 여학생과 함께 걸어오는 모습이 보인다.', hidePortrait: true },
        { name: '지아', text: '아까 도와줘서 고마워! 다음에 밥 살게!' },
        { speaker: 'player', text: '괜찮아. 별거 아니었어.' },
        { text: '여학생은 {name}에게 손을 흔들고 떠난다.' },
        { text: '민지는 팔짱을 낀 채 {name}을(를) 바라본다.' },
        { speaker: 'minji', text: '오~ 뭐야? 인기 많네?', expression: 'smile' },
        { speaker: 'player', text: '어, 민지야. 기다렸어?' },
        { speaker: 'minji', text: '아니거든? 방금 왔거든?', expression: 'less' },
        { speaker: 'player', text: '근데 왜 화났어?' },
        { speaker: 'minji', text: '누가 화났대?!', expression: 'less' },
        { speaker: 'player', text: '그럼 다행이고.' },
        { speaker: 'minji', text: '…야, 아까 걔 누구야?', expression: 'less' },
        { speaker: 'player', text: '같은 수업 듣는 애.' },
        {
          speaker: 'minji',
          text: '친해?',
          expression: 'less',
          choices: [
            {
              text: '질투하는거야?',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '뭐?! 내가 왜!', expression: 'shy_smile' },
                { speaker: 'player', text: '그냥 궁금해서.' },
                { speaker: 'minji', text: '아, 진짜! 너 놀리는 거지?!', expression: 'shy_smile' },
              ],
            },
            {
              text: '그냥 같은 수업 듣는 친구야.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '아~ 그래?', expression: 'surprised_soft' },
                { speaker: 'player', text: '응. 과제 때문에 잠깐 이야기했어.' },
                { speaker: 'minji', text: '흠. 그렇구만.', expression: 'smile' },
              ],
            },
            {
              text: '그건 왜 물어봐?',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '그냥 궁금해서!', expression: 'less' },
                { speaker: 'player', text: '별로 안 친해.' },
                { speaker: 'minji', text: '아, 알았어! 누가 뭐래?', expression: 'less' },
              ],
            },
          ],
        },

        // SCENE 2. 뜻밖의 한마디
        { text: '두 사람은 먹거리 부스를 돌아다니다가 닭꼬치를 하나씩 구매한다.' },
        { speaker: 'minji', text: '야, 이거 진짜 맛있다.', expression: 'bigsmile' },
        { speaker: 'player', text: '그러게.' },
        { speaker: 'minji', text: '근데 아까 걔 예쁘더라?', expression: 'less' },
        { speaker: 'player', text: '누구?' },
        { speaker: 'minji', text: '아까 너랑 같이 있던 애!', expression: 'less' },
        { speaker: 'player', text: '아.' },
        { speaker: 'minji', text: '뭐… 썸 타는 사람이야..?', expression: 'less' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'minji', text: '그냥 궁금해서!', expression: 'less' },
        { text: '{name}은(는) 민지를 바라본다.' },
        { speaker: 'player', text: '너 오늘 왜 이렇게 궁금한 게 많아?' },
        {
          speaker: 'minji',
          text: '아, 대답이나 해!',
          expression: 'less',
          choices: [
            {
              text: '너가 더 이뻐',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '……뭐?', expression: 'surprised_soft' },
                { speaker: 'player', text: '내 눈에는 너가 더 이쁘다고' },
                { speaker: 'minji', text: '야… 너는! 그런 말을 뭐 그렇게 쉽게.. 하냐!!', expression: 'shy_smile' },
              ],
            },
            {
              text: '그냥 같은 과 친구라니까.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '알았어, 알았어!', expression: 'smile' },
                { speaker: 'player', text: '왜 이렇게 신경 써?' },
                { speaker: 'minji', text: '신경 안 쓰거든?!', expression: 'less' },
              ],
            },
            {
              text: '흠. 이쁜 얼굴이지',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '…….', expression: 'less' },
                { speaker: 'player', text: '왜?' },
                { speaker: 'minji', text: '아니! 아무것도 아니야!', expression: 'less' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '축제 공연이 시작되자 사람들이 무대 앞으로 모여든다.' },
        { speaker: 'player', text: '저쪽 가볼까?' },
        { speaker: 'minji', text: '…그래.' },
        { text: '두 사람은 나란히 걸어간다.' },
        { speaker: 'player', text: '민지야.' },
        { speaker: 'minji', text: '왜?' },
        { speaker: 'player', text: '너 오늘 좀 이상한데?' },
        { speaker: 'minji', text: '야! 나 원래 이렇거든?', expression: 'less' },
        { speaker: 'player', text: '평소보다 조용해서.' },
        { speaker: 'minji', text: '…….', expression: 'less' },
        { speaker: 'minji', text: '그럼 시끄럽게 해줘?', expression: 'smile' },
        { speaker: 'player', text: '그건 좀.' },
        { speaker: 'minji', text: 'ㅋㅋㅋ 아, 진짜!', expression: 'bigsmile' },
        { text: '민지는 {name}의 어깨를 툭 친다.' },
        { text: '잠시 후 민지는 {name}의 옆모습을 바라본다.' },
        { speaker: 'minji', text: '(…친구잖아. 근데 왜 다른 여자랑 있는 게 이렇게 신경 쓰이지?)', expression: 'less' },
      ],
    },
    {
      id: 'date-minji-4',
      title: '우리 학교에 다시 갈래?',
      illust: minji4Img,
      background: clubRoomImg,
      time: '오후',
      lines: [
        // SCENE 1. 발견한 사진 — 동아리방
        { text: '게임 제작 동아리에서 프로젝트 회의가 끝난 오후.' },
        { text: '민지는 휴대폰으로 오래된 사진을 보며 혼자 웃고 있다.' },
        { speaker: 'minji', text: 'ㅋㅋㅋ 야, 이거 봐!', expression: 'bigsmile' },
        { speaker: 'player', text: '뭔데?' },
        { speaker: 'minji', text: '우리 고등학교 때 사진!', expression: 'bigsmile' },
        { text: '민지는 휴대폰을 {name}에게 보여준다.' },
        { text: '사진 속에는 교복을 입은 두 사람이 장난스러운 표정을 짓고 있다.' },
        { speaker: 'player', text: '와, 이거 언제야?' },
        { speaker: 'minji', text: '고3 때! 졸업하기 전에 찍은 거.', expression: 'smile' },
        { speaker: 'player', text: '너 표정 왜 저래?' },
        { speaker: 'minji', text: '야! 너도 만만치 않거든?', expression: 'less' },
        { text: '두 사람은 사진을 보며 웃는다.' },
        { speaker: 'minji', text: '아, 진짜 그때 재밌었는데.', expression: 'smile' },
        { speaker: 'player', text: '그러게.' },
        { speaker: 'minji', text: '야, 근데 너 기억나?' },
        { speaker: 'player', text: '뭐?' },
        { speaker: 'minji', text: '우리 학교 운동장 뒤에 묻어 둔 타임캡슐!', expression: 'bigsmile' },
        { speaker: 'player', text: '아, 그거.' },
        {
          speaker: 'minji',
          text: '우리 졸업하고 나중에 같이 열어보기로 했잖아.',
          expression: 'smile',
          choices: [
            {
              text: '기억하지. 너랑 한 약속인데.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '……뭐야.', expression: 'surprised_soft' },
                { speaker: 'player', text: '왜?' },
                { speaker: 'minji', text: '아니… 그런 말 좀 아무렇지 않게 하지 마!', expression: 'shy_smile' },
              ],
            },
            {
              text: '응. 아직도 거기 있으려나?',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '그러게. 누가 파간 건 아니겠지?' },
                { speaker: 'player', text: '한번 확인해 봐야겠네.' },
                { speaker: 'minji', text: 'ㅋㅋㅋ 진짜 없어졌으면 웃기겠다.', expression: 'bigsmile' },
              ],
            },
            {
              text: '그런 것도 있었나?',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '야! 그걸 까먹었다고?!', expression: 'surprised_soft' },
                { speaker: 'player', text: '오래됐잖아.' },
                { speaker: 'minji', text: '아오, 진짜! 내가 기억하고 있으니까 됐어.', expression: 'less' },
              ],
            },
          ],
        },

        // SCENE 2. 민지의 제안
        { text: '민지는 사진을 넘기다가 잠시 손을 멈춘다.' },
        { speaker: 'minji', text: '야, 우리 이번 주 토요일에 시간 되냐?' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'minji', text: '모교 한번 가보자.', expression: 'smile' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'minji', text: '타임캡슐도 확인하고, 오랜만에 학교도 구경하고.', expression: 'smile' },
        { speaker: 'player', text: '괜찮겠네.' },
        { speaker: 'minji', text: '그치? 그리고 우리 맨날 학교에서만 보잖아.', expression: 'smile' },
        { speaker: 'player', text: '같은 과니까.' },
        { speaker: 'minji', text: '아, 그건 아는데!', expression: 'less' },
        { text: '민지는 잠시 말을 멈추더니 {name}을(를) 바라본다.' },
        { speaker: 'minji', text: '…가끔은 둘이 다른 데도 가보고 싶다고.', expression: 'shy_smile' },
        { speaker: 'player', text: '둘이?' },
        {
          speaker: 'minji',
          text: '왜! 싫냐?',
          expression: 'shy_smile',
          choices: [
            {
              text: '좋아. 너랑 단둘이 가는 것도 오랜만이네.',
              affection: { minji: 2 },
              reply: [
                { speaker: 'minji', text: '……!', expression: 'surprised_soft' },
                { speaker: 'player', text: '고등학교 때는 자주 그랬잖아.' },
                { speaker: 'minji', text: '…그, 그렇지! 오랜만이지!', expression: 'shy_smile' },
              ],
            },
            {
              text: '좋아. 토요일에 같이 가자.',
              affection: { minji: 1 },
              reply: [
                { speaker: 'minji', text: '오케이! 그럼 점심 먹고 만나자.', expression: 'bigsmile' },
                { speaker: 'player', text: '응. 몇 시쯤?' },
                { speaker: 'minji', text: '두 시! 늦지 마라?', expression: 'smile' },
              ],
            },
            {
              text: '모교까지 가는 건 좀 귀찮은데.',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '야! 오랜만인데 같이 좀 가자!', expression: 'less' },
                { speaker: 'player', text: '알았어. 토요일에 가자.' },
                { speaker: 'minji', text: 'ㅋㅋㅋ 역시 넌 내가 잘 안다니까.', expression: 'smile' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '민지는 휴대폰으로 모교 위치를 확인한다.' },
        { speaker: 'minji', text: '야, 근데 우리 학교 진짜 오랜만이다.', expression: 'smile' },
        { speaker: 'player', text: '그러게. 졸업하고 처음인가?' },
        { speaker: 'minji', text: '응. 그때랑 얼마나 달라졌을까?' },
        { speaker: 'player', text: '가보면 알겠지.' },
        { speaker: 'minji', text: 'ㅋㅋㅋ 그것도 그렇네.', expression: 'bigsmile' },
        { text: '민지는 휴대폰을 내려놓고 {name}을(를) 바라본다.' },
        { speaker: 'minji', text: '야, {name}.' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'minji', text: '…우리 고등학교 때로 돌아가면 재밌겠다.', expression: 'smile' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'minji', text: '그냥. 그땐 아무 생각 없이 맨날 같이 놀았잖아.', expression: 'smile' },
        { speaker: 'player', text: '지금도 비슷하지 않아?' },
        { speaker: 'minji', text: '…….', expression: 'surprised_soft' },
        { speaker: 'minji', text: '…그런가?', expression: 'less' },
        { text: '{name}이(가) 짐을 챙기며 자리에서 일어난다.' },
        { speaker: 'player', text: '나 먼저 갈게. 토요일에 봐.' },
        { speaker: 'minji', text: '어! 늦지 마라!', expression: 'smile' },
        { text: '{name}이(가) 떠난 뒤 민지는 오래된 사진을 다시 바라본다.' },
        { speaker: 'minji', text: '(…그때랑 똑같은 줄 알았는데.)', expression: 'less' },
        { speaker: 'minji', text: '(…나만 조금 달라진 건가?)', expression: 'less' },
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
      time: '오후',
      lines: [
        // SCENE 1. 두 번째 만남 — 도서관
        { text: '과제를 하기 위해 도서관을 찾은 {name}. 빈자리를 찾던 중 혼자 노트북을 보고 있는 시영을 발견한다.' },
        { speaker: 'player', text: '어, 서시영?' },
        { speaker: 'siyeong', text: '…아, {name}님. 안녕하세요.' },
        { speaker: 'player', text: '여기 앉아도 돼?' },
        { speaker: 'siyeong', text: '…네. 아무도 없어요.' },
        { text: '{name}이(가) 자리에 앉자 두 사람 사이에 어색한 침묵이 흐른다.' },
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
        { text: '잠시 후, {name}이(가) 노트북으로 과제를 하던 중 화면을 보며 한숨을 쉰다.' },
        { speaker: 'player', text: '아… 왜 안 되지?' },
        { text: '시영은 옆에서 조심스럽게 화면을 바라본다.' },
        { speaker: 'siyeong', text: '…저기.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…괄호가 하나 빠진 것 같아요.' },
        { speaker: 'player', text: '어? 진짜네.' },
        { text: '{name}이(가) 코드를 수정하자 프로그램이 정상적으로 실행된다.' },
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
        { text: '과제를 마친 {name}이(가) 짐을 정리한다.' },
        { speaker: 'player', text: '나 먼저 갈게. 다음에 봐.' },
        { speaker: 'siyeong', text: '…네. 조심히 가세요.' },
        { text: '{name}이(가) 도서관을 나가려는 순간, 시영이 작은 목소리로 부른다.' },
        { speaker: 'siyeong', text: '…{name}님.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…다음에 과제하다 막히시면 말씀해 주세요.' },
        { speaker: 'player', text: '응. 고마워, 시영아.' },
        { text: '{name}이(가) 떠난 뒤 시영은 다시 노트북을 바라본다.' },
        { speaker: 'siyeong', text: '(…생각보다 이야기하기 편한 분이네요.)' },
      ],
    },
    {
      id: 'date-siyeong-2',
      title: '들켜버린 취향',
      illust: siyeong2Img,
      background: corridorImg,
      time: '오후',
      lines: [
        // SCENE 1. 수상한 책 — 학생회관 휴게 공간
        { text: '공강 시간. {name}은(는) 학생회관 구석에서 책을 읽고 있는 시영을 발견한다.' },
        { speaker: 'player', text: '시영아, 여기 있었네.' },
        { speaker: 'siyeong', text: '…{name}님?' },
        { text: '시영은 놀라서 읽고 있던 책을 급하게 덮는다.' },
        { speaker: 'player', text: '뭐 읽고 있었어?' },
        { speaker: 'siyeong', text: '…그냥 책이요.' },
        { speaker: 'player', text: '무슨 책인데?' },
        { speaker: 'siyeong', text: '…별거 아니에요.' },
        { text: '{name}은(는) 책 표지에 적힌 제목을 발견한다.' },
        { speaker: 'player', text: '세계의 기묘한 괴담?' },
        { speaker: 'siyeong', text: '……!' },
        { speaker: 'player', text: '너 이런 거 좋아해?' },
        {
          speaker: 'siyeong',
          text: '…이상하죠…?',
          choices: [
            {
              text: '아니, 재밌어 보이는데? 어떤 이야기야?',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…정말 궁금하세요?' },
                { speaker: 'player', text: '응. 하나만 들려줘.' },
                { speaker: 'siyeong', text: '…그럼 제가 제일 좋아하는 이야기로요.' },
              ],
            },
            {
              text: '괴담 좋아하는구나. 의외네.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…네. 조금요.' },
                { speaker: 'player', text: '몰랐어.' },
                { speaker: 'siyeong', text: '…평소에는 잘 이야기 안 해서요.' },
              ],
            },
            {
              text: '난 그런 거 별로 안 좋아하는데.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 그러시군요.' },
                { speaker: 'player', text: '무서운 이야기는 잘 못 듣겠더라.' },
                { speaker: 'siyeong', text: '…그럼 다른 이야기 할까요?' },
              ],
            },
          ],
        },

        // SCENE 2. 시영의 이야기
        { text: '시영은 책을 펼쳐 한 페이지를 보여준다.' },
        { speaker: 'siyeong', text: '이건 오래된 그림에 관한 괴담인데요.' },
        { speaker: 'player', text: '그림?' },
        { speaker: 'siyeong', text: '네. 전시관에 걸린 그림 속 인물이 매일 조금씩 움직인다는 이야기예요.' },
        { speaker: 'player', text: '오, 그건 좀 무섭네.' },
        { speaker: 'siyeong', text: '…사실 진짜 무서운 건 마지막 부분이에요.' },
        { speaker: 'player', text: '어떻게 끝나는데?' },
        { text: '시영은 잠시 망설이다가 책을 덮는다.' },
        { speaker: 'siyeong', text: '…그건 비밀이에요.' },
        { speaker: 'player', text: '여기까지 말하고?' },
        { speaker: 'siyeong', text: '…궁금하시면 직접 읽어보세요.' },
        {
          text: '시영은 평소보다 조금 장난스러운 표정을 짓는다.',
          choices: [
            {
              text: '그럼 다음에 네가 직접 끝까지 들려줘.',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…제가요?' },
                { speaker: 'player', text: '응. 네가 이야기하니까 더 재밌어.' },
                { speaker: 'siyeong', text: '…그럼 다음 이야기도 준비해 올게요.' },
              ],
            },
            {
              text: '알겠어. 나중에 빌려줘.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…네. 다 읽으면 빌려드릴게요.' },
                { speaker: 'player', text: '고마워.' },
                { speaker: 'siyeong', text: '…재밌게 읽으셨으면 좋겠어요.' },
              ],
            },
            {
              text: '에이, 그냥 인터넷에서 찾아볼게.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 네.' },
                { speaker: 'player', text: '결말 궁금하네.' },
                { speaker: 'siyeong', text: '…스포 조심하세요.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '잠시 후 {name}의 다음 수업 시간이 다가온다.' },
        { speaker: 'player', text: '나 이제 수업 가야겠다.' },
        { speaker: 'siyeong', text: '…아, 벌써 시간이 그렇게 됐네요.' },
        { speaker: 'player', text: '오늘 이야기 재밌었어.' },
        { speaker: 'siyeong', text: '…정말요?' },
        { speaker: 'player', text: '응. 다음에 또 들려줘.' },
        { speaker: 'siyeong', text: '…네. 그럼 다음에는 더 재밌는 이야기로 준비할게요.' },
        { text: '{name}이(가) 떠난 뒤 시영은 책을 품에 안는다.' },
        { speaker: 'siyeong', text: '(…처음이에요. 누군가한테 이런 이야기를 하고 싶어진 건.)' },
      ],
    },
    // 축제 배경 이미지가 생기면 바꾸기
    {
      id: 'date-siyeong-3',
      title: '귀신보다 무서운 건…',
      illust: siyeong3Img,
      background: campusSpringImg,
      time: '저녁',
      lines: [
        // SCENE 1. 축제에서의 만남
        { text: '축제로 북적이는 캠퍼스. {name}은(는) 혼자 부스를 구경하던 시영을 발견한다.' },
        { speaker: 'player', text: '시영아, 혼자야?' },
        { speaker: 'siyeong', text: '…아, {name}님. 네, 잠깐 구경하고 있었어요.' },
        { speaker: 'player', text: '저기 귀신의 집도 있네.' },
        { speaker: 'siyeong', text: '…저도 아까부터 보고 있었어요.' },
        { speaker: 'player', text: '들어가 볼래?' },
        { speaker: 'siyeong', text: '…저랑 같이요?' },
        { speaker: 'player', text: '응. 혼자 들어가는 것보단 재밌잖아.' },
        { speaker: 'siyeong', text: '…그럼 좋아요.' },
        { text: '두 사람은 귀신의 집에 입장한다.' },

        // SCENE 2. 예상 밖의 반응 — 귀신의 집
        { text: '어두운 복도를 걷던 중, 갑자기 귀신 분장을 한 학생이 튀어나온다.' },
        { speaker: 'player', text: '으악!' },
        { speaker: 'siyeong', text: '…….' },
        { text: '놀란 {name}와(과) 달리 시영은 귀신을 유심히 바라본다.' },
        { speaker: 'siyeong', text: '…저 분장, 꽤 잘하셨네요.' },
        { speaker: 'player', text: '…안 놀랐어?' },
        { speaker: 'siyeong', text: '네. 이런 건 익숙해서요.' },
        { speaker: 'player', text: '의외네. 네가 더 무서워할 줄 알았는데.' },
        { speaker: 'siyeong', text: '…저, 공포 게임도 좋아하잖아요.' },
        { text: '그때 또 다른 귀신이 튀어나오자 {name}이(가) 반사적으로 시영의 손을 잡는다.' },
        { speaker: 'player', text: '아, 미안!' },
        { speaker: 'siyeong', text: '……!' },
        {
          text: '시영은 귀신이 아니라 잡힌 손을 내려다본다.',
          choices: [
            {
              text: '괜찮으면 나갈 때까지 잡고 있어도 돼?',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…네?!' },
                { speaker: 'player', text: '나 생각보다 무서워서.' },
                { speaker: 'siyeong', text: '…그, 그럼 꼭 잡고 계세요.' },
              ],
            },
            {
              text: '미안. 놀라서 그랬어.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…아, 아니에요.' },
                { speaker: 'player', text: '괜찮아?' },
                { speaker: 'siyeong', text: '…네. 전 괜찮아요.' },
              ],
            },
            {
              text: '아, 손 잘못 잡았네.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아.' },
                { speaker: 'player', text: '깜짝 놀라서.' },
                { speaker: 'siyeong', text: '…네. 그럴 수 있죠.' },
              ],
            },
          ],
        },

        // SCENE 3. 귀신의 집 탈출
        { text: '두 사람은 마지막 구간에 도착한다.' },
        { text: '갑자기 조명이 꺼지고 귀신의 웃음소리가 울려 퍼진다.' },
        { speaker: 'player', text: '이번엔 또 뭐야….' },
        { speaker: 'siyeong', text: '…{name}님.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…제가 앞장설까요?' },
        { speaker: 'player', text: '괜찮겠어?' },
        { speaker: 'siyeong', text: '…네. 이런 건 자신 있어요.' },
        { text: '시영은 {name}보다 앞서 걷다가 잠시 뒤를 돌아본다.' },
        { speaker: 'siyeong', text: '…그런데.' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'siyeong', text: '…손은 계속 잡고 계셔도 돼요.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…{name}님이 무서우시니까요.' },
        {
          text: '시영은 얼굴이 붉어진 채 다시 앞을 바라본다.',
          choices: [
            {
              text: '응. 네가 옆에 있으니까 안 무섭네.',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '……!' },
                { speaker: 'player', text: '든든한데?' },
                { speaker: 'siyeong', text: '…그럼 앞으로도 제 옆에 계세요.' },
              ],
            },
            {
              text: '고마워. 너 진짜 안 무서워하는구나.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…네. 괴담은 좋아하거든요.' },
                { speaker: 'player', text: '다음에도 같이 오면 되겠다.' },
                { speaker: 'siyeong', text: '…다음에도요? 좋아요.' },
              ],
            },
            {
              text: '이제 괜찮아. 손 놓아도 돼.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 네.' },
                { speaker: 'player', text: '출구도 거의 다 왔고.' },
                { speaker: 'siyeong', text: '…조금 아쉽네요.' },
              ],
            },
          ],
        },

        // SCENE 4. 이벤트 마무리
        { text: '귀신의 집을 빠져나온 두 사람.' },
        { speaker: 'player', text: '생각보다 무서웠네.' },
        { speaker: 'siyeong', text: '…저는 재밌었어요.' },
        { speaker: 'player', text: '역시 이런 거 좋아하는구나.' },
        { speaker: 'siyeong', text: '…네. 특히 오늘은 더요.' },
        { speaker: 'player', text: '왜?' },
        { text: '시영은 잠시 자신의 손을 내려다본다.' },
        { speaker: 'siyeong', text: '…비밀이에요.' },
        { text: '{name}이(가) 다른 부스를 바라보자 시영이 조심스럽게 말을 건다.' },
        { speaker: 'siyeong', text: '저… {name}님.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '…축제, 조금만 더 같이 구경해 주실래요?' },
        { speaker: 'player', text: '좋아. 어디부터 갈까?' },
        { text: '시영은 작게 미소 짓는다.' },
        { speaker: 'siyeong', text: '(…귀신의 집보다 더 두근거리는 곳이 있을 줄은 몰랐어요.)' },
      ],
    },
    {
      id: 'date-siyeong-4',
      title: '이번에는 제가 먼저',
      illust: siyeong4Img,
      background: clubRoomImg,
      time: '오후',
      lines: [
        // SCENE 1. 동아리실의 대화 — 동아리방
        { text: '게임 제작 동아리의 정기 모임이 끝난 오후. 시영은 노트북을 정리하고 있다.' },
        { text: '그때 동아리 선배가 {name}에게 다가온다.', hidePortrait: true },
        { name: '선배', text: '{name}, 이번 주 토요일에 시간 있어?' },
        { speaker: 'player', text: '왜요?' },
        { name: '선배', text: '애들이랑 전시회 보러 가려고 하는데 같이 갈래?' },
        { speaker: 'player', text: '어떤 전시회인데요?' },
        { name: '선배', text: '게임 아트 전시회. 꽤 볼 만하다던데?' },
        { text: '시영은 노트북을 정리하던 손을 멈춘다.' },
        { speaker: 'siyeong', text: '(…토요일?)' },
        { text: '시영의 가방 안에는 며칠 전 예매한 괴담 전시회 티켓 두 장이 들어 있다.' },
        { speaker: 'player', text: '아, 토요일은 아직 일정이 없긴 한데….' },
        { speaker: 'siyeong', text: '저, 저기…!' },
        { text: '갑작스러운 목소리에 두 사람이 시영을 바라본다.' },
        { speaker: 'siyeong', text: '……!' },
        { name: '선배', text: '응? 시영아, 왜?' },
        { speaker: 'siyeong', text: '아… 아무것도 아니에요….' },
        { speaker: 'player', text: '무슨 일 있어?' },
        { text: '시영은 잠시 망설이다가 {name}을(를) 바라본다.' },
        {
          speaker: 'siyeong',
          text: '…{name}님. 저도 토요일에 드릴 말씀이 있는데….',
          choices: [
            {
              text: '그럼 시영이 이야기부터 들어볼게요.',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…제 이야기부터요?' },
                { speaker: 'player', text: '응. 먼저 말하려던 것 같아서.' },
                { speaker: 'siyeong', text: '…가, 감사합니다.' },
              ],
            },
            {
              text: '응, 무슨 이야기인데?',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '아… 그게요.' },
                { speaker: 'player', text: '천천히 말해도 돼.' },
                { speaker: 'siyeong', text: '…네. 잠시만요.' },
              ],
            },
            {
              text: '급한 이야기 아니면 조금 있다가 해도 될까?',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 네. 괜찮아요.' },
                { speaker: 'player', text: '금방 이야기 끝낼게.' },
                { speaker: 'siyeong', text: '…천천히 하셔도 돼요.' },
              ],
            },
          ],
        },

        // SCENE 2. 두 장의 티켓
        { text: '잠시 후 선배가 다른 동아리원에게 불려 자리를 떠난다.' },
        { speaker: 'player', text: '시영아, 아까 무슨 말 하려고 했어?' },
        { speaker: 'siyeong', text: '…아, 그게.' },
        { text: '시영은 가방에서 전시회 티켓 두 장을 꺼낸다.' },
        { speaker: 'siyeong', text: '사실… 이번 주 토요일에 괴담 전시회가 열리거든요.' },
        { speaker: 'player', text: '괴담 전시회?' },
        { speaker: 'siyeong', text: '네. 오래된 그림에 얽힌 괴담을 주제로 한 전시회예요.' },
        { speaker: 'player', text: '네가 좋아할 만한 전시회네.' },
        { speaker: 'siyeong', text: '…네. 그래서 미리 예매했어요.' },
        { speaker: 'player', text: '두 장이네?' },
        { speaker: 'siyeong', text: '…….' },
        { speaker: 'player', text: '누구랑 가려고?' },
        { speaker: 'siyeong', text: '…{name}님이요.' },
        { speaker: 'player', text: '응?' },
        { text: '시영은 자신이 무슨 말을 했는지 깨닫고 얼굴이 붉어진다.' },
        { speaker: 'siyeong', text: '아, 아니…! 아직 같이 가자고 말씀드린 건 아닌데…!' },
        { speaker: 'player', text: '나랑 가려고 두 장 예매한 거야?' },
        { speaker: 'siyeong', text: '……네.' },
        { text: '시영은 티켓을 꼭 쥔다.' },
        {
          speaker: 'siyeong',
          text: '…다른 분이랑 약속 잡으시기 전에 말씀드리고 싶었어요.',
          choices: [
            {
              text: '좋아. 나도 너랑 단둘이 가고 싶어.',
              affection: { siyeong: 2 },
              reply: [
                { speaker: 'siyeong', text: '…다, 단둘이요?' },
                { speaker: 'player', text: '응. 네가 좋아하는 전시회잖아.' },
                { speaker: 'siyeong', text: '…그럼 저도 정말 기대할게요.' },
              ],
            },
            {
              text: '좋아. 토요일에 같이 가자.',
              affection: { siyeong: 1 },
              reply: [
                { speaker: 'siyeong', text: '…정말요?' },
                { speaker: 'player', text: '응. 몇 시에 만나면 돼?' },
                { speaker: 'siyeong', text: '…여섯 시에요. 제가 위치 보내드릴게요.' },
              ],
            },
            {
              text: '괴담은 잘 모르지만 같이 가볼게.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…아, 괜찮으시겠어요?' },
                { speaker: 'player', text: '응. 처음 보는 전시회라 궁금하네.' },
                { speaker: 'siyeong', text: '…그럼 제가 설명해 드릴게요.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '{name}은(는) 티켓을 받아 확인한다.' },
        { speaker: 'player', text: '그럼 토요일에 보자.' },
        { speaker: 'siyeong', text: '…네.' },
        { text: '{name}이(가) 동아리실을 나가려는 순간, 시영이 조심스럽게 부른다.' },
        { speaker: 'siyeong', text: '…{name}님.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '저… 사실 전시회가 꼭 보고 싶었던 것도 있지만….' },
        { speaker: 'player', text: '응.' },
        { speaker: 'siyeong', text: '…{name}님이랑 같이 가고 싶었던 게 더 커요.' },
        { text: '시영은 얼굴을 붉히며 고개를 숙인다.' },
        { speaker: 'player', text: '그럼 잘됐네. 나도 재밌을 것 같아.' },
        { speaker: 'siyeong', text: '…….' },
        { speaker: 'siyeong', text: '…네. 토요일에 뵐게요.' },
        { text: '{name}이(가) 나간 뒤, 시영은 남은 티켓을 바라보며 작게 미소 짓는다.' },
      ],
    },
  ],
  // 첫 만남(6월) → 9~11월 히로인 선택 데이트: 우산 → 축제 사격 내기 → 발레 공연 초대
  emily: [
    {
      id: 'date-emily-1',
      title: '마음에 안 드는 스케치',
      illust: emily1Img,
      background: gameDevRoomImg,
      time: '오후',
      lines: [
        // SCENE 1. 마음에 안 드는 그림 — 실습실
        { text: '수업이 끝난 실습실. 대부분의 학생이 돌아간 가운데 에밀리는 태블릿 앞에 앉아 그림을 수정하고 있다.' },
        { text: '{name}은(는) 두고 온 충전기를 찾으러 실습실에 들어온다.' },
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
    {
      id: 'date-emily-2',
      title: '우산은 하나뿐',
      illust: emily2Img,
      background: universityGateImg,
      time: '늦은 오후',
      lines: [
        // SCENE 1. 갑작스러운 비 — 건물 입구
        { text: '수업이 끝난 뒤 갑작스럽게 비가 쏟아진다.' },
        { text: '에밀리는 건물 입구에서 가방을 품에 안고 비를 바라보고 있다.' },
        { speaker: 'player', text: '안 가?' },
        { speaker: 'emily', text: '아, 깜짝이야! 인기척 좀 내.' },
        { speaker: 'player', text: '우산 없어?' },
        { speaker: 'emily', text: '응. 아침엔 맑았잖아.' },
        { text: '에밀리는 가방 안에 든 스케치북을 확인한다.' },
        { speaker: 'emily', text: '하필 오늘 원화 작업한 것도 들고 왔는데….' },
        { speaker: 'player', text: '같이 가자.' },
        { text: '{name}은(는) 가방에서 우산을 꺼낸다.' },
        { speaker: 'emily', text: '…뭐?' },
        { speaker: 'player', text: '역까지 가는 거잖아.' },
        { speaker: 'emily', text: '그렇긴 한데….' },
        { speaker: 'player', text: '나도 역으로 가.' },
        { speaker: 'emily', text: '흥. 그럼 어쩔 수 없지.' },
        { text: '두 사람은 우산을 함께 쓰고 걷기 시작한다.' },
        { text: '에밀리는 {name}와(과) 평소보다 가까워진 거리가 어색한 듯 고개를 돌린다.' },
        { speaker: 'emily', text: '야, 좀 떨어져.' },
        { speaker: 'player', text: '그러면 비 맞아.' },
        { speaker: 'emily', text: '아, 그건 그렇지만.' },
        { text: '그때 바람이 불어 에밀리 쪽으로 빗방울이 튄다.' },
        { text: '{name}은(는) 말없이 우산을 에밀리 쪽으로 기울인다.' },
        {
          speaker: 'emily',
          text: '너 어깨 젖는데?',
          choices: [
            {
              text: '괜찮아. 네 스케치북 젖는 것보단 낫지.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '…그걸 왜 네가 신경 써?' },
                { speaker: 'player', text: '네가 열심히 그린 거잖아.' },
                { speaker: 'emily', text: '…바보. 너도 안 젖게 좀 더 가까이 와.' },
              ],
            },
            {
              text: '조금 젖는 건 괜찮아.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '그래도 감기 걸리면 어떡해.' },
                { speaker: 'player', text: '이 정도는 괜찮아.' },
                { speaker: 'emily', text: '…흥. 그러다 감기 걸려도 난 몰라.' },
              ],
            },
            {
              text: '그럼 네가 우산 좀 더 들어.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '뭐? 내가?' },
                { speaker: 'player', text: '네가 잡는 게 편할 것 같아서.' },
                { speaker: 'emily', text: '하아… 진짜 분위기 없기는.' },
              ],
            },
          ],
        },

        // SCENE 2. 함께 가는 이유
        { text: '잠시 후 비가 조금 잦아든다.' },
        { speaker: 'emily', text: '야.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'emily', text: '너 원래 누구한테나 이렇게 잘해줘?' },
        { speaker: 'player', text: '어떻게?' },
        { speaker: 'emily', text: '아니, 그냥 우산도 같이 써주고.' },
        { speaker: 'player', text: '친구면 같이 갈 수도 있지.' },
        { speaker: 'emily', text: '…친구.' },
        { text: '에밀리는 작게 중얼거린다.' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'emily', text: '아무것도 아니야!' },
        { text: '잠시 침묵이 흐른다.' },
        {
          speaker: 'emily',
          text: '그냥 나 혼자 뛰어갈 수도 있었는데.',
          choices: [
            {
              text: '난 너랑 같이 가는 게 더 좋은데.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '……! 그, 그런 말을 왜 아무렇지도 않게 해?!' },
                { speaker: 'player', text: '너랑 얘기하면 재밌으니까.' },
                { speaker: 'emily', text: '진짜 사람 헷갈리게 하네.' },
              ],
            },
            {
              text: '어차피 같은 방향이니까 괜찮아.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '그렇긴 하지.' },
                { speaker: 'player', text: '혼자 가는 것보다 낫잖아.' },
                { speaker: 'emily', text: '흥. 다음에도 같이 가든가.' },
              ],
            },
            {
              text: '그러게. 다음엔 우산 챙겨.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '알거든? 오늘은 깜빡한 거야!' },
                { speaker: 'player', text: '다음엔 일기예보 확인해.' },
                { speaker: 'emily', text: '하아… 너 진짜 재미없어.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '역 입구에 도착하자 에밀리는 우산 밖으로 나온다.' },
        { speaker: 'emily', text: '오늘 고마웠어.' },
        { speaker: 'player', text: '응. 조심히 가.' },
        { speaker: 'emily', text: '너도.' },
        { text: '에밀리는 몇 걸음 걸어가다가 다시 돌아본다.' },
        { speaker: 'emily', text: '야!' },
        { speaker: 'player', text: '응?' },
        { speaker: 'emily', text: '다음에 비 오면.' },
        { speaker: 'player', text: '응.' },
        { speaker: 'emily', text: '그때도 같이 가도 돼?' },
        { speaker: 'player', text: '당연하지.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'emily', text: '흥. 그럼 됐어.' },
        { text: '에밀리는 서둘러 역 안으로 들어간다.' },
        { speaker: 'emily', text: '(…다음에도 비가 오면 좋겠네.)' },
      ],
    },
    // 축제 배경 이미지가 생기면 바꾸기 (지금은 저녁 분위기의 호수 산책로)
    {
      id: 'date-emily-3',
      title: '내기에서 이기면 소원 하나',
      illust: emily3Img,
      background: lakeTrailImg,
      time: '저녁',
      lines: [
        // SCENE 1. 축제에서의 승부 — 사격 부스
        { text: '축제로 북적이는 캠퍼스. {name}은(는) 사격 부스 앞에서 에밀리를 발견한다.' },
        { speaker: 'player', text: '에밀리, 여기서 뭐 해?' },
        { speaker: 'emily', text: '보면 몰라? 사격 게임 구경 중이잖아.' },
        { speaker: 'player', text: '해보려고?' },
        { speaker: 'emily', text: '응. 근데 혼자 하면 재미없잖아.' },
        { text: '에밀리가 {name}을(를) 위아래로 훑어본다.' },
        { speaker: 'emily', text: '너, 나랑 한 판 할래?' },
        { speaker: 'player', text: '사격?' },
        { speaker: 'emily', text: '그래. 진 사람이 이긴 사람 소원 하나 들어주기.' },
        { speaker: 'player', text: '무슨 소원?' },
        {
          speaker: 'emily',
          text: '그건 이기고 나서 정하는 거지. 설마 자신 없어?',
          choices: [
            {
              text: '좋아. 대신 내가 이기면 너도 소원 들어줘.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '하, 당연하지. 자신 있나 봐?' },
                { speaker: 'player', text: '너한테 부탁할 게 생길 수도 있으니까.' },
                { speaker: 'emily', text: '뭐? 무슨 부탁인데? 아, 일단 이기고 말해!' },
              ],
            },
            {
              text: '좋아. 한번 해보자.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '오, 생각보다 시원하게 나오네?' },
                { speaker: 'player', text: '재밌을 것 같아서.' },
                { speaker: 'emily', text: '흥. 나중에 후회하지 마.' },
              ],
            },
            {
              text: '굳이 소원까지 걸어야 해?',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '뭐야, 재미없게.' },
                { speaker: 'player', text: '그냥 게임만 하면 안 돼?' },
                { speaker: 'emily', text: '알았어. 대신 내가 이기면 부탁 하나는 들어줘.' },
              ],
            },
          ],
        },

        // SCENE 2. 에밀리의 소원
        { text: '두 사람은 나란히 사격대 앞에 선다.' },
        { speaker: 'emily', text: '잘 봐. 내가 어떻게 하는지.' },
        { text: '에밀리는 연달아 표적을 맞힌다.' },
        { speaker: 'player', text: '오, 잘하네.' },
        { speaker: 'emily', text: '당연하지. 이제 네 차례야.' },
        { text: '{name}도 표적을 향해 사격하지만 마지막 한 발을 놓친다.' },
        { speaker: 'player', text: '아, 아깝다.' },
        { speaker: 'emily', text: '후후, 내가 이겼네?' },
        { speaker: 'player', text: '그러네. 소원이 뭔데?' },
        { speaker: 'emily', text: '…그게.' },
        { text: '에밀리는 자신만만하던 모습과 달리 잠시 말을 망설인다.' },
        { speaker: 'player', text: '아직 안 정했어?' },
        { speaker: 'emily', text: '아니거든! 이미 정해 놨거든?' },
        { speaker: 'player', text: '그럼 말해.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'emily', text: '…오늘 축제 끝날 때까지 나랑 같이 다녀.' },
        { speaker: 'player', text: '그게 소원이야?' },
        {
          speaker: 'emily',
          text: '왜! 싫어?',
          choices: [
            {
              text: '좋아. 나도 너랑 더 놀고 싶었어.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '……! 너도?' },
                { speaker: 'player', text: '응. 아직 같이 못 본 부스도 많잖아.' },
                { speaker: 'emily', text: '흥. 그럼 오늘은 끝까지 같이 다니는 거야.' },
              ],
            },
            {
              text: '좋아. 어디부터 갈까?',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '저쪽에 먹거리 부스 있던데.' },
                { speaker: 'player', text: '배고파?' },
                { speaker: 'emily', text: '조금. 너도 같이 먹을 거지?' },
              ],
            },
            {
              text: '그 정도면 내기 안 해도 됐잖아.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '그, 그건 그렇지만!' },
                { speaker: 'player', text: '그냥 같이 가자고 하지.' },
                { speaker: 'emily', text: '하아… 알았으니까 빨리 따라와!' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '두 사람은 먹거리 부스를 구경하며 축제를 즐긴다.' },
        { text: '에밀리는 사격 부스에서 받은 작은 인형을 {name}에게 건넨다.' },
        { speaker: 'player', text: '이건 왜?' },
        { speaker: 'emily', text: '아까 상품으로 받은 거. 난 이런 거 필요 없어.' },
        { speaker: 'player', text: '그럼 네가 갖지.' },
        { speaker: 'emily', text: '됐어. 너 가지라니까.' },
        { speaker: 'player', text: '알겠어. 고마워.' },
        { text: '{name}은(는) 인형을 가방에 달아 둔다.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'emily', text: '…진짜 달고 다니려고?' },
        { speaker: 'player', text: '응. 네가 준 거잖아.' },
        { speaker: 'emily', text: '……!' },
        { text: '에밀리는 얼굴을 붉히며 고개를 돌린다.' },
        { speaker: 'emily', text: '…하아. 너 진짜 사람 당황하게 하는 데 재능 있다.' },
        { speaker: 'player', text: '내가 뭘?' },
        { speaker: 'emily', text: '몰라도 돼!' },
        { text: '멀리서 축제 공연의 음악이 들려온다.' },
        { speaker: 'player', text: '저쪽도 가볼까?' },
        { speaker: 'emily', text: '좋아.' },
        { text: '에밀리는 {name}보다 반걸음 앞서 걷다가 슬쩍 뒤를 돌아본다.' },
        { speaker: 'emily', text: '야, {name}.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'emily', text: '다음에도 이런 내기 하자.' },
        { speaker: 'player', text: '또 소원 걸고?' },
        { speaker: 'emily', text: '응. 다음엔 더 큰 소원 걸 거니까 각오해.' },
        { text: '에밀리는 웃으며 먼저 걸어간다.' },
        { speaker: 'emily', text: '(…다음에는 내기 같은 거 없이도 같이 놀자고 할 수 있으려나.)' },
      ],
    },
    {
      id: 'date-emily-4',
      title: '너한테만 부탁하는 거야',
      illust: emily4Img,
      background: gameDevRoomImg,
      time: '오후',
      lines: [
        // SCENE 1. 동아리실의 소동 — 동아리방
        { text: '게임 제작 동아리에서 프로젝트 회의가 끝난 후, 에밀리는 혼자 캐릭터 일러스트를 수정하고 있다.' },
        { speaker: 'player', text: '에밀리, 아직 안 가?' },
        { speaker: 'emily', text: '응. 캐릭터 표정이 마음에 안 들어서.' },
        { speaker: 'player', text: '어디가?' },
        { speaker: 'emily', text: '여기. 웃고 있는데 어딘가 어색하잖아.' },
        { text: '{name}이(가) 에밀리의 모니터를 살펴본다.' },
        { speaker: 'player', text: '입꼬리보다 눈썹 때문인 것 같은데.' },
        { speaker: 'emily', text: '어? 잠깐.' },
        { text: '에밀리가 눈썹을 수정하자 캐릭터의 표정이 자연스러워진다.' },
        { speaker: 'emily', text: '진짜네.' },
        { speaker: 'player', text: '이제 괜찮아 보인다.' },
        { speaker: 'emily', text: '흥. 너 은근히 이런 거 잘 본다?' },
        { text: '그때 동아리 선배 준우가 두 사람을 바라보며 웃는다.' },
        { name: '준우', text: '야, 너희 둘 요즘 맨날 붙어 있네. 혹시 사귀냐?' },
        { speaker: 'emily', text: '네?! 아, 아니거든요!' },
        { name: '준우', text: '아닌데 왜 그렇게 놀라?' },
        { speaker: 'emily', text: '그냥 작업 중이었거든요!' },
        { text: '준우는 웃으며 동아리실을 나간다.' },
        { speaker: 'emily', text: '하아… 진짜 별소리를 다 하네.' },
        { speaker: 'player', text: '그러게.' },
        { text: '에밀리는 {name}을(를) 힐끗 바라본다.' },
        {
          speaker: 'emily',
          text: '너는 아무렇지도 않아?',
          choices: [
            {
              text: '난 너랑 그런 오해 받는 거 싫지 않은데.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '……! 뭐, 뭐라고?' },
                { speaker: 'player', text: '그렇게 기분 나쁜 말은 아니잖아.' },
                { speaker: 'emily', text: '…하아. 그런 말 좀 아무렇지 않게 하지 마!' },
              ],
            },
            {
              text: '그냥 장난이잖아. 신경 쓰지 마.',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '…나도 알아.' },
                { speaker: 'player', text: '그럼 됐네.' },
                { speaker: 'emily', text: '흥. 너는 참 태평하다.' },
              ],
            },
            {
              text: '당연히 아니니까 신경 쓸 필요 없지.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '…….' },
                { speaker: 'player', text: '왜?' },
                { speaker: 'emily', text: '아니. 네 말이 맞지, 뭐.' },
              ],
            },
          ],
        },

        // SCENE 2. 뜻밖의 발견
        { text: '{name}은(는) 책상 위에 놓인 에밀리의 가방을 옮기다가 발레 공연 팸플릿을 발견한다.' },
        { speaker: 'player', text: '이거 발레 공연이네?' },
        { speaker: 'emily', text: '야, 그거!' },
        { text: '에밀리가 황급히 팸플릿을 가져간다.' },
        { speaker: 'player', text: '발레 좋아해?' },
        { speaker: 'emily', text: '어. 근데 왜 궁금한데.' },
        { speaker: 'player', text: '너랑 잘 어울려서.' },
        { speaker: 'emily', text: '…!' },
        { speaker: 'player', text: '공연 보러 가려고?' },
        { speaker: 'emily', text: '그럴 생각이었어.' },
        { text: '에밀리는 잠시 팸플릿을 내려다본다.' },
        { speaker: 'emily', text: '사실 티켓이 두 장 있거든.' },
        { speaker: 'player', text: '친구랑 가?' },
        { speaker: 'emily', text: '아니. 아직 같이 갈 사람은 없어.' },
        { speaker: 'player', text: '그렇구나.' },
        { text: '에밀리는 답답한 듯 {name}을(를) 바라본다.' },
        { speaker: 'emily', text: '너 진짜 눈치 없다.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'emily', text: '하아… 그러니까!' },
        { speaker: 'emily', text: '이번 주 토요일에 시간 있냐고!' },
        { speaker: 'player', text: '응. 오후엔 괜찮아.' },
        {
          speaker: 'emily',
          text: '그럼 나랑 같이 가.',
          choices: [
            {
              text: '좋아. 너랑 같이 가고 싶어.',
              affection: { emily: 2 },
              reply: [
                { speaker: 'emily', text: '……! 그렇게 바로 대답한다고?' },
                { speaker: 'player', text: '응. 네가 좋아하는 공연이잖아.' },
                { speaker: 'emily', text: '…흥. 그럼 기대해도 좋을 거야.' },
              ],
            },
            {
              text: '좋아. 공연은 몇 시인데?',
              affection: { emily: 1 },
              reply: [
                { speaker: 'emily', text: '저녁 일곱 시.' },
                { speaker: 'player', text: '그럼 여섯 시 반에 만나자.' },
                { speaker: 'emily', text: '좋아. 늦지 마.' },
              ],
            },
            {
              text: '발레는 잘 모르지만, 한번 가볼게.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '뭐야, 그 애매한 반응은.' },
                { speaker: 'player', text: '처음 보는 공연이라서.' },
                { speaker: 'emily', text: '흥. 내가 옆에서 설명해 줄 테니까 걱정 마.' },
              ],
            },
          ],
        },

        // SCENE 3. 이벤트 마무리
        { text: '에밀리는 휴대폰으로 공연 정보를 {name}에게 보낸다.' },
        { speaker: 'emily', text: '그럼 토요일에 공연장 앞에서 만나.' },
        { speaker: 'player', text: '알겠어.' },
        { speaker: 'emily', text: '그리고 오해하지 마. 이거 데이트 아니거든?' },
        { speaker: 'player', text: '응. 같이 공연 보러 가는 거잖아.' },
        { speaker: 'emily', text: '…….' },
        { speaker: 'emily', text: '하아. 맞는 말인데 왜 짜증 나지.' },
        { speaker: 'player', text: '뭐라고?' },
        { speaker: 'emily', text: '아무것도 아니야!' },
        { text: '{name}이(가) 동아리실을 나간 뒤, 에밀리는 팸플릿을 바라본다.' },
        { speaker: 'emily', text: '(후… 드디어 같이 가자고 했다.)' },
        { speaker: 'emily', text: '(…토요일엔 뭘 입고 가지?)' },
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

// 이름 입력 직후 한 번 보는 프롤로그 (오프닝)
export const PROLOGUE_DATE = '2026-03-02';

export const PROLOGUE: Episode = {
  id: 'prologue',
  title: '오프닝',
  icon: '📮',
  time: '저녁',
  lines: [
    { speaker: 'player', text: '내 이름은 {name}, 23살.' },
    { speaker: 'player', text: '평범한 남중을 나와 특성화 남고에 진학했다.' },
    { speaker: 'player', text: '만나본 여자는 0명, 대화해본 여자도… 손에 꼽는다.' },
    { speaker: 'player', text: '특성화고를 졸업한 뒤 3년 동안 뼈 빠지게 회사에 다니며 재직 기간을 채웠다.' },
    { speaker: 'player', text: '그리고 드디어, 재직자 특별전형으로 대학교 원서를 넣을 수 있게 되었다.' },
    { speaker: 'player', text: '...거기까지는 좋았다.' },
    { text: '"{name} 씨, 오늘부터 일이 좀 많을 것 같아. 사정 알지? 조금만 고생해 줘."' },
    { text: '원서 접수 3개월 전, 친하게 지내던 동기들이 줄줄이 퇴사했고 팀장님은 육아휴직에 들어갔다.' },
    { text: '회사는 요즘은 AI로 대체할 수 있다며 사람을 아예 뽑지 않았고, 모든 업무가 나한테 떨어졌다.' },
    { speaker: 'player', text: '(인수인계 없이 사라진 동기, 2년 육아휴직을 떠난 팀장님, 하루 10번씩 30분짜리 담배 타임을 즐기는 대리님… 이 회사는 답이 없다. 빨리 탈출해야겠다.)' },
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
  const expand = (list: EpisodeLine[]): EpisodeLine[] =>
    list.flatMap((line) => {
      if (!line.choices) return [line];
      const choice = line.choices[picks[k++]] ?? line.choices[0];
      const { choices: _choices, ...rest } = line;
      return [rest, { speaker: 'player' as const, text: choice.text }, ...expand(choice.reply)];
    });
  return expand(lines);
}

// 에피소드의 대표 캐릭터 (주인공이 아닌 첫 화자, 없으면 주인공)
export function getMainSpeaker(episode: Episode): Speaker {
  return episode.lines.find((l) => l.speaker && l.speaker !== 'player')?.speaker ?? 'player';
}
