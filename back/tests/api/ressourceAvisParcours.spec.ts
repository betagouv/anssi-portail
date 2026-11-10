import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { AvisParcoursDonné } from '../../src/bus/evenements/avisParcoursDonne.js';
import { AvisParcours, MessagerieInstantanee } from '../../src/metier/messagerieInstantanee.js';
import { MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from './cookie.js';
import { configurationDeTestDuServeur, fausseMessagerieInstantanee, fauxRapporteur } from './fauxObjets.js';
import { utilisateurDeTest } from './mesures/constructeurDUtilisateur.js';

describe('La ressource avis parcours', () => {
  let serveur: Express;
  let messagerieInstantanee: MessagerieInstantanee;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  const avisParcoursValide = {
    niveauDUtilité: 2,
    recommandationAutreOrganisation: 'oui',
    commentaireAmélioration: 'Super',
    souhaiteÊtreRecontacté: true,
  };
  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
    };
    busEvenements = new MockBusEvenement(fauxRapporteur);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      messagerieInstantanee,
      entrepotUtilisateur,
    });
  });

  describe('sur demande POST', () => {
    const cookie = encodeSession({ email: 'jeanne.dupont@mail.com', token: 'valide' });
    it("retourne une erreur 401 si l'utilisateur n'est pas connecté", async () => {
      const réponse = await request(serveur).post('/api/avis-parcours').send({
        niveauDUtilité: 1,
      });

      expect(réponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    describe('retourne une erreur 400', () => {
      const avisValide = {
        niveauDUtilité: 3,
        recommandationAutreOrganisation: 'oui',
        commentaireAmélioration: 'Bonjour !',
        souhaiteÊtreRecontacté: true,
      };

      const posteUnAvisParcours = (corps: object | string) =>
        request(serveur).post('/api/avis-parcours').set('Cookie', cookie).send(corps);

      const sansChamp = (champ: keyof typeof avisValide) => {
        const { [champ]: _, ...reste } = avisValide;
        return reste;
      };

      it.each([
        ['niveauDUtilité', 'absent'],
        ['recommandationAutreOrganisation', 'absente'],
        ['commentaireAmélioration', 'absent'],
        ['souhaiteÊtreRecontacté', 'absent'],
      ] as [keyof typeof avisValide, string][])('si le champ %s est %s', async (champ) => {
        const réponse = await posteUnAvisParcours(sansChamp(champ));

        expect(réponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it.each([0, 6, 2.5, '3', null])("si le niveau d'utilité est invalide (%s)", async (niveauDUtilité) => {
        const réponse = await posteUnAvisParcours({ ...avisValide, niveauDUtilité });

        expect(réponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it.each(['toujours', '', 'OUI', true, null])(
        'si la recommandation à une autre organisation est invalide (%s)',
        async (recommandationAutreOrganisation) => {
          const réponse = await posteUnAvisParcours({ ...avisValide, recommandationAutreOrganisation });

          expect(réponse.status).toBe(HttpStatusCode.BadRequest);
        }
      );

      it.each([
        ['vide', ''],
        ['trop long', 'a'.repeat(8 * 1024 + 1)],
        ['pas une chaîne', 42],
      ])('si le commentaire d’amélioration est %s', async (_, commentaireAmélioration) => {
        const réponse = await posteUnAvisParcours({ ...avisValide, commentaireAmélioration });

        expect(réponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it.each(['oui', 'true', 1, null])(
        'si le souhait d’être recontacté n’est pas un booléen (%s)',
        async (souhaiteÊtreRecontacté) => {
          const réponse = await posteUnAvisParcours({ ...avisValide, souhaiteÊtreRecontacté });

          expect(réponse.status).toBe(HttpStatusCode.BadRequest);
        }
      );

      it('si le corps contient un champ inconnu', async () => {
        const réponse = await posteUnAvisParcours({ ...avisValide, champInconnu: 'valeur' });

        expect(réponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('si le corps est vide', async () => {
        const réponse = await posteUnAvisParcours({});

        expect(réponse.status).toBe(HttpStatusCode.BadRequest);
      });
    });

    it("retourne une erreur 500 si l'utilisateur n'a pas de parcours", async () => {
      const utilisateurSansParcours = utilisateurDeTest().avecLEmail('test@yopmail.com').construis();
      const cookie = encodeSession({ email: utilisateurSansParcours.email, token: 'valide' });
      const réponse = await request(serveur).post('/api/avis-parcours').set('Cookie', cookie).send(avisParcoursValide);

      expect(réponse.statusCode).toEqual(HttpStatusCode.InternalServerError);
    });

    it('envoie les données à la messagerie instantannée', async () => {
      const utilisateurAvecParcours = utilisateurDeTest().avecLEmail('utilisateurParcours@yopmail.com').construis();
      await entrepotUtilisateur.ajoute(utilisateurAvecParcours);
      await utilisateurAvecParcours.rejoinsParcours('complet', busEvenements, 'visite-page-mesure');
      const cookie = encodeSession({ email: utilisateurAvecParcours.email, token: 'valide' });

      let avisParcoursEnvoyé: AvisParcours | undefined;
      messagerieInstantanee.notifieUnAvisParcours = async (avisParcours: AvisParcours) => {
        avisParcoursEnvoyé = avisParcours;
      };

      await request(serveur).post('/api/avis-parcours').set('Cookie', cookie).send(avisParcoursValide);

      expect(avisParcoursEnvoyé).toEqual({
        niveauDUtilité: 2,
        recommandationAutreOrganisation: 'oui',
        commentaireAmélioration: 'Super',
        souhaiteÊtreRecontacté: true,
        parcours: 'complet',
        emailDeContact: 'utilisateurParcours@yopmail.com',
        pageSource: undefined,
      });
    });

    it('publie un évènement sur le bus', async () => {
      const utilisateurAvecParcours = utilisateurDeTest().avecLEmail('utilisateurParcours2@yopmail.com').construis();
      await utilisateurAvecParcours.rejoinsParcours('complet', busEvenements, 'visite-page-mesure');
      await entrepotUtilisateur.ajoute(utilisateurAvecParcours);
      const cookie = encodeSession({ email: utilisateurAvecParcours.email, token: 'valide' });

      const réponse = await request(serveur).post('/api/avis-parcours').set('Cookie', cookie).send(avisParcoursValide);

      expect(réponse.statusCode).toBe(HttpStatusCode.Created);
      const evenement = busEvenements.recupereEvenement(AvisParcoursDonné);

      expect(evenement).toEqual({
        niveauDUtilité: 2,
        recommandationAutreOrganisation: 'oui',
        commentaireAmélioration: 'Super',
        souhaiteÊtreRecontacté: true,
        parcours: 'complet',
        emailDeContact: 'utilisateurParcours2@yopmail.com',
        pageSource: undefined,
      });
    });

    it('envoie la page source à la messagerie instantanée', async () => {
      const utilisateurAvecParcours = utilisateurDeTest().avecLEmail('utilisateurParcours@yopmail.com').construis();
      await entrepotUtilisateur.ajoute(utilisateurAvecParcours);
      await utilisateurAvecParcours.rejoinsParcours('complet', busEvenements, 'visite-page-mesure');
      const cookieAvecParcours = encodeSession({ email: utilisateurAvecParcours.email, token: 'valide' });
      let avisParcoursEnvoyé: AvisParcours | undefined;
      messagerieInstantanee.notifieUnAvisParcours = async (avisParcours: AvisParcours) => {
        avisParcoursEnvoyé = avisParcours;
      };

      await request(serveur)
        .post('/api/avis-parcours?pageSource=/mesures/CRISE.8')
        .set('Cookie', cookieAvecParcours)
        .send(avisParcoursValide);

      expect(avisParcoursEnvoyé!.pageSource).toBe('/mesures/CRISE.8');
    });
  });
});
