import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../../src/api/msc.js';
import { SimulationRéflexesCyberRéponseSoumise } from '../../../../src/bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { SimulationRéflexesCyberTerminé } from '../../../../src/bus/evenements/simulationReflexesCyberTermine.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';
import { encodeSession } from '../../cookie.js';

describe('La ressource des réponses à la simulation Réflexes Cyber', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;

  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
      entrepotUtilisateur,
    });
  });

  const posteUneRéponseValide = async () => {
    await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
      idCorrélation: 'idCorrélation',
      idScénario: 'entreprise',
      idRôle: 'direction',
      numéroÉvènement: 1,
      réflexe: 'bon',
    });
  };

  describe('sur une requête POST', () => {
    it('répond un 201', async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: 'idCorrélation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
      });

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it("répond une 400 si l'id scénario n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: 'idCorrélation',
        idScénario: 'mauvaisScénario',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it("répond une 400 si le numéro d'évènement n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: 'idCorrélation',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 1.5,
        réflexe: 'bon',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it("publie un événement lorsqu'une réponse est fournie", async () => {
      await posteUneRéponseValide();

      expect(busÉvénements.aRecuUnEvenement(SimulationRéflexesCyberRéponseSoumise)).toBeTruthy();
    });

    it('publie un événement de fin de simulation sur la dernière question', async () => {
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: 'idCorrélation',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
      });

      expect(busÉvénements.aRecuUnEvenement(SimulationRéflexesCyberTerminé)).toBeTruthy();
    });

    it("ne publie pas d'événement de fin de simulation si la réponse n'est pas la derniere", async () => {
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: 'idCorrélation',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 4,
        réflexe: 'bon',
      });

      expect(busÉvénements.naPasRecuDEvenement(SimulationRéflexesCyberTerminé)).toBeTruthy();
    });

    it("publie les informations de l’utilisateur si elles sont disponibles sur soumission d'une réponse", async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: 'idCorrélation',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 4,
        réflexe: 'bon',
      });

      const événement = busÉvénements.recupereEvenement(SimulationRéflexesCyberRéponseSoumise);

      expect(événement?.codeRegion).toBe('FR-971');
      expect(événement?.codeSecteur).toBe('A');
      expect(événement?.codeTrancheEffectif).toBe('11');
    });

    it('publie les informations de l’utilisateur si elles sont disponibles sur fin de simulation', async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: 'idCorrélation',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
      });

      const événement = busÉvénements.recupereEvenement(SimulationRéflexesCyberTerminé);

      expect(événement?.codeRegion).toBe('FR-971');
      expect(événement?.codeSecteur).toBe('A');
      expect(événement?.codeTrancheEffectif).toBe('11');
    });
  });
});
