import knex from 'knex';
import config from '../../knexfile';
import { adaptateurEnvironnement } from '../infra/adaptateurEnvironnement';
import {
  AdaptateurHachage,
  fabriqueAdaptateurHachage,
} from '../infra/adaptateurHachage';
import {
  fabriqueServiceVerificationCoherenceSecretsHachage,
  ServiceCoherenceSecretsDeHachage,
} from '../infra/serviceVerificationCoherenceSecretsHachage';
import { EntrepotSecretHachagePostgres } from '../infra/entrepotSecretHachagePostgres';

type FonctionDeMigration = (chaine: string) => string | undefined;

export const tenteDeHacherAvecUnNouveauSel = (
  chaine: string,
  version: number,
  sel: string,
  fonctionDeHashage: (chaine: string, sel: string) => string,
  versionPrecedenteAttendue: string
) => {
  if (!chaine) return undefined;
  const [versionActuelle, hashActuel] = chaine.split(':');
  if (versionActuelle !== versionPrecedenteAttendue) {
    return chaine;
  }
  const nouvelleVersion = `${versionActuelle}-v${version}`;
  const chaineHachee = fonctionDeHashage(hashActuel, sel);
  return `${nouvelleVersion}:${chaineHachee}`;
};

export class MigrationHash {
  private readonly knexMSCJournal: knex.Knex;
  private readonly knexMSC: knex.Knex;
  private readonly adaptateurHachage: AdaptateurHachage;
  private readonly serviceVerificationSecretsHachage: ServiceCoherenceSecretsDeHachage;

  constructor() {
    const configDuJournal = {
      client: 'pg',
      connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
      pool: {
        min: 0,
        max: 10,
      },
    };
    this.knexMSCJournal = knex(configDuJournal);
    this.knexMSC = knex(config);
    if (!adaptateurEnvironnement.maintenance().actif()) {
      throw new Error(
        `La migration des hash requiert que l'application soit en mode maintenance !`
      );
    }
    this.adaptateurHachage = fabriqueAdaptateurHachage({
      adaptateurEnvironnement,
    });

    this.serviceVerificationSecretsHachage =
      fabriqueServiceVerificationCoherenceSecretsHachage({
        adaptateurEnvironnement,
        entrepotSecretHachage: new EntrepotSecretHachagePostgres(),
        adaptateurHachage: this.adaptateurHachage,
      });
  }

  async migreLesHashDeMsc(fonctionDeMigration: FonctionDeMigration) {
    await this.knexMSC.transaction(async (trx) => {
      const utilisateurs = await trx<{ email_hache: string }>(
        'utilisateurs'
      ).distinct('email_hache');
      const majUtilisateurs = utilisateurs.map(
        ({ email_hache: emailHacheActuel }) => {
          const emailHacheNouveau = fonctionDeMigration(emailHacheActuel);

          return trx('utilisateurs')
            .where({ email_hache: emailHacheActuel })
            .update({ email_hache: emailHacheNouveau });
        }
      );

      const favoris = await trx<{ email_utilisateur_hache: string }>(
        'favoris'
      ).distinct('email_utilisateur_hache');
      const majFavoris = favoris.map(
        ({ email_utilisateur_hache: emailUtilisateurActuel }) => {
          const emailUtilisateurNouveau = fonctionDeMigration(
            emailUtilisateurActuel
          );

          return trx('favoris')
            .where({ email_utilisateur_hache: emailUtilisateurActuel })
            .update({
              email_utilisateur_hache: emailUtilisateurNouveau,
            });
        }
      );

      const resultatsTests = await trx<{ email_utilisateur_hache: string }>(
        'resultats_test'
      )
        .distinct('email_utilisateur_hache')
        .whereNotNull('email_utilisateur_hache');
      const majResultatsTests = resultatsTests.map(
        ({ email_utilisateur_hache: emailUtilisateurActuel }) => {
          const emailUtilisateurNouveau = fonctionDeMigration(
            emailUtilisateurActuel
          );

          return trx('resultats_test')
            .where({ email_utilisateur_hache: emailUtilisateurActuel })
            .update({
              email_utilisateur_hache: emailUtilisateurNouveau,
            });
        }
      );

      await Promise.all([
        ...majFavoris,
        ...majResultatsTests,
        ...majUtilisateurs,
      ]);
    });
  }

  async migreLesEvenementsDuJournal(fonctionDeMigration: FonctionDeMigration) {
    await this.knexMSCJournal.transaction(async (trx) => {
      const evenements = await trx('journal_msc.evenements').whereRaw(
        "donnees->>'idUtilisateur' IS NOT NULL"
      );
      process.stdout.write('\n');
      let compteur = 0;

      const majEvenements = evenements.map(({ id, donnees }, index) => {
        process.stdout.write(
          `\rConstruction des données: ${((100 * index) / evenements.length).toFixed(2)}% (${index}/${evenements.length})`
        );

        const nouvellesDonnees = {
          ...donnees,
          idUtilisateur: fonctionDeMigration(donnees.idUtilisateur),
        };

        return trx('journal_msc.evenements')
          .where({ id })
          .update({ donnees: nouvellesDonnees })
          .then(() => {
            compteur += 1;
            process.stdout.write(
              `\rExécution des promesses: ${((compteur / evenements.length) * 100).toFixed(2)}% (${compteur}/${evenements.length})`
            );
          });
      });

      process.stdout.write('\n');
      await Promise.all(majEvenements);
      process.stdout.write('\n');
    });
  }

  async ajouteVersionDansTableSecretsHachage(version: number, sel: string) {
    const empreinte = await this.adaptateurHachage.hacheBCrypt(sel);
    await this.knexMSC('secrets_hachage').insert({
      version,
      empreinte,
    });
  }

  async migreTout(version: number, sel: string) {
    await this.serviceVerificationSecretsHachage.verifieCoherenceSecrets();

    console.log('Configuration des sels cohérente');

    const versionPrecedenteAttendue = adaptateurEnvironnement
      .hachage()
      .tousLesSecretsDeHachage()
      .filter(({ version: numVersion }) => numVersion !== version)
      .map(({ version: numVersion }) => `v${numVersion}`)
      .join('-');

    console.log(
      `Version précédente de sel attendue pour les données à migrer : ${versionPrecedenteAttendue}`
    );
    console.log(
      `Nouvelle version après migration : ${versionPrecedenteAttendue}-v${version}`
    );

    const appliqueNouveauSel: FonctionDeMigration = (chaine) =>
      tenteDeHacherAvecUnNouveauSel(
        chaine,
        version,
        sel,
        this.adaptateurHachage.hacheAvecUnSeulSecret,
        versionPrecedenteAttendue
      );

    console.log(
      'Migration des Hash de MSC (utilisateurs, favoris et resultats test)...'
    );
    await this.migreLesHashDeMsc(appliqueNouveauSel);
    console.log('Migration des Hash des évènements du journal...');
    await this.migreLesEvenementsDuJournal(appliqueNouveauSel);
    console.log(
      `Ajout de la version ${version} dans la table sels_de_hachage...`
    );
    await this.ajouteVersionDansTableSecretsHachage(version, sel);
    console.log('Migration terminée.');
  }
}
