import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';
import { randomUUID } from 'node:crypto';

export type ReponsesTestMaturite = Record<string, number>;

export class ResultatTestMaturite {
  id!: string;
  emailUtilisateur: string | undefined;
  region: CodeRegion;
  secteur: CodeSecteur;
  tailleOrganisation: CodeTrancheEffectif;
  reponses: ReponsesTestMaturite;
  codeSessionGroupe?: string;

  constructor({
    emailUtilisateur,
    region,
    secteur,
    tailleOrganisation,
    reponses,
    id,
    codeSessionGroupe,
  }: {
    emailUtilisateur: string | undefined;
    region: CodeRegion;
    secteur: CodeSecteur;
    tailleOrganisation: CodeTrancheEffectif;
    reponses: ReponsesTestMaturite;
    id?: string;
    codeSessionGroupe?: string;
  }) {
    this.emailUtilisateur = emailUtilisateur;
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
    this.codeSessionGroupe = codeSessionGroupe;
    this.id = id || randomUUID();
  }

  revendiquePropriete(emailUtilisateur: string) {
    this.emailUtilisateur = emailUtilisateur;
  }
}
