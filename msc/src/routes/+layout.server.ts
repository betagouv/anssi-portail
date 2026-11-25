import { load as lireYaml } from 'js-yaml';
import descriptions from '../../../front/_data/meta-description.yml?raw';
import pages from '../../pages.json';
import type { LayoutServerLoad } from './$types';

const descriptionsMSC = lireYaml(descriptions) as Record<string, string>;
const métadonnées = Object.fromEntries(
  Object.entries(pages).map(([nom, page]) => [
    nom,
    {
      titre: 'titre' in page ? page.titre : undefined,
      description: descriptionsMSC['/' + nom + '/'] ?? descriptionsMSC['/' + nom] ?? '',
    },
  ])
);
export const load: LayoutServerLoad = ({ locals, url }) => {
  return {
    profil: locals.profil,
    maintenance: locals.maintenance ?? null,
    métadonnées: métadonnées[url.pathname.slice(1)],
    origine: process.env.URL_BASE_MSC ?? 'https://messervices.cyber.gouv.fr',
    delaiAvis: process.env.DELAI_AFFICHAGE_AVIS_UTILISATEUR,
    matomo: process.env.MATOMO_ID,
    tagManager: process.env.MATOMO_URL_TAG_MANAGER,
    verification: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
    sentry: process.env.SENTRY_DSN,
    environnementSentry: process.env.SENTRY_ENVIRONNEMENT,
  };
};
