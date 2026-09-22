import fs from 'node:fs';
import axios from '@anssi-portail/axios';
import { adaptateurEnvironnement } from './infrastructure/adaptateurEnvironnement';
import { ConsignateurDeComparaisonDeFinancements } from './infrastructure/financements/consignateurDeComparaisonDeFinancements';
import { EntrepotFinancementGrist } from './infrastructure/financements/entrepotFinancementGrist';
import { ComparateurDeFinancements } from './metier/financements/comparateurDeFinancements';

const summaryFile = process.env.GITHUB_STEP_SUMMARY ?? 'rapport-financements.md';

const entrepotSource = new EntrepotFinancementGrist(
  axios,
  adaptateurEnvironnement.grist().source().urlDoc(),
  adaptateurEnvironnement.grist().source().idTable(),
  adaptateurEnvironnement.grist().source().cleApi()
);

const entrepotCible = new EntrepotFinancementGrist(
  axios,
  adaptateurEnvironnement.grist().cible().urlDoc(),
  adaptateurEnvironnement.grist().cible().idTable(),
  adaptateurEnvironnement.grist().cible().cleApi()
);

const empreinte = await entrepotSource.empreinte();

const comparateurDeFinancements = new ComparateurDeFinancements(entrepotSource, entrepotCible);
await comparateurDeFinancements.chargeLesDonnees();
const comparaison = comparateurDeFinancements.compare();

const consignateur = new ConsignateurDeComparaisonDeFinancements();
const markdown = consignateur.consigneComparaison(comparaison);

fs.appendFileSync(summaryFile, markdown);
fs.writeFileSync('empreinte.txt', empreinte);
