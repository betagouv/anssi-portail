import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';
import { randomUUID } from 'node:crypto';
import { Utilisateur } from './utilisateur';

export type ReponsesTestMaturite = Record<string, number>;

export type DonneesCreationResultatTestMaturite = {
  utilisateur: Utilisateur | undefined;
  region: CodeRegion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  id?: string;
  codeSessionGroupe?: string;
  dateRealisation?: Date;
};

export const tousLesIdNiveauMaturite = [
  'insuffisant',
  'emergent',
  'intermediaire',
  'confirme',
  'optimal',
] as const;

export type IdNiveauMaturite = (typeof tousLesIdNiveauMaturite)[number];

export const tousLesIdRubrique = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
] as const;

export type IdRubrique = (typeof tousLesIdRubrique)[number];

export class ResultatTestMaturite {
  id!: string;
  region: CodeRegion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe?: string;
  utilisateur: Utilisateur | undefined;
  dateRealisation: Date | undefined;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
    id,
    codeSessionGroupe,
    utilisateur,
    dateRealisation,
  }: DonneesCreationResultatTestMaturite) {
    this.utilisateur = utilisateur;
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
    this.id = id || randomUUID();
    this.dateRealisation = dateRealisation;
  }

  revendiquePropriete(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur;
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
