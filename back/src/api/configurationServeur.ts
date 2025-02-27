import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './adaptateurOIDC';

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
};
