import { Mesure } from '../../metier/mesure';
import { PriseEnCompte } from '../../metier/PriseEnCompte';

export const mesurePresentation = async (mesure: Mesure, priseEnCompte: PriseEnCompte | undefined) => {
  return {
    ...mesure,
    estPriseEnCompte: !!priseEnCompte,
  };
};
