import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';
import { BusEvenements } from './bus/busEvenements';
import { cableTousLesAbonnes } from './bus/cablage';
import { EntrepotUtilisateurPostgres } from './infra/entrepotUtilisateurPostgres';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';

const busEvenement = new BusEvenements();
cableTousLesAbonnes(busEvenement);

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC,
  adaptateurJWT,
  busEvenement,
  entrepotUtilisateur: new EntrepotUtilisateurPostgres(),
  trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
