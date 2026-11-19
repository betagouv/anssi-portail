import { HttpStatusCode } from '@anssi-portail/axios';
import { type Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { OutilTéléchargé } from '../../../src/bus/evenements/outilTelecharge.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurHorloge, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe('La ressource du rappel de mise à jour de la liste des interconnexions', () => {
  let serveur: Express;
  let adaptateurHorloge: AdaptateurHorloge;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement(fauxRapporteur);
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
    vi.stubEnv('TZ', 'UTC');
  });
  afterEach(async () => {
    vi.unstubAllEnvs();
  });

  describe('sur une requête GET', () => {
    const récupèrelÉvènement = async (mode: 'connecté' | 'non-connecté' = 'connecté') => {
      const ressource = request(serveur).get('/api/outils/rappel-mise-a-jour-liste-interconnexions.ics');
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
      expect(headers['content-disposition']).toBe('attachment; filename=rappel-mise-a-jour-liste-interconnexions.ics');
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
      expect(lignes[8]).toBe('SUMMARY:MesServicesCyber - Mettre à jour la liste des interconnexions du sy');
      expect(lignes[9]).toBe("\tstème d'information");
      expect(lignes[13]).toBe('DESCRIPTION:Il y a un an\\, vous avez dressé la liste des interconnexions de');
      expect(lignes[14]).toBe("\t votre système d'information avec les autres systèmes\\, avec un point de c");
      expect(lignes[15]).toBe("\tontact pour chacune. En cas d'incident\\, c'est cette liste qui vous permet");
      expect(lignes[16]).toBe('\ttra de savoir ce qui entre et sort de votre SI\\, et qui appeler.\\n\\nPour q');
      expect(lignes[17]).toBe("\tu'elle reste fiable\\, prenez quelques minutes pour la vérifier :\\n\\n- Des ");
      expect(lignes[18]).toBe('\tinterconnexions ont-elles été ajoutées\\, modifiées ou supprimées (VPN\\, se');
      expect(lignes[19]).toBe('\trvices en ligne\\, télémaintenance\\, flux avec des partenaires) ?\\n\\n- Les ');
      expect(lignes[20]).toBe('\tsystèmes concernés\\, des deux côtés\\, sont-ils toujours les mêmes ?\\n\\n- L');
      expect(lignes[21]).toBe('\tes points de contact opérationnels chez vos partenaires et prestataires so');
      expect(lignes[22]).toBe('\tnt-ils toujours valides ?\\n\\nPensez ensuite à dater la nouvelle version et');
      expect(lignes[23]).toBe('\t à remplacer les anciens exemplaires.\\n\\n- Retrouvez le modèle et la mesur');
      expect(lignes[24]).toBe('\te sur MesServicesCyber : https://messervices.cyber.gouv.fr');
      expect(lignes[25]).toBe('RRULE:FREQ=YEARLY');
      expect(lignes[26]).toBe('BEGIN:VALARM');
      expect(lignes[27]).toBe('ACTION:DISPLAY');
      expect(lignes[28]).toBe('DESCRIPTION:Rappel : mettre à jour la liste des interconnexions du système ');
      expect(lignes[29]).toBe("\td'information");
      expect(lignes[30]).toBe('TRIGGER:-PT');
      expect(lignes[31]).toBe('END:VALARM');
      expect(lignes[32]).toBe('END:VEVENT');
      expect(lignes[33]).toBe('END:VCALENDAR');
    });

    it('renvoi un évènement qui a lieu dans un an entre 9h et 9h30', async () => {
      adaptateurHorloge.maintenantZoné = () =>
        Temporal.Instant.from('2026-10-14T05:00:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId());

      const { text } = await récupèrelÉvènement();

      const lignes = text.split('\r\n');
      expect(lignes[11]).toBe('DTSTART:20271014T090000Z');
      expect(lignes[12]).toBe('DTEND:20271014T093000Z');
    });

    it.each([
      ['Europe/Paris', '20250228T080000Z', '20250228T083000Z'],
      ['America/Los_Angeles', '20250228T170000Z', '20250228T173000Z'],
    ])('calcule le rappel selon la date locale en année bissextile (%s)', async (fuseau, horaireDébut, horaireFin) => {
      vi.spyOn(Temporal.Now, 'timeZoneId').mockReturnValue(fuseau);
      adaptateurHorloge.maintenantZoné = () =>
        Temporal.Instant.from('2024-02-28T23:30:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId());

      const { text } = await récupèrelÉvènement();

      const lignes = text.split('\r\n');
      expect(lignes[11]).toBe(`DTSTART:${horaireDébut}`);
      expect(lignes[12]).toBe(`DTEND:${horaireFin}`);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await récupèrelÉvènement('non-connecté');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèrelÉvènement();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('rappel-mise-a-jour-liste-interconnexions.ics');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
