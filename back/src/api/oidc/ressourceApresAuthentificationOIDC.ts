import { Router } from "express";
import { ConfigurationServeur } from "../configurationServeur";

const ressourceApresAuthentificationOIDC = (
  configurationServeur: ConfigurationServeur
) => {
  let routeur = Router();
  routeur.get("/", async (_requete, reponse) => {
    reponse.sendFile(
      configurationServeur.fournisseurChemin.cheminPageJekyll(
        "apres-authentification"
      )
    );
  });
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
