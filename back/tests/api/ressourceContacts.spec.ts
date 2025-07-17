import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { Utilisateur } from '../../src/metier/utilisateur';
import { configurationDeTestDuServeur, fauxMiddleware } from './fauxObjets';
import { jeanneDupont } from './objetsPretsALEmploi';

describe('La ressource Contacts', () => {
  let middlewareAjouteUtilisateurARequeteAppele: boolean;

  beforeEach(() => {
    middlewareAjouteUtilisateurARequeteAppele = false;
  });

  const creeServeurAvecUtilisateur = (utilisateur: Utilisateur | undefined) =>
    creeServeur({
      ...configurationDeTestDuServeur,
      middleware: {
        ...fauxMiddleware,
        ajouteUtilisateurARequete: (_, __) => async (requete, __, suite) => {
          middlewareAjouteUtilisateurARequeteAppele = true;
          requete.utilisateur = utilisateur;
          suite();
        },
      },
    });

  describe('sur demande GET', () => {
    it('utilise le middleware de verification de JWT', async () => {
      let middelwareAppele = false;
      const serveur = creeServeur({
        ...configurationDeTestDuServeur,
        middleware: {
          ...fauxMiddleware,
          verifieJWT: async (_, __, suite) => {
            middelwareAppele = true;
            suite();
          },
        },
      });
      await request(serveur).get('/api/contacts');

      assert.equal(middelwareAppele, true);
    });

    it("renvoie une 404 si les informations de l'utilisateur ne sont pas disponibles dans la requete", async () => {
      const serveur = creeServeurAvecUtilisateur(undefined);

      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.status, 404);
    });

    it("récupère les informations de l'utilisateur via le middleware", async () => {
      const serveur = creeServeurAvecUtilisateur(jeanneDupont);

      await request(serveur).get('/api/contacts');

      assert.equal(middlewareAjouteUtilisateurARequeteAppele, true);
    });

    it('retourne les informations de contacts', async () => {
      const rechercheEntreprise: AdaptateurRechercheEntreprise = {
        rechercheOrganisations: async (_: string, __: string | null) => [
          {
            siret: '',
            departement: '75',
            nom: '',
            codeTrancheEffectif: '01',
            codeRegion: 'FR-ARA',
            codeSecteur: 'D',
          },
        ],
      };

      const jeanne = new Utilisateur(
        {
          email: 'jeanne.dupont@user.com',
          prenom: 'Jeanne',
          nom: 'Dupont',
          telephone: '0123456789',
          domainesSpecialite: ['RSSI'],
          siretEntite: '',
          cguAcceptees: true,
          infolettreAcceptee: true,
          idListeFavoris: randomUUID(),
        },
        rechercheEntreprise
      );
      const serveur = creeServeurAvecUtilisateur(jeanne);

      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.body.CSIRT.nom, 'Urgence Cyber Île-de-France');
    });
  });
});
