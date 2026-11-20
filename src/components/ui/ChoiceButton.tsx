import type { ReactNode } from 'react';

interface Props {
  // 숫자 키 안내 (1, 2, 3 …). 없으면 번호를 표시하지 않음
  number?: number;
  selected?: boolean;
  // 고를 수 없는 줄 (흐리게 표시)
  disabled?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
  children?: ReactNode;
}

// 선택지 한 줄. 키보드·마우스로 고른 줄은 진홍색으로 빛남
export default function ChoiceButton({ number, selected = false, disabled = false, onClick, onSelect, children }: Props) {
  return (
    <button
      type="button"
      className={selected ? 'g-choice g-choice--selected' : 'g-choice'}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onSelect}
      onFocus={onSelect}
    >
      <span className="g-choice__gem" aria-hidden />
      <span className="g-choice__label">{children}</span>
      {number !== undefined && <kbd className="g-choice__key">{number}</kbd>}
    </button>
  );
}
