import { useEffect, useState, type CSSProperties } from 'react';
import Dialog from './ui/Dialog';
import Button from './ui/Button';
import { TEXT_SPEEDS, type TextSpeed } from '../utils/storage';

interface Props {
  volume: number;
  onChangeVolume: (volume: number) => void;
  textSpeed: TextSpeed;
  onChangeTextSpeed: (speed: TextSpeed) => void;
  // 개발자 모드 줄 (에피소드 도중처럼 넘기지 않으면 숨김)
  devMode?: boolean;
  onChangeDevMode?: (on: boolean) => void;
  // 개발자 모드: 에피소드를 골라 바로 보는 테스트 화면
  onOpenDevEpisodes?: () => void;
  // 메인 화면 가이드 다시 보기 (넘기지 않으면 버튼을 숨김)
  onOpenGuide?: () => void;
  // 넘기지 않으면 게임 종료 버튼을 숨김
  onExit?: () => void;
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
  onOpenGuide,
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
    <Dialog title="설정" icon="gear" onClose={onClose} closeOnBackdrop>
      <div className="settings">
        <label className="settings__row">
          <span className="settings__label">배경 음량</span>
          <input
            className="settings__slider"
            type="range"
            min={0}
            max={100}
            value={volume}
            style={{ '--fill': `${volume}%` } as CSSProperties}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
          />
          <span className="settings__value">{volume}</span>
        </label>
        <div className="settings__row settings__row--stack" role="radiogroup" aria-label="텍스트 속도">
          <span className="settings__label">텍스트 속도</span>
          <div className="settings__options">
            {TEXT_SPEEDS.map(({ key, label }) => (
              <Button
                key={key}
                variant="ghost"
                role="radio"
                aria-checked={key === textSpeed}
                active={key === textSpeed}
                onClick={() => onChangeTextSpeed(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        {onOpenGuide && (
          <Button variant="ghost" onClick={onOpenGuide}>
            가이드 다시 보기
          </Button>
        )}
        {onChangeDevMode && (
          <div className="settings__row settings__row--stack" role="radiogroup" aria-label="개발자 모드">
            <span className="settings__label">개발자 모드</span>
            <div className="settings__options">
              {[
                { on: false, label: '끄기' },
                { on: true, label: '켜기' },
              ].map(({ on, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  role="radio"
                  aria-checked={on === devMode}
                  active={on === devMode}
                  onClick={() => onChangeDevMode(on)}
                >
                  {label}
                </Button>
              ))}
            </div>
            {devMode && (
              <Button variant="ghost" onClick={onOpenDevEpisodes}>
                🛠 에피소드 테스트
              </Button>
            )}
          </div>
        )}
        {onExit && (
          <>
            <div className="settings__divider" aria-hidden />
            {confirmExit ? (
              <div className="settings__confirm">
                <p>타이틀로 돌아갈까요?<br />진행 상황은 저장돼요.</p>
                <div className="settings__actions">
                  <Button onClick={onExit}>종료</Button>
                  <Button variant="ghost" onClick={() => setConfirmExit(false)}>취소</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setConfirmExit(true)}>게임 종료</Button>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
