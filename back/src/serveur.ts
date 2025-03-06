import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';
import {BusEvenements} from "./bus/busEvenements";
import {cableTousLesAbonnes} from "./bus/cablage";

const busEvenement = new BusEvenements();
cableTousLesAbonnes(busEvenement);

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC,
  adaptateurJWT,
  busEvenement
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
