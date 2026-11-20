import { useEffect, useState } from 'react';
import backgroundImg from '../img/background/intro.png';
import Backdrop from '../components/Backdrop';
import ChoiceButton from '../components/ui/ChoiceButton';
import petalVideo from '../img/fall_pental.mp4';

const PETAL_VIDEO_START = 5; // 벚꽃 영상 시작 지점(초)

interface Props {
  onNewGame: () => void;
  // 저장된 진행 상황이 없으면 이어하기를 막음
  onContinue?: () => void;
}

export default function StartPage({ onNewGame, onContinue }: Props) {
  // 저장된 게임이 있는데 새로 시작하려 하면 진행 상황이 지워진다고 한 번 더 확인
  const [confirming, setConfirming] = useState(false);
  // 이어할 게임이 있으면 이어하기를 먼저 강조
  const [selected, setSelected] = useState(onContinue ? 1 : 0);

  const openConfirm = () => {
    setConfirming(true);
    setSelected(1);
  };
  const closeConfirm = () => {
    setConfirming(false);
    setSelected(0);
  };

  const items = confirming
    ? [
      { label: '새로 입학', onSelect: onNewGame },
      { label: '취소', onSelect: closeConfirm },
    ]
    : [
      { label: '새로 입학하기', onSelect: onContinue ? openConfirm : onNewGame },
      { label: '이어하기', onSelect: onContinue },
    ];
  const enabled = items.map(({ onSelect }) => !!onSelect);

  // 방향키로 고르고 Enter로 실행 (막힌 항목은 건너뜀)
  useEffect(() => {
    const move = (step: number) => {
      setSelected((prev) => {
        let next = prev;
        do next = (next + step + items.length) % items.length;
        while (!enabled[next]);
        return next;
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        items[selected].onSelect?.();
      } else if (e.key === 'Escape' && confirming) {
        e.preventDefault();
        closeConfirm();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="start">
      <Backdrop src={backgroundImg} />
      {/* 앞부분은 꽃잎이 덜 차 있어서 시작 지점부터 재생하고, 반복할 때도 그 지점으로 돌아감 */}
      <video
        className="start__petal-video"
        src={`${petalVideo}#t=${PETAL_VIDEO_START}`}
        autoPlay
        muted
        playsInline
        aria-hidden
        onEnded={(e) => {
          e.currentTarget.currentTime = PETAL_VIDEO_START;
          e.currentTarget.play();
        }}
      />
      <div className="start__panel">
        <p className="start__kicker">뱀파이어 대학교에 인간이 입학했다</p>
        <h1 className="start__title">
          <span>
            야(<em className="start__title-accent">夜</em>)행성
          </span>
          <span>특별전형</span>
        </h1>
        {confirming && (
          <p className="start__confirm">
            저장된 진행 상황이 사라져요.
            <br />
            새로 입학할까요?
          </p>
        )}
        <ul className={confirming ? 'g-choices start__menu start__menu--confirm' : 'g-choices start__menu'}>
          {items.map(({ label, onSelect }, i) => (
            <li key={label}>
              <ChoiceButton
                selected={selected === i}
                disabled={!onSelect}
                onSelect={() => setSelected(i)}
                onClick={onSelect}
              >
                {label}
              </ChoiceButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
