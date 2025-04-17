import { AxiosError } from 'axios';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { fabriqueAdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi';
import { EntrepotUtilisateurMPAPostgres } from '../infra/entrepotUtilisateurMPAPostgres';
import { fabriqueAdaptateurEmail } from '../infra/adaptateurEmailBrevo';
import { adaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { Utilisateur } from '../metier/utilisateur';
import pThrottle from 'p-throttle';
import { adaptateurJournalMemoire } from '../infra/adaptateurJournal';
import { adaptateurJournalPostgres } from '../infra/adaptateurJournalPostgres';
import {
  AdaptateurChiffrement,
  fabriqueAdaptateurChiffrement,
} from '../infra/adaptateurChiffrement';
import { CompteCree } from '../bus/evenements/compteCree';
import { MiseAJourFavorisUtilisateur } from '../bus/miseAJourFavorisUtilisateur';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { EntrepotFavoriPostgres } from '../infra/entrepotFavoriPostgres';

export class ConsoleAdministration {
  private entrepotUtilisateur: EntrepotUtilisateur;
  private adaptateurEmail: AdaptateurEmail;
  private adaptateurChiffrement: AdaptateurChiffrement;
  private entrepotFavori: EntrepotFavori;

  constructor() {
    const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
    this.entrepotUtilisateur = new EntrepotUtilisateurMPAPostgres(
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise
    );
    this.adaptateurEmail = fabriqueAdaptateurEmail();
    this.adaptateurChiffrement = fabriqueAdaptateurChiffrement();
    this.entrepotFavori = new EntrepotFavoriPostgres();
  }

  static async rattrapage<T>(
    collectionARattraper: T[],
    fonctionMessageErreur: (item: T) => string,
    fonctionRattrapage: (item: T) => Promise<void>
  ) {
    let rapportExecution = '';
    let iteration = 1;

    for (const item of collectionARattraper) {
      process.stdout.write(`\r${iteration}/${collectionARattraper.length}`);
      try {
        await fonctionRattrapage(item);
      } catch (e) {
        let raisonErreur;
        if (e instanceof AxiosError) {
          raisonErreur = `[${e?.response?.status}]: ${e?.response?.data?.message}`;
        } else {
          raisonErreur = JSON.stringify(e);
        }
        rapportExecution += `${fonctionMessageErreur(item)}: ${raisonErreur}\n`;
      }
      iteration += 1;
    }
    console.log(`\n${rapportExecution}`);
  }

  async rattrapageProfilsContactBrevo() {
    const tousUtilisateurs = await this.entrepotUtilisateur.tous();
    const afficheErreur = (utilisateur: Utilisateur) =>
      `Erreur pour ${utilisateur.email}`;
    const enCadence = pThrottle({ limit: 1, interval: 150 });

    const rattrapeUtilisateur = enCadence(async (utilisateur: Utilisateur) => {
      const { prenom, nom, email, infolettreAcceptee } = utilisateur;
      this.adaptateurEmail.creeContactBrevo({
        prenom,
        nom,
        email,
        infoLettre: infolettreAcceptee,
      });
    });

    return ConsoleAdministration.rattrapage(
      tousUtilisateurs,
      afficheErreur,
      rattrapeUtilisateur
    );
  }

  async rattrapageMAJFavorisUtilisateurs(persiste: boolean = false) {
    const journal = persiste
      ? adaptateurJournalPostgres()
      : adaptateurJournalMemoire;

    const tousUtilisateurs = await this.entrepotUtilisateur.tous();
    const tousEvenementsUtilisateurs: MiseAJourFavorisUtilisateur[] =
      tousUtilisateurs.map(
        ({ email }) => new MiseAJourFavorisUtilisateur({ email })
      );
    const constitueListeIdFavorisUtilisateur = async (email: string) => {
      return (await this.entrepotFavori.tousCeuxDeUtilisateur(email)).map(
        ({ idItemCyber }) => idItemCyber
      );
    };

    const rattrapeEvenement = async (evenement: MiseAJourFavorisUtilisateur) =>
      journal.consigneEvenement({
        type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
        donnees: {
          idUtilisateur: this.adaptateurChiffrement.hacheSha256(
            evenement.email
          ),
          listeIdFavoris: await constitueListeIdFavorisUtilisateur(
            evenement.email
          ),
        },
        date: new Date(),
      });

    const afficheErreur = (evenement: MiseAJourFavorisUtilisateur) =>
      `Erreur pour ${evenement.email}`;

    return ConsoleAdministration.rattrapage(
      tousEvenementsUtilisateurs,
      afficheErreur,
      rattrapeEvenement
    );
  }

  async genereTousEvenementsNouvelUtilisateurInscrit(
    persiste: boolean = false
  ) {
    const journal = persiste
      ? adaptateurJournalPostgres()
      : adaptateurJournalMemoire;

    const tousUtilisateurs = await this.entrepotUtilisateur.tous();
    const tousEvenementsUtilisateurs: CompteCree[] = tousUtilisateurs.map(
      ({ email, prenom, nom, infolettreAcceptee }) =>
        new CompteCree({
          email,
          prenom,
          nom,
          infoLettre: infolettreAcceptee,
        })
    );
    const rattrapeEvenement = (evenement: CompteCree) =>
      journal.consigneEvenement({
        type: 'NOUVEL_UTILISATEUR_INSCRIT',
        donnees: {
          idUtilisateur: this.adaptateurChiffrement.hacheSha256(
            evenement.email
          ),
        },
        date: new Date(),
      });

    const afficheErreur = (evenement: CompteCree) =>
      `Erreur pour ${evenement.email}`;

    return ConsoleAdministration.rattrapage(
      tousEvenementsUtilisateurs,
      afficheErreur,
      rattrapeEvenement
    );
  }
}

// Usage example depuis le dossier /back
// Lancer un script node: `node --import tsx --env-file ../.env`
// Puis importer la classe ConsoleAdministration et l'utiliser
// const consoleAdmin = new (await import("./src/admin/consoleAdministration.ts")).default.ConsoleAdministration();
