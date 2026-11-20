// 아르데코풍 버튼 테두리: 계단식으로 깎인 모서리 + 위아래 가운데 돌출 장식 + 좌우가 뾰족한 두 줄 안쪽 패널
// 버튼 너비가 달라도 모서리·장식이 찌그러지지 않게 [왼끝][늘어나는 선][가운데 장식][늘어나는 선][오른끝] 다섯 조각으로 그림
// 좌표는 높이 72 기준 (버튼 높이에 맞춰 비례로 커지고 줄어듦)

// 끝 조각 (왼쪽 기준, 오른쪽은 좌우 뒤집음)
function Cap({ flip = false }: { flip?: boolean }) {
  return (
    <svg className={flip ? 'deco__cap deco__cap--right' : 'deco__cap'} viewBox="0 0 30 72" aria-hidden>
      <path className="deco__fill" d="M30 6H8v8H2v44h6v8h22z" />
      <path className="deco__line" d="M30 6H8v8H2v44h6v8h22" />
      <path className="deco__line" d="M30 12H16L6 36l10 24h14" />
      <path className="deco__line deco__line--soft" d="M30 16H20l-9 20 9 20h10" />
    </svg>
  );
}

// 늘어나는 가운데 직선 조각
function Stretch() {
  return (
    <svg className="deco__stretch" viewBox="0 0 10 72" preserveAspectRatio="none" aria-hidden>
      <rect className="deco__fill" x="0" y="6" width="10" height="60" />
      <path className="deco__line" d="M0 6h10M0 12h10M0 60h10M0 66h10" />
      <path className="deco__line deco__line--soft" d="M0 16h10M0 56h10" />
    </svg>
  );
}

// 위아래 가운데 돌출 장식 (사다리꼴 + 작은 마름모)
function Center() {
  return (
    <svg className="deco__center" viewBox="0 0 44 72" aria-hidden>
      <path className="deco__fill" d="M0 6h12l4-5h12l4 5h12v60H32l-4 5H16l-4-5H0z" />
      <path className="deco__line" d="M0 6h12l4-5h12l4 5h12M0 66h12l4 5h12l4-5h12M0 12h44M0 60h44" />
      <path className="deco__line deco__line--soft" d="M0 16h44M0 56h44" />
      <path className="deco__gem" d="M22 2.2l1.8 1.8L22 5.8 20.2 4zM22 66.2l1.8 1.8-1.8 1.8-1.8-1.8z" />
    </svg>
  );
}

export default function DecoFrame() {
  return (
    <span className="deco" aria-hidden>
      <Cap />
      <Stretch />
      <Center />
      <Stretch />
      <Cap flip />
    </span>
  );
}
