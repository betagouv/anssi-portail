import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { TestExpositionRéalisé } from '../../../../src/bus/evenements/TestExpositionRealise.js';
import { EntrepotUtilisateur } from '../../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';

describe('La ressource des tests d’exposition', () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;
  const corpsParDéfaut = { typeOrganisation: 'collectivite', secteur: 'sante', facteursAggravant: [] };

  beforeEach(async () => {
    busEvenements = new MockBusEvenement();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/exposition/tests').send(corpsParDéfaut);

      assert.equal(réponse.status, HttpStatusCode.Created);
    });

    it('émet un événement sur le bus', async () => {
      await request(serveur).post('/api/mini-tests/exposition/tests').send(corpsParDéfaut);

      assert(busEvenements.aRecuUnEvenement(TestExpositionRéalisé));
    });

    it('trace les réponses', async () => {
      await request(serveur)
        .post('/api/mini-tests/exposition/tests')
        .send({
          typeOrganisation: 'association',
          secteur: 'energie',
          facteursAggravant: ['subco', 'rd'],
        });

      const événement = busEvenements.recupereEvenement(TestExpositionRéalisé);
      assert.notEqual(événement, undefined);
      assert.deepEqual(événement, {
        typeOrganisation: 'association',
        secteur: 'energie',
        facteursAggravant: ['subco', 'rd'],
        email: undefined,
        codeRegion: undefined,
        codeSecteur: undefined,
        codeTrancheEffectif: undefined,
      });
    });

    describe('venant d’un utilisateur connu', () => {
      let cookie: string;

      beforeEach(() => {
        cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      });

      it('enrichit l’événement avec les données utilisateur', async () => {
        await request(serveur).post('/api/mini-tests/exposition/tests').set('Cookie', [cookie]).send(corpsParDéfaut);

        const événement = busEvenements.recupereEvenement(TestExpositionRéalisé);
        assert.equal(événement?.email, 'jeanne.dupont@user.com');
        assert.equal(événement?.codeSecteur, 'A');
        assert.equal(événement?.codeRegion, 'FR-971');
        assert.equal(événement?.codeTrancheEffectif, '11');
      });
    });

    describe('répond un 400', () => {
      it('si un type d’organisation est inconnu', async () => {
        const reponse = await request(serveur).post('/api/mini-tests/exposition/tests').send({
          typeOrganisation: 'inconnu',
          secteur: 'energie',
          facteursAggravant: [],
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it('si un secteur est inconnu', async () => {
        const reponse = await request(serveur).post('/api/mini-tests/exposition/tests').send({
          typeOrganisation: 'grand-groupe',
          secteur: 'inconnu',
          facteursAggravant: [],
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it('si un facteur aggravant est inconnu', async () => {
        const reponse = await request(serveur)
          .post('/api/mini-tests/exposition/tests')
          .send({
            typeOrganisation: 'grand-groupe',
            secteur: 'sante',
            facteursAggravant: ['inconnu'],
          });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });
    });
  });
});
