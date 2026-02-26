import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import {
  fabriqueServiceSanteGuides,
  ServiceSanteGuides,
} from '../../src/metier/serviceSanteGuides';
import { guideDevsecops, guideZeroTrust } from '../api/objetsPretsALEmploi';

describe('Le service de calcul de la santé des guildes', () => {
  let serviceSanteGuides: ServiceSanteGuides;

  beforeEach(() => {
    serviceSanteGuides = fabriqueServiceSanteGuides();
  });
  it('retourne les guides en bonne santé', () => {
    const sante = serviceSanteGuides.calculeSante([guideZeroTrust()]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    assert.equal(guidesEnBonneSante.length, 1);
    assert.equal(guidesEnBonneSante[0].id, 'zero-trust');
    assert.deepEqual(guidesEnBonneSante[0].documents, [
      { nom: 'anssi-fondamentaux-zero-trust-v1.0.pdf', etat: 'ok' },
    ]);
    assert.deepEqual(guidesEnBonneSante[0].images, {
      '234': 'ok',
      '588': 'ok',
      origine: 'ok',
    });
  });

  it('peut retourner plusieurs guides en bonne santé', () => {
    const sante = serviceSanteGuides.calculeSante([
      guideZeroTrust(),
      guideDevsecops(),
    ]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    assert.equal(guidesEnBonneSante.length, 2);
    assert.equal(guidesEnBonneSante[1].id, 'devsecops');
  });

  it('retourne la santé de tous les documents', () => {
    const guideAvecPlusieursDocuments = guideZeroTrust();
    guideAvecPlusieursDocuments.documents = [
      { libelle: '', nomFichier: 'doc1.pdf' },
      { libelle: '', nomFichier: 'doc2.pdf' },
    ];

    const sante = serviceSanteGuides.calculeSante([
      guideAvecPlusieursDocuments,
    ]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    assert.equal(guidesEnBonneSante[0].documents.length, 2);
    assert.equal(guidesEnBonneSante[0].documents[0].nom, 'doc1.pdf');
    assert.equal(guidesEnBonneSante[0].documents[1].nom, 'doc2.pdf');
  });
});
