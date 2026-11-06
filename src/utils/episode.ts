import hayeongImg from '../img/character/hayeong/hayeong_default.png';
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
import corridorImg from '../img/background/corridor.png';
import clubRoomImg from '../img/background/club_room.png';
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
import type { Effect } from './activity';

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
  // 있으면 이 대사부터 배경을 바꿈 (장면 전환)
  background?: string;
  // 있으면 이 대사부터 캐릭터 이미지를 내림 (다음에 히로인이 말하면 다시 등장)
  hidePortrait?: boolean;
  // 있으면 이 대사부터 여러 캐릭터를 같이 세움 (왼쪽부터, 최대 3명. 예: ['emily', 'minji'])
  // 그중 누가 말하는 동안 유지되고, 무대에 없는 캐릭터가 말하면 다시 그 캐릭터 1명만 섬
  stage?: Speaker[];
  // 대사창 대신 화면 효과로 보여줌 ('system-error': 대사마다 붉은 오류 창을 새로 띄움)
  effect?: 'system-error';
  // 있으면 이 대사 후 선택지 표시
  choices?: Choice[];
  // 있으면 이 대사 후 화면 전환과 함께 쯔꾸르 게임 실행 (public 아래 폴더 이름, 예: 'hayeong')
  game?: string;
  // 게임 창 제목 표시줄에 보여줄 이름 (없으면 폴더 이름)
  gameTitle?: string;
  // 게임이 알려준 엔딩(GameEnd.ending)별로 게임 직후 이어지는 대사
  gameEndings?: Record<string, EpisodeLine[]>;
}

// 쯔꾸르 게임이 끝날 때 게임 쪽에서 보내는 메시지
// 게임 이벤트의 스크립트 명령으로 호출:
//   window.parent.postMessage({ type: 'game-end', ending: 'A', stats: { strength: 10, stress: 20 } }, '*')
// ending: 'A'(예정된 승리) · 'B'(끝나지 않은 악몽) · 'C'(마왕님의 남편)
// stats: 게임에서 얻은 스탯 변화량 (health·strength·intellect·stress, 자금은 coins)
export const GAME_END_TYPE = 'game-end';

export interface GameEnd {
  ending?: string;
  stats?: Effect;
}

const EFFECT_KEYS: (keyof Effect)[] = ['health', 'strength', 'intellect', 'stress', 'coins'];

// 게임이 보낸 메시지를 읽음 (게임 끝 메시지가 아니면 null, 'game-end' 문자열만 와도 인정)
export function parseGameEnd(data: unknown): GameEnd | null {
  if (data === GAME_END_TYPE) return {};
  if (typeof data !== 'object' || data === null || (data as { type?: unknown }).type !== GAME_END_TYPE) return null;
  const { ending, stats } = data as { ending?: unknown; stats?: unknown };
  const end: GameEnd = {};
  if (typeof ending === 'string') end.ending = ending;
  if (typeof stats === 'object' && stats !== null) {
    end.stats = {};
    for (const key of EFFECT_KEYS) {
      const value = Number((stats as Record<string, unknown>)[key]);
      if (Number.isFinite(value) && value !== 0) end.stats[key] = Math.round(value);
    }
  }
  return end;
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
}

// 임시 에피소드. 달(1~12)별로 지정하고, 없는 달은 DEFAULT_EPISODE
const EPISODES: Record<number, Episode> = {
  4: {
    id: 'month-4',
    title: '평범하지 않은 대학 생활',
    icon: '🌸',
    background: campusSpringImg,
    lines: [
      // SCENE 01. 익숙한 친구 — 캠퍼스, 오전
      { text: '팡운대학교 캠퍼스. 벚꽃이 한창이다.' },
      { speaker: 'player', text: '(4월. 대학에 입학한 지도 벌써 한 달이 지났다.)' },
      { speaker: 'player', text: '(처음에는 대학생이 되면 뭔가 엄청난 일이 생길 줄 알았다.)' },
      { speaker: 'player', text: '(새로운 친구도 사귀고, 연애도 하고……. 뭐, 아무튼 그런 거.)' },
      { speaker: 'player', text: '(그런데 막상 대학에 와보니 생각보다 별거 없었다.)' },
      { speaker: 'minji', text: '야아아! {name}!', expression: 'bigsmile' },
      { speaker: 'player', text: '아, 깜짝이야! 아침부터 왜 이렇게 시끄러워?' },
      { speaker: 'minji', text: '뭐래ㅋㅋㅋ 아, 맞다. 너 이제 속은 괜찮냐?', expression: 'smile' },
      { speaker: 'player', text: '……뭔 소리야?' },
      { speaker: 'minji', text: '개강총회 때처럼 또 토할까 봐~ㅋㅋㅋㅋ', expression: 'bigsmile' },
      { speaker: 'player', text: '야, 그 얘기 좀 그만해라.' },
      { speaker: 'minji', text: 'ㅋㅋㅋㅋ 알았어, 알았어.', expression: 'smile' },
      { text: '민지가 {name}의 어깨를 툭 친다.' },
      { speaker: 'minji', text: '아 맞다! 너 오늘 과제했냐?' },
      { speaker: 'player', text: '……무슨 과제?' },
      { speaker: 'minji', text: '엥? 야ㅋㅋㅋ 너 진짜 몰라?', expression: 'smile' },
      { speaker: 'minji', text: '교수님이 일주일 전에 공지했잖아.' },
      { speaker: 'player', text: '……. 아.' },
      { speaker: 'minji', text: 'ㅋㅋㅋㅋㅋㅋㅋㅋ 야, 너 진짜 내가 없으면 어떻게 살래?', expression: 'bigsmile' },
      { speaker: 'player', text: '그러게. 큰일이네.' },
      { speaker: 'minji', text: '에휴~ 내가 한 거 보여줄 테니까 빨리 와.', expression: 'smile' },
      { text: '민지가 앞서 걸어간다.' },
      { speaker: 'player', text: '(송민지. 고등학교 때부터 알고 지낸 친구다.)' },
      { speaker: 'player', text: '(맨날 놀리면서도 은근히 잘 챙겨주는 녀석.)' },
      {
        speaker: 'player',
        text: '(이럴 때 보면 꽤 고맙다.)',
        choices: [
          {
            text: '역시 송민지밖에 없다니까? 오늘 점심 내가 살게.',
            affection: { minji: 5 },
            reply: [
              { speaker: 'minji', text: '엥? 진짜? ㅋㅋㅋ 웬일이래?', expression: 'smile' },
              { speaker: 'player', text: '왜, 싫으면 말고.' },
              { speaker: 'minji', text: '아니?! 완전 좋지!', expression: 'bigsmile' },
              { speaker: 'minji', text: '야, 약속했다? 도망가면 죽는다ㅋㅋㅋ', expression: 'smile' },
            ],
          },
          {
            text: 'ㅋㅋㅋ 너 없으면 나 진짜 졸업 못 하겠다.',
            affection: { minji: 2 },
            reply: [
              { speaker: 'minji', text: '이제야 내 소중함을 아는구나?', expression: 'shy_smile' },
              { speaker: 'player', text: '어어, 알겠으니까 과제나 보여줘.' },
              { speaker: 'minji', text: '야ㅋㅋㅋㅋ 감동 다 깨졌잖아!' },
            ],
          },
          {
            text: '야, 친구끼리 그 정도는 당연히 해줘야지.',
            affection: { minji: -3 },
            reply: [
              { speaker: 'minji', text: '……뭐? 너 지금 내가 도와주는 게 당연하냐?', expression: 'less' },
              { speaker: 'player', text: '아니ㅋㅋ 장난이지.' },
              { speaker: 'minji', text: '흥, 다음부터는 알아서 해라!', expression: 'less' },
              { speaker: 'player', text: '아 미안하다니까ㅋㅋㅋ' },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '야, 빨리 가자. 수업 늦겠다!' },
      { speaker: 'player', text: '어어, 간다!' },

      // SCENE 02. 차가운 첫인상 — 강의실, 오전
      { text: '게임콘텐츠학과 강의실.', background: classroomImg },
      { speaker: 'minji', text: '야, 여기 앉자.' },
      { speaker: 'player', text: '어.' },
      { text: '두 사람이 자리에 앉고, 잠시 후 강의실 문이 열린다.', hidePortrait: true },
      { text: '드르륵.' },
      { speaker: 'player', text: '(……어?)' },
      { speaker: 'player', text: '(긴 은발에 차가운 눈매. 멀리서도 눈에 띄는 사람이 들어왔다.)' },
      { speaker: 'minji', text: '야야, {name}.', expression: 'surprised_soft' },
      { speaker: 'player', text: '왜?' },
      { speaker: 'minji', text: '쟤 엄청 예쁘지 않냐?', expression: 'surprised_soft' },
      { speaker: 'player', text: '어, 그러네.' },
      { text: '그 순간, 그녀와 눈이 마주친다.' },
      { speaker: 'emily', text: '……뭘 봐?' },
      { speaker: 'player', text: '아. 아니, 그냥 눈이 마주쳐서.' },
      { speaker: 'emily', text: '그럼 앞이나 봐.' },
      { speaker: 'player', text: '……어, 알았어.' },
      { text: '그녀가 {name}의 옆 빈자리에 앉는다.' },
      { speaker: 'minji', text: '(속닥) 야ㅋㅋㅋ 너 바로 까였다.', expression: 'smile' },
      { speaker: 'player', text: '아니, 뭘 했어야 까이지.' },
      { speaker: 'emily', text: '……다 들리거든?' },
      { speaker: 'minji', text: '앗.', expression: 'surprised_soft' },
      { speaker: 'player', text: '……죄송합니다.' },
      { text: '그녀가 한숨을 쉰다.' },
      { text: '— 프로그래밍 실습 수업 —', hidePortrait: true },
      { name: '교수님', text: '자, 오늘 실습은 여기까지입니다. 다음 시간까지 프로그램 완성해 오세요.' },
      { speaker: 'player', text: '아…… 드디어 끝났다.' },
      { speaker: 'player', text: '……어? 근데 왜 내 건 실행이 안 되지?' },
      { speaker: 'player', text: '(분명 교수님이 하라는 대로 했는데……. 뭐가 문제지?)' },
      { speaker: 'emily', text: '……너.' },
      { speaker: 'player', text: '응?' },
      { speaker: 'emily', text: '여기 세미콜론 빠졌어.' },
      { speaker: 'player', text: '어?' },
      { speaker: 'emily', text: '여기. 그것 때문에 오류 나는 거잖아.' },
      { speaker: 'player', text: '아!' },
      { text: '{name}이(가) 코드를 고치자, 딸깍! 프로그램이 실행된다.' },
      { speaker: 'player', text: '오! 된다! 와, 고마워.' },
      { speaker: 'emily', text: '……그 정도 오류도 못 찾으면 어떡하려고.' },
      { speaker: 'player', text: 'ㅋㅋㅋ 그러게.' },
      {
        speaker: 'emily',
        text: '흥, 이 정도는 기본이거든.',
        choices: [
          {
            text: '와, 너 프로그래밍 진짜 잘한다. 멋있는데?',
            affection: { emily: 5 },
            reply: [
              { speaker: 'emily', text: '……뭐? 흥, 이 정도 가지고 뭘.' },
              { text: '그녀가 시선을 피한다.' },
              { speaker: 'emily', text: '……그래도 보는 눈은 있네.' },
            ],
          },
          {
            text: '너 말투는 까칠한데 은근히 친절하다?ㅋㅋ',
            affection: { emily: 2 },
            reply: [
              { speaker: 'emily', text: '뭐?! 누가 친절하다는 거야?' },
              { speaker: 'emily', text: '그냥 답답해서 알려준 거거든!' },
              { speaker: 'player', text: 'ㅋㅋㅋ 알았어, 알았어.' },
            ],
          },
          {
            text: '이 정도는 나도 할 수 있었거든?',
            affection: { emily: -3 },
            reply: [
              { speaker: 'emily', text: '……그래? 그럼 다음부터는 혼자 해결해.' },
              { speaker: 'player', text: '아니ㅋㅋㅋ 장난이지.' },
              { speaker: 'emily', text: '……안 웃기거든.' },
            ],
          },
        ],
      },
      { speaker: 'player', text: '아, 그러고 보니 이름이 뭐야?' },
      { speaker: 'emily', text: '에밀리.' },
      { speaker: 'player', text: '난 {name}. 앞으로 잘 부탁한다.' },
      { speaker: 'emily', text: '……그래.' },
      { text: '에밀리가 가방을 챙겨 일어난다.' },
      { speaker: 'emily', text: '다음부터는 오류 메시지부터 읽어.' },
      { text: '에밀리가 강의실을 나간다.', hidePortrait: true },
      { speaker: 'player', text: '(첫인상은 꽤 차가웠는데……. 생각보다 나쁜 사람은 아닌 것 같다.)' },

      // SCENE 03. 수상한 동아리방 — 학생회관, 오후
      { text: '오후, 학생회관 복도.', background: corridorImg },
      { speaker: 'player', text: '(오후 수업도 끝났고……. 이제 뭐 하지?)' },
      { text: '게시판에 포스터가 붙어 있다.' },
      { text: '『게임 제작 동아리 신입 부원 모집! 프로그래밍, 그래픽, 기획 등 게임 제작에 관심 있는 학생 누구나 환영!』' },
      { speaker: 'player', text: '오, 게임 제작 동아리? ……대학 왔는데 동아리 하나쯤은 들어야지.' },
      { text: '{name}이(가) 동아리방 문 앞에 선다.' },
      { speaker: 'player', text: '여기 맞나?' },
      { text: '똑똑.' },
      { speaker: 'player', text: '저기요~ 아무도 없어요?' },
      { name: '???', text: '……네.' },
      { speaker: 'player', text: '어?' },
      { text: '문을 열자, 책상에서 그림을 그리고 있는 여자애가 보인다.', background: clubRoomImg },
      { speaker: 'player', text: '(……사람이 있었네.)' },
      { speaker: 'player', text: '(긴 보라색 머리에 안경을 쓴 여자애. 엄청 조용해 보인다.)' },
      { speaker: 'player', text: '안녕. 혹시 여기 게임 제작 동아리 맞아?' },
      { speaker: 'siyeong', text: '……!' },
      { text: '그녀가 놀라 펜을 떨어뜨린다. 달그락!' },
      { speaker: 'player', text: '어, 미안! 놀랐어?' },
      { speaker: 'siyeong', text: '아, 아뇨……! 괘, 괜찮아요…….' },
      { speaker: 'player', text: '아, 다행이다. 여기 신입 부원 모집한다고 해서 왔는데.' },
      { speaker: 'siyeong', text: '아……. 저, 저도…… 신입생이에요…….' },
      { speaker: 'player', text: '오, 그래? 그럼 우리 동기네.' },
      { speaker: 'siyeong', text: '……네.' },
      { text: '잠시 어색한 정적이 흐른다.' },
      { speaker: 'player', text: '(……대화가 끊겼다. 뭐라도 얘기해야 하나?)' },
      { text: '{name}의 눈에 책상 위의 그림이 들어온다.' },
      { speaker: 'player', text: '어? 이거 네가 그린 거야?' },
      { speaker: 'siyeong', text: '아…… 네……. 그냥…… 취미로…….' },
      { speaker: 'player', text: '와, 엄청 잘 그렸는데?' },
      {
        speaker: 'siyeong',
        text: '……! 가, 감사합니다…….',
        choices: [
          {
            text: '그림 분위기 되게 좋다. 다른 것도 보여줄 수 있어?',
            affection: { siyeong: 5 },
            reply: [
              { speaker: 'siyeong', text: '……! 제…… 다른 그림도요……?' },
              { speaker: 'player', text: '어. 궁금한데?' },
              { speaker: 'siyeong', text: '……. 그, 그럼…… 조금만…….' },
              { text: '그녀가 조심스럽게 다른 그림을 보여준다.' },
            ],
          },
          {
            text: '그림 잘 그리는 사람 처음 봐ㅋㅋ 신기하네.',
            affection: { siyeong: 2 },
            reply: [
              { speaker: 'siyeong', text: '아……. 그렇게…… 대단한 건 아닌데…….' },
              { speaker: 'player', text: '에이, 잘 그리니까 하는 말이지.' },
              { speaker: 'siyeong', text: '……감사합니다.' },
            ],
          },
          {
            text: '혼자서 그림만 그리면 안 심심해?',
            affection: { siyeong: -3 },
            reply: [
              { speaker: 'siyeong', text: '아……. 저는…… 혼자 있는 게…… 편해서요…….' },
              { speaker: 'player', text: '아, 그렇구나.' },
              { text: '그녀가 시선을 내린다.' },
            ],
          },
        ],
      },
      { speaker: 'player', text: '혹시 게임 그래픽 쪽에 관심 있어?' },
      { speaker: 'siyeong', text: '……네. 캐릭터 디자인이랑……. 배경 그리는 것도…… 좋아해요.' },
      { speaker: 'player', text: '오, 멋있다. 난 게임은 좋아하는데 직접 만드는 건 아직 잘 모르거든.' },
      { speaker: 'siyeong', text: '…….' },
      { speaker: 'siyeong', text: '저……. 혹시…… 게임 만드는 거……. 같이 해보실래요……?' },
      { speaker: 'player', text: '어?' },
      { speaker: 'siyeong', text: '아, 아니……! 그냥…… 동아리니까…….' },
      { speaker: 'player', text: 'ㅋㅋㅋ 좋지. 나도 배우고 싶어서 온 거야.' },
      { text: '그녀가 작게 미소 짓는다.' },
      { speaker: 'siyeong', text: '……다행이다.' },
      { speaker: 'player', text: '아, 그러고 보니 이름이 뭐야?' },
      { speaker: 'siyeong', text: '서…… 서시영이에요.' },
      { speaker: 'player', text: '난 {name}. 앞으로 잘 부탁한다, 시영아.' },
      { speaker: 'siyeong', text: '……네. 저도…… 잘 부탁드려요.' },
      { name: 'SYSTEM', text: '서시영과 처음으로 교류했습니다.' },

      // SCENE 04. 네 사람의 만남 — 학생회관 복도
      { text: '{name}와(과) 시영이 동아리방에서 나온다.', background: corridorImg },
      { speaker: 'player', text: '그럼 다음 모임 때 보자.' },
      { speaker: 'siyeong', text: '네…….' },
      { speaker: 'minji', text: '어? {name}! 야! 너 여기서 뭐 하냐?', expression: 'surprised_soft' },
      { speaker: 'player', text: '동아리 구경 왔지.' },
      { speaker: 'minji', text: '엥? 혼자?', expression: 'surprised_soft' },
      { speaker: 'player', text: '어. 왜?' },
      { speaker: 'minji', text: '와~ 우리 {name}, 혼자 동아리도 알아보고. 다 컸네ㅋㅋㅋㅋ', expression: 'bigsmile' },
      { speaker: 'player', text: '아, 진짜ㅋㅋㅋ' },
      { text: '민지가 시영을 발견한다.' },
      { speaker: 'minji', text: '어? 안녕!', expression: 'smile', stage: ['siyeong', 'minji'] },
      { speaker: 'siyeong', text: '아…… 안녕하세요…….' },
      { speaker: 'minji', text: '너도 게임콘텐츠학과야?' },
      { speaker: 'siyeong', text: '네…….' },
      { speaker: 'minji', text: '헐! 우리 동기네! 난 송민지야!', expression: 'bigsmile' },
      { speaker: 'siyeong', text: '서…… 서시영이에요.' },
      { speaker: 'minji', text: '시영아! 앞으로 친하게 지내자!', expression: 'bigsmile' },
      { speaker: 'siyeong', text: '……네.' },
      { text: '시영이 작게 웃는다.' },
      { speaker: 'emily', text: '……시끄러워.' },
      { speaker: 'player', text: '어? 에밀리?' },
      { speaker: 'emily', text: '……너 여기서 뭐 해?' },
      { speaker: 'player', text: '동아리 구경. 너도?' },
      { speaker: 'emily', text: '어. 게임 제작 동아리라길래 와봤어.' },
      { speaker: 'minji', text: '오! 아까 강의실에 있던 애다! 나 송민지!', expression: 'smile', stage: ['emily', 'minji'] },
      { speaker: 'emily', text: '……에밀리.' },
      { speaker: 'minji', text: '와, 우리 다 같은 과네?' },
      { speaker: 'player', text: '그러게.' },
      { text: '네 사람이 서로를 바라본다.' },
      { speaker: 'minji', text: '야야! 그럼 우리 넷이 같이 게임 만들어 보면 되겠다!', expression: 'bigsmile' },
      { speaker: 'emily', text: '……뭐?' },
      { speaker: 'siyeong', text: '……네?' },
      { speaker: 'player', text: '아니, 잠깐. 그걸 왜 네 마음대로 정해?' },
      { speaker: 'minji', text: '왜! 재밌잖아! 에밀리는 프로그래밍 잘하고! 시영이는 그림 잘 그리고!' },
      { speaker: 'minji', text: '나는 기획하면 되잖아!' },
      { speaker: 'player', text: '……그럼 나는?' },
      { speaker: 'minji', text: '…….', expression: 'less' },
      { text: '잠시 정적.' },
      { speaker: 'minji', text: '응원 담당?' },
      { speaker: 'player', text: '야.' },
      { speaker: 'emily', text: '풉.' },
      { speaker: 'siyeong', text: '……후훗.' },
      { speaker: 'player', text: '아니, 다들 웃지 마!' },
      { speaker: 'minji', text: 'ㅋㅋㅋㅋ 농담이지! 너도 같이 만들면 되잖아!', expression: 'bigsmile' },

      // SCENE 05. 우리, 게임 한번 만들어 볼까?
      { speaker: 'minji', text: '야, 근데 우리 진짜 같이 게임 만들어보는 거 어때?' },
      { speaker: 'player', text: '갑자기?' },
      { speaker: 'minji', text: '왜! 재밌잖아! 어차피 다 게임 만드는 거 좋아하잖아.', stage: ['emily', 'minji', 'siyeong'] },
      { speaker: 'emily', text: '……게임은 아무렇게나 만든다고 되는 게 아니거든.' },
      { speaker: 'minji', text: '아~ 그럼 에밀리가 프로그래밍 맡아주면 되겠네!' },
      { speaker: 'emily', text: '……누가 한다고 했어?' },
      { speaker: 'minji', text: '싫어?' },
      { speaker: 'emily', text: '……. 뭐, 제대로 만들 거면 생각은 해볼게.' },
      { speaker: 'siyeong', text: '저는……. 같이 만들면…… 좋을 것 같아요…….' },
      { speaker: 'minji', text: '그치?! 야 {name}, 너는 어떻게 할 건데?' },
      { speaker: 'player', text: '……나?' },
      { speaker: 'player', text: '(게임 제작이라……. 재미있을 것 같긴 한데.)' },
      { speaker: 'player', text: '(솔직히 내가 뭘 할 수 있을지는 모르겠다. 괜히 시작했다가 제대로 못하면 어쩌지?)' },
      {
        speaker: 'player',
        text: '(그렇다고 나만 빠지기도 좀 그렇고…….)',
        choices: [
          {
            text: '에밀리 같은 실력자가 있으면 든든하겠는데?',
            affection: { emily: 3 },
            reply: [
              { speaker: 'emily', text: '……뭐? 흥, 당연하지. 내가 하면 제대로 해야지.' },
              { speaker: 'player', text: 'ㅋㅋㅋ 믿음직하네.' },
              { speaker: 'emily', text: '……착각하지 마. 아직 한다고 확정한 건 아니니까.' },
            ],
          },
          {
            text: '시영이 그림 보니까 한번 만들어 보고 싶긴 해.',
            affection: { siyeong: 3 },
            reply: [
              { speaker: 'siyeong', text: '……! 저, 정말요……?' },
              { speaker: 'player', text: '어. 잘 만들 수 있을 것 같은데?' },
              { speaker: 'siyeong', text: '……그럼……. 열심히 해볼게요…….' },
            ],
          },
          {
            text: '민지가 기획하면 재밌긴 하겠다ㅋㅋ',
            affection: { minji: 3 },
            reply: [
              { speaker: 'minji', text: '그치?! 역시 넌 뭘 좀 안다니까!', expression: 'bigsmile' },
              { speaker: 'player', text: '근데 제대로 만들 수는 있냐?' },
              { speaker: 'minji', text: '야ㅋㅋㅋ 일단 해보는 거지!', expression: 'smile' },
            ],
          },
          {
            text: '난 다 좋은데…… 그냥 너희가 정해주면 안 되냐?',
            affection: {},
            reply: [
              { speaker: 'minji', text: '아 진짜ㅋㅋㅋㅋ 넌 고등학교 때부터 하나도 안 변했냐?' },
              { speaker: 'player', text: '아니, 다 좋다니까?' },
              { speaker: 'emily', text: '……우유부단하네.' },
            ],
          },
        ],
      },
      { speaker: 'minji', text: '그래서! 다들 할 거지?' },
      { speaker: 'emily', text: '……. 조건이 있어.' },
      { speaker: 'player', text: '뭔데?' },
      { speaker: 'emily', text: '시작할 거면 끝까지 제대로 하는 거야. 대충 만들다가 포기할 거면 난 안 해.' },
      { speaker: 'minji', text: '오케이! 완전 좋지!', expression: 'bigsmile' },
      { speaker: 'siyeong', text: '저도…… 열심히 할게요…….' },
      { speaker: 'minji', text: '{name}은(는)?' },
      { speaker: 'player', text: '……. 뭐, 한번 해보지.' },
      { speaker: 'minji', text: '좋아! 그럼 결정! 우리 넷 다 게임 제작 동아리에 가입하는 거다!', expression: 'bigsmile' },
      { speaker: 'player', text: '야ㅋㅋㅋ 결정 한번 빠르네.' },
      { speaker: 'minji', text: '이럴 때는 빨라야지!' },
      { text: '게임 제작 동아리방. 책상 위에 신입 부원 가입 신청서가 놓여 있다.', background: clubRoomImg },
      { speaker: 'minji', text: '자, 여기 이름 쓰면 되는 거지?' },
      { speaker: 'player', text: '어.' },
      { text: '네 사람이 차례대로 가입 신청서를 작성한다.' },
      { speaker: 'siyeong', text: '……. 저……. 앞으로 잘 부탁드려요…….' },
      { speaker: 'emily', text: '……나중에 후회하지나 마.' },
      { speaker: 'minji', text: 'ㅋㅋㅋ 걱정하지 마! 우리가 얼마나 대단한 게임 만들 건데!', expression: 'smile' },
      { speaker: 'player', text: '아직 뭐 만들지도 안 정했잖아ㅋㅋㅋ' },
      { speaker: 'minji', text: '그건 지금부터 정하면 되지!' },
      { name: 'SYSTEM', text: '게임 제작 동아리에 가입했습니다.' },
      { name: 'SYSTEM', text: '신규 동아리 부원: {name} / 송민지 / 에밀리 / 서시영' },
      { name: 'SYSTEM', text: '네 사람의 공동 게임 제작 활동이 시작됩니다.' },

      // SCENE 06. 새로운 시작 — 캠퍼스, 오후
      { text: '네 사람이 학생회관을 나온다.', background: campusSpringImg },
      { speaker: 'player', text: '(그렇게 우리는 게임 제작 동아리에 가입했다.)' },
      { speaker: 'player', text: '(차갑지만 프로그래밍에 진심인 에밀리.)' },
      { speaker: 'player', text: '(소심하지만 뛰어난 그림 실력을 가진 시영이.)' },
      { speaker: 'player', text: '(그리고 고등학교 때부터 한결같이 시끄러운 민지.)' },
      { speaker: 'player', text: '(어쩌다 보니 이 네 사람이 함께 게임을 만들게 된 거다.)' },
      { speaker: 'player', text: '(솔직히……. 무슨 게임을 만들게 될지는 아직 모르겠다. 그래도 나쁘지 않을 것 같다.)' },
      { speaker: 'minji', text: '야! 근데 우리 무슨 게임 만들까?' },
      { speaker: 'player', text: '벌써?' },
      { speaker: 'minji', text: '그럼! 지금부터 생각해야지!' },
      { speaker: 'emily', text: '……일단 뭐 만들 건지부터 정해.' },
      { speaker: 'siyeong', text: '저는…… 캐릭터가 많이 나오는 게임이면…… 좋겠어요…….' },
      { speaker: 'minji', text: '오! 그럼 미연시 어때?', expression: 'smile' },
      { speaker: 'player', text: '……. 야, 우리가 지금 미연시 만들고 있는 거 아니냐?' },
      { text: '잠시 정적.' },
      { speaker: 'minji', text: '……어?', expression: 'surprised_soft' },
      { speaker: 'emily', text: '……무슨 소리야?' },
      { speaker: 'siyeong', text: '……네?' },
      { speaker: 'player', text: '아니, 아무것도 아니야.' },
      { speaker: 'player', text: '(……방금 내가 무슨 말을 한 거지?)' },
      { text: '잠시 정적.' },
      { speaker: 'minji', text: '아무튼! 다음 달에 신입생 MT 간다는데?!' },
      { speaker: 'player', text: 'MT?' },
      { speaker: 'minji', text: '어! 우리 과에서 간대! 야, 우리 넷이 같이 가자!', expression: 'bigsmile' },
      { speaker: 'emily', text: '……귀찮아.' },
      { speaker: 'siyeong', text: '사람…… 많이 오겠죠……?' },
      { speaker: 'minji', text: '에이~ 다 같이 가면 재밌잖아! 야 {name}, 너도 갈 거지?' },
      { speaker: 'player', text: '음……. 뭐, 다들 가면 나도 가지.' },
      { speaker: 'minji', text: 'ㅋㅋㅋ 역시!', expression: 'bigsmile' },
      { speaker: 'emily', text: '……난 아직 간다고 안 했거든.' },
      { speaker: 'siyeong', text: '저도…… 생각해 볼게요…….' },
      { text: '네 사람이 캠퍼스를 걸어간다.' },
      { speaker: 'player', text: '(새로운 친구들. 새로운 동아리. 그리고 함께 만들 게임.)', hidePortrait: true },
      { speaker: 'player', text: '(처음에는 평범할 줄 알았던 대학 생활이……. 조금씩 달라지고 있었다.)' },
      { speaker: 'player', text: '(……적어도 그때까진 그렇게 생각했다.)' },
      { speaker: 'player', text: '(다음 달 MT에서……. 그런 이상한 사건이 벌어질 줄은 꿈에도 몰랐으니까.)' },
      { name: 'SYSTEM', text: '4월 메인 에피소드 CLEAR — 「평범하지 않은 대학 생활」' },
    ],
  },
  5: {
    id: 'month-5',
    title: '사라진 교수님',
    icon: '🎮',
    background: classroomImg,
    lines: [
      // 프롤로그 — 사라진 교수님
      { text: '평범한 대학교 강의실. 게임콘텐츠학과 학생들은 오늘도 교수님의 수업을 듣고 있다.' },
      { text: '하지만 오늘 수업은 평소와 조금 달랐다. 교수님이 고전 명작 VR 판타지 RPG를 직접 해보고 평가하기로 한 것이다.' },
      { name: '교수님', text: '게임 만드는 것도 많이 경험해 봐야 잘 만들겠죠???' },
      { text: '다른 세계에 소환된 모험가가 되어 동료를 모으고, 몬스터를 처치하며 마왕성으로 향하는 전형적인 판타지 RPG였다.' },
      { speaker: 'player', text: '교수님, 요즘도 마왕 잡는 게임을 만들어요?' },
      { name: '교수님', text: '야, 기본이 제일 중요한 거야. 제대로 만들면 이런 게임도 재미있어.' },
      { text: '교수님이 직접 VR 기기를 착용한다. 그런데 게임을 실행하는 순간, 강의실 모니터에 붉은 오류 메시지가 나타난다.' },
      { text: '비정상적인 접속 요청이 감지되었습니다. 관리자 계정의 접근을 확인했습니다.', effect: 'system-error' },
      { text: '외부 접속자를 강제 소환합니다. 접속을 취소할 수 없습니다.', effect: 'system-error' },
      { name: '교수님', text: '어? 이거 뭐야?' },
      { text: '교수님이 기기를 벗으려는 순간, 기기에서 강렬한 빛이 쏟아져 나온다.' },
      { text: '순식간에 교수님의 몸이 빛 속으로 빨려 들어가고, 강의실 바닥에는 빈 VR 기기만 떨어진다.' },
      { text: '학생들의 비명이 강의실을 가득 채운다.' },
      { speaker: 'minji', text: '뭐야 이게…?' },
      { text: '기기를 만지던 송민지가 빛 속으로 빨려 들어가고, 말리려던 서시영까지 함께 사라진다.' },
      { speaker: 'emily', text: '뭐… 나도 가자고? 진짜 무리인 거 알지?' },
      { speaker: 'player', text: '뭐, 오지 말든가. 나 먼저 갈게.' },
      { speaker: 'emily', text: '엥, 진짜 가려고????' },
      { text: '그 순간 에밀리가 턱에 걸려 넘어지며 먼저 기기를 건드리고, 그대로 빨려 들어간다.' },
      { speaker: 'player', text: '??? 뭐… 뭐야 이거. 오케이, 나도 들어가긴 해야겠네.' },
      { speaker: 'player', text: '얘들아, 일단 상황 봐주고 안 돌아오면 신고해 줘!' },
      { text: '마지막으로 {name}이(가) VR 기기를 착용한다.' },
      { text: '아직 아무도 몰랐다. 현실에서 흐르는 1초가 게임 세계에서는 하루에 해당한다는 사실을.' },
      { text: '먼저 접속한 친구들은 이미 게임 세계에서 며칠을 보내고 있었고, 무작위 소환 때문에 서로 다른 장소에 떨어진 상태였다.' },

      // 1장부터 최종 선택까지는 쯔꾸르 게임(public/hayeong)으로 진행
      {
        text: '— 1장. 소환진: 직업 없는 모험가 —',
        game: 'hayeong',
        gameTitle: '하영의 이세계',
        gameEndings: {
          // 현실로 돌아오는 엔딩은 강의실에서 이어서 진행
          A: [
            { text: '눈을 뜨자, 익숙한 강의실 천장이 보였다.' },
            { text: '교수님과 친구들도 하나둘 몸을 일으킨다. 모두 무사히 현실로 돌아온 것이다.' },
            { speaker: 'minji', text: '우리…… 진짜 돌아온 거지?' },
            { speaker: 'emily', text: '하…… 다시는 VR 안 해.' },
            { speaker: 'siyeong', text: '다들…… 정말 다행이에요.' },
            { name: '교수님', text: '너희…… 나 구하러 거기까지 들어온 거냐?' },
            { text: "강의실 모니터에는 '마왕을 처치하고 세계를 구했습니다'라는 문구가 떠 있었다." },
            { text: '모두가 귀환을 기뻐했지만, {name}은(는) 마지막까지 자신을 바라보던 마왕의 눈빛을 잊지 못한다.' },
            { text: '[ENDING A — 예정된 승리]' },
          ],
          B: [
            { text: '눈을 뜨자, 익숙한 강의실 천장이 보였다.' },
            { text: '교수님과 친구들은 가까스로 현실로 탈출했다.' },
            { speaker: 'minji', text: '{name}…… 괜찮아?' },
            { speaker: 'player', text: '……응.' },
            { text: '강의실 모니터 속 게임 화면은 멈춰 있었다. 움직이지 않는 왕좌 위에, 마왕만이 홀로 남아 있었다.' },
            { text: '더 이상 죽지는 않지만 살아갈 수도 없는 마왕은, 끝나지 않는 시간을 보내게 된다.' },
            { text: '[ENDING B — 끝나지 않은 악몽]' },
          ],
          // 게임 속에 남는 엔딩은 한 줄로 마무리
          C: [{ text: '수천 번의 죽음 끝에, 그녀는 처음으로 내일을 맞이했다.' }],
        },
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

// 데이트(호감도 이벤트). 매달 15일 이벤트로 히로인별 순서대로 진행 (utils/monthEvent)
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
      // 도서관 배경 이미지가 생기면 바꾸기
      background: classroomImg,
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
      background: classroomImg,
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
    // 비 오는 거리 배경 이미지가 생기면 바꾸기
    {
      id: 'date-emily-2',
      title: '우산은 하나뿐',
      illust: emily2Img,
      background: campusSpringImg,
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
    // 축제 배경 이미지가 생기면 바꾸기
    {
      id: 'date-emily-3',
      title: '내기에서 이기면 소원 하나',
      illust: emily3Img,
      background: campusSpringImg,
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
      background: clubRoomImg,
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

// 이름 입력 직후 한 번 보는 프롤로그 (신입생 OT)
export const PROLOGUE_DATE = '2026-03-02';

export const PROLOGUE: Episode = {
  id: 'prologue',
  title: '신입생 OT',
  icon: '🍺',
  time: '저녁',
  lines: [
    { text: '3월의 첫 주. 학교 앞 호프집이 신입생과 선배들로 북적인다.' },
    { text: '"자, 신입생들 다 왔지? 우리 과 OT에 온 걸 환영한다!"' },
    { speaker: 'player', text: '(드디어 대학생이다… 여기서 {name}의 캠퍼스 라이프가 시작되는 거야!)' },
    { text: '"자기소개 끝난 사람은 한 잔씩! 원샷! 원샷!"' },
    { speaker: 'player', text: '아, 저 술은 별로… 아니, 네! 마시겠습니다!' },
    { text: '한 잔이 두 잔이 되고, 두 잔이 다섯 잔이 되었다.' },
    { text: '"오~ {name} 잘 마시네! 한 잔 더 가자!"' },
    { speaker: 'player', text: '하하… 저 아직… 괜찮… 은데요…?' },
    { text: '세상이 천천히 빙글빙글 돌기 시작했다.' },
    { speaker: 'player', text: '(어… 이거 좀… 위험한데…?)' },
    { text: '…' },
    { text: '우웨에에엑—!!!' },
    { text: '순식간에 테이블 주변이 조용해졌다. 모두의 시선이 {name}에게 꽂혔다.' },
    { text: '"…야, 누가 휴지 좀 가져와."' },
    { speaker: 'player', text: '죄, 죄송합니다…!' },
    { text: '그날 밤, {name}의 이름은 과 단톡방에 빠르게 퍼져나갔다.' },
    { speaker: 'player', text: '(입학하자마자 OT에서 토한 신입생… 이제 다들 날 그렇게 기억하겠지…)' },
    { speaker: 'player', text: '(앞으로의 학교생활… 괜찮을까…?)' },
    { text: '이렇게 {name}의 파란만장한 대학 생활이 시작되었다.' },
  ],
};

// 전체 에피소드 목록 (컬렉션에 기록된 id로 에피소드를 찾을 때 씀)
export const EPISODE_CATALOG: Episode[] = [
  PROLOGUE,
  ...Object.values(EPISODES),
  DEFAULT_EPISODE,
  ...HEROINES.flatMap((h) => DATE_EPISODES[h]),
];

// 다시 보기용 대사: 고른 선택지를 주인공 대사로 바꾸고 그 답변을 바로 이어 붙임
// (선택 기록이 생기기 전에 본 에피소드는 기록이 없으므로 첫 번째 선택지로 보여줌, 게임은 건너뜀)
export function getReplayLines(lines: EpisodeLine[], picks: number[]): EpisodeLine[] {
  let k = 0;
  const expand = (list: EpisodeLine[]): EpisodeLine[] =>
    list.flatMap(({ game: _game, gameTitle: _gameTitle, gameEndings: _gameEndings, ...line }) => {
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
