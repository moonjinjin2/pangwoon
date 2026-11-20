import type { ReactNode } from 'react';

interface Props {
  // banner: 양 끝이 제비꼬리로 파인 띠 / tag: 오른쪽 끝만 파인 이름표
  variant?: 'banner' | 'tag';
  className?: string;
  children?: ReactNode;
}

// 진홍색 리본 띠 (날짜 띠·대화창 이름표)
export default function Ribbon({ variant = 'banner', className, children }: Props) {
  const classes = ['g-ribbon', `g-ribbon--${variant}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      <span className="g-ribbon__text">{children}</span>
    </span>
  );
}
