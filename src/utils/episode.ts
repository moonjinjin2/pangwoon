import hayeongImg from '../img/character/hayeong.png';
import minjiImg from '../img/character/minji.png';
import siyeongImg from '../img/character/siyeong.png';
import emilyImg from '../img/character/emily.png';
import computerClassroomImg from '../img/computer_classroom.png';
import type { Effect } from './activity';

// 히로인. 데이트는 한 달에 한 명씩 이 순서대로 번갈아 등장
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
// stats: 게임에서 얻은 스탯 변화량 (health·strength·intellect·charm·stress, 골드는 coins)
export const GAME_END_TYPE = 'game-end';

export interface GameEnd {
  ending?: string;
  stats?: Effect;
}

const EFFECT_KEYS: (keyof Effect)[] = ['health', 'strength', 'intellect', 'charm', 'stress', 'coins'];

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
  // 컬렉션 카드 일러스트 (없으면 배경 + 등장 캐릭터로 대신 그림)
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
      { text: '[SYSTEM ERROR] 비정상적인 접속 요청이 감지되었습니다. 관리자 계정의 접근을 확인했습니다.' },
      { text: '[SYSTEM ERROR] 외부 접속자를 강제 소환합니다. 접속을 취소할 수 없습니다.' },
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
    title: '새로운 얼굴',
    lines: [
      { text: '5월의 마지막 날. 알바하던 카페에 낯선 손님이 찾아왔다.' },
      { speaker: 'emily', text: 'Hi! 혹시… 여기 아이스 아메리카노 제일 큰 사이즈 있어요?' },
      { speaker: 'player', text: '네, 벤티 사이즈로 드릴게요!' },
      {
        speaker: 'emily',
        text: '고마워요! 저 이번에 교환학생으로 왔어요. 한국어… 이상하지 않아요?',
        choices: [
          {
            text: '한국인인 줄 알았어요!',
            affection: { emily: 10 },
            reply: [{ speaker: 'emily', text: 'Really? 와, 기분 좋아요!' }],
          },
          {
            text: '조금 어색하긴 해요.',
            affection: { emily: -5 },
            reply: [{ speaker: 'emily', text: 'Oh… 더 연습해야겠네요.' }],
          },
          {
            text: '제가 한국어 알려드릴까요?',
            affection: { emily: 15 },
            reply: [{ speaker: 'emily', text: 'Wow, 정말요? 그럼 우리 친구해요! 저는 에밀리예요.' }],
          },
        ],
      },
      { text: '그렇게 새로운 인연이 시작되었다.' },
    ],
  },
};

const DEFAULT_EPISODE: Episode = {
  id: 'month-default',
  title: '한 달을 돌아보며',
  icon: '📅',
  lines: [
    { text: '어느새 한 달이 지나갔다.' },
    {
      speaker: 'siyeong',
      text: '{name}, 이번 달은 어땠어?',
      choices: [
        {
          text: '정신없었지만 조금 성장한 것 같아.',
          affection: { siyeong: 10 },
          reply: [{ speaker: 'siyeong', text: '그거면 충분해. 잘하고 있어.' }],
        },
        {
          text: '그냥 그랬어.',
          affection: { siyeong: 0 },
          reply: [{ speaker: 'siyeong', text: '그래? 다음 달엔 재밌는 일 있으면 좋겠다.' }],
        },
        {
          text: '너 보느라 바빴지.',
          affection: { siyeong: 15 },
          reply: [{ speaker: 'siyeong', text: '…농담이라도 그런 말 하면 곤란해. 후후.' }],
        },
      ],
    },
    { speaker: 'siyeong', text: '다음 달도 화이팅이야!' },
  ],
};

export function getEpisode(month: number) {
  return EPISODES[month] ?? DEFAULT_EPISODE;
}

// 임시 데이트 에피소드. 히로인별로 순서대로 진행하고, 다 보면 처음부터 반복
const DATE_EPISODES: Record<Heroine, Episode[]> = {
  minji: [
    {
      id: 'date-minji-1',
      title: '첫 데이트',
      lines: [
        { text: '약속 장소인 카페 앞. 민지가 먼저 와서 손을 흔들고 있다.' },
        { speaker: 'minji', text: '{name}! 여기야 여기!' },
        { speaker: 'player', text: '일찍 왔네? 오래 기다렸어?' },
        {
          speaker: 'minji',
          text: '아니~ 방금 왔어. 근데… 나 오늘 뭐 달라진 거 없어?',
          choices: [
            {
              text: '머리 스타일 바꿨네? 잘 어울려.',
              affection: { minji: 15 },
              reply: [{ speaker: 'minji', text: '헤헤, 알아봐 줬네! 어제 자른 거야.' }],
            },
            {
              text: '음… 살 쪘어?',
              affection: { minji: -15 },
              reply: [{ speaker: 'minji', text: '…케이크 너 혼자 다 사.' }],
            },
            {
              text: '오늘따라 더 예쁜데?',
              affection: { minji: 10 },
              reply: [{ speaker: 'minji', text: '말은 잘해~ 그래도 기분은 좋네.' }],
            },
          ],
        },
        { text: '달콤한 케이크를 나눠 먹으며 시간 가는 줄 몰랐다.' },
        { speaker: 'minji', text: '다음에도… 또 같이 오자. 약속!' },
      ],
    },
    {
      id: 'date-minji-2',
      title: '야경 산책',
      lines: [
        { text: '해가 지고, 둘은 강변을 따라 천천히 걸었다.' },
        {
          speaker: 'minji',
          text: '요즘 바빠 보이던데, 무리하는 거 아니지?',
          choices: [
            {
              text: '걱정해주는 거야?',
              affection: { minji: 10 },
              reply: [{ speaker: 'minji', text: '…당연하지. 바보.' }],
            },
            {
              text: '괜찮아, 신경 쓰지 마.',
              affection: { minji: -5 },
              reply: [{ speaker: 'minji', text: '신경 쓰이니까 물어본 거잖아…' }],
            },
            {
              text: '너랑 있으면 피로가 풀려.',
              affection: { minji: 15 },
              reply: [{ speaker: 'minji', text: '그, 그럼 자주 만나든가…!' }],
            },
          ],
        },
        { text: '강물 위로 도시의 불빛이 반짝였다.' },
      ],
    },
  ],
  siyeong: [
    {
      id: 'date-siyeong-1',
      title: '도서관 데이트',
      lines: [
        { text: '조용한 도서관. 시영이 창가 자리에서 책을 읽고 있다.' },
        { speaker: 'siyeong', text: '왔어? 자리 맡아놨어.' },
        { speaker: 'player', text: '무슨 책 읽고 있었어?' },
        {
          speaker: 'siyeong',
          text: '추리소설. 범인이 누군지 맞혀볼래?',
          choices: [
            {
              text: '집사가 범인이야.',
              affection: { siyeong: 5 },
              reply: [{ speaker: 'siyeong', text: '뻔한 답이네. 근데… 정답이야. 후후.' }],
            },
            {
              text: '스포는 싫어, 같이 읽자.',
              affection: { siyeong: 15 },
              reply: [{ speaker: 'siyeong', text: '좋아. 그럼 처음부터 같이 읽자.' }],
            },
            {
              text: '책보다 너가 더 궁금해.',
              affection: { siyeong: 10 },
              reply: [{ speaker: 'siyeong', text: '…여기 도서관이야. 조용히 해.' }],
            },
          ],
        },
        { text: '둘은 소곤소곤 이야기를 나누다 사서에게 조용히 하라는 눈치를 받았다.' },
        { speaker: 'siyeong', text: '…다음엔 카페에서 하자.' },
      ],
    },
    {
      id: 'date-siyeong-2',
      title: '비 오는 날',
      lines: [
        { text: '갑자기 쏟아진 비. 우산은 하나뿐이다.' },
        {
          speaker: 'siyeong',
          text: '어떡하지? 우산이 하나밖에 없네.',
          choices: [
            {
              text: '같이 쓰자.',
              affection: { siyeong: 15 },
              reply: [{ speaker: 'siyeong', text: '응… 어깨 젖겠다, 더 붙어.' }],
            },
            {
              text: '너 써. 난 뛰어갈게.',
              affection: { siyeong: 5 },
              reply: [{ speaker: 'siyeong', text: '바보야, 감기 걸려. …같이 쓰자.' }],
            },
            {
              text: '비 그칠 때까지 기다리자.',
              affection: { siyeong: 10 },
              reply: [{ speaker: 'siyeong', text: '그래. 너랑이면 기다리는 것도 괜찮아.' }],
            },
          ],
        },
        { text: '빗소리 사이로 서로의 심장 소리가 들리는 것 같았다.' },
      ],
    },
  ],
  emily: [
    {
      id: 'date-emily-1',
      title: '시장 투어',
      lines: [
        { text: '북적이는 전통시장. 에밀리의 눈이 반짝인다.' },
        {
          speaker: 'emily',
          text: 'Wow! {name}, 뭐 먹을까요? 추천해 주세요!',
          choices: [
            {
              text: '호떡! 겨울 간식의 왕이야.',
              affection: { emily: 15 },
              reply: [{ speaker: 'emily', text: 'Hot hot hot! …그래도 너무 맛있어요!' }],
            },
            {
              text: '번데기 도전해볼래?',
              affection: { emily: -5 },
              reply: [{ speaker: 'emily', text: 'Oh no… 이건 좀… 다음에요!' }],
            },
            {
              text: '너 먹고 싶은 거 다 먹자.',
              affection: { emily: 10 },
              reply: [{ speaker: 'emily', text: 'Really? 그럼 전부 다요!' }],
            },
          ],
        },
        { text: '에밀리는 그날 호떡을 세 개나 먹었다.' },
      ],
    },
    {
      id: 'date-emily-2',
      title: '사진 한 장',
      lines: [
        { text: '노을 지는 전망대. 에밀리가 휴대폰을 꺼낸다.' },
        {
          speaker: 'emily',
          text: '우리 같이 사진 찍어요! 엄마한테 보여줄 거예요. 괜찮아요?',
          choices: [
            {
              text: '좋아! 예쁘게 찍자.',
              affection: { emily: 10 },
              reply: [{ speaker: 'emily', text: 'Say cheese~!' }],
            },
            {
              text: '나를 뭐라고 소개하려고?',
              affection: { emily: 15 },
              reply: [{ speaker: 'emily', text: 'Hmm… 비밀이에요!' }],
            },
            {
              text: '사진 찍히는 거 별로야.',
              affection: { emily: -10 },
              reply: [{ speaker: 'emily', text: 'Oh… 그럼 풍경만 찍을게요.' }],
            },
          ],
        },
        { text: '붉은 노을이 두 사람을 물들였다.' },
      ],
    },
  ],
};

// monthIndex: 게임 시작 달부터 몇 번째 달인지 (0부터)
export function getDateEpisode(monthIndex: number) {
  const partner = HEROINES[monthIndex % HEROINES.length];
  const episodes = DATE_EPISODES[partner];
  const round = Math.floor(monthIndex / HEROINES.length);
  return { partner, episode: episodes[round % episodes.length] };
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

// 에피소드의 대표 캐릭터 (주인공이 아닌 첫 화자, 없으면 주인공)
export function getMainSpeaker(episode: Episode): Speaker {
  return episode.lines.find((l) => l.speaker && l.speaker !== 'player')?.speaker ?? 'player';
}
