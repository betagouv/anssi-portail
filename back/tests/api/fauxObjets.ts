import { join } from 'path';

export const fauxFournisseurDeChemin = {
  cheminPageJekyll: (_: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
  cheminProduitJekyll: (_a: string, _b: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
  ressourceDeBase: (_: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
};

export const fauxAdaptateurOIDC = {
  genereDemandeAutorisation: async () => ({
    url: "",
    nonce: "",
    state: "",
  }),
};
