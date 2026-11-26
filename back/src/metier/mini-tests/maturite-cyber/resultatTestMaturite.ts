import { AdaptateurRechercheEntreprise } from '@infra/adaptateurRechercheEntreprise.js';
import { DonnéesCréationRésultatTest, RésultatTest } from '../resultat-test/resultatTest.js';
import { CodeRégion, estCodeRegion } from './../../referentielRegions.js';
import { CodeSecteur, estCodeSecteur } from './../../referentielSecteurs.js';
import { CodeTrancheEffectif, trancheEffectifParCode } from './../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from './../../utilisateur.js';

export type ReponsesTestMaturite = Record<IdRubrique, number>;

export type DonneesCreationResultatTestMaturite = {
  region: CodeRégion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe?: string;
} & DonnéesCréationRésultatTest;

export const tousLesIdNiveauMaturite = ['insuffisant', 'emergent', 'intermediaire', 'confirme', 'optimal'] as const;

export type IdNiveauMaturite = (typeof tousLesIdNiveauMaturite)[number];

export const libellésNiveauMaturité: Record<IdNiveauMaturite, string> = {
  insuffisant: 'Insuffisant',
  emergent: 'Émergent',
  intermediaire: 'Intermédiaire',
  confirme: 'Confirmé',
  optimal: 'Optimal',
};

export const tousLesIdRubrique = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
] as const;

export type IdRubrique = (typeof tousLesIdRubrique)[number];

export class RésultatTestMaturité extends RésultatTest {
  region: CodeRégion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe?: string;

  constructor({
    id,
    dateRealisation,
    region,
    secteur,
    tailleOrganisation,
    reponses,
    codeSessionGroupe,
  }: DonneesCreationResultatTestMaturite) {
    super({ id, dateRealisation });

    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
  }

  async revendiquePropriete(utilisateur: Utilisateur, adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise) {
    this.utilisateur = utilisateur;
    const { codeRegion, codeSecteur, codeTrancheEffectif } =
      (await adaptateurRechercheEntreprise.rechercheOrganisation(utilisateur.siretEntite, null)) ?? {};
    this.region = this.region ?? (estCodeRegion(codeRegion) ? codeRegion : undefined);
    this.secteur = this.secteur ?? (estCodeSecteur(codeSecteur) ? codeSecteur : undefined);
    this.tailleOrganisation = this.tailleOrganisation ?? trancheEffectifParCode(codeTrancheEffectif)?.code;
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
