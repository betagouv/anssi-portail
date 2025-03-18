import { creeServeur } from './api/msc';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { adaptateurJWT } from './api/adaptateurJWT';
import { BusEvenements } from './bus/busEvenements';
import { cableTousLesAbonnes } from './bus/cablage';
import { EntrepotUtilisateurMPAPostgres } from './infra/entrepotUtilisateurMPAPostgres';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { adaptateurRechercheEntreprise } from './infra/adaptateurRechercheEntreprise';
import { adaptateurGestionErreurSentry } from './infra/adaptateurGestionErreurSentry';
import { adaptateurHorloge } from './infra/adaptateurHorloge';
import { fabriqueAdaptateurJournal } from './infra/adaptateurJournal';
import { fabriqueAdaptateurProfilAnssi } from './infra/adaptateurProfilAnssi';
import { EntrepotResultatTestPostgres } from './infra/entrepotResultatTestPostgres';

const busEvenements = new BusEvenements();
cableTousLesAbonnes({
  busEvenements,
  adaptateurJournal: fabriqueAdaptateurJournal(),
  adaptateurHorloge,
});

const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware({ adaptateurJWT }),
  adaptateurOIDC,
  adaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionErreurSentry,
  busEvenements,
  entrepotUtilisateur: new EntrepotUtilisateurMPAPostgres(
    adaptateurProfilAnssi,
    adaptateurRechercheEntreprise
  ),
  trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
  maxRequetesParMinutes: adaptateurEnvironnement
    .serveur()
    .maxRequetesParMinute(),
  adaptateurRechercheEntreprise,
  adaptateurProfilAnssi,
  entrepotResultatTest: new EntrepotResultatTestPostgres(),
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
