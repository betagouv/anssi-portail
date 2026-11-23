import Knex from 'knex';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { AdaptateurObservatoire } from './adaptateurObservatoire.js';
import { AdaptateurObservatoireMemoire } from './adaptateurObservatoireMemoire.js';
import { AdaptateurObservatoirePostgres } from './adaptateurObservatoirePostgres.js';

const POOL_CONNEXION_MAX = 5;

export const fabriqueAdaptateurObservatoire = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurObservatoire => {
  const urlServeur = adaptateurEnvironnement.observatoire.urlServeur();
  if (!urlServeur) return new AdaptateurObservatoireMemoire();

  return new AdaptateurObservatoirePostgres(
    Knex({ client: 'pg', connection: urlServeur, pool: { min: 0, max: POOL_CONNEXION_MAX } })
  );
};
