import { type Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { EntrepotUtilisateur } from '@metier/entrepotUtilisateur.js';
import { Outil } from '@metier/outils/outils.js';
import { creeServeur } from '@api/msc/index.js';
import { OutilTéléchargé } from '@bus/evenements/outilTelecharge.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe('La ressource générique de rappel ICS', () => {
  const outilsIcs = [
    'rappel-mise-a-jour-annuaire-contacts.ics',
    'rappel-mise-a-jour-liste-d-activites.ics',
    'rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics',
    'rappel-mise-a-jour-liste-interconnexions.ics',
    'rappel-mise-a-jour-inventaire-composants-obsoletes.ics',
  ] satisfies Outil[];

  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement(fauxRapporteur);
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({ ...configurationDeTestDuServeur, busEvenements, entrepotUtilisateur });
  });

  describe.each(outilsIcs)('sur une requête GET de %s', (outil) => {
    const récupère = (mode: 'connecté' | 'non-connecté' = 'connecté') => {
      const ressource = request(serveur).get(`/api/outils/${outil}`);
      return mode === 'connecté'
        ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
        : ressource;
    };

    it('réponds 200', async () => {
      const { status } = await récupère();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('sers un fichier au format ics nommé comme l’outil', async () => {
      const { headers } = await récupère();

      expect(headers['content-type']).toBe('text/calendar; charset=utf-8');
      expect(headers['content-disposition']).toBe(`attachment; filename=${outil}`);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await récupère('non-connecté');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupère();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe(outil);
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
