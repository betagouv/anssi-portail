import { readFileSync } from 'node:fs';
import {
  PointsAttentionPrecis,
  ResultatEligibilite,
  ResumesPointsAttention,
} from '../../../../src/metier/nis2-simulateur/Regulation.definitions';

export const leCSV = (nom: string) => {
  const chemin = __dirname + '/csv/' + nom;
  return readFileSync(chemin).toString('utf-8');
};

export const leCSVDeProd = () => {
  const chemin = __dirname + '/../../../../src/metier/nis2-simulateur/questionnaire/specifications-completes.csv';
  return readFileSync(chemin).toString('utf-8');
};

export function reguleEE(
  resumes: ResumesPointsAttention[] = [],
  precisions: PointsAttentionPrecis[] = []
): ResultatEligibilite {
  return {
    regulation: 'Regule',
    typeEntite: 'EntiteEssentielle',
    pointsAttention: { resumes: resumes, precisions: precisions },
  };
}

export function reguleEI(
  resumes: ResumesPointsAttention[] = [],
  precisions: PointsAttentionPrecis[] = []
): ResultatEligibilite {
  return {
    regulation: 'Regule',
    typeEntite: 'EntiteImportante',
    pointsAttention: { resumes: resumes, precisions: precisions },
  };
}

export function reguleSansPrecision(): ResultatEligibilite {
  return {
    regulation: 'Regule',
    typeEntite: 'AutreEtatMembreUE',
    pointsAttention: { resumes: [], precisions: [] },
  };
}

export function reguleEnregistrementSeul(): ResultatEligibilite {
  return {
    regulation: 'Regule',
    typeEntite: 'EnregistrementUniquement',
    pointsAttention: { resumes: [], precisions: [] },
  };
}

export function nonRegulee(): ResultatEligibilite {
  return {
    regulation: 'NonRegule',
    typeEntite: 'EnregistrementUniquement', // Peu importe le type
    pointsAttention: { resumes: [], precisions: [] },
  };
}

export function neSaitPas(): ResultatEligibilite {
  return {
    regulation: 'Incertain',
    typeEntite: 'EnregistrementUniquement', // Peu importe le type
    pointsAttention: { resumes: [], precisions: [] },
  };
}
