import { EntrepotFinancementGrist } from './infra/entrepotFinancement';
import { ComparateurFinancement } from './metier/comparateurFinancement';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { adaptateurAPIAidesEntreprises } from './infra/adaptateurSourceExterne';

const entrepotFinancementGrist = new EntrepotFinancementGrist({
  adaptateurEnvironnement,
});
const comparateurFinancement = new ComparateurFinancement(
  entrepotFinancementGrist,
  adaptateurAPIAidesEntreprises
);

console.info('Récupération des financements...');
await comparateurFinancement.chargeFinancements();
console.info('...compare avec les financements sur aides-entreprise...');
const resultats = comparateurFinancement.compareSourceExterne();
console.info(resultats);
console.info('...cherche de nouveaux financement cyber...');
console.info('... Terminé !');
