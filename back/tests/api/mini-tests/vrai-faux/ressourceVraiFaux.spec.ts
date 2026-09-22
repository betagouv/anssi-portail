import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../../src/api/msc.js';
import { EntrepôtQuestionVraieFausseMémoire } from '../../../persistance/entrepotQuestionVraieFausseMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { questionVraieFaussePME } from '../../objetsPretsALEmploi.js';

describe('La ressource du questionnaire Vrai-Faux', () => {
  let serveur: Express;
  let entrepôtQuestionVraieFausseMémoire: EntrepôtQuestionVraieFausseMémoire;

  beforeEach(() => {
    entrepôtQuestionVraieFausseMémoire = new EntrepôtQuestionVraieFausseMémoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepôtQuestionVraieFausse: entrepôtQuestionVraieFausseMémoire,
    });
  });
  describe('sur une requête GET', () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/api/mini-tests/vrai-faux');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('retourne une liste de questions', async () => {
      await entrepôtQuestionVraieFausseMémoire.ajoute(questionVraieFaussePME);

      const reponse = await request(serveur).get('/api/mini-tests/vrai-faux');

      expect(reponse.body).toHaveLength(1);
      expect(reponse.body[0].idQuestion).toBe('idQuestion1');
      expect(reponse.body[0].idéeReçue.emoji).toBe('🏢');
      expect(reponse.body[0].idéeReçue.texte).toBe(
        'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.'
      );
      expect(reponse.body[0].réponse).toBe(
        'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.'
      );
      expect(reponse.body[0].explications[0]).toBe('Les PME, TPE et ETI sont la catégorie la plus touchée.');
      expect(reponse.body[0].explications[1]).toBe(
        "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 48 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste."
      );

      expect(reponse.body[0].source).toBe('ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.');
      expect(reponse.body[0].idéeReçueEstVraie).toBe(false);
    });
  });
});
