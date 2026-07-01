import { Mesure } from '../../metier/mesure.js';

export const mesurePresentation = async (mesure: Mesure, estPriseEnCompte: boolean) => {
  return {
    ...mesure,
    estPriseEnCompte,
  };
};
