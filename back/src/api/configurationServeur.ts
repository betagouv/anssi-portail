import { FournisseurChemin } from "./fournisseurChemin";
import { Middleware } from "./middleware";
import {adaptateurOIDC} from "./adaptateurOIDC";

interface DemandeAutorisation {
  url: string;
  nonce: string;
  state: string;
}

interface adaptateurOIDC {
  genereDemandeAutorisation: () => Promise<DemandeAutorisation>;
}

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
  adaptateurOIDC: adaptateurOIDC;
};
