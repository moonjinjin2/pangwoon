import type { ReactNode } from 'react';

interface Props {
  className?: string;
  label?: string;
  children?: ReactNode;
}

// 양 끝이 뾰족한 가로 명판 (골드 표시 등)
export default function Plate({ className, label, children }: Props) {
  return (
    <div className={className ? `g-plate ${className}` : 'g-plate'} aria-label={label}>
      {children}
    </div>
  );
}
