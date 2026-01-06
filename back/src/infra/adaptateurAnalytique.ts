import { URLSearchParams } from 'node:url';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttpPosteur } from './clientHttp';
import {
  DonneesEvenement,
  DonneesEvenementGuideTelecharge,
} from './donneesEvenement';

export type AdaptateurAnalytique = {
  rapporteEvenement: (
    donneesEvenement: DonneesEvenementGuideTelecharge
  ) => Promise<void>;
};

export const fabriqueAdaptateurMatamo = (
  clientHttpPosteur: ClientHttpPosteur<DonneesEvenement, unknown>,
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurAnalytique => ({
  rapporteEvenement: async (
    donneesEvenement: DonneesEvenementGuideTelecharge
  ) => {
    const parametres = new URLSearchParams();
    parametres.append('rec', '1');
    parametres.append('action_name', 'Guide Téléchargé');
    parametres.append('idsite', adaptateurEnvironnement.matomo().idSite());
    parametres.append('c_t', donneesEvenement.donnees.id);

    await clientHttpPosteur.post(
      'https://stats.beta.gouv.fr/matomo.php?' + parametres.toString(),
      donneesEvenement
    );
  },
});
