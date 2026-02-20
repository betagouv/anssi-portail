import { CmsCrisp } from '@lab-anssi/lib';
import axios from 'axios';
import { adaptateurJWT } from './api/adaptateurJWT';
import { fournisseurChemin } from './api/fournisseurChemin';
import { fabriqueMiddleware } from './api/middleware';
import { creeServeur } from './api/msc';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC';
import { BusEvenements } from './bus/busEvenements';
import { cableTousLesAbonnes } from './bus/cablage';
import { fabriqueAdaptateurMatamo } from './infra/adaptateurAnalytique';
import { adaptateurCellar } from './infra/adaptateurCellar';
import { fabriqueAdaptateurChiffrement } from './infra/adaptateurChiffrement';
import { fabriqueAdaptateurEmail } from './infra/adaptateurEmailBrevo';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement';
import { adaptateurGestionErreurSentry } from './infra/adaptateurGestionErreurSentry';
import { fabriqueAdaptateurHachage } from './infra/adaptateurHachage';
import { adaptateurHorloge } from './infra/adaptateurHorloge';
import { fabriqueAdaptateurJournal } from './infra/adaptateurJournal';
import { fabriqueAdaptateurMonAideCyber } from './infra/adaptateurMonAideCyber';
import { fabriqueAdaptateurProfilAnssi } from './infra/adaptateurProfilAnssi';
import { adaptateurRechercheEntreprise } from './infra/adaptateurRechercheEntreprise';
import { EntrepotExigenceGrist } from './infra/EntrepotExigenceGrist';
import { EntrepotFavoriPostgres } from './infra/entrepotFavoriPostgres';
import { EntrepotFinancementGrist } from './infra/entrepotFinancementGrist';
import { EntrepotGuideGrist } from './infra/entrepotGuideGrist';
import { EntrepotResultatTestPostgres } from './infra/entrepotResultatTestPostgres';
import { EntrepotSecretHachagePostgres } from './infra/entrepotSecretHachagePostgres';
import { EntrepotSessionDeGroupePostgres } from './infra/EntrepotSessionDeGroupePostgres';
import { EntrepotUtilisateurMPAPostgres } from './infra/entrepotUtilisateurMPAPostgres';
import { messagerieMattermost } from './infra/messagerieMattermost';
import { fabriqueServiceVerificationCoherenceSecretsHachage } from './infra/serviceVerificationCoherenceSecretsHachage';
import { EntrepotExigence } from './metier/EntrepotExigence';
import { EntrepotGuide } from './metier/entrepotGuide';
import { GenerateurAleatoireCodeSessionDeGroupe } from './metier/generateurCodeSessionDeGroupe';

const adaptateurEmail = fabriqueAdaptateurEmail();
const adaptateurChiffrement = fabriqueAdaptateurChiffrement(
  adaptateurEnvironnement
);
const adaptateurJournal = fabriqueAdaptateurJournal();
const adaptateurAnalytique = fabriqueAdaptateurMatamo(
  axios,
  adaptateurEnvironnement
);
const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
const adaptateurMonAideCyber = fabriqueAdaptateurMonAideCyber(
  adaptateurEnvironnement
);
const adaptateurHachage = fabriqueAdaptateurHachage({
  adaptateurEnvironnement,
});

const entrepotFavori = new EntrepotFavoriPostgres({ adaptateurHachage });
const entrepotFinancement = new EntrepotFinancementGrist({
  clientHttp: axios,
  adaptateurEnvironnement,
});
const entrepotSessionDeGroupe = new EntrepotSessionDeGroupePostgres();
const entrepotSecretHachage = new EntrepotSecretHachagePostgres();
const entrepotUtilisateur = new EntrepotUtilisateurMPAPostgres({
  adaptateurProfilAnssi,
  adaptateurRechercheEntreprise,
  adaptateurChiffrement,
  adaptateurHachage,
});
const entrepotResultatTest = new EntrepotResultatTestPostgres({
  adaptateurHachage,
  entrepotUtilisateur,
});

const entrepotGuide: EntrepotGuide = new EntrepotGuideGrist({
  adaptateurEnvironnement,
});

const entrepotExigence : EntrepotExigence = new EntrepotExigenceGrist();

const busEvenements = new BusEvenements();
cableTousLesAbonnes({
  busEvenements,
  adaptateurAnalytique,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
});

const crispIdSite = process.env.CRISP_ID_SITE;
const crispCleApi = process.env.CRISP_CLE_API;
if (!crispIdSite || !crispCleApi) {
  throw new Error('Variables CRISP_ID_SITE et/ou CRISP_CLE_API manquantes');
}

const cmsCrisp = new CmsCrisp(crispIdSite, crispCleApi);

const serviceCoherenceSecretsHachage =
  fabriqueServiceVerificationCoherenceSecretsHachage({
    adaptateurEnvironnement,
    entrepotSecretHachage,
    adaptateurHachage,
  });

const messagerieInstantanee = messagerieMattermost({ adaptateurEnvironnement });

const port = process.env.PORT || 3000;

serviceCoherenceSecretsHachage
  .verifieCoherenceSecrets()
  .catch((reason) => {
    console.error(reason.message);
    process.exit(1);
  })
  .then(() => console.log('✅ Vérification des secrets réussie'))
  .then(() => {
    return creeServeur({
      fournisseurChemin,
      middleware: fabriqueMiddleware({
        adaptateurJWT,
        fournisseurChemin,
        adaptateurEnvironnement,
      }),
      adaptateurOIDC,
      adaptateurJWT,
      adaptateurGestionErreur: adaptateurGestionErreurSentry,
      busEvenements,
      entrepotUtilisateur,
      reseau: {
        trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
        maxRequetesParMinutes: adaptateurEnvironnement
          .serveur()
          .maxRequetesParMinute(),
        ipAutorisees: adaptateurEnvironnement.serveur().ipAutorisees(),
      },
      adaptateurRechercheEntreprise,
      adaptateurProfilAnssi,
      entrepotResultatTest,
      entrepotFavori,
      entrepotSessionDeGroupe,
      adaptateurMonAideCyber,
      adaptateurEnvironnement,
      cmsCrisp,
      generateurCodeSessionDeGroupe: new GenerateurAleatoireCodeSessionDeGroupe(
        entrepotSessionDeGroupe
      ),
      adaptateurHachage,
      messagerieInstantanee,
      entrepotFinancement,
      entrepotGuide,
      entrepotExigence,
      cellar: adaptateurCellar(adaptateurEnvironnement),
    }).listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  });
