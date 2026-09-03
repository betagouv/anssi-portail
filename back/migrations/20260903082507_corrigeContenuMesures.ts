import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'CRISE.8').update({
    action_facile_a_faire: `Un simple document imprimé glissé dans un classeur suffit — pas d’outil dédié à acquérir, pas de procédure complexe à formaliser.`,
  });

  await knex('mesures').where('id', 'RH.5').update({
    action_facile_a_faire: '',
    action_prioritaire: `<p>Identifier les personnes à former (en interne et prestataires) et planifier au moins un module annuel adapté à leur fonction. <msc-lien href="https://secnumacademie.gouv.fr/" libelle="SecNumAcadémie (ANSSI)" neutre blank></msc-lien> offre une base gratuite.</p>`,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      action_facile_a_faire: `Un simple document imprimé glissé dans un classeur suffit — pas d’outil dédié à acquérir, pas de procédure complexe à formaliser.

Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l’entité : prise de décision, juridique, communication, gestion de l’informatique, lien avec l’hébergeur, lien avec l’assurance cyber, lien avec les autorités.`,
    });

  await knex('mesures').where('id', 'RH.5').update({
    action_facile_a_faire: `https://secnumacademie.gouv.fr/`,
    action_prioritaire: `<p>Identifier les personnes à former (en interne et prestataires) et planifier au moins un module annuel adapté à leur fonction. SecNumAcadémie (ANSSI) offre une base gratuite.</p>`,
  });
}
