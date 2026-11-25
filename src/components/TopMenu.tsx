import type { IconName } from './Icon';
import MenuButton from './ui/MenuButton';
import Plate from './ui/Plate';
import type { ClickSound } from '../utils/sfx';

interface Props {
  coins: number;
  onShop?: () => void;
  onCollection?: () => void;
  onSettings?: () => void;
}

export default function TopMenu({ coins, onShop, onCollection, onSettings }: Props) {
  const buttons: { label: string; icon: IconName; onClick?: () => void; sfx?: ClickSound }[] = [
    { label: '상점', icon: 'shop', onClick: onShop },
    { label: '앨범', icon: 'book', onClick: onCollection, sfx: 'page' },
    { label: '설정', icon: 'gear', onClick: onSettings },
  ];

  return (
    <nav className="topmenu">
      <Plate className="topmenu__coins" label={`골드 ${coins.toLocaleString('en-US')}`}>
        <span className="topmenu__coin" aria-hidden>G</span>
        <span className="topmenu__amount">{coins.toLocaleString('en-US')}</span>
      </Plate>
      {buttons.map(({ label, icon, onClick, sfx }) => (
        <MenuButton key={label} icon={icon} label={label} onClick={onClick} sfx={sfx} />
      ))}
    </nav>
  );
}
