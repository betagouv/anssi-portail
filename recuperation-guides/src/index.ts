import { lecteurDeSiteHttp } from './lecteurDeSiteHttp';
import { RecuperateurDAdressesDesGuides } from './recuperateurDAdressesDesGuides';
import { RecuperateurGuide } from './recuperateurGuide';

console.log('Récupération des guides de sécurité...');
const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
  lecteurDeSiteHttp
);

const adresses = await recuperateurDeGuides.recupere(
  'https://cyber.gouv.fr/publications?field_type_de_publication_target_id%5B934%5D=934&field_type_de_publication_target_id%5B936%5D=936',
  2
);

console.log(adresses);

console.log("Premier guide", await new RecuperateurGuide(lecteurDeSiteHttp).recupere(adresses[0]))
