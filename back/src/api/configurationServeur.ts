import { FournisseurChemin } from "./fournisseurChemin";
import { Middleware } from "./middleware";

export type ConfigurationServeur = {
  fournisseurChemin: FournisseurChemin;
  middleware: Middleware;
};
