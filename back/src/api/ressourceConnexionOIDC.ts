import { Router } from "express";
import { ConfigurationServeur } from "./configurationServeur";

const ressourceConnexionOIDC = (configurationServeur: ConfigurationServeur) => {
  let routeur = Router();
  routeur.get("/", async (_requete, reponse) => {
    const demandeAutorisation =
      await configurationServeur.adaptateurOIDC.genereDemandeAutorisation();

    reponse.redirect(demandeAutorisation.url);
  });
  return routeur;
};

export { ressourceConnexionOIDC };
