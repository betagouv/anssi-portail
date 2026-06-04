import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.5')
    .update({
      action_prioritaire: `Mettre en oeuvre la vérification en deux étapes <strong>sur les services importants</strong>, a minima :
<ul><li>l'accès aux mails,</li><li>les services en ligne,</li><li>tous les accès distants (ex. télétravail),</li><li>les comptes d'administration.</li></ul>`,
      explications: `Un mot de passe seul ne suffit pas toujours à protéger un compte.<br><br>En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

<br><br><strong>Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.</strong>`,
    });

  await knex('mesures')
    .where('id', 'AUTH.1')
    .update({
      action_prioritaire: `Vérifier et modifier les mots de passe par défaut en priorité sur :
<ul><li>les équipements de sécurité (ex. pare-feu),</li><li>les logiciels exposés sur internet,</li><li>les équipements réseaux (ex. box internet).</li></ul>`,
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.5')
    .update({
      action_prioritaire: `Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l'accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d'administration.`,
    });

  await knex('mesures')
    .where('id', 'AUTH.1')
    .update({
      action_prioritaire: `Vérifier et modifier les mots de passe par défaut en priorité sur :
* les équipements de sécurité (ex. pare-feu),
* les logiciels exposés sur internet,
* les équipements réseaux (ex. box internet).`,
    });
}
