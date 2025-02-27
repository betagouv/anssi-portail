import { Router } from "express";

const ressourceApresAuthentificationOIDC = () => {
  let routeur = Router();
  routeur.get("/", async (_requete, reponse) => {
    reponse.sendStatus(200);
  });
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
