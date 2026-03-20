import { URLSearchParams } from 'node:url';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttpPosteur } from './clientHttp';
import { DonneesEvenement, DonneesEvenementVisaTelecharge } from './donneesEvenement';

export type AdaptateurAnalytique = {
  rapporteEvenement: (donneesEvenement: DonneesEvenementVisaTelecharge) => Promise<void>;
};

export const fabriqueAdaptateurMatamo = (
  clientHttpPosteur: ClientHttpPosteur<DonneesEvenement, unknown>,
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurAnalytique => ({
  rapporteEvenement: async (donneesEvenement) => {
    const { categorie, nomAction } = recupereCaracteristiquesEvenement(donneesEvenement);

    const parametres = new URLSearchParams();
    parametres.append('rec', '1');
    parametres.append('idsite', adaptateurEnvironnement.matomo().idSite());
    parametres.append('e_c', categorie);
    parametres.append('e_a', nomAction);
    parametres.append('e_n', donneesEvenement.donnees.nomFichier);

    await clientHttpPosteur.post('https://stats.beta.gouv.fr/matomo.php?' + parametres.toString(), donneesEvenement);
  },
});

function recupereCaracteristiquesEvenement(_donneesEvenement: DonneesEvenementVisaTelecharge): {
  categorie: string;
  nomAction: string;
} {
  return {
    categorie: 'Visas',
    nomAction: 'Visa téléchargé',
  };
}
