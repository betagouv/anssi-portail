import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';
import { BusEvenements } from './bus/busEvenements';
import { cableTousLesAbonnes } from './bus/cablage';
import { EntrepotUtilisateurPostgres } from './infra/entrepotUtilisateurPostgres';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { adaptateurRechercheEntreprise } from "./infra/adaptateurRechercheEntreprise";
import { adaptateurGestionErreurSentry } from './infra/adaptateurGestionErreurSentry';

const busEvenement = new BusEvenements();
cableTousLesAbonnes(busEvenement);

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC,
  adaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionErreurSentry,
  busEvenement,
  entrepotUtilisateur: new EntrepotUtilisateurPostgres(),
  trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
  maxRequetesParMinutes: adaptateurEnvironnement.serveur().maxRequetesParMinute(),
  adaptateurRechercheEntreprise,
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
