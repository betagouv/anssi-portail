import { adaptateurJournalPostgres } from './adaptateurJournalPostgres';
import { CodeRegion } from '../metier/referentielRegions';
import { CodeSecteur } from '../metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../metier/referentielTranchesEffectifEtablissement';
import { ReponsesTestMaturite } from '../metier/resultatTestMaturite';

export type DonneesEvenement =
  | DonneesEvenementNouvelUtilisateur
  | DonneesEvenementProprieteTestRevendiquee
  | DonneesEvenementTestRealise
  | DonneesEvenementMiseAJourFavorisUtilisateur
  | DonneesEvenementRetourExperienceDonne;

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
    idUtilisateur: string;
    idResultatTest: string;
  };
  type: 'PROPRIETE_TEST_REVENDIQUEE';
}

interface DonneesEvenementTestRealise extends DonneesCommunesEvenement {
  donnees: {
    region: CodeRegion | undefined;
    secteur: CodeSecteur | undefined;
    tailleOrganisation: CodeTrancheEffectif | undefined;
    reponses: ReponsesTestMaturite;
    codeSessionGroupe?: string;
    idResultatTest: string;
  };
  type: 'TEST_REALISE';
}

interface DonneesEvenementRetourExperienceDonne
  extends DonneesCommunesEvenement {
  donnees: {
    raison: string;
    idUtilisateur: string | undefined;
  };
  type: 'RETOUR_EXPERIENCE_DONNE';
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
