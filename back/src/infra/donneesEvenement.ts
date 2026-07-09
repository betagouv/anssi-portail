import { AvisMesureDonne } from '../bus/evenements/avisMesureDonne.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ReponsesEtResultatAvecAnalyse } from '../metier/nis2-simulateur/questionnaire/calculEligibilite.js';
import { NiveauDeSatisfaction } from '../metier/niveauDeSatisfaction.js';
import { CodeRegion } from '../metier/referentielRegions.js';
import { CodeSecteur } from '../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../metier/referentielTranchesEffectifEtablissement.js';
import { ReponsesTestMaturite } from '../metier/resultatTestMaturite.js';

export type DonneesEvenement =
  | DonneesEvenementNouvelUtilisateur
  | DonneesEvenementProprieteTestRevendiquee
  | DonneesEvenementTestRealise
  | DonneesEvenementMiseAJourFavorisUtilisateur
  | DonneesEvenementRetourExperienceDonne
  | DonneesEvenementAvisUtilisateurDonne
  | DonneesEvenementUtilisateurConnecte
  | DonneesSimulationNis2Terminee
  | DonneesMesureConsultee
  | DonneesAvisMesureDonne
  | DonneesMesurePriseEnCompte
  | DonneesModuleTerminé
  | DonnéesBadgeCyberdépartDébloqué;

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

type DonneesMesureConsultee = Evenement<
  'MESURE_CONSULTEE',
  Omit<MesureConsultee, 'emailHache'> & { idUtilisateur: string }
>;

type DonneesAvisMesureDonne = Evenement<'AVIS_MESURE_DONNE', Omit<AvisMesureDonne, 'commentaire'>>;

type DonneesMesurePriseEnCompte = Evenement<
  'MESURE_PRISE_EN_COMPTE',
  Omit<MesurePriseEnCompte, 'emailHache'> & { idUtilisateur: string }
>;

type DonneesModuleTerminé = Evenement<'MODULE_TERMINE', Omit<ModuleTermine, 'emailHache'> & { idUtilisateur: string }>;

type DonnéesBadgeCyberdépartDébloqué = Evenement<
  'BADGE_CYBERDEPART_DEBLOQUE',
  { idUtilisateur: string; nombreMesuresActuel: number; nombreMesuresTotal: number }
>;
