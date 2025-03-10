import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './oidc/adaptateurOIDC';
import { AdaptateurJWT } from './adaptateurJWT';
import { BusEvenements } from '../bus/busEvenements';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { AdaptateurRechercheEntreprise } from "../infra/adaptateurRechercheEntreprise";

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
  adaptateurJWT: AdaptateurJWT;
  busEvenement: BusEvenements;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  entrepotUtilisateur: EntrepotUtilisateur;
  trustProxy: String;
  maxRequetesParMinutes: number;
};
