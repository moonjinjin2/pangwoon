import Icon, { type IconName } from './Icon';

interface Props {
  coins: number;
  onWardrobe?: () => void;
  onShop?: () => void;
  onCollection?: () => void;
  onAffection?: () => void;
  onSettings?: () => void;
}

export default function TopMenu({ coins, onWardrobe, onShop, onCollection, onAffection, onSettings }: Props) {
  const buttons: { label: string; icon: IconName; onClick?: () => void }[] = [
    { label: '옷장', icon: 'shirt', onClick: onWardrobe },
    { label: '상점', icon: 'shop', onClick: onShop },
    { label: '앨범', icon: 'book', onClick: onCollection },
    { label: '호감도', icon: 'heart', onClick: onAffection },
    { label: '설정', icon: 'gear', onClick: onSettings },
  ];

  return (
    <nav className="topmenu">
      <div className="topmenu__coins" aria-label={`골드 ${coins.toLocaleString('en-US')}`}>
        <span className="topmenu__coin" aria-hidden>G</span>
        <span className="topmenu__amount">{coins.toLocaleString('en-US')}</span>
      </div>
      {buttons.map(({ label, icon, onClick }) => (
        <button key={label} className="topmenu__btn" onClick={onClick} aria-label={label} title={label}>
          <Icon name={icon} />
        </button>
      ))}
    </nav>
  );
}
