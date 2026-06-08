import { Mesure } from '../../metier/mesure';

export const mesurePresentation = async (mesure: Mesure) => {
  return {
    ...mesure,
  };
};
