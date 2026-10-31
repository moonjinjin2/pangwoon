import { useEffect, useState } from 'react';

interface Props {
  illust: string;
  title: string;
  // 'reveal': 데이트를 끝내고 처음 공개 (빛 번쩍 + 획득 문구), 'view': 컬렉션에서 다시 보기
  mode: 'reveal' | 'view';
  // 일러스트 아래 작은 글씨 (예: '에밀리 · 데이트 1')
  caption?: string;
  // 있으면 '다시 보기' 버튼을 보여주고 누르면 에피소드를 다시 재생
  onReplay?: () => void;
  onClose: () => void;
}

// 공개 연출이 끝나기 전에 데이트 마지막 클릭·키 입력이 이어져 바로 닫히지 않게 잠깐 입력을 막음
const REVEAL_LOCK_MS = 1200;

// 반짝이 위치 (일러스트 틀 기준 %)
const SPARKLES = [
  { left: 4, top: 10, delay: 0.9 },
  { left: 92, top: 6, delay: 1.1 },
  { left: 97, top: 62, delay: 1.3 },
  { left: 2, top: 78, delay: 1.5 },
  { left: 50, top: -4, delay: 1.2 },
  { left: 70, top: 98, delay: 1.4 },
];

// 데이트 일러스트를 화면 가득 보여줌. 클릭·Enter·ESC로 닫기
export default function IllustView({ illust, title, mode, caption, onReplay, onClose }: Props) {
  const reveal = mode === 'reveal';
  const [ready, setReady] = useState(!reveal);

  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setReady(true), REVEAL_LOCK_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    // 뒤에 깔린 책(ESC로 닫힘)이나 포커스된 버튼(Enter로 눌림)까지 키가 가지 않게 먼저 받아서 막음
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      if (ready) onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [ready, onClose]);

  return (
    <div
      className={reveal ? 'illust illust--reveal' : 'illust'}
      role="dialog"
      aria-modal
      aria-label={`${title} 일러스트`}
      onClick={(e) => {
        e.stopPropagation();
        if (ready) onClose();
      }}
    >
      {reveal && <div className="illust__flash" aria-hidden />}
      {reveal && <p className="illust__banner">✨ ILLUST GET! ✨</p>}
      <figure className="illust__frame">
        <img className="illust__img" src={illust} alt={title} />
        {reveal &&
          SPARKLES.map((s, i) => (
            <span key={i} className="illust__sparkle" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }} aria-hidden>
              ✦
            </span>
          ))}
        <figcaption className="illust__caption">
          {caption && <span className="illust__sub">{caption}</span>}
          <strong className="illust__title">{title}</strong>
        </figcaption>
      </figure>
      {onReplay && ready && (
        <button
          className="illust__replay"
          onClick={(e) => {
            e.stopPropagation();
            onReplay();
          }}
        >
          ▶ 다시 보기
        </button>
      )}
      <p className="illust__hint">{reveal ? '컬렉션에서 다시 볼 수 있어요 · 클릭해서 닫기' : '클릭해서 닫기'}</p>
    </div>
  );
}
