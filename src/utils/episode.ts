import hayeongImg from '../img/character/hayeong/hayeong_main.png';
import minjiImg from '../img/character/minji/minji_default.png';
import minjiSmileImg from '../img/character/minji/minji_smile.png';
import minjiBigSmileImg from '../img/character/minji/minji_bigsmile.png';
import minjiShySmileImg from '../img/character/minji/minji_shy_smile.png';
import minjiLessImg from '../img/character/minji/minji_less.png';
import minjiSurprisedSoftImg from '../img/character/minji/minji_surprised_soft.png';
import siyeongImg from '../img/character/siyeong/siyeong_default.png';
import emilyImg from '../img/character/emily/emily_default.png';
import barImg from '../img/background/bar.png';
import studyroomImg from '../img/background/studyroom.png';
import roomImg from '../img/background/room.png';
import ballroomImg from '../img/background/ballroom.png';
import waterparkImg from '../img/background/waterpark.png';
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
export const READY_BACKGROUNDS = new Set<string>([roomImg, ballroomImg, barImg, studyroomImg, waterparkImg]);

// 임시 에피소드. 달(1~12)별로 지정하고, 없는 달은 DEFAULT_EPISODE
// id는 처음 나온 달 기준이라 지금 달과 다를 수 있음 (저장된 컬렉션·선택 기록과 맞추려고 바꾸지 않음)
const EPISODES: Record<number, Episode> = {
  // EP 1. 첫 수업
  4: {
    id: 'first-class',
    title: '첫 수업',
    icon: '📖',
    time: '밤',
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
              { speaker: 'siyeong', text: '내 의견…… 괜찮았어?', voice: 'ep1/시영/시영8' },
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
    time: '밤',
    lines: [
      // 가면무도회의 초대
      { text: '문자가 날아왔다.', background: roomImg },
      { text: '오랜 전통에 따라 가면무도회가 열리니 각자 알맞은 가면을 쓰고 파티에 오라고 한다.' },
      { speaker: 'player', text: '(과연 뱀파이어 대학다운 모습이다. 나가긴 가야겠지…)' },
      { text: '근처 문구점에서 가면을 사서 무도회장으로 갔다.' },

      // 무도회장
      { speaker: 'player', text: '(대학교에 이런 장소가…?)', background: ballroomImg },
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
              { speaker: 'minji', text: '그래? 너도 뭘 좀 아는 애구나?! 다음에 같이 먹어보자!', expression: 'bigsmile', voice: 'ep2/민지/민지8' },
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
    time: '밤',
    lines: [
      { text: '기말고사가 끝난 기념으로 술자리가 열렸다. 바로 도망가고 싶었지만 다 참여하라고 해서 결국 가게 됐다.', background: roomImg },

      // 기말고사 뒤 술자리
      { text: '여기 음식은 고기와 포도주가 전부였다.', background: barImg },
      { text: '그래서 고기 요리는 진짜 차원이 달랐다. 레어를 싫어하는데 딱 알맞은 굽기였다.' },
      { text: '나도 모르게 고기를 먹으면서 포도주를 마시게 됐다.' },
      { text: '한 잔을 비우고 나니 얼굴이 뜨거워졌다. 술기운 때문인지 심장도 조금씩 빨리 뛰기 시작했다.' },
      // 위험 상황 ① 포도주
      { speaker: 'player', text: '(아, 맞다. 흥분하면 안 되는데. 벌써부터 이러면 어떡하지?)', risk: { amount: 20, kind: 'excite' } },
      { speaker: 'minji', text: '야, 너 오랜만이다. 가면무도회 때 그 웃긴 가면 너 맞지?', expression: 'smile', voice: 'drinkparty/민지1' },
      { text: '고개를 돌리자 송민지가 내 옆자리에 털썩 앉았다.' },
      // TODO(더빙): 대사가 바뀌어 기존 녹음(ep2/민지2)을 뺐음
      { speaker: 'minji', text: '그때 선도부한테 끌려가서 아직도 짜증 나. 오늘은 누가 막지도 않잖아?', expression: 'less' },
      { speaker: 'player', text: '뭘 하려고…?' },
      { speaker: 'minji', text: '좀만 가까이 있어 봐.', expression: 'shy_smile' },
      { speaker: 'minji', text: '음, 역시 너 옆에 앉으니까 더 알 것 같아. 너 옆에 있으면 좀 오싹오싹하고 흥분되는 게…', expression: 'shy_smile', voice: 'drinkparty/민지4' },
      { speaker: 'player', text: '흥분되는 게…?' },
      { text: '약간 눈이 돌아 있는 듯한 모습으로 나를 바라봐서 들키는 건가 무서웠다.' },
      { speaker: 'minji', text: '너를 좋아하는 것 같아… 너 나랑 사귀자!!', expression: 'bigsmile', voice: 'drinkparty/민지5', cg: ep03MinjiCg },
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
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '오? 그럼 가능성 있다는 거네? 좋았어!', expression: 'bigsmile', voice: 'drinkparty/민지 호감1' },
              { speaker: 'player', text: '(아니, 친해지고 싶다고 했지 사귀겠다고는 안 했는데…)' },
            ],
          },
          {
            text: '갑자기라 좀 놀랐어.',
            affection: { minji: 5 },
            reply: [{ speaker: 'minji', text: '하긴, 내가 좀 갑작스러웠지? 그래도 잘 생각해 봐!', expression: 'smile', voice: 'drinkparty/민지 호감2' }],
          },
          {
            text: '장난은 그만해.',
            affection: { minji: -5 },
            reply: [{ speaker: 'minji', text: '뭐야, 나 나름 진지했는데? 너 은근 상처 준다.', expression: 'less', voice: 'drinkparty/민지 호감3' }],
          },
          {
            text: '너랑 친해지고 싶은 사람은 없을걸?',
            affection: { minji: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'minji', text: '야, 내가 우습게 보여?', expression: 'less' },
              { text: '민지가 잔을 내려놓고 내 얼굴을 노려봤다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 갑자기 놀라서 말이 심했어.' },
              { speaker: 'minji', text: '다음에는 그렇게 말하지 마.', expression: 'less' },
            ],
          },
        ],
      },
      { speaker: 'emily', text: '야, 또 얘 괴롭히지?', stage: ['minji', 'emily'], voice: 'drinkparty/에밀리1' },
      { text: '은발 초미녀가 말을 걸었다.' },
      { text: '진짜 다행이다. 민지가 더 다가왔으면 심장이 더 빨리 뛰어서 피 냄새가 짙어졌을 것이다.' },
      { text: '가면무도회와 수업에서 봤던 에밀리였다. 귀족 자제라 그런지 여전히 싸가지가 좀 없는 듯했다.' },
      { speaker: 'minji', text: '아, 또 너냐. 내가 그때 너 때문에 창피당한 거 생각하면 진짜…', expression: 'less', voice: 'drinkparty/민지6' },
      { speaker: 'emily', text: '뭐, 네가 잘못한 건데. 창피할 것도 따로 있나. 행동을 바르게 하면 그럴 일도 없거든.', voice: 'drinkparty/에밀리2 쯧쯧 삭제' },
      { speaker: 'minji', text: '와, 진짜 내가 원래 이런 애가 아닌데 너는 진짜… 죽이고 싶다. 현피 한 번만 뜨면 안 될까?', expression: 'less', voice: 'drinkparty/민지7' },
      { speaker: 'emily', text: '꺼져. 혼자나 하시고.', voice: 'drinkparty/에밀리3' },
      { speaker: 'player', text: '(아니, 지금 막으러 온 거 아니었어? 둘이 또 싸우려고 하는데…)' },
      { speaker: 'emily', text: '흠, 오랜만에 이 냄새를 맡으니 더 이끌리네.', voice: 'drinkparty/에밀리4' },
      // TODO(더빙): 대사가 바뀌어 기존 녹음(ep2/에밀리5, 에밀리6)을 뺐음
      { speaker: 'emily', text: '그래서 그때 물어봤던 향수 말이다.' },
      { speaker: 'player', text: '향수? 그 얘기를 또 왜…' },
      { speaker: 'emily', text: '네 향인지 아직도 궁금하거든.' },
      { text: '에밀리가 냄새를 맡으려 가까이 왔다.', cg: ep03EmilyCg },

      // 쏟아진 포도주
      { text: '그때 잔을 들고 다가오던 서시영이 에밀리와 나를 번갈아 봤다. 시영의 눈빛이 갑자기 이상해졌다.', stage: ['minji', 'siyeong', 'emily'], cg: null },
      { speaker: 'siyeong', text: '…너무 가까워요.', voice: 'drinkparty/시영1' },
      { text: '갑자기 서시영이 빈손으로 에밀리를 힘껏 밀쳤다.' },
      { speaker: 'siyeong', text: '내 거야!!!!!', voice: 'drinkparty/시영2' },
      { text: '그 바람에 시영이 들고 있던 포도주 잔이 기울었다. 붉은 포도주가 에밀리의 흰 셔츠 위로 쏟아졌다.' },
      { speaker: 'emily', text: '…뭐?', voice: 'drinkparty/에밀리7' },
      { speaker: 'siyeong', text: '앗… 죄, 죄송해요!', voice: 'drinkparty/시영3' },
      { text: '젖은 흰 셔츠 너머로 에밀리가 입은 검은색 브래지어의 윤곽이 비쳤다.' },
      { text: '에밀리는 자기 옷을 내려다보더니 얼굴이 빨개져서 급하게 팔로 몸을 가렸다.' },
      { speaker: 'emily', text: '야! 다들 저리 좀 돌아봐!', voice: 'drinkparty/에밀리8' },
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
              { speaker: 'emily', text: '…고, 고맙다. 그리고 계속 돌아보고 있어.', voice: 'drinkparty/에밀리 호감1' },
              { text: '에밀리가 옷을 받아 몸을 가렸다. 그래도 심장이 조금은 빨라졌다.', risk: { amount: 10, kind: 'excite' } },
            ],
          },
          {
            text: '내가 가려줄게, 이쪽으로 와.',
            affection: { emily: 10 },
            reply: [
              { text: '나는 겉옷을 펼쳐 들고 에밀리 앞으로 다가갔다. 가까이 서자 심장이 더 빠르게 뛰었다.', risk: { amount: 40, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '이, 이렇게 가까이 오라는 뜻은 아니었는데… 그래도 고맙다.', voice: 'drinkparty/에밀리 호감2' },
              { text: '에밀리는 황급히 내 겉옷을 받아 몸을 가렸다.' },
            ],
          },
          {
            text: '어… 에밀리…',
            affection: {},
            reply: [
              { text: '너무 당황해서 고개를 돌려야 한다는 생각도 늦었다. 심장이 빨리 뛰고 피 냄새가 짙어졌다.', risk: { amount: 60, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'emily', text: '야, 너도 돌아보라고!', voice: 'drinkparty/에밀리 호감3' },
              { text: '나는 화들짝 놀라 뒤를 돌아봤다. 하지만 이미 너무 늦은 건 아닐까?' },
            ],
          },
          {
            text: '에밀리가 수건을 달라고 해도 계속 쳐다보며 놀린다.',
            affection: { emily: -15 },
            stats: { charm: -3 },
            reply: [
              { speaker: 'emily', text: '야! 재밌어? 수건이나 달라고!' },
              { text: '얼굴이 뜨거워지자 나는 뒤늦게 고개를 돌리고 수건을 건넸다.', risk: { amount: 60, kind: 'excite' } },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'player', text: '미안해. 내가 잘못했어.' },
              { speaker: 'emily', text: '다시는 그러지 마.' },
            ],
          },
        ],
      },
      { text: '에밀리는 시영에게 무슨 일을 당했는지 모르는 표정으로 상황을 파악하려고 했다. 평소와 다른 모습이 조금 웃겼다.' },
      { speaker: 'emily', text: '감히…? 이게 대체 뭐 하는 짓이지?', voice: 'drinkparty/에밀리9' },
      { speaker: 'siyeong', text: '죄, 죄송해요… 그치만 하영이한테 너무 가까이 붙어서…', voice: 'drinkparty/시영4' },
      { speaker: 'minji', text: '캬하하하하! 꼴이 좋아! 시영아 잘했어, 꼴이 좋아!', expression: 'bigsmile', voice: 'drinkparty/민지8' },
      { speaker: 'emily', text: '너 지금 웃었냐? 너도 같이 죽고 싶어?', voice: 'drinkparty/에밀리10' },
      { speaker: 'minji', text: '어우, 귀족님 화나셨네. 알았어, 돌아볼게. 돌아보면 되잖아!', expression: 'smile', voice: 'drinkparty/민지9' },
      // 선택지 3. 시영에게 말하기
      {
        speaker: 'siyeong',
        text: '하영이는 내 거예요… 내가 찜해놨어요!!!!!',
        cg: ep03SiyeongCg,
        voice: 'drinkparty/시영5',
        choices: [
          {
            text: '시영아, 괜찮아? 에밀리한텐 같이 사과하자.',
            affection: { siyeong: 5 },
            reply: [{ speaker: 'siyeong', text: '하영이가 같이 가준다면… 저도 제대로 사과할게요.', voice: 'drinkparty/시영 호감1' }],
          },
          {
            text: '다들 진정해. 차례대로 얘기하자.',
            affection: { siyeong: 5 },
            reply: [{ speaker: 'siyeong', text: '네… 일단 진정할게요.', voice: 'drinkparty/시영 호감2' }],
          },
          {
            text: '시영아, 좀 무섭다…',
            affection: { siyeong: -5 },
            reply: [{ speaker: 'siyeong', text: '아… 미안해요. 무섭게 하려던 건 아닌데…', voice: 'drinkparty/시영 호감3' }],
          },
          {
            text: '네가 분위기 다 망쳤어. 그냥 가.',
            affection: { siyeong: -15 },
            stats: { mental: -3 },
            reply: [
              { speaker: 'siyeong', text: '……미안해. 나 때문에 다들 화났지.' },
              { text: '시영이가 손을 떨며 고개를 숙이자 나는 내가 심하게 말했다는 걸 깨달았다.', risk: { amount: 40, kind: 'excite' } },
              { speaker: 'player', text: '미안해. 일부러 그런 것도 아닌데 내가 화풀이했어.' },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '아니 그건… 아니야. 내 거야, 시영아. 방금 건 씹호감 행동이었지만 하영이는 양보 못 해.', voice: 'drinkparty/민지10', cg: null },
      { speaker: 'emily', text: '다 꺼져, 좋은 말로 할 때. 귀족은 귀족끼리가 어울리는 법.', voice: 'drinkparty/에밀리11-1 꺼져로 변경' },
      { speaker: 'emily', text: '어디 가문도 없는 놈들이 넘보는 거지.', voice: 'drinkparty/에밀리11-2 거지로 변경' },
      { speaker: 'minji', text: '아니, 네가 뭔데 끼어들어? 방금까지 옷 가리고 있었으면서!', expression: 'less', voice: 'drinkparty/민지11' },
      { speaker: 'emily', text: '야, 송민지. 너 진짜 한 번만 더 말해 봐.', voice: 'drinkparty/에밀리12' },
      { speaker: 'siyeong', text: '하영이는… 두 분한테 안 줄 거예요.', voice: 'drinkparty/시영6' },
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
    time: '낮',
    lines: [
      { text: '기말고사가 끝나고 여름방학이 시작되자, 에밀리가 갑자기 우리 셋을 가문 전용 워터파크에 초대했다.', background: roomImg },
      { text: '술자리에서 그렇게 싸워 놓고 왜 부르는 건지는 모르겠지만, 아무튼 오늘이 바로 그날이다.' },
      { speaker: 'player', text: '(내가 여자랑 워터파크를 가다니…… 그것도 여자 3명이랑…… 이게 대체 무슨 복이란 말인가.)' },
      { text: '뱀파이어라는 점을 제외하고는 일반 사람과 똑같아서 이제는 별다른 느낌이 들지 않는다.' },
      { text: '근데 오늘은 비키니 볼 생각에 벌써 흥분되기 시작했다. 하, 오늘은 진짜 조심해야 하는데.' },
      { text: '내가 흥분하면 심장이 빨리 뛰고 피도 빠르게 돌아서 피 냄새가 짙어진다. 냄새를 들키면 큰일이니까 최대한 진정하자.' },
      { text: '에밀리의 워터파크는 그냥 다른 느낌이었다. 실내에 바다를 그대로 옮겨 놓은 듯한 커다란 파도풀이 있었다.', background: waterparkImg },
      { speaker: 'player', text: '(나는 또 피로 되어 있는 워터파크인 줄 알고 좀 많이 놀랐네.)' },

      // 워터파크에 도착
      { speaker: 'minji', text: '야, 뭐해ㅐㅐㅐ. 하영아, 빨리 바지 안 벗어? 내가 벗긴다?', expression: 'bigsmile' },
      { speaker: 'emily', text: '아, 벌써 현기증이 날 것 같네. 하영이만 초대하는 건데.', stage: ['minji', 'emily'] },
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
      { speaker: 'emily', text: '하영아. 왜 그렇게 빤히 봐? 내 비키니가 그렇게 잘 어울리나?', cg: ep05Emily1Cg },
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
        text: '하영아, 왜 그렇게 봐? 내 수영복 예뻐?',
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
      { speaker: 'minji', text: '왜? 너도 하영이가 봐 줬으면 좋겠어?', expression: 'smile' },
      { speaker: 'emily', text: '뭐? 야, 말 조심해.' },

      // 시영의 수건
      { text: '파도풀 옆에는 네 사람의 수건이 놓여 있다. 그 옆에는 물놀이 중 다칠 때 쓸 수 있는 간이 구급함도 있었다.', hidePortrait: true },
      { text: '시영이 수건 옆에서 조심스럽게 나를 불렀다.' },
      { speaker: 'siyeong', text: '저…… 하영아. 내 수영복은…… 어때?', cg: ep05SiyeongCg },
      { speaker: 'player', text: '어? 응, 시영이도 진짜 잘 어울려. 예뻐.' },
      { text: '시영이 얼굴을 붉히며 수건을 살짝 끌어당긴다.' },
      { speaker: 'siyeong', text: '그, 그렇게 쳐다보니까 부끄러워요…… 그래도 하영이한테는 계속 보여 주고 싶어.', affection: { siyeong: 5 } },
      // 위험 상황 ③ 시영과의 대화
      { speaker: 'player', text: '(아까는 더한 것도 보여 줄 수 있다더니…… 이렇게 부끄러워하니까 또 귀엽네…….)', risk: { amount: 10, kind: 'excite' } },

      // 파도풀의 소동
      { speaker: 'minji', text: 'ㅋㅋㅋ 우리 하영이 놀리는 재미가 있네. 뭐 해, 시영아?', expression: 'bigsmile', stage: ['minji', 'siyeong', 'emily'], cg: null },
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
      { speaker: 'emily', text: '하영아, 거기 수건 좀 줘!' },
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
      { speaker: 'emily', text: '하영아, 넌 돌아보지 마! 너희 둘은 진짜 죽었어!' },
      { speaker: 'minji', text: '음, 저거는 잡히면 진짜 죽일 기세인데?', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'siyeong', text: '……어떡하죠……???????' },

      // 시영이의 손
      { speaker: 'minji', text: '음, 찾았다. 빈틈의 실!! 하영아, 시영이 팔 잡아!!!', expression: 'bigsmile' },
      { speaker: 'player', text: '어, 어?' },
      { text: '나도 모르게 시영이의 팔을 잡아 버렸다.' },
      { speaker: 'siyeong', text: '하영이가…… 내 손을……!', stage: ['siyeong'] },
      { text: '시영이 얼굴을 붉힌 채 내 손을 꼭 잡는다.' },
      { speaker: 'siyeong', text: '하영아…… 조금만 더 이렇게 있으면 안 돼?' },
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
              { speaker: 'siyeong', text: '하영이도…? 그럼 계속 이렇게 있자…' },
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
              { speaker: 'minji', text: '하영아, 갑자기 어디 가?', expression: 'surprised_soft' },
              { speaker: 'player', text: '아, 아니! 나 잠깐 수건 좀 쓰려고!' },
            ],
          },
          {
            text: '“이 정도는 괜찮겠지.” 하고 상처를 그대로 둔다.',
            affection: {},
            reply: [
              { text: '별일 아닐 거라 생각했는데 물기 사이로 피가 더 번졌다. 그제야 나는 놀라서 수건으로 손을 감쌌다.', risk: { amount: 40, kind: 'bleed' } },
              { speaker: 'siyeong', text: '하영아…? 여기서 나는 이 냄새…' },
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
      { speaker: 'siyeong', text: '하영이한테서… 인간의 피 냄새가 나요…' },
      { speaker: 'emily', text: '설마… 네가 인간이었다고?' },
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
    time: '오후',
    lines: [
      { text: '어느새 2학기 중간고사 기간이 되었다. 뱀파이어랑 우리 생각이 다른지 1학기 기말고사를 너무 망쳐서 같이 공부할 사람을 찾다가, 어쩌다 그 3명이랑 공부를 하게 되었다.', background: studyroomImg },
      { speaker: 'player', text: '(그래도 얘네들이 상위권이니까 공부하는 데 도움이 되겠지…?)' },
      { speaker: 'siyeong', text: '어떤 게 궁금해ㅐㅐㅐㅐ 다 물어봐. 내가 다…… 모두…… 다 알려줄게……', stage: ['minji', 'siyeong', 'emily'], voice: 'ep3/시영1' },
      { speaker: 'siyeong', text: '나에 대한 것도……ㅎ', voice: 'ep3/시영2' },
      { speaker: 'minji', text: '시영아, 지금 너 얼굴 너무 무서워.', expression: 'less', voice: 'ep3/민지1' },
      { text: '시영이는 내 옆으로 의자를 끌고 오더니 갑자기 머리끈을 꺼냈다.' },
      { speaker: 'siyeong', text: '으으… 아… 머리가 자꾸 내려와서… 하영아, 나 머리 좀 묶을게…', voice: 'ep3/시영3' },
      { text: '아니, 머리 묶는데 왜 이상한 소리를 내는 거야. 시영이는 일부러 내 쪽을 힐끔 보면서 머리를 천천히 묶었다.' },
      { text: '머리를 묶으니 목덜미가 보였다. 괜히 시선을 어디에 둬야 할지 모르겠고 심장이 조금씩 빨리 뛰는 것 같았다.' },
      // 선택지 1. 시영의 묶은 머리 (흥분 위험 ①, 생존 시 호감도 적용)
      {
        speaker: 'siyeong',
        text: '하영아… 나 머리 묶은 거… 어때?',
        voice: 'ep3/시영4',
        choices: [
          {
            text: '머리 묶으니까 공부하기 편하겠다.',
            affection: {},
            reply: [
              { speaker: 'siyeong', text: '응… 이제 하영이한테 문제도 더 잘 알려줄 수 있겠다…ㅎ', risk: { amount: 10, kind: 'excite' }, voice: 'ep3/시영 호감1' },
            ],
          },
          {
            text: '시영아, 머리 묶으니까 잘 어울려.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말…? 그럼 앞으로 하영이 앞에서는 계속 묶고 있을게…', voice: 'ep3/시영 호감2' },
              { text: '이렇게 좋아할 줄 알았으면 좀 더 덤덤하게 말할걸… 심장이 점점 빨라진다.', risk: { amount: 20, kind: 'excite' } },
            ],
          },
          {
            text: '그렇게 가까이 있으면 나도 두근거리잖아.',
            affection: { siyeong: 10 },
            reply: [
              { speaker: 'siyeong', text: '하영이도 두근거려…? 나랑 똑같네…ㅎ', voice: 'ep3/시영 호감3' },
              { text: '시영이가 더 가까이 다가왔다. 아, 내가 왜 그런 말을 했지? 심장이 터질 것 같다.', risk: { amount: 40, kind: 'excite' } },
            ],
          },
        ],
      },

      // 공부는 뒷전
      { speaker: 'minji', text: '하영아…… 나는 문제 좀 알려줄래?! 나는 이거, 이거, 이것까지!!!!!!! 다 모르겠어.', expression: 'bigsmile', voice: 'ep3/민지2' },
      { speaker: 'minji', text: '좀만 더 붙어서 설명해줘.', expression: 'shy_smile', voice: 'ep3/민지3' },
      { text: '민지가 내 쪽으로 바짝 붙어오자 에밀리가 민지의 책을 날려버리면서 말했다.' },
      { speaker: 'emily', text: '에휴 진짜 저급하다. 진짜 꺼지고 하영이 편하게 공부하게 다 꺼져.', voice: 'ep3/에밀리1' },
      { speaker: 'emily', text: '시끄러워서 집중을 할 수가 없네.', voice: 'ep3/에밀리2' },
      { speaker: 'emily', text: '혹시 연필로 찍혀 본 적은 없는 거지? 내가 경험시켜줘도 될까?', voice: 'ep3/에밀리3' },
      { speaker: 'player', text: '얘들아 제발 조용히 좀 해줘ㅠㅠㅠㅠ 나도 공부 좀 하자.' },
      { text: '내가 너무나도 실수했다. 얘네들이 그래도 상위권이고 그나마 같이 하자고 해서 도움이 될 줄 알았는데 공부에 집중을 하나도 못 하겠다.' },
      { speaker: 'minji', text: '그래그래 다 닥쳐. 진짜 집중하자.', voice: 'ep3/민지4' },
      { text: '민지가 다시 주워 온 책을 펴는 척하더니 나한테 바짝 다가와 귓속말했다.' },
      { speaker: 'minji', text: '모르는 문제 있으면 이따가 같이 몰래 나가서 물어볼게, 하영아.', expression: 'shy_smile', voice: 'ep3/민지5' },
      { speaker: 'player', text: '힉!!!' },
      { text: '갑자기 귀에 바람이 닿아서 놀랐다. 얼굴이 뜨거워지고 심장도 두근거리기 시작했다.' },
      { speaker: 'minji', text: '으으으… 아, 가슴 무거워. 공부 못 하겠다.', voice: 'ep3/민지6' },
      { text: '민지는 일부러 들으라는 듯 이상한 소리를 내더니 가슴을 책상 위에 턱 올려놓고 나를 바라봤다.' },
      { speaker: 'minji', text: '하영아, 나 이렇게 힘든데 좀 봐주면 안 돼?', expression: 'shy_smile', voice: 'ep3/민지7' },
      // 선택지 2. 민지의 귓속말 (흥분 위험 ②, 귓속말과 책상 장면을 합쳐 한 번만 판정)
      {
        text: '아니 얘도 대체 왜 이러는 거야. 지금 중간고사 공부하러 온 거 맞아?',
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
      { speaker: 'siyeong', text: '하…… 하영이랑 두…… 둘이……? 그럼 안…… 갈래……', voice: 'ep3/시영7' },
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
      // TODO(더빙): 대사가 바뀌어 기존 녹음(ep3/에밀리18)을 뺐음. 다시 녹음하면 voice 추가
      { speaker: 'emily', text: '흥, 그렇도록 하지. 내가 미안하니까 이번 중간고사가 끝나면 우리 가문의 전용 워터파크에 다시 초대해주지……' },
      { speaker: 'minji', text: '워터파크?! 진짜?!', expression: 'bigsmile', voice: 'ep3/민지13' },
      { speaker: 'siyeong', text: '하영이랑… 같이 가는 거야…?', voice: 'ep3/시영14' },
      { speaker: 'player', text: '워터파크에 또 가자고?!' },
      { name: '다 같이', text: '야호ㅗㅗㅗ 너무 좋아ㅏㅏㅏ!!!', voice: ['ep3/에밀리19', 'ep3/시영15'] },
      { text: '이렇게 중간고사 공부를 하다가 또 워터파크에 가게 되었다.', hidePortrait: true },
      { speaker: 'player', text: '(근데 우리… 오늘 공부는 얼마나 한 거지?)' },
    ],
  },
  // EP 6. 메이드카페의 첫 출근
  10: {
    id: 'month-9',
    title: '메이드카페의 첫 출근',
    icon: '☕',
    time: '밤',
    lines: [
      // 고수익 아르바이트
      { text: '뱀파이어 대학의 인간 사회 적응 실습. 나와 세 사람은 일주일 동안 인간 세상에서 생활하게 됐다.' },
      { text: '네 사람은 생활비를 벌기 위해 밤에 할 수 있는 아르바이트를 찾던 중, 민지가 발견한 공고 앞에 모여 있었다.' },
      { name: 'SYSTEM', text: '「야간 메이드카페 단기 아르바이트 모집」 일주일 근무 / 높은 시급 / 식사 제공' },
      { speaker: 'minji', text: '야, 여기 봐. 시급 엄청 센데?', expression: 'bigsmile' },
      { speaker: 'player', text: '진짜네. 다른 데보다 훨씬 많이 준다.' },
      { speaker: 'emily', text: '……메이드카페?', stage: ['minji', 'emily'] },
      { speaker: 'minji', text: '왜? 돈 많이 준다잖아.' },
      { speaker: 'emily', text: '돈을 준다고 해서 아무 옷이나 입을 수는 없지.' },
      { speaker: 'minji', text: '그럼 넌 빠져. 나랑 하영이랑 시영이끼리 갈게.', expression: 'smile' },
      { speaker: 'emily', text: '잠깐. 누가 안 간다고 했니?' },
      { speaker: 'siyeong', text: '저도… 하영이가 가면 갈게요.', stage: ['minji', 'siyeong', 'emily'] },
      { text: '결국 네 사람은 함께 메이드카페를 찾아갔고, 일손이 필요했던 점장은 그날 밤부터 일해 볼 수 있겠냐고 물었다.' },
      { text: '나는 집사복을, 세 사람은 메이드복을 받아 들고 탈의실로 들어갔다.', hidePortrait: true },

      // 메이드복을 입은 세 사람
      { text: '먼저 나온 건 민지였다. 짧은 프릴이 달린 앞치마를 정리하던 민지가 나를 보더니 한 바퀴 돌아 보였다.' },
      { speaker: 'minji', text: '어때? 나 이런 것도 잘 어울리지?', expression: 'bigsmile' },
      { speaker: 'player', text: '어… 응. 생각보다 잘 어울리는데?' },
      { speaker: 'minji', text: '생각보다?', expression: 'less' },
      { speaker: 'player', text: '아니, 그게 아니라…' },
      { speaker: 'minji', text: '됐어. 이따가 제대로 다시 물어볼게.', expression: 'shy_smile' },
      { text: '민지가 내 집사복 넥타이를 손가락으로 툭 건드렸다. 가까이 다가온 얼굴을 보고 있자 괜히 시선을 어디에 둬야 할지 모르겠다.' },
      // 위험 상황 ① 민지가 가까이 다가옴
      { text: '얼굴이 뜨거워지고 심장이 조금 빨라졌다. 이러다 내 피 냄새가 짙어질지도 모른다. 나는 들키지 않게 숨을 골랐다.', risk: { amount: 10, kind: 'excite' } },
      { text: '그때 에밀리가 탈의실에서 나왔다. 단정하게 입은 메이드복이 평소의 도도한 모습과는 또 다른 느낌이었다.', stage: ['minji', 'emily'] },
      { speaker: 'minji', text: '와. 귀족 아가씨가 메이드복을 다 입네?', expression: 'smile' },
      { speaker: 'emily', text: '옷만 입는 거라면 어려운 일도 아니지.' },
      { speaker: 'minji', text: '그래? 아까 탈의실에서 “이 프릴은 대체 왜 이렇게 많은 거야” 하던데.', expression: 'smile' },
      { speaker: 'emily', text: '……그걸 왜 듣고 있었니?' },
      { speaker: 'minji', text: '네 목소리가 컸거든.' },
      { speaker: 'emily', text: '야, 송민지. 입 다물어.' },
      { text: '두 사람이 서로 노려보는 사이, 시영이가 탈의실 문을 조금 열고 고개를 내밀었다.' },
      { speaker: 'siyeong', text: '저… 나가도 돼요?', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'player', text: '응? 당연하지.' },
      { text: '시영이는 앞치마 끝을 만지작거리며 천천히 나왔다. 내 쪽을 보다가 눈이 마주치자 바로 시선을 내렸다.' },
      { speaker: 'siyeong', text: '하영아… 이상하지 않아?' },
      { speaker: 'player', text: '아니. 잘 어울려.' },
      { speaker: 'siyeong', text: '저, 정말?' },
      { speaker: 'player', text: '응. 예뻐.' },
      { text: '시영이의 얼굴이 빨개졌다. 그러더니 내 옆으로 와서 작은 목소리로 말했다.' },
      { speaker: 'siyeong', text: '그럼 오늘은 하영이한테만 먼저 보여 준 거네요.' },
      { speaker: 'minji', text: '어? 우리도 여기 있는데?', expression: 'surprised_soft' },
      { speaker: 'siyeong', text: '…하영이한테 먼저 물어봤다는 뜻이에요.' },

      // 하영이 손님 역할
      { text: '영업이 시작되기 전, 점장은 네 사람에게 인사와 주문받는 법을 알려 줬다.' },
      { name: '점장', text: '처음이니까 서로 손님 역할을 해 보면서 연습해 보세요. 저는 주방 준비하고 있을게요.' },
      { text: '점장이 자리를 비우자 민지가 메뉴판을 들어 올렸다.' },
      { speaker: 'minji', text: '이런 건 내가 제일 잘하지. 사람 상대하는 거잖아.', expression: 'bigsmile' },
      { speaker: 'emily', text: '네가? 방금도 메뉴판을 손님 쪽이 아니라 네 쪽으로 들고 있었단다.' },
      { speaker: 'minji', text: '아, 연습이잖아. 넌 얼마나 잘하는데?', expression: 'less' },
      { speaker: 'emily', text: '적어도 너보다는 잘할 자신이 있구나.' },
      { speaker: 'minji', text: '그럼 해 보든가. 하영아, 네가 손님 해.' },
      { speaker: 'player', text: '내가?' },
      { speaker: 'minji', text: '응. 우리 둘 중에 누가 더 잘하는지 네가 골라 줘.', expression: 'smile' },
      { speaker: 'siyeong', text: '저도 할래요.' },
      { speaker: 'emily', text: '시영이 너도?' },
      { speaker: 'siyeong', text: '네. 하영이 시중은 저도 들어 보고 싶어요.' },
      { text: '결국 나는 테이블에 앉았고, 세 사람은 돌아가며 나를 손님으로 응대하기로 했다.', hidePortrait: true },

      // 민지의 시중
      { text: '민지가 내 앞에 메뉴판을 놓으며 활짝 웃었다.' },
      { speaker: 'minji', text: '어서 오세요, 주인님. 오늘은 어떤 걸로 준비해 드릴까요?', expression: 'bigsmile' },
      { text: '평소와 다르게 상냥한 목소리였다. 내가 메뉴판을 보는 동안 민지는 의자를 내 옆으로 살짝 끌어왔다.' },
      { speaker: 'player', text: '손님 옆에 앉아도 되는 거야?' },
      { speaker: 'minji', text: '연습이니까 괜찮지. 주인님은 내가 옆에 있으면 싫어?', expression: 'shy_smile' },
      { speaker: 'player', text: '싫은 건 아닌데…' },
      { speaker: 'minji', text: '그럼 됐네.', expression: 'smile' },
      { text: '민지가 손을 뻗어 조금 비뚤어진 내 넥타이를 바로잡았다. 손끝이 목 가까이에 닿자 나도 모르게 몸이 굳었다.' },
      { speaker: 'minji', text: '자, 이제 잘생겨졌네.', expression: 'smile' },
      { speaker: 'player', text: '원래는 아니었다는 거야?' },
      { speaker: 'minji', text: '원래도 괜찮았는데, 내 취향으로 고쳐 놨다고.', expression: 'shy_smile' },
      { text: '민지는 내 반응을 살피더니 만족한 듯 웃었다.' },
      { speaker: 'minji', text: '이따가 누구 고를 건지 잘 생각해 봐. 나 고르면 오늘 계속 이렇게 해 줄 수도 있어.', expression: 'bigsmile' },

      // 에밀리의 시중
      { text: '민지가 물러나자 에밀리가 찻잔과 접시를 들고 내 앞으로 왔다. 찻잔을 조심스럽게 내려놓은 뒤, 메뉴판을 펼쳐 보였다.', stage: ['emily'] },
      { speaker: 'emily', text: '오늘의 차를 준비해 드렸습니다. 단맛이 필요하시면 설탕도 가져다드리지요.' },
      { speaker: 'player', text: '어… 고마워.' },
      { speaker: 'emily', text: '손님께서는 편하게 말씀하셔도 됩니다. 다른 필요한 것은 없으신가요?' },
      { text: '아까 민지와 다툴 때와는 달리 말투도, 표정도 완벽하게 메이드 같았다.' },
      { speaker: 'minji', text: '오, 잘하는데? 집에서 맨날 시중만 받던 애가.', expression: 'smile', stage: ['minji', 'emily'] },
      { speaker: 'emily', text: '조용히 하렴. 지금 손님을 모시는 중이니까.' },
      { text: '에밀리는 다시 나를 바라보더니 살짝 몸을 숙였다.', stage: ['emily'] },
      { speaker: 'emily', text: '하영아, 아니… 주인님. 제 시중은 마음에 드시나요?' },
      { text: '얼굴이 가까워지자 찻잔을 들려던 손이 멈췄다.' },
      // 위험 상황 ② 에밀리의 얼굴이 가까워짐
      { speaker: 'player', text: '(너무 가까운데… 진정하자. 피 냄새가 짙어지기라도 하면 큰일이다.)', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'player', text: '으, 응. 잘하는 것 같아.' },
      { speaker: 'emily', text: '그것뿐인가요?' },
      { speaker: 'player', text: '잘 어울리고… 예뻐.' },
      { speaker: 'emily', text: '……' },
      { text: '에밀리는 대답하지 않고 몸을 일으켰다. 귀가 살짝 빨개진 것 같았지만 모르는 척했다.' },
      { speaker: 'emily', text: '흠. 손님을 보는 눈은 나쁘지 않군.' },

      // 시영의 시중
      { text: '마지막으로 시영이가 내 앞에 섰다. 두 손을 앞에 모으고 한참을 망설이더니 조심스럽게 입을 열었다.', stage: ['siyeong'] },
      { speaker: 'siyeong', text: '어서 오세요… 주인님.' },
      { speaker: 'minji', text: '목소리가 너무 작아. 손님이 못 듣겠다.', stage: ['minji', 'siyeong'] },
      { speaker: 'siyeong', text: '아… 죄송해요. 다시…' },
      { speaker: 'player', text: '나는 잘 들었어. 천천히 해도 돼.' },
      { text: '내 말에 시영이는 작게 고개를 끄덕였다. 그리고 내 앞에 놓인 찻잔을 보고는 냅킨을 가져와 옆에 놓았다.', stage: ['siyeong'] },
      { speaker: 'siyeong', text: '혹시 뜨거우면 이거 쓰세요. 아까 찻잔 잡으실 때 조금 놀란 것 같아서…' },
      { speaker: 'player', text: '그거 봤어?' },
      { speaker: 'siyeong', text: '네. 계속 보고 있었어요.' },
      { text: '시영이는 수줍게 웃더니 내 손 가까이에 자기 손을 살짝 올렸다.' },
      // 위험 상황 ③ 시영의 손이 가까이 다가옴
      { text: '차가운 손이 가까이 오자 조금 진정됐던 심장이 다시 빨라졌다. 나는 시선을 찻잔으로 옮기고 천천히 숨을 내쉬었다.', risk: { amount: 10, kind: 'excite' } },
      { speaker: 'siyeong', text: '하영아. 나 오늘 열심히 할게.' },
      { speaker: 'player', text: '응. 벌써 잘하고 있어.' },
      { speaker: 'siyeong', text: '그러니까… 조금 이따 고를 때, 나 골라 주면 안 돼?' },
      { text: '옆에서 듣고 있던 에밀리가 한숨을 쉬었다.', stage: ['siyeong', 'emily'] },
      { speaker: 'emily', text: '그렇게 직접 고르라고 하면 연습이 아니지 않니?' },
      { speaker: 'siyeong', text: '에밀리도 아까 하영이한테 예쁘다는 말 들었잖아요.' },
      { speaker: 'emily', text: '그건 하영이가 먼저 한 말이야.' },
      { speaker: 'minji', text: '둘 다 시끄러워. 이제 하영이가 고르면 되잖아.', expression: 'less', stage: ['minji', 'siyeong', 'emily'] },

      // 선택지 1. 가장 마음에 드는 시중 (고른 히로인에게만 호감도)
      {
        text: '세 사람의 시선이 동시에 나를 향했다. 다들 정말 내가 누구를 고를지 기다리고 있었다.',
        choices: [
          {
            text: '나는 민지의 시중이 제일 좋았어.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '역시! 하영이는 나 고를 줄 알았다니까.', expression: 'bigsmile' },
              { speaker: 'emily', text: '방금 손님 옆에 멋대로 앉았는데도?' },
              { speaker: 'minji', text: '손님이 좋다잖아. 그렇지, 주인님?', expression: 'shy_smile' },
              { text: '민지가 내 어깨에 팔을 살짝 걸쳤다. 기분 좋게 웃는 모습을 보니 나도 괜히 얼굴이 뜨거워졌다.' },
              { speaker: 'siyeong', text: '…다음에는 제가 더 잘할게요.' },
            ],
          },
          {
            text: '나는 에밀리의 시중을 받고 싶어.',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '흠. 당연한 결과로군.' },
              { speaker: 'minji', text: '당연은 무슨. 아까 하영이한테 얼굴 엄청 가까이 들이밀었으면서.', expression: 'less' },
              { speaker: 'emily', text: '손님과 눈을 맞춘 것뿐이야.' },
              { speaker: 'player', text: '그래도 진짜 잘 어울렸어.' },
              { speaker: 'emily', text: '……그 말은 한 번만 해도 돼.' },
              { text: '에밀리는 고개를 돌렸지만, 입가에 미소가 살짝 걸려 있었다.' },
            ],
          },
          {
            text: '나는 시영이의 시중을 받고 싶어.',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '저, 정말? 나 골라 준 거야?' },
              { speaker: 'player', text: '응. 내가 필요한 것도 먼저 챙겨 줬잖아.' },
              { speaker: 'siyeong', text: '그럼… 오늘은 내가 하영이를 계속 챙겨도 돼?' },
              { speaker: 'minji', text: '야, 이제 연습 끝났어. 진짜 손님 챙겨야지.', expression: 'less' },
              { speaker: 'siyeong', text: '알아요. 그래도 하영이는 제가 챙길 거예요.' },
              { text: '시영이는 내 옆에 서서 내 소매를 살짝 붙잡았다.' },
            ],
          },
        ],
      },
      { text: '주방에서 나온 점장이 우리 쪽을 바라봤다.' },
      { name: '점장', text: '연습은 다 했어요? 이제 곧 문 열게요.' },
      { speaker: 'minji', text: '네! 저희 준비됐어요!', expression: 'bigsmile' },
      { speaker: 'emily', text: '아까 손님 옆에 앉은 건 따라 하지 마렴.' },
      { speaker: 'minji', text: '또 시작이네. 하영이가 좋다는데 왜 네가 뭐라 해?', expression: 'less' },
      { speaker: 'player', text: '얘들아, 손님 들어오신다.' },
      { text: '우리는 서둘러 각자의 자리로 돌아갔다.', hidePortrait: true },

      // 첫 손님과 피 냄새
      { text: '처음에는 생각보다 일이 잘 풀렸다.' },
      { text: '민지는 밝게 손님을 맞이했고, 에밀리는 차분하게 주문을 받았다. 시영이는 내 옆에서 주문서를 정리하며 빠진 것이 없는지 확인했다.' },
      { speaker: 'player', text: '(이 정도면 오늘 무사히 끝낼 수 있겠는데?)' },
      { text: '그때 민지가 차를 가져다준 테이블에서 작은 소리가 났다.' },
      { name: '손님', text: '아…' },
      { text: '손님이 찻잔을 들다가 금이 가 있던 손잡이가 부러진 것이다. 깨진 부분에 손가락이 긁혔는지, 손끝에 붉은 피가 맺혔다.' },
      { speaker: 'minji', text: '손님, 괜찮으세…', expression: 'surprised_soft' },
      { text: '말을 하던 민지가 멈췄다.' },
      { text: '손님의 손끝에서 난 피 냄새가 민지에게 닿은 것이다. 민지는 붉게 맺힌 피를 가만히 바라보다가 천천히 손을 뻗었다.' },
      { speaker: 'minji', text: '……잠깐만요.' },
      { name: '손님', text: '네?' },
      { text: '민지가 손님의 손을 잡으려고 더 가까이 다가갔다. 표정이 아까와 달랐다.' },
      { text: '나는 급하게 두 사람 사이로 끼어들었다.' },
      { speaker: 'player', text: '민지야, 잠깐! 점장님 불러올게!' },
      { speaker: 'minji', text: '하영아, 잠깐만. 나 저 냄새…' },
      { speaker: 'player', text: '그러니까 잠깐만 떨어져 있어!' },
      { text: '나는 민지의 팔을 붙잡았다. 그 사이 점장이 다가와 손님을 카운터 쪽으로 안내했다.' },
      { text: '하지만 민지는 자꾸 손님 쪽을 바라보며 앞으로 가려고 했다.' },
      { speaker: 'minji', text: '놔 봐. 나 진짜 잠깐만…', expression: 'less' },
      { speaker: 'player', text: '그 잠깐이 안 된다니까!' },
      { text: '이를 본 에밀리가 달려와 민지의 반대쪽 팔을 잡아당겼다.', stage: ['minji', 'emily'] },
      { speaker: 'emily', text: '송민지, 정신 차려! 여기 인간들 앞이야!' },
      { speaker: 'minji', text: '아, 알아! 아는데 냄새가 자꾸 나잖아!', expression: 'less' },
      { speaker: 'emily', text: '그러니까 뒤로 가라고, 이 미친년아!' },
      { text: '에밀리가 민지를 당기는 순간, 민지가 버티던 발이 의자에 걸렸다. 셋이 한꺼번에 휘청거리자 시영이가 달려와 민지의 팔을 붙잡았다.', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'siyeong', text: '민지야, 이쪽으로 와!' },
      { speaker: 'minji', text: '다들 좀 놔 봐!', expression: 'less' },
      { speaker: 'siyeong', text: '하영이까지 넘어지잖아! 가만히 있어!' },
      { text: '하지만 이미 늦었다.' },
      { text: '민지의 팔을 잡고 있던 나는 중심을 잃었고, 내 뒤에 있던 찻잔 쟁반까지 건드리고 말았다.' },
      { text: '쨍그랑!' },
      { text: '바닥에 찻잔이 떨어지는 소리가 가게 안에 울렸다. 가까스로 민지를 손님에게서 떼어 놓기는 했지만, 우리 네 명은 의자와 앞치마가 엉킨 채 바닥에 주저앉아 있었다.' },
      { text: '바닥을 짚은 손바닥이 따끔했다. 떨어진 찻잔 조각에 쓸렸는지 손에 붉은 피가 조금 배어 나왔다.' },
      // 위험 상황 ④ 손바닥 출혈 (실제 피가 나서 정신력 회피 없이 위장도만 적용) + 선택지 2. 손바닥에서 피가 났을 때
      {
        text: '아까 다친 손님의 피 냄새에 섞여 아직 아무도 눈치채지 못한 것 같다. 하지만 바로 옆에는 피 냄새에 정신을 차리지 못하는 민지가 있었다.',
        risk: { amount: 20, kind: 'bleed' },
        choices: [
          {
            text: '주머니에 있던 냅킨으로 바로 상처를 누른다.',
            affection: {},
            reply: [
              { text: '나는 앞치마 주머니에서 깨끗한 냅킨을 꺼내 손바닥을 감쌌다. 피가 더 번지지 않도록 누른 채 민지와 조금 거리를 뒀다.' },
              { speaker: 'player', text: '민지야, 손님은 점장님이 보고 계셔. 이제 우리도 물러나자.' },
              { speaker: 'minji', text: '……알겠어. 미안.', expression: 'less' },
              { text: '숨을 고르자 냅킨 밖으로 번지던 피도 조금씩 멈췄다.', risk: { amount: -10, kind: 'calm' } },
            ],
          },
          {
            text: '민지의 팔부터 붙잡고 내 상처는 그대로 둔다.',
            affection: { minji: 5 },
            reply: [
              { text: '다시 손님 쪽을 바라보는 민지를 놓치지 않으려 팔부터 붙잡았다. 그 사이 상처에서 나온 피가 손가락을 타고 민지의 바로 앞까지 번졌다.', risk: { amount: 50, kind: 'bleed' } },
              { speaker: 'minji', text: '잠깐… 이 냄새…', expression: 'surprised_soft' },
              // 위험도 100 미만으로 살아남았을 때
              { speaker: 'siyeong', text: '하영아, 손 다쳤잖아. 이거부터 감아!' },
              { text: '시영이가 앞치마 주머니에서 냅킨을 꺼내 내 손에 쥐여 줬다. 나는 뒤늦게 상처를 눌렀다.' },
              { text: '민지의 시선은 아직 카운터 쪽 손님을 향해 있었다. 뒤늦게 나를 보더니 민지가 굳은 표정으로 말했다.' },
              { speaker: 'minji', text: '하영아… 나 붙잡다가 다친 거야?', expression: 'less' },
              { speaker: 'player', text: '괜찮아. 너부터 진정해.' },
              { speaker: 'minji', text: '…미안. 고마워.', expression: 'shy_smile' },
              { text: '손님의 피 냄새가 남아 있는 데다 곧바로 상처를 가린 덕분인지, 민지는 내 정체까지 알아차리지는 못한 것 같다.' },
            ],
          },
        ],
      },
      { text: '잠시 뒤, 손님에게 밴드를 건네고 돌아온 점장이 그 모습을 바라봤다.' },
      { name: '점장', text: '……지금 뭐 하는 거예요?' },
      { speaker: 'player', text: '그게…' },
      { speaker: 'minji', text: '죄송합니다.', expression: 'less' },
      { speaker: 'emily', text: '저희가 설명을…' },
      { name: '점장', text: '손님이 다쳐서 놀라셨는데 그 앞에서 네 분이 엉켜 넘어지면 어떡해요.' },
      { text: '점장은 바닥에 깨진 찻잔과 주변에서 우리를 바라보는 손님들을 번갈아 봤다.' },
      { name: '점장', text: '죄송하지만 네 분, 오늘까지만 하세요.' },
      { speaker: 'player', text: '네?' },
      { name: '점장', text: '남은 근무는 안 나오셔도 됩니다.' },
      { text: '그렇게 우리의 메이드카페 아르바이트는 첫날에 끝났다.', hidePortrait: true },

      // 해고 엔딩
      { text: '가게 밖으로 나온 우리는 말없이 서 있었다. 조금 전까지 입고 있던 메이드복과 집사복은 모두 돌려주고 나온 뒤였다.' },
      { speaker: 'minji', text: '……미안. 나 때문에 잘렸네.', expression: 'less', stage: ['minji', 'siyeong', 'emily'] },
      { speaker: 'emily', text: '그러게 왜 손님한테 다가가니.' },
      { speaker: 'minji', text: '나도 그러고 싶어서 그런 건 아니거든?', expression: 'less' },
      { speaker: 'emily', text: '알아. 그래도 네가 조금만 더 갔으면…' },
      { text: '에밀리가 말을 멈췄다. 민지도 자기가 무슨 짓을 할 뻔했는지 생각났는지 더는 대꾸하지 않았다.' },
      { speaker: 'siyeong', text: '그래도 손님은 크게 안 다쳐서 다행이에요.' },
      { speaker: 'player', text: '응. 우리도 정체는 안 들켰고…' },
      { speaker: 'minji', text: '근데 이제 돈은 어떻게 벌어?' },
      { text: '네 사람은 동시에 조용해졌다.' },
      { text: '조금 전까지 나는 메이드복을 입은 세 사람에게 시중을 받고 있었다. 그리고 한 시간도 지나지 않아 첫 아르바이트에서 해고당했다.' },
      { speaker: 'player', text: '…일단 다른 공고부터 찾아보자.' },
      { speaker: 'minji', text: '이번엔 시급 높은 걸로.', expression: 'smile' },
      { speaker: 'emily', text: '이번엔 네가 손님에게 달려들지 않을 곳으로 찾아야겠구나.' },
      { speaker: 'minji', text: '야, 너 진짜—', expression: 'less' },
      { speaker: 'player', text: '제발. 우리 아직 인간 세상이야.' },
      { text: '세 사람이 나를 바라봤다.' },
      { speaker: 'siyeong', text: '그럼 숙소 가서 싸우세요.' },
      { speaker: 'player', text: '아니, 거기서도 싸우면 안 되지!' },
      { name: 'END', text: '메이드카페 첫날 해고' },
    ],
    badEnding: [
      { speaker: 'minji', text: '……하영아. 이거 네 손에서 나는 냄새야?', expression: 'surprised_soft', stage: ['minji', 'siyeong', 'emily'] },
      { text: '민지는 붙잡힌 팔을 내려다보다가 내 손바닥으로 시선을 옮겼다.' },
      { speaker: 'player', text: '아, 아니. 아까 손님 피가 묻어서…' },
      { speaker: 'emily', text: '잠깐. 손님 피가 아니라 하영이 손에서 나고 있잖아.' },
      { speaker: 'siyeong', text: '하영아… 너 설마…' },
      { text: '나는 급히 손을 감추려 했지만 시영이가 내 손목을 붙잡았다. 상처에서 난 인간의 피 냄새가 세 사람에게 그대로 전해졌다.' },
      { speaker: 'minji', text: '너… 인간이었어?', expression: 'surprised_soft' },
      { text: '피 냄새에 이미 이성을 잃어 가던 민지가 내게 다가왔다. 뒤로 물러나려 했지만 바닥에 널린 의자에 발이 걸렸다.' },
      { speaker: 'player', text: '잠깐만, 얘들아…' },
      { text: '내 말이 끝나기도 전에 세 사람의 시선이 내 손목으로 쏠렸다. 도망칠 틈도 없이 시야가 흐려졌다.', hidePortrait: true },
      { text: '그렇게 나는 정체가 들킨 채 메이드카페에서 목숨을 잃었다.' },
      { name: 'BAD END', text: '메이드카페에 숨어든 인간' },
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
      time: '오후',
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
      time: '오후',
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
      time: '오후',
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
  time: '저녁',
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
  const expand = (list: EpisodeLine[]): EpisodeLine[] =>
    list.flatMap((line) => {
      if (!line.choices) return [line];
      const choice = line.choices[picks[k++]] ?? line.choices[0];
      const { choices: _choices, ...rest } = line;
      return [rest, { speaker: 'player' as const, text: choice.text }, ...expand(choice.reply)];
    });
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

// 에피소드의 대표 캐릭터 (주인공이 아닌 첫 화자, 없으면 주인공)
export function getMainSpeaker(episode: Episode): Speaker {
  return episode.lines.find((l) => l.speaker && l.speaker !== 'player')?.speaker ?? 'player';
}
