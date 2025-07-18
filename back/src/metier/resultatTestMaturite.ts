import { randomUUID } from 'node:crypto';
import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { CodeRegion, estCodeRegion } from './referentielRegions';
import { CodeSecteur, estCodeSecteur } from './referentielSecteurs';
import {
  CodeTrancheEffectif,
  trancheEffectifParCode,
} from './referentielTranchesEffectifEtablissement';
import { Utilisateur } from './utilisateur';

export type ReponsesTestMaturite = Record<string, number>;

export type DonneesCreationResultatTestMaturite = {
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
    dateRealisation,
  }: DonneesCreationResultatTestMaturite) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
    this.id = id || randomUUID();
    this.dateRealisation = dateRealisation;
  }

  async revendiquePropriete(
    utilisateur: Utilisateur,
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise
  ) {
    this.utilisateur = utilisateur;
    const { codeRegion, codeSecteur, codeTrancheEffectif } = (
      await adaptateurRechercheEntreprise.rechercheOrganisations(
        utilisateur.siretEntite,
        null
      )
    )[0];
    this.region =
      this.region ?? (estCodeRegion(codeRegion) ? codeRegion : undefined);
    this.secteur =
      this.secteur ?? (estCodeSecteur(codeSecteur) ? codeSecteur : undefined);
    this.tailleOrganisation =
      this.tailleOrganisation ??
      trancheEffectifParCode(codeTrancheEffectif)?.code;
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
