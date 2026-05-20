const DATE_DERNIERE_FERMETURE_CLE = 'dateDerniereFermeture';
const DATE_DERNIER_AVIS_DONNE = 'dateDernierAvis';
const DATE_DEBUT_SESSION = 'datePremiereVisite';

const extraitDateDepuisNavigateur = ({ cle, storage }: { cle: string; storage: Storage }): Date | undefined => {
  try {
    const dateLue = new Date(storage.getItem(cle) ?? '');
    return isNaN(dateLue.getTime()) ? undefined : dateLue;
  } catch {
    return undefined;
  }
};

const enregistreDateDansNavigateur = ({ cle, storage, date }: { cle: string; storage: Storage; date: Date }): void => {
  try {
    storage.setItem(cle, date.toUTCString());
  } catch {
    // Silencieusement ignoré
  }
};

export interface EntrepotAvisUtilisateur {
  dateDernierAvis: () => Date | undefined;
  dateDerniereFermetureAvis: () => Date | undefined;
  dateDebutSession: () => Date | undefined;
  modifieDateDebutSession: (date: Date) => void;
}

export class EntrepotNavigateurAvisUtilisateur implements EntrepotAvisUtilisateur {
  dateDernierAvis = () =>
    extraitDateDepuisNavigateur({
      storage: localStorage,
      cle: DATE_DERNIER_AVIS_DONNE,
    });

  dateDerniereFermetureAvis = () =>
    extraitDateDepuisNavigateur({
      storage: localStorage,
      cle: DATE_DERNIERE_FERMETURE_CLE,
    });
  dateDebutSession = () =>
    extraitDateDepuisNavigateur({
      storage: sessionStorage,
      cle: DATE_DEBUT_SESSION,
    });
  modifieDateDebutSession = (date: Date) => {
    enregistreDateDansNavigateur({
      storage: sessionStorage,
      cle: DATE_DEBUT_SESSION,
      date,
    });
  };

  modifieDateDerniereFermetureAvis = (date: Date) => {
    enregistreDateDansNavigateur({
      storage: localStorage,
      cle: DATE_DERNIERE_FERMETURE_CLE,
      date,
    });
  };

  modifieDateDernierAvisDonne = (date: Date) => {
    enregistreDateDansNavigateur({
      storage: localStorage,
      cle: DATE_DERNIER_AVIS_DONNE,
      date,
    });
  };
}

export const entrepotNavigateurAvisUtilisateur = new EntrepotNavigateurAvisUtilisateur();

export class ControleAvisUtilisateur {
  private readonly UNE_JOURNEE_EN_MILLISECONDE = 1000 * 60 * 60 * 24;
  private readonly dureeMinimumEnSecondes: number;
  private readonly entrepotAvisUtilisateur: EntrepotAvisUtilisateur;

  constructor({
    dureeMinimumEnSecondes,
    entrepotAvisUtilisateur,
  }: {
    dureeMinimumEnSecondes?: string;
    entrepotAvisUtilisateur: EntrepotAvisUtilisateur;
  }) {
    this.dureeMinimumEnSecondes = dureeMinimumEnSecondes ? Number(dureeMinimumEnSecondes) : 20;
    this.entrepotAvisUtilisateur = entrepotAvisUtilisateur;
  }

  proposeAvisUtilisteur = (): boolean => {
    const dateDernierAvis = this.entrepotAvisUtilisateur.dateDernierAvis();
    const dateDerniereFermeture = this.entrepotAvisUtilisateur.dateDerniereFermetureAvis();
    if (dateDernierAvis) {
      return false;
    }
    if (
      dateDerniereFermeture &&
      dateDerniereFermeture.getTime() >= new Date().getTime() - this.UNE_JOURNEE_EN_MILLISECONDE
    ) {
      return false;
    }
    return true;
  };

  calculeDelaiRestantAvisUtilisateur = () => {
    const datePremiereVisite = this.entrepotAvisUtilisateur.dateDebutSession();

    const maintenant = new Date();
    if (!datePremiereVisite) {
      this.entrepotAvisUtilisateur.modifieDateDebutSession(maintenant);
      return this.dureeMinimumEnSecondes;
    }
    return this.dureeMinimumEnSecondes - (maintenant.getTime() - datePremiereVisite.getTime()) / 1000;
  };
}
