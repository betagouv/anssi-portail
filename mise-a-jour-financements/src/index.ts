import { EntrepotFinancementGrist } from './infra/entrepotFinancement';
import { ComparateurFinancement } from './metier/comparateurFinancement';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { AdapateurAidesEntreprisesAPI } from './infra/adaptateurSourceExterne';
import { generateurDeRapportsConsole } from './infra/generateurDeRapportsConsole';

const entrepotFinancementGrist = new EntrepotFinancementGrist({
  adaptateurEnvironnement,
});
const adaptateuAidesEntreprisesAPI = new AdapateurAidesEntreprisesAPI({
  adaptateurEnvironnement,
});
const comparateurFinancement = new ComparateurFinancement(
  entrepotFinancementGrist,
  adaptateuAidesEntreprisesAPI,
  adaptateurEnvironnement
);

console.info('Récupération des financements...');
await comparateurFinancement.chargeFinancements();

console.info('...compare avec les financements sur aides-entreprise...');
const resultats = comparateurFinancement.compareSourceExterne();
generateurDeRapportsConsole.genereRapportDifference(resultats);

// console.info('...cherche de nouveaux financement cyber...');
// const nouvellesAides = await comparateurFinancement.detecteNouvellesAides();
// console.info('nouvellesAides : ', nouvellesAides);

console.info('... Terminé !');
