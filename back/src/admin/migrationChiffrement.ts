import knex from 'knex';
import config from '../../knexfile';
import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement';
import { fabriqueAdaptateurChiffrement } from '../infra/adaptateurChiffrement';

export class MigrationChiffrement {
  constructor(
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {
    if (!this.adaptateurEnvironnement.maintenance().actif()) {
      throw new Error(
        `La migration de chiffrement requiert que l'application soit en mode maintenance !`
      );
    }
  }
  async remplaceLaCleDeChiffrement(ancienneCle: string, nouvelleCle: string) {
    const knexMSC = knex(config);

    const { dechiffre } = fabriqueAdaptateurChiffrement(ancienneCle);
    const { chiffre } = fabriqueAdaptateurChiffrement(nouvelleCle);

    await knexMSC.transaction(async (trx) => {
      const utilisateurs = await trx('utilisateurs');

      const majUtilisateurs = utilisateurs.map(
        async ({ email_hache, donnees }) => {
          const donneesRechiffrees = chiffre(dechiffre(donnees));
          return trx('utilisateurs')
            .where({ email_hache })
            .update({ donnees: donneesRechiffrees });
        }
      );

      await Promise.all(majUtilisateurs);
    });
  }
}
