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

describe('La ressource du rappel de mise à jour de la liste des prestataires et fournisseurs', () => {
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
      const ressource = request(serveur).get('/api/outils/rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics');
      return mode === 'connecté'
        ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
        : ressource;
    };

    it('sers un fichier au format ics', async () => {
      const { headers } = await récupèrelÉvènement();

      expect(headers['content-type']).toBe('text/calendar; charset=utf-8');
      expect(headers['content-disposition']).toBe(
        'attachment; filename=rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics'
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
      expect(lignes[8]).toBe('SUMMARY:MesServicesCyber - Mettre à jour la liste des prestataires et fourn');
      expect(lignes[9]).toBe('\tisseurs');
      expect(lignes[13]).toBe('DESCRIPTION:Il y a un an\\, vous avez constitué la liste de vos prestataires');
      expect(lignes[14]).toBe("\t et fournisseurs informatiques avec leurs coordonnées. En cas d'incident\\,");
      expect(lignes[15]).toBe("\t c'est cette liste qui vous permettra de joindre rapidement les bonnes per");
      expect(lignes[16]).toBe("\tsonnes.\\n\\nPour qu'elle reste fiable\\, prenez quelques minutes pour la vér");
      expect(lignes[17]).toBe('\tifier :\\n\\n- Vos prestataires et fournisseurs ont-ils changé (nouveau pres');
      expect(lignes[18]).toBe('\ttataire\\, fin de contrat) ?\\n\\n- Les contacts opérationnels et les contact');
      expect(lignes[19]).toBe('\ts de secours sont-ils toujours les mêmes (départ\\, arrivée\\, changement de');
      expect(lignes[20]).toBe("\t poste) ?\\n\\n- Les numéros de téléphone\\, adresses e-mail et modalités d'a");
      expect(lignes[21]).toBe('\tstreinte sont-ils toujours valides ?\\n\\nPensez ensuite à dater la nouvelle');
      expect(lignes[22]).toBe('\t version et à remplacer les anciens exemplaires\\, y compris ceux conservés');
      expect(lignes[23]).toBe('\t hors du bureau.\\n\\n- Retrouvez le modèle et la mesure sur MesServicesCybe');
      expect(lignes[24]).toBe('\tr : https://messervices.cyber.gouv.fr');
      expect(lignes[25]).toBe('RRULE:FREQ=YEARLY');
      expect(lignes[26]).toBe('BEGIN:VALARM');
      expect(lignes[27]).toBe('ACTION:DISPLAY');
      expect(lignes[28]).toBe('DESCRIPTION:RAPPEL : mettre à jour la liste de vos prestataires et fourniss');
      expect(lignes[29]).toBe('\teurs');
      expect(lignes[30]).toBe('TRIGGER:-PT');
      expect(lignes[31]).toBe('END:VALARM');
      expect(lignes[32]).toBe('END:VEVENT');
      expect(lignes[33]).toBe('END:VCALENDAR');
    });
  });
});
