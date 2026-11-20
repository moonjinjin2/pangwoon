import Icon, { type IconName } from '../Icon';

interface Props {
  icon: IconName;
  label: string;
  onClick?: () => void;
}

// 아이콘 아래 이름이 붙은 네모 메뉴 버튼 (상단 메뉴)
export default function MenuButton({ icon, label, onClick }: Props) {
  return (
    <button type="button" className="g-menu-btn" onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} />
      <span className="g-menu-btn__label">{label}</span>
    </button>
  );
}
