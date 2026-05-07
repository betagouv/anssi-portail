import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement';

export const valideSiret = (adaptateurEnvironnement: AdaptateurEnvironnement, numero: string) => {
  // by-pass de la validation Luhn (SIRET) de l'instance de test de ProConnect
  if (adaptateurEnvironnement.siret().desactiveValidationStricte()) {
    return true;
  }
  let somme = 0;
  let double = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let chiffre = parseInt(numero[i], 10);
    if (double) {
      chiffre *= 2;
      if (chiffre > 9) chiffre -= 9;
    }
    somme += chiffre;
    double = !double;
  }
  return somme % 10 === 0;
};
