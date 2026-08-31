import type { Knex } from 'knex';

/*
 La migration `20260826151019_metsAJourMesuresReferentielSecurisation.ts` a réimporté le contenu
 de `action_prioritaire` depuis un export CSV qui mélangeait encore les mentions « Bonne nouvelle »
 dans ce champ, alors qu'elles doivent vivre dans `action_facile_a_faire` (comme l'avait déjà établi
 `20260602115153_nettoyePrefixeBonneNouvelleMesures.ts`).

 Cette migration :
 - retire le paragraphe/la mention "Bonne nouvelle" de `action_prioritaire` pour les mesures où
   `action_facile_a_faire` est déjà renseigné (CRISE.8, MALWARE.3, ANNUAIRE.1, EXO.1, MCO_MCS.5,
   RECENSEMENT.1) ;
 - pour AUTH.4 et CONFORMITE.1, où `action_facile_a_faire` était resté vide, extrait le texte de la
   mention "Bonne nouvelle" (nettoyé du préfixe et de la mise en forme) vers `action_facile_a_faire`,
   et le retire de `action_prioritaire`.
 */

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      action_prioritaire: `<p>Installer un gestionnaire de mots de passe et l'utiliser pour générer des mots de passe robustes — en priorité la messagerie et les accès administrateur.<br>
Sur les comptes critiques (messagerie, accès d'administration, accès distants type VPN/télétravail), activer en complément la vérification en deux étapes lorsqu'elle est disponible.</p>`,
      action_facile_a_faire: `Dans la plupart des suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace…), la vérification en deux étapes est déjà incluse et s'active dans les paramètres de sécurité, sans surcoût.`,
    });

  await knex('mesures').where('id', 'CONFORMITE.1').update({
    action_prioritaire: `<p>Établir un tableau d'analyse de conformité par système d'information : pour chaque exigence, indiquer si elle est mise en œuvre, partiellement appliquée ou non appliquée, et justifier les écarts.</p>`,
    action_facile_a_faire: `Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en oeuvre.`,
  });

  await knex('mesures').where('id', 'CRISE.8').update({
    action_prioritaire: `<p>Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.</p>`,
  });

  await knex('mesures').where('id', 'MALWARE.3').update({
    action_prioritaire: `<p>Vérifier que la protection antivirus est active et à jour sur tous les postes de travail.</p>`,
  });

  await knex('mesures').where('id', 'ANNUAIRE.1').update({
    action_prioritaire: `<p>Si votre organisation dispose d'un annuaire centralisé, demandez à votre prestataire IT (ou responsable IT interne) de confirmer que les mises à jour de sécurité y sont appliquées en priorité, avant celles des postes.</p>`,
  });

  await knex('mesures').where('id', 'EXO.1').update({
    action_prioritaire: `<p>Réaliser un premier exercice de crise sur table avec un scénario prêt à l'emploi.</p>`,
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
</ol>
<p><strong>Les systèmes industriels utilisés dans le cadre de ces activités doivent être inclus à ce recensement.</strong></p>`,
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      action_prioritaire: `<p>Installer un gestionnaire de mots de passe et l'utiliser pour générer des mots de passe robustes — en priorité la messagerie et les accès administrateur.<br>
Sur les comptes critiques (messagerie, accès d'administration, accès distants type VPN/télétravail), activer en complément la vérification en deux étapes lorsqu'elle est disponible.</p>
<p>*Bonne nouvelle* : Dans la plupart des suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace…), la vérification en deux étapes est déjà incluse et s'active dans les paramètres de sécurité, sans surcoût.</p>`,
      action_facile_a_faire: '',
    });

  await knex('mesures')
    .where('id', 'CONFORMITE.1')
    .update({
      action_prioritaire: `<p>Établir un tableau d'analyse de conformité par système d'information : pour chaque exigence, indiquer si elle est mise en œuvre, partiellement appliquée ou non appliquée, et justifier les écarts.</p>
<p>Bonne nouvelle : Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en oeuvre.</p>`,
      action_facile_a_faire: '',
    });

  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      action_prioritaire: `<p>Bonne nouvelle : un simple document imprimé glissé dans un classeur suffit — pas d'outil dédié à acquérir, pas de procédure complexe à formaliser.</p>
<p>Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.</p>`,
    });

  await knex('mesures')
    .where('id', 'MALWARE.3')
    .update({
      action_prioritaire: `<p>Vérifier que la protection antivirus est active et à jour sur tous les postes de travail.</p>
<p>Bonne nouvelle : Certains OS proposent un antivirus activé par défaut, qui couvre déjà la base sur les postes. Et si la messagerie est gérée par un éditeur en nuage, l'analyse des pièces jointes est déjà réalisée côté serveur.</p>`,
    });

  await knex('mesures')
    .where('id', 'ANNUAIRE.1')
    .update({
      action_prioritaire: `<p>Si votre organisation dispose d'un annuaire centralisé, demandez à votre prestataire IT (ou responsable IT interne) de confirmer que les mises à jour de sécurité y sont appliquées en priorité, avant celles des postes.</p>
<p>Bonne nouvelle : si vos comptes utilisateurs sont gérés directement par des éditeurs en nuage (SaaS), l'éditeur gère lui-même les mises à jour — vous n'avez rien à faire.</p>`,
    });

  await knex('mesures')
    .where('id', 'EXO.1')
    .update({
      action_prioritaire: `<p>Réaliser un premier exercice de crise sur table avec un scénario prêt à l'emploi.</p>
<p>Bonne nouvelle : un exercice tient en 1 à 2 heures autour d'une table, sans budget ni prestataire.</p>`,
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.5')
    .update({
      action_prioritaire: `<p>Mettre à jour en priorité :</p>
<ul>
<li>les pares-feux,</li>
<li>les équipements (postes de travail, téléphones, etc.) et serveurs exposés sur internet.</li>
</ul>
<p>Bonne nouvelle : les solutions en nuage sont mises à jour par l'éditeur — vous n'avez rien à faire. Sur les postes, Windows, macOS, certaines distributions Linux, les navigateurs et les smartphones se mettent à jour automatiquement par défaut. Il suffit de vérifier que l'option n'a pas été désactivée et de ne pas reporter indéfiniment les redémarrages.</p>`,
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
</ol>
<p><strong>Les systèmes industriels utilisés dans le cadre de ces activités doivent être inclus à ce recensement.</strong></p>
<p>Bonne nouvelle : un tableur d'une page suffit — une ligne par activité, avec son responsable et les outils utilisés (logiciel de comptabilité, messagerie, site web…).</p>`,
    });
}
