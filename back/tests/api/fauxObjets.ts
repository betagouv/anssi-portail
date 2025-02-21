import {join} from "path";

export let fauxFournisseurDeChemin = {
    getCheminPageJekyll: (_: string) =>
        join(process.cwd(), "tests", "ressources", "factice.html"),
    getCheminProduitJekyll: (_a: string, _b: string) =>
        join(process.cwd(), "tests", "ressources", "factice.html"),
};