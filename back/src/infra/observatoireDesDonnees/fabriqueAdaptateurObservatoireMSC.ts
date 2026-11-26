import Knex from 'knex';

import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';
import { AdaptateurObservatoireMSCMemoire } from './adaptateurObservatoireMSCMemoire.js';
import { AdaptateurObservatoireMSCPostgres } from './adaptateurObservatoireMSCPostgres.js';

const POOL_CONNEXION_MAX = 5;

export const fabriqueAdaptateurObservatoireMSC = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurObservatoireMSC => {
  const urlServeur = adaptateurEnvironnement.observatoire.urlServeur();
  if (!urlServeur) return new AdaptateurObservatoireMSCMemoire();

  return new AdaptateurObservatoireMSCPostgres(
    Knex({ client: 'pg', connection: urlServeur, pool: { min: 0, max: POOL_CONNEXION_MAX } })
  );
};
