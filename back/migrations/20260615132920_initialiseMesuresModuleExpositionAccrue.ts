import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('modules').insert({ id: 5, nom: `Exposition accrue à la menace cyber` });

  await knex('mesures').insert([
    {
      id: `CONFORMITE.1`,
      id_module: 5,
      ordre: 5010,
      titre: `Réaliser une analyse de la conformité aux exigences ReCyF pour chaque système d'information`,
      phrase_accroche: ``,
      explications: `Il est important de savoir où se situent les systèmes par rapport aux exigences réglementaires qui vous concernent, notamment ReCyF.
Cette analyse de conformité, c'est tout simplement un état des lieux : pour chaque exigence, vous regardez si elle est appliquée chez vous, partiellement appliquée ou pas du tout — et pourquoi.

Si vous avez choisi une mesure alternative à celle attendue, notez-le explicitement avec sa justification : c'est ce qui vous permettra de défendre votre choix en cas de contrôle.`,
      action_prioritaire: `Établir un tableau d'analyse de conformité par système d'information : pour chaque exigence, indiquer si elle est mise en œuvre, partiellement appliquée ou non appliquée, et justifier les écarts.`,
      action_facile_a_faire: `Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en oeuvre.`,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.C.1-EI/EE', '2.C.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Découverte tardive d'une non-conformité`,
            description: `Sans analyse documentée, l'entité ne sait pas où elle en est, et l'écart se révèle au pire moment (contrôle, incident, audit assurance cyber).`,
          },
          {
            libelle: `Mesures alternatives non justifiées`,
            description: `L'entité a remplacé une exigence par une mesure de son choix, mais sans trace écrite — impossible de défendre ce choix lors d'un contrôle.`,
          },
          {
            libelle: `Pilotage à l'aveugle`,
            description: `Aucune vision consolidée des points faibles, donc impossible de prioriser les actions et le budget de sécurisation.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `CONFORMITE.2`,
      id_module: 5,
      ordre: 5020,
      titre: `Définir et mettre en oeuvre en continu un plan d'action pour corriger les non-conformités identifiées`,
      phrase_accroche: ``,
      explications: `Identifier des écarts, c'est une chose. Les corriger, c'en est une autre. Un plan d'action, c'est ce qui fait passer une analyse de conformité du papier à la réalité.

Pour chaque écart identifié, fixez une échéance raisonnable et nommez un responsable. Et surtout, suivez ce plan dans la durée : sans suivi régulier, les bonnes intentions finissent au fond d'un tiroir.`,
      action_prioritaire: `Reprendre la liste des écarts de l'analyse de conformité. Pour chaque écart, désigner un responsable et fixer une échéance. Programmer un point de suivi régulier (mensuel ou trimestriel).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify([])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Plan d'action théorique jamais exécuté`,
            description: `Les actions sont listées mais aucune ne se concrétise, faute de responsable ou d'échéance.`,
          },
          {
            libelle: `Priorisation absente`,
            description: `On commence par les actions faciles plutôt que par celles qui réduisent le plus de risque, et les vulnérabilités majeures restent ouvertes.`,
          },
          {
            libelle: `Démobilisation progressive`,
            description: `Sans suivi régulier en direction, l'effort se dilue et la conformité ne progresse plus dans la durée.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `PSSI.1`,
      id_module: 5,
      ordre: 5030,
      titre: `Formaliser et mettre en oeuvre une politique de sécurité des systèmes d'information (PSSI)`,
      phrase_accroche: ``,
      explications: `La politique de sécurité des systèmes d'information (PSSI), c'est le document de référence qui dit comment vous prenez la sécurité numérique au sérieux dans votre entité. Sans elle, chacun fait un peu comme il pense — avec elle, vous avez un cadre commun.

Concrètement, elle doit aborder :
- l'organisation de la gouvernance de la sécurité (qui décide, qui fait quoi) ;
- vos orientations et objectifs stratégiques en matière de sécurité numérique ;
- l'engagement du dirigeant à respecter les exigences légales applicables (RGPD, NIS2 le cas échéant, exigences sectorielles).

Elle doit aussi tenir compte des spécificités de votre secteur d'activité, et être formellement approuvée par votre dirigeant exécutif.`,
      action_prioritaire: `Rédiger une PSSI courte (5 à 10 pages pour une TPE/PME) couvrant les rubriques imposées : gouvernance, objectifs stratégiques, engagement dirigeant, exigences sectorielles. La faire approuver formellement et la diffuser en interne.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Sécurité au coup par coup`,
            description: `Sans cadre formalisé, chaque mesure est prise isolément, sans cohérence d'ensemble, et certains pans entiers (sauvegarde, accès, sous-traitance) restent oubliés.`,
          },
          {
            libelle: `Engagement du dirigeant flou`,
            description: `Sans signature ni approbation formelle, la sécurité reste perçue comme l'affaire de l'IT et ne mobilise pas le management.`,
          },
          {
            libelle: `Difficulté à démontrer la conformité`,
            description: `En cas de contrôle, d'incident ou de demande d'un partenaire, l'entité ne dispose d'aucun document de référence à présenter.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `PSSI.2`,
      id_module: 5,
      ordre: 5040,
      titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à l'usage du chiffrement`,
      phrase_accroche: ``,
      explications: `Le chiffrement, c'est ce qui rend une donnée illisible pour quelqu'un qui n'a pas la clé. Sans politique claire, certains documents sensibles voyagent en clair sur Internet pendant que d'autres sont sur-protégés. Une politique de chiffrement précise simplement les règles du jeu.

Elle doit être déclinée de la PSSI et indique quelles informations doivent être chiffrées (données sensibles, données stockées sur supports nomades, échanges Internet), quels algorithmes et protocoles utiliser, et comment gérer les clés et secrets dans le temps (création, conservation, renouvellement, révocation).`,
      action_prioritaire: `Identifier les données sensibles de l'entité (RH, clients, finances, propriété intellectuelle). Activer le chiffrement de disque sur tous les postes nomades et imposer le chiffrement TLS pour les échanges sensibles (messagerie, partage de fichiers cloud).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Données sensibles exfiltrées en clair`,
            description: `Un ordinateur perdu, un disque dur volé ou une pièce jointe interceptée laissent fuiter contrats, données clients ou informations RH sans aucune protection.`,
          },
          {
            libelle: `Chiffrement mal géré`,
            description: `La clé ou le mot de passe de déchiffrement est stocké sur le même support que la donnée, ce qui revient à ne pas chiffrer.`,
          },
          {
            libelle: `Choix d'algorithmes obsolètes`,
            description: `L'entité chiffre avec des protocoles dépréciés (SSL, vieux IPsec, etc.), donnant une fausse impression de sécurité.`,
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
      id: `PSSI.3`,
      id_module: 5,
      ordre: 5050,
      titre: `Formaliser et mettre en oeuvre une politique de sécurité relative au contrôle d'accès physique et logique`,
      phrase_accroche: ``,
      explications: `Qui peut accéder à quoi ? La question vaut autant pour les locaux que pour vos applications. Cette politique réunit les deux volets — accès physique (locaux, salles serveurs, locaux techniques) et accès logique (applicatifs, données, équipements réseau) — dans un même cadre.

Elle doit être déclinée de la PSSI et précise qui peut accéder à quoi, dans quelles conditions, avec quels moyens d'authentification, et comment les accès sont attribués, revus et révoqués.`,
      action_prioritaire: `Formaliser une politique courte précisant : qui peut accéder aux locaux et systèmes, qui valide les accès, comment ils sont attribués/révoqués, et selon quelle périodicité ils sont revus.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Accès qui s'accumulent sans contrôle`,
            description: `Les nouveaux arrivants reçoivent des accès, mais ceux qui partent ou changent de poste ne sont jamais revus, et l'entité finit avec des dizaines de comptes obsolètes.`,
          },
          {
            libelle: `Aucun cadre pour les locaux sensibles`,
            description: `La salle serveur reste accessible à tous, un visiteur peut entrer sans accompagnement, et un incident interne ne peut pas être imputé.`,
          },
          {
            libelle: `Règles non écrites donc non appliquées`,
            description: `Les bonnes pratiques existent dans la tête de l'IT mais ne sont pas formalisées — toute personne contournant les règles n'a rien à craindre.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `PSSI.6`,
      id_module: 5,
      ordre: 5060,
      titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à la gestion des comptes`,
      phrase_accroche: ``,
      explications: `Les comptes utilisateurs et techniques sont la porte d'entrée de votre SI. Si leur gestion est laissée au cas par cas, on se retrouve vite avec des comptes oubliés, des mots de passe partagés sur des post-it, et personne ne sait plus qui peut faire quoi.

Une politique de gestion des comptes doit être déclinée de la PSSI et précise les règles de création, modification, désactivation et suppression (utilisateurs, administrateurs, comptes de service), les délais de désactivation, les règles de revue, et comment encadrer les comptes partagés quand ils sont indispensables.`,
      action_prioritaire: `Formaliser une politique courte qui précise : règles de nomenclature des comptes, délais de désactivation (ex. 7 jours après un départ), périodicité de revue (au moins annuelle), distinction des comptes administrateurs et utilisateurs, traitement des comptes partagés et comptes de service.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Comptes fantômes`,
            description: `Des comptes d'anciens collaborateurs restent actifs des mois après leur départ, et personne ne s'en rend compte.`,
          },
          {
            libelle: `Comptes partagés non encadrés`,
            description: `Un mot de passe d'admin connu de cinq personnes circule sur des post-it, et tout incident reste impossible à imputer à un individu.`,
          },
          {
            libelle: `Création sauvage de comptes`,
            description: `Chacun crée des comptes au fil de l'eau sans nomenclature ni traçabilité, l'inventaire est impossible à reconstituer.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `PSSI.4`,
      id_module: 5,
      ordre: 5070,
      titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à l'application des mesures de sécurité mises en oeuvre`,
      phrase_accroche: ``,
      explications: `Définir des mesures de sécurité, c'est bien. Vérifier qu'elles sont vraiment appliquées dans le temps, c'est mieux. Cette politique précise comment et à quelle fréquence vous vous assurez que ce qui est écrit est effectivement en place.

Elle doit être déclinée de la PSSI et indique quelles mesures sont revues, à quelle fréquence, par qui, selon quelle méthode (auto-évaluation, audit interne, audit externe), et comment les écarts sont traités.`,
      action_prioritaire: `Définir un calendrier de revues : auto-évaluation au moins annuelle des principales mesures, complétée si possible par un audit externe périodique. Documenter les revues réalisées et les actions qui en découlent.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Mesures qui se dégradent dans le temps`,
            description: `Une règle de filtrage modifiée pour dépanner, un compte privilégié créé en urgence, une dérogation devenue permanente — sans revue, ces dérives s'accumulent.`,
          },
          {
            libelle: `Effet trompeur de la politique sur le papier`,
            description: `Les documents existent mais personne ne vérifie qu'ils sont réellement appliqués au quotidien.`,
          },
          {
            libelle: `Difficulté à démontrer la maturité`,
            description: `Sans trace de revues régulières, l'entité ne peut pas prouver à un auditeur ou un assureur qu'elle pilote sa sécurité dans la durée.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `PSSI.5`,
      id_module: 5,
      ordre: 5080,
      titre: `Vérifier a minima annuellement les politiques et procédures de sécurité et les mettre à jour si nécessaire`,
      phrase_accroche: ``,
      explications: `Une politique ou une procédure non relue finit par devenir obsolète : un outil cité n'existe plus, un rôle a disparu, une nouvelle exigence réglementaire n'a pas été intégrée. Pour rester utile, un document doit vivre.

D'où la règle simple : vérifier au moins une fois par an que les politiques et procédures sont à jour et pertinentes, et les mettre à jour dès qu'un événement le justifie (évolution majeure de la menace, du contexte métier, technique ou organisationnel).`,
      action_prioritaire: `Bloquer une date annuelle de revue dans le calendrier (par exemple en lien avec la clôture comptable). Lister chaque politique et procédure avec sa date de dernière revue et sa prochaine échéance.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.B.4-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Politique déconnectée du terrain`,
            description: `La PSSI cite des outils ou prestataires qui n'existent plus, et personne ne s'y réfère plus.`,
          },
          {
            libelle: `Évolution réglementaire ignorée`,
            description: `Une nouvelle exigence (NIS2, sectorielle) n'est jamais intégrée et l'entité se retrouve en écart sans le savoir.`,
          },
          {
            libelle: `Procédures inutilisables`,
            description: `Les procédures sont basées sur des outils ou méthodes qui ne sont plus utilisés au sein de l'entité, les rendant inutilisables.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `ROLE.3`,
      id_module: 5,
      ordre: 5090,
      titre: `Créer une organisation de la sécurité des systèmes d'information`,
      phrase_accroche: ``,
      explications: `La sécurité numérique ne se porte pas toute seule : il faut quelqu'un pour la prendre en charge, des règles de qui fait quoi, et des moments réguliers pour en discuter. C'est ce qu'on appelle une organisation de la sécurité.

En pratique, cela passe notamment par :
- la désignation d'un responsable de la sécurité numérique (interne ou externe) ;
- l'établissement d'un RACI sur les principales activités (qui est Responsable, qui Approuve, qui est Consulté, qui est Informé) ;
- la mise en place d'une comitologie : des instances qui se réunissent régulièrement pour piloter la sécurité.`,
      action_prioritaire: `Désigner formellement un référent en sécurité numérique (interne ou prestataire) et le faire connaître à tous. Pour une TPE/PME, un comité semestriel direction + IT suffit comme instance de pilotage.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Personne ne porte la sécurité`,
            description: `Sans rôle nommé, chacun se renvoie la balle, et les décisions ne sont pas prises ou prises trop tard.`,
          },
          {
            libelle: `Conflits d'intérêts non gérés`,
            description: `La même personne est juge et partie (par exemple le prestataire IT contrôle sa propre conformité), ce qui fragilise toute la démarche.`,
          },
          {
            libelle: `Absence d'instance de pilotage`,
            description: `Aucun comité ne discute des risques ni des arbitrages budgétaires, et les sujets de sécurité ne remontent jamais en direction.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `ROLE.5`,
      id_module: 5,
      ordre: 5100,
      titre: `S'assurer que le dirigeant de l'entité est responsable de la sécurité et de la conformité des systèmes d'information`,
      phrase_accroche: ``,
      explications: `La cybersécurité n'est pas qu'un sujet technique : c'est un enjeu stratégique qui engage l'entité dans son ensemble. À ce titre, c'est le dirigeant exécutif qui doit en être le responsable final — et notamment du suivi de la conformité des systèmes d'information aux exigences applicables.

Il peut s'appuyer sur un référent en sécurité numérique pour l'opérationnel, mais la responsabilité finale lui revient. Elle se matérialise notamment par l'approbation formelle de la PSSI.`,
      action_prioritaire: `Faire approuver formellement la PSSI par le dirigeant.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['2.A.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Sécurité reléguée à l'IT`,
            description: `Le dirigeant considère la cybersécurité comme un sujet technique, et personne au sommet ne tranche les arbitrages budgétaires.`,
          },
          {
            libelle: `Décisions critiques prises sans le dirigeant`,
            description: `Payer une rançon, communiquer à des clients après une fuite, déposer plainte — autant de décisions qui appellent un mandat explicite et ne peuvent pas attendre.`,
          },
          {
            libelle: `Responsabilité juridique non anticipée`,
            description: `En cas de manquement majeur (RGPD, NIS2), c'est le dirigeant qui sera tenu pour responsable face aux autorités — autant l'organiser en amont.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `CLOISON.1`,
      id_module: 5,
      ordre: 5110,
      titre: `Cloisonner l'ensemble des systèmes d'informations maîtrisés de l'entité des systèmes non maîtrisés`,
      phrase_accroche: ``,
      explications: `Si votre réseau est « à plat », n'importe quelle machine peut parler à n'importe quelle autre — et un attaquant qui compromet un poste peut rebondir partout. Le cloisonnement, c'est ce qui empêche un incident sur un système d'en contaminer d'autres.

Vous devez cloisonner physiquement ou logiquement vos systèmes d'information vis-à-vis des systèmes non maîtrisés — c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués. Ce cloisonnement peut être réalisé par exemple par VLAN (réseau), par machine virtuelle (calcul) ou par volume distinct (stockage).`,
      action_prioritaire: `Cloisonner les SI maîtrisés de l'entité des SI tiers (partenaires, prestataires en hébergement chez l'entité) et des équipements personnels ou visiteurs (par exemple via des VLAN distincts).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.A.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Compromission qui se propage à tout le SI`,
            description: `Une fois un équipement attaqué, l'absence de cloisonnement permet à l'attaquant de rebondir partout sans obstacle.`,
          },
          {
            libelle: `Système non maîtrisé qui contamine les SI maîtrisés`,
            description: `Un serveur partagé avec un partenaire, mal sécurisé, devient le point d'entrée pour l'attaque.`,
          },
          {
            libelle: `Impossibilité de circonscrire un incident`,
            description: `Faute de zones séparées, on doit débrancher tout le réseau pour stopper la propagation, paralysant toute l'activité.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `CLOISON.5`,
      id_module: 5,
      ordre: 5120,
      titre: `Ouvrir uniquement les interconnexions nécessaires entre les systèmes d'information maîtrisés et non maîtrisés`,
      phrase_accroche: ``,
      explications: `Chaque interconnexion entre vos systèmes et un système non maîtrisé (c'est-à-dire des systèmes tiers ou des systèmes sur lesquels vos objectifs de sécurité ne sont pas appliqués) est une porte potentielle. Moins il y en a, plus c'est facile à surveiller.

Le principe : on n'ouvre que ce qui est démontrable et justifié pour vos activités, vos services, ou pour le maintien en condition opérationnelle et de sécurité. Toutes les autres interconnexions doivent rester fermées.`,
      action_prioritaire: `Établir la matrice des flux : pour chaque interconnexion, justification métier, flux autorisés, point de contact. Fermer toute interconnexion sans justification ou sans usage.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.A.7-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Interconnexion héritée et oubliée`,
            description: `Un VPN avec un ancien partenaire reste ouvert sans usage, et devient une porte d'entrée discrète.`,
          },
          {
            libelle: `Multiplication des ouvertures sans justification`,
            description: `Chaque besoin métier ponctuel se traduit par une ouverture qui n'est jamais refermée.`,
          },
          {
            libelle: `Surface d'exposition mal connue`,
            description: `Faute de matrice de flux à jour, l'entité ne sait pas combien d'interconnexions sont réellement en place ni à quoi elles servent.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `FILTRE.1`,
      id_module: 5,
      ordre: 5130,
      titre: `Autoriser uniquement les communications nécessaires via des règles de filtrage entre les systèmes d'information maîtrisés et non maîtrisés`,
      phrase_accroche: ``,
      explications: `Une fois qu'une interconnexion est ouverte, encore faut-il en contrôler le trafic. Un pare-feu bien configuré laisse passer les flux légitimes et bloque tout le reste — un pare-feu mal configuré ne sert à rien.

Pour chaque interconnexion entre vos systèmes et un système non maîtrisé, identifiez les communications nécessaires, puis mettez en place des règles de filtrage qui n'autorisent que ces communications-là et bloquent toutes les autres par défaut. Revoyez au moins une fois par an la mise en œuvre technique de ces règles.`,
      action_prioritaire: `Adopter la règle « tout bloquer par défaut, n'ouvrir que ce qui est explicitement nécessaire ». Programmer une revue annuelle des règles de filtrage.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['7.B.1-EI/EE', '7.B.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Règles trop permissives`,
            description: `« Tout autoriser de A vers B » est en pratique impossible à contrôler, et un attaquant peut faire passer tout type de flux.`,
          },
          {
            libelle: `Règles non revues`,
            description: `Les règles s'accumulent au fil des ans, certaines sont obsolètes, d'autres se contredisent, et le pare-feu devient ingérable.`,
          },
          {
            libelle: `Logs ignorés`,
            description: `Le pare-feu journalise les blocages mais personne ne les regarde, donc les tentatives d'intrusion passent inaperçues.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `ANSSI, « Recommandations pour la définition d'une politique de filtrage réseau d'un pare-feu »`,
            url: `https://messervices.cyber.gouv.fr/documents-guides/NP_Politique_pare_feu_NoteTech.pdf`,
          },
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').delete().where({ id: 'CONFORMITE.1' });
  await knex('mesures').delete().where({ id: 'CONFORMITE.2' });
  await knex('mesures').delete().where({ id: 'PSSI.1' });
  await knex('mesures').delete().where({ id: 'PSSI.2' });
  await knex('mesures').delete().where({ id: 'PSSI.3' });
  await knex('mesures').delete().where({ id: 'PSSI.6' });
  await knex('mesures').delete().where({ id: 'PSSI.4' });
  await knex('mesures').delete().where({ id: 'PSSI.5' });
  await knex('mesures').delete().where({ id: 'ROLE.3' });
  await knex('mesures').delete().where({ id: 'ROLE.5' });
  await knex('mesures').delete().where({ id: 'CLOISON.1' });
  await knex('mesures').delete().where({ id: 'CLOISON.5' });
  await knex('mesures').delete().where({ id: 'FILTRE.1' });
  await knex('modules').delete().where({ id: 5 });
}
