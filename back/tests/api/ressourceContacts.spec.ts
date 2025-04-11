import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur, fauxMiddleware } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { randomUUID } from 'node:crypto';
import { Utilisateur } from '../../src/metier/utilisateur';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';

describe('La ressource Contacts', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
      middleware: fauxMiddleware,
    });
  });

  describe('sur demande GET', () => {
    it('utilise le middleware de verification de JWT', async () => {
      let middelwareAppele = false;
      serveur = creeServeur({
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

    it("renvoie une 404 si les informations de l'utilisateur ne sont pas disponibles dans l'entrepot utilisateur", async () => {
      entrepotUtilisateur.parEmail = async () => undefined;

      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.status, 404);
    });

    it("récupère les informations de l'utilisateur via l'entrepot utilisateur", async () => {
      let entrepotAppele;
      entrepotUtilisateur.parEmail = async () => {
        entrepotAppele = true;
        return undefined;
      };

      await request(serveur).get('/api/contacts');

      assert.equal(entrepotAppele, true);
    });

    it('retourne les informations de contacts', async () => {
      const rechercheEntreprise: AdaptateurRechercheEntreprise = {
        rechercheOrganisations: async (_: string, __: string | null) => [
          { siret: '', departement: '75', nom: '' },
        ],
      };
      entrepotUtilisateur.parEmail = async () =>
        new Utilisateur(
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
      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.body.CSIRT.nom, 'Urgence Cyber Île-de-France');
    });
  });
});
