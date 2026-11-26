import { ReponsesTestMaturite, RésultatTestMaturité } from '@metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { CodeRégion } from '@metier/referentielRegions.js';
import { CodeSecteur } from '@metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '@metier/referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '@metier/utilisateur.js';
import { fauxAdaptateurRechercheEntreprise } from '../../fauxObjets.js';

export class ConstructeurRésultatTestMaturité {
  private id: string | undefined;
  private utilisateur: Utilisateur | undefined;
  private dateRéalisation: Date | undefined;
  private région: CodeRégion | undefined = 'FR-NOR';
  private secteur: CodeSecteur | undefined = 'J';
  private tailleOrganisation: CodeTrancheEffectif | undefined = '51';
  private réponses: ReponsesTestMaturite = {
    'prise-en-compte-risque': 2,
    pilotage: 3,
    budget: 5,
    'ressources-humaines': 3,
    'adoption-solutions': 2,
    posture: 3,
  };
  private codeSessionGroupe: string | undefined;

  avecId(id: string): ConstructeurRésultatTestMaturité {
    this.id = id;
    return this;
  }

  pour(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur;
    return this;
  }

  avecDateRéalisation(date: Date) {
    this.dateRéalisation = date;
    return this;
  }

  avecRégion(région: CodeRégion | undefined) {
    this.région = région;
    return this;
  }

  avecSecteur(secteur: CodeSecteur | undefined) {
    this.secteur = secteur;
    return this;
  }

  avecTailleOrganisation(tailleOrganisation: CodeTrancheEffectif | undefined) {
    this.tailleOrganisation = tailleOrganisation;
    return this;
  }

  avecRéponses(réponses: Partial<ReponsesTestMaturite>) {
    this.réponses = {
      ...this.réponses,
      ...réponses,
    };
    return this;
  }

  avecCodeSessionGroupe(codeSessionGroupe: string) {
    this.codeSessionGroupe = codeSessionGroupe;
    return this;
  }

  async construis(): Promise<RésultatTestMaturité> {
    const résultatTestMaturité = new RésultatTestMaturité({
      id: this.id,
      utilisateur: undefined,
      region: this.région,
      secteur: this.secteur,
      tailleOrganisation: this.tailleOrganisation,
      reponses: this.réponses,
      dateRealisation: this.dateRéalisation,
      codeSessionGroupe: this.codeSessionGroupe,
    });
    if (this.utilisateur) {
      await résultatTestMaturité.revendiquePropriete(this.utilisateur, fauxAdaptateurRechercheEntreprise);
    }
    return résultatTestMaturité;
  }
}

export const unRésultatDeTestDeMaturité = () => new ConstructeurRésultatTestMaturité();
