import type { Knex } from 'knex';

/*
 Migration générée à partir du diff entre Mesures_Modules-Reformulation_v0_5.csv
 et Mesures_Modules-Reformulation_v0_6.csv.
 */

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.5')
    .update({
      explications: `<p>Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.</p>
<p>Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.</p>
<p>CAVEAT : <em>Attention</em> : Cette mesure est issue du guide ANSSI sur l'authentification multi-facteur et les mots de passe. Elle complète l'exigence ReCyF relative à la complexité des mots de passe.</p>`,
      action_prioritaire: `<p>Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :</p>
<ul>
<li>l'accès aux mails,</li>
<li>les services en ligne,</li>
<li>tous les accès distants (ex. télétravail, télémaintenance, accès au VPN),</li>
<li>les comptes d’administration.</li>
</ul>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Un compte utilisé à votre place',
            description:
              'par exemple si le mot de passe a été volé après un mail frauduleux, une fuite de données ou un virus sur un ordinateur.',
          },
          {
            libelle: 'Un accès non autorisé à un outil en ligne',
            description:
              'cela peut concerner une messagerie, un logiciel de gestion, un espace client, un compte bancaire, un réseau social ou un outil d’administration accessible depuis internet.',
          },
          {
            libelle: 'Connexion frauduleuse sans alerte',
            description:
              'sans vérification en deux étapes, une connexion réussie avec votre mot de passe ne déclenche aucun signal — un attaquant peut consulter vos mails ou agir en votre nom pendant des jours sans que vous le remarquiez.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.1')
    .update({
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Perte définitive de vos données suite à un rançongiciel',
            description:
              'un virus rend illisibles tous les fichiers de votre environnement de production, et les pirates exigent une rançon pour les débloquer, sans aucune garantie de récupération.',
          },
          {
            libelle: "Destruction des sauvegardes parce qu'elles ne sont pas isolées",
            description:
              "un virus qui chiffre les données du système peut aussi chiffrer les sauvegardes, puisqu'elles restent connectées en permanence.",
          },
          {
            libelle: 'Disparition de fichiers suite à une panne matérielle',
            description:
              'par exemple un disque dur qui lâche, un serveur qui tombe en rade ou un système de stockage en réseau (NAS) qui cesse de fonctionner.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RECENSEMENT.1')
    .update({
      action_prioritaire: `<p>Lister sur une feuille les 3 à 5 activités sans lesquelles l'organisation s'arrête (ex. facturation, prise de commande, paie), et noter pour chacune les systèmes d'information utilisés.<br>
Voici un exemple d'activités prioritaires classées :</p>
<ol>
<li>Production et données techniques de production</li>
<li>R&amp;D et données d’industrialisation</li>
<li>Paie des salariés et données bancaires associées</li>
<li>Facturation et données clients</li>
<li>Mail/Agenda et données</li>
</ol>`,
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.5')
    .update({
      action_prioritaire: `<p>Mettre à jour en priorité :</p>
<ul>
<li>les pares-feux,</li>
<li>les équipements (postes de travail, téléphones, etc.) et serveurs exposés sur internet.</li>
</ul>`,
    });

  await knex('mesures').where('id', 'FILTRE.8').update({
    action_prioritaire: `<p>Activer le pare-feu local sur les postes de travail — Windows Defender Firewall ou équivalent macOS, c'est natif et gratuit</p>`,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.5')
    .update({
      explications: `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.`,
      action_prioritaire: `Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l'accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Un compte utilisé à votre place',
            description:
              'par exemple si le mot de passe a été volé après un faux email, une fuite de données ou un virus sur un ordinateur.',
          },
          {
            libelle: 'Un accès non autorisé à un outil en ligne',
            description:
              'cela peut concerner une messagerie, un logiciel de gestion, un espace client, un compte bancaire, un réseau social ou un outil d’administration accessible depuis internet.',
          },
          {
            libelle: 'Connexion frauduleuse sans alerte',
            description:
              'sans vérification en deux étapes, une connexion réussie avec votre mot de passe ne déclenche aucun signal — un attaquant peut consulter vos mails ou agir en votre nom pendant des jours sans que vous le remarquiez.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.1')
    .update({
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Perte définitive de vos données suite à un rançongiciel',
            description:
              'un virus rend illisibles tous les fichiers de votre environnement de production, et les pirates exigent une rançon pour les débloquer, sans aucune garantie de récupération.',
          },
          {
            libelle: 'Disparition de fichiers suite à une panne matérielle',
            description:
              'par exemple un disque dur qui lâche, un serveur qui tombe en rade ou un système de stockage en réseau (NAS) qui cesse de fonctionner.',
          },
          {
            libelle: 'Effacement par erreur',
            description:
              'un collaborateur supprime par mégarde un dossier important, écrase une version récente par une ancienne, ou se trompe de manipulation.',
          },
        ]),
      ]),
    });

  await knex('mesures').where('id', 'RECENSEMENT.1').update({
    action_prioritaire: `Lister sur une feuille les 3 à 5 activités sans lesquelles l'organisation s'arrête (ex. facturation, prise de commande, paie), et noter pour chacune les systèmes d'information utilisés.`,
  });

  await knex('mesures').where('id', 'MCO_MCS.5').update({
    action_prioritaire: `Vérifier, et si besoin mettre en oeuvre les mises à jour automatiques sur l’ensemble des ressources.`,
  });

  await knex('mesures')
    .where('id', 'FILTRE.8')
    .update({
      action_prioritaire: `Activer le pare-feu sur la box internet — souvent déjà actif par défaut, mais à vérifier
Activer le pare-feu local sur les postes de travail — Windows Defender Firewall ou équivalent macOS, c'est natif et gratuit`,
    });
}
