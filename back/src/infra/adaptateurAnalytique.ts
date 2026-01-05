import { DonneesEvenement } from './donneesEvenement';

export type AdaptateurAnalytique = {
  rapporteEvenement: (donneesEvenement: DonneesEvenement) => Promise<void>;
};
