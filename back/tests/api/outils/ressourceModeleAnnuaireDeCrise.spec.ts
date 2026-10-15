import { HttpStatusCode } from '@anssi-portail/axios';
import { getCoordinate } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { getCellsInRow } from '@office-kit/xlsx/worksheet';
import { Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { OutilTéléchargé } from '../../../src/bus/evenements/outilTelecharge.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource du modèle de l'annuaire de crise", () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

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

  describe('sur une requête GET', () => {
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
    const récupèreModèle = async () =>
      request(serveur)
        .get('/api/outils/modele-annuaire-de-crise.xlsx')
        .set('Cookie', cookieJeanneDupont)
        .buffer(true)
        .parse((res, callback) => {
          const morceaux: Buffer[] = [];
          res.on('data', (morceau: Buffer) => morceaux.push(morceau));
          res.on('end', () => callback(null, Buffer.concat(morceaux)));
        });

    it('réponds 200', async () => {
      const { status } = await récupèreModèle();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu XLSX', async () => {
      const { headers } = await récupèreModèle();

      expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(headers['content-disposition']).toBe('attachment; filename="modele-annuaire-de-crise.xlsx"');
    });

    it('renvoie un fichier valide', async () => {
      const { body } = await récupèreModèle();

      expect(Buffer.isBuffer(body)).toBe(true);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await request(serveur).get('/api/outils/modele-annuaire-de-crise.xlsx');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèreModèle();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('Modèle_annuaire_crise');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });

    describe('contextualise le contenu', () => {
      const récupèreModeleExcel = async () => {
        const { body } = await récupèreModèle();

        const wb = await loadWorkbook(fromBuffer(body));
        const feuille = getSheetByIndex(wb, 0);
        if (!feuille) {
          throw Error('Feuille non définie !');
        }
        return feuille;
      };

      beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2018-11-17T10:11:12Z'));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('en changeant le nom de la feuille', async () => {
        const feuille = await récupèreModeleExcel();
        expect(feuille.title).toBe('Version du 17-11-2018');
      });

      it('en ajoutant les contacts nationaux', async () => {
        const premièreligneDesContactsNationnaux = 70;
        const deuxièmeLigneDesContactsNationaux = 71;

        const feuille = await récupèreModeleExcel();

        const [
          _entêteCERT,
          nomCERT,
          fonctionCERT,
          téléphoneCERT,
          emailCERT,
          emailDeSecoursCERT,
          _statusCERT,
          donnéesComplémentaireCERT,
        ] = getCellsInRow(feuille, premièreligneDesContactsNationnaux);

        const [
          _entêteCyber17,
          nomCyber17,
          fonctionCyber17,
          téléphoneCyber17,
          emailCyber17,
          emailDeSecoursCyber17,
          _statusCyber17,
          donnéesComplémentaireCyber17,
        ] = getCellsInRow(feuille, deuxièmeLigneDesContactsNationaux);

        expect(nomCERT.value).toBe('CERT-FR');
        expect(fonctionCERT.value).toBe('ANSSI');
        expect(téléphoneCERT.value).toBeNull();
        expect(emailCERT.value).toBeNull();
        expect(emailDeSecoursCERT.value).toBeNull();
        expect(donnéesComplémentaireCERT.value).toBe(
          'Toutes les coordonnées du CERT-FR - https://www.cert.ssi.gouv.fr/contact/'
        );

        expect(nomCyber17.value).toBe('17 Cyber');
        expect(fonctionCyber17.value).toBe('ANSSI');
        expect(téléphoneCyber17.value).toBeNull();
        expect(emailCyber17.value).toBeNull();
        expect(emailDeSecoursCyber17.value).toBeNull();
        expect(donnéesComplémentaireCyber17.value).toBe(
          'Aller sur le 17Cyber - https://www.cybermalveillance.gouv.fr/diagnostic'
        );

        expect(feuille.hyperlinks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ref: getCoordinate(donnéesComplémentaireCERT),
              target: 'https://www.cert.ssi.gouv.fr/contact/',
            }),
            expect.objectContaining({
              ref: getCoordinate(donnéesComplémentaireCyber17),
              target: 'https://www.cybermalveillance.gouv.fr/diagnostic',
            }),
          ])
        );
      });
    });
  });
});
