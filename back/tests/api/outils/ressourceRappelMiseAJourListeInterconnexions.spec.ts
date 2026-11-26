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
  });
});
