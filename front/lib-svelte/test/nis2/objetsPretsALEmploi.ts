import type {
  CyFun23Fonction,
  CyFun23NiveauAssurance,
  ExigenceCyFun23,
  ExigenceISO,
  ExigenceNis2,
} from '../../src/nis2/exigence.type';

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

export const exigenceCyFun23 = ({
  reference = 'ID.AM-1.1',
  fonction = 'Identifier',
  niveauAssurance = 'Basique',
  estMesureCle = false,
}: Partial<{
  reference: string;
  fonction: CyFun23Fonction;
  niveauAssurance: CyFun23NiveauAssurance;
  estMesureCle: boolean;
}> = {}): ExigenceCyFun23 => ({
  fonction,
  niveauAssurance,
  estMesureCle,
  reference,
  contenu: 'Un inventaire des actifs associés...',
  correspondance: {
    niveau: 'élevé',
    exigences: [],
    observations: '',
  },
});
