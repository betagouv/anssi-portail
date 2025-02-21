import { ConfigurationServeur } from "./configurationServeur";
import { Request, Response, Router } from "express";

const ressourcePageProduit = (
  { fournisseurChemin }: ConfigurationServeur,
  repertoireProduits: string,
): Router => {
  const routeur = Router();

  routeur.get("/:id", (requete: Request, reponse: Response) => {
    reponse
      .contentType("text/html")
      .status(200)
      .sendFile(
        fournisseurChemin.cheminProduitJekyll(
          repertoireProduits,
          requete.params.id,
        ),
      );
  });

  return routeur;
};
export { ressourcePageProduit };
