import Knex from 'knex';
import config from '../../knexfile.js';
import { fabriqueAdaptateurChiffrement } from '../infra/adaptateurChiffrement.js';
import { adaptateurEnvironnement } from '../infra/adaptateurEnvironnement.js';
import { fabriqueAdaptateurHachage } from '../infra/adaptateurHachage.js';
import { fabriqueAdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi.js';
import { AdaptateurRechercheEntrepriseGouv } from '../infra/adaptateurRechercheEntrepriseGouv.js';
import { messagerieMattermost } from '../infra/messagerieMattermost.js';
import { rapporteurConsole } from '../infra/rapporteurConsole.js';
import { MiseAJourObservatoire } from './metsAJourObservatoire.js';

const urlObservatoire = adaptateurEnvironnement.observatoire.urlServeur();
if (!urlObservatoire) {
  console.error("💥 La variable BASE_DONNEES_OBSERVATOIRE_URL_SERVEUR n'est pas renseignée");
  process.exit(1);
}

const knexObservatoire = Knex({ client: 'pg', connection: urlObservatoire });
const knexMSC = Knex(config);
const knexJournal = Knex({ client: 'pg', connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR });
const messagerieInstantanee = messagerieMattermost({ adaptateurEnvironnement });

const maintenant = () => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'long' }).format(new Date());

let codeRetour = 0;
const rapport = [`⏰ Début : ${maintenant()}`];
try {
  const rapportMaj = await new MiseAJourObservatoire({
    knexObservatoire,
    knexMSC,
    knexJournal,
    adaptateurChiffrement: fabriqueAdaptateurChiffrement(adaptateurEnvironnement),
    adaptateurHachage: fabriqueAdaptateurHachage({ adaptateurEnvironnement }),
    adaptateurProfilAnssi: fabriqueAdaptateurProfilAnssi(rapporteurConsole),
    adaptateurRechercheEntreprise: new AdaptateurRechercheEntrepriseGouv(adaptateurEnvironnement, rapporteurConsole),
  }).execute();
  rapport.push(...rapportMaj);
  rapport.push('✅ Mise à jour terminée');
} catch (erreur) {
  rapport.push(`💥 Mise à jour interrompue : ${(erreur as Error).message}`);
  codeRetour = 1;
} finally {
  await Promise.all([knexObservatoire.destroy(), knexMSC.destroy(), knexJournal.destroy()]);
  rapport.push(`⏰ Fin : ${maintenant()}`);
  await messagerieInstantanee.notifieRapportTechnique(rapport);
}

process.exit(codeRetour);
