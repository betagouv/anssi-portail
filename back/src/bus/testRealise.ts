import { EvenementDuBus } from './busEvenements';
import { Region } from '../metier/referentielRegions';
import { CodeSecteur } from '../metier/referentielSecteurs';
import { TailleOrganisation } from '../metier/referentielTailleOrganisation';

export class TestRealise implements EvenementDuBus {
  region: Region;
  secteur: CodeSecteur;
  tailleOrganisation: TailleOrganisation;
  reponses: Record<string, number>;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
  }: {
    region: Region;
    secteur: CodeSecteur;
    tailleOrganisation: TailleOrganisation;
    reponses: Record<string, number>;
  }) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
  }
}
