import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { EntrepotUtilisateur } from '@metier/entrepotUtilisateur.js';
import { creeServeur } from '@api/msc/index.js';
import { OutilTéléchargé } from '@bus/evenements/outilTelecharge.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe('La ressource du modèle de liste des prestataires et fournisseurs', () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement(fauxRapporteur);
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
        .get('/api/outils/modele-liste-prestataires-et-fournisseurs.xlsx')
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
      expect(headers['content-disposition']).toBe(
        'attachment; filename=modele-liste-prestataires-et-fournisseurs.xlsx'
      );
    });

    it('renvoie un fichier valide', async () => {
      const { body } = await récupèreModèle();

      const classeur = await loadWorkbook(fromBuffer(body));
      expect(getSheetByIndex(classeur, 0)?.title).toMatch(/^Version du \d{2}-\d{2}-\d{4}$/);
      expect(getSheetByIndex(classeur, 1)?.title).toBe('Exemple');
    });

    it('appelle le service de génération du modèle', async () => {
      const génèreModèle = vi.spyOn(
        configurationDeTestDuServeur.serviceModeleListePrestatairesEtFournisseurs,
        'génèreModèle'
      );

      await récupèreModèle();

      expect(génèreModèle).toHaveBeenCalledExactlyOnceWith();
      génèreModèle.mockRestore();
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await request(serveur).get('/api/outils/modele-liste-prestataires-et-fournisseurs.xlsx');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèreModèle();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('modele-liste-prestataires-et-fournisseurs.xlsx');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
