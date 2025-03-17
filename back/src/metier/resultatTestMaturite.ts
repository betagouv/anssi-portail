import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';

export type ReponsesTestMaturite = Record<string, number>;

export class ResultatTestMaturite {
  emailUtilisateur: string;
  region: CodeRegion;
  secteur: CodeSecteur;
  tailleOrganisation: CodeTrancheEffectif;
  reponses: ReponsesTestMaturite;

  constructor({
    emailUtilisateur,
    region,
    secteur,
    tailleOrganisation,
    reponses,
  }: {
    emailUtilisateur: string;
    region: CodeRegion;
    secteur: CodeSecteur;
    tailleOrganisation: CodeTrancheEffectif;
    reponses: ReponsesTestMaturite;
  }) {
    this.emailUtilisateur = emailUtilisateur;
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;}
}
