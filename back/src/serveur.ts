import { CmsCrisp } from '@lab-anssi/lib';
import { adaptateurJWT } from './api/adaptateurJWT.js';
import { fournisseurChemin } from './api/fournisseurChemin.js';
import { fabriqueMiddleware } from './api/middleware.js';
import { creeServeur } from './api/msc.js';
import { adaptateurOIDC } from './api/oidc/adaptateurOIDC.js';
import { BusEvenements } from './bus/busEvenements.js';
import { cableTousLesAbonnes } from './bus/cablage.js';
import { EntrepôtModulePostgres } from './entrepotModulePostgres.js';
import { adaptateurCellar } from './infra/adaptateurCellar.js';
import { fabriqueAdaptateurChiffrement } from './infra/adaptateurChiffrement.js';
import { fabriqueAdaptateurEmail } from './infra/adaptateurEmailBrevo.js';
import { adaptateurEnvironnement } from './infra/adaptateurEnvironnement.js';
import { adaptateurGestionErreurSentry } from './infra/adaptateurGestionErreurSentry.js';
import { fabriqueAdaptateurHachage } from './infra/adaptateurHachage.js';
import { adaptateurHorloge } from './infra/adaptateurHorloge.js';
import { fabriqueAdaptateurJournal } from './infra/adaptateurJournal.js';
import { fabriqueAdaptateurMonAideCyber } from './infra/adaptateurMonAideCyber.js';
import { fabriqueAdaptateurProfilAnssi } from './infra/adaptateurProfilAnssi.js';
import { fabriqueAdaptateurRechercheEntreprise } from './infra/adaptateurRechercheEntreprise.js';
import axiosInstance from './infra/axiosInstance.js';
import { fabriqueAdaptateurEnrichissement } from './infra/enrichissement/adaptateurEnrichissement.js';
import { EntrepotFavoriPostgres } from './infra/entrepotFavoriPostgres.js';
import { EntrepotFinancementGrist } from './infra/entrepotFinancementGrist.js';
import { EntrepotGuideGrist } from './infra/entrepotGuideGrist.js';
import { EntrepotGuideTravailGrist } from './infra/entrepotGuideTravailGrist.js';
import { EntrepotMesurePostgres } from './infra/entrepotMesurePostgres.js';
import { EntrepotPriseEnComptePostgres } from './infra/entrepotPriseEnComptePostgres.js';
import { EntrepotResultatTestPostgres } from './infra/entrepotResultatTestPostgres.js';
import { EntrepotSecretHachagePostgres } from './infra/entrepotSecretHachagePostgres.js';
import { EntrepotSessionDeGroupePostgres } from './infra/EntrepotSessionDeGroupePostgres.js';
import { EntrepotUtilisateurMPAPostgres } from './infra/entrepotUtilisateurMPAPostgres.js';
import { GenerateurImageAvif } from './infra/generateurImage.js';
import { messagerieMattermost } from './infra/messagerieMattermost.js';
import { EntrepotExigenceGrist } from './infra/nis2/entrepotExigenceGrist.js';
import { fabriqueServiceVerificationCoherenceSecretsHachage } from './infra/serviceVerificationCoherenceSecretsHachage.js';
import { EntrepotGuide } from './metier/entrepotGuide.js';
import { EntrepotGuideTravail } from './metier/entrepotGuideTravail.js';
import { EntrepotMesure } from './metier/entrepotMesure.js';
import { GenerateurAleatoireCodeSessionDeGroupe } from './metier/generateurCodeSessionDeGroupe.js';
import { EntrepotExigence } from './metier/nis2/entrepotExigence.js';
import { fabriqueServiceSanteGuides } from './metier/serviceSanteGuides.js';

const adaptateurEmail = fabriqueAdaptateurEmail();
const adaptateurChiffrement = fabriqueAdaptateurChiffrement(adaptateurEnvironnement);
const adaptateurJournal = fabriqueAdaptateurJournal();
const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
const adaptateurMonAideCyber = fabriqueAdaptateurMonAideCyber(adaptateurEnvironnement);
const adaptateurHachage = fabriqueAdaptateurHachage({
  adaptateurEnvironnement,
});

const entrepotFavori = new EntrepotFavoriPostgres({ adaptateurHachage });
const entrepotFinancement = new EntrepotFinancementGrist({
  clientHttp: axiosInstance,
  adaptateurEnvironnement,
});
const entrepotSessionDeGroupe = new EntrepotSessionDeGroupePostgres();
const entrepotSecretHachage = new EntrepotSecretHachagePostgres();
const adaptateurRechercheEntreprise = fabriqueAdaptateurRechercheEntreprise(adaptateurEnvironnement);

const entrepotGuide: EntrepotGuide = new EntrepotGuideGrist({
  adaptateurEnvironnement,
});

const entrepotGuideTravail: EntrepotGuideTravail = new EntrepotGuideTravailGrist({
  adaptateurEnvironnement,
});

const entrepotExigence: EntrepotExigence = new EntrepotExigenceGrist({
  adaptateurEnvironnement,
});

const entrepotMesure: EntrepotMesure = new EntrepotMesurePostgres(entrepotExigence);
const entrepôtModule = new EntrepôtModulePostgres(entrepotMesure);

const entrepotUtilisateur = new EntrepotUtilisateurMPAPostgres({
  adaptateurProfilAnssi,
  adaptateurRechercheEntreprise,
  adaptateurChiffrement,
  adaptateurHachage,
  entrepotMesure,
});

const entrepotResultatTest = new EntrepotResultatTestPostgres({
  adaptateurHachage,
  entrepotUtilisateur,
});

const entrepotPriseEnCompte = new EntrepotPriseEnComptePostgres(adaptateurHachage, entrepotMesure);

const messagerieInstantanee = messagerieMattermost({ adaptateurEnvironnement });

const busEvenements = new BusEvenements();
cableTousLesAbonnes({
  busEvenements,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
  messagerieInstantanee,
});

const crispIdSite = process.env.CRISP_ID_SITE;
const crispCleApi = process.env.CRISP_CLE_API;
if (!crispIdSite || !crispCleApi) {
  console.error('💥 Variables CRISP_ID_SITE et/ou CRISP_CLE_API manquantes');
  process.exit(1);
}

const cmsCrisp = new CmsCrisp(crispIdSite, crispCleApi);

const serviceCoherenceSecretsHachage = fabriqueServiceVerificationCoherenceSecretsHachage({
  adaptateurEnvironnement,
  entrepotSecretHachage,
  adaptateurHachage,
});

const cellar = adaptateurCellar(adaptateurEnvironnement);

const serviceSanteGuides = fabriqueServiceSanteGuides(cellar);

const adaptateurEnrichissement = await fabriqueAdaptateurEnrichissement(
  adaptateurEnvironnement,
  fournisseurChemin,
  entrepotGuide,
  entrepotExigence,
  entrepotFinancement,
  cmsCrisp
);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await serviceCoherenceSecretsHachage.verifieCoherenceSecrets();
  } catch (raison: unknown) {
    console.error((raison as Error).message);
    // @ts-expect-error L’erreur peut contenir plusieurs erreurs
    console.error(raison.errors.map((e: Error) => e.message).join('\n'));
    process.exit(1);
  }

  console.log('✅ Vérification des secrets réussie');

  creeServeur({
    fournisseurChemin,
    middleware: fabriqueMiddleware({
      adaptateurJWT: adaptateurJWT(adaptateurEnvironnement),
      fournisseurChemin,
      adaptateurEnvironnement,
      adaptateurEnrichissement,
    }),
    adaptateurOIDC,
    adaptateurJWT: adaptateurJWT(adaptateurEnvironnement),
    adaptateurGestionErreur: adaptateurGestionErreurSentry,
    busEvenements,
    entrepotUtilisateur,
    reseau: {
      trustProxy: adaptateurEnvironnement.serveur().trustProxy(),
      maxRequetesParMinutes: adaptateurEnvironnement.serveur().maxRequetesParMinute(),
      maxRequetesParMinuteAPI: adaptateurEnvironnement.serveur().maxRequetesParMinuteAPI(),
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
    generateurCodeSessionDeGroupe: new GenerateurAleatoireCodeSessionDeGroupe(entrepotSessionDeGroupe),
    adaptateurHachage,
    messagerieInstantanee,
    entrepotFinancement,
    entrepotGuide,
    entrepotGuideTravail: entrepotGuideTravail,
    entrepotExigence,
    entrepotMesure,
    entrepotPriseEnCompte,
    entrepôtModule,
    cellar,
    serviceSanteGuides,
    adaptateurEmail,
    generateurImage: new GenerateurImageAvif(),
  }).listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
  });
})();
