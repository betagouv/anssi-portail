const miniTest = ['test-maturité', 'vrai-faux', 'exposition'] as const;
export type MiniTest = (typeof miniTest)[number];

export const estMiniTest = (valeur: unknown): valeur is MiniTest => {
  return typeof valeur === 'string' && miniTest.includes(valeur as MiniTest);
};
