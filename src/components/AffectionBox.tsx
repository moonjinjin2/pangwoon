import Icon from './Icon';
import Button from './ui/Button';
import Panel from './ui/Panel';
import ProgressBar from './ui/ProgressBar';
import { HEROINES, SPEAKERS, type Affection, type Heroine } from '../utils/episode';

export const MAX_AFFECTION = 100;

// 히로인 한 명의 호감도를 공개하는 가격 (한 번 공개하면 계속 보임)
export const REVEAL_PRICE = 500000;

const AFFECTION_COLOR = '#ee6a82';

interface Props {
  affection: Affection;
  revealed: Record<Heroine, boolean>;
  coins: number;
  onReveal: (heroine: Heroine) => void;
}

// 메인 화면 오른쪽 상태 정보 아래에 늘 떠 있는 호감도 상자
export default function AffectionBox({ affection, revealed, coins, onReveal }: Props) {
  const affordable = coins >= REVEAL_PRICE;

  return (
    <Panel title="호감도" icon="heart">
      <ul className="g-affection">
        {HEROINES.map((key) => {
          const { name, image } = SPEAKERS[key];
          return (
            <li key={key} className={revealed[key] ? 'g-affection__item' : 'g-affection__item g-affection__item--hidden'}>
              <span className={`g-affection__face face face--${key}`} style={{ backgroundImage: `url(${image})` }} aria-hidden />
              <span className="g-affection__name">{name}</span>
              {revealed[key] ? (
                <>
                  <span className="g-affection__value">
                    {affection[key]} / {MAX_AFFECTION}
                  </span>
                  <ProgressBar className="g-affection__bar" value={affection[key]} max={MAX_AFFECTION} color={AFFECTION_COLOR} />
                </>
              ) : (
                // 호감도는 비공개, 골드를 내야 볼 수 있음
                <Button
                  variant="ghost"
                  className="g-affection__reveal"
                  disabled={!affordable}
                  title={affordable ? `${REVEAL_PRICE.toLocaleString()} 골드로 호감도 확인` : '골드가 부족해요'}
                  onClick={() => onReveal(key)}
                >
                  <Icon name="lock" />
                  {REVEAL_PRICE.toLocaleString()}G
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
