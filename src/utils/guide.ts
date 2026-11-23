import type { GuideStep } from '../components/GuideTour';
import { REVEAL_PRICE } from '../components/AffectionBox';

const gold = (n: number) => `${n.toLocaleString('en-US')}G`;

// 프롤로그 직후 메인 화면에서 한 번 보여주는 가이드 (target은 메인 화면 요소의 CSS 선택자)
export const MAIN_GUIDE: GuideStep[] = [
  {
    title: '야간 단과대학에 온 걸 환영해요!',
    text: '이곳은 사실 뱀파이어들이 다니는 대학교예요.\n학교는 당신을 뱀파이어 신입생으로 알고 있어요.\n정체를 들키지 않고 대학 생활을 버텨 보세요.',
  },
  {
    title: '스테이터스',
    text: '체력 — 활동할수록 깎이고, 침대에서 뒹굴거리기로 회복해요.\n매력 — 높을수록 스토리에서 호감도가 더 많이 올라요.\n정신력 — 높을수록 흥분해서 들킬 위기를 잘 버텨요.\n위장도 — 높을수록 에피소드 위험도가 덜 올라요.',
    warn: `체력이 0이 되면 그대로 사망해요.`,
    target: ['.main__right > :nth-child(1)'],
  },
  {
    title: '이번 달 스케줄',
    text: '한 달은 4주예요. 주마다 할 활동을 바꿀 수 있어요.\n학사 알바 · 피 뽑기 — 골드를 벌어요.\n침대에서 뒹굴거리기 — 체력을 회복해요.\n명상 — 정신력이 올라요.\n화이트태닝 — 매력이 올라요.',
    target: ['.main__left > :not(.school)'],
  },
  {
    title: '골드',
    text: '알바나 피 뽑기로 번 골드는 여기서 확인해요.\n상점에서 아이템을 뽑거나 히로인의 호감도를 확인하는 데 써요.',
    target: ['.topmenu__coins'],
  },
  {
    title: '상점 · 앨범 · 설정',
    text: `상점 — 가챠로 아이템을 뽑아요.\n아이템을 쓰면 스탯이 오르고, 위장도는 아이템으로만 올릴 수 있어요.\n앨범 — 지금까지 본 에피소드를 다시 볼 수 있어요.`,
    target: ['.topmenu > :not(.topmenu__coins)'],
  },
  {
    title: '호감도',
    text: `에밀리 · 서시영 · 송민지의 호감도예요.\n한 명당 ${gold(REVEAL_PRICE)}을 내면 계속 볼 수 있어요.\n에피소드에서 고른 선택지에 따라 오르내려요.`,
    target: ['.main__right > :nth-child(2)'],
  },
  {
    title: '일정 진행',
    text: '진행하기를 누르면 이번 주 스케줄이 실행돼요.\n매달 말일엔 메인 에피소드가 기다리고 있어요.',
    target: ['.main__action'],
  },
  {
    title: '에피소드 위험도',
    text: '에피소드 중엔 인간임을 들킬 뻔한 순간이 찾아와요.\n그때마다 위험도가 오르고, 고른 선택지에 따라 호감도도 달라져요.',
    warn: '위험도가 100이 되면 정체가 발각되어 게임 오버!',
  },
  {
    title: '준비 완료!',
    text: '그럼 들키지 않게 조심하세요.\n이 가이드는 설정에서 언제든 다시 볼 수 있어요.',
  },
];
