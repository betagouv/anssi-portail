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

describe("La ressource du rappel de mise à jour de l'annuaire des contacts", () => {
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
      const ressource = request(serveur).get('/api/outils/rappel-mise-a-jour-annuaire-contacts.ics');
      return mode === 'connecté'
        ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
        : ressource;
    };

    it('sers un fichier au format ics', async () => {
      const { headers } = await récupèrelÉvènement();

      expect(headers['content-type']).toBe('text/calendar; charset=utf-8');
      expect(headers['content-disposition']).toBe('attachment; filename=rappel-mise-a-jour-annuaire-contacts.ics');
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
      expect(lignes[8]).toBe("SUMMARY:MesServicesCyber - Mettre à jour l'annuaire de contacts en cas de c");
      expect(lignes[9]).toBe('\trise cyber');
      expect(lignes[13]).toBe('DESCRIPTION:Il y a un an\\, vous avez constitué votre annuaire de crise cybe');
      expect(lignes[14]).toBe("\tr. En cas d'attaque\\, c'est ce document\\, imprimé et lisible sans réseau\\,");
      expect(lignes[15]).toBe('\t qui vous permettra de joindre les bonnes personnes rapidement.\\n\\nPour qu');
      expect(lignes[16]).toBe("\t'il reste fiable\\, prenez quelques minutes pour le vérifier :\\n\\n- Les per");
      expect(lignes[17]).toBe('\tsonnes ont-elles changé (départ\\, arrivée\\, changement de poste) ?\\n\\n- Vo');
      expect(lignes[18]).toBe('\ts prestataires et leurs contacts (informatique\\, hébergeur\\, assureur\\, ba');
      expect(lignes[19]).toBe('\tnque) sont-ils toujours les mêmes ?\\n\\n- Les numéros et adresses e-mail so');
      expect(lignes[20]).toBe('\tnt-ils toujours valides ?\\n\\n\\n\\nPensez ensuite à dater la nouvelle versio');
      expect(lignes[21]).toBe('\tn\\, à réimprimer le document et à remplacer les anciens exemplaires\\, y co');
      expect(lignes[22]).toBe('\tmpris ceux conservés hors du bureau.\\n\\n- Retrouvez le modèle et la mesure');
      expect(lignes[23]).toBe('\t sur MesServicesCyber : https://messervices.cyber.gouv.fr');
      expect(lignes[24]).toBe('RRULE:FREQ=YEARLY');
      expect(lignes[25]).toBe('BEGIN:VALARM');
      expect(lignes[26]).toBe('ACTION:DISPLAY');
      expect(lignes[27]).toBe("DESCRIPTION:RAPPEL : mettre à jour l'annuaire de contacts en cas de crise c");
      expect(lignes[28]).toBe('\tyber');
      expect(lignes[29]).toBe('TRIGGER:-PT');
      expect(lignes[30]).toBe('END:VALARM');
      expect(lignes[31]).toBe('END:VEVENT');
      expect(lignes[32]).toBe('END:VCALENDAR');
    });
  });
});
