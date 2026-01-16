import { EntrepotFinancementGrist } from './infra/entrepotFinancement';
import { ComparateurFinancement } from './metier/comparateurFinancement';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { AdapateurAidesEntreprisesAPI } from './infra/adaptateurSourceExterne';
import { GenerateurDeRapportsFichier } from './infra/generateurDeRapportsFichier';

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

const generateurDeRapportsFichier = new GenerateurDeRapportsFichier();

console.info('Récupération des financements...');
await comparateurFinancement.chargeFinancements();

console.info('...compare avec les financements sur aides-entreprise...');
const resultats = comparateurFinancement.compareSourceExterne();
const nouvellesAides = await comparateurFinancement.detecteNouvellesAides();
await generateurDeRapportsFichier.genereRapports(resultats, nouvellesAides);

console.info('... Terminé !');
