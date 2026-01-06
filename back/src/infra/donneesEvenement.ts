import { DocumentGuideTelecharge } from '../bus/evenements/documentGuideTelecharge';
import { NiveauDeSatisfaction } from '../metier/niveauDeSatisfaction';
import { CodeRegion } from '../metier/referentielRegions';
import { CodeSecteur } from '../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../metier/resultatTestMaturite';

export type DonneesEvenement =
  | DonneesEvenementNouvelUtilisateur
  | DonneesEvenementProprieteTestRevendiquee
  | DonneesEvenementTestRealise
  | DonneesEvenementMiseAJourFavorisUtilisateur
  | DonneesEvenementRetourExperienceDonne
  | DonneesEvenementAvisUtilisateurDonne
  | DonneesEvenementDocumentGuideTelecharge;

type Evenement<Type extends string, Donnees extends object> = {
  donnees: Donnees;
  type: Type;
  date: Date;
};

type DonneesEvenementNouvelUtilisateur = Evenement<
  'NOUVEL_UTILISATEUR_INSCRIT',
  { idUtilisateur: string }
>;

type DonneesEvenementMiseAJourFavorisUtilisateur = Evenement<
  'MISE_A_JOUR_FAVORIS_UTILISATEUR',
  {
    idUtilisateur: string;
    listeIdFavoris: string[];
  }
>;

type DonneesEvenementProprieteTestRevendiquee = Evenement<
  'PROPRIETE_TEST_REVENDIQUEE',
  {
    idUtilisateur: string;
    idResultatTest: string;
  }
>;

type DonneesEvenementTestRealise = Evenement<
  'TEST_REALISE',
  {
    region: CodeRegion | undefined;
    secteur: CodeSecteur | undefined;
    tailleOrganisation: CodeTrancheEffectif | undefined;
    reponses: ReponsesTestMaturite;
    codeSessionGroupe?: string;
    idResultatTest: string;
  }
>;

type DonneesEvenementRetourExperienceDonne = Evenement<
  'RETOUR_EXPERIENCE_DONNE',
  {
    raison: string;
    idUtilisateur: string | undefined;
  }
>;

type DonneesEvenementAvisUtilisateurDonne = Evenement<
  'AVIS_UTILISATEUR_DONNE',
  {
    niveauDeSatisfaction: NiveauDeSatisfaction;
    idUtilisateur: string | undefined;
  }
>;

export type DonneesEvenementDocumentGuideTelecharge = Evenement<
  'DOCUMENT_GUIDE_TELECHARGE',
  ProprietesDeClasse<DocumentGuideTelecharge>
>;

type ProprietesDeClasse<C> = {
  [Key in keyof C as C[Key] extends (...args: never) => unknown
    ? never
    : Key]: C[Key];
};
