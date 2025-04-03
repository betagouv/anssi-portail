import { FournisseurChemin } from './fournisseurChemin';
import { Middleware } from './middleware';
import { AdaptateurOIDC } from './oidc/adaptateurOIDC';
import { AdaptateurJWT } from './adaptateurJWT';
import { BusEvenements } from '../bus/busEvenements';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { AdaptateurGestionErreur } from '../infra/adaptateurGestionErreurSentry';
import { EntrepotResultatTest } from '../metier/entrepotResultatTest';
import { AdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { AdaptateurMonAideCyber } from '../infra/adaptateurMonAideCyber';

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: AdaptateurOIDC;
  adaptateurJWT: AdaptateurJWT;
  adaptateurGestionErreur: AdaptateurGestionErreur;
  busEvenements: BusEvenements;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  entrepotUtilisateur: EntrepotUtilisateur;
  reseau: {
    trustProxy: number | string;
    maxRequetesParMinutes: number;
    ipAutorisees: string[] | false;
  };
  entrepotResultatTest: EntrepotResultatTest;
  entrepotFavori: EntrepotFavori;
  adaptateurProfilAnssi: AdaptateurProfilAnssi;
  adaptateurMonAideCyber: AdaptateurMonAideCyber;
};
