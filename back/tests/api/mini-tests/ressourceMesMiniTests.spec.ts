import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { RésultatTestExposition } from '@metier/mini-tests/exposition/resultatTestExposition.js';
import { RésultatTestHameçonnage } from '@metier/mini-tests/hameconnage/resultatTestHameconnage.js';
import { RésultatTestRéflexesCyber } from '@metier/mini-tests/reflexes-cyber/resultatTestReflexesCyber.js';
import { RésultatTestVraiFaux } from '@metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import { creeServeur } from '@api/msc/index.js';
import { EntrepôtRésultatTestExpositionMémoire } from '../../persistance/entrepotResultatTestExpositionMemoire.js';
import { EntrepôtRésultatTestHameçonnageMémoire } from '../../persistance/entrepotResultatTestHameconnageMemoire.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepôtRésultatTestRéflexesCyberMémoire } from '../../persistance/entrepotResultatTestReflexesCyberMemoire.js';
import { EntrepôtRésultatTestVraiFauxMémoire } from '../../persistance/entrepotResultatTestVraiFauxMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { unRésultatDeTestDeMaturité } from './maturite-cyber/constructeurResultatTestMaturite.js';

describe('La ressource de mes mini tests', () => {
  let serveur: Express;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;
  let entrepôtRésultatTestVraiFaux: EntrepôtRésultatTestVraiFauxMémoire;
  let entrepôtRésultatTestExposition: EntrepôtRésultatTestExpositionMémoire;
  let entrepôtRésultatTestHameçonnage: EntrepôtRésultatTestHameçonnageMémoire;
  let entrepôtRésultatTestRéflexesCyber: EntrepôtRésultatTestRéflexesCyberMémoire;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(async () => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    entrepôtRésultatTestVraiFaux = new EntrepôtRésultatTestVraiFauxMémoire();
    entrepôtRésultatTestExposition = new EntrepôtRésultatTestExpositionMémoire();
    entrepôtRésultatTestHameçonnage = new EntrepôtRésultatTestHameçonnageMémoire();
    entrepôtRésultatTestRéflexesCyber = new EntrepôtRésultatTestRéflexesCyberMémoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepôtRésultatTestMaturité,
      entrepôtRésultatTestVraiFaux,
      entrepôtRésultatTestExposition,
      entrepôtRésultatTestHameçonnage,
      entrepôtRésultatTestRéflexesCyber,
      entrepotUtilisateur,
    });
  });

  describe('sur demande GET', () => {
    async function getConnecté() {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      return await request(serveur).get('/api/mes-mini-tests').set('Cookie', [cookieJeanneDupont]);
    }

    it('renvoie 200', async () => {
      const réponse = await getConnecté();

      expect(réponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie 401 pour un utilisateur non connecté', async () => {
      const réponse = await request(serveur).get('/api/mes-mini-tests');

      expect(réponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('indique que le test de maturité a été réalisé', async () => {
      await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().pour(jeanneDupont).construis());

      const réponse = await getConnecté();

      expect(réponse.body.maturité.réalisé).toBe(true);
    });

    it('indique le niveau du test de maturité', async () => {
      const résultatTestDeMaturité = await unRésultatDeTestDeMaturité().pour(jeanneDupont).construis();

      await entrepôtRésultatTestMaturité.ajoute(résultatTestDeMaturité);

      const réponse = await getConnecté();

      expect(réponse.body.maturité.réalisé).toBe(true);
      expect(réponse.body.maturité.niveau).toBe(résultatTestDeMaturité.niveau());
    });

    it('indique que le test de maturité n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.maturité.réalisé).toBe(false);
    });

    it('indique que le test vrai-faux a été réalisé', async () => {
      await entrepôtRésultatTestVraiFaux.ajoute(
        new RésultatTestVraiFaux({
          utilisateur: jeanneDupont,
          score: '3',
        })
      );

      const réponse = await getConnecté();

      expect(réponse.body.vraiFaux.réalisé).toBe(true);
    });

    it('indique que le test vrai-faux n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.vraiFaux.réalisé).toBe(false);
    });

    it('indique que le test d’exposition a été réalisé', async () => {
      await entrepôtRésultatTestExposition.ajoute(new RésultatTestExposition({ utilisateur: jeanneDupont }));

      const réponse = await getConnecté();

      expect(réponse.body.exposition.réalisé).toBe(true);
    });

    it('indique que le test d’exposition n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.exposition.réalisé).toBe(false);
    });

    it('indique que le test hameçonnage a été réalisé', async () => {
      await entrepôtRésultatTestHameçonnage.ajoute(
        new RésultatTestHameçonnage({ utilisateur: jeanneDupont, score: '3' })
      );

      const réponse = await getConnecté();

      expect(réponse.body.hameçonnage.réalisé).toBe(true);
    });

    it('indique que le test hameçonnage n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.hameçonnage.réalisé).toBe(false);
    });

    it('indique que le test réflexes cyber a été réalisé', async () => {
      await entrepôtRésultatTestRéflexesCyber.ajoute(
        new RésultatTestRéflexesCyber({ utilisateur: jeanneDupont, score: '2' })
      );

      const réponse = await getConnecté();

      expect(réponse.body.réflexesCyber.réalisé).toBe(true);
    });

    it('indique que le test réflexes cyber n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.réflexesCyber.réalisé).toBe(false);
    });
  });
});
