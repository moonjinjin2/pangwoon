import { useEffect, useState } from 'react';
import Box from './Box';
import { TEXT_SPEEDS, type TextSpeed } from '../utils/storage';

interface Props {
  volume: number;
  onChangeVolume: (volume: number) => void;
  textSpeed: TextSpeed;
  onChangeTextSpeed: (speed: TextSpeed) => void;
  devMode: boolean;
  onChangeDevMode: (on: boolean) => void;
  // 개발자 모드: 에피소드를 골라 바로 보는 테스트 화면
  onOpenDevEpisodes: () => void;
  onExit: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  volume,
  onChangeVolume,
  textSpeed,
  onChangeTextSpeed,
  devMode,
  onChangeDevMode,
  onOpenDevEpisodes,
  onExit,
  onClose,
}: Props) {
  // 게임 종료 전 한 번 더 확인 (진행 상황은 저장돼 있어 이어하기로 돌아올 수 있음)
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
            <div className="settings__row settings__row--stack" role="radiogroup" aria-label="개발자 모드">
              <span className="settings__label">개발자 모드</span>
              <div className="settings__options">
                {[
                  { on: false, label: '끄기' },
                  { on: true, label: '켜기' },
                ].map(({ on, label }) => (
                  <button
                    key={label}
                    role="radio"
                    aria-checked={on === devMode}
                    className={on === devMode ? 'settings__option settings__option--active' : 'settings__option'}
                    onClick={() => onChangeDevMode(on)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {devMode && (
                <button className="settings__btn" onClick={onOpenDevEpisodes}>
                  🛠 에피소드 테스트
                </button>
              )}
            </div>
            {confirmExit ? (
              <div className="settings__confirm">
                <p>타이틀로 돌아갈까요?<br />진행 상황은 저장돼요.</p>
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
