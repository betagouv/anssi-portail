import { URLSearchParams } from 'node:url';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttpPosteur } from './clientHttp';
import {
  DonneesEvenement,
  DonneesEvenementDocumentGuideTelecharge,
} from './donneesEvenement';

export type AdaptateurAnalytique = {
  rapporteEvenement: (
    donneesEvenement: DonneesEvenementDocumentGuideTelecharge
  ) => Promise<void>;
};

export const fabriqueAdaptateurMatamo = (
  clientHttpPosteur: ClientHttpPosteur<DonneesEvenement, unknown>,
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurAnalytique => ({
  rapporteEvenement: async (
    donneesEvenement: DonneesEvenementDocumentGuideTelecharge
  ) => {
    const parametres = new URLSearchParams();
    parametres.append('rec', '1');
    parametres.append('idsite', adaptateurEnvironnement.matomo().idSite());
    parametres.append('e_c', 'Guides');
    parametres.append(
      'e_a',
      `Document téléchargé depuis ${donneesEvenement.donnees.origine ?? 'source inconnue'}`
    );
    parametres.append('e_n', donneesEvenement.donnees.nomFichier);

    await clientHttpPosteur.post(
      'https://stats.beta.gouv.fr/matomo.php?' + parametres.toString(),
      donneesEvenement
    );
  },
});
