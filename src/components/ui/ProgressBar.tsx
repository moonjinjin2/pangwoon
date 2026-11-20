import type { CSSProperties } from 'react';

interface Props {
  value: number;
  max: number;
  color?: string;
  className?: string;
}

// 가는 수치 막대 (스탯 등)
export default function ProgressBar({ value, max, color, className }: Props) {
  return (
    <div
      className={className ? `g-bar ${className}` : 'g-bar'}
      style={color ? ({ '--bar-color': color } as CSSProperties) : undefined}
    >
      <div className="g-bar__fill" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}
