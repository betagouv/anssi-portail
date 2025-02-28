import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC,
  adaptateurJWT
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
