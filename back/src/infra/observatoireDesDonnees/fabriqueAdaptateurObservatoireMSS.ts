import Knex from 'knex';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { AdaptateurObservatoireMSS } from './adaptateurObservatoireMSS.js';
import { AdaptateurObservatoireMSSMemoire } from './adaptateurObservatoireMSSMemoire.js';
import { AdaptateurObservatoireMSSPostgres } from './adaptateurObservatoireMSSPostgres.js';

const POOL_CONNEXION_MAX = 5;

export const fabriqueAdaptateurObservatoireMSS = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurObservatoireMSS => {
  const urlServeur = adaptateurEnvironnement.observatoire.urlServeur();
  if (!urlServeur) return new AdaptateurObservatoireMSSMemoire();

  return new AdaptateurObservatoireMSSPostgres(
    Knex({ client: 'pg', connection: urlServeur, pool: { min: 0, max: POOL_CONNEXION_MAX } })
  );
};
