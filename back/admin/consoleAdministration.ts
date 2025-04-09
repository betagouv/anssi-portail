import { AxiosError } from 'axios';
import { EntrepotUtilisateurMPAPostgres } from '../src/infra/entrepotUtilisateurMPAPostgres';
import { EntrepotUtilisateur } from '../src/metier/entrepotUtilisateur';
import { fabriqueAdaptateurProfilAnssi } from '../src/infra/adaptateurProfilAnssi';
import { adaptateurRechercheEntreprise } from '../src/infra/adaptateurRechercheEntreprise';
import { Utilisateur } from '../src/metier/utilisateur';
import { AdaptateurEmail } from '../src/metier/adaptateurEmail';
import { fabriqueAdaptateurEmail } from '../src/infra/adaptateurEmailBrevo';

export class ConsoleAdministration {
  private entrepotUtilisateur: EntrepotUtilisateur;
  private adaptateurEmail: AdaptateurEmail;

  constructor() {
    const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
    this.entrepotUtilisateur = new EntrepotUtilisateurMPAPostgres(
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise
    );
    this.adaptateurEmail = fabriqueAdaptateurEmail();
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
    const rattrapeUtilisateur = async (utilisateur: Utilisateur) => {
      const { prenom, nom, email, infolettreAcceptee } = utilisateur;
      this.adaptateurEmail.creeContactBrevo({
        prenom,
        nom,
        email,
        infoLettre: infolettreAcceptee,
      });
    };

    return ConsoleAdministration.rattrapage(
      tousUtilisateurs,
      afficheErreur,
      rattrapeUtilisateur
    );
  }
}

// Usage example depuis le dossier /back
// Lancer un script node: `node --import tsx --env-file ../.env`
// Puis importer la classe ConsoleAdministration et l'utiliser
// const consoleAdmin = new (await import("./admin/consoleAdministration.ts")).default.ConsoleAdministration();
