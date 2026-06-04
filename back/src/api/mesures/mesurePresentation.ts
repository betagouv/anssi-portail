import { Mesure } from '../../metier/mesure';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence';

export const mesurePresentation = async (mesure: Mesure, entrepotExigence: EntrepotExigence) => {
  const exigences = await mesure.exigences(entrepotExigence);
  return {
    ...mesure,
    exigences,
  };
};
