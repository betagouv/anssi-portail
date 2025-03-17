import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';
import { randomUUID } from 'node:crypto';

export type ReponsesTestMaturite = Record<string, number>;

export class ResultatTestMaturite {
  id!: string;
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
    id,
  }: {
    emailUtilisateur: string;
    region: CodeRegion;
    secteur: CodeSecteur;
    tailleOrganisation: CodeTrancheEffectif;
    reponses: ReponsesTestMaturite;
    id?: string;
  }) {
    this.emailUtilisateur = emailUtilisateur;
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.id = id || randomUUID();
  }
}
