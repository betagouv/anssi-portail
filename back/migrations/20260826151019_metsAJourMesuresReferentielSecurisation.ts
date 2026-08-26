import type { Knex } from 'knex';

/*
 Migration générée à partir du diff entre le contenu actuel de la table `mesures`
 (reconstruit depuis l'historique des migrations) et l'export
 "Prod_Referentiel de mesure - Parcours de sécurisation-Mesures.csv",
 avec les références NIS2 recalculées via "...-ReCyF_v2_5.csv".

 Le CSV fait foi sur les identifiants : AUTH.5, COMPTE.3 et DROITS.1 n'existent plus dans le
 nouveau référentiel (COMPTE.3 est remplacé par COMPTE.5+COMPTE.6, DROITS.1 par DROITS.3+DROITS.4,
 AUTH.5 disparaît sans remplacement) et sont donc supprimés ; COMPTE.5, COMPTE.6, DROITS.3 et
 DROITS.4 sont de nouvelles mesures insérées dans le module 6.

 down() ne restaure pas les éventuelles lignes `prises_en_compte` supprimées pour
 AUTH.5/COMPTE.3/DROITS.1 (perte de données utilisateur assumée sur rollback).
 */

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'ANNUAIRE.1')
    .update({
      explications: `<p>Installez les mises à jour de sécurité sans tarder sur votre annuaire, l'outil qui gère les comptes de vos utilisateurs, leurs mots de passe et ce à quoi chacun a le droit d'accéder. C'est un peu le trousseau de clés et le registre de votre entreprise réunis au même endroit : si un attaquant met la main dessus, il peut se faire passer pour n'importe quel salarié et ouvrir toutes les portes. C'est pour cette raison que les mises à jour de sécurité de l'annuaire doivent être appliquées en priorité, avant celles des autres équipements.</p>`,
      action_prioritaire: `<p>Si votre organisation dispose d'un annuaire centralisé, demandez à votre prestataire IT (ou responsable IT interne) de confirmer que les mises à jour de sécurité y sont appliquées en priorité, avant celles des postes.</p>
<p>Bonne nouvelle : si vos comptes utilisateurs sont gérés directement par des éditeurs en nuage (SaaS), l'éditeur gère lui-même les mises à jour — vous n'avez rien à faire.</p>`,
    });

  await knex('mesures')
    .where('id', 'AUTH.1')
    .update({
      explications: `<p>Avant d’utiliser un nouvel équipement ou logiciel, remplacez toujours les mots de passe et identifiants configurés par défaut par les fournisseurs.</p>
<p>Ces accès “sortie d’usine” sont souvent connus, faciles à retrouver ou identiques pour de nombreux utilisateurs. Ils peuvent donc permettre à une personne malveillante d’accéder facilement à votre box, routeur, caméra, imprimante, serveur de fichiers ou application métier.</p>
<p>Avant de choisir une solution, vérifiez qu’il est possible de modifier ces accès. Si ce n’est pas possible, il vaut mieux choisir une autre solution.</p>`,
      action_prioritaire: `<p>Vérifier et modifier les mots de passe par défaut en priorité sur :</p>
<ul>
<li>les équipements de sécurité (ex. pare-feu),</li>
<li>les logiciels exposés sur internet,</li>
<li>les équipements réseaux (ex. box internet).</li>
</ul>`,
    });

  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      titre: `Utiliser des mots de passe robustes et renforcer l'accès aux comptes sensibles`,
      phrase_accroche: `Blindez l'entrée de vos comptes 🗝️`,
      explications: `<p>Utiliser des mots de passe suffisamment longs et difficiles à deviner pour protéger tous les comptes de l'organisation. Le niveau de protection attendu dépend de la sensibilité de l'accès : plus un compte donne accès à des informations ou des outils importants, plus le secret qui le protège doit être robuste.</p>
<p>À titre indicatif, la longueur minimale d'un mot de passe combinant minuscules, majuscules, chiffres et caractères spéciaux recommandée est :<br>
accès peu ou moyennement sensible : 9 à 11 caractères ;<br>
accès sensible : 12 à 14 caractères ;<br>
accès très sensible : 15 caractères ou plus.<br>
En cas de doute, retenez la borne supérieure : 12 caractères minimum est un bon réflexe par défaut.</p>
<p>Sur les comptes les plus importants, le mot de passe gagne à ne pas rester la seule barrière : lorsqu'un service le propose, une vérification supplémentaire au moment de la connexion (code sur une application, clé physique, empreinte…) protège l'accès même si le mot de passe venait à être volé ou deviné.</p>
<p>Pour plus de précision, ou si un autre type de secret est utilisé (ex. certificat), appliquer les recommandations du guide « Authentification multifacteur et mots de passe ».</p>`,
      action_prioritaire: `<p>Installer un gestionnaire de mots de passe et l'utiliser pour générer des mots de passe robustes — en priorité la messagerie et les accès administrateur.<br>
Sur les comptes critiques (messagerie, accès d'administration, accès distants type VPN/télétravail), activer en complément la vérification en deux étapes lorsqu'elle est disponible.</p>
<p>*Bonne nouvelle* : Dans la plupart des suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace…), la vérification en deux étapes est déjà incluse et s'active dans les paramètres de sécurité, sans surcoût.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mot de passe deviné',
            description:
              'un mot de passe trop court ou trop simple (« 123456 », « azerty ») ou basé sur vos informations personnelles (ex. date de naissance, enfants) peut être trouvé en quelques secondes.',
          },
          {
            libelle: "Réutilisation d'un mot de passe déjà piraté ailleurs",
            description:
              "un même mot de passe sur plusieurs sites, et c'est la compromission d'un seul service qui ouvre la porte à tous vos autres comptes.",
          },
          {
            libelle: 'Compte utilisé à votre place malgré tout',
            description:
              'même bien construit, un mot de passe peut fuiter (faux email, fuite de données, virus). Sur un accès sensible sans vérification complémentaire, une connexion frauduleuse ne déclenche alors aucune alerte.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.5-EI/EE', '11.A.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CARTO.1')
    .update({
      explications: `<p>En cas d'incident, vous devez pouvoir répondre vite à deux questions : qui est touché, et comment limiter les conséquences ? La cartographie de vos systèmes d'information vous le permet sans recherche manuelle. Elle guide aussi le déploiement des mesures techniques, comme le cloisonnement.</p>
<p>Son niveau de détail doit être suffisant pour :</p>
<ul>
<li>assurer le maintien en condition opérationnelle et de sécurité des systèmes (par exemple identifier les ressources vulnérables suite à une alerte) ;</li>
<li>réagir sans retard injustifié à un incident de sécurité (par exemple identifier les équipements affectés et limiter la propagation).</li>
</ul>`,
      action_prioritaire: `<p>Produire au moins un schéma de réseau simplifié (équipements, zones IP, interconnexions) et un inventaire des serveurs / applications critiques. Tenir à jour à chaque évolution.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Veille vulnérabilité inexploitable',
            description:
              "une alerte de sécurité tombe, mais l'entité ne peut pas dire quels systèmes sont impactés — il faut tout chercher à la main.",
          },
          {
            libelle: "Incident qui s'étend faute de visibilité",
            description:
              "on ne sait pas quels équipements sont connectés à la machine compromise, donc impossible de l'isoler proprement.",
          },
          {
            libelle: 'Cartographie écrite une fois pour toutes, jamais mise à jour',
            description: "le schéma date d'il y a quatre ans, le SI a changé, le document trompe plus qu'il n'aide.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CLOISON.1')
    .update({
      explications: `<p>Si votre réseau est « à plat », n'importe quelle machine peut parler à n'importe quelle autre — et un attaquant qui compromet un poste peut rebondir partout. Le cloisonnement, c'est ce qui empêche un incident sur un système d'en contaminer d'autres.</p>
<p>Vous devez cloisonner physiquement ou logiquement vos systèmes d'information vis-à-vis des systèmes non maîtrisés — c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués. Ce cloisonnement peut être réalisé par exemple par VLAN (réseau), par machine virtuelle (calcul) ou par volume distinct (stockage).</p>`,
      action_prioritaire: `<p>Cloisonner les SI maîtrisés de l'entité des SI tiers (partenaires, prestataires en hébergement chez l'entité) et des équipements personnels ou visiteurs (par exemple via des VLAN distincts).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Compromission qui se propage à tout le SI',
            description:
              "une fois un équipement attaqué, l'absence de cloisonnement permet à l'attaquant de rebondir partout sans obstacle.",
          },
          {
            libelle: 'Système non maîtrisé qui contamine les SI maîtrisés',
            description:
              "un serveur partagé avec un partenaire, mal sécurisé, devient le point d'entrée pour l'attaque.",
          },
          {
            libelle: 'Impossibilité de circonscrire un incident',
            description:
              "faute de zones séparées, on doit débrancher tout le réseau pour stopper la propagation, paralysant toute l'activité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CLOISON.5')
    .update({
      explications: `<p>Chaque interconnexion entre vos systèmes et un système non maîtrisé (c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués) est une porte potentielle. Moins il y en a, plus c'est facile à surveiller.</p>
<p>Le principe : on n'ouvre que ce qui est démontrable et justifié pour vos activités, vos services, ou pour le maintien en condition opérationnelle et de sécurité. Toutes les autres interconnexions doivent rester fermées.</p>`,
      action_prioritaire: `<p>Établir la matrice des flux : pour chaque interconnexion, justification métier, flux autorisés, point de contact. Fermer toute interconnexion sans justification ou sans usage.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interconnexion héritée et oubliée',
            description:
              "un VPN avec un ancien partenaire reste ouvert sans usage, et devient une porte d'entrée discrète.",
          },
          {
            libelle: 'Multiplication des ouvertures sans justification',
            description: "chaque besoin métier ponctuel se traduit par une ouverture qui n'est jamais refermée.",
          },
          {
            libelle: "Surface d'exposition mal connue",
            description:
              "faute de matrice de flux à jour, l'entité ne sait pas combien d'interconnexions sont réellement en place ni à quoi elles servent.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPADMIN.10')
    .update({
      explications: `<p>Séparez les comptes utilisés au quotidien des comptes réservés à l’administration.</p>
<p>Les actions sensibles, comme installer un logiciel, modifier une configuration ou gérer les droits d’accès, doivent être faites uniquement avec un compte administrateur dédié.</p>
<p>Ce compte ne doit pas servir à lire ses mails, naviguer sur internet ou travailler au quotidien. Il doit être réservé aux seules personnes autorisées.</p>`,
      action_prioritaire: `<p>S’assurer que les comptes administrateur sont utilisés uniquement pour les tâches d'administration.</p>`,
    });

  await knex('mesures')
    .where('id', 'COMPADMIN.12')
    .update({
      explications: `<p>L'idéal, c'est que toutes les actions d'administration se fassent depuis un compte d'administration dédié, distinct du compte utilisateur courant. Mais dans certains cas (contrainte technique, applicatif spécifique), ce n'est pas possible.</p>
<p>Quand c'est le cas, il faut mettre en place :</p>
<ul>
<li>des mesures pour assurer le contrôle des actions d'administration réalisées (ex. traçabilité renforcée, supervision) ;</li>
<li>des mesures de réduction du risque lié à l'utilisation d'un compte non dédié (ex. durcissement du poste, contrôle des actions critiques).</li>
</ul>`,
      action_prioritaire: `<p>Identifier les cas où l'utilisation d'un compte d'administration dédié n'est pas possible, et y appliquer une journalisation renforcée et un contrôle des actions sensibles.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Action d'administration depuis un compte courant compromis",
            description:
              'un mail piégé ouvert avec un compte ayant des droits admin = prise de contrôle totale du système.',
          },
          {
            libelle: 'Absence de traçabilité',
            description:
              'les actions admin réalisées via un compte mixte sont noyées dans les actions courantes, et impossibles à reconstituer après incident.',
          },
          {
            libelle: 'Élévation de privilèges discrète',
            description:
              "un attaquant entré sur un poste courant exploite directement les droits admin embarqués, sans avoir à passer par une étape d'élévation.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.1')
    .update({
      titre: `Utiliser des comptes individuels reservés à l'utilisateur ou au processus automatique associé`,
      explications: `<p>Quand plusieurs personnes partagent un même compte, plus personne ne sait qui a fait quoi. En cas d'incident, l'enquête tourne court. Et si le mot de passe fuite, tous les utilisateurs sont compromis en même temps.</p>
<p>La règle de base : chaque utilisateur et chaque processus automatique qui accède à vos ressources dispose d'un compte individuel, qui lui est réservé. Ce compte est protégé au minimum par un élément secret (mot de passe) connu uniquement de la personne ou du processus autorisé.</p>
<p>À noter : cette mesure ne s'applique pas aux systèmes qui n'ont pour seul objectif que de diffuser de l'information au public (par exemple un site vitrine).</p>`,
      action_prioritaire: `<p>Créer un compte individuel pour chaque utilisateur et processus de service.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Aucune imputation possible en cas d'incident",
            description:
              'un compte est utilisé par plusieurs personnes, et un acte malveillant ou une erreur ne peut être attribué à quiconque.',
          },
          {
            libelle: 'Mot de passe partagé qui circule',
            description:
              "le mot de passe d'un compte commun passe de main en main, finit sur un post-it, et finit par fuiter.",
          },
          {
            libelle: "Aucune piste d'audit exploitable",
            description:
              "les journaux affichent toujours le même compte, donc l'analyse forensic après incident devient quasi impossible.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [
        JSON.stringify([
          '10.A.1-EI/EE',
          '10.A.2-EI/EE',
          '10.A.4-EI/EE',
          '10.B.1-EI/EE',
          '10.B.4-EI/EE',
          '10.C.1-EI/EE',
          '11.A.3-EI/EE',
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.2')
    .update({
      titre: `Sécuriser l'usage des comptes partagés lorsqu'ils sont indispensables.`,
      explications: `<p>Idéalement, tous les comptes sont individuels. Mais dans certains contextes — salle de supervision, équipement industriel, contrainte technique — un compte partagé reste indispensable. Dans ce cas, il faut compenser le risque par d'autres moyens.</p>
<p>Concrètement :</p>
<ul>
<li>mettre en œuvre des mesures pour réduire les risques et assurer la traçabilité (carnet de quart dans une salle de supervision, badgeuse à l'entrée du local, journalisation applicative croisée, etc.) ;</li>
<li>renouveler l'élément secret (mot de passe) à chaque retrait d'un utilisateur de ce compte (départ, mobilité interne) ;</li>
<li>si la modification de l'élément secret est impossible, mettre en place un contrôle d'accès approprié à la ressource concernée ainsi que des mesures compensatoires.</li>
</ul>
<p>Cette règle s'applique à tous les comptes partagés, y compris les comptes d'administration lorsque le partage est inévitable.</p>`,
      action_prioritaire: `<p>Limiter au maximum les comptes partagés. Pour ceux qui restent : renouvellement du secret à chaque retrait d'un utilisateur, stockage du secret dans un gestionnaire de mots de passe sécurisé, traçabilité organisationnelle (cahier de prise/passation).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mot de passe partagé qui survit aux départs',
            description:
              "un ancien collaborateur connaît encore le mot de passe d'un compte technique des mois après son départ.",
          },
          {
            libelle: 'Aucune imputation possible',
            description:
              'un acte malveillant ou erroné réalisé via le compte partagé ne peut être attribué à personne.',
          },
          {
            libelle: 'Compromission silencieuse',
            description:
              "l'élément secret est conservé dans un fichier non sécurisé, et fuite à la première intrusion.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [
        JSON.stringify(['10.A.3-EI/EE', '10.B.3-EI/EE', '10.B.6-EI/EE', '11.A.3-EI/EE']),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.4')
    .update({
      explications: `<p>Même avec une bonne procédure de désactivation, des comptes obsolètes finissent par s'accumuler. Une revue régulière permet de remettre les choses au propre — au moins une fois par an.</p>
<p>Cette revue vérifie trois choses :</p>
<ul>
<li>que les utilisateurs et processus accédant à vos ressources disposent bien de comptes individuels ;</li>
<li>que chaque compte individuel est effectivement réservé à l'utilisateur ou au processus auquel il est attribué ;</li>
<li>que les comptes qui ne sont plus nécessaires sont désactivés.</li>
</ul>`,
      action_prioritaire: `<p>Bloquer une revue annuelle dans le calendrier, conduite par l'IT en collaboration avec les responsables métiers. Documenter les anomalies et les correctifs appliqués.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Accumulation de comptes obsolètes',
            description:
              "sans revue, le SI conserve des dizaines de comptes inutilisés qui élargissent la surface d'attaque.",
          },
          {
            libelle: 'Comptes utilisés à mauvais escient',
            description:
              "un compte attribué à un utilisateur précis est en réalité partagé avec d'autres, sans que personne ne s'en rende compte.",
          },
          {
            libelle: 'Comptes à privilèges non maîtrisés',
            description:
              'aucune visibilité sur qui détient des droits étendus, et certains comptes admin ne devraient plus exister.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONFORMITE.1')
    .update({
      explications: `<p>Il est important de savoir où se situent les systèmes par rapport aux exigences réglementaires qui vous concernent, notamment ReCyF.<br>
Cette analyse de conformité, c'est tout simplement un état des lieux : pour chaque exigence, vous regardez si elle est appliquée chez vous, partiellement appliquée ou pas du tout — et pourquoi.</p>
<p>Si vous avez choisi une mesure alternative à celle attendue, notez-le explicitement avec sa justification : c'est ce qui vous permettra de défendre votre choix en cas de contrôle.</p>`,
      action_prioritaire: `<p>Établir un tableau d'analyse de conformité par système d'information : pour chaque exigence, indiquer si elle est mise en œuvre, partiellement appliquée ou non appliquée, et justifier les écarts.</p>
<p>Bonne nouvelle : Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en oeuvre.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Découverte tardive d'une non-conformité",
            description:
              "sans analyse documentée, l'entité ne sait pas où elle en est, et l'écart se révèle au pire moment (contrôle, incident, audit assurance cyber).",
          },
          {
            libelle: 'Mesures alternatives non justifiées',
            description:
              "l'entité a remplacé une exigence par une mesure de son choix, mais sans trace écrite — impossible de défendre ce choix lors d'un contrôle.",
          },
          {
            libelle: "Pilotage à l'aveugle",
            description:
              'aucune vision consolidée des points faibles, donc impossible de prioriser les actions et le budget de sécurisation.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.C.1-EI/EE', '2.C.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CONFORMITE.2')
    .update({
      explications: `<p>Identifier des écarts, c'est une chose. Les corriger, c'en est une autre. Un plan d'action, c'est ce qui fait passer une analyse de conformité du papier à la réalité.</p>
<p>Pour chaque écart identifié, fixez une échéance raisonnable et nommez un responsable. Et surtout, suivez ce plan dans la durée : sans suivi régulier, les bonnes intentions finissent au fond d'un tiroir.</p>`,
      action_prioritaire: `<p>Reprendre la liste des écarts de l'analyse de conformité. Pour chaque écart, désigner un responsable et fixer une échéance. Programmer un point de suivi régulier (mensuel ou trimestriel).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Plan d'action théorique jamais exécuté",
            description: "les actions sont listées mais aucune ne se concrétise, faute de responsable ou d'échéance.",
          },
          {
            libelle: 'Priorisation absente',
            description:
              'on commence par les actions faciles plutôt que par celles qui réduisent le plus de risque, et les vulnérabilités majeures restent ouvertes.',
          },
          {
            libelle: 'Sanction réglementaire',
            description:
              "sans contrôle de conformité, les manquements ne sont pas détectés et l'organisation s'expose à des sanctions du régulateur.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.C.2-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.1')
    .update({
      explications: `<p>Une sauvegarde permet de restaurer vos fichiers, logiciels ou informations essentielles en cas de panne, d’erreur ou de cyberattaque. Définissez simplement quoi sauvegarder, à quelle fréquence, où stocker les copies et qui en est responsable. Et vérifiez que vos sauvegardes vous permettent de redémarrer chaque service dans les délais nécessaires.</p>
<p>Conservez au moins une copie hors ligne (non connectée à Internet) pour empêcher qu’une cyberattaque rende inutilisables vos données et leurs copies de secours.</p>`,
      action_prioritaire: `<p>Identifier les données critiques pour l'activité et en faire une copie sur un disque dur externe, déconnecté du système une fois la sauvegarde terminée.</p>`,
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
            libelle: 'Effacement par erreur',
            description:
              'un collaborateur supprime par mégarde un dossier important, écrase une version récente par une ancienne, ou se trompe de manipulation.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['13.1-EI/EE', '13.3-EI/EE', '13.5-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.2')
    .update({
      explications: `<p>Une sauvegarde que vous n'avez jamais restaurée, vous ne savez pas si elle fonctionne. Et le moment où vous le découvrez (en pleine attaque rançongiciel, par exemple) est rarement le bon.</p>
<p>D'où le principe : tester les procédures de sauvegarde et de restauration au moins une fois par an, pour vérifier que les sauvegardes se font correctement et qu'elles peuvent être effectivement restaurées.</p>`,
      action_prioritaire: `<p>Bloquer une date annuelle de test de restauration. Tester la restauration complète d'au moins un système critique (changer le système choisi à chaque itération) et la restauration de fichiers individuels.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sauvegarde inutilisable au moment crucial',
            description: 'on découvre, en pleine attaque rançongiciel, que la sauvegarde est corrompue ou incomplète.',
          },
          {
            libelle: 'Procédure de restauration jamais répétée',
            description:
              'personne ne sait combien de temps il faut pour restaurer, ni quels outils ou compétences sont nécessaires.',
          },
          {
            libelle: 'Périmètre incomplet',
            description:
              "la sauvegarde ne couvre qu'une partie des données vraiment critiques, et l'écart n'apparaît qu'au moment du sinistre.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTRAT.1')
    .update({
      explications: `<p>Quand vous travaillez avec un prestataire informatique, votre sécurité dépend en partie de la sienne. D'où l'importance d'écrire noir sur blanc, dès le contrat, ce que vous attendez de lui en matière de sécurité.</p>
<p>Vos clauses contractuelles doivent couvrir au minimum la conformité aux obligations légales applicables — notamment en matière de gestion des risques affectant la sécurité des réseaux et systèmes d'information, et de notification des incidents importants.</p>`,
      action_prioritaire: `<p>Inclure dans tout nouveau contrat informatique une annexe sécurité prévoyant : exigences de sécurité, notification rapide des incidents, réversibilité, conformité aux obligations légales.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sécurité oubliée du contrat',
            description:
              'le contrat ne mentionne aucune exigence de sécurité, et le prestataire applique le minimum vital, voire moins.',
          },
          {
            libelle: "Notification d'incidents non encadrée",
            description:
              "un incident chez le prestataire reste silencieux pendant des semaines, et l'entité l'apprend par un client ou par les médias.",
          },
          {
            libelle: 'Sous-traitance en cascade non maîtrisée',
            description:
              "le prestataire sous-traite sans en informer l'entité, et les données sont traitées par des acteurs jamais évalués.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTRAT.2')
    .update({
      explications: `<p>Avoir des clauses contractuelles, c'est bien ; vérifier qu'elles sont respectées, c'est essentiel. Un audit régulier des prestations permet de s'assurer que les prestataires tiennent leurs engagements — et de réagir s'ils dérivent.</p>
<p>Ces audits doivent vérifier la conformité de la prestation aux obligations légales (gestion des risques, notification d'incidents). Ils doivent produire une synthèse des conformités, les constats, les recommandations, et permettre la construction d'un plan d'action. En cas de manquement, des sanctions adaptées doivent pouvoir être appliquées.</p>`,
      action_prioritaire: `<p>Programmer au moins un contrôle annuel des prestations critiques (infogérance, hébergement, SaaS sensibles). Exiger un rapport structuré (conformités, constats, recommandations, plan d'action).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Prestation défaillante non détectée',
            description:
              'aucun audit ne révèle que les sauvegardes ne sont plus testées ou que les correctifs ne sont plus appliqués depuis des mois.',
          },
          {
            libelle: 'Aucun rapport exploitable',
            description:
              "les contrôles existent mais sans format structuré (constats, recommandations, plan d'action), donc rien ne change.",
          },
          {
            libelle: 'Sanctions impossibles',
            description:
              'aucune clause contractuelle ne permet de pénaliser un manquement, et le prestataire continue sans correction.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CRISE.1')
    .update({
      explications: `<p>Une cyberattaque majeure, ça ne s'improvise pas. Sans procédure préparée à l'avance, chacun improvise sous stress, les décisions prennent des heures, les mauvais réflexes se multiplient.</p>
<p>Définissez une procédure de gestion de crise activable en cas d'incident significatif sur vos systèmes, ainsi qu'un annuaire des parties prenantes externes (assureur cyber, prestataire de réponse à incident, autorités, CERT-FR, partenaires-clés), construit en s'appuyant sur votre cartographie de l'écosystème.</p>`,
      action_prioritaire: `<p>Rédiger une procédure courte (5 à 10 pages) : critères de déclenchement, cellule de crise (qui, quels rôles), chaîne d'alerte, premiers réflexes techniques, obligations de notification. La faire approuver par le dirigeant.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Improvisation totale en pleine crise',
            description:
              'sans procédure, chacun improvise, les décisions critiques prennent des heures et les mauvais réflexes se multiplient.',
          },
          {
            libelle: 'Communication chaotique',
            description:
              'les clients, les autorités, les partenaires reçoivent des messages contradictoires, voire silence radio pendant des jours.',
          },
          {
            libelle: 'Non-respect des obligations légales',
            description:
              "la notification d'incident (CNIL pour RGPD, ANSSI pour NIS2) ne se fait pas dans les délais réglementaires, exposant l'entité à des sanctions.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.1-EI/EE', '14.4-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CRISE.2')
    .update({
      explications: `<p>Une crise qui se passe sans retour d'expérience, c'est une crise dont on n'apprend rien. Les mêmes manques se reproduiront à la suivante : annuaire pas à jour, sauvegardes incomplètes, communication chaotique.</p>
<p>À chaque activation du dispositif de gestion de crise — qu'il s'agisse d'un entraînement, d'un exercice ou d'une crise réelle —, organisez un retour d'expérience (RETEX) pour identifier les axes d'amélioration et les mesures à mettre en œuvre.</p>`,
      action_prioritaire: `<p>Organiser un RETEX systématiquement, à chaud (J+7) puis à froid (J+30) après tout déclenchement. Tracer les enseignements et associer chaque action à un responsable.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Enseignements perdus',
            description:
              "la crise est gérée, mais aucune trace de ce qui a fonctionné ou non, donc rien ne s'améliore pour la prochaine.",
          },
          {
            libelle: 'Reproductions des mêmes erreurs',
            description:
              'faute de RETEX, les mêmes manques (annuaire pas à jour, sauvegardes incomplètes, communication chaotique) se répètent.',
          },
          {
            libelle: 'Démotivation des équipes',
            description:
              "l'effort fourni pendant la crise n'est pas valorisé ni capitalisé, et la maturité de l'entité ne progresse pas.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      explications: `<p>En cas de cyberattaque, vos outils habituels peuvent ne plus fonctionner : messagerie, carnet d’adresses, réseau interne…</p>
<p>Préparez une liste imprimée des personnes à contacter rapidement : responsables internes, prestataire informatique, hébergeur, assurance, autorités ou contacts utiles.</p>
<p>Gardez cette liste à jour et accessible, même sans ordinateur ni internet.</p>`,
      action_prioritaire: `<p>Bonne nouvelle : un simple document imprimé glissé dans un classeur suffit — pas d'outil dédié à acquérir, pas de procédure complexe à formaliser.</p>
<p>Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.</p>`,
    });

  await knex('mesures')
    .where('id', 'CRISE.9')
    .update({
      explications: `<p>Le jour où vos systèmes tombent (rançongiciel, panne, sinistre), votre messagerie aussi est inaccessible. Si la liste des personnes à contacter n'existe qu'en numérique sur le SI, vous ne pourrez pas l'ouvrir.</p>
<p>D'où l'exigence d'une double disponibilité de la liste des personnes mobilisables dans la gestion de crise d'origine cyber :</p>
<ul>
<li>au format papier si les systèmes d'information ne sont plus disponibles ;</li>
<li>au format numérique si la version papier n'est pas accessible.</li>
</ul>`,
      action_prioritaire: `<p>Imprimer la liste des contacts de crise et la conserver dans un endroit sûr accessible (classeur en armoire, coffre). La maintenir à jour annuellement et à chaque changement.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Aucun contact identifié',
            description:
              "en pleine crise, personne ne sait qui joindre — ni en interne, ni côté prestataires ou autorités — et l'organisation de la réponse prend un retard critique.",
          },
          {
            libelle: "Listes des contacts dans l'outil tombé en panne",
            description: "la messagerie est chiffrée par un rançongiciel, et personne n'a les numéros à jour ailleurs.",
          },
          {
            libelle: 'Version papier oubliée dans un tiroir',
            description: 'la liste papier existe mais date de deux ans, les personnes-clés ont changé.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'DISTANCE.1')
    .update({
      explications: `<p>Quand un utilisateur ou un prestataire se connecte à distance à votre SI, son trafic transite par Internet. Sans chiffrement ni authentification solide, n'importe qui peut l'intercepter ou se faire passer pour lui.</p>
<p>D'où la double exigence :</p>
<ul>
<li>chiffrement à l'aide de protocoles éprouvés (VPN utilisant TLS ou IPsec, ou protocoles applicatifs sécurisés comme TLS/SSL ou SSH), conformes aux recommandations de l'ANSSI ;</li>
<li>authentification quand l'accès est réalisé par l'entité ou ses prestataires.</li>
</ul>`,
      action_prioritaire: `<p>Imposer un VPN IPsec ou TLS (selon le contexte) pour tout accès distant. Activer l'authentification systèmatique pour les accès distants (prestataires, administrateurs, télétravail, etc.).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interception du trafic en clair',
            description:
              "un accès distant non chiffré (ex. RDP sans VPN, FTP) laisse fuiter identifiants et données dès qu'il transite sur Internet.",
          },
          { libelle: 'Accès sans mot de passe', description: 'un accès au SI par un attaquant sans aucune barrière.' },
          {
            libelle: 'Accès prestataire non encadré',
            description:
              "une télémaintenance s'ouvre via un protocole non sécurisé et personne ne sait quand le prestataire entre ou sort.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['8.1-EI/EE', '8.2-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'DROITS.2')
    .update({
      explications: `<p>Comme pour les comptes, les droits s'accumulent au fil des projets et des mobilités. Sans revue régulière, un collaborateur peut finir par avoir accès à des ressources sans rapport avec son poste actuel.</p>
<p>D'où la revue annuelle des droits d'accès : elle vérifie que chacun n'a que les droits justifiés par sa mission, et permet de corriger les anomalies (droits excédant la mission, droits hérités d'anciennes fonctions, etc.).</p>`,
      action_prioritaire: `<p>Calendrier annuel de revue, conduit conjointement par l'IT et les responsables métiers. Documenter les modifications appliquées.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Droits qui s'accumulent au fil des projets",
            description:
              "un collaborateur sur le terrain depuis 10 ans détient accès à tout, alors que la moitié n'a plus de sens.",
          },
          {
            libelle: 'Mobilités internes sans révision',
            description: 'un changement de poste se traduit par une addition de droits, jamais une soustraction.',
          },
          {
            libelle: 'Comptes admin pléthoriques',
            description:
              "impossible de dire qui a vraiment besoin de quel droit d'administration, car aucune revue n'a jamais été tenue.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.4-EI/EE', '11.A.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'ECOSYSTEME.1')
    .update({
      explications: `<p>En cas d'incident, vous aurez besoin de joindre vite vos prestataires informatiques. Encore faut-il avoir leurs bonnes coordonnées sous la main — et que la liste soit à jour.</p>
<p>Cette liste recense les prestataires et fournisseurs informatiques contribuant à vos activités ou services, avec qui vous avez une relation contractuelle, et formalise leurs coordonnées de contact. Mettez-la à jour au moins une fois par an et chaque fois qu'un changement intervient (nouveau prestataire, changement de point de contact, fin de contrat).</p>`,
      action_prioritaire: `<p>Tenir un tableau à jour des prestataires : nom, prestation, criticité, contact opérationnel, contact de secours, modalités d'astreinte.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Prestataire critique injoignable en pleine crise',
            description:
              "on cherche dans des emails d'il y a deux ans le bon numéro, pendant que l'incident s'aggrave.",
          },
          {
            libelle: 'Sous-traitants oubliés',
            description:
              "un prestataire SaaS marginal mais sensible (RH, comptabilité) n'apparaît nulle part, et personne ne sait qui prévenir si l'outil tombe.",
          },
          {
            libelle: 'Coordonnées périmées',
            description:
              "le contact principal est parti depuis six mois, le mail rebondit, et l'astreinte n'est jamais activée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ECOSYSTEME.2')
    .update({
      explications: `<p>Tout ce qui entre et sort de votre SI passe par une interconnexion : VPN partenaire, SaaS, télémaintenance, intranet groupe… Plus elles sont nombreuses, plus elles sont oubliables. Et une interconnexion oubliée, c'est une porte que personne ne surveille.</p>
<p>L'idée ici est simple : lister toutes les interconnexions de votre SI vers tout autre système (externe ou interne), et pour chacune, identifier un point de contact opérationnel. À mettre à jour au moins une fois par an et à chaque changement d'architecture.</p>`,
      action_prioritaire: `<p>Cartographier toutes les interconnexions : Internet, VPN partenaires, services SaaS, télémaintenance, intranet groupe. Désigner un point de contact pour chacune.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interconnexion oubliée donc non protégée',
            description:
              "un VPN ancien avec un fournisseur reste ouvert sans surveillance et devient une porte d'entrée pour l'attaquant.",
          },
          {
            libelle: 'Incident sans interlocuteur côté partenaire',
            description:
              "un flux suspect transite par une interconnexion, mais personne ne sait qui appeler chez l'autre entité pour le bloquer.",
          },
          {
            libelle: 'Architecture qui dérive',
            description:
              'les flux évoluent au fil du temps sans documentation, et personne ne sait plus exactement ce qui entre et sort du SI.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'EXO.1')
    .update({
      explications: `<p>Préparez les personnes qui devront agir en cas de cyberattaque en organisant régulièrement de courts exercices de crise.<br>
L’objectif est de simuler une attaque autour d’une table, sans toucher aux systèmes réels, pour vérifier que chacun sait quoi faire et repérer les points à améliorer.<br>
Un exercice peut durer 1 à 2 heures et ne nécessite pas forcément de budget ni de prestataire.</p>`,
      action_prioritaire: `<p>Réaliser un premier exercice de crise sur table avec un scénario prêt à l'emploi.</p>
<p>Bonne nouvelle : un exercice tient en 1 à 2 heures autour d'une table, sans budget ni prestataire.</p>`,
    });

  await knex('mesures')
    .where('id', 'FILTRE.1')
    .update({
      explications: `<p>Une fois qu'une interconnexion est ouverte, encore faut-il en contrôler le trafic. Un pare-feu bien configuré laisse passer les flux légitimes et bloque tout le reste — un pare-feu mal configuré ne sert à rien.</p>
<p>Pour chaque interconnexion entre vos systèmes et un système non maîtrisé, identifiez les communications nécessaires, puis mettez en place des règles de filtrage qui n'autorisent que ces communications-là et bloquent toutes les autres par défaut. Revoyez au moins une fois par an la mise en œuvre technique de ces règles.</p>`,
      action_prioritaire: `<p>Adopter la règle « tout bloquer par défaut, n'ouvrir que ce qui est explicitement nécessaire ». Programmer une revue annuelle des règles de filtrage.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Règles trop permissives',
            description:
              '« tout autoriser de A vers B » est en pratique impossible à contrôler, et un attaquant peut faire passer tout type de flux.',
          },
          {
            libelle: 'Règles non revues',
            description:
              "les règles s'accumulent au fil des ans, certaines sont obsolètes, d'autres se contredisent, et le pare-feu devient ingérable.",
          },
          {
            libelle: 'Logs ignorés',
            description:
              "le pare-feu journalise les blocages mais personne ne les regarde, donc les tentatives d'intrusion passent inaperçues.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.B.1-EI/EE', '7.B.3-EI/EE', '7.B.5-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'FILTRE.8')
    .update({
      explications: `<p>Installez un (ou plusieurs) pare-feu dédiés pour contrôler les échanges entre votre organisation et l’extérieur : internet, partenaires, prestataires ou services en ligne.</p>
<p>Le pare-feu agit comme un filtre : il laisse passer les connexions autorisées et bloque celles qui semblent suspectes. Il doit être configuré pour cet usage précis, idéalement avec un équipement ou un logiciel dédié à cette fonction.</p>`,
    });

  await knex('mesures')
    .where('id', 'INCIDENT.3')
    .update({
      explications: `<p>Vos outils de sécurité (antivirus, EDR, pare-feu, supervision) génèrent en permanence des alertes. Certaines sont du bruit, d'autres sont de vrais signaux. Sans analyse, tout se noie.</p>
<p>Un événement de sécurité ne devient un incident qu'après analyse. Vous devez donc mettre en place des mécanismes pour analyser et qualifier les événements de sécurité remontés (par vos outils, par vos utilisateurs, par vos prestataires) et identifier les incidents potentiels ou avérés.</p>`,
      action_prioritaire: `<p>Désigner une personne responsable de la qualification des événements. Définir une grille simple (incident / non-incident / à investiguer) et la documenter.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Alertes non triées',
            description:
              "l'antivirus, le pare-feu, l'EDR remontent des alertes en masse, mais personne ne les analyse, et un vrai incident se noie dans le bruit.",
          },
          {
            libelle: 'Signal faible ignoré',
            description:
              "un événement subtil (une connexion à 3h du matin, un nouveau compte admin) passe inaperçu, alors qu'il signait une compromission.",
          },
          {
            libelle: 'Absence de qualification',
            description:
              "les incidents potentiels remontent sans grille d'analyse, et chaque cas est traité différemment selon l'humeur ou la disponibilité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'INCIDENT.5')
    .update({
      explications: `<p>Quand un incident survient, les traces techniques sont précieuses : elles permettent de comprendre ce qui s'est passé, et de constituer des preuves en cas de dépôt de plainte ou de contrôle.</p>
<p>Conservez les relevés techniques produits dans le cadre de la gestion des incidents (rapport d'analyse, alertes remontées par les outils, etc.). La durée de conservation doit être pertinente au regard de la protection des données à caractère personnel (notamment de la finalité du traitement).</p>`,
      action_prioritaire: `<p>Définir un registre centralisé des incidents et une durée de conservation par type de relevé (rapports d'analyse, journaux, copies forensic, etc.).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Preuves perdues',
            description:
              "les éléments techniques d'un incident sont effacés (par méconnaissance ou par réflexe de redémarrage), rendant l'analyse a posteriori impossible.",
          },
          {
            libelle: 'Impossibilité de prouver les faits',
            description: "un dépôt de plainte ou une notification CNIL bute sur l'absence de preuve documentée.",
          },
          {
            libelle: 'Conservation excessive ou insuffisante',
            description:
              'les relevés contiennent des données personnelles conservées trop longtemps (risque RGPD) ou supprimées trop vite (perte de preuve).',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.1')
    .update({
      explications: `<p>Chaque équipement connecté à votre réseau est un point d'entrée potentiel. Un PC personnel infecté, un équipement de visiteur, un téléphone d'un partenaire : autant de risques si rien n'encadre les connexions.</p>
<p>Vous devez donc définir les équipements (terminaux et ressources matérielles) autorisés à se connecter à vos systèmes, et mettre en œuvre des mesures techniques ou organisationnelles pour empêcher la connexion d'autres équipements. Cela inclut la possibilité d'autoriser le BYOD (Apportez Votre Équipement de Communication / Bring Your Own Device) — à condition que les équipements personnels concernés aient été identifiés et autorisés.</p>`,
      action_prioritaire: `<p>Lister les postes de travail autorisés à se connecter aux systèmes de l'entité.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Équipement personnel infecté qui contamine le réseau',
            description: 'un ordinateur portable familial branché au réseau apporte un virus invisible au quotidien.',
          },
          {
            libelle: 'Équipement de visiteur connecté sans contrôle',
            description: 'une prise réseau libre dans une salle de réunion permet à quiconque de se brancher au SI.',
          },
          {
            libelle: 'Pas de Wi-Fi visiteur isolé',
            description:
              "visiteurs et collaborateurs partagent le même réseau, et la séparation des usages n'existe pas.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.3')
    .update({
      explications: `<p>Installez une protection contre les logiciels malveillants sur les équipements utilisés par votre organisation : ordinateurs, serveurs et mobiles professionnels.</p>
<p>Cette protection peut être un antivirus ou une solution plus avancée (ex. EDR). Elle doit rester à jour pour détecter les menaces récentes. Les alertes doivent aussi être vérifiées et traitées régulièrement.</p>
<p>De plus, analysez les fichiers provenant de l’extérieur avant leur ouverture (notamment les pièces jointes reçues par email, les clés USB et les autres supports externes) afin de vous assurer de l’absence de virus.</p>`,
      action_prioritaire: `<p>Vérifier que la protection antivirus est active et à jour sur tous les postes de travail.</p>
<p>Bonne nouvelle : Certains OS proposent un antivirus activé par défaut, qui couvre déjà la base sur les postes. Et si la messagerie est gérée par un éditeur en nuage, l'analyse des pièces jointes est déjà réalisée côté serveur.</p>`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['5.B.2-EI/EE', '9.6-EI/EE', '9.7-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.7')
    .update({
      explications: `<p>Les supports amovibles — clés USB, disques durs externes, smartphones, tablettes, PC portables — sont pratiques mais aussi un vecteur classique d'incident. Une clé branchée par curiosité, un disque ramené de chez soi, et le virus circule.</p>
<p>L'idée n'est pas d'interdire complètement, mais de limiter aux seuls supports nécessaires à vos activités et services (ou au maintien en condition opérationnelle et de sécurité). Les supports d'origine inconnue ou non maîtrisée doivent être proscrits.</p>`,
      action_prioritaire: `<p>Inscrire dans la charte d'usage l'interdiction de brancher des supports inconnus. Mettre à disposition des supports professionnels chiffrés pour les besoins métiers.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Clé USB trouvée ou offerte',
            description:
              "un collaborateur branche par curiosité une clé inconnue, et un code malveillant s'installe automatiquement.",
          },
          {
            libelle: 'Fuite de données par copie sur support personnel',
            description: 'un collaborateur emporte des données sensibles sur sa propre clé USB, sans contrôle.',
          },
          {
            libelle: 'Multiplication des supports en circulation',
            description:
              "sans inventaire des supports professionnels, l'entité ne sait plus combien de clés ou de disques externes circulent, ni qui les détient.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.3')
    .update({
      explications: `<p>Des vulnérabilités sont découvertes chaque semaine, des campagnes d'attaques visent régulièrement certains éditeurs ou certains équipements. Sans veille active, vous l'apprenez quand c'est trop tard.</p>
<p>Cette veille porte sur les vulnérabilités, les correctifs de sécurité et les mesures d'atténuation susceptibles de concerner vos applicatifs et équipements. Plusieurs sources possibles :</p>
<ul>
<li>les fournisseurs ou fabricants de vos applicatifs et équipements ;</li>
<li>des prestataires contractualisés pour réaliser cette veille ;</li>
<li>des centres de prévention et d'alerte en cybersécurité (CERT-FR, CSIRT régionaux ou sectoriels).</li>
</ul>`,
      action_prioritaire: `<p>S'abonner aux bulletins du CERT-FR et aux flux d'alerte des principaux éditeurs utilisés. Désigner une personne responsable de la veille hebdomadaire.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Faille critique non détectée',
            description:
              "un avis CERT-FR alerte sur une vulnérabilité majeure, mais personne dans l'entité ne le voit passer; la vulnérabilité persiste et finit par être exploitée.",
          },
          {
            libelle: 'Veille fragmentée et tardive',
            description:
              'chaque admin surveille ses propres outils dans son coin, et les vulnérabilités transverses tombent entre les chaises.',
          },
          {
            libelle: "Campagne d'attaque en cours ignorée",
            description:
              "un rançongiciel cible massivement un éditeur précis, l'alerte est publique, mais l'entité l'apprend une fois touchée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.4')
    .update({
      explications: `<p>Quand un correctif de sécurité est publié, c'est généralement parce qu'une vulnérabilité est connue. Plus vous tardez à l'appliquer, plus la fenêtre d'attaque reste ouverte — et les attaquants ne s'en privent pas.</p>
<p>Le principe est de mettre en oeuvre :</p>
<ul>
<li><strong>sans délai</strong> : les actions visant à l'installation des correctifs de sécurité (tests, préparation, planification) ;</li>
<li><strong>sans retard injustifié</strong> : l'application effective des correctifs après ces actions.</li>
</ul>
<p>Cette exigence s'applique sur les équipements et applicatifs exposés à des systèmes d'information tiers (serveurs web, pare-feu, messagerie en ligne) et sur les postes de travail des utilisateurs. Si des raisons techniques ou opérationnelles empêchent l'installation d'un correctif, mettez en œuvre des mesures d'atténuation (isolation, contrôle d'accès renforcé, surveillance accrue).</p>`,
      action_prioritaire: `<p>Activer les mises à jour automatiques partout où c'est possible (OS, navigateurs, applications, équipements réseau). Définir un délai cible (le plus court possible) pour les correctifs critiques sur les équipements exposés et les postes de travail.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Faille publique exploitée alors qu'un correctif existe",
            description:
              "un attaquant utilise une vulnérabilité dont le correctif est sorti depuis des mois mais n'a pas été appliqué.",
          },
          {
            libelle: 'Correctif planifié mais jamais appliqué',
            description:
              "la procédure prévoit l'installation, mais sans suivi opérationnel le déploiement traîne et la fenêtre d'exposition s'allonge.",
          },
          {
            libelle: 'Pas de plan B pour les équipements impossibles à mettre à jour',
            description:
              "un applicatif métier ne supporte pas le correctif, et l'entité ne met aucune mesure compensatoire en place.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.5')
    .update({
      explications: `<p>Installez les mises à jour de sécurité sur tous vos équipements, dès qu'elles sont proposées. Cela concerne aussi bien les ordinateurs et les serveurs que la box internet, les routeurs, les imprimantes, les caméras de surveillance, les terminaux de paiement et tous les autres objets connectés de l'entreprise. Chacun fait tourner un logiciel qui contient, tôt ou tard, des failles : les mises à jour servent justement à les corriger avant qu'un attaquant ne les exploite.<br>
Pour que ces mises à jour existent, encore faut-il que le logiciel soit dans une version encore suivie par son éditeur ou son fabricant. Quand un produit atteint sa « fin de support », il ne reçoit plus aucun correctif : les nouvelles failles découvertes restent ouvertes en permanence, et l'équipement devient une porte d'entrée pour les attaquants, même s'il fonctionne encore normalement. Il faut alors le remplacer ou le mettre à niveau vers une version toujours maintenue.</p>`,
      action_prioritaire: `<p>Mettre à jour en priorité :</p>
<ul>
<li>les pares-feux,</li>
<li>les équipements (postes de travail, téléphones, etc.) et serveurs exposés sur internet.</li>
</ul>
<p>Bonne nouvelle : les solutions en nuage sont mises à jour par l'éditeur — vous n'avez rien à faire. Sur les postes, Windows, macOS, certaines distributions Linux, les navigateurs et les smartphones se mettent à jour automatiquement par défaut. Il suffit de vérifier que l'option n'a pas été désactivée et de ne pas reporter indéfiniment les redémarrages.</p>`,
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.6')
    .update({
      explications: `<p>Un logiciel ou un système qui n'est plus suivi par son éditeur ne reçoit plus de correctifs : les vulnérabilités découvertes restent ouvertes en permanence, et n'importe quel attaquant peut les exploiter.</p>
<p>Quand des raisons techniques ou opérationnelles vous empêchent d'installer une version supportée (logiciel métier propriétaire, dépendance applicative, système incompatible avec un équipement industriel), vous devez mettre en œuvre des mesures pour réduire les risques liés à l'utilisation de cette version obsolète.</p>`,
      action_prioritaire: `<p>Pour chaque logiciel ou système obsolète : isoler du reste du SI, gérer les accès de manière renforcée, restreindre les flux entrants et sortants au strict besoin, et planifier le remplacement dans une feuille de route à 12-24 mois.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Système obsolète comme porte d'entrée durable",
            description:
              "un vieux Windows non isolé reste branché au réseau de l'entité, et un attaquant s'y installe à long terme.",
          },
          {
            libelle: 'Propagation à tout le SI',
            description:
              "une fois compromis, l'équipement obsolète sert de tremplin pour atteindre des systèmes plus récents et mieux protégés.",
          },
          {
            libelle: 'Pas de plan de remplacement',
            description: "l'obsolescence dure depuis des années, sans budget ni échéance pour migrer.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.7')
    .update({
      explications: `<p>Télécharger un installateur sur un site miroir non officiel, c'est risquer de récupérer une version modifiée — avec, en bonus, un code malveillant. Les attaques par chaîne logicielle commencent souvent là.</p>
<p>La règle est simple : toute nouvelle version d'un logiciel ou d'un firmware doit être téléchargée depuis les ressources officielles mises à disposition par les éditeurs ou les fournisseurs.</p>`,
      action_prioritaire: `<p>Imposer comme règle que toute mise à jour provienne du site officiel de l'éditeur.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Logiciel piégé installé sciemment',
            description:
              'un administrateur télécharge depuis un site miroir non officiel un installateur modifié qui embarque une porte dérobée.',
          },
          {
            libelle: 'Attaque par chaîne logicielle',
            description: "une mise à jour piratée se propage à tous les équipements de l'entité avant détection.",
          },
          {
            libelle: "Pas de vérification d'intégrité",
            description:
              "aucune empreinte (hash, signature) n'est contrôlée, et des fichiers altérés passent en production.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PHYS.1')
    .update({
      explications: `<p>La sécurité physique fait partie de la cybersécurité. Un visiteur qui entre seul dans une salle serveur peut faire autant de dégâts qu'un attaquant à distance — débrancher un serveur, brancher un équipement pirate, voler un disque.</p>
<p>Concrètement, vous devez restreindre l'accès aux locaux (bureaux, salles serveurs, locaux techniques, etc.) à l'aide de mesures de sécurité adaptées : registre des visiteurs, badges d'accès, serrures, contrôles d'accès électroniques. Et vous assurer que les personnes externes accédant aux locaux techniques et aux salles serveurs sont accompagnées ou dûment autorisées.</p>`,
      action_prioritaire: `<p>Mettre en place un registre des visiteurs et un contrôle d'accès simple à la salle serveur. Imposer l'accompagnement systématique des prestataires en local technique.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Intrusion physique non détectée',
            description:
              "un visiteur s'introduit dans une salle technique sans être inquiété, débranche un serveur ou installe un équipement pirate.",
          },
          {
            libelle: 'Prestataire non accompagné',
            description:
              "un technicien externe accède seul à la salle serveur, sans contrôle ni traçabilité, et personne ne sait ce qu'il y a fait.",
          },
          {
            libelle: 'Badges et clés laissés derrière soi',
            description:
              'un ancien collaborateur conserve son badge des semaines après son départ et peut revenir sans alerte.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['6.1-EI/EE', '6.4-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'PSSI.1')
    .update({
      explications: `<p>La politique de sécurité des systèmes d'information (PSSI), c'est le document de référence qui dit comment vous prenez la sécurité numérique au sérieux dans votre entité. Sans elle, chacun fait un peu comme il pense — avec elle, vous avez un cadre commun.</p>
<p>Concrètement, elle doit aborder :</p>
<ul>
<li>l'organisation de la gouvernance de la sécurité (qui décide, qui fait quoi) ;</li>
<li>vos orientations et objectifs stratégiques en matière de sécurité numérique ;</li>
<li>l'engagement du dirigeant à respecter les exigences légales applicables (RGPD, NIS2 le cas échéant, exigences sectorielles).</li>
</ul>
<p>Elle doit aussi tenir compte des spécificités de votre secteur d'activité, et être formellement approuvée par votre dirigeant exécutif.</p>`,
      action_prioritaire: `<p>Rédiger une PSSI courte (5 à 10 pages pour une TPE/PME) couvrant les rubriques imposées : gouvernance, objectifs stratégiques, engagement dirigeant, exigences sectorielles. La faire approuver formellement et la diffuser en interne.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sécurité au coup par coup',
            description:
              "sans cadre formalisé, chaque mesure est prise isolément, sans cohérence d'ensemble, et certains pans entiers (sauvegarde, accès, sous-traitance) restent oubliés.",
          },
          {
            libelle: 'Engagement du dirigeant flou',
            description:
              "sans signature ni approbation formelle, la sécurité reste perçue comme l'affaire de l'IT et ne mobilise pas le management.",
          },
          {
            libelle: 'Difficulté à démontrer la conformité',
            description:
              "en cas de contrôle, d'incident ou de demande d'un partenaire, l'entité ne dispose d'aucun document de référence à présenter.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.1-EI/EE', '2.B.2-EI/EE', '2.B.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'PSSI.2')
    .update({
      explications: `<p>Le chiffrement, c'est ce qui rend une donnée illisible pour quelqu'un qui n'a pas la clé. Sans politique claire, certains documents sensibles voyagent en clair sur Internet pendant que d'autres sont sur-protégés. Une politique de chiffrement précise simplement les règles du jeu.</p>
<p>Elle doit être déclinée de la PSSI et indique quelles informations doivent être chiffrées (données sensibles, données stockées sur supports nomades, échanges Internet), quels algorithmes et protocoles utiliser, et comment gérer les clés et secrets dans le temps (création, conservation, renouvellement, révocation).</p>`,
      action_prioritaire: `<p>Identifier les données sensibles de l'entité (RH, clients, finances, propriété intellectuelle). Activer le chiffrement de disque sur tous les postes nomades et imposer le chiffrement TLS pour les échanges sensibles (messagerie, partage de fichiers cloud).</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Données sensibles exfiltrées en clair',
            description:
              'un ordinateur perdu, un disque dur volé ou une pièce jointe interceptée laissent fuiter contrats, données clients ou informations RH sans aucune protection.',
          },
          {
            libelle: 'Chiffrement mal géré',
            description:
              'la clé ou le mot de passe de déchiffrement est stocké sur le même support que la donnée, ce qui revient à ne pas chiffrer.',
          },
          {
            libelle: "Choix d'algorithmes obsolètes",
            description:
              "l'entité chiffre avec des protocoles dépréciés (SSL, vieux IPsec, etc.), donnant une fausse impression de sécurité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.3')
    .update({
      explications: `<p>Qui peut accéder à quoi ? La question vaut autant pour les locaux que pour vos applications. Cette politique réunit les deux volets — accès physique (locaux, salles serveurs, locaux techniques) et accès logique (applicatifs, données, équipements réseau) — dans un même cadre.</p>
<p>Elle doit être déclinée de la PSSI et précise qui peut accéder à quoi, dans quelles conditions, avec quels moyens d'authentification, et comment les accès sont attribués, revus et révoqués.</p>`,
      action_prioritaire: `<p>Formaliser une politique courte précisant : qui peut accéder aux locaux et systèmes, qui valide les accès, comment ils sont attribués/révoqués, et selon quelle périodicité ils sont revus.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Accès qui s'accumulent sans contrôle",
            description:
              "les nouveaux arrivants reçoivent des accès, mais ceux qui partent ou changent de poste ne sont jamais revus, et l'entité finit avec des dizaines de comptes obsolètes.",
          },
          {
            libelle: 'Aucun cadre pour les locaux sensibles',
            description:
              'la salle serveur reste accessible à tous, un visiteur peut entrer sans accompagnement, et un incident interne ne peut pas être imputé.',
          },
          {
            libelle: 'Règles non écrites donc non appliquées',
            description:
              "les bonnes pratiques existent dans la tête de l'IT mais ne sont pas formalisées — toute personne contournant les règles n'a rien à craindre.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.4')
    .update({
      explications: `<p>Définir des mesures de sécurité, c'est bien. Vérifier qu'elles sont vraiment appliquées dans le temps, c'est mieux. Cette politique précise comment et à quelle fréquence vous vous assurez que ce qui est écrit est effectivement en place.</p>
<p>Elle doit être déclinée de la PSSI et indique quelles mesures sont revues, à quelle fréquence, par qui, selon quelle méthode (auto-évaluation, audit interne, audit externe), et comment les écarts sont traités.</p>`,
      action_prioritaire: `<p>Définir un calendrier de revues : auto-évaluation au moins annuelle des principales mesures, complétée si possible par un audit externe périodique. Documenter les revues réalisées et les actions qui en découlent.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mesures qui se dégradent dans le temps',
            description:
              "une règle de filtrage modifiée pour dépanner, un compte privilégié créé en urgence, une dérogation devenue permanente — sans revue, ces dérives s'accumulent.",
          },
          {
            libelle: 'Effet trompeur de la politique sur le papier',
            description:
              "les documents existent mais personne ne vérifie qu'ils sont réellement appliqués au quotidien.",
          },
          {
            libelle: 'Difficulté à démontrer la maturité',
            description:
              "sans trace de revues régulières, l'entité ne peut pas prouver à un auditeur ou un assureur qu'elle pilote sa sécurité dans la durée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.5')
    .update({
      explications: `<p>Une politique ou une procédure non relue finit par devenir obsolète : un outil cité n'existe plus, un rôle a disparu, une nouvelle exigence réglementaire n'a pas été intégrée. Pour rester utile, un document doit vivre.</p>
<p>D'où la règle simple : vérifier au moins une fois par an que les politiques et procédures sont à jour et pertinentes, et les mettre à jour dès qu'un événement le justifie (évolution majeure de la menace, du contexte métier, technique ou organisationnel).</p>`,
      action_prioritaire: `<p>Bloquer une date annuelle de revue dans le calendrier (par exemple en lien avec la clôture comptable). Lister chaque politique et procédure avec sa date de dernière revue et sa prochaine échéance.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Politique déconnectée du terrain',
            description: "la PSSI cite des outils ou prestataires qui n'existent plus, et personne ne s'y réfère plus.",
          },
          {
            libelle: 'Évolution réglementaire ignorée',
            description:
              "une nouvelle exigence (NIS2, sectorielle) n'est jamais intégrée et l'entité se retrouve en écart sans le savoir.",
          },
          {
            libelle: 'Procédures inutilisables',
            description:
              "les procédures sont basées sur des outils ou méthodes qui ne sont plus utilisés au sein de l'entité, les rendant inutilisables.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.6')
    .update({
      explications: `<p>Les comptes utilisateurs et techniques sont la porte d'entrée de votre SI. Si leur gestion est laissée au cas par cas, on se retrouve vite avec des comptes oubliés, des mots de passe partagés sur des post-it, et personne ne sait plus qui peut faire quoi.</p>
<p>Une politique de gestion des comptes doit être déclinée de la PSSI et précise les règles de création, modification, désactivation et suppression (utilisateurs, administrateurs, comptes de service), les délais de désactivation, les règles de revue, et comment encadrer les comptes partagés quand ils sont indispensables.</p>`,
      action_prioritaire: `<p>Formaliser une politique courte qui précise : règles de nomenclature des comptes, délais de désactivation (ex. 7 jours après un départ), périodicité de revue (au moins annuelle), distinction des comptes administrateurs et utilisateurs, traitement des comptes partagés et comptes de service.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comptes fantômes',
            description:
              "des comptes d'anciens collaborateurs restent actifs des mois après leur départ, et personne ne s'en rend compte.",
          },
          {
            libelle: 'Comptes partagés non encadrés',
            description:
              "un mot de passe d'admin connu de cinq personnes circule sur des post-it, et tout incident reste impossible à imputer à un individu.",
          },
          {
            libelle: 'Création sauvage de comptes',
            description:
              "chacun crée des comptes au fil de l'eau sans nomenclature ni traçabilité, l'inventaire est impossible à reconstituer.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RECENSEMENT.1')
    .update({
      titre: `Lister les activités et les systèmes à protéger en priorité`,
      explications: `<p>Faites la liste des activités à protéger en priorité de votre organisation, même celles qui ne sont pas concernées par une obligation réglementaire. Pour chacune, indiquez la personne responsable et les outils, logiciels, équipements ou services numériques nécessaires à son fonctionnement.</p>
<p>Cette première étape permets de connaître votre environnement informatique ainsi d’identifier ce qui doit être protégé en priorité : il est difficile de sécuriser ce que l’on n’a pas clairement identifié.</p>`,
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

  await knex('mesures')
    .where('id', 'RECENSEMENT.2')
    .update({
      explications: `<p>Tous les systèmes d'information de votre entité ne se valent pas. Certains sont indispensables au quotidien, d'autres bien moins. L'idée ici est de repérer, dans votre liste de systèmes, ceux qui ne posent vraiment aucun problème en cas d'arrêt, de fuite ou de modification — pour pouvoir concentrer vos efforts de protection là où ça compte.</p>
<p>Pour chaque système, on regarde trois choses :</p>
<ul>
<li>une dégradation ou interruption affecterait-elle vos activités ou services ? (atteinte à la disponibilité)</li>
<li>des informations sensibles pourraient-elles être divulguées à des personnes non autorisées ? (atteinte à la confidentialité)</li>
<li>des informations nécessaires à vos activités pourraient-elles être altérées ? (atteinte à l'intégrité)</li>
</ul>`,
      action_prioritaire: `<p>Pour chaque système déjà listé, se poser 3 questions :</p>
<ul>
<li>si ce système s'arrête, est-ce que mon activité est dégradée ou interrompue ?</li>
<li>si ses informations sont divulguées, est-ce un problème (RGPD, plaintes, secret commercial) ?</li>
<li>si ses informations sont modifiées à mon insu, est-ce que ça fausse mon activité ?</li>
</ul>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Arrêt prolongé d'un système clé",
            description:
              "faute d'avoir identifié les systèmes vitaux pour l'activité, aucune sauvegarde renforcée ni plan de reprise n'a été prévu — l'arrêt s'étire sur plusieurs jours.",
          },
          {
            libelle: 'Fuite de données sensibles',
            description:
              "les fichiers contenant des données clients ou stratégiques sont protégés comme n'importe quel document — un partage maladroit ou un poste compromis suffit à les exposer.",
          },
          {
            libelle: 'Modification frauduleuse passée inaperçue',
            description:
              "sans contrôle renforcé sur les systèmes qui produisent factures et données comptables, un RIB ou un montant modifié à l'insu reste invisible jusqu'au paiement.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RECENSEMENT.3')
    .update({
      explications: `<p>Votre entité évolue, vos outils aussi. Une liste écrite il y a deux ans risque vite de devenir trompeuse plus qu'utile : un prestataire a changé, un nouveau logiciel est arrivé, une activité a disparu.<br>
C'est pour cela que la liste des activités et systèmes à protéger doit être revue au moins une fois par an, et chaque fois qu'un changement significatif intervient : nouvelle activité ou nouveau service, mise en service ou retrait d'un système d'information, changement de prestataire, réorganisation interne.</p>
<p>Cette revue permet de maintenir la liste à jour, de vérifier que les classifications restent pertinentes, et d'éviter que des équipements ou services apparus en cours d'année échappent au périmètre de protection.</p>`,
      action_prioritaire: `<p>Bloquer dès maintenant une revue annuelle dans le calendrier (par exemple début d'année ou à la clôture comptable), et mettre à jour la liste sans attendre dès qu'un nouveau système est mis en service ou qu'un prestataire change.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Liste devenue obsolète',
            description:
              "on découvre lors d'un incident que la liste date de deux ans, que les serveurs ne sont plus les bons et que le prestataire a changé.",
          },
          {
            libelle: 'Nouveaux outils hors radar',
            description:
              "un CRM ou un service cloud acheté en cours d'année n'est jamais ajouté à la liste, et ne bénéficie d'aucune protection ni sauvegarde.",
          },
          {
            libelle: 'Classifications devenues fausses',
            description:
              'un système classé « non exposé » il y a 18 mois traite désormais des données clients, mais reste hors du périmètre de protection.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.1')
    .update({
      explications: `<p>Une charte d'utilisation des systèmes d'information fixe les règles du jeu pour tous ceux qui utilisent vos outils numériques : ce qui est autorisé, ce qui ne l'est pas, et les bons réflexes au quotidien. Bien rédigée et opposable, elle protège l'entité comme les utilisateurs.</p>
<p>Elle doit prévoir des dispositions spécifiques pour les administrateurs (qui ont plus de pouvoirs, donc plus de responsabilités). Elle peut aussi couvrir les systèmes d'information pour lesquels l'entité a décidé de ne pas appliquer les objectifs de sécurité, afin d'en encadrer l'usage.</p>`,
      action_prioritaire: `<p>S'appuyer sur le guide ANSSI « Charte d'utilisation des moyens informatiques » pour rédiger une charte courte (5 à 8 pages), la faire signer à chaque utilisateur (annexée au contrat de travail ou au règlement intérieur), et l'intégrer au parcours d'arrivée.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comportements à risque non encadrés',
            description:
              "usages personnels, connexion d'équipements externes, transfert vers mails personnels — sans charte, aucun cadre, aucune sanction possible.",
          },
          {
            libelle: 'Charte non opposable juridiquement',
            description:
              "la charte existe mais n'a jamais été signée ni intégrée au règlement intérieur, donc inutilisable en cas de litige.",
          },
          {
            libelle: 'Cas particuliers des administrateurs ignorés',
            description:
              "les pouvoirs élevés des admins ne sont pas encadrés, alors qu'un mauvais usage peut faire bien plus de dégâts qu'un comportement standard.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.2')
    .update({
      explications: `<p>Informez toutes les personnes qui utilisent vos outils numériques — salariés, administrateurs, prestataires — sur les principaux risques cyber et les bons réflexes à adopter. Cela doit être réalisé régulièrement afin d'aider ces personnes à apprendre à se protéger et à protéger votre organisation.</p>
<p>Cette sensibilisation doit être prévue dès l’arrivée dans l’organisation, puis rappelée dans le temps, par exemple via des messages réguliers ou des exercices simples.</p>`,
      action_prioritaire: `<p>Organiser un premier temps d'échange collectif sur les bonnes pratiques cyber, en s'appuyant sur les ressources fournies dans le tutoriel. À renouveler à intervalle régulier.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Clic sur un lien piégé',
            description:
              "un collaborateur clique sur un lien dans un faux email (par exemple une fausse facture, une fausse alerte de livraison ou un faux message bancaire), et donne sans le savoir l'accès à un pirate.",
          },
          {
            libelle: 'Manipulation par un escroc',
            description:
              'par exemple un faux dirigeant qui demande un virement urgent et confidentiel, ou un faux technicien informatique qui demande un mot de passe par téléphone.',
          },
          {
            libelle: 'Mauvais réflexes face à un incident',
            description:
              "un collaborateur non sensibilisé peut ne pas savoir qui contacter en cas d'incident, et ainsi possiblement en augmenter la gravité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.4')
    .update({
      explications: `<p>Une arrivée, un départ ou un changement de poste, c'est le moment où les accès doivent évoluer. Quand le processus est flou, on accumule des comptes d'anciens collaborateurs, on oublie de retirer des droits devenus inutiles, on perd la trace du matériel.</p>
<p>Un processus clair, co-construit avec les RH et l'IT, doit couvrir :</p>
<ul>
<li>la prise de connaissance des règles de sécurité à l'arrivée ;</li>
<li>l'attribution des accès appropriés à l'arrivée ;</li>
<li>la mise à jour des accès lors d'un changement de fonction ;</li>
<li>la restitution de tout le matériel (ex. poste de travail, téléphone professionel) et la désactivation de tous les accès logiques et physiques au départ.</li>
</ul>`,
      action_prioritaire: `<p>Établir trois check-lists simples : arrivée, changement de fonction, départ. Les co-construire entre RH, métier et IT, et les déclencher systématiquement à chaque événement.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Comptes d'anciens collaborateurs toujours actifs",
            description:
              'des accès complets restent ouverts des mois après le départ, et peuvent être réutilisés ou compromis.',
          },
          {
            libelle: 'Changement de poste oublié',
            description:
              "un collaborateur passe d'un poste sensible à un poste sans rapport, mais conserve ses anciens droits sans aucune révision.",
          },
          {
            libelle: 'Matériel non restitué',
            description:
              "un PC portable ou un smartphone professionnel part avec un collaborateur, avec les données et accès qu'il contient.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.5')
    .update({
      explications: `<p>Les personnes qui ont des responsabilités dans le domaine du numérique (responsable IT, administrateurs systèmes et réseaux, chefs de projet numériques, développeurs, RSSI) ont un impact direct sur votre niveau de sécurité. Une mauvaise configuration peut suffire à ouvrir une porte.</p>
<p>Elles doivent donc suivre un programme de formation dédié à la sécurité numérique, adapté à leurs responsabilités — à la prise de poste, puis à intervalles réguliers pour rester à jour des évolutions.</p>`,
      action_prioritaire: `<p>Identifier les personnes à former (en interne et prestataires) et planifier au moins un module annuel adapté à leur fonction. SecNumAcadémie (ANSSI) offre une base gratuite.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Erreur de configuration aux conséquences lourdes',
            description:
              'un administrateur peu formé ouvre un port, désactive un contrôle ou affecte des droits trop larges — et un attaquant en profite.',
          },
          {
            libelle: 'Pratiques obsolètes',
            description:
              "l'équipe IT reproduit ce qu'elle sait depuis dix ans, sans intégrer les nouvelles menaces (rançongiciels, attaques sur l'identité, IA).",
          },
          {
            libelle: 'Manque de réflexes face à un incident',
            description:
              "confrontée à un signal de compromission, l'équipe applique de mauvais gestes (éteindre la machine, supprimer les logs) qui aggravent la situation et compromettent l'enquête.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ROLE.3')
    .update({
      explications: `<p>La sécurité numérique ne se porte pas toute seule : il faut quelqu'un pour la prendre en charge, des règles de qui fait quoi, et des moments réguliers pour en discuter. C'est ce qu'on appelle une organisation de la sécurité.</p>
<p>En pratique, cela passe notamment par :</p>
<ul>
<li>la désignation d'un responsable de la sécurité numérique (interne ou externe) ;</li>
<li>l'établissement d'un RACI sur les principales activités (qui est Responsable, qui Approuve, qui est Consulté, qui est Informé) ;</li>
<li>la mise en place d'une comitologie : des instances qui se réunissent régulièrement pour piloter la sécurité.</li>
</ul>`,
      action_prioritaire: `<p>Désigner formellement un référent en sécurité numérique (interne ou prestataire) et le faire connaître à tous.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Personne ne porte la sécurité',
            description:
              'sans rôle nommé, chacun se renvoie la balle, et les décisions ne sont pas prises ou prises trop tard.',
          },
          {
            libelle: "Conflits d'intérêts non gérés",
            description:
              'la même personne est juge et partie (par exemple le prestataire IT contrôle sa propre conformité), ce qui fragilise toute la démarche.',
          },
          {
            libelle: "Absence d'instance de pilotage",
            description:
              'aucun comité ne discute des risques ni des arbitrages budgétaires, et les sujets de sécurité ne remontent jamais en direction.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ROLE.5')
    .update({
      explications: `<p>La cybersécurité n'est pas qu'un sujet technique : c'est un enjeu stratégique qui engage l'entité dans son ensemble. À ce titre, c'est le dirigeant exécutif qui doit en être le responsable final — et notamment du suivi de la conformité des systèmes d'information aux exigences applicables.</p>
<p>Il peut s'appuyer sur un référent en sécurité numérique pour l'opérationnel, mais la responsabilité finale lui revient. Elle se matérialise notamment par l'approbation formelle de la PSSI.</p>`,
      action_prioritaire: `<p>Faire approuver formellement la PSSI par le dirigeant.</p>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Sécurité reléguée à l'IT",
            description:
              'le dirigeant considère la cybersécurité comme un sujet technique, et personne au sommet ne tranche les arbitrages budgétaires.',
          },
          {
            libelle: 'Décisions critiques prises sans le dirigeant',
            description:
              'payer une rançon, communiquer à des clients après une fuite, déposer plainte — autant de décisions qui appellent un mandat explicite et ne peuvent pas attendre.',
          },
          {
            libelle: 'Responsabilité juridique',
            description:
              "en cas de manquement majeur (RGPD, NIS2), c'est le dirigeant qui sera tenu pour responsable face aux autorités — autant l'organiser en amont.",
          },
        ]),
      ]),
    });

  // Correction de l'affectation aux modules du parcours de sécurisation (modules 2 à 6 intervertis)
  const nouvelleAffectationModules: [string, number, number][] = [
    // module 2 — Perte de maîtrise de son entité
    ['RECENSEMENT.2', 2, 2010],
    ['RECENSEMENT.3', 2, 2020],
    ['CONTRAT.1', 2, 2030],
    ['CONTRAT.2', 2, 2040],
    ['ECOSYSTEME.1', 2, 2050],
    ['ECOSYSTEME.2', 2, 2060],
    ['RH.1', 2, 2070],
    ['RH.4', 2, 2080],
    ['RH.5', 2, 2090],
    // module 3 — Exposition accrue à la menace cyber
    ['CONFORMITE.1', 3, 3010],
    ['CONFORMITE.2', 3, 3020],
    ['PSSI.1', 3, 3030],
    ['PSSI.2', 3, 3040],
    ['PSSI.3', 3, 3050],
    ['PSSI.6', 3, 3060],
    ['PSSI.4', 3, 3070],
    ['PSSI.5', 3, 3080],
    ['ROLE.3', 3, 3090],
    ['ROLE.5', 3, 3100],
    // module 4 — Exploitation de faille dans la défense
    ['CARTO.1', 4, 4010],
    ['MCO_MCS.3', 4, 4020],
    ['MCO_MCS.4', 4, 4030],
    ['MCO_MCS.6', 4, 4040],
    ['MCO_MCS.7', 4, 4050],
    ['PHYS.1', 4, 4060],
    ['CLOISON.1', 4, 4070],
    ['CLOISON.5', 4, 4080],
    ['FILTRE.1', 4, 4090],
    ['MALWARE.1', 4, 4100],
    ['MALWARE.7', 4, 4110],
    // module 5 — Gestion des comptes et droits
    ['DISTANCE.1', 5, 5010],
    ['COMPTE.1', 5, 5020],
    ['COMPTE.2', 5, 5030],
    ['COMPTE.4', 5, 5060],
    ['DROITS.2', 5, 5090],
    ['COMPADMIN.12', 5, 5100],
    // module 6 — Aggravation des conséquences d'un incident ou d'une crise
    ['INCIDENT.3', 6, 6010],
    ['INCIDENT.5', 6, 6020],
    ['CONTINU.2', 6, 6030],
    ['CRISE.1', 6, 6040],
    ['CRISE.2', 6, 6050],
    ['CRISE.9', 6, 6060],
  ];
  for (const [id, id_module, ordre] of nouvelleAffectationModules) {
    await knex('mesures').where('id', id).update({ id_module, ordre });
  }

  // Suppression des mesures retirées du référentiel (remplacées par de nouvelles références ReCyF)
  await knex('prises_en_compte').whereIn('id_mesure', ['AUTH.5', 'COMPTE.3', 'DROITS.1']).del();
  await knex('mesures').whereIn('id', ['AUTH.5', 'COMPTE.3', 'DROITS.1']).del();

  // Insertion des nouvelles mesures introduites par le nouveau référentiel de sécurisation
  await knex('mesures').insert([
    {
      id: 'COMPTE.5',
      id_module: 5,
      ordre: 5040,
      titre: `Désactiver et supprimer les comptes sans privilèges non nécessaires dans un délai formalisé`,
      phrase_accroche: ``,
      explications: `<p>Un compte utilisateur qui ne sert plus mais reste actif, c'est une cible facile pour un attaquant : il est souvent moins surveillé qu'un compte à privilèges, et sa compromission ouvre malgré tout un accès à l'entité. Il faut donc fixer des délais clairs pour désactiver tout compte sans privilèges devenu inutile.<br>
Formalisez une procédure de suppression des comptes sans privilèges inactifs ou non nécessaires, qui prend en compte les délais de désactivation prévus par votre politique de gestion des comptes (par exemple sous 7 jours pour un utilisateur parti).</p>`,
      action_prioritaire: `<p>Formaliser des délais clairs pour les comptes utilisateurs : par exemple désactivation sous 7 jours au départ d'un collaborateur, et désactivation automatique des comptes inactifs depuis 3 mois.</p>`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.5-EI/EE', '11.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comptes dormants exploités',
            description:
              "un compte d'ancien collaborateur reste actif, est compromis (réutilisation de mot de passe ailleurs), et donne accès à l'entité.",
          },
          {
            libelle: 'Comptes orphelins',
            description: 'des comptes de prestataires partis ou de projets terminés restent actifs faute de procédure.',
          },
          {
            libelle: 'Délai de désactivation non respecté',
            description:
              'le départ a lieu mais le compte reste accessible pendant des semaines, créant une fenêtre d\'exposition."',
          },
        ]),
      ]),
    },
    {
      id: 'COMPTE.6',
      id_module: 5,
      ordre: 5050,
      titre: `Désactiver et supprimer les comptes à privilèges (ex. administrateurs et comptes de service) non nécessaires dans un délai formalisé`,
      phrase_accroche: ``,
      explications: `<p>Un compte à privilèges (administrateur, compte de service) qui ne sert plus est bien plus dangereux qu'un compte ordinaire : s'il est compromis, l'attaquant hérite directement de droits élevés. Il faut donc désactiver sans délai tout compte à privilèges devenu inutile.<br>
Formalisez une procédure de suppression des comptes à privilèges inactifs ou non nécessaires, qui prend en compte les délais de désactivation prévus par votre politique de gestion des comptes (par exemple désactivation immédiate à la fin d'une mission ou d'un besoin).</p>`,
      action_prioritaire: `<p>Formaliser des délais clairs pour les comptes à privilèges : par exemple désactivation immédiate à la fin de la mission ou du besoin, et revue régulière des comptes de service pour désactiver ceux qui ne sont plus utilisés.</p>`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.5-EI/EE', '11.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Compte d'administration dormant exploité",
            description:
              "un compte admin d'un prestataire ou d'un ancien exploitant reste actif et donne, s'il est compromis, un accès à droits élevés à l'entité.",
          },
          {
            libelle: 'Comptes de service orphelins',
            description:
              'des comptes techniques de projets terminés restent actifs avec leurs privilèges, sans propriétaire ni surveillance.',
          },
          {
            libelle: 'Privilèges maintenus au-delà du besoin',
            description:
              "la mission d'administration est finie mais le compte reste actif pendant des semaines, offrant une cible à fort impact.",
          },
        ]),
      ]),
    },
    {
      id: 'DROITS.3',
      id_module: 5,
      ordre: 5070,
      titre: `Restreindre les droits des comptes sur les postes de travail selon les besoins`,
      phrase_accroche: ``,
      explications: `<p>Le poste de travail est le point d'entrée le plus courant d'une attaque : une pièce jointe piégée, un site malveillant, et le code s'exécute avec les droits de l'utilisateur connecté. Si cet utilisateur est administrateur de son poste, le code malveillant l'est aussi — il peut désactiver l'antivirus, s'installer durablement et rebondir sur le reste du réseau.</p>
<p>Restreignez les droits des utilisateurs et des processus automatiques sur les postes de travail au strict besoin justifié par leurs missions. En particulier, aucun utilisateur ne doit disposer de droits d'administration sur son poste de travail, et les agents installés sur les postes ne doivent pas fonctionner avec plus de droits que nécessaire.</p>`,
      action_prioritaire: `<p>S'assurer qu'aucun poste nouvellement déployé n'attribue les droits d'administration à son utilisateur.</p>`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.2-EI/EE', '10.C.3-EI/EE', '11.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Malware qui s'installe durablement",
            description:
              "l'utilisateur est administrateur de son poste, le code malveillant hérite de ses droits et peut désactiver les protections ou s'implanter dans le système.",
          },
          {
            libelle: 'Installation de logiciels non maîtrisés',
            description:
              "chacun installe ce qu'il veut sur son poste, sans contrôle ni suivi des versions et des vulnérabilités.",
          },
          {
            libelle: "Compte d'administration utilisé au quotidien",
            description:
              'le même compte sert à consulter ses mails et à administrer le poste, donc la moindre compromission est immédiatement une compromission à droits élevés.',
          },
        ]),
      ]),
    },
    {
      id: 'DROITS.4',
      id_module: 5,
      ordre: 5080,
      titre: `Restreindre les droits des comptes sur les serveurs, équipements, services et données selon les besoins`,
      phrase_accroche: ``,
      explications: `<p>Plus un compte a de droits, plus sa compromission fait de dégâts. Le principe du moindre privilège, c'est : chacun n'a que ce qu'il lui faut, ni plus, ni moins. Cela vaut pour vos serveurs et vos équipements, mais tout autant pour vos applications métier, vos bases de données, vos partages de fichiers et vos services en ligne — c'est souvent là que se trouvent vos données les plus sensibles.</p>
<p>N'attribuez les droits d'accès à ces ressources qu'aux utilisateurs et processus automatiques qui en ont un besoin justifié par leurs missions, et uniquement pour la réalisation des activités de l'entité ou le maintien en condition opérationnelle et de sécurité.</p>`,
      action_prioritaire: `<p>Définir une matrice de droits par groupe (ou par rôle) pour les applications et les partages de fichiers contenant les données les plus sensibles, et attribuer les droits aux groupes plutôt qu'aux individus.</p>`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.2-EI/EE', '10.C.3-EI/EE', '11.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Droits trop larges hérités',
            description:
              'un collaborateur accumule des droits au fil des projets et des mobilités, et finit par accéder à des applications et des données sans rapport avec sa mission.',
          },
          {
            libelle: "Compromission d'un compte = compromission étendue",
            description:
              "si un compte disposant de droits trop larges est piraté, l'attaquant accède immédiatement à beaucoup plus de serveurs, d'applications et de données que nécessaire.",
          },
          {
            libelle: 'Accès aux ressources sensibles non contrôlé',
            description:
              'tout le monde peut consulter des dossiers RH, juridiques ou commerciaux qui devraient être restreints — un partage de fichiers ouvert à tous suffit.',
          },
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Annule l'insertion des nouvelles mesures (pas de données utilisateur possibles, elles viennent d'être créées)
  await knex('mesures').whereIn('id', ['COMPTE.5', 'COMPTE.6', 'DROITS.3', 'DROITS.4']).del();

  // Restaure les mesures supprimées, telles que reconstruites depuis l'historique des migrations.
  // Note : les éventuelles lignes `prises_en_compte` supprimées pour ces mesures ne sont PAS restaurées
  // (perte de données utilisateur assumée au rollback de cette migration).
  await knex('mesures').insert([
    {
      id: 'AUTH.5',
      id_module: 1,
      ordre: 10,
      titre: `Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l'accès aux comptes`,
      phrase_accroche: `Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨`,
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
      action_facile_a_faire: `Dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l'activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.5-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Guide ANSSI — Recommandations relatives à l'authentification multifacteur et aux mots de passe",
            url: 'https://cyber.gouv.fr/publications/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe',
          },
        ]),
      ]),
    },
    {
      id: 'COMPTE.3',
      id_module: 6,
      ordre: 6040,
      titre: `Désactiver les comptes non nécessaires dans un délai formalisé`,
      phrase_accroche: ``,
      explications: `Un compte qui ne sert plus mais reste actif, c'est une cible facile pour un attaquant. Il faut donc fixer des délais clairs pour désactiver tout compte devenu inutile.

Formalisez une procédure de suppression des comptes inactifs ou non nécessaires, qui prend en compte les délais de désactivation prévus par votre politique de gestion des comptes (par exemple sous 7 jours pour un compte utilisateur parti, immédiatement pour un compte à privilèges).`,
      action_prioritaire: `Formaliser des délais clairs : désactivation immédiate des comptes à privilèges au départ, sous 7 jours pour les comptes utilisateurs standards, et désactivation automatique des comptes inactifs depuis 3 mois.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comptes dormants exploités',
            description:
              "Un compte d'ancien collaborateur reste actif, est compromis (réutilisation de mot de passe ailleurs), et donne accès à l'entité.",
          },
          {
            libelle: 'Comptes orphelins',
            description:
              'Des comptes techniques de projets terminés ou de prestataires partis restent actifs faute de procédure.',
          },
          {
            libelle: 'Délai de désactivation non respecté',
            description:
              "Le départ a lieu mais le compte reste accessible pendant des semaines, créant une fenêtre d'exposition.",
          },
        ]),
      ]),
      liens: knex.raw("'[]'::jsonb"),
    },
    {
      id: 'DROITS.1',
      id_module: 6,
      ordre: 6060,
      titre: `Attribuer les droits d'accès aux ressources selon les besoins`,
      phrase_accroche: ``,
      explications: `Plus un utilisateur a de droits, plus une compromission de son compte fait de dégâts. Le principe du moindre privilège, c'est : chacun n'a que ce qu'il lui faut, ni plus, ni moins.

N'attribuez les droits d'accès à vos ressources qu'aux utilisateurs et processus qui en ont un besoin justifié par leurs missions, et uniquement pour la réalisation des activités de l'entité ou le maintien en condition opérationnelle et de sécurité.`,
      action_prioritaire: `Adopter le principe du moindre privilège : par défaut, aucun accès sauf besoin démontré et l'appliquer en priorité aux ressources sensibles (RH, finance, données clients).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Droits trop larges hérités',
            description:
              'Un collaborateur accumule des droits au fil des projets et finit par avoir accès à des ressources sans rapport avec sa mission.',
          },
          {
            libelle: "Compromission d'un compte = compromission étendue",
            description:
              "Si un compte sur-droité est piraté, l'attaquant accède immédiatement à beaucoup plus de ressources que nécessaire.",
          },
          {
            libelle: 'Accès aux ressources sensibles non contrôlé',
            description:
              'Tout le monde peut consulter des dossiers RH, juridiques ou commerciaux qui devraient être restreints.',
          },
        ]),
      ]),
      liens: knex.raw("'[]'::jsonb"),
    },
  ]);

  // Annule la correction de l'affectation aux modules (retour à l'affectation d'avant cette migration)
  const ancienneAffectationModules: [string, number, number][] = [
    // module 4 — Perte de maîtrise de son entité
    ['RECENSEMENT.2', 4, 4010],
    ['RECENSEMENT.3', 4, 4020],
    ['CONTRAT.1', 4, 4030],
    ['CONTRAT.2', 4, 4040],
    ['ECOSYSTEME.1', 4, 4050],
    ['ECOSYSTEME.2', 4, 4060],
    ['RH.1', 4, 4070],
    ['RH.4', 4, 4080],
    ['RH.5', 4, 4090],
    // module 5 — Exposition accrue à la menace cyber
    ['CONFORMITE.1', 5, 5010],
    ['CONFORMITE.2', 5, 5020],
    ['PSSI.1', 5, 5030],
    ['PSSI.2', 5, 5040],
    ['PSSI.3', 5, 5050],
    ['PSSI.6', 5, 5060],
    ['PSSI.4', 5, 5070],
    ['PSSI.5', 5, 5080],
    ['ROLE.3', 5, 5090],
    ['ROLE.5', 5, 5100],
    ['CLOISON.1', 5, 5110],
    ['CLOISON.5', 5, 5120],
    ['FILTRE.1', 5, 5130],
    // module 3 — Exploitation de faille dans la défense
    ['CARTO.1', 3, 3010],
    ['MCO_MCS.3', 3, 3020],
    ['MCO_MCS.4', 3, 3030],
    ['MCO_MCS.6', 3, 3040],
    ['MCO_MCS.7', 3, 3050],
    ['PHYS.1', 3, 3060],
    ['MALWARE.1', 3, 3070],
    ['MALWARE.7', 3, 3080],
    // module 6 — Gestion des comptes et droits
    ['DISTANCE.1', 6, 6010],
    ['COMPTE.1', 6, 6020],
    ['COMPTE.2', 6, 6030],
    ['COMPTE.4', 6, 6050],
    ['DROITS.2', 6, 6070],
    ['COMPADMIN.12', 6, 6080],
    // module 2 — Aggravation des conséquences d'un incident ou d'une crise
    ['INCIDENT.3', 2, 2010],
    ['INCIDENT.5', 2, 2020],
    ['CONTINU.2', 2, 2030],
    ['CRISE.1', 2, 2040],
    ['CRISE.2', 2, 2050],
    ['CRISE.9', 2, 2060],
  ];
  for (const [id, id_module, ordre] of ancienneAffectationModules) {
    await knex('mesures').where('id', id).update({ id_module, ordre });
  }

  await knex('mesures').where('id', 'ANNUAIRE.1').update({
    explications: `Installez les mises à jour de sécurité sans tarder sur votre annuaire, l'outil qui gère les comptes de vos utilisateurs, leurs mots de passe et ce à quoi chacun a le droit d'accéder. C'est un peu le trousseau de clés et le registre de votre entreprise réunis au même endroit : si un attaquant met la main dessus, il peut se faire passer pour n'importe quel salarié et ouvrir toutes les portes. C'est pour cette raison que les mises à jour de sécurité de l'annuaire doivent être appliquées en priorité, avant celles des autres équipements.`,
    action_prioritaire: `Si votre organisation dispose d'un annuaire centralisé, demandez à votre prestataire IT (ou responsable IT interne) de confirmer que les mises à jour de sécurité y sont appliquées en priorité, avant celles des postes.`,
  });

  await knex('mesures')
    .where('id', 'AUTH.1')
    .update({
      explications: `Avant d’utiliser un nouvel équipement ou logiciel, remplacez toujours les mots de passe et identifiants configurés par défaut par les fournisseurs.

Ces accès “sortie d’usine” sont souvent connus, faciles à retrouver ou identiques pour de nombreux utilisateurs. Ils peuvent donc permettre à une personne malveillante d’accéder facilement à votre box, routeur, caméra, imprimante, serveur de fichiers ou application métier.

Avant de choisir une solution, vérifiez qu’il est possible de modifier ces accès. Si ce n’est pas possible, il vaut mieux choisir une autre solution.`,
      action_prioritaire: `Vérifier et modifier les mots de passe par défaut en priorité sur :
<ul><li>les équipements de sécurité (ex. pare-feu),</li><li>les logiciels exposés sur internet,</li><li>les équipements réseaux (ex. box internet).</li></ul>`,
    });

  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      titre: `Utiliser des mots de passe robustes sur l'ensemble des comptes`,
      phrase_accroche: `Évitez les mots de passe faciles à deviner 🗝️`,
      explications: `Utiliser des mots de passe suffisamment longs et difficiles à deviner pour protéger tous les comptes de l’organisation.

Le niveau de protection attendu dépend de la sensibilité de l’accès : plus un compte donne accès à des informations ou outils importants, plus les secrets le protégeant, comme par exemple le mot de passe, doit être robuste.

À titre indicatif, voici la longueur minimale d’un mot de passe utilisant à la fois minuscules, majuscules, chiffres et caractères spéciaux :
accès peu ou moyennement sensible : 9 à 11 caractères ;
accès sensible : 12 à 14 caractères ;
accès très sensible : 15 caractères ou plus.
En cas de doute sur le niveau de sensibilité d'un accès, retenez la borne supérieure : 12 caractères minimum est un bon réflexe par défaut.

Pour plus de précision, ou si un autre type de secret est utilisé (ex. certificat), appliquer les recommandations du guide “Authentification multifacteur et mots de passe”`,
      action_prioritaire: `Installer un gestionnaire de mots de passe et l'utiliser pour générer des mots de passe robustes — en priorité les mots de passe de la messagerie et les accès administrateur.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mot de passe deviné par un programme automatisé',
            description:
              'un mot de passe trop court ou trop simple (comme « 123456 » ou « azerty ») peut être trouvé par un logiciel en quelques secondes seulement.',
          },
          {
            libelle: "Mot de passe deviné à partir d'informations personnelles",
            description:
              'si votre mot de passe contient le prénom de vos enfants, votre date de naissance ou le nom de votre équipe favorite, un pirate peut le retrouver à partir de vos réseaux sociaux.',
          },
          {
            libelle: "Réutilisation d'un mot de passe déjà piraté ailleurs",
            description:
              "si vous utilisez le même mot de passe sur plusieurs sites, et qu'un de ces sites se fait pirater, vos identifiants servent automatiquement à tenter de se connecter à tous vos autres comptes (messagerie, banque, outils professionnels).",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.5-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CARTO.1')
    .update({
      explications: `En cas d'alerte de sécurité ou d'incident, vous devez pouvoir répondre rapidement à deux questions : « qui est concerné chez nous ? » et « comment limiter les conséquences ? ». La cartographie de vos systèmes d'information, c'est ce qui vous permet d'y répondre sans tout chercher à la main.

Son niveau de détail doit être suffisant pour :
- assurer le maintien en condition opérationnelle et de sécurité des systèmes (par exemple identifier les ressources vulnérables suite à une alerte) ;
- réagir sans retard injustifié à un incident de sécurité (par exemple identifier les équipements affectés et limiter la propagation).`,
      action_prioritaire: `Produire au moins un schéma de réseau simplifié (équipements, zones IP, interconnexions) et un inventaire des serveurs / applications critiques. Tenir à jour à chaque évolution.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Veille vulnérabilité inexploitable',
            description:
              "Une alerte de sécurité tombe, mais l'entité ne peut pas dire quels systèmes sont impactés — il faut tout chercher à la main.",
          },
          {
            libelle: "Incident qui s'étend faute de visibilité",
            description:
              "On ne sait pas quels équipements sont connectés à la machine compromise, donc impossible de l'isoler proprement.",
          },
          {
            libelle: 'Cartographie écrite une fois pour toutes, jamais mise à jour',
            description: "Le schéma date d'il y a quatre ans, le SI a changé, le document trompe plus qu'il n'aide.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CLOISON.1')
    .update({
      explications: `Si votre réseau est « à plat », n'importe quelle machine peut parler à n'importe quelle autre — et un attaquant qui compromet un poste peut rebondir partout. Le cloisonnement, c'est ce qui empêche un incident sur un système d'en contaminer d'autres.

Vous devez cloisonner physiquement ou logiquement vos systèmes d'information vis-à-vis des systèmes non maîtrisés — c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués. Ce cloisonnement peut être réalisé par exemple par VLAN (réseau), par machine virtuelle (calcul) ou par volume distinct (stockage).`,
      action_prioritaire: `Cloisonner les SI maîtrisés de l'entité des SI tiers (partenaires, prestataires en hébergement chez l'entité) et des équipements personnels ou visiteurs (par exemple via des VLAN distincts).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Compromission qui se propage à tout le SI',
            description:
              "Une fois un équipement attaqué, l'absence de cloisonnement permet à l'attaquant de rebondir partout sans obstacle.",
          },
          {
            libelle: 'Système non maîtrisé qui contamine les SI maîtrisés',
            description:
              "Un serveur partagé avec un partenaire, mal sécurisé, devient le point d'entrée pour l'attaque.",
          },
          {
            libelle: 'Impossibilité de circonscrire un incident',
            description:
              "Faute de zones séparées, on doit débrancher tout le réseau pour stopper la propagation, paralysant toute l'activité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CLOISON.5')
    .update({
      explications: `Chaque interconnexion entre vos systèmes et un système non maîtrisé (c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués) est une porte potentielle. Moins il y en a, plus c'est facile à surveiller.

Le principe : on n'ouvre que ce qui est démontrable et justifié pour vos activités, vos services, ou pour le maintien en condition opérationnelle et de sécurité. Toutes les autres interconnexions doivent rester fermées.`,
      action_prioritaire: `Établir la matrice des flux : pour chaque interconnexion, justification métier, flux autorisés, point de contact. Fermer toute interconnexion sans justification ou sans usage.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interconnexion héritée et oubliée',
            description:
              "Un VPN avec un ancien partenaire reste ouvert sans usage, et devient une porte d'entrée discrète.",
          },
          {
            libelle: 'Multiplication des ouvertures sans justification',
            description: "Chaque besoin métier ponctuel se traduit par une ouverture qui n'est jamais refermée.",
          },
          {
            libelle: "Surface d'exposition mal connue",
            description:
              "Faute de matrice de flux à jour, l'entité ne sait pas combien d'interconnexions sont réellement en place ni à quoi elles servent.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPADMIN.10')
    .update({
      explications: `Séparez les comptes utilisés au quotidien des comptes réservés à l’administration.

Les actions sensibles, comme installer un logiciel, modifier une configuration ou gérer les droits d’accès, doivent être faites uniquement avec un compte administrateur dédié.

Ce compte ne doit pas servir à lire ses mails, naviguer sur internet ou travailler au quotidien. Il doit être réservé aux seules personnes autorisées.`,
      action_prioritaire: `Créer des comptes utilisateurs sur les postes de travail, et s’assurer que les comptes administrateur ne sont pas utilisés pour les tâches courantes.`,
    });

  await knex('mesures')
    .where('id', 'COMPADMIN.12')
    .update({
      explications: `L'idéal, c'est que toutes les actions d'administration se fassent depuis un compte d'administration dédié, distinct du compte utilisateur courant. Mais dans certains cas (contrainte technique, applicatif spécifique), ce n'est pas possible.

Quand c'est le cas, il faut mettre en place :
- des mesures pour assurer le contrôle des actions d'administration réalisées (ex. traçabilité renforcée, supervision) ;
- des mesures de réduction du risque lié à l'utilisation d'un compte non dédié (ex. durcissement du poste, contrôle des actions critiques).`,
      action_prioritaire: `Identifier les cas où l'utilisation d'un compte d'administration dédié n'est pas possible, et y appliquer une journalisation renforcée et un contrôle des actions sensibles.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Action d'administration depuis un compte courant compromis",
            description:
              'Un mail piégé ouvert avec un compte ayant des droits admin entraîne une prise de contrôle totale du système.',
          },
          {
            libelle: 'Absence de traçabilité',
            description:
              'Les actions admin réalisées via un compte mixte sont noyées dans les actions courantes, et impossibles à reconstituer après incident.',
          },
          {
            libelle: 'Élévation de privilèges discrète',
            description:
              "Un attaquant entré sur un poste courant exploite directement les droits admin embarqués, sans avoir à passer par une étape d'élévation.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.1')
    .update({
      titre: `Utiliser des comptes individuels réservés à l'utilisateur ou au processus automatique associé`,
      explications: `Quand plusieurs personnes partagent un même compte, plus personne ne sait qui a fait quoi. En cas d'incident, l'enquête tourne court. Et si le mot de passe fuite, tous les utilisateurs sont compromis en même temps.

La règle de base : chaque utilisateur et chaque processus automatique qui accède à vos ressources dispose d'un compte individuel, qui lui est réservé. Ce compte est protégé au minimum par un élément secret (mot de passe) connu uniquement de la personne ou du processus autorisé.

À noter : cette mesure ne s'applique pas aux systèmes qui n'ont pour seul objectif que de diffuser de l'information au public (par exemple un site vitrine).`,
      action_prioritaire: `Créer un compte individuel pour chaque utilisateur et processus de service.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Aucune imputation possible en cas d'incident",
            description:
              'Un compte est utilisé par plusieurs personnes, et un acte malveillant ou une erreur ne peut être attribué à quiconque.',
          },
          {
            libelle: 'Mot de passe partagé qui circule',
            description:
              "Le mot de passe d'un compte commun passe de main en main, finit sur un post-it, et finit par fuiter.",
          },
          {
            libelle: "Aucune piste d'audit exploitable",
            description:
              "Les journaux affichent toujours le même compte, donc l'analyse forensic après incident devient quasi impossible.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.1-EI/EE', '10.A.2-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.2')
    .update({
      titre: `Sécuriser l'usage des comptes partagés lorsqu'ils sont indispensables`,
      explications: `Idéalement, tous les comptes sont individuels. Mais dans certains contextes — salle de supervision, équipement industriel, contrainte technique — un compte partagé reste indispensable. Dans ce cas, il faut compenser le risque par d'autres moyens.

Concrètement :
- mettre en œuvre des mesures pour réduire les risques et assurer la traçabilité (carnet de quart dans une salle de supervision, badgeuse à l'entrée du local, journalisation applicative croisée, etc.) ;
- renouveler l'élément secret (mot de passe) à chaque retrait d'un utilisateur de ce compte (départ, mobilité interne) ;
- si la modification de l'élément secret est impossible, mettre en place un contrôle d'accès approprié à la ressource concernée ainsi que des mesures compensatoires.

Cette règle s'applique à tous les comptes partagés, y compris les comptes d'administration lorsque le partage est inévitable.`,
      action_prioritaire: `Limiter au maximum les comptes partagés. Pour ceux qui restent : renouvellement du secret à chaque retrait d'un utilisateur, stockage du secret dans un gestionnaire de mots de passe sécurisé, traçabilité organisationnelle (cahier de prise/passation).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mot de passe partagé qui survit aux départs',
            description:
              "Un ancien collaborateur connaît encore le mot de passe d'un compte technique des mois après son départ.",
          },
          {
            libelle: 'Aucune imputation possible',
            description:
              'Un acte malveillant ou erroné réalisé via le compte partagé ne peut être attribué à personne.',
          },
          {
            libelle: 'Compromission silencieuse',
            description:
              "L'élément secret est conservé dans un fichier non sécurisé, et fuite à la première intrusion.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'COMPTE.4')
    .update({
      explications: `Même avec une bonne procédure de désactivation, des comptes obsolètes finissent par s'accumuler. Une revue régulière permet de remettre les choses au propre — au moins une fois par an.

Cette revue vérifie trois choses :
- que les utilisateurs et processus accédant à vos ressources disposent bien de comptes individuels ;
- que chaque compte individuel est effectivement réservé à l'utilisateur ou au processus auquel il est attribué ;
- que les comptes qui ne sont plus nécessaires sont désactivés.`,
      action_prioritaire: `Bloquer une revue annuelle dans le calendrier, conduite par l'IT en collaboration avec les responsables métiers. Documenter les anomalies et les correctifs appliqués.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Accumulation de comptes obsolètes',
            description:
              "Sans revue, le SI conserve des dizaines de comptes inutilisés qui élargissent la surface d'attaque.",
          },
          {
            libelle: 'Comptes utilisés à mauvais escient',
            description:
              "Un compte attribué à un utilisateur précis est en réalité partagé avec d'autres, sans que personne ne s'en rende compte.",
          },
          {
            libelle: 'Comptes à privilèges non maîtrisés',
            description:
              'Aucune visibilité sur qui détient des droits étendus, et certains comptes admin ne devraient plus exister.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONFORMITE.1')
    .update({
      explications: `Il est important de savoir où se situent les systèmes par rapport aux exigences réglementaires qui vous concernent, notamment ReCyF.
Cette analyse de conformité, c'est tout simplement un état des lieux : pour chaque exigence, vous regardez si elle est appliquée chez vous, partiellement appliquée ou pas du tout — et pourquoi.

Si vous avez choisi une mesure alternative à celle attendue, notez-le explicitement avec sa justification : c'est ce qui vous permettra de défendre votre choix en cas de contrôle.`,
      action_prioritaire: `Établir un tableau d'analyse de conformité par système d'information : pour chaque exigence, indiquer si elle est mise en œuvre, partiellement appliquée ou non appliquée, et justifier les écarts.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Découverte tardive d'une non-conformité",
            description:
              "Sans analyse documentée, l'entité ne sait pas où elle en est, et l'écart se révèle au pire moment (contrôle, incident, audit assurance cyber).",
          },
          {
            libelle: 'Mesures alternatives non justifiées',
            description:
              "L'entité a remplacé une exigence par une mesure de son choix, mais sans trace écrite — impossible de défendre ce choix lors d'un contrôle.",
          },
          {
            libelle: "Pilotage à l'aveugle",
            description:
              'Aucune vision consolidée des points faibles, donc impossible de prioriser les actions et le budget de sécurisation.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.C.1-EI/EE', '2.C.2-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CONFORMITE.2')
    .update({
      explications: `Identifier des écarts, c'est une chose. Les corriger, c'en est une autre. Un plan d'action, c'est ce qui fait passer une analyse de conformité du papier à la réalité.

Pour chaque écart identifié, fixez une échéance raisonnable et nommez un responsable. Et surtout, suivez ce plan dans la durée : sans suivi régulier, les bonnes intentions finissent au fond d'un tiroir.`,
      action_prioritaire: `Reprendre la liste des écarts de l'analyse de conformité. Pour chaque écart, désigner un responsable et fixer une échéance. Programmer un point de suivi régulier (mensuel ou trimestriel).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Plan d'action théorique jamais exécuté",
            description: "Les actions sont listées mais aucune ne se concrétise, faute de responsable ou d'échéance.",
          },
          {
            libelle: 'Priorisation absente',
            description:
              'On commence par les actions faciles plutôt que par celles qui réduisent le plus de risque, et les vulnérabilités majeures restent ouvertes.',
          },
          {
            libelle: 'Démobilisation progressive',
            description:
              "Sans suivi régulier en direction, l'effort se dilue et la conformité ne progresse plus dans la durée.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify([])]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.1')
    .update({
      explications: `Une sauvegarde permet de restaurer vos fichiers, logiciels ou informations essentielles en cas de panne, d’erreur ou de cyberattaque. Définissez simplement quoi sauvegarder, à quelle fréquence, où stocker les copies et qui en est responsable.

Conservez au moins une copie hors ligne (non connectée à Internet) pour empêcher qu’une cyberattaque rende inutilisables vos données et leurs copies de secours.`,
      action_prioritaire: `Identifier les données critiques pour l'activité et en faire une copie sur un disque dur externe, déconnecté du système une fois la sauvegarde terminée.`,
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
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['13.1-EI/EE', '13.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.2')
    .update({
      explications: `Une sauvegarde que vous n'avez jamais restaurée, vous ne savez pas si elle fonctionne. Et le moment où vous le découvrez (en pleine attaque rançongiciel, par exemple) est rarement le bon.

D'où le principe : tester les procédures de sauvegarde et de restauration au moins une fois par an, pour vérifier que les sauvegardes se font correctement et qu'elles peuvent être effectivement restaurées.`,
      action_prioritaire: `Bloquer une date annuelle de test de restauration. Tester la restauration complète d'au moins un système critique (changer le système choisi à chaque itération) et la restauration de fichiers individuels.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sauvegarde inutilisable au moment crucial',
            description: 'On découvre, en pleine attaque rançongiciel, que la sauvegarde est corrompue ou incomplète.',
          },
          {
            libelle: 'Procédure de restauration jamais répétée',
            description:
              'Personne ne sait combien de temps il faut pour restaurer, ni quels outils ou compétences sont nécessaires.',
          },
          {
            libelle: 'Périmètre incomplet',
            description:
              "La sauvegarde ne couvre qu'une partie des données vraiment critiques, et l'écart n'apparaît qu'au moment du sinistre.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTRAT.1')
    .update({
      explications: `Quand vous travaillez avec un prestataire informatique, votre sécurité dépend en partie de la sienne. D'où l'importance d'écrire noir sur blanc, dès le contrat, ce que vous attendez de lui en matière de sécurité.

Vos clauses contractuelles doivent couvrir au minimum la conformité aux obligations légales applicables — notamment en matière de gestion des risques affectant la sécurité des réseaux et systèmes d'information, et de notification des incidents importants.`,
      action_prioritaire: `Inclure dans tout nouveau contrat informatique une annexe sécurité prévoyant : exigences de sécurité, notification rapide des incidents, droit d'audit, réversibilité, conformité aux obligations légales.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sécurité oubliée du contrat',
            description:
              'Le contrat ne mentionne aucune exigence de sécurité, et le prestataire applique le minimum vital, voire moins.',
          },
          {
            libelle: "Pas de clause d'audit",
            description:
              "Impossible de contrôler ce que fait réellement le prestataire, et il refuse tout examen sous prétexte que ce n'était pas prévu.",
          },
          {
            libelle: "Notification d'incidents non encadrée",
            description:
              "Un incident chez le prestataire reste silencieux pendant des semaines, et l'entité l'apprend par un client ou par les médias.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTRAT.2')
    .update({
      explications: `Avoir des clauses contractuelles, c'est bien ; vérifier qu'elles sont respectées, c'est essentiel. Un audit régulier des prestataires permet de s'assurer qu'ils tiennent leurs engagements — et de réagir s'ils dérivent.

Ces audits doivent vérifier la conformité aux obligations légales (gestion des risques, notification d'incidents). Ils doivent produire une synthèse des conformités, les constats, les recommandations, et permettre la construction d'un plan d'action. En cas de manquement, des sanctions adaptées doivent pouvoir être appliquées.`,
      action_prioritaire: `Programmer au moins un contrôle annuel des prestataires critiques (infogérance, hébergement, SaaS sensibles). Exiger un rapport structuré (conformités, constats, recommandations, plan d'action).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Prestataire défaillant non détecté',
            description:
              'Aucun audit ne révèle que les sauvegardes ne sont plus testées ou que les correctifs ne sont plus appliqués depuis des mois.',
          },
          {
            libelle: 'Aucun rapport exploitable',
            description:
              "Les contrôles existent mais sans format structuré (constats, recommandations, plan d'action), donc rien ne change.",
          },
          {
            libelle: 'Sanctions impossibles',
            description:
              'Aucune clause contractuelle ne permet de pénaliser un manquement, et le prestataire continue sans correction.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CRISE.1')
    .update({
      explications: `Une cyberattaque majeure, ça ne s'improvise pas. Sans procédure préparée à l'avance, chacun improvise sous stress, les décisions prennent des heures, les mauvais réflexes se multiplient.

Définissez une procédure de gestion de crise activable en cas d'incident significatif sur vos systèmes, ainsi qu'un annuaire des parties prenantes externes (assureur cyber, prestataire de réponse à incident, autorités, CERT-FR, partenaires-clés), construit en s'appuyant sur votre cartographie de l'écosystème.`,
      action_prioritaire: `Rédiger une procédure courte (5 à 10 pages) : critères de déclenchement, cellule de crise (qui, quels rôles), chaîne d'alerte, premiers réflexes techniques, obligations de notification. La faire approuver par le dirigeant.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Improvisation totale en pleine crise',
            description:
              'Sans procédure, chacun improvise, les décisions critiques prennent des heures et les mauvais réflexes se multiplient.',
          },
          {
            libelle: 'Communication chaotique',
            description:
              'Les clients, les autorités, les partenaires reçoivent des messages contradictoires, voire silence radio pendant des jours.',
          },
          {
            libelle: 'Non-respect des obligations légales',
            description:
              "La notification d'incident (CNIL pour RGPD, ANSSI pour NIS2) ne se fait pas dans les délais réglementaires, exposant l'entité à des sanctions.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.1-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'CRISE.2')
    .update({
      explications: `Une crise qui se passe sans retour d'expérience, c'est une crise dont on n'apprend rien. Les mêmes manques se reproduiront à la suivante : annuaire pas à jour, sauvegardes incomplètes, communication chaotique.

À chaque activation du dispositif de gestion de crise — qu'il s'agisse d'un entraînement, d'un exercice ou d'une crise réelle —, organisez un retour d'expérience (RETEX) pour identifier les axes d'amélioration et les mesures à mettre en œuvre.`,
      action_prioritaire: `Organiser un RETEX systématiquement, à chaud (J+7) puis à froid (J+30) après tout déclenchement. Tracer les enseignements et associer chaque action à un responsable.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Enseignements perdus',
            description:
              "La crise est gérée, mais aucune trace de ce qui a fonctionné ou non, donc rien ne s'améliore pour la prochaine.",
          },
          {
            libelle: 'Reproductions des mêmes erreurs',
            description:
              'Faute de RETEX, les mêmes manques (annuaire pas à jour, sauvegardes incomplètes, communication chaotique) se répètent.',
          },
          {
            libelle: 'Démotivation des équipes',
            description:
              "L'effort fourni pendant la crise n'est pas valorisé ni capitalisé, et la maturité de l'entité ne progresse pas.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CRISE.8')
    .update({
      explications: `En cas de cyberattaque, vos outils habituels peuvent ne plus fonctionner : messagerie, carnet d’adresses, réseau interne…

Préparez une liste imprimée des personnes à contacter rapidement : responsables internes, prestataire informatique, hébergeur, assurance, autorités ou contacts utiles.

Gardez cette liste à jour et accessible, même sans ordinateur ni internet.`,
      action_prioritaire: ``,
    });

  await knex('mesures')
    .where('id', 'CRISE.9')
    .update({
      explications: `Le jour où vos systèmes tombent (rançongiciel, panne, sinistre), votre messagerie aussi est inaccessible. Si la liste des personnes à contacter n'existe qu'en numérique sur le SI, vous ne pourrez pas l'ouvrir.

D'où l'exigence d'une double disponibilité de la liste des personnes mobilisables dans la gestion de crise d'origine cyber :
- au format papier si les systèmes d'information ne sont plus disponibles ;
- au format numérique si la version papier n'est pas accessible.`,
      action_prioritaire: `Imprimer la liste des contacts de crise et la conserver dans un endroit sûr accessible (classeur en armoire, coffre). La maintenir à jour annuellement et à chaque changement.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Listes des contacts dans l'outil tombé en panne",
            description: "La messagerie est chiffrée par un rançongiciel, et personne n'a les numéros à jour ailleurs.",
          },
          {
            libelle: 'Version papier oubliée dans un tiroir',
            description: 'La liste papier existe mais date de deux ans, les personnes-clés ont changé.',
          },
          {
            libelle: 'Décalage entre version papier et numérique',
            description:
              'Les deux supports existent mais ne contiennent pas les mêmes informations, créant la confusion en pleine crise.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'DISTANCE.1')
    .update({
      explications: `Quand un utilisateur ou un prestataire se connecte à distance à votre SI, son trafic transite par Internet. Sans chiffrement ni authentification solide, n'importe qui peut l'intercepter ou se faire passer pour lui.

D'où la double exigence :
- chiffrement à l'aide de protocoles éprouvés (VPN utilisant TLS ou IPsec, ou protocoles applicatifs sécurisés comme TLS/SSL ou SSH), conformes aux recommandations de l'ANSSI ;
- authentification quand l'accès est réalisé par l'entité ou ses prestataires.`,
      action_prioritaire: `Imposer un VPN IPsec ou TLS (selon le contexte) pour tout accès distant. Activer l'authentification systématique pour les accès distants (prestataires, administrateurs, télétravail, etc.).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interception du trafic en clair',
            description:
              "Un accès distant non chiffré (ex. RDP sans VPN, FTP) laisse fuiter identifiants et données dès qu'il transite sur Internet.",
          },
          {
            libelle: 'Accès sans authentification',
            description: "Un accès au SI par un attaquant sans aucune barrière d'authentification.",
          },
          {
            libelle: 'Accès prestataire non encadré',
            description:
              "Une télémaintenance s'ouvre via un protocole non sécurisé et personne ne sait quand le prestataire entre ou sort.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['8.1-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'DROITS.2')
    .update({
      explications: `Comme pour les comptes, les droits s'accumulent au fil des projets et des mobilités. Sans revue régulière, un collaborateur peut finir par avoir accès à des ressources sans rapport avec son poste actuel.

D'où la revue annuelle des droits d'accès : elle vérifie que chacun n'a que les droits justifiés par sa mission, et permet de corriger les anomalies (droits excédant la mission, droits hérités d'anciennes fonctions, etc.).`,
      action_prioritaire: `Calendrier annuel de revue, conduit conjointement par l'IT et les responsables métiers. Documenter les modifications appliquées.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Droits qui s'accumulent au fil des projets",
            description:
              "Un collaborateur sur le terrain depuis 10 ans détient accès à tout, alors que la moitié n'a plus de sens.",
          },
          {
            libelle: 'Mobilités internes sans révision',
            description: 'Un changement de poste se traduit par une addition de droits, jamais une soustraction.',
          },
          {
            libelle: 'Comptes admin pléthoriques',
            description:
              "Impossible de dire qui a vraiment besoin de quel droit d'administration, car aucune revue n'a jamais été tenue.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.4-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'ECOSYSTEME.1')
    .update({
      explications: `En cas d'incident, vous aurez besoin de joindre vite vos prestataires informatiques. Encore faut-il avoir leurs bonnes coordonnées sous la main — et que la liste soit à jour.

Cette liste recense les prestataires et fournisseurs informatiques contribuant à vos activités ou services, avec qui vous avez une relation contractuelle, et formalise leurs coordonnées de contact. Mettez-la à jour au moins une fois par an et chaque fois qu'un changement intervient (nouveau prestataire, changement de point de contact, fin de contrat).`,
      action_prioritaire: `Tenir un tableau à jour des prestataires : nom, prestation, criticité, contact opérationnel, contact de secours, modalités d'astreinte.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Prestataire critique injoignable en pleine crise',
            description:
              "On cherche dans des emails d'il y a deux ans le bon numéro, pendant que l'incident s'aggrave.",
          },
          {
            libelle: 'Sous-traitants oubliés',
            description:
              "Un prestataire SaaS marginal mais sensible (RH, comptabilité) n'apparaît nulle part, et personne ne sait qui prévenir si l'outil tombe.",
          },
          {
            libelle: 'Coordonnées périmées',
            description:
              "Le contact principal est parti depuis six mois, le mail rebondit, et l'astreinte n'est jamais activée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ECOSYSTEME.2')
    .update({
      explications: `Tout ce qui entre et sort de votre SI passe par une interconnexion : VPN partenaire, SaaS, télémaintenance, intranet groupe… Plus elles sont nombreuses, plus elles sont oubliables. Et une interconnexion oubliée, c'est une porte que personne ne surveille.

L'idée ici est simple : lister toutes les interconnexions de votre SI vers tout autre système (externe ou interne), et pour chacune, identifier un point de contact opérationnel. À mettre à jour au moins une fois par an et à chaque changement d'architecture.`,
      action_prioritaire: `Cartographier toutes les interconnexions : Internet, VPN partenaires, services SaaS, télémaintenance, intranet groupe. Désigner un point de contact pour chacune.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Interconnexion oubliée donc non protégée',
            description:
              "Un VPN ancien avec un fournisseur reste ouvert sans surveillance et devient une porte d'entrée pour l'attaquant.",
          },
          {
            libelle: 'Incident sans interlocuteur côté partenaire',
            description:
              "Un flux suspect transite par une interconnexion, mais personne ne sait qui appeler chez l'autre entité pour le bloquer.",
          },
          {
            libelle: 'Architecture qui dérive',
            description:
              'Les flux évoluent au fil du temps sans documentation, et personne ne sait plus exactement ce qui entre et sort du SI.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'EXO.1')
    .update({
      explications: `Préparez les personnes qui devront agir en cas de cyberattaque en organisant régulièrement de courts exercices de crise.
L’objectif est de simuler une attaque autour d’une table, sans toucher aux systèmes réels, pour vérifier que chacun sait quoi faire et repérer les points à améliorer.
Un exercice peut durer 1 à 2 heures et ne nécessite pas forcément de budget ni de prestataire.`,
      action_prioritaire: `Réaliser un premier exercice de crise sur table avec un scénario prêt à l'emploi.`,
    });

  await knex('mesures')
    .where('id', 'FILTRE.1')
    .update({
      explications: `Une fois qu'une interconnexion est ouverte, encore faut-il en contrôler le trafic. Un pare-feu bien configuré laisse passer les flux légitimes et bloque tout le reste — un pare-feu mal configuré ne sert à rien.

Pour chaque interconnexion entre vos systèmes et un système non maîtrisé, identifiez les communications nécessaires, puis mettez en place des règles de filtrage qui n'autorisent que ces communications-là et bloquent toutes les autres par défaut. Revoyez au moins une fois par an la mise en œuvre technique de ces règles.`,
      action_prioritaire: `Adopter la règle « tout bloquer par défaut, n'ouvrir que ce qui est explicitement nécessaire ». Programmer une revue annuelle des règles de filtrage.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Règles trop permissives',
            description:
              '« Tout autoriser de A vers B » est en pratique impossible à contrôler, et un attaquant peut faire passer tout type de flux.',
          },
          {
            libelle: 'Règles non revues',
            description:
              "Les règles s'accumulent au fil des ans, certaines sont obsolètes, d'autres se contredisent, et le pare-feu devient ingérable.",
          },
          {
            libelle: 'Logs ignorés',
            description:
              "Le pare-feu journalise les blocages mais personne ne les regarde, donc les tentatives d'intrusion passent inaperçues.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.B.1-EI/EE', '7.B.3-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'FILTRE.8')
    .update({
      explications: `Installez un (ou plusieurs) pare-feu dédiés pour contrôler les échanges entre votre organisation et l’extérieur : internet, partenaires, prestataires ou services en ligne.

Le pare-feu agit comme un filtre : il laisse passer les connexions autorisées et bloque celles qui semblent suspectes. Il doit être configuré pour cet usage précis, idéalement avec un équipement ou un logiciel dédié à cette fonction.`,
    });

  await knex('mesures')
    .where('id', 'INCIDENT.3')
    .update({
      explications: `Vos outils de sécurité (antivirus, EDR, pare-feu, supervision) génèrent en permanence des alertes. Certaines sont du bruit, d'autres sont de vrais signaux. Sans analyse, tout se noie.

Un événement de sécurité ne devient un incident qu'après analyse. Vous devez donc mettre en place des mécanismes pour analyser et qualifier les événements de sécurité remontés (par vos outils, par vos utilisateurs, par vos prestataires) et identifier les incidents potentiels ou avérés.`,
      action_prioritaire: `Désigner une personne responsable de la qualification des événements. Définir une grille simple (incident / non-incident / à investiguer) et la documenter.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Alertes non triées',
            description:
              "L'antivirus, le pare-feu, l'EDR remontent des alertes en masse, mais personne ne les analyse, et un vrai incident se noie dans le bruit.",
          },
          {
            libelle: 'Signal faible ignoré',
            description:
              "Un événement subtil (une connexion à 3h du matin, un nouveau compte admin) passe inaperçu, alors qu'il signait une compromission.",
          },
          {
            libelle: 'Absence de qualification',
            description:
              "Les incidents potentiels remontent sans grille d'analyse, et chaque cas est traité différemment selon l'humeur ou la disponibilité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'INCIDENT.5')
    .update({
      explications: `Quand un incident survient, les traces techniques sont précieuses : elles permettent de comprendre ce qui s'est passé, et de constituer des preuves en cas de dépôt de plainte ou de contrôle.

Conservez les relevés techniques produits dans le cadre de la gestion des incidents (rapport d'analyse, alertes remontées par les outils, etc.). La durée de conservation doit être pertinente au regard de la protection des données à caractère personnel (notamment de la finalité du traitement).`,
      action_prioritaire: `Définir un registre centralisé des incidents et une durée de conservation par type de relevé (rapports d'analyse, journaux, copies forensic, etc.).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Preuves perdues',
            description:
              "Les éléments techniques d'un incident sont effacés (par méconnaissance ou par réflexe de redémarrage), rendant l'analyse a posteriori impossible.",
          },
          {
            libelle: 'Impossibilité de prouver les faits',
            description: "Un dépôt de plainte ou une notification CNIL bute sur l'absence de preuve documentée.",
          },
          {
            libelle: 'Conservation excessive ou insuffisante',
            description:
              'Les relevés contiennent des données personnelles conservées trop longtemps (risque RGPD) ou supprimées trop vite (perte de preuve).',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.1')
    .update({
      explications: `Chaque équipement connecté à votre réseau est un point d'entrée potentiel. Un PC personnel infecté, un équipement de visiteur, un téléphone d'un partenaire : autant de risques si rien n'encadre les connexions.

Vous devez donc définir les équipements (terminaux et ressources matérielles) autorisés à se connecter à vos systèmes, et mettre en œuvre des mesures techniques ou organisationnelles pour empêcher la connexion d'autres équipements. Cela inclut la possibilité d'autoriser le BYOD (Apportez Votre Équipement de Communication / Bring Your Own Device) — à condition que les équipements personnels concernés aient été identifiés et autorisés.`,
      action_prioritaire: `Lister les postes de travail autorisés à se connecter aux systèmes de l'entité.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Équipement personnel infecté qui contamine le réseau',
            description: 'Un ordinateur portable familial branché au réseau apporte un virus invisible au quotidien.',
          },
          {
            libelle: 'Équipement de visiteur connecté sans contrôle',
            description: 'Une prise réseau libre dans une salle de réunion permet à quiconque de se brancher au SI.',
          },
          {
            libelle: 'Pas de Wi-Fi visiteur isolé',
            description:
              "Visiteurs et collaborateurs partagent le même réseau, et la séparation des usages n'existe pas.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.3')
    .update({
      explications: `Installez une protection contre les logiciels malveillants sur les équipements utilisés par votre organisation : ordinateurs, serveurs et mobiles professionnels.

Cette protection peut être un antivirus ou une solution plus avancée (ex. EDR). Elle doit rester à jour pour détecter les menaces récentes. Les alertes doivent aussi être vérifiées et traitées régulièrement.

De plus, analysez les fichiers provenant de l’extérieur avant leur ouverture (notamment les pièces jointes reçues par email, les clés USB et les autres supports externes) afin de vous assurer de l’absence de virus.`,
      action_prioritaire: `Vérifier que la protection antivirus est active et à jour sur tous les postes de travail.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['9.6-EI/EE', '5.B.2-EI/EE', '9.7-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'MALWARE.7')
    .update({
      explications: `Les supports amovibles — clés USB, disques durs externes, smartphones, tablettes, PC portables — sont pratiques mais aussi un vecteur classique d'incident. Une clé branchée par curiosité, un disque ramené de chez soi, et le virus circule.

L'idée n'est pas d'interdire complètement, mais de limiter aux seuls supports nécessaires à vos activités et services (ou au maintien en condition opérationnelle et de sécurité). Les supports d'origine inconnue ou non maîtrisée doivent être proscrits.`,
      action_prioritaire: `Inscrire dans la charte d'usage l'interdiction de brancher des supports inconnus. Mettre à disposition des supports professionnels chiffrés pour les besoins métiers.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Clé USB trouvée ou offerte',
            description:
              "Un collaborateur branche par curiosité une clé inconnue, et un code malveillant s'installe automatiquement.",
          },
          {
            libelle: 'Fuite de données par copie sur support personnel',
            description: 'Un collaborateur emporte des données sensibles sur sa propre clé USB, sans contrôle.',
          },
          {
            libelle: 'Multiplication des supports en circulation',
            description:
              "Sans inventaire des supports professionnels, l'entité ne sait plus combien de clés ou de disques externes circulent, ni qui les détient.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.3')
    .update({
      explications: `Des vulnérabilités sont découvertes chaque semaine, des campagnes d'attaques visent régulièrement certains éditeurs ou certains équipements. Sans veille active, vous l'apprenez quand c'est trop tard.

Cette veille porte sur les vulnérabilités, les correctifs de sécurité et les mesures d'atténuation susceptibles de concerner vos applicatifs et équipements. Plusieurs sources possibles :
- les fournisseurs ou fabricants de vos applicatifs et équipements ;
- des prestataires contractualisés pour réaliser cette veille ;
- des centres de prévention et d'alerte en cybersécurité (CERT-FR, CSIRT régionaux ou sectoriels).`,
      action_prioritaire: `S'abonner aux bulletins du CERT-FR et aux flux d'alerte des principaux éditeurs utilisés. Désigner une personne responsable de la veille hebdomadaire.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Faille critique non détectée',
            description:
              "Un avis CERT-FR alerte sur une vulnérabilité majeure, mais personne dans l'entité ne le voit passer.",
          },
          {
            libelle: 'Veille fragmentée et tardive',
            description:
              'Chaque admin surveille ses propres outils dans son coin, et les vulnérabilités transverses tombent entre les chaises.',
          },
          {
            libelle: "Campagne d'attaque en cours ignorée",
            description:
              "Un rançongiciel cible massivement un éditeur précis, l'alerte est publique, mais l'entité l'apprend une fois touchée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.4')
    .update({
      explications: `Quand un correctif de sécurité est publié, c'est généralement parce qu'une vulnérabilité est connue. Plus vous tardez à l'appliquer, plus la fenêtre d'attaque reste ouverte — et les attaquants ne s'en privent pas.

Le principe est de mettre en oeuvre :
- **sans délai** : les actions visant à l'installation des correctifs de sécurité (tests, préparation, planification) ;
- **sans retard injustifié** : l'application effective des correctifs après ces actions.

Cette exigence s'applique sur les équipements et applicatifs exposés à des systèmes d'information tiers (serveurs web, pare-feu, messagerie en ligne) et sur les postes de travail des utilisateurs. Si des raisons techniques ou opérationnelles empêchent l'installation d'un correctif, mettez en œuvre des mesures d'atténuation (isolation, contrôle d'accès renforcé, surveillance accrue).`,
      action_prioritaire: `Activer les mises à jour automatiques partout où c'est possible (OS, navigateurs, applications, équipements réseau). Définir un délai cible (le plus court possible) pour les correctifs critiques sur les équipements exposés et les postes de travail.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Faille publique exploitée alors qu'un correctif existe",
            description:
              "Un attaquant utilise une vulnérabilité dont le correctif est sorti depuis des mois mais n'a pas été appliqué.",
          },
          {
            libelle: 'Correctif planifié mais jamais appliqué',
            description:
              "La procédure prévoit l'installation, mais sans suivi opérationnel le déploiement traîne et la fenêtre d'exposition s'allonge.",
          },
          {
            libelle: 'Pas de plan B pour les équipements impossibles à mettre à jour',
            description:
              "Un applicatif métier ne supporte pas le correctif, et l'entité ne met aucune mesure compensatoire en place.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.5')
    .update({
      explications: `Installez les mises à jour de sécurité sur tous vos équipements, dès qu'elles sont proposées. Cela concerne aussi bien les ordinateurs et les serveurs que la box internet, les routeurs, les imprimantes, les caméras de surveillance, les terminaux de paiement et tous les autres objets connectés de l'entreprise. Chacun fait tourner un logiciel qui contient, tôt ou tard, des failles : les mises à jour servent justement à les corriger avant qu'un attaquant ne les exploite.
Pour que ces mises à jour existent, encore faut-il que le logiciel soit dans une version encore suivie par son éditeur ou son fabricant. Quand un produit atteint sa « fin de support », il ne reçoit plus aucun correctif : les nouvelles failles découvertes restent ouvertes en permanence, et l'équipement devient une porte d'entrée pour les attaquants, même s'il fonctionne encore normalement. Il faut alors le remplacer ou le mettre à niveau vers une version toujours maintenue.`,
      action_prioritaire: `<p>Mettre à jour en priorité :</p>
<ul>
<li>les pares-feux,</li>
<li>les équipements (postes de travail, téléphones, etc.) et serveurs exposés sur internet.</li>
</ul>`,
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.6')
    .update({
      explications: `Un logiciel ou un système qui n'est plus suivi par son éditeur ne reçoit plus de correctifs : les vulnérabilités découvertes restent ouvertes en permanence, et n'importe quel attaquant peut les exploiter.

Quand des raisons techniques ou opérationnelles vous empêchent d'installer une version supportée (logiciel métier propriétaire, dépendance applicative, système incompatible avec un équipement industriel), vous devez mettre en œuvre des mesures pour réduire les risques liés à l'utilisation de cette version obsolète.`,
      action_prioritaire: `Pour chaque logiciel ou système obsolète : isoler du reste du SI, gérer les accès de manière renforcée, restreindre les flux entrants et sortants au strict besoin, et planifier le remplacement dans une feuille de route à 12-24 mois.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Système obsolète comme porte d'entrée durable",
            description:
              "Un vieux Windows non isolé reste branché au réseau de l'entité, et un attaquant s'y installe à long terme.",
          },
          {
            libelle: 'Propagation à tout le SI',
            description:
              "Une fois compromis, l'équipement obsolète sert de tremplin pour atteindre des systèmes plus récents et mieux protégés.",
          },
          {
            libelle: 'Pas de plan de remplacement',
            description: "L'obsolescence dure depuis des années, sans budget ni échéance pour migrer.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'MCO_MCS.7')
    .update({
      explications: `Télécharger un installateur sur un site miroir non officiel, c'est risquer de récupérer une version modifiée — avec, en bonus, un code malveillant. Les attaques par chaîne logicielle commencent souvent là.

La règle est simple : toute nouvelle version d'un logiciel ou d'un firmware doit être téléchargée depuis les ressources officielles mises à disposition par les éditeurs ou les fournisseurs.`,
      action_prioritaire: `Imposer comme règle que toute mise à jour provienne du site officiel de l'éditeur.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Logiciel piégé installé sciemment',
            description:
              'Un administrateur télécharge depuis un site miroir non officiel un installateur modifié qui embarque une porte dérobée.',
          },
          {
            libelle: 'Attaque par chaîne logicielle',
            description: "Une mise à jour piratée se propage à tous les équipements de l'entité avant détection.",
          },
          {
            libelle: "Pas de vérification d'intégrité",
            description:
              "Aucune empreinte (hash, signature) n'est contrôlée, et des fichiers altérés passent en production.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PHYS.1')
    .update({
      explications: `La sécurité physique fait partie de la cybersécurité. Un visiteur qui entre seul dans une salle serveur peut faire autant de dégâts qu'un attaquant à distance — débrancher un serveur, brancher un équipement pirate, voler un disque.

Concrètement, vous devez restreindre l'accès aux locaux (bureaux, salles serveurs, locaux techniques, etc.) à l'aide de mesures de sécurité adaptées : registre des visiteurs, badges d'accès, serrures, contrôles d'accès électroniques. Et vous assurer que les personnes externes accédant aux locaux techniques et aux salles serveurs sont accompagnées ou dûment autorisées.`,
      action_prioritaire: `Mettre en place un registre des visiteurs et un contrôle d'accès simple à la salle serveur. Imposer l'accompagnement systématique des prestataires en local technique.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Intrusion physique non détectée',
            description:
              "Un visiteur s'introduit dans une salle technique sans être inquiété, débranche un serveur ou installe un équipement pirate.",
          },
          {
            libelle: 'Prestataire non accompagné',
            description:
              "Un technicien externe accède seul à la salle serveur, sans contrôle ni traçabilité, et personne ne sait ce qu'il y a fait.",
          },
          {
            libelle: 'Badges et clés laissés derrière soi',
            description:
              'Un ancien collaborateur conserve son badge des semaines après son départ et peut revenir sans alerte.',
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['6.1-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'PSSI.1')
    .update({
      explications: `La politique de sécurité des systèmes d'information (PSSI), c'est le document de référence qui dit comment vous prenez la sécurité numérique au sérieux dans votre entité. Sans elle, chacun fait un peu comme il pense — avec elle, vous avez un cadre commun.

Concrètement, elle doit aborder :
- l'organisation de la gouvernance de la sécurité (qui décide, qui fait quoi) ;
- vos orientations et objectifs stratégiques en matière de sécurité numérique ;
- l'engagement du dirigeant à respecter les exigences légales applicables (RGPD, NIS2 le cas échéant, exigences sectorielles).

Elle doit aussi tenir compte des spécificités de votre secteur d'activité, et être formellement approuvée par votre dirigeant exécutif.`,
      action_prioritaire: `Rédiger une PSSI courte (5 à 10 pages pour une TPE/PME) couvrant les rubriques imposées : gouvernance, objectifs stratégiques, engagement dirigeant, exigences sectorielles. La faire approuver formellement et la diffuser en interne.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Sécurité au coup par coup',
            description:
              "Sans cadre formalisé, chaque mesure est prise isolément, sans cohérence d'ensemble, et certains pans entiers (sauvegarde, accès, sous-traitance) restent oubliés.",
          },
          {
            libelle: 'Engagement du dirigeant flou',
            description:
              "Sans signature ni approbation formelle, la sécurité reste perçue comme l'affaire de l'IT et ne mobilise pas le management.",
          },
          {
            libelle: 'Difficulté à démontrer la conformité',
            description:
              "En cas de contrôle, d'incident ou de demande d'un partenaire, l'entité ne dispose d'aucun document de référence à présenter.",
          },
        ]),
      ]),
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.1-EI/EE'])]),
    });

  await knex('mesures')
    .where('id', 'PSSI.2')
    .update({
      explications: `Le chiffrement, c'est ce qui rend une donnée illisible pour quelqu'un qui n'a pas la clé. Sans politique claire, certains documents sensibles voyagent en clair sur Internet pendant que d'autres sont sur-protégés. Une politique de chiffrement précise simplement les règles du jeu.

Elle doit être déclinée de la PSSI et indique quelles informations doivent être chiffrées (données sensibles, données stockées sur supports nomades, échanges Internet), quels algorithmes et protocoles utiliser, et comment gérer les clés et secrets dans le temps (création, conservation, renouvellement, révocation).`,
      action_prioritaire: `Identifier les données sensibles de l'entité (RH, clients, finances, propriété intellectuelle). Activer le chiffrement de disque sur tous les postes nomades et imposer le chiffrement TLS pour les échanges sensibles (messagerie, partage de fichiers cloud).`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Données sensibles exfiltrées en clair',
            description:
              'Un ordinateur perdu, un disque dur volé ou une pièce jointe interceptée laissent fuiter contrats, données clients ou informations RH sans aucune protection.',
          },
          {
            libelle: 'Chiffrement mal géré',
            description:
              'La clé ou le mot de passe de déchiffrement est stocké sur le même support que la donnée, ce qui revient à ne pas chiffrer.',
          },
          {
            libelle: "Choix d'algorithmes obsolètes",
            description:
              "L'entité chiffre avec des protocoles dépréciés (SSL, vieux IPsec, etc.), donnant une fausse impression de sécurité.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.3')
    .update({
      explications: `Qui peut accéder à quoi ? La question vaut autant pour les locaux que pour vos applications. Cette politique réunit les deux volets — accès physique (locaux, salles serveurs, locaux techniques) et accès logique (applicatifs, données, équipements réseau) — dans un même cadre.

Elle doit être déclinée de la PSSI et précise qui peut accéder à quoi, dans quelles conditions, avec quels moyens d'authentification, et comment les accès sont attribués, revus et révoqués.`,
      action_prioritaire: `Formaliser une politique courte précisant : qui peut accéder aux locaux et systèmes, qui valide les accès, comment ils sont attribués/révoqués, et selon quelle périodicité ils sont revus.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Accès qui s'accumulent sans contrôle",
            description:
              "Les nouveaux arrivants reçoivent des accès, mais ceux qui partent ou changent de poste ne sont jamais revus, et l'entité finit avec des dizaines de comptes obsolètes.",
          },
          {
            libelle: 'Aucun cadre pour les locaux sensibles',
            description:
              'La salle serveur reste accessible à tous, un visiteur peut entrer sans accompagnement, et un incident interne ne peut pas être imputé.',
          },
          {
            libelle: 'Règles non écrites donc non appliquées',
            description:
              "Les bonnes pratiques existent dans la tête de l'IT mais ne sont pas formalisées — toute personne contournant les règles n'a rien à craindre.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.4')
    .update({
      explications: `Définir des mesures de sécurité, c'est bien. Vérifier qu'elles sont vraiment appliquées dans le temps, c'est mieux. Cette politique précise comment et à quelle fréquence vous vous assurez que ce qui est écrit est effectivement en place.

Elle doit être déclinée de la PSSI et indique quelles mesures sont revues, à quelle fréquence, par qui, selon quelle méthode (auto-évaluation, audit interne, audit externe), et comment les écarts sont traités.`,
      action_prioritaire: `Définir un calendrier de revues : auto-évaluation au moins annuelle des principales mesures, complétée si possible par un audit externe périodique. Documenter les revues réalisées et les actions qui en découlent.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Mesures qui se dégradent dans le temps',
            description:
              "Une règle de filtrage modifiée pour dépanner, un compte privilégié créé en urgence, une dérogation devenue permanente — sans revue, ces dérives s'accumulent.",
          },
          {
            libelle: 'Effet trompeur de la politique sur le papier',
            description:
              "Les documents existent mais personne ne vérifie qu'ils sont réellement appliqués au quotidien.",
          },
          {
            libelle: 'Difficulté à démontrer la maturité',
            description:
              "Sans trace de revues régulières, l'entité ne peut pas prouver à un auditeur ou un assureur qu'elle pilote sa sécurité dans la durée.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.5')
    .update({
      explications: `Une politique ou une procédure non relue finit par devenir obsolète : un outil cité n'existe plus, un rôle a disparu, une nouvelle exigence réglementaire n'a pas été intégrée. Pour rester utile, un document doit vivre.

D'où la règle simple : vérifier au moins une fois par an que les politiques et procédures sont à jour et pertinentes, et les mettre à jour dès qu'un événement le justifie (évolution majeure de la menace, du contexte métier, technique ou organisationnel).`,
      action_prioritaire: `Bloquer une date annuelle de revue dans le calendrier (par exemple en lien avec la clôture comptable). Lister chaque politique et procédure avec sa date de dernière revue et sa prochaine échéance.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Politique déconnectée du terrain',
            description: "La PSSI cite des outils ou prestataires qui n'existent plus, et personne ne s'y réfère plus.",
          },
          {
            libelle: 'Évolution réglementaire ignorée',
            description:
              "Une nouvelle exigence (NIS2, sectorielle) n'est jamais intégrée et l'entité se retrouve en écart sans le savoir.",
          },
          {
            libelle: 'Procédures inutilisables',
            description:
              "Les procédures sont basées sur des outils ou méthodes qui ne sont plus utilisés au sein de l'entité, les rendant inutilisables.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'PSSI.6')
    .update({
      explications: `Les comptes utilisateurs et techniques sont la porte d'entrée de votre SI. Si leur gestion est laissée au cas par cas, on se retrouve vite avec des comptes oubliés, des mots de passe partagés sur des post-it, et personne ne sait plus qui peut faire quoi.

Une politique de gestion des comptes doit être déclinée de la PSSI et précise les règles de création, modification, désactivation et suppression (utilisateurs, administrateurs, comptes de service), les délais de désactivation, les règles de revue, et comment encadrer les comptes partagés quand ils sont indispensables.`,
      action_prioritaire: `Formaliser une politique courte qui précise : règles de nomenclature des comptes, délais de désactivation (ex. 7 jours après un départ), périodicité de revue (au moins annuelle), distinction des comptes administrateurs et utilisateurs, traitement des comptes partagés et comptes de service.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comptes fantômes',
            description:
              "Des comptes d'anciens collaborateurs restent actifs des mois après leur départ, et personne ne s'en rend compte.",
          },
          {
            libelle: 'Comptes partagés non encadrés',
            description:
              "Un mot de passe d'admin connu de cinq personnes circule sur des post-it, et tout incident reste impossible à imputer à un individu.",
          },
          {
            libelle: 'Création sauvage de comptes',
            description:
              "Chacun crée des comptes au fil de l'eau sans nomenclature ni traçabilité, l'inventaire est impossible à reconstituer.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RECENSEMENT.1')
    .update({
      titre: `Lister les activités et les systèmes à protéger`,
      explications: `Faites la liste des activités importantes de votre organisation, même celles qui ne sont pas concernées par une obligation réglementaire. Pour chacune, indiquez la personne responsable et les outils, logiciels, équipements ou services numériques nécessaires à son fonctionnement.

Cette liste permet d’identifier ce qui doit être protégé en priorité : il est difficile de sécuriser ce que l’on n’a pas clairement identifié.`,
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
    .where('id', 'RECENSEMENT.2')
    .update({
      explications: `Tous les systèmes d'information de votre entité ne se valent pas. Certains sont indispensables au quotidien, d'autres bien moins. L'idée ici est de repérer, dans votre liste de systèmes, ceux qui ne posent vraiment aucun problème en cas d'arrêt, de fuite ou de modification — pour pouvoir concentrer vos efforts de protection là où ça compte.

Pour chaque système, on regarde trois choses :
- une dégradation ou interruption affecterait-elle vos activités ou services ? (atteinte à la disponibilité)
- des informations sensibles pourraient-elles être divulguées à des personnes non autorisées ? (atteinte à la confidentialité)
- des informations nécessaires à vos activités pourraient-elles être altérées ? (atteinte à l'intégrité)`,
      action_prioritaire: `Pour chaque système déjà listé, se poser 3 questions :<ul>
<li>si ce système s'arrête, est-ce que mon activité est dégradée ou interrompue ?</li>
<li>si ses informations sont divulguées, est-ce un problème (RGPD, plaintes, secret commercial) ?</li>
<li>si ses informations sont modifiées à mon insu, est-ce que ça fausse mon activité ?</li></ul>`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Arrêt prolongé d'un système clé",
            description:
              "Faute d'avoir identifié les systèmes vitaux pour l'activité, aucune sauvegarde renforcée ni plan de reprise n'a été prévu — l'arrêt s'étire sur plusieurs jours.",
          },
          {
            libelle: 'Fuite de données sensibles',
            description:
              "Les fichiers contenant des données clients ou stratégiques sont protégés comme n'importe quel document — un partage maladroit ou un poste compromis suffit à les exposer.",
          },
          {
            libelle: 'Modification frauduleuse passée inaperçue',
            description:
              "Sans contrôle renforcé sur les systèmes qui produisent factures et données comptables, un RIB ou un montant modifié à l'insu reste invisible jusqu'au paiement.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RECENSEMENT.3')
    .update({
      explications: `Votre entité évolue, vos outils aussi. Une liste écrite il y a deux ans risque vite de devenir trompeuse plus qu'utile : un prestataire a changé, un nouveau logiciel est arrivé, une activité a disparu.
C'est pour cela que la liste des activités et systèmes à protéger doit être revue au moins une fois par an, et chaque fois qu'un changement significatif intervient : nouvelle activité ou nouveau service, mise en service ou retrait d'un système d'information, changement de prestataire, réorganisation interne.

Cette revue permet de maintenir la liste à jour, de vérifier que les classifications restent pertinentes, et d'éviter que des équipements ou services apparus en cours d'année échappent au périmètre de protection.`,
      action_prioritaire: `Bloquer dès maintenant une revue annuelle dans le calendrier (par exemple début d'année ou à la clôture comptable), et mettre à jour la liste sans attendre dès qu'un nouveau système est mis en service ou qu'un prestataire change.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Liste devenue obsolète',
            description:
              "On découvre lors d'un incident que la liste date de deux ans, que les serveurs ne sont plus les bons et que le prestataire a changé.",
          },
          {
            libelle: 'Nouveaux outils hors radar',
            description:
              "Un CRM ou un service cloud acheté en cours d'année n'est jamais ajouté à la liste, et ne bénéficie d'aucune protection ni sauvegarde.",
          },
          {
            libelle: 'Classifications devenues fausses',
            description:
              'Un système classé « non exposé » il y a 18 mois traite désormais des données clients, mais reste hors du périmètre de protection.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.1')
    .update({
      explications: `Une charte d'utilisation des systèmes d'information fixe les règles du jeu pour tous ceux qui utilisent vos outils numériques : ce qui est autorisé, ce qui ne l'est pas, et les bons réflexes au quotidien. Bien rédigée et opposable, elle protège l'entité comme les utilisateurs.

Elle doit prévoir des dispositions spécifiques pour les administrateurs (qui ont plus de pouvoirs, donc plus de responsabilités). Elle peut aussi couvrir les systèmes d'information pour lesquels l'entité a décidé de ne pas appliquer les objectifs de sécurité, afin d'en encadrer l'usage.`,
      action_prioritaire: `S'appuyer sur le guide ANSSI « Charte d'utilisation des moyens informatiques » pour rédiger une charte courte (5 à 8 pages), la faire signer à chaque utilisateur (annexée au contrat de travail ou au règlement intérieur), et l'intégrer au parcours d'arrivée.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Comportements à risque non encadrés',
            description:
              "Usages personnels, connexion d'équipements externes, transfert vers mails personnels — sans charte, aucun cadre, aucune sanction possible.",
          },
          {
            libelle: 'Charte non opposable juridiquement',
            description:
              "La charte existe mais n'a jamais été signée ni intégrée au règlement intérieur, donc inutilisable en cas de litige.",
          },
          {
            libelle: 'Cas particuliers des administrateurs ignorés',
            description:
              "Les pouvoirs élevés des admins ne sont pas encadrés, alors qu'un mauvais usage peut faire bien plus de dégâts qu'un comportement standard.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.2')
    .update({
      explications: `Informez régulièrement toutes les personnes qui utilisent vos outils numériques — salariés, administrateurs, prestataires — sur les principaux risques cyber et les bons réflexes à adopter.

Cette sensibilisation doit être prévue dès l’arrivée dans l’organisation, puis rappelée dans le temps, par exemple lors de formations, de messages réguliers ou d’exercices simples.`,
      action_prioritaire: `Organiser un premier temps d'échange collectif sur les bonnes pratiques cyber, en s'appuyant sur les ressources fournies dans le tutoriel. À renouveler à intervalle régulier.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Clic sur un lien piégé',
            description:
              "un collaborateur clique sur un lien dans un faux email (par exemple une fausse facture, une fausse alerte de livraison ou un faux message bancaire), et donne sans le savoir l'accès à un pirate.",
          },
          {
            libelle: 'Manipulation par un escroc',
            description:
              'par exemple un faux dirigeant qui demande un virement urgent et confidentiel, ou un faux technicien informatique qui demande un mot de passe par téléphone.',
          },
          {
            libelle: 'Mauvais réflexes face à un incident',
            description:
              "un collaborateur non formé peut aggraver la situation, en éteignant brusquement un poste infecté ou en effaçant par réflexe des éléments utiles à l'enquête.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.4')
    .update({
      explications: `Une arrivée, un départ ou un changement de poste, c'est le moment où les accès doivent évoluer. Quand le processus est flou, on accumule des comptes d'anciens collaborateurs, on oublie de retirer des droits devenus inutiles, on perd la trace du matériel.

Un processus clair, co-construit avec les RH et l'IT, doit couvrir :
- la prise de connaissance des règles de sécurité à l'arrivée ;
- l'attribution des accès appropriés à l'arrivée ;
- la mise à jour des accès lors d'un changement de fonction ;
- la restitution de tout le matériel (ex. poste de travail, téléphone professionnel) et la désactivation de tous les accès logiques et physiques au départ.`,
      action_prioritaire: `Établir trois check-lists simples : arrivée, changement de fonction, départ. Les co-construire entre RH, métier et IT, et les déclencher systématiquement à chaque événement.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Comptes d'anciens collaborateurs toujours actifs",
            description:
              'Des accès complets restent ouverts des mois après le départ, et peuvent être réutilisés ou compromis.',
          },
          {
            libelle: 'Changement de poste oublié',
            description:
              "Un collaborateur passe d'un poste sensible à un poste sans rapport, mais conserve ses anciens droits sans aucune révision.",
          },
          {
            libelle: 'Matériel non restitué',
            description:
              "Un PC portable ou un smartphone professionnel part avec un collaborateur, avec les données et accès qu'il contient.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'RH.5')
    .update({
      explications: `Les personnes qui ont des responsabilités dans le domaine du numérique (responsable IT, administrateurs systèmes et réseaux, chefs de projet numériques, développeurs, RSSI) ont un impact direct sur votre niveau de sécurité. Une mauvaise configuration peut suffire à ouvrir une porte.

Elles doivent donc suivre un programme de formation dédié à la sécurité numérique, adapté à leurs responsabilités — à la prise de poste, puis à intervalles réguliers pour rester à jour des évolutions.`,
      action_prioritaire: `Identifier les personnes à former (en interne et prestataires) et planifier au moins un module annuel adapté à leur fonction. SecNumAcadémie (ANSSI) offre une base gratuite.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Erreur de configuration aux conséquences lourdes',
            description:
              'Un administrateur peu formé ouvre un port, désactive un contrôle ou affecte des droits trop larges — et un attaquant en profite.',
          },
          {
            libelle: 'Pratiques obsolètes',
            description:
              "L'équipe IT reproduit ce qu'elle sait depuis dix ans, sans intégrer les nouvelles menaces (rançongiciels, attaques sur l'identité, IA).",
          },
          {
            libelle: 'Manque de réflexes face à un incident',
            description:
              "Confrontée à un signal de compromission, l'équipe applique de mauvais gestes (éteindre la machine, supprimer les logs) qui aggravent la situation et compromettent l'enquête.",
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ROLE.3')
    .update({
      explications: `La sécurité numérique ne se porte pas toute seule : il faut quelqu'un pour la prendre en charge, des règles de qui fait quoi, et des moments réguliers pour en discuter. C'est ce qu'on appelle une organisation de la sécurité.

En pratique, cela passe notamment par :
- la désignation d'un responsable de la sécurité numérique (interne ou externe) ;
- l'établissement d'un RACI sur les principales activités (qui est Responsable, qui Approuve, qui est Consulté, qui est Informé) ;
- la mise en place d'une comitologie : des instances qui se réunissent régulièrement pour piloter la sécurité.`,
      action_prioritaire: `Désigner formellement un référent en sécurité numérique (interne ou prestataire) et le faire connaître à tous. Pour une TPE/PME, un comité semestriel direction + IT suffit comme instance de pilotage.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Personne ne porte la sécurité',
            description:
              'Sans rôle nommé, chacun se renvoie la balle, et les décisions ne sont pas prises ou prises trop tard.',
          },
          {
            libelle: "Conflits d'intérêts non gérés",
            description:
              'La même personne est juge et partie (par exemple le prestataire IT contrôle sa propre conformité), ce qui fragilise toute la démarche.',
          },
          {
            libelle: "Absence d'instance de pilotage",
            description:
              'Aucun comité ne discute des risques ni des arbitrages budgétaires, et les sujets de sécurité ne remontent jamais en direction.',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'ROLE.5')
    .update({
      explications: `La cybersécurité n'est pas qu'un sujet technique : c'est un enjeu stratégique qui engage l'entité dans son ensemble. À ce titre, c'est le dirigeant exécutif qui doit en être le responsable final — et notamment du suivi de la conformité des systèmes d'information aux exigences applicables.

Il peut s'appuyer sur un référent en sécurité numérique pour l'opérationnel, mais la responsabilité finale lui revient. Elle se matérialise notamment par l'approbation formelle de la PSSI.`,
      action_prioritaire: `Faire approuver formellement la PSSI par le dirigeant.`,
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Sécurité reléguée à l'IT",
            description:
              'Le dirigeant considère la cybersécurité comme un sujet technique, et personne au sommet ne tranche les arbitrages budgétaires.',
          },
          {
            libelle: 'Décisions critiques prises sans le dirigeant',
            description:
              'Payer une rançon, communiquer à des clients après une fuite, déposer plainte — autant de décisions qui appellent un mandat explicite et ne peuvent pas attendre.',
          },
          {
            libelle: 'Responsabilité juridique non anticipée',
            description:
              "En cas de manquement majeur (RGPD, NIS2), c'est le dirigeant qui sera tenu pour responsable face aux autorités — autant l'organiser en amont.",
          },
        ]),
      ]),
    });
}
