import fs from 'node:fs';
import { ConsignateurDeComparaisonDeGuides } from './infrastructure/consignateurDeComparaisonDeGuides';
import { ComparateurDeGuides } from './metier/guides/comparateurDeGuides';
import { EntrepotGuideGrist } from './infrastructure/entrepotGuideGrist';
import { adaptateurEnvironnement } from './infrastructure/adaptateurEnvironnement';
import axios from 'axios';

const summaryFile = process.env.GITHUB_STEP_SUMMARY ?? 'rapport-guides.md';

const entrepotSource = new EntrepotGuideGrist(
  axios,
  adaptateurEnvironnement.grist().source().urlDoc(),
  adaptateurEnvironnement.grist().source().idTable(),
  adaptateurEnvironnement.grist().source().cleApi()
);
const comparateurDeGuides = new ComparateurDeGuides(
  entrepotSource,
  new EntrepotGuideGrist(
    axios,
    adaptateurEnvironnement.grist().cible().urlDoc(),
    adaptateurEnvironnement.grist().cible().idTable(),
    adaptateurEnvironnement.grist().cible().cleApi()
  )
);

const empreinte = await entrepotSource.empreinte();

await comparateurDeGuides.chargeLesDonnees();
const comparaison = comparateurDeGuides.compare();

const consignateurDeComparaisonDeGuides =
  new ConsignateurDeComparaisonDeGuides();

const markdown =
  consignateurDeComparaisonDeGuides.consigneComparaison(comparaison);

fs.appendFileSync(summaryFile, markdown);
fs.writeFileSync('empreinte.txt', empreinte);
