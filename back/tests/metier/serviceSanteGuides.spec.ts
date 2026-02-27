import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import {
  AdaptateurCellar,
  CleDuBucket,
} from '../../src/infra/adaptateurCellar';
import {
  fabriqueServiceSanteGuides,
  ServiceSanteGuides,
} from '../../src/metier/serviceSanteGuides';
import { guideDevsecops, guideZeroTrust } from '../api/objetsPretsALEmploi';

describe('Le service de calcul de la santé des guildes', () => {
  let serviceSanteGuides: ServiceSanteGuides;
  let mockAdaptateurCellar: AdaptateurCellar;

  beforeEach(() => {
    const erreur = () => {
      throw new Error();
    };
    mockAdaptateurCellar = {
      get: erreur,
      getStream: erreur,
      existe: async () => true,
    };
    serviceSanteGuides = fabriqueServiceSanteGuides(mockAdaptateurCellar);
  });

  it('retourne les guides en bonne santé', async () => {
    const sante = await serviceSanteGuides.calculeSante([guideZeroTrust()]);

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

  it('peut retourner plusieurs guides en bonne santé', async () => {
    const sante = await serviceSanteGuides.calculeSante([
      guideZeroTrust(),
      guideDevsecops(),
    ]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    assert.equal(guidesEnBonneSante.length, 2);
    assert.equal(guidesEnBonneSante[1].id, 'devsecops');
  });

  it('retourne la santé de tous les documents', async () => {
    const guideAvecPlusieursDocuments = guideZeroTrust();
    guideAvecPlusieursDocuments.documents = [
      { libelle: '', nomFichier: 'doc1.pdf' },
      { libelle: '', nomFichier: 'doc2.pdf' },
    ];

    const sante = await serviceSanteGuides.calculeSante([
      guideAvecPlusieursDocuments,
    ]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    assert.equal(guidesEnBonneSante[0].documents.length, 2);
    assert.equal(guidesEnBonneSante[0].documents[0].nom, 'doc1.pdf');
    assert.equal(guidesEnBonneSante[0].documents[1].nom, 'doc2.pdf');
  });

  it('indique si un guide a un document manquant', async () => {
    mockAdaptateurCellar.existe = async (
      nomFichier: string,
      cleDuBucket: CleDuBucket
    ) => {
      return nomFichier === 'doc1.pdf' && cleDuBucket === 'GUIDES';
    };

    const guideAvecPlusieursDocuments = guideZeroTrust();
    guideAvecPlusieursDocuments.documents = [
      { libelle: '', nomFichier: 'doc1.pdf' },
      { libelle: '', nomFichier: 'doc2.pdf' },
    ];

    const sante = await serviceSanteGuides.calculeSante([
      guideAvecPlusieursDocuments,
    ]);

    assert.equal(sante.guidesEnBonneSante.length, 0);
    assert.equal(sante.guidesAvecProbleme.length, 1);
    const santeDocumentGuides = sante.guidesAvecProbleme[0].documents;
    assert.equal(santeDocumentGuides[0].etat, 'ok');
    assert.equal(santeDocumentGuides[1].etat, 'ko');
  });
});
