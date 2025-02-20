import { creeServeur } from "./api/msc";
import { fournisseurChemin } from "./api/fournisseurChemin";

creeServeur({ fournisseurChemin }).listen(3000, () => {
  console.log("Le serveur écoute sur le port 3000");
});
