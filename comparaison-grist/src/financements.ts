import axios from '@anssi-portail/axios';
import fs from 'node:fs';
import { adaptateurEnvironnement } from './infrastructure/adaptateurEnvironnement';
import { EntrepotFinancementGrist } from './infrastructure/financements/entrepotFinancementGrist';

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

fs.appendFileSync(
  summaryFile,
  'source : ' + (await entrepotSource.tous()).length + ', cible : ' + (await entrepotCible.tous()).length
);
