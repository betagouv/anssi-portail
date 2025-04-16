import { adaptateurJournalPostgres } from './adaptateurJournalPostgres';
import { CodeRegion } from '../metier/referentielRegions';
import { CodeSecteur } from '../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../metier/resultatTestMaturite';

export type DonneesEvenement =
  | DonneesEvenementNouvelUtilisateur
  | DonneesEvenementProprieteTestRevendiquee
  | DonneesEvenementTestRealise
  | DonneesEvenementMiseAJourFavorisUtilisateur;

interface DonneesCommunesEvenement {
  date: Date;
}

interface DonneesEvenementNouvelUtilisateur extends DonneesCommunesEvenement {
  donnees: {
    idUtilisateur: string;
  };
  type: 'NOUVEL_UTILISATEUR_INSCRIT';
}

interface DonneesEvenementMiseAJourFavorisUtilisateur
  extends DonneesCommunesEvenement {
  donnees: {
    idUtilisateur: string;
    listeIdFavoris: string[];
  };
  type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR';
}

interface DonneesEvenementProprieteTestRevendiquee
  extends DonneesCommunesEvenement {
  donnees: {
    emailUtilisateur: string;
    idResultatTest: string;
  };
  type: 'PROPRIETE_TEST_REVENDIQUEE';
}

interface DonneesEvenementTestRealise extends DonneesCommunesEvenement {
  donnees: {
    region: CodeRegion;
    secteur: CodeSecteur;
    tailleOrganisation: CodeTrancheEffectif;
    reponses: ReponsesTestMaturite;
  };
  type: 'TEST_REALISE';
}

export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: DonneesEvenement) => Promise<void>;
};

export const adaptateurJournalMemoire: AdaptateurJournal = {
  async consigneEvenement(donneesEvenement: DonneesEvenement): Promise<void> {
    console.log(
      `[JOURNAL MSC] Nouvel évènement \n${JSON.stringify(donneesEvenement)}`
    );
  },
};

export const fabriqueAdaptateurJournal = () => {
  return process.env.BASE_DONNEES_JOURNAL_EN_MEMOIRE === 'true'
    ? adaptateurJournalMemoire
    : adaptateurJournalPostgres();
};
