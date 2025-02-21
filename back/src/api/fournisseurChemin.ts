import { join } from "path";

export interface FournisseurChemin {
  getCheminPageJekyll: (nomPage: string) => string;
  getCheminProduitJekyll: (typologie: string, idProduit: string) => string;
}

export const fournisseurChemin: FournisseurChemin = {
  getCheminPageJekyll: (nomPage: string) =>
    join(process.cwd(), "front", "_site", nomPage, "index.html"),
  getCheminProduitJekyll: (repertoireProduits: string, idProduit: string) =>
    join(process.cwd(), "front", "_site", repertoireProduits, idProduit),
};
