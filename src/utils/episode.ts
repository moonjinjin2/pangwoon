import hayeongImg from '../img/character/hayeong.png';
import minjiImg from '../img/character/minji.png';
import siyeongImg from '../img/character/siyeong.png';
import emilyImg from '../img/character/emily.png';

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
  // {name} → 플레이어 이름
  text: string;
  // 있으면 이 대사 후 선택지 표시
  choices?: Choice[];
}

export interface Episode {
  title: string;
  // 현재 상황 창 아이콘 (이모지)
  icon?: string;
  // 현재 상황 창에 날짜 옆에 표시 (예: '저녁')
  time?: string;
  lines: EpisodeLine[];
}

// 임시 에피소드. 달(1~12)별로 지정하고, 없는 달은 DEFAULT_EPISODE
const EPISODES: Record<number, Episode> = {
  4: {
    title: '벚꽃 아래에서',
    lines: [
      { text: '4월의 마지막 날. 창밖으로 벚꽃잎이 흩날리고 있다.' },
      { speaker: 'minji', text: '{name}! 오늘 한강 갈래? 꽃 다 지기 전에 한 번은 봐야지!' },
      { speaker: 'player', text: '좋아! 이번 달 진짜 바빴는데, 오늘은 좀 쉬어야겠다.' },
      { text: '둘은 돗자리를 펴고 앉아 한참 동안 수다를 떨었다.' },
      {
        speaker: 'minji',
        text: '다음 달엔 우리 같이 목표 하나 세워볼까? 뭐가 좋을 것 같아?',
        choices: [
          {
            text: '같이 운동하자!',
            affection: { minji: 10 },
            reply: [{ speaker: 'minji', text: '좋아! 나 아침잠 많은데… 깨워줘야 해?' }],
          },
          {
            text: '각자 알아서 하자.',
            affection: { minji: -5 },
            reply: [{ speaker: 'minji', text: '…그래, 뭐. 알겠어.' }],
          },
          {
            text: '너랑 자주 만나는 거?',
            affection: { minji: 15 },
            reply: [{ speaker: 'minji', text: '뭐, 뭐야 갑자기…! 그, 그것도 나쁘지 않네.' }],
          },
        ],
      },
      { text: '벚꽃잎 하나가 민지의 머리 위에 살포시 내려앉았다.' },
    ],
  },
  5: {
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
