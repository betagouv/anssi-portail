import { readFile } from 'node:fs/promises';
import { cellValueAsString } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { iterCells, Worksheet } from '@office-kit/xlsx/worksheet';
import JSZip from 'jszip';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { creeServeur } from '@api/msc/index.js';
import { ServiceModèleCartographie } from '@api/outils/modeleCartographie/serviceModeleCartographie.js';
import { OutilTéléchargé } from '@bus/evenements/outilTelecharge.js';

import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { fabriqueAdaptateurHorloge } from '../../infra/adaptateurHorlogePourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

const outil = 'modele-cartographie.xlsx';
const url = `/api/outils/${outil}`;

describe('Le service du modèle de cartographie', () => {
  it('renomme uniquement la première feuille avec la date du jour', async () => {
    const service = new ServiceModèleCartographie(fauxFournisseurDeChemin, fabriqueAdaptateurHorloge('2018-11-17'));
    const fichier = await service.génèreModèle();
    const classeur = await loadWorkbook(fromBuffer(fichier));
    expect(getSheetByIndex(classeur, 0)?.title).toBe('Version du 17-11-2018');
    expect(getSheetByIndex(classeur, 1)?.title).toBe('Exemple');

    const modèle = await readFile(fauxFournisseurDeChemin.back.modèleCartographie());
    const classeurOriginal = await loadWorkbook(fromBuffer(modèle));
    const contenuDesCellules = (feuille: Worksheet) =>
      Array.from(iterCells(feuille), ({ row, col, value }) => [row, col, cellValueAsString(value)]);
    for (const position of [0, 1]) {
      const feuille = getSheetByIndex(classeur, position)!;
      const feuilleOriginale = getSheetByIndex(classeurOriginal, position)!;
      expect(contenuDesCellules(feuille)).toEqual(contenuDesCellules(feuilleOriginale));
    }

    const original = await JSZip.loadAsync(modèle);
    const résultat = await JSZip.loadAsync(fichier);
    const image = 'xl/media/image1.png';
    expect(await résultat.file(image)!.async('nodebuffer')).toEqual(await original.file(image)!.async('nodebuffer'));
  });
});

describe('La ressource du modèle de cartographie', () => {
  it('envoie le XLSX et publie le téléchargement pour un utilisateur connecté', async () => {
    const busEvenements = new MockBusEvenement(fauxRapporteur);
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    const serveur = creeServeur({ ...configurationDeTestDuServeur, busEvenements, entrepotUtilisateur });
    const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

    const { body, headers, status } = await request(serveur)
      .get(url)
      .set('Cookie', cookie)
      .buffer(true)
      .parse((réponse, callback) => {
        const morceaux: Buffer[] = [];
        réponse.on('data', (morceau: Buffer) => morceaux.push(morceau));
        réponse.on('end', () => callback(null, Buffer.concat(morceaux)));
      });

    expect(status).toBe(HttpStatusCode.Ok);
    expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(headers['content-disposition']).toBe(`attachment; filename=${outil}`);
    const classeur = await loadWorkbook(fromBuffer(body));
    expect(getSheetByIndex(classeur, 0)?.title).toMatch(/^Version du \d{2}-\d{2}-\d{4}$/);
    expect(busEvenements.recupereEvenement(OutilTéléchargé)).toMatchObject({ email: jeanneDupont.email, outil });
  });

  it('refuse un utilisateur non connecté', async () => {
    const { status } = await request(creeServeur(configurationDeTestDuServeur)).get(url);

    expect(status).toBe(HttpStatusCode.Unauthorized);
  });
});
