import type { Knex } from 'knex';

type Correspondance = {
  origine:string;
  destinations:string[];
}

const correspondancesUp:Correspondance[] = [
  {
    origine: '/ressources/cyber-13questions',
    destinations: ['/guides/la-cybersecurite-pour-les-tpepme-en-13-questions'],
  },
  {
    origine: '/ressources/guides-gestion-crise',
    destinations: [
      '/guides/anticiper-et-gerer-sa-communication-de-crise-cyber',
      '/guides/crise-cyber-les-cles-dune-gestion-operationnelle-et-strategique',
      '/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
    ],
  },
  {
    origine: '/ressources/guides-hygiene',
    destinations: ['/guides/guide-dhygiene-informatique'],
  },
  {
    origine: '/ressources/guides-remediation',
    destinations: [
      '/guides/cyberattaques-et-remediation-la-remediation-du-tier-0-active-directory',
      '/guides/cyberattaques-et-remediation-piloter-la-remediation',
      '/guides/cyberattaques-et-remediation-les-cles-de-decision',
    ],
  },
];

async function migreFavoris(knex: Knex, correspondances: Correspondance[]) {
  await knex.transaction(async (trx) => {
    const origines = correspondances.map((c) => c.origine);
    const favorisDeGuide = await trx('favoris').whereIn(
      'id_item_cyber',
      origines
    );

    const maj = favorisDeGuide.flatMap(
      ({ id_item_cyber, date_ajout, email_utilisateur_hache }) => {
        const destinations =
          correspondances.find((c) => c.origine === id_item_cyber)
            ?.destinations ?? [];
        return destinations.map((destination) => {
          return trx('favoris').insert({
            id_item_cyber: destination,
            date_ajout,
            email_utilisateur_hache,
          });
        });
      }
    );

    await Promise.all(maj);

    await trx('favoris').whereIn('id_item_cyber', origines).delete();
  });
}

export async function up(knex: Knex): Promise<void> {
  await migreFavoris(knex, correspondancesUp);
}

export async function down(knex: Knex): Promise<void> {
  const inverseDeCorrespondances = correspondancesUp.flatMap((correspondance) => {
    return correspondance.destinations.map((destination, index) => {
      return index === 0
        ? { origine: destination, destinations: [correspondance.origine] }
        : { origine: destination, destinations: [] };
    });
  });
  await migreFavoris(knex, inverseDeCorrespondances);
}
