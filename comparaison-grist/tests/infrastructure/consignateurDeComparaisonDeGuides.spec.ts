import { describe, expect, it } from 'vitest';
import { ConsignateurDeComparaisonDeGuides } from '../../src/infrastructure/consignateurDeComparaisonDeGuides';
import { ComparaisonDeGuides, Guide } from '../../src/metier/guides/guide.type';

export const guideZeroTrust: Guide = {
  id: 'zero-trust',
  nom: 'Zero Trust',
  description:
    '<p>Avec l’accroissement des usages liés au télétravail, ...</p>',
  nomImage: 'anssi-fondamentaux-zero-trust-v1_publication',
  langue: 'FR',
  collections: ['Les essentiels'],
  documents: [
    {
      libelle: 'Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0',
      nomFichier: 'anssi-fondamentaux-zero-trust-v1.0.pdf',
    },
  ],
  dateMiseAJour: '20 Juin 2025',
  datePublication: '20 Juin 2025',
  thematique: 'Les essentiels',
  besoins: ['REAGIR', 'SE_FORMER'],
};

export const guideDevsecops: Guide = {
  id: 'devsecops',
  nom: 'DevSecOps',
  description:
    '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, ...</p>',
  nomImage: 'anssi_essentiels_devsecops_v1',
  langue: 'FR',
  collections: ['Les essentiels'],
  documents: [
    {
      libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
      nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
    },
  ],
  dateMiseAJour: '13 Mars 2024',
  datePublication: '13 Mars 2024',
  thematique: 'Les essentiels',
  besoins: ['SECURISER'],
};

describe('Le consignateur de comparaison de guides', () => {
  const prelude = `<table>
<thead>
<tr>
<th>Identifiant</th>
<th>Titre</th>
<th>Thématique</th>
<th>Date de publication</th>
<th>Date de mise à jour</th>
<th>Description</th>
<th>Image</th>
<th>Documents</th>
<th>Langue</th>
<th>Collections</th>
<th>Besoins</th>
</tr>
</thead>
<tbody>
`;
  const postlude = '</tbody>\n</table>';

  const consignateurDeComparaisonDeGuides =
    new ConsignateurDeComparaisonDeGuides();

  const comparaisonVide: ComparaisonDeGuides = {
    ajouts: [],
    suppressions: [],
    modifications: [],
  };

  it('sait initialiser la comparaison en Markdown', () => {
    const markdown =
      consignateurDeComparaisonDeGuides.consigneComparaison(comparaisonVide);

    expect(markdown).toEqual(prelude + postlude);
  });

  it('sait traduire les ajouts en Markdown', () => {
    const attendu =
      prelude +
      '<tr>\n' +
      '<td>\n\n' +
      '```diff\n+ zero-trust\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ Zero Trust\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ Les essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ 20 Juin 2025\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ 20 Juin 2025\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ <p>Avec l’accroissement des usages liés au télétravail, ...</p>\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ anssi-fondamentaux-zero-trust-v1_publication\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0 : anssi-fondamentaux-zero-trust-v1.0.pdf\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ FR\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ Les essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n+ REAGIR, SE_FORMER\n```\n</td>\n' +
      '</tr>\n' +
      postlude;

    const comparaison = {
      ...comparaisonVide,
      ajouts: [guideZeroTrust],
    };
    const markdown =
      consignateurDeComparaisonDeGuides.consigneComparaison(comparaison);

    expect(markdown).toEqual(attendu);
  });

  it('sait traduire les suppressions en Markdown', () => {
    const attendu =
      prelude +
      '<tr>\n' +
      '<td>\n\n' +
      '```diff\n- zero-trust\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Zero Trust\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Les essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- 20 Juin 2025\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- 20 Juin 2025\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- <p>Avec l’accroissement des usages liés au télétravail, ...</p>\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- anssi-fondamentaux-zero-trust-v1_publication\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0 : anssi-fondamentaux-zero-trust-v1.0.pdf\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- FR\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Les essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- REAGIR, SE_FORMER\n```\n</td>\n' +
      '</tr>\n' +
      postlude;
    const comparaison = {
      ...comparaisonVide,
      suppressions: [guideZeroTrust],
    };
    const markdown =
      consignateurDeComparaisonDeGuides.consigneComparaison(comparaison);

    expect(markdown).toEqual(attendu);
  });

  it('sait traduire les modifications en Markdown', () => {
    const attendu =
      prelude +
      '<tr>\n' +
      '<td>\n\n' +
      '```diff\nzero-trust\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Zero Trust\n+ DevSecOps\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\nLes essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- 20 Juin 2025\n+ 13 Mars 2024\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- 20 Juin 2025\n+ 13 Mars 2024\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- <p>Avec l’accroissement des usages liés au télétravail, ...</p>\n+ <p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, ...</p>\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- anssi-fondamentaux-zero-trust-v1_publication\n+ anssi_essentiels_devsecops_v1\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0 : anssi-fondamentaux-zero-trust-v1.0.pdf\n+ Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0 : anssi_essentiels_devsecops_v1.0.pdf\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\nFR\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\nLes essentiels\n```\n</td>\n' +
      '<td>\n\n' +
      '```diff\n- REAGIR, SE_FORMER\n+ SECURISER\n```\n</td>\n' +
      '</tr>\n' +
      postlude;
    const comparaison: ComparaisonDeGuides = {
      ...comparaisonVide,
      modifications: [
        {
          source: guideZeroTrust,
          cible: { ...guideDevsecops, id: guideZeroTrust.id },
        },
      ],
    };
    const markdown =
      consignateurDeComparaisonDeGuides.consigneComparaison(comparaison);

    expect(markdown).toEqual(attendu);
  });
});
