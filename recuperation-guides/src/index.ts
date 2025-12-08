import fs from 'node:fs/promises';
import { lecteurDeSiteHttp } from './lecteurDeSiteHttp';
import { RecuperateurDAdressesDesGuides } from './recuperateurDAdressesDesGuides';
import { RecuperateurGuide } from './recuperateurGuide';
import { transformeEnCsv } from './transformateurCsv';
import { recupereDocuments } from './recuperateurDocuments';

const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
  lecteurDeSiteHttp
);

const adresses = await recuperateurDeGuides.recupere(
  'https://cyber.gouv.fr/nous-connaitre/publications/?field_type_de_publication_target_id%5B934%5D=934&field_type_de_publication_target_id%5B936%5D=936',
  12
);

const adresses_anglaises = await recuperateurDeGuides.recupere(
  'https://cyber.gouv.fr/en/publications?field_type_de_publication_target_id%5B934%5D=934&field_type_de_publication_target_id%5B936%5D=936',
  5
);

const recuperateurGuide = new RecuperateurGuide(lecteurDeSiteHttp);
const guides = await Promise.all(
  adresses
    .concat(adresses_anglaises)
    .map(async (adresse) => await recuperateurGuide.recupere(adresse))
);

const guidesEnCsv = transformeEnCsv(guides);

console.log('Ecriture des guides dans un CSV...');

await fs.access('sortie').catch(async () => {
  await fs.mkdir('sortie');
});
await fs.writeFile('sortie/guides.csv', guidesEnCsv);

console.log('Récupération des images...');
await recupereDocuments(guides);
console.log('... Terminé !');
