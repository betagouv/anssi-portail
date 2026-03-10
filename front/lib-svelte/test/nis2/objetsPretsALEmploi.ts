import type { ExigenceISO, ExigenceNis2 } from '../../src/nis2/exigence.type';

export const exigenceNIS2DeNiveauFaible = (): ExigenceNis2 => ({
  reference: 'EX-01',
  contenu: "Contenu de l'exigence 1",
  thematique: 'Gouvernance',
  objectifSecurite:
    "Objectif de sécurité 5: Maitrise des systèmes d'information",
  entitesCible: ['EntiteEssentielle'],
  correspondance: {
    niveau: 'faible',
    exigences: [],
    observations: '',
  },
});

export const exigenceNIS2DeNiveauEleve = (): ExigenceNis2 => ({
  reference: 'EX-02',
  contenu: "Contenu de l'exigence 2",
  thematique: 'Recensement',
  objectifSecurite: "Objectif de sécurité 3: Maîtrise de l'écosystème",
  entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
  correspondance: {
    niveau: 'élevé',
    exigences: [],
    observations: '',
  },
});

export const exigenceISODeNiveauEleve = (): ExigenceISO => ({
  norme: 'ISO 27001',
  chapitre: '5.1',
  reference: '5.1 EX-02',
  contenu: "Contenu de l'exigence 2",
  correspondance: {
    niveau: 'élevé',
    exigences: [],
    observations: '',
  },
});
