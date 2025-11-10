import { lecteurDeSiteHttp } from './lecteurDeSiteHttp';
import { RecuperateurDAdressesDesGuides } from './recuperateurDAdressesDesGuides';
import { RecuperateurGuide } from './recuperateurGuide';
import { transformeEnCsv } from './transformateurCsv';

const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
  lecteurDeSiteHttp
);

const adresses = await recuperateurDeGuides.recupere(
  'https://cyber.gouv.fr/publications?field_type_de_publication_target_id%5B934%5D=934&field_type_de_publication_target_id%5B936%5D=936',
  2
);

const guides = await Promise.all(
  adresses.map(async (adresse) =>
    new RecuperateurGuide(lecteurDeSiteHttp).recupere(adresse)
  )
);

const guidesEnCsv = transformeEnCsv(guides);

console.log(guidesEnCsv);
