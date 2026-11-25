import { useEffect } from 'react';
import introVideo from '../img/intro.mp4';
import { SETTINGS_KEYS, useStoredState } from '../utils/storage';

interface Props {
  onDone: () => void;
}

// 처음 입학할 때 보는 오프닝 영상 (텍스트 프롤로그 대신). 끝나거나 건너뛰면 onDone
export default function IntroVideo({ onDone }: Props) {
  const [volume] = useStoredState(SETTINGS_KEYS.bgmVolume, 50);

  // Esc로 건너뜀
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onDone]);

  return (
    <div className="intro-video">
      <video
        className="intro-video__player"
        src={introVideo}
        autoPlay
        playsInline
        ref={(el) => {
          if (el) el.volume = Math.min(1, Math.max(0, volume / 100));
        }}
        onEnded={onDone}
        // 못 불러오면 멈춰 있지 않고 바로 넘어감
        onError={onDone}
      />
      <button type="button" className="intro-video__skip" onClick={onDone}>
        건너뛰기 ▸
      </button>
    </div>
  );
}
