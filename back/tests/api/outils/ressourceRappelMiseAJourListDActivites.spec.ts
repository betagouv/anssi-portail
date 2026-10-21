import { HttpStatusCode } from '@anssi-portail/axios';
import { type Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { OutilTéléchargé } from '../../../src/bus/evenements/outilTelecharge.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurHorloge } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe('La ressource du rappel de mise à jour de la liste des activités', () => {
  let serveur: Express;
  let adaptateurHorloge: AdaptateurHorloge;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();

    await entrepotUtilisateur.ajoute(jeanneDupont);
    adaptateurHorloge = {
      ...fauxAdaptateurHorloge,
    };

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurHorloge,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('sur une requête GET', () => {
    const récupèrelÉvènement = async (mode: 'connecté' | 'non-connecté' = 'connecté') => {
      const ressource = request(serveur).get('/api/outils/rappel-mise-a-jour-liste-d-activites.ics');
      return mode === 'connecté'
        ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
        : ressource;
    };

    it('réponds 200', async () => {
      const { status } = await récupèrelÉvènement();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('sers un fichier au format ics', async () => {
      const { headers } = await récupèrelÉvènement();

      expect(headers['content-type']).toBe('text/calendar; charset=utf-8');
      expect(headers['content-disposition']).toBe('attachment; filename=rappel-mise-a-jour-liste-d-activites.ics');
    });

    it('renvoi un évènement calendrier', async () => {
      const { text } = await récupèrelÉvènement();

      const lignes = text.split('\r\n');
      expect(lignes[0]).toBe('BEGIN:VCALENDAR');
      expect(lignes[1]).toBe('VERSION:2.0');
      expect(lignes[2]).toBe('CALSCALE:GREGORIAN');
      expect(lignes[3]).toBe('PRODID:-//ANSSI//NONSGML MesServicesCyber//FR');
      expect(lignes[4]).toBe('METHOD:PUBLISH');
      expect(lignes[5]).toBe('X-PUBLISHED-TTL:PT1H');
      expect(lignes[6]).toBe('BEGIN:VEVENT');
      expect(lignes[8]).toBe("SUMMARY:MesServicesCyber - Mettre à jour la liste d'activités");
      expect(lignes[11]).toBe('DESCRIPTION:Il y a un an\\, vous avez recensé les activités et les systèmes ');
      expect(lignes[12]).toBe('\tà protéger en priorité. C’est ce document\\, tenu à jour\\, qui vous permet ');
      expect(lignes[13]).toBe('\tde savoir ce qui doit être sécurisé et remis en marche en premier en cas d');
      expect(lignes[14]).toBe('\t’attaque.\\n\\n\\n\\nPour qu’il reste fiable\\, prenez quelques minutes pour le');
      expect(lignes[15]).toBe('\t vérifier :\\n\\n- Les activités prioritaires sont-elles toujours les mêmes ');
      expect(lignes[16]).toBe('\t(nouvelle activité\\, activité arrêtée ou devenue critique) ?\\n\\n- Les resp');
      expect(lignes[17]).toBe('\tonsables de chaque activité ont-ils changé (départ\\, arrivée\\, changement ');
      expect(lignes[18]).toBe('\tde poste) ?\\n\\n- Les outils\\, logiciels\\, équipements et services numériqu');
      expect(lignes[19]).toBe('\tes utilisés sont-ils toujours les mêmes (nouvel outil\\, ancien serveur ou ');
      expect(lignes[20]).toBe('\téquipement oublié\\, changement de prestataire) ?\\n\\n\\n\\nPensez ensuite à d');
      expect(lignes[21]).toBe('\tater la nouvelle version et à remplacer l’ancienne\\, y compris les exempla');
      expect(lignes[22]).toBe('\tires partagés avec vos collaborateurs.\\n\\n\\n\\nRetrouvez le modèle et la me');
      expect(lignes[23]).toBe('\tsure sur MesServicesCyber : [https://messervicescyber.beta.gouv.fr](https:');
      expect(lignes[24]).toBe('\t//messervicescyber.beta.gouv.fr)');
      expect(lignes[25]).toBe('RRULE:FREQ=YEARLY');
      expect(lignes[26]).toBe('BEGIN:VALARM');
      expect(lignes[27]).toBe('ACTION:DISPLAY');
      expect(lignes[28]).toBe("DESCRIPTION:RAPPEL : mettre à jour la liste d'activités");
      expect(lignes[29]).toBe('TRIGGER:-PT');
      expect(lignes[30]).toBe('END:VALARM');
      expect(lignes[31]).toBe('END:VEVENT');
      expect(lignes[32]).toBe('END:VCALENDAR');
    });

    it('renvoi un évènement qui a lieu dans un an', async () => {
      adaptateurHorloge.maintenant = () => new Date('2026-10-14');

      const { text } = await récupèrelÉvènement();

      const lignes = text.split('\r\n');
      expect(lignes[10]).toBe('DTSTART;VALUE=DATE:20271014');
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await récupèrelÉvènement('non-connecté');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèrelÉvènement();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('rappel-mise-a-jour-liste-d-activites.ics');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
