import { AxiosError } from 'axios';
import Knex from 'knex';
import pThrottle from 'p-throttle';
import config from '../../knexfile';
import { CompteCree } from '../bus/evenements/compteCree';
import { MiseAJourFavorisUtilisateur } from '../bus/miseAJourFavorisUtilisateur';
import {
  AdaptateurChiffrement,
  fabriqueAdaptateurChiffrement,
} from '../infra/adaptateurChiffrement';
import { fabriqueAdaptateurEmail } from '../infra/adaptateurEmailBrevo';
import { adaptateurEnvironnement } from '../infra/adaptateurEnvironnement';
import {
  AdaptateurHachage,
  fabriqueAdaptateurHachage,
} from '../infra/adaptateurHachage';
import { adaptateurJournalMemoire } from '../infra/adaptateurJournal';
import { adaptateurJournalPostgres } from '../infra/adaptateurJournalPostgres';
import { fabriqueAdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi';
import {
  AdaptateurRechercheEntreprise,
  adaptateurRechercheEntreprise,
} from '../infra/adaptateurRechercheEntreprise';
import { EntrepotFavoriPostgres } from '../infra/entrepotFavoriPostgres';
import { EntrepotUtilisateurMPAPostgres } from '../infra/entrepotUtilisateurMPAPostgres';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur } from '../metier/utilisateur';

export class ConsoleAdministration {
  private entrepotUtilisateur: EntrepotUtilisateur;
  private adaptateurEmail: AdaptateurEmail;
  private readonly adaptateurChiffrement: AdaptateurChiffrement;
  private readonly adaptateurHachage: AdaptateurHachage;
  private entrepotFavori: EntrepotFavori;
  private adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  private knexJournal: Knex.Knex;
  private knexMSC: Knex.Knex;

  constructor() {
    const adaptateurProfilAnssi = fabriqueAdaptateurProfilAnssi();
    this.adaptateurChiffrement = fabriqueAdaptateurChiffrement({
      adaptateurEnvironnement,
    });
    this.adaptateurHachage = fabriqueAdaptateurHachage({
      adaptateurEnvironnement,
    });
    this.entrepotUtilisateur = new EntrepotUtilisateurMPAPostgres({
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise,
      adaptateurChiffrement: this.adaptateurChiffrement,
      adaptateurHachage: this.adaptateurHachage,
    });
    this.adaptateurEmail = fabriqueAdaptateurEmail();
    this.entrepotFavori = new EntrepotFavoriPostgres({
      adaptateurHachage: this.adaptateurHachage,
    });
    this.adaptateurRechercheEntreprise = adaptateurRechercheEntreprise;
    const configDuJournal = {
      client: 'pg',
      connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
      pool: {
        min: 0,
        max: Number.parseInt(
          process.env.BASE_DONNEES_JOURNAL_POOL_CONNEXION_MAX || '0'
        ),
      },
    };
    this.knexJournal = Knex(configDuJournal);
    this.knexMSC = Knex(config);
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
        (utilisateur) => new MiseAJourFavorisUtilisateur({ utilisateur })
      );
    const constitueListeIdFavorisUtilisateur = async (
      utilisateur: Utilisateur
    ) => {
      return (await this.entrepotFavori.tousCeuxDeUtilisateur(utilisateur)).map(
        ({ idItemCyber }) => idItemCyber
      );
    };

    const rattrapeEvenement = async (evenement: MiseAJourFavorisUtilisateur) =>
      journal.consigneEvenement({
        type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
        donnees: {
          idUtilisateur: this.adaptateurHachage.hache(
            evenement.utilisateur.email
          ),
          listeIdFavoris: await constitueListeIdFavorisUtilisateur(
            evenement.utilisateur
          ),
        },
        date: new Date(),
      });

    const afficheErreur = (evenement: MiseAJourFavorisUtilisateur) =>
      `Erreur pour ${evenement.utilisateur.email}`;

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
          idUtilisateur: this.adaptateurHachage.hache(evenement.email),
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

  async corrigeEvenementsAvecMailEnClair() {
    process.stdout.write(
      'Migration des événements PROPRIETE_TEST_REVENDIQUEE avec email en clair\n'
    );
    await this.knexJournal.transaction(async (trx) => {
      const evenements = await trx('journal_msc.evenements').where(
        'type',
        'PROPRIETE_TEST_REVENDIQUEE'
      );
      process.stdout.write('\n');
      let compteur = 0;

      const majEvenements = evenements.map(({ id, donnees }, index) => {
        process.stdout.write(
          `\rConstruction des données: ${(
            (index / evenements.length) *
            100.0
          ).toFixed(2)}% (${index}/${evenements.length})`
        );

        const nouvellesDonnees = {
          ...donnees,
          idUtilisateur: this.adaptateurHachage.hache(donnees.emailUtilisateur),
        };
        delete nouvellesDonnees.emailUtilisateur;

        return trx('journal_msc.evenements')
          .where({ id })
          .update({ donnees: nouvellesDonnees })
          .then(() => {
            compteur += 1;
            process.stdout.write(
              `\rExécution des promesses: ${(
                (compteur / evenements.length) *
                100.0
              ).toFixed(2)}% (${compteur}/${evenements.length})`
            );
          });
      });

      process.stdout.write('\n');
      await Promise.all(majEvenements);
      process.stdout.write('\n');
      process.stdout.write('Fin de la migration des événements\n');
    });
  }

  async migreLesHashSha256DuJournal() {
    const leHashHMACCorrespondantA = async (leHash256: string) => {
      const ligne = await this.knexMSC('utilisateurs')
        .where({ email_hache_256: leHash256 })
        .first();
      return ligne ? ligne.email_hache : null;
    };

    process.stdout.write(
      'Migration des événements avec email hachés avec algo SHA256\n'
    );
    await this.knexJournal.transaction(async (trx) => {
      const evenements = await trx('journal_msc.evenements').whereRaw(
        "donnees->>'idUtilisateur' IS NOT NULL"
      );
      process.stdout.write('\n');
      let compteur = 0;

      await this.knexJournal.transaction(async (trx) => {
        const majEvenements = evenements.map(({ id, donnees }, index) => {
          process.stdout.write(
            `\rConstruction des données: ${(
              (index / evenements.length) *
              100.0
            ).toFixed(2)}% (${index}/${evenements.length})`
          );

          return leHashHMACCorrespondantA(donnees.idUtilisateur).then(
            (emailHacheAvecHMAC) => {
              if (!emailHacheAvecHMAC) {
                return new Promise((resolve) => resolve(null));
              }

              const nouvellesDonnees = {
                ...donnees,
                idUtilisateur: emailHacheAvecHMAC,
              };

              return trx('journal_msc.evenements')
                .where({ id })
                .update({ donnees: nouvellesDonnees })
                .then(() => {
                  compteur += 1;
                  process.stdout.write(
                    `\rExécution des promesses: ${(
                      (compteur / evenements.length) *
                      100.0
                    ).toFixed(2)}% (${compteur}/${evenements.length})`
                  );
                });
            }
          );
        });

        process.stdout.write('\n');
        await Promise.all(majEvenements);
        process.stdout.write('\n');
        process.stdout.write('Fin de la migration des événements\n');
      });
    });
  }

  async sauvegardeLesEmpreintesDesSecretsDeHachage() {
    await this.knexMSC.transaction(async (trx) => {
      const tousLesSecretsDeHachage = adaptateurEnvironnement
        .hachage()
        .tousLesSecretsDeHachage();

      const maj = tousLesSecretsDeHachage.map(async ({ version, secret }) => {
        const empreinte = await this.adaptateurHachage.hacheBCrypt(secret);
        return trx('secrets_hachage')
          .insert({ version, empreinte })
          .onConflict()
          .ignore();
      });

      await Promise.all(maj);
    });
  }

  async chiffreDonneesChaCha20() {
    await this.knexMSC.transaction(async (trx) => {
      const tousLesUtilisateurs = await trx('utilisateurs');

      const promesses = tousLesUtilisateurs.map(({ donnees, email_hache }) => {
        const donneesEnClair = {
          email: donnees.email,
          cguAcceptees: donnees.cguAcceptees,
          infolettreAcceptee: donnees.infolettreAcceptee,
        };
        const donneesChiffrees =
          this.adaptateurChiffrement.chiffre(donneesEnClair);
        return trx('utilisateurs')
          .where({ email_hache })
          .update({ donnees: donneesChiffrees });
      });

      await Promise.all(promesses);
    });
  }

  async rattrapageDonneesOrganisationDansResultatTest() {
    process.stdout.write(
      "Rattrapage des résultats de tests ayant un utilisateur mais sans informations d'organisation\n"
    );
    await this.knexMSC.transaction(async (trx) => {
      const resultatsAvecUneInfoManquante = await trx(
        'resultats_test'
      ).whereRaw(
        `email_utilisateur_hache IS NOT NULL 
        AND (region IS NULL 
          OR secteur IS NULL 
          OR taille_organisation IS NULL)`
      );

      process.stdout.write(
        `...${resultatsAvecUneInfoManquante.length} résultats à rattraper...\n`
      );

      const enCadence = pThrottle({ limit: 1, interval: 150 }); // rate limit à 7 requetes/s
      const promesses = resultatsAvecUneInfoManquante.map(
        enCadence(
          async ({
            id,
            region,
            secteur,
            taille_organisation,
            email_utilisateur_hache,
          }) => {
            const utilisateur = await this.entrepotUtilisateur.parEmailHache(
              email_utilisateur_hache
            );
            if (!utilisateur) {
              return Promise.resolve();
            }
            const { codeRegion, codeSecteur, codeTrancheEffectif } =
              (
                await adaptateurRechercheEntreprise.rechercheOrganisations(
                  utilisateur.siretEntite,
                  null
                )
              )[0] ?? {};
            return trx('resultats_test')
              .where({ id })
              .update({
                region: region ?? codeRegion,
                secteur: secteur ?? codeSecteur,
                taille_organisation: taille_organisation ?? codeTrancheEffectif,
              });
          }
        )
      );
      await Promise.all(promesses);
    });

    process.stdout.write('Fin du rattrapage des résultats\n');
  }
}
