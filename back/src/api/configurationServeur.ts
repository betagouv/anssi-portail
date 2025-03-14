import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './oidc/adaptateurOIDC';
import { AdaptateurJWT } from './adaptateurJWT';
import { BusEvenements } from '../bus/busEvenements';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { AdaptateurGestionErreur } from '../infra/adaptateurGestionErreurSentry';
import { AdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi';

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
  adaptateurJWT: AdaptateurJWT;
  adaptateurGestionErreur: AdaptateurGestionErreur;
  busEvenements: BusEvenements;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  entrepotUtilisateur: EntrepotUtilisateur;
  trustProxy: String;
  maxRequetesParMinutes: number;
  adaptateurProfilAnssi: AdaptateurProfilAnssi;
};
