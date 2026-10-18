import { useEffect, useState } from 'react';
import Box from './Box';
import { TEXT_SPEEDS, type TextSpeed } from '../utils/storage';

interface Props {
  volume: number;
  onChangeVolume: (volume: number) => void;
  textSpeed: TextSpeed;
  onChangeTextSpeed: (speed: TextSpeed) => void;
  onExit: () => void;
  onClose: () => void;
}

export default function SettingsModal({ volume, onChangeVolume, textSpeed, onChangeTextSpeed, onExit, onClose }: Props) {
  // 게임 종료 시 진행 상황이 지워지므로 한 번 더 확인
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" role="dialog" aria-modal aria-label="설정" onClick={(e) => e.stopPropagation()}>
        <Box title="설정" onClose={onClose}>
          <div className="settings">
            <label className="settings__row">
              <span className="settings__label">배경 음량</span>
              <input
                className="settings__slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
              />
              <span className="settings__value">{volume}</span>
            </label>
            <div className="settings__row settings__row--stack" role="radiogroup" aria-label="텍스트 속도">
              <span className="settings__label">텍스트 속도</span>
              <div className="settings__options">
                {TEXT_SPEEDS.map(({ key, label }) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={key === textSpeed}
                    className={key === textSpeed ? 'settings__option settings__option--active' : 'settings__option'}
                    onClick={() => onChangeTextSpeed(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {confirmExit ? (
              <div className="settings__confirm">
                <p>진행 상황이 모두 사라져요.<br />종료할까요?</p>
                <div className="settings__actions">
                  <button className="settings__btn settings__btn--danger" onClick={onExit}>종료</button>
                  <button className="settings__btn" onClick={() => setConfirmExit(false)}>취소</button>
                </div>
              </div>
            ) : (
              <button className="settings__btn settings__btn--danger" onClick={() => setConfirmExit(true)}>
                게임 종료
              </button>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
