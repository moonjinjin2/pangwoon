import Box from './Box';
import { HEROINES, SPEAKERS, type Affection, type Heroine } from '../utils/episode';

export const MAX_AFFECTION = 100;

// 히로인 한 명의 호감도를 공개하는 가격 (한 번 공개하면 계속 보임)
export const REVEAL_PRICE = 30000;

interface Props {
  affection: Affection;
  revealed: Record<Heroine, boolean>;
  coins: number;
  onReveal: (heroine: Heroine) => void;
}

export default function AffectionBox({ affection, revealed, coins, onReveal }: Props) {
  const affordable = coins >= REVEAL_PRICE;

  return (
    <Box title="Heroine">
      <ul className="affection">
        {HEROINES.map((key) => {
          const { name, image } = SPEAKERS[key];
          return (
            <li key={key} className="affection__item">
              <span className="affection__avatar" style={{ backgroundImage: `url(${image})` }} aria-hidden />
              <span className="affection__name">{name}</span>
              {revealed[key] ? (
                <span className="affection__value">♥ {affection[key]}</span>
              ) : (
                <button
                  className="affection__reveal"
                  disabled={!affordable}
                  title={affordable ? `${REVEAL_PRICE.toLocaleString()} 골드로 호감도 확인` : '골드가 부족해요'}
                  onClick={() => onReveal(key)}
                >
                  <span>♥ ???</span>
                  <span className="affection__price">🔒 {REVEAL_PRICE.toLocaleString()}G</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Box>
  );
}
