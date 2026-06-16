import { Mesure } from '../../metier/mesure';

export const mesurePresentation = async (mesure: Mesure, estPriseEnCompte: boolean) => {
  return {
    ...mesure,
    estPriseEnCompte,
  };
};
