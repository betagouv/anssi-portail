import { EvenementDuBus } from '../busEvenements.js';
import { CodeRegion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { ReponsesTestMaturite } from '../../metier/resultatTestMaturite.js';

export class TestRealise implements EvenementDuBus {
  region: CodeRegion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe: string | undefined;
  idResultatTest: string;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
    codeSessionGroupe,
    idResultatTest,
  }: {
    region: CodeRegion | undefined;
    secteur: CodeSecteur | undefined;
    tailleOrganisation: CodeTrancheEffectif | undefined;
    reponses: ReponsesTestMaturite;
    codeSessionGroupe?: string;
    idResultatTest: string;
  }) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
    this.idResultatTest = idResultatTest;
  }
}
