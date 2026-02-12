import fs from 'node:fs';
import { ConsignateurDeComparaisonDeGuides } from './infrastructure/consignateurDeComparaisonDeGuides';
import { ComparateurDeGuides } from './metier/guides/comparateurDeGuides';
import { Guide } from './metier/guides/guide.type';

const summaryFile = process.env.GITHUB_STEP_SUMMARY ?? 'rapport-guides.md';

// Pour tester le temps du dévelppement
const guideZeroTrust: Guide = {
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

const comparateurDeGuides = new ComparateurDeGuides(
  {
    tous: async () => [guideZeroTrust],
  },
  {
    tous: async () => [],
  }
);

await comparateurDeGuides.chargeLesDonnees();
const comparaison = comparateurDeGuides.compare();

const consignateurDeComparaisonDeGuides =
  new ConsignateurDeComparaisonDeGuides();

const markdown =
  consignateurDeComparaisonDeGuides.consigneComparaison(comparaison);

fs.appendFileSync(summaryFile, markdown);
