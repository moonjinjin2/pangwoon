import { useState, type ReactNode } from 'react';
import type { IconName } from './Icon';
import HexButton from './ui/HexButton';

interface Props {
  onProceed: () => void;
  // 본 데이트 다시 보기 (데이트 앨범)
  onDate: () => void;
  // 일정 진행 버튼 위에 띄우는 말풍선 (이벤트·에피소드 날 안내)
  notice?: ReactNode;
}

const items: { label: string; icon: IconName }[] = [
  { label: '일정 진행', icon: 'calendar' },
  { label: '데이트', icon: 'heart' },
];

// 일정 진행·데이트 버튼 (클릭으로만 실행, 단축키 없음)
export default function ActionBox({ onProceed, onDate, notice }: Props) {
  // 0: 일정 진행, 1: 데이트 (마우스를 올린 버튼이 빛남)
  const [selected, setSelected] = useState(0);

  const run = (index: number) => (index === 0 ? onProceed() : onDate());

  return (
    <div className="g-actions">
      {items.map(({ label, icon }, i) => (
        <div key={i} className="g-actions__item">
          {i === 0 && notice && <span className="main__bubble">{notice}</span>}
          <HexButton
            icon={icon}
            label={label}
            selected={selected === i}
            onSelect={() => setSelected(i)}
            onClick={() => run(i)}
          />
        </div>
      ))}
    </div>
  );
}
