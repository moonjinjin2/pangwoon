import { useEffect, useState } from 'react';
import { HeartMark } from './Icon';

interface Props {
  // 다른 창이 떠 있을 때는 단축키를 받지 않음
  keysEnabled: boolean;
  onProceed: () => void;
  onDate: () => void;
}

const items = [
  { label: '진행하기', hotkey: 'SPACE' },
  { label: '데이트', hotkey: 'D' },
];

export default function ActionBox({ keysEnabled, onProceed, onDate }: Props) {
  // 0: 진행하기, 1: 데이트 (Enter로 실행)
  const [selected, setSelected] = useState(0);

  const run = (index: number) => (index === 0 ? onProceed() : onDate());

  useEffect(() => {
    if (!keysEnabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === ' ') {
        e.preventDefault();
        onProceed();
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ㅇ') {
        onDate();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((prev) => 1 - prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        run(selected);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <section className="hud-card action">
      <header className="hud-card__head">
        <HeartMark />
        <h3 className="hud-card__title hud-card__title--en">Action</h3>
      </header>
      <ul className="action__list">
        {items.map(({ label, hotkey }, i) => (
          <li key={i}>
            <button
              className={selected === i ? 'action__item action__item--selected' : 'action__item'}
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onClick={() => run(i)}
            >
              <HeartMark className="action__cursor" />
              <span className="action__label">{label}</span>
              <kbd className="action__key">{hotkey}</kbd>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
