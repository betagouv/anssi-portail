import { type Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntrepotUtilisateur } from '@metier/entrepotUtilisateur.js';
import { creeServeur } from '@api/msc/index.js';
import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurHorloge, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource du rappel de mise à jour de l'inventaire des composants obsolètes", () => {
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
      const ressource = request(serveur).get('/api/outils/rappel-mise-a-jour-inventaire-composants-obsoletes.ics');
      return mode === 'connecté'
        ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
        : ressource;
    };

    it('sers un fichier au format ics', async () => {
      const { headers } = await récupèrelÉvènement();

      expect(headers['content-type']).toBe('text/calendar; charset=utf-8');
      expect(headers['content-disposition']).toBe(
        'attachment; filename=rappel-mise-a-jour-inventaire-composants-obsoletes.ics'
      );
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
      expect(lignes[8]).toBe("SUMMARY:MesServicesCyber - Revoir l'inventaire des composants obsolètes");
      expect(lignes[12]).toBe("DESCRIPTION:Vérifier que l'inventaire des composants obsolètes est à jour :");
      expect(lignes[13]).toBe('\t nouveaux composants\\, statuts\\, mesures de compensation et échéances de r');
      expect(lignes[14]).toBe('\templacement.\\n\\n- Retrouvez le modèle et la mesure sur MesServicesCyber : ');
      expect(lignes[15]).toBe('\thttps://messervices.cyber.gouv.fr');
      expect(lignes[16]).toBe('RRULE:FREQ=YEARLY');
      expect(lignes[17]).toBe('BEGIN:VALARM');
      expect(lignes[18]).toBe('ACTION:DISPLAY');
      expect(lignes[19]).toBe("DESCRIPTION:Rappel : revoir l'inventaire des composants obsolètes");
      expect(lignes[20]).toBe('TRIGGER:-PT');
      expect(lignes[21]).toBe('END:VALARM');
      expect(lignes[22]).toBe('END:VEVENT');
      expect(lignes[23]).toBe('END:VCALENDAR');
    });
  });
});
