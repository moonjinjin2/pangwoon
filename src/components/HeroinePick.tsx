import { useEffect, useState } from 'react';
import { HeartMark } from './Icon';
import { HEROINES, SPEAKERS, type Heroine } from '../utils/episode';
import { getNextDate } from '../utils/monthEvent';

interface Props {
  onPick: (heroine: Heroine) => void;
}

// 히로인 선택 데이트 달: 3명 중 데이트할 1명을 고름 (데이트를 다 본 히로인은 빠짐)
export default function HeroinePick({ onPick }: Props) {
  const options = HEROINES.flatMap((heroine) => {
    const next = getNextDate(heroine);
    return next ? [{ heroine, order: next.order }] : [];
  });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        // 포커스된 버튼이 스페이스로 눌리지 않게
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((prev) => (prev + (e.key === 'ArrowUp' ? options.length - 1 : 1)) % options.length);
      } else if (e.key === 'Enter') {
        // 스페이스는 진행하기·대사 넘기기용이라 연타하다 골라지지 않게 Enter로만 선택
        e.preventDefault();
        onPick(options[selected].heroine);
      } else {
        // 숫자 키로 선택
        const option = options[Number(e.key) - 1];
        if (option) onPick(option.heroine);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="modal">
      <section className="hud-card modal__dialog pick" role="dialog" aria-modal aria-label="데이트 상대 선택">
        <header className="hud-card__head">
          <HeartMark />
          <h3 className="hud-card__title">누구와 데이트할까?</h3>
        </header>
        <ul className="action__list">
          {options.map(({ heroine, order }, i) => (
            <li key={heroine}>
              <button
                className={selected === i ? 'action__item action__item--selected' : 'action__item'}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => onPick(heroine)}
              >
                <HeartMark className="action__cursor" />
                <span className="action__label">
                  {SPEAKERS[heroine].name} · 데이트 {order}
                </span>
                <kbd className="action__key">{i + 1}</kbd>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
