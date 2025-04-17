import { EvenementDuBus } from '../busEvenements';
import { CodeRegion } from '../../metier/referentielRegions';
import { CodeSecteur } from '../../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../../metier/resultatTestMaturite';

export class TestRealise implements EvenementDuBus {
  region: CodeRegion;
  secteur: CodeSecteur;
  tailleOrganisation: CodeTrancheEffectif;
  reponses: ReponsesTestMaturite;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
  }: {
    region: CodeRegion;
    secteur: CodeSecteur;
    tailleOrganisation: CodeTrancheEffectif;
    reponses: ReponsesTestMaturite;
  }) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
  }
}
