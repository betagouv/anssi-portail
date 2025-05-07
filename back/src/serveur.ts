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
import { fabriqueAdaptateurEmail } from './infra/adaptateurEmailBrevo';
import { EntrepotFavoriPostgres } from './infra/entrepotFavoriPostgres';
import { fabriqueAdaptateurMonAideCyber } from './infra/adaptateurMonAideCyber';
import { fabriqueAdaptateurChiffrement } from './infra/adaptateurChiffrement';
import { CmsCrisp } from '@lab-anssi/lib';
import { EntrepotSessionDeGroupePostgres } from './infra/EntrepotSessionDeGroupePostgres';

const adaptateurEmail = fabriqueAdaptateurEmail();
const adaptateurChiffrement = fabriqueAdaptateurChiffrement();
const adaptateurJournal = fabriqueAdaptateurJournal();
const entrepotFavori = new EntrepotFavoriPostgres();

const busEvenements = new BusEvenements();
cableTousLesAbonnes({
  busEvenements,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
  entrepotFavori,
});

const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
const adaptateurMonAideCyber = fabriqueAdaptateurMonAideCyber();

const crispIdSite = process.env.CRISP_ID_SITE;
const crispCleApi = process.env.CRISP_CLE_API;
if (!crispIdSite || !crispCleApi) {
  throw new Error('Variables CRISP_ID_SITE et/ou CRISP_CLE_API manquantes');
}

const cmsCrisp = new CmsCrisp(crispIdSite, crispCleApi);

creeServeur({
  fournisseurChemin,
  middleware: fabriqueMiddleware({ adaptateurJWT, fournisseurChemin }),
  adaptateurOIDC,
  adaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionErreurSentry,
  busEvenements,
  entrepotUtilisateur: new EntrepotUtilisateurMPAPostgres(
    adaptateurProfilAnssi,
    adaptateurRechercheEntreprise
  ),
  reseau: {
    trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
    maxRequetesParMinutes: adaptateurEnvironnement
      .serveur()
      .maxRequetesParMinute(),
    ipAutorisees: adaptateurEnvironnement.serveur().ipAutorisees(),
  },
  adaptateurRechercheEntreprise,
  adaptateurProfilAnssi,
  entrepotResultatTest: new EntrepotResultatTestPostgres(),
  entrepotFavori: new EntrepotFavoriPostgres(),
  entrepotSessionDeGroupe: new EntrepotSessionDeGroupePostgres(),
  adaptateurMonAideCyber,
  adaptateurEnvironnement,
  cmsCrisp,
}).listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
