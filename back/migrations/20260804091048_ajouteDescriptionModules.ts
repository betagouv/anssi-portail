import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('modules', (table) => {
    table.text('description');
  });

  await knex('modules').where({ id: 1 }).update({
    nom: 'Prendre son cyberdépart',
    description:
      "Le socle de départ de la sécurisation d'une organisation : les mesures les plus accessibles et les plus rentables, peu coûteuses et rapides à déployer, à mettre en place avant toute protection avancée.",
  });
  await knex('modules').where({ id: 2 }).update({
    nom: 'Garder la maîtrise de son environnement numérique',
    description:
      "Toujours savoir ce que l'on doit protéger : identifier ses outils informatiques essentiels, connaître les prestataires connectés et encadrer leurs usages. Cette visibilité permet de prévenir les incidents.",
  });
  await knex('modules').where({ id: 3 }).update({
    nom: 'Réduire son exposition à la menace cyber',
    description:
      'Piloter sa cybersécurité dans la durée plutôt que de la subir au coup par coup. Portée au bon niveau et suivie dans le temps, elle réduit progressivement la surface offerte aux attaquants.',
  });
  await knex('modules').where({ id: 4 }).update({
    nom: "Empêcher l'exploitation de failles de sécurité",
    description:
      "Garder ses portes d'entrée fermées : failles informatiques, accès physique aux locaux et salles serveurs, logiciels malveillants. On évite ainsi vol ou falsification de données et interruption d'activité.",
  });
  await knex('modules').where({ id: 5 }).update({
    nom: "Prévenir l'usurpation d'identité et les accès non autorisés",
    description:
      "Empêcher qu'un attaquant se fasse passer pour un utilisateur légitime ou accède aux systèmes sans autorisation : mots de passe faibles ou volés, comptes détournés, droits mal maîtrisés.",
  });
  await knex('modules').where({ id: 6 }).update({
    nom: 'Faire face aux incidents et aux crises',
    description:
      "Réagir efficacement quand un problème informatique survient : s'y être préparé, disposer de solutions de secours, s'être entraîné. On évite que la crise s'éternise et que les conséquences s'alourdissent.",
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('modules').where({ id: 1 }).update({ nom: 'Cyberdépart : 13 actions pour se lancer' });
  await knex('modules').where({ id: 2 }).update({ nom: "Aggravation des conséquences d'un incident ou d'une crise" });
  await knex('modules').where({ id: 3 }).update({ nom: 'Exploitation de faille dans la défense' });
  await knex('modules').where({ id: 4 }).update({ nom: 'Perte de maîtrise de son entité' });
  await knex('modules').where({ id: 5 }).update({ nom: 'Exposition accrue à la menace cyber' });
  await knex('modules').where({ id: 6 }).update({ nom: 'Gestion des comptes et droits' });

  await knex.schema.alterTable('modules', (table) => {
    table.dropColumn('description');
  });
}
