import { beforeEach, describe, it, expect } from 'vitest';
import { AdaptateurCellar, CleDuBucket } from '../../src/infra/adaptateurCellar.js';
import { fabriqueServiceSanteGuides, ServiceSanteGuides } from '../../src/metier/serviceSanteGuides.js';
import { fauxAdaptateurCellar } from '../api/fauxObjets.js';
import { guideDevsecops, guideZeroTrust } from '../api/objetsPretsALEmploi.js';

describe('Le service de calcul de la santé des guildes', () => {
  let serviceSanteGuides: ServiceSanteGuides;
  let mockAdaptateurCellar: AdaptateurCellar;

  beforeEach(() => {
    mockAdaptateurCellar = {
      ...fauxAdaptateurCellar,
      existe: async () => true,
    };
    serviceSanteGuides = fabriqueServiceSanteGuides(mockAdaptateurCellar);
  });

  it('retourne les guides en bonne santé', async () => {
    const sante = await serviceSanteGuides.calculeSante([guideZeroTrust()]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    expect(guidesEnBonneSante).toHaveLength(1);
    expect(guidesEnBonneSante[0].id).toBe('zero-trust');
    expect(guidesEnBonneSante[0].documents).toEqual([{ nom: 'anssi-fondamentaux-zero-trust-v1.0.pdf', etat: 'ok' }]);
    expect(guidesEnBonneSante[0].images).toEqual({
      '588': 'ok',
      origine: 'ok',
    });
  });

  it('peut retourner plusieurs guides en bonne santé', async () => {
    const sante = await serviceSanteGuides.calculeSante([guideZeroTrust(), guideDevsecops()]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    expect(guidesEnBonneSante).toHaveLength(2);
    expect(guidesEnBonneSante[1].id).toBe('devsecops');
  });

  it('retourne la santé de tous les documents', async () => {
    const guideAvecPlusieursDocuments = guideZeroTrust();
    guideAvecPlusieursDocuments.listeDocuments = [
      { libelle: '', nomFichier: 'doc1.pdf' },
      { libelle: '', nomFichier: 'doc2.pdf' },
    ];

    const sante = await serviceSanteGuides.calculeSante([guideAvecPlusieursDocuments]);

    const guidesEnBonneSante = sante.guidesEnBonneSante;
    expect(guidesEnBonneSante[0].documents).toHaveLength(2);
    expect(guidesEnBonneSante[0].documents[0].nom).toBe('doc1.pdf');
    expect(guidesEnBonneSante[0].documents[1].nom).toBe('doc2.pdf');
  });

  it('indique si un guide a un document manquant', async () => {
    mockAdaptateurCellar.existe = async (nomFichier: string, cleDuBucket: CleDuBucket) => {
      return nomFichier === 'doc1.pdf' && cleDuBucket === 'GUIDES';
    };

    const guideAvecPlusieursDocuments = guideZeroTrust();
    guideAvecPlusieursDocuments.listeDocuments = [
      { libelle: '', nomFichier: 'doc1.pdf' },
      { libelle: '', nomFichier: 'doc2.pdf' },
    ];

    const sante = await serviceSanteGuides.calculeSante([guideAvecPlusieursDocuments]);

    expect(sante.guidesEnBonneSante).toHaveLength(0);
    expect(sante.guidesAvecProbleme).toHaveLength(1);
    const santeDocumentGuides = sante.guidesAvecProbleme[0].documents;
    expect(santeDocumentGuides[0].etat).toBe('ok');
    expect(santeDocumentGuides[1].etat).toBe('ko');
  });

  it("inspecte l'etat des images", async () => {
    mockAdaptateurCellar.existe = async (nomFichier: string, cleDuBucket: CleDuBucket) =>
      ['zero-trust/origine.avif', 'anssi-fondamentaux-zero-trust-v1.0.pdf'].includes(nomFichier) &&
      cleDuBucket === 'GUIDES';

    const sante = await serviceSanteGuides.calculeSante([guideZeroTrust()]);

    expect(sante.guidesEnBonneSante).toHaveLength(0);
    expect(sante.guidesAvecProbleme).toHaveLength(1);
    const santeImages = sante.guidesAvecProbleme[0].images;
    expect(santeImages.origine).toBe('ok');
    expect(santeImages['588']).toBe('ko');
  });
});
