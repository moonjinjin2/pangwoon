import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  // primary: 진홍 버튼 / ghost: 금테만 있는 어두운 버튼 (자동·로그 같은 작은 버튼)
  variant?: 'primary' | 'ghost';
  // ghost 버튼이 켜진 상태 (자동 진행 중 등)
  active?: boolean;
}

// 고딕풍 공용 버튼
export default function Button({ variant = 'primary', active = false, className, type = 'button', ...rest }: Props) {
  const classes = ['g-btn', `g-btn--${variant}`, active && 'g-btn--active', className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...rest} />;
}
