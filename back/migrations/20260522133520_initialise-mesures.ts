import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('modules', (table) => {
    table.increments('id').primary();
    table.string('nom').notNullable();
  });

  await knex.schema.createTable('mesures', (table) => {
    table.string('id').primary();
    table.integer('id_module').unsigned().notNullable();
    table.integer('ordre').unsigned().notNullable();
    table.foreign('id_module').references('id').inTable('modules');
    table.string('titre').notNullable();
    table.text('phrase_accroche').notNullable().defaultTo('');
    table.text('explications').notNullable().defaultTo('');
    table.text('action_prioritaire').notNullable().defaultTo('');
    table.text('action_facile_a_faire').notNullable().defaultTo('');
    table.jsonb('references_nis2').defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb('risques').defaultTo(knex.raw("'[]'::jsonb"));
    table.jsonb('liens').defaultTo(knex.raw("'[]'::jsonb"));
  });

  await knex.schema.createTable('prises_en_compte', (t) => {
    t.increments('id').primary();
    t.string('email_utilisateur_hache').notNullable();
    t.string('mesure_id').notNullable();
    t.foreign('email_utilisateur_hache').references('email_hache').inTable('utilisateurs');
    t.foreign('mesure_id').references('id').inTable('mesures');
    t.timestamp('date').notNullable().defaultTo(knex.fn.now());
    t.unique(['email_utilisateur_hache', 'mesure_id']);
  });

  // Modules
  await knex('modules').insert({ id: 1, nom: `Cyberdépart : 13 actions pour se lancer` });

  // Mesures
  await knex('mesures').insert([
    {
      id: `AUTH.5`,
      id_module: 1,
      ordre: 10,
      titre: `Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l'accès aux comptes`,
      phrase_accroche: `Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨`,
      explications: `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.`,
      action_prioritaire: `Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l'accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`,
      action_facile_a_faire: `**Bonne nouvelle :** dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l'activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.5-EI/EE'])]),
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
    },
    {
      id: `CONTINU.1`,
      id_module: 1,
      ordre: 20,
      titre: `Sauvegarder régulièrement les données, vérifier et mettre à l'abri ses sauvegardes`,
      phrase_accroche: `Évitez de tout perdre en cas de cyberattaque 😩`,
      explications: `Une sauvegarde permet de restaurer vos fichiers, logiciels ou informations essentielles en cas de panne, d’erreur ou de cyberattaque. Définissez simplement quoi sauvegarder, à quelle fréquence, où stocker les copies et qui en est responsable.

Conservez au moins une copie hors ligne (non connectée à Internet) pour empêcher qu’une cyberattaque rende inutilisables vos données et leurs copies de secours.`,
      action_prioritaire: `Identifier les données critiques pour l'activité et en faire une copie sur un disque dur externe, déconnecté du système une fois la sauvegarde terminée.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['13.1-EI/EE', '13.3-EI/EE'])]),
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
    },
    {
      id: `AUTH.1`,
      id_module: 1,
      ordre: 30,
      titre: `Modifiez les mots de passe par défaut des équipements et logiciels avant de les utiliser`,
      phrase_accroche: `Changez vos serrures avant d’emménager 🚪`,
      explications: `Avant d’utiliser un nouvel équipement ou logiciel, remplacez toujours les mots de passe et identifiants configurés par défaut par les fournisseurs.

Ces accès “sortie d’usine” sont souvent connus, faciles à retrouver ou identiques pour de nombreux utilisateurs. Ils peuvent donc permettre à une personne malveillante d’accéder facilement à votre box, routeur, caméra, imprimante, serveur de fichiers ou application métier.

Avant de choisir une solution, vérifiez qu’il est possible de modifier ces accès. Si ce n’est pas possible, il vaut mieux choisir une autre solution.`,
      action_prioritaire: `Vérifier et modifier les mots de passe par défaut en priorité sur :
* les équipements de sécurité (ex. pare-feu),
* les logiciels exposés sur internet,
* les équipements réseaux (ex. box internet).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Prise de contrôle d'un appareil connecté",
            description:
              "un pirate prend la main sur votre box internet, votre routeur, une caméra de surveillance ou votre stockage réseau, en utilisant le mot de passe d'origine du fabricant — souvent identique sur tous les modèles et publié en ligne.",
          },
          {
            libelle: "Utilisation de votre matériel pour attaquer d'autres victimes",
            description:
              'sans que vous le sachiez, votre équipement est enrôlé dans un réseau de machines piratées et sert à mener des attaques contre des entreprises ou des sites internet partout dans le monde.',
          },
          {
            libelle: 'Rebond vers le reste de votre système',
            description:
              "une fois entré dans un petit appareil mal protégé, l'attaquant s'en sert comme tremplin pour atteindre vos ordinateurs, vos serveurs et vos données.",
          },
        ]),
      ]),
    },
    {
      id: `CRISE.8`,
      id_module: 1,
      ordre: 40,
      titre: `Imprimer la liste des personnes et leurs coordonnées à contacter en cas de cyberattaque`,
      phrase_accroche: `Sachez qui appeler quand plus rien ne répond 🚨`,
      explications: `En cas de cyberattaque, vos outils habituels peuvent ne plus fonctionner : messagerie, carnet d’adresses, réseau interne…

Préparez une liste imprimée des personnes à contacter rapidement : responsables internes, prestataire informatique, hébergeur, assurance, autorités ou contacts utiles.

Gardez cette liste à jour et accessible, même sans ordinateur ni internet.`,
      action_prioritaire: ``,
      action_facile_a_faire: `Bonne nouvelle : un simple document imprimé glissé dans un classeur suffit — pas d'outil dédié à acquérir, pas de procédure complexe à formaliser.

Identifier les rôles nécessaires dans la cellule de crise et les répartir parmi les responsabilités présentes au sein de l'entité : prise de décision, juridique, communication, gestion de l'informatique, lien avec l'hébergeur, lien avec l'assurance cyber, lien avec les autorités.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Perte de temps précieux au démarrage d'une crise",
            description:
              "pendant qu'un incident est en cours, vous cherchez dans l'urgence qui appeler, vous fouillez d'anciens emails, vous tombez sur des numéros qui ne répondent pas.",
          },
          {
            libelle: 'Impossibilité de joindre les bonnes personnes',
            description:
              "si votre messagerie et votre annuaire interne sont indisponibles (souvent à cause de l'attaque elle-même), vous n'avez plus accès aux coordonnées de vos prestataires, partenaires ou collaborateurs-clés.",
          },
          {
            libelle: 'Décisions retardées ou erronées',
            description:
              "sans une chaîne d'alerte définie à l'avance, chacun improvise, l'information ne circule pas, et les bonnes décisions sont prises trop tard.",
          },
        ]),
      ]),
    },
    {
      id: `MALWARE.3`,
      id_module: 1,
      ordre: 50,
      titre: `Installer et maintenir à jour une solution de protection contre les logiciels malveillants sur tous les équipements et services, et traiter ces alertes`,
      phrase_accroche: `Empêchez un virus d’infecter votre organisation  🤚`,
      explications: `Installez une protection contre les logiciels malveillants sur les équipements utilisés par votre organisation : ordinateurs, serveurs et mobiles professionnels.

Cette protection peut être un antivirus ou une solution plus avancée (ex. EDR). Elle doit rester à jour pour détecter les menaces récentes. Les alertes doivent aussi être vérifiées et traitées régulièrement.

De plus, analysez les fichiers provenant de l’extérieur avant leur ouverture (notamment les pièces jointes reçues par email, les clés USB et les autres supports externes) afin de vous assurer de l’absence de virus.`,
      action_prioritaire: `Vérifier que la protection antivirus est active et à jour sur tous les postes de travail.`,
      action_facile_a_faire: `Bonne nouvelle : Certains OS proposent un antivirus activé par défaut, qui couvre déjà la base sur les postes. Et si la messagerie est gérée par un éditeur en nuage, l'analyse des pièces jointes est déjà réalisée côté serveur.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['9.6-EI/EE', '5.B.2-EI/EE', '9.7-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Installation discrète d'un virus sur un ordinateur",
            description:
              "un collaborateur ouvre une pièce jointe piégée dans un email, ou télécharge un logiciel infecté depuis un site, sans s'en rendre compte.",
          },
          {
            libelle: "Diffusion d'un virus à l'ensemble de vos postes",
            description:
              'une fois entré sur une machine, un rançongiciel ou un ver se propage automatiquement de poste en poste et peut bloquer tout votre parc informatique en quelques minutes.',
          },
          {
            libelle: 'Contamination par une clé USB',
            description:
              'un employé branche une clé USB trouvée sur un parking, ramenée de chez lui ou prêtée par un partenaire, et infecte tout votre réseau.',
          },
        ]),
      ]),
    },
    {
      id: `RECENSEMENT.1`,
      id_module: 1,
      ordre: 60,
      titre: `Lister les activités et les systèmes à protéger`,
      phrase_accroche: `Identifiez ce qui compte vraiment 🛡️`,
      explications: `Faites la liste des activités importantes de votre organisation, même celles qui ne sont pas concernées par une obligation réglementaire. Pour chacune, indiquez la personne responsable et les outils, logiciels, équipements ou services numériques nécessaires à son fonctionnement.

Cette liste permet d’identifier ce qui doit être protégé en priorité : il est difficile de sécuriser ce que l’on n’a pas clairement identifié.`,
      action_prioritaire: `Lister sur une feuille les 3 à 5 activités sans lesquelles l'organisation s'arrête (ex. facturation, prise de commande, paie), et noter pour chacune les systèmes d'information utilisés.`,
      action_facile_a_faire: `Bonne nouvelle : un tableur d'une page suffit — une ligne par activité, avec son responsable et les outils utilisés (logiciel de comptabilité, messagerie, site web…).`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['1.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Oubli d'un équipement lors de la mise en place des protections",
            description:
              "par exemple un vieux serveur qui tourne dans un coin, une imprimante connectée ou un ordinateur d'un site distant, oubliés des sauvegardes ou de l'antivirus.",
          },
          {
            libelle: 'Mauvaise utilisation du budget sécurité',
            description:
              'sans vision claire de ce qui est important pour votre activité, vous protégez trop ce qui compte peu, et pas assez ce qui est vital.',
          },
          {
            libelle: "Difficulté à comprendre l'ampleur d'une attaque",
            description:
              "lors d'un incident, vous ne savez pas quels équipements sont touchés, ce qui ralentit fortement la remise en marche et allonge la durée de la crise.",
          },
        ]),
      ]),
    },
    {
      id: `MCO_MCS.5`,
      id_module: 1,
      ordre: 70,
      titre: `Maintenir à jour les logiciels`,
      phrase_accroche: `Évitez qu’une mise à jour oubliée ne devienne un problème 😴`,
      explications: `Installez les mises à jour de sécurité sur tous vos équipements, dès qu'elles sont proposées. Cela concerne aussi bien les ordinateurs et les serveurs que la box internet, les routeurs, les imprimantes, les caméras de surveillance, les terminaux de paiement et tous les autres objets connectés de l'entreprise. Chacun fait tourner un logiciel qui contient, tôt ou tard, des failles : les mises à jour servent justement à les corriger avant qu'un attaquant ne les exploite.
Pour que ces mises à jour existent, encore faut-il que le logiciel soit dans une version encore suivie par son éditeur ou son fabricant. Quand un produit atteint sa « fin de support », il ne reçoit plus aucun correctif : les nouvelles failles découvertes restent ouvertes en permanence, et l'équipement devient une porte d'entrée pour les attaquants, même s'il fonctionne encore normalement. Il faut alors le remplacer ou le mettre à niveau vers une version toujours maintenue.`,
      action_prioritaire: `Vérifier, et si besoin mettre en oeuvre les mises à jour automatiques sur l’ensemble des ressources.`,
      action_facile_a_faire: `Bonne nouvelle : les solutions en nuage sont mises à jour par l'éditeur — vous n'avez rien à faire. Sur les postes, Windows, macOS, certaines distributions Linux, les navigateurs et les smartphones se mettent à jour automatiquement par défaut. Il suffit de vérifier que l'option n'a pas été désactivée et de ne pas reporter indéfiniment les redémarrages.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['5.B.7-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Exploitation d'une faille déjà connue mais non corrigée",
            description:
              "un correctif existe (parfois depuis des mois), mais il n'a pas été installé, et le pirate utilise cette faille publique pour entrer.",
          },
          {
            libelle: "Propagation rapide d'une attaque en chaîne",
            description:
              "une faille non corrigée sert de point d'entrée, puis l'attaquant l'utilise pour rebondir sur les autres équipements eux aussi en retard de mises à jour.",
          },
          {
            libelle: "Utilisation d'un vieux logiciel comme porte d'entrée durable",
            description:
              "un logiciel ou un système d'exploitation trop ancien n'est plus mis à jour par son éditeur. Plus aucun correctif n'est publié, et un attaquant peut s'y installer tranquillement et pour longtemps.",
          },
        ]),
      ]),
    },
    {
      id: `RH.2`,
      id_module: 1,
      ordre: 80,
      titre: `Sensibiliser les équipes aux risques et bonnes pratiques de cybersécurité`,
      phrase_accroche: `Aidez à repérer les pièges avant de tomber dedans 🪤`,
      explications: `Informez régulièrement toutes les personnes qui utilisent vos outils numériques — salariés, administrateurs, prestataires — sur les principaux risques cyber et les bons réflexes à adopter.

Cette sensibilisation doit être prévue dès l’arrivée dans l’organisation, puis rappelée dans le temps, par exemple lors de formations, de messages réguliers ou d’exercices simples.`,
      action_prioritaire: `Organiser un premier temps d'échange collectif sur les bonnes pratiques cyber, en s'appuyant sur les ressources fournies dans le tutoriel. À renouveler à intervalle régulier.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['4.2-EI/EE'])]),
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
    },
    {
      id: `AUTH.4`,
      id_module: 1,
      ordre: 90,
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
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.B.5-EI/EE'])]),
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
    },
    {
      id: `FILTRE.8`,
      id_module: 1,
      ordre: 100,
      titre: `Utilisez un pare-feu pour bloquer les connexions suspectes avec internet`,
      phrase_accroche: `Fermez vos portes aux visiteurs indésirables 🚧`,
      explications: `Installez un (ou plusieurs) pare-feu dédiés pour contrôler les échanges entre votre organisation et l’extérieur : internet, partenaires, prestataires ou services en ligne.

Le pare-feu agit comme un filtre : il laisse passer les connexions autorisées et bloque celles qui semblent suspectes. Il doit être configuré pour cet usage précis, idéalement avec un équipement ou un logiciel dédié à cette fonction.`,
      action_prioritaire: `Activer le pare-feu sur la box internet — souvent déjà actif par défaut, mais à vérifier
Activer le pare-feu local sur les postes de travail — Windows Defender Firewall ou équivalent macOS, c'est natif et gratuit`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.B.4-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Connexion d'un inconnu depuis internet vers vos équipements internes",
            description:
              "un service mal protégé (par exemple un accès à distance laissé ouvert) peut être trouvé et utilisé par n'importe quel pirate qui scanne internet.",
          },
          {
            libelle: "Pilotage à distance d'un ordinateur infecté",
            description:
              'une fois un poste compromis, le virus communique en cachette avec un serveur contrôlé par le pirate, qui peut alors envoyer des ordres à distance pour voler des données ou déclencher une attaque.',
          },
          {
            libelle: 'Exploration de votre réseau par un attaquant',
            description:
              "une fois entré, le pirate lance un balayage automatique pour repérer l'ensemble de vos équipements internes et identifier les plus vulnérables.",
          },
        ]),
      ]),
    },
    {
      id: `COMPADMIN.10`,
      id_module: 1,
      ordre: 110,
      titre: `Autoriser uniquement les actions d'administration via des comptes dédiés et par des personnes autorisées`,
      phrase_accroche: `Ne confiez pas vos clés à tout le monde 🚚`,
      explications: `Séparez les comptes utilisés au quotidien des comptes réservés à l’administration.

Les actions sensibles, comme installer un logiciel, modifier une configuration ou gérer les droits d’accès, doivent être faites uniquement avec un compte administrateur dédié.

Ce compte ne doit pas servir à lire ses mails, naviguer sur internet ou travailler au quotidien. Il doit être réservé aux seules personnes autorisées.`,
      action_prioritaire: `Créer des comptes utilisateurs sur les postes de travail, et s’assurer que les comptes administrateur ne sont pas utilisés pour les tâches courantes.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['11.A.1-EI/EE', '11.A.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Virus déclenché avec les pleins pouvoirs',
            description:
              "si un administrateur ouvre une pièce jointe piégée alors qu'il est connecté avec son compte technique à privilèges élevés, le virus prend immédiatement le contrôle total du système.",
          },
          {
            libelle: "Vol des accès d'administration",
            description:
              "une fois un poste compromis, le pirate peut récupérer dans la mémoire, le navigateur ou un gestionnaire de mots de passe les identifiants puissants d'un administrateur, et s'en servir pour se déplacer partout.",
          },
          {
            libelle: 'Erreur de manipulation aux conséquences étendues',
            description:
              "si les tâches d'administration sont faites depuis le compte utilisé tous les jours, une simple fausse manœuvre peut supprimer par erreur des comptes ou modifier les droits d'accès de toute l'entité.",
          },
        ]),
      ]),
    },
    {
      id: `EXO.1`,
      id_module: 1,
      ordre: 120,
      titre: `S'entraîner pour adopter les bons réflexes en cas de cyberattaque`,
      phrase_accroche: `Préparez-vous aujourd’hui plutôt que d’improviser demain 🚨`,
      explications: `Préparez les personnes qui devront agir en cas de cyberattaque en organisant régulièrement de courts exercices de crise.
L’objectif est de simuler une attaque autour d’une table, sans toucher aux systèmes réels, pour vérifier que chacun sait quoi faire et repérer les points à améliorer.
Un exercice peut durer 1 à 2 heures et ne nécessite pas forcément de budget ni de prestataire.`,
      action_prioritaire: `Réaliser un premier exercice de crise sur table avec un scénario prêt à l'emploi.`,
      action_facile_a_faire: `Bonne nouvelle : un exercice tient en 1 à 2 heures autour d'une table, sans budget ni prestataire.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['15.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Désorganisation au démarrage d'une crise",
            description:
              "sans rôles définis à l'avance, chacun essaie de gérer la crise à sa façon, personne ne sait qui décide, et du temps précieux est perdu sur des questions d'organisation.",
          },
          {
            libelle: 'Décisions précipitées sous stress',
            description:
              'sous la pression, on peut payer une rançon trop vite, communiquer publiquement de façon maladroite, ou prendre des engagements impossibles à tenir, ce qui aggrave les conséquences.',
          },
          {
            libelle: 'Incompréhensions avec les prestataires et les autorités',
            description:
              "sans interlocuteurs identifiés côté infogéreur, assureur, autorités ou clients, les échanges se font dans la confusion et la sortie de crise s'étire dans le temps.",
          },
        ]),
      ]),
    },
    {
      id: `ANNUAIRE.1`,
      id_module: 1,
      ordre: 130,
      titre: `Appliquer sans retard injustifié les correctifs sur les annuaires`,
      phrase_accroche: `Ne laissez personne prendre le contrôle 🛡️`,
      explications: `Installez les mises à jour de sécurité sans tarder sur votre annuaire, l'outil qui gère les comptes de vos utilisateurs, leurs mots de passe et ce à quoi chacun a le droit d'accéder. C'est un peu le trousseau de clés et le registre de votre entreprise réunis au même endroit : si un attaquant met la main dessus, il peut se faire passer pour n'importe quel salarié et ouvrir toutes les portes. C'est pour cette raison que les mises à jour de sécurité de l'annuaire doivent être appliquées en priorité, avant celles des autres équipements.`,
      action_prioritaire: `Si votre organisation dispose d'un annuaire centralisé, demandez à votre prestataire IT (ou responsable IT interne) de confirmer que les mises à jour de sécurité y sont appliquées en priorité, avant celles des postes.`,
      action_facile_a_faire: `Bonne nouvelle : si vos comptes utilisateurs sont gérés directement par des éditeurs en nuage (SaaS), l'éditeur gère lui-même les mises à jour — vous n'avez rien à faire.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['11.B.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Création silencieuse de comptes administrateur',
            description:
              "une fois entré dans l'annuaire, un attaquant peut créer ses propres comptes à privilèges, qui passent inaperçus pendant des mois et lui garantissent un accès permanent à votre système.",
          },
          {
            libelle: 'Réinitialisation de mots de passe de cadres-clés',
            description:
              "sans qu'aucune alerte ne se déclenche, un attaquant peut changer le mot de passe du dirigeant ou du DAF, et lire leurs mails ou valider des virements à leur place.",
          },
          {
            libelle: "Piratage de l'annuaire central de votre entité",
            description:
              "si un attaquant prend le contrôle de l'annuaire (le système qui gère tous les comptes utilisateurs et leurs droits), il obtient en une seule fois l'accès à l'ensemble des comptes — et donc à toutes vos données et applications.",
          },
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('prises_en_compte');
  await knex.schema.dropTable('mesures');
  await knex.schema.dropTable('modules');
}
