export const generateScamScore = ({
  aiScore,
  domainRisk,
  isScammerMatch,
}) => {
  let score = 0;

  score += aiScore * 0.5;

  if (domainRisk) score += 20;
  if (isScammerMatch) score += 30;

  return Math.min(100, score);
};