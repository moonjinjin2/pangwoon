import { HeartMark } from './Icon';

interface Props {
  // 0~1
  progress: number;
  // 다 불러와서 서서히 사라지는 중
  leaving?: boolean;
}

// 이미지를 다 불러오기 전까지 깨진 그림 대신 보여주는 화면
export default function LoadingScreen({ progress, leaving = false }: Props) {
  const percent = Math.round(progress * 100);
  return (
    <div className={leaving ? 'loading loading--leaving' : 'loading'} role="progressbar" aria-label="불러오는 중" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <HeartMark className="loading__heart" />
      <p className="loading__text">LOADING…</p>
      <div className="loading__bar">
        <div className="loading__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="loading__percent">{percent}%</span>
    </div>
  );
}
