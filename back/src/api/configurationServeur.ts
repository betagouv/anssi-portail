import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './oidc/adaptateurOIDC';
import { AdaptateurJWT } from './adaptateurJWT';
import {BusEvenements} from "../bus/busEvenements";
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
  adaptateurJWT: AdaptateurJWT;
  busEvenement: BusEvenements;
  entrepotUtilisateur: EntrepotUtilisateur;
  trustProxy: String;
};
