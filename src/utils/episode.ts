import hayeongImg from '../img/character/hayeong_default.png';
import minjiImg from '../img/character/minji_default.png';
import siyeongImg from '../img/character/siyeong_default.png';
import emilyImg from '../img/character/emily_default.png';
import computerClassroomImg from '../img/computer_classroom.png';
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
    title: '사라진 교수님',
    icon: '🎮',
    background: computerClassroomImg,
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
  5: {
    id: 'month-5',
    title: '불 꺼지지 않는 실습실',
    icon: '🖥️',
    time: '밤',
    background: computerClassroomImg,
    lines: [
      { text: '과제 마감 전날 밤. 모두 돌아간 실습실에 모니터 하나만 켜져 있다.' },
      { speaker: 'player', text: '에밀리? 아직 안 갔어? 그거 낮에 다 끝냈다며.' },
      { speaker: 'emily', text: '끝낸 거 아니거든. 여기 빛 방향이 미묘하게 틀렸어. 처음부터 다시 그리는 중이야.' },
      { speaker: 'player', text: '…내 눈엔 아까랑 똑같은데?' },
      {
        speaker: 'emily',
        text: '너 눈엔 그렇겠지. …나는 보여. 이 정도로 대충 넘기면 또 놓칠 것 같아서.',
        choices: [
          {
            text: '그럼 나도 옆에서 내 과제 할게.',
            affection: { emily: 15 },
            reply: [
              { speaker: 'emily', text: '…마음대로 해. 대신 방해하면 바로 쫓아낸다?' },
              { text: '에밀리는 투덜거리면서도 의자를 조금 옆으로 당겨 자리를 내주었다.' },
            ],
          },
          {
            text: '이 정도면 충분해. 이제 좀 쉬어.',
            affection: { emily: 5 },
            reply: [{ speaker: 'emily', text: '나도 알아, 충분하다는 거. 근데… 또 실패하면 어떡하라고.' }],
          },
          {
            text: '그렇게까지 할 필요 있어?',
            affection: { emily: -10 },
            reply: [{ speaker: 'emily', text: '있어. 너는 몰라. …한 번 꿈을 놓쳐본 사람 마음은.' }],
          },
        ],
      },
      { text: '새벽 세 시. 에밀리는 결국 처음 그림을 다시 열었다. 고친 그림과 거의 차이가 없었다.' },
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

// 데이트(호감도 이벤트). 히로인별로 DATE_UNLOCKS 순서대로 호감도를 채우면 해금
export const DATE_EPISODES: Record<Heroine, Episode[]> = {
  // 친해지기 → 숨겨진 고민 → 자신만의 장점 발견 → 새로운 도전
  minji: [
    {
      id: 'date-minji-1',
      title: '너는 꿈이 뭐야?',
      illust: minji1Img,
      time: '낮',
      lines: [
        { text: '대학교 과방. 혼자 쉬고 있는 {name}에게 민지가 음료수 두 개를 들고 들어온다.' },
        { speaker: 'minji', text: '{name}~! 여기 있었네!' },
        { speaker: 'player', text: '어, 민지야. 뭐야 그건?' },
        { speaker: 'minji', text: '짜잔~ 편의점 갔다가 네 것도 사 왔지!' },
        { speaker: 'player', text: '오, 웬일이야? 무슨 부탁이라도 있어?' },
        { speaker: 'minji', text: '에이! 내가 뭐 맨날 부탁할 때만 잘해 주는 사람인 줄 알아?' },
        { speaker: 'player', text: '아니었어?' },
        { speaker: 'minji', text: '야!!' },
        { text: '민지가 장난스럽게 {name}의 어깨를 친다.' },
        { speaker: 'minji', text: '아, 맞다. 넌 나중에 뭐 하고 싶어?' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'minji', text: '그냥 궁금해서! 에밀리는 게임 그래픽 디자이너가 꿈이고, 시영이는 프로그래밍 쪽에 관심 많잖아.' },
        { speaker: 'minji', text: '넌 뭐 하고 싶어?' },
        { speaker: 'player', text: '글쎄… 아직 잘 모르겠는데.' },
        { speaker: 'minji', text: '헐, 진짜?!' },
        { speaker: 'player', text: '왜, 이상해?' },
        { speaker: 'minji', text: '아니아니! 나도 그렇거든!' },
        { speaker: 'minji', text: '와~ 동지를 찾았네! 우리 둘 다 아직 백수 확정이야!' },
        { speaker: 'player', text: '야, 벌써 그렇게 결론 내리지 마!' },
        { text: '민지가 크게 웃는다.' },
        { speaker: 'minji', text: '아하하! 농담이야, 농담!' },
        { speaker: 'minji', text: '…그래도 조금 안심된다.' },
        { speaker: 'player', text: '뭐가?' },
        { text: '민지가 빨대를 만지작거리며 웃는다.' },
        {
          speaker: 'minji',
          text: '나만 아직 하고 싶은 게 없는 줄 알았거든.',
          choices: [
            {
              text: '우리 같이 천천히 찾아보자.',
              affection: { minji: 15 },
              reply: [
                { speaker: 'minji', text: '오~ 같이?' },
                { speaker: 'minji', text: '좋아! 그럼 우리 둘 중에 먼저 꿈 찾는 사람이 밥 사기!' },
                { speaker: 'player', text: '그건 좀 불공평한데?' },
                { speaker: 'minji', text: '왜애~ 같이 찾자며!' },
                { text: '민지가 활짝 웃는다.' },
              ],
            },
            {
              text: '너는 어차피 뭐든 잘할 것 같은데?',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '에이, 내가 그렇게 만능으로 보여?' },
                { speaker: 'minji', text: '그럼 좋겠지만~ 난 잘하는 것도 딱히 없는걸!' },
                { text: '민지가 웃으며 화제를 돌린다.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-minji-2',
      title: '나만 제자리인 것 같아',
      illust: minji2Img,
      time: '해 질 무렵',
      lines: [
        { text: '조별 과제를 마친 뒤, 옥상. 평소 활발한 모습과 다르게 민지가 혼자 멍하니 하늘을 바라보고 있다.' },
        { speaker: 'player', text: '민지야, 여기서 뭐 해?' },
        { speaker: 'minji', text: '어? {name}!' },
        { speaker: 'minji', text: '그냥 바람 좀 쐬려고! 여기 되게 시원하다?' },
        { speaker: 'player', text: '그러게. 근데 무슨 일 있어?' },
        { speaker: 'minji', text: '응? 아니? 왜?' },
        { speaker: 'player', text: '평소보다 조용해서.' },
        { speaker: 'minji', text: '아하하! 나도 가끔은 조용할 때가 있거든?' },
        { text: '민지가 웃다가 다시 하늘을 바라본다.' },
        { speaker: 'minji', text: '…있잖아.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'minji', text: '너는… 사람들이 다 앞으로 가고 있는데, 너만 멈춰 있는 것 같은 기분 느껴본 적 있어?' },
        { speaker: 'player', text: '무슨 뜻이야?' },
        { speaker: 'minji', text: '에밀리는 벌써 포트폴리오 준비하고 있고, 시영이는 자기가 좋아하는 분야가 확실하잖아.' },
        { speaker: 'minji', text: '근데 나는 아직 내가 뭘 좋아하는지도 잘 모르겠어.' },
        { speaker: 'minji', text: '사실 고등학교 때도 그랬거든.' },
        { speaker: 'minji', text: '친구들이 다 자기 꿈 이야기할 때, 나는 그냥 옆에서 응원만 했어.' },
        { speaker: 'minji', text: '대학 오면 뭔가 달라질 줄 알았는데… 똑같네.' },
        { text: '민지가 무릎을 끌어안는다.' },
        { speaker: 'minji', text: '나도 뭔가 열심히 하고 싶은데, 뭘 열심히 해야 할지를 모르겠어.' },
        { speaker: 'minji', text: '…좀 한심하지?' },
        {
          speaker: 'player',
          text: '……',
          choices: [
            {
              text: '한심하긴. 꼭 지금 당장 꿈이 있어야 하는 건 아니잖아.',
              affection: { minji: 15 },
              reply: [
                { speaker: 'minji', text: '…정말 그렇게 생각해?' },
                { speaker: 'player', text: '응. 아직 대학생인데 뭐 어때.' },
                { speaker: 'player', text: '남들보다 조금 늦게 찾을 수도 있지.' },
                { text: '민지가 잠시 {name}을(를) 바라본다.' },
                { speaker: 'minji', text: '…헤헤.' },
                { speaker: 'minji', text: '너한테 말하길 잘했다.' },
                { speaker: 'minji', text: '나 사실 이런 얘기 다른 애들한테는 잘 안 하거든.' },
                { speaker: 'player', text: '왜?' },
                { speaker: 'minji', text: '그냥… 나까지 우울한 소리 하면 분위기 이상해질까 봐?' },
                { text: '민지가 조금 쑥스럽게 웃는다.' },
              ],
            },
            {
              text: '그럼 자격증이나 대외활동부터 준비해 보는 건 어때?',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '음… 그것도 방법이긴 하지.' },
                { speaker: 'minji', text: '근데 그걸 왜 해야 하는지도 잘 모르겠어서…' },
                { speaker: 'minji', text: '아하하, 나 진짜 답 없지?' },
                { text: '민지는 웃지만 표정이 조금 씁쓸하다.' },
              ],
            },
          ],
        },
        { speaker: 'minji', text: '아! 근데 이거 다른 애들한테는 비밀이다?' },
        { speaker: 'player', text: '뭐가?' },
        { speaker: 'minji', text: '내가 이런 고민 하고 있다는 거!' },
        { speaker: 'minji', text: '애들이 나보고 맨날 밝다고 하는데, 사실 이런 고민도 한다고 하면 좀 웃기잖아.' },
        { speaker: 'player', text: '별로 안 웃긴데.' },
        { speaker: 'minji', text: '…그래?' },
        { speaker: 'minji', text: '에헤헤. 그럼 다행이고!' },
      ],
    },
    {
      id: 'date-minji-3',
      title: '내가 잘하는 게 있었어?',
      illust: minji3Img,
      time: '오후',
      lines: [
        { text: '학과 축제 부스 준비 현장. 팀원들의 의견이 맞지 않아 분위기가 어색해졌지만, 민지가 자연스럽게 대화를 이끌며 역할을 조율했다.' },
        { text: '행사가 끝난 뒤.' },
        { speaker: 'minji', text: '으아아~ 드디어 끝났다!' },
        { speaker: 'player', text: '오늘 진짜 고생했어.' },
        { speaker: 'minji', text: '너도! 근데 생각보다 재밌지 않았어?' },
        { speaker: 'player', text: '응. 특히 너 오늘 엄청 바쁘던데?' },
        { speaker: 'minji', text: '나? 뭐가?' },
        { speaker: 'player', text: '아까 애들 의견 안 맞아서 싸울 뻔했을 때도 네가 해결했잖아.' },
        { speaker: 'minji', text: '아~ 그거? 그냥 서로 오해한 것 같길래 이야기 좀 했지!' },
        { speaker: 'player', text: '부스 홍보도 네가 했잖아. 덕분에 사람도 많이 왔고.' },
        { speaker: 'minji', text: '에이~ 그건 다 같이 열심히 해서 그런 거지!' },
        { speaker: 'player', text: '그래도 네가 제일 신나 보였어.' },
        { text: '민지가 잠시 생각한다.' },
        { speaker: 'minji', text: '…그러게.' },
        { speaker: 'minji', text: '오늘 되게 바빴는데 이상하게 하나도 안 힘들었어.' },
        { speaker: 'player', text: '그렇게 돌아다녔는데?' },
        { speaker: 'minji', text: '응! 사람들이랑 얘기하는 것도 좋았고, 다 같이 준비한 거 보여주는 것도 재밌었고!' },
        { speaker: 'minji', text: '특히 어떤 사람이 우리 부스 진짜 재밌었다고 했거든?' },
        { speaker: 'minji', text: '그 말 들으니까 엄청 뿌듯하더라!' },
        { text: '민지가 활짝 웃는다.' },
        { speaker: 'minji', text: '…나 이런 거 좋아하나 봐.' },
        { speaker: 'player', text: '이런 거?' },
        { speaker: 'minji', text: '응. 사람들이랑 같이 뭔가 만들고, 다들 즐거워하는 거 보는 거!' },
        {
          speaker: 'minji',
          text: '근데… 이게 잘하는 일인지는 모르겠네.',
          choices: [
            {
              text: '적어도 오늘 민지가 없었으면 이렇게 잘 안됐을걸?',
              affection: { minji: 15 },
              reply: [
                { speaker: 'minji', text: '…진짜?' },
                { speaker: 'player', text: '응. 너 사람들이랑 이야기할 때 진짜 즐거워 보이더라.' },
                { speaker: 'minji', text: '헤헤…' },
                { speaker: 'minji', text: '사실 나도 오늘은 내가 좀 멋있었던 것 같아!' },
                { speaker: 'player', text: '갑자기 자신감이 넘치네?' },
                { speaker: 'minji', text: '뭐야~ 네가 먼저 칭찬했잖아!' },
                { text: '민지는 쑥스러운 듯 웃다가 {name}의 팔을 가볍게 친다.' },
                { speaker: 'minji', text: '…고마워.' },
              ],
            },
            {
              text: '그럼 이벤트 기획 같은 일을 해보면 되겠네!',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '이벤트 기획?' },
                { speaker: 'minji', text: '오~ 그런 것도 재밌겠다!' },
                { speaker: 'minji', text: '근데 막상 직업으로 하려면 또 다르지 않을까?' },
                { speaker: 'minji', text: '음… 그래도 한 번 알아볼까?' },
              ],
            },
          ],
        },
        { speaker: 'minji', text: '있잖아, 나 오늘 찍은 사진들 정리해서 학과 게시판에 올려보려고!' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'minji', text: '응! 오늘 되게 재밌었잖아. 다른 사람들도 보면 좋을 것 같아서!' },
        { speaker: 'minji', text: '아, 네 사진도 있는데 올려도 돼?' },
        { speaker: 'player', text: '이상하게 나온 건 아니지?' },
        { speaker: 'minji', text: '음~ 그건 직접 확인하시죠!' },
        { text: '민지가 장난스럽게 웃으며 휴대전화를 들어 보인다.' },
      ],
    },
    {
      id: 'date-minji-4',
      title: '나도 한번 해볼래!',
      illust: minji4Img,
      time: '오후',
      lines: [
        { text: '며칠 후, 민지가 {name}을(를) 과방으로 불렀다. 신난 모습이지만, 어딘가 긴장한 것 같다.' },
        { speaker: 'minji', text: '{name}!! 이것 좀 봐봐!' },
        { speaker: 'player', text: '뭔데 그렇게 신났어?' },
        { speaker: 'minji', text: '짜잔~! 지난번 축제 때 찍은 거 편집해 봤어!' },
        { text: '민지가 노트북을 돌려 보여준다.' },
        { speaker: 'player', text: '오, 이거 네가 만든 거야?' },
        { speaker: 'minji', text: '응! 처음이라 좀 어설프긴 한데…' },
        { text: '{name}은(는) 영상을 끝까지 감상한다.' },
        { speaker: 'player', text: '생각보다 되게 잘 만들었는데?' },
        { speaker: 'minji', text: '진짜?!' },
        { speaker: 'player', text: '응. 재밌어.' },
        { speaker: 'minji', text: '헤헤… 다행이다.' },
        { speaker: 'player', text: '근데 언제 이런 걸 다 배웠어?' },
        { speaker: 'minji', text: '그냥 이것저것 찾아봤지! 생각보다 재밌더라고.' },
        { speaker: 'minji', text: '아, 맞다. 나 할 말 있어!' },
        { speaker: 'player', text: '응?' },
        { speaker: 'minji', text: '나 이번에 학교 홍보 서포터즈 모집하는 거 봤거든?' },
        { speaker: 'minji', text: '축제나 행사 취재하고, 사진이랑 영상도 만들고 그런 활동이래.' },
        { speaker: 'minji', text: '…지원해 볼까 생각 중이야.' },
        { speaker: 'player', text: '오, 좋은데?' },
        { speaker: 'minji', text: '그치? 근데 조금 걱정돼.' },
        { speaker: 'minji', text: '나 영상도 처음 만들어 봤고, 다른 지원자들은 엄청 잘할 수도 있잖아.' },
        { speaker: 'minji', text: '괜히 지원했다가 떨어지면 좀 창피할 것 같기도 하고…' },
        { text: '민지가 노트북 화면을 내려다본다.' },
        { speaker: 'minji', text: '그래도 있잖아.' },
        { speaker: 'minji', text: '이번엔 남들이 하니까 따라 하는 게 아니라…' },
        { speaker: 'minji', text: '그냥 내가 해보고 싶어서 해보려는 거야.' },
        {
          speaker: 'minji',
          text: '…나, 지원해 봐도 되겠지?',
          choices: [
            {
              text: '당연하지. 결과가 어떻든 네가 하고 싶어서 선택한 거잖아.',
              affection: { minji: 15 },
              reply: [
                { speaker: 'minji', text: '…그렇지?' },
                { speaker: 'minji', text: '나도 그렇게 생각했어.' },
                { speaker: 'minji', text: '떨어지면 좀 슬프긴 하겠지만…' },
                { speaker: 'minji', text: '그렇다고 안 해보면 더 후회할 것 같거든!' },
                { text: '민지가 환하게 웃는다.' },
                { speaker: 'minji', text: '헤헤. 나 좀 멋있지 않아?' },
                { speaker: 'player', text: '응. 좀 멋있네.' },
                { speaker: 'minji', text: '좀?! 엄청 멋있다고 해야지!' },
                { text: '민지는 장난스럽게 웃으며 {name}의 손을 잡는다.' },
                { speaker: 'minji', text: '고마워.' },
                { speaker: 'minji', text: '네가 내 이야기 들어준 덕분에 조금 용기가 생겼어.' },
              ],
            },
            {
              text: '너라면 무조건 붙을 거야! 걱정하지 마!',
              affection: { minji: 0 },
              reply: [
                { speaker: 'minji', text: '아하하, 그렇게 자신 있게 말해도 되는 거야?' },
                { speaker: 'minji', text: '떨어지면 네가 책임질 거야?' },
                { speaker: 'player', text: '그건 좀…' },
                { speaker: 'minji', text: '농담이야!' },
                { text: '민지가 웃는다.' },
                { speaker: 'minji', text: '그래도 응원해 줘서 고마워!' },
                { speaker: 'minji', text: '일단 한번 해볼게!' },
              ],
            },
          ],
        },
      ],
    },
  ],
  // 소심한 성격 → 버림받을까 불안 → 숨겨진 과거 등장 → 타인을 믿고 받아들이는 성장
  siyeong: [
    {
      id: 'date-siyeong-1',
      title: '우리, 조금 친해진 걸까요?',
      illust: siyeong1Img,
      background: computerClassroomImg,
      lines: [
        { text: '대학교 실습실. 오류 때문에 곤란해하던 {name}의 눈에 혼자 코딩하고 있는 시영이 들어온다.' },
        { speaker: 'player', text: '시영아, 혹시 이것 좀 봐줄 수 있어?' },
        { speaker: 'siyeong', text: '네, 네?! 저요…?' },
        { speaker: 'player', text: '응. 너 코딩 잘하잖아.' },
        { speaker: 'siyeong', text: '아… 저, 잘하는 건 아니고… 조금 할 줄 아는 정도라…' },
        { text: '시영이 {name}의 화면을 살펴본다.' },
        { speaker: 'siyeong', text: '아, 여기서 변수를 잘못 선언하신 것 같아요. 이것만 수정하면…' },
        { speaker: 'player', text: '와, 진짜 해결됐네. 고마워!' },
        { speaker: 'siyeong', text: '아, 아니에요… 별것도 아닌데…' },
        { text: '시영이 작게 웃는다.' },
        { speaker: 'siyeong', text: '저… 다음에도 모르는 거 있으면 물어보셔도 돼요.' },
        {
          speaker: 'siyeong',
          text: '…저한테요.',
          choices: [
            {
              text: '그럼 다음에도 시영이한테 부탁할게.',
              affection: { siyeong: 15 },
              reply: [
                { speaker: 'siyeong', text: '다, 다음에도요…? …네! 얼마든지요!' },
                { text: '시영은 {name}이(가) 나간 뒤에도 한동안 기분 좋은 표정을 짓는다.' },
              ],
            },
            {
              text: '고마워. 다른 친구한테도 알려줘야겠다.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '아… 네. 도움이 됐다면 다행이에요.' },
                { text: '시영은 조금 아쉬운 듯 고개를 숙인다.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-siyeong-2',
      title: '답장이 오지 않는 밤',
      illust: siyeong2Img,
      lines: [
        { text: '학교 앞 카페. 어젯밤 시영이 보낸 과제 메시지에 {name}은(는) 잠드는 바람에 답장하지 못했다.' },
        { text: '카페에서 마주친 시영은 평소보다 어색하게 행동한다.' },
        { speaker: 'siyeong', text: '저… {name} 씨.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'siyeong', text: '혹시 제가 어제… 귀찮게 해드렸나요?' },
        { speaker: 'player', text: '어? 무슨 소리야?' },
        { speaker: 'siyeong', text: '아, 아니에요… 제가 밤늦게 메시지를 보내서…' },
        { speaker: 'player', text: '아! 미안, 어제 잠들어서 못 봤어.' },
        { speaker: 'siyeong', text: '아… 주무셨구나.' },
        { text: '시영이 안도의 한숨을 내쉰다.' },
        { speaker: 'player', text: '그게 그렇게 걱정됐어?' },
        { speaker: 'siyeong', text: '…네.' },
        { speaker: 'siyeong', text: '답장이 없으니까… 제가 뭔가 잘못했나 싶어서요.' },
        { speaker: 'siyeong', text: '계속 생각하다 보니까… 어느새 새벽이더라고요.' },
        {
          text: '시영은 멋쩍게 웃는다.',
          choices: [
            {
              text: '답장이 늦어도 너랑 이야기하기 싫어진 건 아니야.',
              affection: { siyeong: 15 },
              reply: [
                { speaker: 'siyeong', text: '…정말요?' },
                { speaker: 'siyeong', text: '헤헤… 그럼 다행이에요.' },
                { speaker: 'siyeong', text: '그 말… 기억해도 되죠?' },
              ],
            },
            {
              text: '그 정도로 걱정할 일은 아닌데?',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '그, 그렇죠… 제가 좀 유난스럽죠?' },
                { text: '시영은 웃어 보이지만, 손에 쥔 휴대전화를 쉽게 내려놓지 못한다.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-siyeong-3',
      title: '저만 특별했으면 좋겠어요',
      illust: siyeong3Img,
      time: '늦은 오후',
      lines: [
        { text: '늦은 오후, 대학교 벤치. 나란히 앉아 이야기를 나누던 중 시영이 조심스럽게 입을 연다.' },
        { speaker: 'siyeong', text: '저… 고등학교 때 친구가 별로 없었거든요.' },
        { speaker: 'siyeong', text: '그래도 딱 한 명, 정말 친한 친구가 있었어요.' },
        { speaker: 'siyeong', text: '그 친구랑 있으면… 저도 평범한 사람 같았어요.' },
        { speaker: 'siyeong', text: '근데 어느 날부터 저보다 다른 친구들이랑 더 친해지더라고요.' },
        { speaker: 'player', text: '많이 서운했겠다.' },
        { speaker: 'siyeong', text: '…네. 그래도 그 친구가 잘못한 건 아니에요.' },
        { speaker: 'siyeong', text: '제가 그 친구의 유일한 친구인 건 아니니까요.' },
        { text: '시영이 손가락을 만지작거린다.' },
        { speaker: 'siyeong', text: '그냥…' },
        { speaker: 'siyeong', text: '저도 누군가한테 제일 소중한 사람이 되고 싶었어요.' },
        { speaker: 'siyeong', text: '누군가가 다른 사람들 사이에서도 저를 먼저 찾아줬으면 좋겠고…' },
        { speaker: 'siyeong', text: '…이상하죠?' },
        { text: '잠시 침묵이 흐른다.' },
        {
          speaker: 'siyeong',
          text: '{name} 씨는… 제가 특별하다고 생각하세요?',
          choices: [
            {
              text: '응. 넌 나한테 충분히 특별한 사람이야.',
              affection: { siyeong: 15 },
              reply: [
                { speaker: 'siyeong', text: '…!' },
                { speaker: 'siyeong', text: '그, 그런 말… 아무렇지도 않게 하시면 안 돼요.' },
                { text: '시영의 귀가 붉어진다.' },
                { speaker: 'siyeong', text: '저는… 그런 말 들으면 정말 믿어버리니까요.' },
              ],
            },
            {
              text: '꼭 누군가의 첫 번째여야 할 필요는 없잖아.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '그렇죠… 머리로는 알고 있어요.' },
                { speaker: 'siyeong', text: '근데 마음이… 생각처럼 잘 안 돼서요.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-siyeong-4',
      title: '저를 두고 가지 마세요',
      illust: siyeong4Img,
      time: '저녁',
      lines: [
        { text: '낮에 {name}이(가) 에밀리, 민지와 즐겁게 이야기하는 모습을 본 시영. 모두 소중한 친구라는 걸 알지만, 자꾸만 질투가 난다.' },
        { text: '그날 저녁, 과방에 둘만 남았다.' },
        { speaker: 'siyeong', text: '{name} 씨… 오늘 에밀리 씨랑 되게 즐거워 보이셨어요.' },
        { speaker: 'player', text: '응? 그냥 과제 얘기했는데?' },
        { speaker: 'siyeong', text: '아… 그랬구나.' },
        { text: '시영이 고개를 숙인다.' },
        { speaker: 'siyeong', text: '저… 사실 조금 부러웠어요.' },
        { speaker: 'player', text: '뭐가?' },
        { speaker: 'siyeong', text: '저는 {name} 씨랑 이야기할 때도 무슨 말을 해야 할지 한참 고민하거든요.' },
        { speaker: 'siyeong', text: '그런데 다른 분들은 너무 자연스럽게 웃고 이야기하시니까…' },
        { speaker: 'siyeong', text: '저보다 그 사람들이 더 좋아지시면 어떡하나 싶어서…' },
        { text: '시영이 {name}의 옷소매를 살짝 붙잡는다.' },
        { speaker: 'siyeong', text: '…저도 알아요. 이상한 생각이라는 거.' },
        { speaker: 'siyeong', text: '{name} 씨가 누구랑 친하게 지내든 제 마음대로 할 수 없는 거잖아요.' },
        { speaker: 'siyeong', text: '그런데도 자꾸… 저만 봐주셨으면 좋겠어요.' },
        {
          speaker: 'siyeong',
          text: '…저, 나쁜 사람이죠?',
          // 집착을 그대로 받아주기보다 애정을 보여주면서 건강한 관계의 기준을 세우는 쪽이 정답
          choices: [
            {
              text: '질투할 수도 있지. 그래도 넌 다른 사람과 비교하지 않아도 소중해.',
              affection: { siyeong: 15 },
              reply: [
                { speaker: 'siyeong', text: '…비교하지 않아도요?' },
                { speaker: 'player', text: '응. 누군가랑 더 친해진다고 네가 덜 소중해지는 건 아니니까.' },
                { text: '시영의 눈가가 붉어진다.' },
                { speaker: 'siyeong', text: '저… 정말 바보 같네요.' },
                { speaker: 'siyeong', text: '그럼… 조금씩 믿어볼게요.' },
                { speaker: 'siyeong', text: '{name} 씨도… 제 곁에 있고 싶어서 있는 거라고요.' },
              ],
            },
            {
              text: '그렇게 계속 의심하면 나도 힘들어.',
              affection: { siyeong: 0 },
              reply: [
                { speaker: 'siyeong', text: '…네. 맞아요.' },
                { speaker: 'siyeong', text: '저도 그러고 싶지 않은데…' },
                { text: '시영은 옷소매를 잡았던 손을 천천히 놓는다.' },
                { speaker: 'siyeong', text: '미안해요. 제 불안 때문에 곤란하게 하고 싶지는 않았어요.' },
              ],
            },
          ],
        },
      ],
    },
  ],
  // 당당한 츤데레 → 숨겨진 과거 발견 → 완벽주의로 인한 갈등 → 실패를 받아들이는 성장
  emily: [
    {
      id: 'date-emily-1',
      title: '이 정도는 기본이거든?',
      illust: emily1Img,
      background: computerClassroomImg,
      lines: [
        { text: '대학교 실습실. 에밀리가 게임 캐릭터를 디자인하고 있다. 지나가다 모니터를 본 {name}의 발걸음이 멈춘다.' },
        { speaker: 'player', text: '와, 이거 네가 그린 거야?' },
        { speaker: 'emily', text: '…남의 모니터를 그렇게 대놓고 보는 취미가 있어?' },
        { speaker: 'player', text: '미안. 근데 진짜 잘 그렸다.' },
        { speaker: 'emily', text: '흥. 당연하지. 내가 그렸는데.' },
        { speaker: 'player', text: '그림 되게 오래 그렸나 봐.' },
        { speaker: 'emily', text: '글쎄. 남들보단 늦게 시작했을걸?' },
        { speaker: 'player', text: '진짜? 전혀 그렇게 안 보이는데.' },
        { speaker: 'emily', text: '그야 내가 그만큼 연습했으니까.' },
        { text: '에밀리는 아무렇지 않게 대답하면서도 입꼬리가 살짝 올라간다.' },
        {
          speaker: 'emily',
          text: '…뭐, 보는 눈은 있네.',
          choices: [
            {
              text: '재능도 재능인데, 엄청 노력했나 보네.',
              affection: { emily: 15 },
              reply: [
                { speaker: 'emily', text: '…!' },
                { speaker: 'emily', text: '뭐야, 갑자기 그런 말을 하고.' },
                { speaker: 'emily', text: '…그래도 틀린 말은 아니네.' },
                { text: '에밀리는 {name}에게서 시선을 돌린다.' },
              ],
            },
            {
              text: '그럼 나도 하나 그려줘!',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '뭐? 내가 그렇게 한가해 보여?' },
                { speaker: 'emily', text: '…나중에 시간 남으면 생각은 해볼게.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-emily-2',
      title: '버리지 못한 사진',
      illust: emily2Img,
      lines: [
        { text: '과방. 에밀리가 가방을 챙기다 수첩을 떨어뜨린다.' },
        { speaker: 'player', text: '에밀리, 수첩 떨어졌어.' },
        { speaker: 'emily', text: '아, 고마…' },
        { text: '수첩 사이에서 사진 한 장이 떨어진다.' },
        { speaker: 'player', text: '어? 이거 너야?' },
        { text: '사진 속에는 무대 의상을 입고 환하게 웃고 있는 에밀리가 있다.' },
        { speaker: 'emily', text: '…!' },
        { speaker: 'emily', text: '야, 그거 줘.' },
        { speaker: 'player', text: '아, 미안. 근데 무용도 했었어?' },
        { speaker: 'emily', text: '…옛날에.' },
        { speaker: 'player', text: '되게 멋있다. 공연 사진이야?' },
        { speaker: 'emily', text: '응. 고등학교 때 찍은 거.' },
        { speaker: 'player', text: '지금은 안 해?' },
        { text: '에밀리가 잠시 침묵한다.' },
        { speaker: 'emily', text: '…그만뒀어.' },
        { speaker: 'player', text: '왜?' },
        { speaker: 'emily', text: '그냥. 더 이상 할 수 없게 됐거든.' },
        { text: '에밀리는 사진을 수첩 사이에 다시 끼워 넣는다.' },
        {
          speaker: 'emily',
          text: '옛날얘기야. 별로 재미도 없고.',
          choices: [
            {
              text: '알겠어. 나중에 얘기하고 싶어지면 들려줘.',
              affection: { emily: 15 },
              reply: [
                { speaker: 'emily', text: '…뭐야, 의외로 눈치 있네.' },
                { text: '에밀리가 조용히 수첩을 내려다본다.' },
                { speaker: 'emily', text: '…고마워.' },
              ],
            },
            {
              text: '에이, 궁금한데 조금만 더 알려주라.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '궁금해도 별수 없지.' },
                { speaker: 'emily', text: '별로 좋은 기억도 아니니까.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-emily-3',
      title: '한 번 포기한 꿈',
      illust: emily3Img,
      time: '저녁',
      lines: [
        { text: '팀 프로젝트가 끝난 날. 에밀리는 혼자 옥상에 올라와 있다.' },
        { speaker: 'player', text: '여기 있었네. 다들 너 찾던데.' },
        { speaker: 'emily', text: '왜? 또 나한테 일 시키려고?' },
        { speaker: 'player', text: '아니, 오늘 작업 진짜 잘했다고.' },
        { speaker: 'emily', text: '…그런 말은 직접 하라고 해.' },
        { text: '잠시 침묵이 흐른다.' },
        { speaker: 'emily', text: '야, {name}.' },
        { speaker: 'player', text: '응?' },
        { speaker: 'emily', text: '너는… 진짜 하고 싶은 일이 있는데, 더 이상 할 수 없게 되면 어떻게 할 것 같아?' },
        { speaker: 'player', text: '갑자기?' },
        { speaker: 'emily', text: '그냥 궁금해서.' },
        { speaker: 'emily', text: '나 고등학교 때 무용했거든.' },
        { speaker: 'emily', text: '꽤 잘했어. 진짜로.' },
        { speaker: 'emily', text: '근데 공연 준비하다가 다쳤어. 처음엔 좀 쉬면 괜찮아질 줄 알았지.' },
        { speaker: 'emily', text: '…결국 돌아가지 못했지만.' },
        { text: '에밀리가 난간에 팔을 기댄다.' },
        { speaker: 'emily', text: '그때 진짜 웃겼던 게 뭔지 알아?' },
        { speaker: 'emily', text: '하루아침에 내 인생이 텅 빈 것 같더라.' },
        { speaker: 'emily', text: '그래서 컴퓨터로 할 수 있는 일을 찾아봤어. 그러다가 디자인을 시작했고.' },
        { speaker: 'emily', text: '처음엔 그냥 시간이나 때우려고 한 건데… 생각보다 재미있더라.' },
        { speaker: 'player', text: '그래서 그래픽 디자이너가 되고 싶은 거구나.' },
        { speaker: 'emily', text: '응.' },
        { text: '에밀리가 작게 웃는다.' },
        { speaker: 'emily', text: '이번엔 진짜 잘하고 싶어.' },
        { speaker: 'emily', text: '…아니, 잘해야 해.' },
        {
          speaker: 'emily',
          text: '두 번이나 꿈을 포기하는 건… 좀 한심하잖아.',
          choices: [
            {
              text: '다른 꿈을 찾은 것도 충분히 대단한 일이라고 생각해.',
              affection: { emily: 15 },
              reply: [
                { speaker: 'emily', text: '…너는 말이지.' },
                { speaker: 'emily', text: '가끔 사람 되게 이상하게 만들어.' },
                { speaker: 'player', text: '내가 뭘?' },
                { speaker: 'emily', text: '…아무것도 아니야.' },
                { text: '에밀리는 고개를 돌리고 작게 웃는다.' },
                { speaker: 'emily', text: '그런 말… 처음 들어봤거든.' },
              ],
            },
            {
              text: '이번에는 반드시 성공할 거야.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '…당연하지.' },
                { speaker: 'emily', text: '이번에는 정말 성공해야 하니까.' },
                { text: '자신 있게 대답하지만, 어딘가 굳은 표정이다.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'date-emily-4',
      title: '완벽하지 않아도 괜찮아',
      illust: emily4Img,
      background: computerClassroomImg,
      time: '밤',
      lines: [
        { text: '게임 그래픽 공모전 마감 하루 전. 늦은 밤인데도 실습실에 불이 켜져 있다.' },
        { text: '이미 충분히 좋은 결과물이지만, 에밀리는 작은 문제를 발견할 때마다 처음부터 다시 손보고 있다.' },
        { speaker: 'player', text: '에밀리? 아직도 안 갔어?' },
        { speaker: 'emily', text: '…왜 왔어?' },
        { speaker: 'player', text: '불이 켜져 있길래. 아직 작업 중이야?' },
        { speaker: 'emily', text: '응. 조금만 더 하면 돼.' },
        { speaker: 'player', text: '그 말 아까도 하지 않았어?' },
        { speaker: 'emily', text: '아, 진짜! 조금만 더 하면 된다니까!' },
        { text: '에밀리가 신경질적으로 마우스를 움직인다.' },
        { speaker: 'player', text: '…에밀리.' },
        { speaker: 'emily', text: '왜!' },
        { speaker: 'player', text: '너 지금 엄청 지쳐 보여.' },
        { speaker: 'emily', text: '그럼 어떡하라고? 아직 완벽하지 않은데!' },
        { speaker: 'player', text: '내가 보기엔 충분히 잘했어.' },
        { speaker: 'emily', text: '네가 뭘 알아!' },
        { text: '순간 정적이 흐른다.' },
        { speaker: 'emily', text: '…미안.' },
        { text: '에밀리가 고개를 숙인다.' },
        { speaker: 'emily', text: '나도 알아. 이 정도면 괜찮다는 거.' },
        { speaker: 'emily', text: '근데 자꾸 보여. 부족한 부분이.' },
        { speaker: 'emily', text: '여기서 대충 넘어갔다가 떨어지면? 내가 더 잘할 수 있었는데 안 한 거잖아.' },
        { speaker: 'emily', text: '그러면… 또 내 탓이잖아.' },
        { text: '에밀리의 목소리가 점점 작아진다.' },
        { speaker: 'emily', text: '…나 또 실패하기 싫어.' },
        {
          speaker: 'emily',
          text: '이번에도 잘 안되면, 내가 뭘 해야 할지 모르겠어.',
          choices: [
            {
              text: '실패하더라도 네가 노력한 시간까지 사라지는 건 아니야.',
              affection: { emily: 15 },
              reply: [
                { speaker: 'emily', text: '…그게 무슨 소리야.' },
                { speaker: 'player', text: '무용을 하던 시간도, 지금 디자인을 하는 시간도 전부 네가 쌓아온 거잖아.' },
                { speaker: 'player', text: '한 번 실패한다고 그게 전부 없어지는 건 아니지.' },
                { speaker: 'emily', text: '…' },
                { speaker: 'player', text: '그리고 나는 네가 만든 작품, 진짜 좋다고 생각해.' },
                { text: '에밀리가 입술을 꾹 깨문다.' },
                { speaker: 'emily', text: '…짜증 나.' },
                { speaker: 'player', text: '뭐가?' },
                { speaker: 'emily', text: '그런 말을 하면…' },
                { speaker: 'emily', text: '더는 고집부릴 수 없잖아.' },
                { text: '에밀리가 작게 웃는다.' },
                { speaker: 'emily', text: '…알았어. 오늘은 여기까지만 할게.' },
                { speaker: 'emily', text: '대신 내일 제출할 때 옆에 있어 줘.' },
                { speaker: 'emily', text: '…혼자 있으려니까 좀 무서워서.' },
              ],
            },
            {
              text: '그럼 완벽해질 때까지 더 해보자.',
              affection: { emily: 0 },
              reply: [
                { speaker: 'emily', text: '…그래. 역시 그렇지?' },
                { text: '에밀리는 다시 모니터로 고개를 돌린다.' },
                { speaker: 'emily', text: '조금만 더 고치면 될 거야. 분명히…' },
                { text: '{name}은(는) 쉽게 자리를 떠나지 못한다.' },
              ],
            },
          ],
        },
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

// 데이트 에피소드 해금에 필요한 호감도 (히로인별 1번째, 2번째 …)
export const DATE_UNLOCKS = [0, 20, 50, 80];

// 데이트 1회 비용
export const DATE_COST = 50000;

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

// 에피소드의 대표 캐릭터 (주인공이 아닌 첫 화자, 없으면 주인공)
export function getMainSpeaker(episode: Episode): Speaker {
  return episode.lines.find((l) => l.speaker && l.speaker !== 'player')?.speaker ?? 'player';
}
