import { useEffect, useState } from 'react';
import SelectBox from './SelectBox';

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

  return <SelectBox title="Action" items={items} selected={selected} onHover={setSelected} onSelect={run} />;
}
