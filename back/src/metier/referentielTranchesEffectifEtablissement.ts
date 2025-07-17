export const tranchesEffectifEtablissement = [
  { code: '00', libelle: '0 salarié' },
  { code: '01', libelle: '1 ou 2 salariés' },
  { code: '02', libelle: '3 à 5 salariés' },
  { code: '03', libelle: '6 à 9 salariés' },
  { code: '11', libelle: '10 à 19 salariés' },
  { code: '12', libelle: '20 à 49 salariés' },
  { code: '21', libelle: '50 à 99 salariés' },
  { code: '22', libelle: '100 à 199 salariés' },
  { code: '31', libelle: '200 à 499 salariés' },
  { code: '41', libelle: '500 à 999 salariés' },
  { code: '42', libelle: '1000 à 1999 salariés' },
  { code: '51', libelle: '2000 à 4999 salariés' },
  { code: '52', libelle: '5000 salariés ou plus' },
  { code: '53', libelle: '10 000 salariés et plus' },
] as const;

export const codesTranchesEffectif = tranchesEffectifEtablissement.map(
  (t) => t.code
);

export type CodeTrancheEffectif = (typeof codesTranchesEffectif)[number];

export const trancheEffectifParCode = (
  code: CodeTrancheEffectif
): (typeof tranchesEffectifEtablissement)[number] =>
  tranchesEffectifEtablissement.find((tranche) => tranche.code === code)!;
