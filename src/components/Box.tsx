import type { CSSProperties, ReactNode } from 'react';

interface Props {
  title: string;
  color?: string;
  bodyColor?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  // 있으면 -, ㅁ, x 버튼을 눌러 창을 닫을 수 있음 (없으면 장식용으로 고정)
  onClose?: () => void;
}

const controls = [
  { label: '최소화', icon: <path d="M2 8h6" /> },
  { label: '최대화', icon: <rect x="2" y="2" width="6" height="6" /> },
  { label: '닫기', icon: <path d="M2 2l6 6M8 2l-6 6" /> },
];

export default function Box({ title, color = '#f6bedc', bodyColor = '#552f52', className, style, children, onClose }: Props) {
  return (
    <section
      className={className ? `box ${className}` : 'box'}
      style={{ '--box-color': color, ...style } as CSSProperties}
    >
      <header className="box__titlebar">
        <svg className="box__icon" viewBox="0 0 7 6" aria-hidden>
          <path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" />
        </svg>
        <h3 className="box__title">{title}</h3>
        <div className="box__controls" aria-hidden={!onClose}>
          {controls.map(({ label, icon }) =>
            onClose ? (
              <button key={label} type="button" className="box__control box__control--button" onClick={onClose} aria-label={label}>
                <svg viewBox="0 0 10 10">{icon}</svg>
              </button>
            ) : (
              <span key={label} className="box__control">
                <svg viewBox="0 0 10 10">{icon}</svg>
              </span>
            ),
          )}
        </div>
      </header>
      <div className="box__body" style={{ background: bodyColor }}>{children}</div>
    </section>
  );
}
