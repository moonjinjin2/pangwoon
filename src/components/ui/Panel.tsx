import type { ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';

interface Props {
  title?: ReactNode;
  // 제목 앞 아이콘
  icon?: IconName;
  // 제목 줄 오른쪽 (편집 버튼 등)
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

// 네 모서리 장식이 달린 고딕풍 상자 (메인 화면 공용)
export default function Panel({ title, icon, extra, className, children }: Props) {
  return (
    <section className={className ? `g-panel ${className}` : 'g-panel'}>
      {/* 모서리 장식은 SVG 에셋 (src/img/ui/corner.svg) */}
      {CORNERS.map((corner) => (
        <span key={corner} className={`g-panel__corner g-panel__corner--${corner}`} aria-hidden />
      ))}
      {title && (
        <header className="g-panel__head">
          {icon && <Icon name={icon} className="g-panel__icon" />}
          <h3 className="g-panel__title">{title}</h3>
          {extra}
        </header>
      )}
      <div className="g-panel__body">{children}</div>
    </section>
  );
}
