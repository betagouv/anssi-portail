import { Mesure } from '../../metier/mesure';

export const mesurePresentation = async (mesure: Mesure, estPriseEnCompte: boolean) => {
  const { module: _module, ...reste } = mesure;
  return {
    ...reste,
    estPriseEnCompte,
  };
};
