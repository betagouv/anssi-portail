import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';
import { EntrepotUtilisateurPostgres } from './infra/entrepotUtilisateurPostgres';
import { adaptateurRechercheEntreprise } from "./infra/adaptateurRechercheEntreprise";

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC,
  adaptateurJWT,
  entrepotUtilisateur: new EntrepotUtilisateurPostgres(),
  adaptateurRechercheEntreprise,
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
