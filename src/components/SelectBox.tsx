import Box from './Box';

export interface SelectItem {
  label: string;
  // 오른쪽에 표시하는 단축키
  hotkey: string;
}

interface Props {
  title: string;
  items: SelectItem[];
  // 강조된 항목 (마우스를 올리거나 방향키로 고름)
  selected: number;
  onHover: (index: number) => void;
  onSelect: (index: number) => void;
  className?: string;
}

// 창 안에 항목을 세로로 나열하고 하나를 고르는 선택 창 (메인 화면 행동, 에피소드 선택지)
export default function SelectBox({ title, items, selected, onHover, onSelect, className }: Props) {
  return (
    <Box title={title} className={className ? `select ${className}` : 'select'}>
      <ul className="select__list">
        {items.map(({ label, hotkey }, i) => (
          <li key={i}>
            <button
              className={selected === i ? 'select__item select__item--selected' : 'select__item'}
              onMouseEnter={() => onHover(i)}
              onFocus={() => onHover(i)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              <span className="select__cursor" aria-hidden>
                ▶
              </span>
              <span className="select__label">{label}</span>
              <kbd className="select__key">{hotkey}</kbd>
            </button>
          </li>
        ))}
      </ul>
    </Box>
  );
}
