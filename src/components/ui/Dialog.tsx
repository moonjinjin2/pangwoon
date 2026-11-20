import type { ReactNode } from 'react';
import type { IconName } from '../Icon';
import Panel from './Panel';

interface Props {
  title: ReactNode;
  icon?: IconName;
  // 있으면 ✕ 버튼으로 닫을 수 있음
  onClose?: () => void;
  // 바깥 어두운 곳을 눌러도 닫힘 (결과창처럼 확인을 꼭 눌러야 하는 창은 끔)
  closeOnBackdrop?: boolean;
  className?: string;
  children?: ReactNode;
}

// 화면을 어둡게 덮고 가운데 띄우는 고딕풍 창
export default function Dialog({ title, icon, onClose, closeOnBackdrop = false, className, children }: Props) {
  return (
    <div
      className="modal g-modal"
      onClick={(e) => {
        // 에피소드 화면처럼 클릭으로 대사를 넘기는 부모에 클릭이 닿지 않게
        e.stopPropagation();
        if (closeOnBackdrop) onClose?.();
      }}
    >
      <div className={className ? `g-dialog ${className}` : 'g-dialog'} role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <Panel
          title={title}
          icon={icon}
          extra={
            onClose && (
              <button type="button" className="g-dialog__close" onClick={onClose} aria-label="닫기">
                <svg viewBox="0 0 10 10" aria-hidden>
                  <path d="M2 2l6 6M8 2l-6 6" />
                </svg>
              </button>
            )
          }
        >
          {children}
        </Panel>
      </div>
    </div>
  );
}
