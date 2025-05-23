import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';
import { randomUUID } from 'node:crypto';

export type ReponsesTestMaturite = Record<string, number>;

export type DonneesCreationResultatTestMaturite = {
  emailUtilisateur: string | undefined;
  region: CodeRegion;
  secteur: CodeSecteur;
  tailleOrganisation: CodeTrancheEffectif;
  reponses: ReponsesTestMaturite;
  id?: string;
  codeSessionGroupe?: string;
};

export const tousLesIdNiveauMaturite = [
  'insuffisant',
  'emergent',
  'intermediaire',
  'confirme',
  'optimal',
];

export type IdNiveauMaturite = (typeof tousLesIdNiveauMaturite)[number];

export const tousLesIdRubrique = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
];

export type IdRubrique = (typeof tousLesIdRubrique)[number];

export class ResultatTestMaturite {
  id!: string;
  emailUtilisateur: string | undefined;
  region: CodeRegion;
  secteur: CodeSecteur;
  tailleOrganisation: CodeTrancheEffectif;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe?: string;

  constructor({
    emailUtilisateur,
    region,
    secteur,
    tailleOrganisation,
    reponses,
    id,
    codeSessionGroupe,
  }: DonneesCreationResultatTestMaturite) {
    this.emailUtilisateur = emailUtilisateur;
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
    this.id = id || randomUUID();
  }

  revendiquePropriete(emailUtilisateur: string) {
    this.emailUtilisateur = emailUtilisateur;
  }

  niveau(): IdNiveauMaturite {
    const sommeDesPoints = Object.values(this.reponses)
      .map((r) => this.points(r))
      .reduce((sommePoints, points) => sommePoints + points, 0);
    const moyenneDesPoints = sommeDesPoints / 6;
    if (moyenneDesPoints < 1) return 'insuffisant';
    if (moyenneDesPoints < 2) return 'emergent';
    if (moyenneDesPoints < 3) return 'intermediaire';
    if (moyenneDesPoints < 4) return 'confirme';
    return 'optimal';
  }

  private points(rangReponse: number) {
    return rangReponse - 1;
  }
}
