import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('modules').insert({ id: 4, nom: `Perte de maîtrise de son entité` });

  await knex('mesures').insert([
    {
      id: `RECENSEMENT.2`,
      id_module: 4,
      ordre: 4010,
      titre: `Identifier au sein de la liste des activités et systèmes les systèmes non exposés aux risques`,
      phrase_accroche: ``,
      explications: `Tous les systèmes d'information de votre entité ne se valent pas. Certains sont indispensables au quotidien, d'autres bien moins. L'idée ici est de repérer, dans votre liste de systèmes, ceux qui ne posent vraiment aucun problème en cas d'arrêt, de fuite ou de modification — pour pouvoir concentrer vos efforts de protection là où ça compte.

Pour chaque système, on regarde trois choses :
- une dégradation ou interruption affecterait-elle vos activités ou services ? (atteinte à la disponibilité)
- des informations sensibles pourraient-elles être divulguées à des personnes non autorisées ? (atteinte à la confidentialité)
- des informations nécessaires à vos activités pourraient-elles être altérées ? (atteinte à l'intégrité)`,
      action_prioritaire: `Pour chaque système déjà listé, se poser 3 questions :<ul>
<li>si ce système s'arrête, est-ce que mon activité est dégradée ou interrompue ?</li>
<li>si ses informations sont divulguées, est-ce un problème (RGPD, plaintes, secret commercial) ?</li>
<li>si ses informations sont modifiées à mon insu, est-ce que ça fausse mon activité ?</li></ul>`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['1.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Arrêt prolongé d'un système clé`,
            description: `Faute d'avoir identifié les systèmes vitaux pour l'activité, aucune sauvegarde renforcée ni plan de reprise n'a été prévu — l'arrêt s'étire sur plusieurs jours.`,
          },
          {
            libelle: `Fuite de données sensibles`,
            description: `Les fichiers contenant des données clients ou stratégiques sont protégés comme n'importe quel document — un partage maladroit ou un poste compromis suffit à les exposer.`,
          },
          {
            libelle: `Modification frauduleuse passée inaperçue`,
            description: `Sans contrôle renforcé sur les systèmes qui produisent factures et données comptables, un RIB ou un montant modifié à l'insu reste invisible jusqu'au paiement.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `RECENSEMENT.3`,
      id_module: 4,
      ordre: 4020,
      titre: `Réexaminer la liste des activités et systèmes à protéger a minima annuellement et en tant que de besoin`,
      phrase_accroche: ``,
      explications: `Votre entité évolue, vos outils aussi. Une liste écrite il y a deux ans risque vite de devenir trompeuse plus qu'utile : un prestataire a changé, un nouveau logiciel est arrivé, une activité a disparu.
C'est pour cela que la liste des activités et systèmes à protéger doit être revue au moins une fois par an, et chaque fois qu'un changement significatif intervient : nouvelle activité ou nouveau service, mise en service ou retrait d'un système d'information, changement de prestataire, réorganisation interne.

Cette revue permet de maintenir la liste à jour, de vérifier que les classifications restent pertinentes, et d'éviter que des équipements ou services apparus en cours d'année échappent au périmètre de protection.`,
      action_prioritaire: `Bloquer dès maintenant une revue annuelle dans le calendrier (par exemple début d'année ou à la clôture comptable), et mettre à jour la liste sans attendre dès qu'un nouveau système est mis en service ou qu'un prestataire change.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['1.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Liste devenue obsolète`,
            description: `On découvre lors d'un incident que la liste date de deux ans, que les serveurs ne sont plus les bons et que le prestataire a changé.`,
          },
          {
            libelle: `Nouveaux outils hors radar`,
            description: `Un CRM ou un service cloud acheté en cours d'année n'est jamais ajouté à la liste, et ne bénéficie d'aucune protection ni sauvegarde.`,
          },
          {
            libelle: `Classifications devenues fausses`,
            description: `Un système classé « non exposé » il y a 18 mois traite désormais des données clients, mais reste hors du périmètre de protection.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Guide ANSSI « Cartographie du système d'information – Guide d'élaboration en 5 étapes », Étape 5`,
            url: `https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf`,
          },
        ]),
      ]),
    },
    {
      id: `CONTRAT.1`,
      id_module: 4,
      ordre: 4030,
      titre: `Fixer les engagements des prestataires en matière de sécurité`,
      phrase_accroche: ``,
      explications: `Quand vous travaillez avec un prestataire informatique, votre sécurité dépend en partie de la sienne. D'où l'importance d'écrire noir sur blanc, dès le contrat, ce que vous attendez de lui en matière de sécurité.

Vos clauses contractuelles doivent couvrir au minimum la conformité aux obligations légales applicables — notamment en matière de gestion des risques affectant la sécurité des réseaux et systèmes d'information, et de notification des incidents importants.`,
      action_prioritaire: `Inclure dans tout nouveau contrat informatique une annexe sécurité prévoyant : exigences de sécurité, notification rapide des incidents, droit d'audit, réversibilité, conformité aux obligations légales.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['3.B.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Sécurité oubliée du contrat`,
            description: `Le contrat ne mentionne aucune exigence de sécurité, et le prestataire applique le minimum vital, voire moins.`,
          },
          {
            libelle: `Pas de clause d'audit`,
            description: `Impossible de contrôler ce que fait réellement le prestataire, et il refuse tout examen sous prétexte que ce n'était pas prévu.`,
          },
          {
            libelle: `Notification d'incidents non encadrée`,
            description: `Un incident chez le prestataire reste silencieux pendant des semaines, et l'entité l'apprend par un client ou par les médias.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Guide ANSSI « Maîtriser les risques de l'infogérance »`,
            url: `https://messervices.cyber.gouv.fr/documents-guides/2010-12-03_Guide_externalisation.pdf`,
          },
        ]),
      ]),
    },
    {
      id: `CONTRAT.2`,
      id_module: 4,
      ordre: 4040,
      titre: `Contrôler la conformité des prestataires aux exigences de sécurité`,
      phrase_accroche: ``,
      explications: `Avoir des clauses contractuelles, c'est bien ; vérifier qu'elles sont respectées, c'est essentiel. Un audit régulier des prestataires permet de s'assurer qu'ils tiennent leurs engagements — et de réagir s'ils dérivent.

Ces audits doivent vérifier la conformité aux obligations légales (gestion des risques, notification d'incidents). Ils doivent produire une synthèse des conformités, les constats, les recommandations, et permettre la construction d'un plan d'action. En cas de manquement, des sanctions adaptées doivent pouvoir être appliquées.`,
      action_prioritaire: `Programmer au moins un contrôle annuel des prestataires critiques (infogérance, hébergement, SaaS sensibles). Exiger un rapport structuré (conformités, constats, recommandations, plan d'action).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['3.B.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Prestataire défaillant non détecté`,
            description: `Aucun audit ne révèle que les sauvegardes ne sont plus testées ou que les correctifs ne sont plus appliqués depuis des mois.`,
          },
          {
            libelle: `Aucun rapport exploitable`,
            description: `Les contrôles existent mais sans format structuré (constats, recommandations, plan d'action), donc rien ne change.`,
          },
          {
            libelle: `Sanctions impossibles`,
            description: `Aucune clause contractuelle ne permet de pénaliser un manquement, et le prestataire continue sans correction.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Catalogue des produits et services certifiés, qualifiés et agréés par l'ANSSI`,
            url: `https://messervices.cyber.gouv.fr/visas/catalogue-produits-services-profils-de-protection-sites-certifies-qualifies-agrees-anssi.pdf`,
          },
        ]),
      ]),
    },
    {
      id: `ECOSYSTEME.1`,
      id_module: 4,
      ordre: 4050,
      titre: `Lister les prestataires et fournisseurs avec leurs coordonnées`,
      phrase_accroche: ``,
      explications: `En cas d'incident, vous aurez besoin de joindre vite vos prestataires informatiques. Encore faut-il avoir leurs bonnes coordonnées sous la main — et que la liste soit à jour.

Cette liste recense les prestataires et fournisseurs informatiques contribuant à vos activités ou services, avec qui vous avez une relation contractuelle, et formalise leurs coordonnées de contact. Mettez-la à jour au moins une fois par an et chaque fois qu'un changement intervient (nouveau prestataire, changement de point de contact, fin de contrat).`,
      action_prioritaire: `Tenir un tableau à jour des prestataires : nom, prestation, criticité, contact opérationnel, contact de secours, modalités d'astreinte.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['3.A.1-EI/EE', '3.A.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Prestataire critique injoignable en pleine crise`,
            description: `On cherche dans des emails d'il y a deux ans le bon numéro, pendant que l'incident s'aggrave.`,
          },
          {
            libelle: `Sous-traitants oubliés`,
            description: `Un prestataire SaaS marginal mais sensible (RH, comptabilité) n'apparaît nulle part, et personne ne sait qui prévenir si l'outil tombe.`,
          },
          {
            libelle: `Coordonnées périmées`,
            description: `Le contact principal est parti depuis six mois, le mail rebondit, et l'astreinte n'est jamais activée.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `ECOSYSTEME.2`,
      id_module: 4,
      ordre: 4060,
      titre: `Lister les interconnexions avec les systèmes d'informations à protéger et leur point de contact`,
      phrase_accroche: ``,
      explications: `Tout ce qui entre et sort de votre SI passe par une interconnexion : VPN partenaire, SaaS, télémaintenance, intranet groupe… Plus elles sont nombreuses, plus elles sont oubliables. Et une interconnexion oubliée, c'est une porte que personne ne surveille.

L'idée ici est simple : lister toutes les interconnexions de votre SI vers tout autre système (externe ou interne), et pour chacune, identifier un point de contact opérationnel. À mettre à jour au moins une fois par an et à chaque changement d'architecture.`,
      action_prioritaire: `Cartographier toutes les interconnexions : Internet, VPN partenaires, services SaaS, télémaintenance, intranet groupe. Désigner un point de contact pour chacune.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['3.A.1-EI/EE', '3.A.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Interconnexion oubliée donc non protégée`,
            description: `Un VPN ancien avec un fournisseur reste ouvert sans surveillance et devient une porte d'entrée pour l'attaquant.`,
          },
          {
            libelle: `Incident sans interlocuteur côté partenaire`,
            description: `Un flux suspect transite par une interconnexion, mais personne ne sait qui appeler chez l'autre entité pour le bloquer.`,
          },
          {
            libelle: `Architecture qui dérive`,
            description: `Les flux évoluent au fil du temps sans documentation, et personne ne sait plus exactement ce qui entre et sort du SI.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `RH.1`,
      id_module: 4,
      ordre: 4070,
      titre: `Formaliser une charte opposable des règles d'utilisation sécurisée des systèmes d'information`,
      phrase_accroche: ``,
      explications: `Une charte d'utilisation des systèmes d'information fixe les règles du jeu pour tous ceux qui utilisent vos outils numériques : ce qui est autorisé, ce qui ne l'est pas, et les bons réflexes au quotidien. Bien rédigée et opposable, elle protège l'entité comme les utilisateurs.

Elle doit prévoir des dispositions spécifiques pour les administrateurs (qui ont plus de pouvoirs, donc plus de responsabilités). Elle peut aussi couvrir les systèmes d'information pour lesquels l'entité a décidé de ne pas appliquer les objectifs de sécurité, afin d'en encadrer l'usage.`,
      action_prioritaire: `S'appuyer sur le guide ANSSI « Charte d'utilisation des moyens informatiques » pour rédiger une charte courte (5 à 8 pages), la faire signer à chaque utilisateur (annexée au contrat de travail ou au règlement intérieur), et l'intégrer au parcours d'arrivée.`,
      action_facile_a_faire: `https://lab-anssi-docs.cleverapps.io/doc/rh1-yk47WjNHgS`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['4.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Comportements à risque non encadrés`,
            description: `Usages personnels, connexion d'équipements externes, transfert vers mails personnels — sans charte, aucun cadre, aucune sanction possible.`,
          },
          {
            libelle: `Charte non opposable juridiquement`,
            description: `La charte existe mais n'a jamais été signée ni intégrée au règlement intérieur, donc inutilisable en cas de litige.`,
          },
          {
            libelle: `Cas particuliers des administrateurs ignorés`,
            description: `Les pouvoirs élevés des admins ne sont pas encadrés, alors qu'un mauvais usage peut faire bien plus de dégâts qu'un comportement standard.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Guide ANSSI « Charte d'utilisation des moyens informatiques et des outils numériques – Guide d'élaboration en 8 points clés pour les PME et ETI »`,
            url: `https://messervices.cyber.gouv.fr/documents-guides/guide-charte-utilisation-moyens-informatiques-outils-numeriques_anssi.pdf`,
          },
        ]),
      ]),
    },
    {
      id: `RH.4`,
      id_module: 4,
      ordre: 4080,
      titre: `Formaliser et mettre en oeuvre un processus de gestion des arrivées, départs et changements de fonction`,
      phrase_accroche: ``,
      explications: `Une arrivée, un départ ou un changement de poste, c'est le moment où les accès doivent évoluer. Quand le processus est flou, on accumule des comptes d'anciens collaborateurs, on oublie de retirer des droits devenus inutiles, on perd la trace du matériel.

Un processus clair, co-construit avec les RH et l'IT, doit couvrir :
- la prise de connaissance des règles de sécurité à l'arrivée ;
- l'attribution des accès appropriés à l'arrivée ;
- la mise à jour des accès lors d'un changement de fonction ;
- la restitution de tout le matériel (ex. poste de travail, téléphone professionnel) et la désactivation de tous les accès logiques et physiques au départ.`,
      action_prioritaire: `Établir trois check-lists simples : arrivée, changement de fonction, départ. Les co-construire entre RH, métier et IT, et les déclencher systématiquement à chaque événement.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['4.4-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Comptes d'anciens collaborateurs toujours actifs`,
            description: `Des accès complets restent ouverts des mois après le départ, et peuvent être réutilisés ou compromis.`,
          },
          {
            libelle: `Changement de poste oublié`,
            description: `Un collaborateur passe d'un poste sensible à un poste sans rapport, mais conserve ses anciens droits sans aucune révision.`,
          },
          {
            libelle: `Matériel non restitué`,
            description: `Un PC portable ou un smartphone professionnel part avec un collaborateur, avec les données et accès qu'il contient.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `RH.5`,
      id_module: 4,
      ordre: 4090,
      titre: `Former à la sécurité des systèmes d'information les personnes assumant des responsabilités dans le domaine du numérique`,
      phrase_accroche: ``,
      explications: `Les personnes qui ont des responsabilités dans le domaine du numérique (responsable IT, administrateurs systèmes et réseaux, chefs de projet numériques, développeurs, RSSI) ont un impact direct sur votre niveau de sécurité. Une mauvaise configuration peut suffire à ouvrir une porte.

Elles doivent donc suivre un programme de formation dédié à la sécurité numérique, adapté à leurs responsabilités — à la prise de poste, puis à intervalles réguliers pour rester à jour des évolutions.`,
      action_prioritaire: `Identifier les personnes à former (en interne et prestataires) et planifier au moins un module annuel adapté à leur fonction. SecNumAcadémie (ANSSI) offre une base gratuite.`,
      action_facile_a_faire: `https://secnumacademie.gouv.fr/`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['4.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Erreur de configuration aux conséquences lourdes`,
            description: `Un administrateur peu formé ouvre un port, désactive un contrôle ou affecte des droits trop larges — et un attaquant en profite.`,
          },
          {
            libelle: `Pratiques obsolètes`,
            description: `L'équipe IT reproduit ce qu'elle sait depuis dix ans, sans intégrer les nouvelles menaces (rançongiciels, attaques sur l'identité, IA).`,
          },
          {
            libelle: `Manque de réflexes face à un incident`,
            description: `Confrontée à un signal de compromission, l'équipe applique de mauvais gestes (éteindre la machine, supprimer les logs) qui aggravent la situation et compromettent l'enquête.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `SecNumAcadémie (ANSSI, gratuit)`,
            url: `https://secnumacademie.gouv.fr/`,
          },
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').delete().where({ id: 'RECENSEMENT.2' });
  await knex('mesures').delete().where({ id: 'RECENSEMENT.3' });
  await knex('mesures').delete().where({ id: 'CONTRAT.1' });
  await knex('mesures').delete().where({ id: 'CONTRAT.2' });
  await knex('mesures').delete().where({ id: 'ECOSYSTEME.1' });
  await knex('mesures').delete().where({ id: 'ECOSYSTEME.2' });
  await knex('mesures').delete().where({ id: 'RH.1' });
  await knex('mesures').delete().where({ id: 'RH.4' });
  await knex('mesures').delete().where({ id: 'RH.5' });
  await knex('modules').delete().where({ id: 4 });
}
