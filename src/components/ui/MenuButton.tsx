import Icon, { type IconName } from '../Icon';
import type { ClickSound } from '../../utils/sfx';

interface Props {
  icon: IconName;
  label: string;
  onClick?: () => void;
  // 누를 때 기본 클릭 대신 낼 소리
  sfx?: ClickSound;
}

// 아이콘 아래 이름이 붙은 네모 메뉴 버튼 (상단 메뉴)
export default function MenuButton({ icon, label, onClick, sfx }: Props) {
  return (
    <button type="button" className="g-menu-btn" data-sfx={sfx} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} />
      <span className="g-menu-btn__label">{label}</span>
    </button>
  );
}
