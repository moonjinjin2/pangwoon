import Icon, { type IconName } from '../Icon';
import type { ClickSound } from '../../utils/sfx';

interface Props {
  icon: IconName;
  label: string;
  // 마우스를 올린 버튼은 붉게 빛남
  selected?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
  // 누를 때 기본 클릭 대신 낼 소리
  sfx?: ClickSound;
}

// 육각형 행동 버튼 (일정 진행)
export default function HexButton({ icon, label, selected = false, onClick, onSelect, sfx }: Props) {
  return (
    <button
      type="button"
      data-sfx={sfx}
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
