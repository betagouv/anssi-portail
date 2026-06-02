import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'AUTH.5').update({
    action_facile_a_faire: `Dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l'activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`,
  });

  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      action_facile_a_faire: `Un simple document imprimé glissé dans un classeur suffit — pas d'outil dédié à acquérir, pas de procédure complexe à formaliser.

Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.`,
    });

  await knex('mesures').where('id', 'MALWARE.3').update({
    action_facile_a_faire: `Certains OS proposent un antivirus activé par défaut, qui couvre déjà la base sur les postes. Et si la messagerie est gérée par un éditeur en nuage, l'analyse des pièces jointes est déjà réalisée côté serveur.`,
  });

  await knex('mesures').where('id', 'RECENSEMENT.1').update({
    action_facile_a_faire: `Un tableur d'une page suffit — une ligne par activité, avec son responsable et les outils utilisés (logiciel de comptabilité, messagerie, site web…).`,
  });

  await knex('mesures').where('id', 'MCO_MCS.5').update({
    action_facile_a_faire: `Les solutions en nuage sont mises à jour par l'éditeur — vous n'avez rien à faire. Sur les postes, Windows, macOS, certaines distributions Linux, les navigateurs et les smartphones se mettent à jour automatiquement par défaut. Il suffit de vérifier que l'option n'a pas été désactivée et de ne pas reporter indéfiniment les redémarrages.`,
  });

  await knex('mesures').where('id', 'EXO.1').update({
    action_facile_a_faire: `Un exercice tient en 1 à 2 heures autour d'une table, sans budget ni prestataire.`,
  });

  await knex('mesures').where('id', 'ANNUAIRE.1').update({
    action_facile_a_faire: `Si vos comptes utilisateurs sont gérés directement par des éditeurs en nuage (SaaS), l'éditeur gère lui-même les mises à jour — vous n'avez rien à faire.`,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'AUTH.5').update({
    action_facile_a_faire: `**Bonne nouvelle :** dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l'activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`,
  });

  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      action_facile_a_faire: `Bonne nouvelle : un simple document imprimé glissé dans un classeur suffit — pas d'outil dédié à acquérir, pas de procédure complexe à formaliser.

Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.`,
    });

  await knex('mesures').where('id', 'MALWARE.3').update({
    action_facile_a_faire: `Bonne nouvelle : Certains OS proposent un antivirus activé par défaut, qui couvre déjà la base sur les postes. Et si la messagerie est gérée par un éditeur en nuage, l'analyse des pièces jointes est déjà réalisée côté serveur.`,
  });

  await knex('mesures').where('id', 'RECENSEMENT.1').update({
    action_facile_a_faire: `Bonne nouvelle : un tableur d'une page suffit — une ligne par activité, avec son responsable et les outils utilisés (logiciel de comptabilité, messagerie, site web…).`,
  });

  await knex('mesures').where('id', 'MCO_MCS.5').update({
    action_facile_a_faire: `Bonne nouvelle : les solutions en nuage sont mises à jour par l'éditeur — vous n'avez rien à faire. Sur les postes, Windows, macOS, certaines distributions Linux, les navigateurs et les smartphones se mettent à jour automatiquement par défaut. Il suffit de vérifier que l'option n'a pas été désactivée et de ne pas reporter indéfiniment les redémarrages.`,
  });

  await knex('mesures').where('id', 'EXO.1').update({
    action_facile_a_faire: `Bonne nouvelle : un exercice tient en 1 à 2 heures autour d'une table, sans budget ni prestataire.`,
  });

  await knex('mesures').where('id', 'ANNUAIRE.1').update({
    action_facile_a_faire: `Bonne nouvelle : si vos comptes utilisateurs sont gérés directement par des éditeurs en nuage (SaaS), l'éditeur gère lui-même les mises à jour — vous n'avez rien à faire.`,
  });
}
