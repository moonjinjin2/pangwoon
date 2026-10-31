import type { CSSProperties, ReactNode } from 'react';
import { HeartMark } from './Icon';

interface Props {
  title: string;
  // 제목·강조 색 (경고 창은 붉게 등)
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  // 있으면 ✕ 버튼으로 창을 닫을 수 있음
  onClose?: () => void;
}

// 둥근 분홍 카드 모양 창 (모달·장면 공용)
export default function Box({ title, color, className, style, children, onClose }: Props) {
  return (
    <section
      className={className ? `box ${className}` : 'box'}
      style={{ ...(color && { '--box-accent': color }), ...style } as CSSProperties}
    >
      <header className="box__head">
        <HeartMark className="box__heart" />
        <h3 className="box__title">{title}</h3>
        {onClose && (
          <button type="button" className="box__close" onClick={onClose} aria-label="닫기">
            <svg viewBox="0 0 10 10" aria-hidden>
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </button>
        )}
      </header>
      <div className="box__body">{children}</div>
    </section>
  );
}
