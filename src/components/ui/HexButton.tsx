import Icon, { type IconName } from '../Icon';

interface Props {
  icon: IconName;
  label: string;
  // 마우스를 올린 버튼은 붉게 빛남
  selected?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
}

// 육각형 행동 버튼 (일정 진행)
export default function HexButton({ icon, label, selected = false, onClick, onSelect }: Props) {
  return (
    <button
      type="button"
      className={selected ? 'g-hex g-hex--selected' : 'g-hex'}
      onClick={onClick}
      onMouseEnter={onSelect}
      onFocus={onSelect}
    >
      <span className="g-hex__frame" aria-hidden />
      <span className="g-hex__content">
        <Icon name={icon} />
        <span className="g-hex__label">{label}</span>
      </span>
    </button>
  );
}
