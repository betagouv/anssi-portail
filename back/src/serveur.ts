import { creeServeur } from "./api/msc";
import { fournisseurChemin } from "./api/fournisseurChemin";
import { fabriqueMiddleware } from "./api/middleware";

creeServeur({ fournisseurChemin, middleware: fabriqueMiddleware() }).listen(
  3000,
  () => {
    console.log("Le serveur écoute sur le port 3000");
  },
);
