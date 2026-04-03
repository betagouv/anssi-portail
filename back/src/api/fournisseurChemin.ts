import { join } from 'path';

export interface FournisseurChemin {
  cheminPageJekyll: (nomPage: string) => string;
  cheminProduitJekyll: (typologie: string, idProduit: string) => string;
  ressourceDeBase: (ressource: string) => string;
  cheminCsvNis2Simulateur: () => string;
}

export const fournisseurChemin: FournisseurChemin = {
  cheminPageJekyll: (nomPage: string) => join(process.cwd(), 'front', '_site', nomPage, 'index.html'),
  cheminProduitJekyll: (repertoireProduits: string, idProduit: string) =>
    join(process.cwd(), 'front', '_site', repertoireProduits, idProduit),
  ressourceDeBase: (ressource) => join(process.cwd(), 'front', '_site', ressource),
  cheminCsvNis2Simulateur: () =>
    join(process.cwd(), 'back', 'src', 'metier', 'nis2-simulateur', 'questionnaire', 'specifications-completes.csv'),
};
