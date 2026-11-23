// 기획서 4·5: 스탯이 스토리에 주는 효과와 에피소드 위험도
// 위장도 1당 위험 상승량 0.8% 감소 · 매력 1당 스토리 호감도 1% 증가 · 정신력 1당 흥분 위험 회피 확률 0.7% 증가

// 에피소드 위험도가 여기에 닿으면 즉시 정체가 들킴 (에피소드마다 0부터 다시 쌓임)
export const RISK_LIMIT = 100;

// excite: 흥분·당황 (정신력으로 피할 수 있음) · bleed: 출혈처럼 실제로 피가 나는 위험 (위장도 감소만 적용)
// suspect: 대답 때문에 의심을 사는 위험 (정신력 회피 없이 위장도 감소만 적용)
// calm: 진정하거나 상처를 가려 위험도가 내려감 (amount는 음수, 보정 없이 그대로 적용)
export type RiskKind = 'excite' | 'bleed' | 'suspect' | 'calm';

export interface Risk {
  // 기본 위험 상승량 (위장도 0 기준)
  amount: number;
  kind: RiskKind;
}

const DISGUISE_RISK_CUT = 0.008;
const CHARM_AFFECTION_BONUS = 0.01;
const MENTAL_AVOID_RATE = 0.007;

// step 단위로 반올림 (중간값은 큰 쪽으로, 소수 오차는 무시)
const roundTo = (value: number, step: number) => Math.round(value / step + 1e-9) * step;

// 위장도를 반영한 위험 상승량, 가까운 10 단위로 반올림 (5 미만이면 0)
// 예: 기본 +40 → 위장도 50이면 24 → +20, 100이면 8 → +10
export function getRiskAmount(base: number, disguise: number) {
  return roundTo(base * (1 - DISGUISE_RISK_CUT * disguise), 10);
}

// 정신력으로 흥분 위험을 피할 확률 (정신력 50이면 35%, 100이면 70%)
export function getAvoidChance(kind: RiskKind, mental: number) {
  return kind === 'excite' ? MENTAL_AVOID_RATE * mental : 0;
}

// 이번 위험의 결과: 피했으면 0, 아니면 위장도를 반영한 상승량 (내려가는 건 그대로)
export function rollRisk({ amount, kind }: Risk, disguise: number, mental: number) {
  if (amount < 0) return { avoided: false, amount };
  const avoided = Math.random() < getAvoidChance(kind, mental);
  return { avoided, amount: avoided ? 0 : getRiskAmount(amount, disguise) };
}

// 매력을 반영한 스토리 호감도, 가까운 5 단위로 반올림 (오르는 쪽에만 적용, 내려가는 건 그대로)
// 예: +10 → 매력 50이면 +15, 100이면 +20
export function boostAffection(value: number, charm: number) {
  return value > 0 ? roundTo(value * (1 + CHARM_AFFECTION_BONUS * charm), 5) : value;
}
