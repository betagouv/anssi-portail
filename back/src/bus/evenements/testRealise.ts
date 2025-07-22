import { EvenementDuBus } from '../busEvenements';
import { CodeRegion } from '../../metier/referentielRegions';
import { CodeSecteur } from '../../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../../metier/resultatTestMaturite';

export class TestRealise implements EvenementDuBus {
  region: CodeRegion | undefined;
  secteur: CodeSecteur | undefined;
  tailleOrganisation: CodeTrancheEffectif | undefined;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe: string | undefined;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
    codeSessionGroupe,
  }: {
    region: CodeRegion | undefined;
    secteur: CodeSecteur | undefined;
    tailleOrganisation: CodeTrancheEffectif | undefined;
    reponses: ReponsesTestMaturite;
    codeSessionGroupe?: string | undefined;
  }) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
  }
}
