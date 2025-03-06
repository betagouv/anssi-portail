import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './oidc/adaptateurOIDC';
import { AdaptateurJWT } from './adaptateurJWT';
import {BusEvenements} from "../bus/busEvenements";

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
  adaptateurJWT: AdaptateurJWT;
  busEvenement: BusEvenements;
};
