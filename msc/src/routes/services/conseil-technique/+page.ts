import fiche from '../../../../../front/_data/services/conseil-technique.json';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
  fiche,
  seo: { titre: fiche.nom, nom: fiche.nom, service: fiche.description },
});
