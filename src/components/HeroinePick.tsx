import { useEffect, useState } from 'react';
import { HeartMark } from './Icon';
import { HEROINES, SPEAKERS, type Heroine } from '../utils/episode';
import { getNextDate } from '../utils/monthEvent';

interface Props {
  onPick: (heroine: Heroine) => void;
}

// 히로인 선택 데이트 달: 3명을 얼굴과 함께 한 줄로 보여주고 데이트할 1명을 고름
// 데이트를 다 본 히로인은 자리는 남기고 고를 수 없게 함
export default function HeroinePick({ onPick }: Props) {
  const options = HEROINES.map((heroine) => ({ heroine, next: getNextDate(heroine) }));
  const firstOpen = Math.max(0, options.findIndex((o) => o.next));
  const [selected, setSelected] = useState(firstOpen);

  const pick = (i: number) => {
    if (options[i]?.next) onPick(options[i].heroine);
  };

  useEffect(() => {
    // 고를 수 있는 히로인만 오가도록 방향대로 다음 칸을 찾음
    const move = (step: number) =>
      setSelected((prev) => {
        for (let k = 1; k <= options.length; k++) {
          const i = (prev + step * k + options.length * k) % options.length;
          if (options[i].next) return i;
        }
        return prev;
      });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        // 포커스된 버튼이 스페이스로 눌리지 않게
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'Enter') {
        // 스페이스는 진행하기·대사 넘기기용이라 연타하다 골라지지 않게 Enter로만 선택
        e.preventDefault();
        pick(selected);
      } else {
        // 숫자 키로 선택
        pick(Number(e.key) - 1);
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
        <ul className="pick__list">
          {options.map(({ heroine, next }, i) => (
            <li key={heroine}>
              <button
                className={`pick__card${selected === i && next ? ' pick__card--selected' : ''}`}
                disabled={!next}
                onMouseEnter={() => next && setSelected(i)}
                onFocus={() => next && setSelected(i)}
                onClick={() => pick(i)}
              >
                <kbd className="pick__key">{i + 1}</kbd>
                <span className={`pick__face face face--${heroine}`} style={{ backgroundImage: `url(${SPEAKERS[heroine].image})` }} aria-hidden />
                <span className="pick__name">{SPEAKERS[heroine].name}</span>
                <span className="pick__info">{next ? `데이트 ${next.order} · ${next.episode.title}` : '데이트 완료'}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
