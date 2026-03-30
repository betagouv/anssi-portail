import { NiveauDeSatisfaction } from '../metier/niveauDeSatisfaction';
import { CodeRegion } from '../metier/referentielRegions';
import { CodeSecteur } from '../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../metier/resultatTestMaturite';
import { ReponsesEtResultatAvecAnalyse } from '../metier/nis2-simulateur/questionnaire/calculEligibilite';

export type DonneesEvenement =
  | DonneesEvenementNouvelUtilisateur
  | DonneesEvenementProprieteTestRevendiquee
  | DonneesEvenementTestRealise
  | DonneesEvenementMiseAJourFavorisUtilisateur
  | DonneesEvenementRetourExperienceDonne
  | DonneesEvenementAvisUtilisateurDonne
  | DonneesEvenementUtilisateurConnecte
  | DonneesSimulationNis2Terminee;

type Evenement<Type extends string, Donnees extends object> = {
  donnees: Donnees;
  type: Type;
  date: Date;
};

type DonneesEvenementNouvelUtilisateur = Evenement<'NOUVEL_UTILISATEUR_INSCRIT', { idUtilisateur: string }>;

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

export type DonneesEvenementUtilisateurConnecte = Evenement<
  'UTILISATEUR_CONNECTE',
  { idUtilisateur: string; connexionAvecMFA: boolean }
>;

export type DonneesSimulationNis2Terminee = Evenement<'SIMULATION_NIS2_TERMINEE', ReponsesEtResultatAvecAnalyse>;
