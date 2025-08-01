import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { CodeRegion } from '../../src/metier/referentielRegions';
import { CodeSecteur } from '../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../src/metier/referentielTranchesEffectifEtablissement';
import {
  IdNiveauMaturite,
  ReponsesTestMaturite,
  ResultatTestMaturite,
} from '../../src/metier/resultatTestMaturite';
import { Utilisateur } from '../../src/metier/utilisateur';
import { fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets';

export class ResultatTestMaturiteCreateur {
  private reponses: ReponsesTestMaturite = {
    'prise-en-compte-risque': 1,
    pilotage: 1,
    budget: 1,
    'ressources-humaines': 1,
    'adoption-solutions': 1,
    posture: 1,
  };
  tailleOrganisation: CodeTrancheEffectif | undefined;
  utilisateur: Utilisateur | undefined;
  entrepotResultatTest: EntrepotResultatTest | undefined;
  secteur: CodeSecteur | undefined;
  region: CodeRegion | undefined;

  deNiveau(idNiveau: IdNiveauMaturite) {
    const pointsParNiveau: Record<IdNiveauMaturite, number> = {
      insuffisant: 1,
      emergent: 2,
      intermediaire: 3,
      confirme: 4,
      optimal: 5,
    };
    const pointDeLaReponse = pointsParNiveau[idNiveau || 'insuffisant'];
    this.reponses = {
      'prise-en-compte-risque': pointDeLaReponse,
      pilotage: pointDeLaReponse,
      budget: pointDeLaReponse,
      'ressources-humaines': pointDeLaReponse,
      'adoption-solutions': pointDeLaReponse,
      posture: pointDeLaReponse,
    };
    return this;
  }

  avecReponses(reponses: ReponsesTestMaturite) {
    this.reponses = reponses;
    return this;
  }

  deSecteur(secteur: CodeSecteur) {
    this.secteur = secteur;
    return this;
  }

  deTailleOrganisation(tailleOrganisation: CodeTrancheEffectif) {
    this.tailleOrganisation = tailleOrganisation;
    return this;
  }

  deRegion(region: CodeRegion) {
    this.region = region;
    return this;
  }
  pour(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur;
    return this;
  }

  dansEntrepot(entrepotResultatTest: EntrepotResultatTest) {
    this.entrepotResultatTest = entrepotResultatTest;
    return this;
  }

  cree = async () => {
    const resultatConstruit = new ResultatTestMaturite({
      region: this.region,
      secteur: this.secteur,
      tailleOrganisation: this.tailleOrganisation,
      reponses: this.reponses,
    });
    if (this.utilisateur) {
      await resultatConstruit.revendiquePropriete(
        this.utilisateur,
        fauxAdaptateurRechercheEntreprise
      );
    }
    if (this.entrepotResultatTest) {
      await this.entrepotResultatTest.ajoute(resultatConstruit);
    }
    return resultatConstruit;
  };

  creePlusieurs = (nombre: number) => {
    return Promise.all(new Array(nombre).fill(0).map(this.cree));
  };
}
