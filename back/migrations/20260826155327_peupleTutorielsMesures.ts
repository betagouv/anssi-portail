/*
 * Peuplement initial de la table `tutoriels` (créée par la migration 20260721140439).
 * La table est vide avant cette migration : il s'agit d'un simple insert, pas d'une migration de diff.
 *
 * Source : export "Prod_Referentiel de mesure - Parcours de sécurisation-TUTO.csv" (colonnes Réf, Libellé,
 * Description avant étape, Etape, Note, Pour aller plus loin). Les 58 Réf du CSV correspondent aux id
 * de la table `mesures` après la migration 20260826151019_metsAJourMesuresReferentielSecurisation.
 * AUTH.4 possède 2 lignes dans le CSV : ce sont 2 tutoriels distincts et complémentaires pour la même mesure.
 *
 * down() vide entièrement la table, puisque cette migration est le seul insert à ce stade.
 */
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('tutoriels').insert([
    {
      id_mesure: 'RECENSEMENT.1',
      titre: 'Lister les activités et les systèmes à protéger en priorité',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Lister toutes les activités de l'organisation, sans en écarter d'emblée : partir des grandes fonctions (production, R&amp;D, commercial, paie, comptabilité, communication…) et détailler chacune, y compris les activités qui ne sont soumises à aucune obligation réglementaire.",
          "Pour chaque activité, sélectionner celles à protéger en priorité en se posant la question de l'impact d'un incident :<br>- un arrêt de cette activité perturberait-il fortement, voire stopperait-il, l'organisation ? (impact sur la disponibilité)<br>- un incident sur cette activité entraînerait-il une perte, une fuite ou une altération de données sensibles (clients, techniques, bancaires) ?",
          'Marquer comme « prioritaires » les activités qui répondent Oui à au moins une de ces questions.',
          "Pour chaque activité prioritaire, identifier les systèmes d'information qui la supportent : logiciels, applications, serveurs, équipements, services numériques et prestataires nécessaires à son fonctionnement.",
          "Consolider le tout dans un tableur d'une page pour conserver la trace et pouvoir la relire lors de la prochaine revue.",
        ]),
      ]),
    },
    {
      id_mesure: 'RECENSEMENT.2',
      titre: 'Identifier les systèmes non exposés aux risques',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Reprendre la liste des activités et systèmes et y ajouter trois colonnes : D (Disponibilité), I (Intégrité), C (Confidentialité).',
          "Pour chaque ligne, répondre Oui / Non aux trois questions :<br>- D — si ce système s'arrête, mon activité est-elle dégradée ou interrompue ?<br>- I — si ses informations sont modifiées à mon insu, est-ce que ça fausse mon activité ?<br>- C — si ses informations sont divulguées, est-ce un problème (RGPD, plaintes, secret commercial) ?",
          'Marquer comme « non exposés » les systèmes obtenant « Non » sur les trois colonnes.',
          'Ajouter une colonne « justification » pour conserver la trace de la décision et pouvoir la relire lors de la prochaine revue.',
        ]),
      ]),
    },
    {
      id_mesure: 'RECENSEMENT.3',
      titre: 'Réexaminer la liste des activités et systèmes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Revue annuelle.<br>Choisir une date récurrente. Réunir le dirigeant (ou son délégué), le responsable IT (interne ou prestataire) et les responsables métiers concernés. Reprendre la liste ligne par ligne en se posant les 4 questions issues du guide ANSSI Cartographie :<br>- Faut-il étendre le périmètre (nouveaux systèmes apparus dans l'année) ?<br>- Faut-il revoir l'exposition du système aux risques ?<br>- Faut-il affiner certaines parties (responsables, fournisseurs, dépendances) ?<br>- Quels sont les délais pour les prochaines évolutions identifiées ?",
          "Mise à jour événementielle.<br>Mettre à jour la liste sans attendre la revue dès qu'un événement survient :<br>- mise en service ou arrêt d'un système ;<br>- changement de prestataire, d'hébergeur ou d'éditeur ;<br>- évolution majeure de l'activité (nouveau site, nouvelle gamme, fusion-acquisition) ;<br>- incident ayant révélé une lacune dans la liste.",
          'Garder une trace.<br>Pour chaque revue, noter la date, les participants, les modifications apportées et la prochaine échéance.',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI Cartographie du système d'information – Guide d'élaboration en 5 étapes, Étape 5",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'CONFORMITE.1',
      titre: 'Analyse de conformité',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Lister les exigences réglementaires applicables à l'entité (selon le statut important ou essentiel de l'entité).",
          "Pour chaque système d'information identifié, créer un tableau :<br>- colonne 1 : libellé de l'exigence ;<br>- colonne 2 : statut (Appliqué / Partiel / Non appliqué) ;<br>- colonne 3 : preuve ou référence à la mesure interne ;<br>- colonne 4 : justification en cas d'écart ou de mesure alternative.",
          "Valider l'analyse en comité de direction (ou avec le référent SSI).",
          'Conserver les preuves : politique appliquée, procédures, captures de configuration.',
        ]),
      ]),
      note: "L'analyse alimente directement le plan d'action de correction des écarts.",
    },
    {
      id_mesure: 'CONFORMITE.2',
      titre: "Plan d'action conformité",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Construire le tableau d'action à partir des écarts identifiés. Pour chaque ligne :<br>- écart constaté ;<br>- action corrective à mener ;<br>- responsable nommé ;<br>- échéance ;<br>- statut (à faire / en cours / fait) ;<br>- preuve de réalisation.",
          'Prioriser : commencer par les écarts à plus fort impact ou les plus rapides à fermer.',
          "Organiser un point de suivi régulier en direction (mensuel ou trimestriel), avec tableau de bord d'avancement.",
          "Mettre à jour le tableau au fil de l'eau et conserver les preuves de clôture (capture d'écran, procédure publiée, formation tenue, etc.).",
        ]),
      ]),
    },
    {
      id_mesure: 'PSSI.1',
      titre: 'Formaliser une PSSI',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Réunir le dirigeant, le responsable IT (ou prestataire) et, si possible, un représentant métier.',
          "Rédiger un document court structuré en sections :<br>- périmètre (entités, sites, systèmes couverts) ;<br>- gouvernance : rôles et responsabilités (dirigeant, référent SSI, métiers, prestataires) ;<br>- objectifs stratégiques de sécurité, alignés sur la stratégie de l'entité ;<br>- engagement formel du dirigeant à respecter les exigences légales (RGPD, NIS2 si applicable, exigences sectorielles) ;<br>- principes de sécurité : sauvegardes, accès, sensibilisation, gestion d'incidents, prestataires ;<br>- règles de revue (au moins annuelle).",
          'Faire approuver et signer la PSSI par le dirigeant exécutif.',
          'Diffuser la PSSI auprès de toutes les personnes concernées (collaborateurs, prestataires).',
        ]),
      ]),
    },
    {
      id_mesure: 'PSSI.2',
      titre: 'Politique de chiffrement',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Définir le périmètre :<br>- quelles données chiffrer (sensibles, nomades, sauvegardes, échanges externes) en se basant notamment sur le recensement des SI pour identifier les actifs et données prioritaires;<br>- sur quels supports (postes, smartphones, clés USB, cloud).',
          'Choisir les solutions :<br>- chiffrement de disque natif (BitLocker sur Windows, FileVault sur macOS, LUKS sur Linux) ;<br>- TLS pour les échanges (HTTPS, IMAPS, SMTPS) ;<br>- VPN IPsec ou TLS pour les accès distants.',
          'Gérer les secrets : utiliser un gestionnaire de mots de passe ou un coffre-fort numérique, et ne jamais stocker la clé sur le support chiffré.',
          "Privilégier les produits du catalogue de produits qualifiés par l'ANSSI lorsque le contexte le justifie.",
          'Documenter la politique : qui chiffre quoi, avec quoi, comment renouveler.',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Catalogue des produits et services certifiés, qualifiés et agréés par l'ANSSI",
          url: 'https://messervices.cyber.gouv.fr/visas/catalogue-produits-services-profils-de-protection-sites-certifies-qualifies-agrees-anssi.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'PSSI.3',
      titre: "Politique contrôle d'accès",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Volet physique :<br>- cartographier les locaux sensibles (bureaux, salle serveur, local technique) ;<br>- définir qui peut y accéder, avec quel moyen (badge, clé, code) ;<br>- prévoir la gestion des visiteurs (registre, accompagnement obligatoire pour salle serveur) ;<br>- définir la procédure de retrait des droits en cas de départ.',
          "Volet logique :<br>- principe d'identification nominative pour tous les accès ;<br>- principe du moindre privilège : chaque utilisateur n'a accès qu'aux ressources nécessaires ;<br>- séparation comptes utilisateurs / comptes administrateurs ;<br>- règles d'authentification (mot de passe robuste, MFA quand possible).",
          "Volet revues :<br>- revue annuelle des comptes ;<br>- revue annuelle des droits d'accès ;<br>- revue des accès physiques après tout départ ou changement.",
        ]),
      ]),
    },
    {
      id_mesure: 'PSSI.6',
      titre: 'Politique gestion des comptes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Définir les types de comptes couverts : utilisateurs nominatifs, administrateurs, comptes de service, comptes partagés (à éviter mais à encadrer si indispensables).',
          "Définir le cycle de vie :<br>- création : sur demande validée, avec attribution des droits selon besoin ;<br>- modification : revalidation des droits lors d'un changement de fonction ;<br>- désactivation : sous délai défini après départ (ex. 7 jours, ou immédiat pour les comptes à privilèges) ;<br>- suppression : après période de conservation conforme à la politique d'archivage.",
          "Définir les règles d'authentification associées : mot de passe robuste, renouvellement, MFA quand possible.",
        ]),
      ]),
    },
    {
      id_mesure: 'PSSI.4',
      titre: 'Politique de revue des mesures de sécurité',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Identifier les mesures à revoir : politiques (ex. PSSI, charte), procédures (ex. sauvegarde, accès, incidents), contrôles techniques (ex. antivirus, journalisation, sauvegardes).',
          "Définir la fréquence par type :<br>- revues annuelles : politiques, droits d'accès, comptes ;<br>- revues trimestrielles ou semestrielles : règles de filtrage, exceptions de sécurité ;<br>- revues ponctuelles : à l'occasion d'un incident, d'un changement majeur ou d'un audit.",
          'Définir les méthodes : auto-évaluation interne, audit interne, audit externe (PASSI qualifié ANSSI pour les besoins exigeants).',
        ]),
      ]),
    },
    {
      id_mesure: 'PSSI.5',
      titre: 'Revue annuelle des politiques et procédures',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Constituer le registre des documents : PSSI, charte, politique chiffrement, politique comptes, politique sauvegarde, procédure de gestion d'incident, etc.",
          'Pour chaque document, noter : date de création, date de dernière revue, propriétaire, prochaine échéance.',
          "Lors de la revue annuelle, pour chaque document :<br>- vérifier que les références internes (noms, rôles, prestataires) sont toujours à jour ;<br>- vérifier que les évolutions réglementaires de l'année sont prises en compte ;<br>- vérifier que les évolutions du SI (nouveaux outils, nouveaux sites) sont reflétées ;<br>- décider : reconduire en l'état, mettre à jour à la marge, ou refondre.",
          'Faire revalider les documents modifiés par le dirigeant et les rediffuser.',
          'Tracer la revue : date, participants, décisions.',
        ]),
      ]),
    },
    {
      id_mesure: 'ROLE.3',
      titre: 'Organisation de la sécurité numérique',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Désigner un référent en sécurité :<br>- dans une PME : peut être le responsable IT ou un prestataire externe missionné ;<br>- dans une plus grande structure : un RSSI à temps plein ou partiel.',
          "Formaliser un RACI simple sur les principales activités : sauvegardes, gestion des incidents, sensibilisation, contrôle d'accès, revue de conformité.",
          'Mettre en place une comitologie :<br>- un comité de pilotage sécurité régulier réunissant direction + référent + représentant métier.',
          'Communiquer le nom du référent à tous les collaborateurs et le canal pour le contacter.',
          'Inscrire le rôle dans la fiche de poste du référent et prévoir une formation adaptée.',
        ]),
      ]),
    },
    {
      id_mesure: 'ROLE.5',
      titre: 'Responsabilité du dirigeant',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Faire approuver et signer la PSSI par le dirigeant exécutif : ce geste matérialise sa prise de responsabilité.',
          "Inscrire la sécurité numérique à l'agenda :<br>- au moins un point annuel en comité de direction sur les risques cyber, les incidents survenus, le plan d'action ;<br>- reporting du référent SSI au dirigeant à fréquence régulière.",
          "Identifier les décisions qui restent du ressort du dirigeant (ex. déclenchement d'une cellule de crise, communication externe en cas d'incident, dépôt de plainte).",
          'Prévoir une sensibilisation cyber spécifique pour le dirigeant et le comité de direction.',
        ]),
      ]),
    },
    {
      id_mesure: 'CONTRAT.1',
      titre: 'Engagements de sécurité des prestataires',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Identifier les prestataires concernés : infogérant, hébergeur, éditeur SaaS, prestataire de sauvegarde, prestataire d'administration.",
          "Pour les nouveaux contrats : intégrer une annexe sécurité (souvent appelée « Plan d'assurance sécurité » ou PAS) couvrant :<br>- exigences de sécurité à respecter (alignées sur la PSSI de l'entité) ;<br>- obligation de notification d'incidents sous délai (ex. 24 h) ;<br>- réversibilité : restitution des données dans un format ouvert ;<br>- maintien à niveau de la sécurité dans la durée ;<br>- conformité aux obligations légales (RGPD, NIS2 le cas échéant) ;<br>- pénalités en cas de non-respect.",
          'Pour les contrats existants : tenter de renégocier ou inclure les clauses au prochain renouvellement.',
          'Privilégier les prestataires qualifiés ANSSI lorsque le contexte le justifie (PASSI, PAMS, PRIS, PDIS, SecNumCloud).',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI Maîtriser les risques de l'infogérance",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/2010-12-03_Guide_externalisation.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'CONTRAT.2',
      titre: 'Contrôle des prestations',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Lister les prestations concernées et leur niveau de criticité.',
          "Définir le format de contrôle adapté :<br>- questionnaire d'auto-évaluation annuel pour les prestataires moins critiques ;<br>- audit documentaire à distance (revue de procédures, rapports de tests de restauration, certificats) ;<br>- audit sur site ou par un PASSI qualifié ANSSI pour les prestations critiques.",
          "Exiger un rapport structuré contenant :<br>- synthèse des conformités et niveaux atteints ;<br>- constats de non-conformité et écarts ;<br>- recommandations de remédiation ;<br>- propositions de plan d'action.",
          "Suivre le plan d'action issu de l'audit jusqu'à clôture des écarts.",
          'En cas de manquement majeur, appliquer les sanctions contractuelles prévues (pénalités, mise en demeure, résiliation).',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Catalogue des produits et services certifiés, qualifiés et agréés par l'ANSSI",
          url: 'https://messervices.cyber.gouv.fr/visas/catalogue-produits-services-profils-de-protection-sites-certifies-qualifies-agrees-anssi.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'ECOSYSTEME.1',
      titre: 'Liste des prestataires et fournisseurs',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Construire un tableau avec colonnes :<br>- nom du prestataire / fournisseur ;<br>- nature de la prestation ou du service ;<br>- périmètre (systèmes ou activités concernés) ;<br>- contact opérationnel (nom, fonction, mail, téléphone) ;<br>- contact de secours ou astreinte ;<br>- référence du contrat et date d'échéance.",
          'Recenser tous les prestataires (infogérant, hébergeur, éditeurs SaaS, prestataires métiers numériques).',
          'Mettre à jour la liste à chaque mouvement et au moins une fois par an.',
        ]),
      ]),
    },
    {
      id_mesure: 'ECOSYSTEME.2',
      titre: 'Liste des interconnexions',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Inventorier les interconnexions, par exemple :<br>- sortie Internet et services en nuage (SaaS, sauvegarde cloud, messagerie) ;<br>- VPN site à site avec partenaires ou filiales ;<br>- télémaintenance des prestataires (qui accède, depuis où, vers quoi) ;<br>- flux de paiement et flux EDI (échanges de données informatisés).',
          'Pour chaque interconnexion, noter :<br>- systèmes concernés des deux côtés ;<br>- point de contact opérationnel chez la contrepartie.',
          'Revoir la liste annuellement et à chaque changement.',
        ]),
      ]),
    },
    {
      id_mesure: 'RH.1',
      titre: "Charte d'utilisation des SI",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          '<a href="https://messervices.cyber.gouv.fr/documents-guides/guide-charte-utilisation-moyens-informatiques-outils-numeriques_anssi.pdf">Partir du guide ANSSI Charte d\'utilisation des moyens informatiques et des outils numériques – Guide d\'élaboration en 8 points clés pour les PME et ETI</a>',
          'Rédiger la charte en couvrant les 8 points clés du guide : périmètre, usage professionnel, mots de passe, équipements personnels, supports amovibles, messagerie et Internet, données et confidentialité, signalement des incidents.',
          "Prévoir une section spécifique pour les administrateurs : comptes dédiés, traçabilité, interdiction d'usage à des fins personnelles.",
          "Rendre la charte opposable : annexer au contrat de travail (pour les nouveaux) ou faire signer aux collaborateurs, intégrer au règlement intérieur si possible, mention dans le livret d'accueil.",
          'Revoir la charte au moins une fois par an et après tout changement majeur (nouvel outil, nouveau site, changement réglementaire).',
        ]),
      ]),
    },
    {
      id_mesure: 'RH.2',
      titre: 'Sensibiliser ses collaborateurs (TPE/PME)',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "S'appuyer sur les ressources publiques.<br>Inutile de produire son propre contenu, vous pouvez vous appuyer sur des ressources publiques, par exemple :<br>- <a href=\"https://www.cybermalveillance.gouv.fr/tous-nos-contenus/kit-de-sensibilisation\">Kit de sensibilisation Cybermalveillance.gouv.fr</a><br>- <a href=\"https://secnumacademie.gouv.fr/\">SecNumAcadémie (ANSSI), formation en ligne gratuite</a><br>Ces ressources peuvent vous permettre de créer des :<br>- campagnes d'affichage sur les risques et les bonnes pratiques ;<br>- mails d'information sur les risques et les bonnes pratiques ;<br>- conférences de sensibilisation auprès de l'ensemble des utilisateurs ;<br>- sensibilisations ciblées (ex. service achat ou finance pour les risques d'escroquerie au faux ordre de virement et fraude au président, nouveaux arrivants, CODIR) ;<br>- tests de connaissance des bonnes pratiques de sécurité auprès des collaborateurs ;<br>- campagnes de faux phishing, qui consistent à « tester » la capacité des utilisateurs à détecter un mail piégé.<br>Pour que les utilisateurs restent vigilants dans la durée, il est nécessaire de renouveler périodiquement les actions de sensibilisation / formation, sous plusieurs formats répartis dans l'année.",
          'Installer un rythme léger mais régulier.<br>Exemple de programme de sensibilisation allégé :<br>- 1 mail par mois reprenant un thème du kit Cybermalveillance (mot de passe, phishing, sauvegardes…) ;<br>- un test de phishing tous les 2 ou 3 mois, à intervalle irrégulier (un test prévisible perd toute valeur) ;<br>- en cas de clic : pas de sanction, mais demander de suivre les modules SecNumAcadémie correspondants.',
          "Industrialiser.<br>Au-delà d'une dizaine de personnes, une plateforme de simulation de phishing permet de suivre la progression de chacun et de mesurer l'évolution dans le temps. Intégrez aussi la sensibilisation au parcours d'arrivée des nouveaux collaborateurs.",
        ]),
      ]),
    },
    {
      id_mesure: 'RH.4',
      titre: 'Processus arrivées / départs / mobilités',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Check-list arrivée :<br>- création du compte nominatif (utilisateur standard) ;<br>- attribution des accès strictement nécessaires aux missions ;<br>- remise du matériel (PC, smartphone) avec configuration verrouillée ;<br>- remise et signature de la charte d'usage ;<br>- séance d'accueil sécurité (rappel des bonnes pratiques).",
          'Check-list changement de fonction :<br>- revue des accès et droits ;<br>- retrait des accès devenus inutiles ;<br>- attribution des nouveaux accès nécessaires ;<br>- mise à jour des annuaires internes.',
          "Check-list départ :<br>- désactivation immédiate (le jour du départ) des accès logiques (comptes, VPN, MFA) ;<br>- retrait des accès physiques (badge, clés) ;<br>- récupération du matériel ;<br>- changement des mots de passe partagés que l'utilisateur connaissait ;<br>- transfert des données professionnelles utiles à l'équipe ;<br>- mise en redirection ou clôture de la boîte mail selon politique.",
          'Définir qui déclenche chaque check-list (RH ou manager, IT, accueil) et la trace écrite à conserver.',
          'Vérifier le processus au moins une fois par an.',
        ]),
      ]),
    },
    {
      id_mesure: 'RH.5',
      titre: 'Formation des fonctions numériques',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Cartographier les fonctions à former : référent SSI, admins, développeurs, chefs de projet numériques, et le cas échéant infogérant.',
          "Définir un socle commun obligatoire :<br>- principaux risques et menaces actuels ;<br>- législation et obligations (RGPD, NIS2 le cas échéant) ;<br>- bonnes pratiques d'authentification et de gestion d'accès ;<br>- réflexes en cas d'incident.",
          'Ajouter des modules spécifiques selon les rôles :<br>- admins : durcissement, cloisonnement, journalisation ;<br>- développeurs : développement sécurisé (OWASP Top 10) ;<br>- chefs de projet : intégration de la sécurité dès la conception.',
          'S\'appuyer sur des ressources publiques :<br>- <a href="https://secnumacademie.gouv.fr/">SecNumAcadémie (ANSSI, gratuit)</a><br>- Formations CFSSI de l\'ANSSI ;<br>- Catalogue SecNumedu-FC (formations continues labellisées).',
          'Tracer les formations suivies par chaque personne.',
        ]),
      ]),
    },
    {
      id_mesure: 'CARTO.1',
      titre: 'Cartographie des SI',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "S'appuyer sur la méthode du guide ANSSI « Cartographie du système d'information – Guide d'élaboration en 5 étapes » :<br>Initier la démarche : périmètre, parties prenantes, cible.",
          'Choisir un modèle simple (3 vues suffisent pour démarrer) :<br>- vue métier : activités et applications qui les supportent ;<br>- vue applicative : applications et flux de données ;<br>- vue infrastructure : équipements, réseaux, hébergement.',
          "Choisir un outil adapté à la taille de l'entité : tableur simple + outil de schéma pour démarrer, outil dédié pour les plus matures.",
          "Construire pas à pas, en privilégiant d'abord les systèmes critiques.",
          "Pérenniser : nommer un responsable de la cartographie, intégrer la mise à jour dans tous les projets d'évolution, conserver une version papier à l'abri du SI.",
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI Cartographie du système d'information",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'MCO_MCS.3',
      titre: 'Veille des vulnérabilités',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Sources à suivre :<br>- CERT-FR : avis, alertes, indicateurs de compromission, bulletins thématiques (https://cert.ssi.gouv.fr/) ;<br>- listes de diffusion ou pages de sécurité des éditeurs utilisés (Microsoft, Apple, Linux, éditeurs métiers, équipementiers réseau) ;<br>- CSIRT sectoriel ou régional s'il en existe un pour l'entité ;<br>- prestataire de veille spécialisé pour les plus matures.",
          'Désigner une personne responsable et lui réserver des créneaux pour la veille.',
          "À chaque alerte critique : croiser avec l'inventaire et la cartographie pour savoir si l'entité est exposée, et déclencher le traitement (correctif ou mesure d'atténuation).",
          'Tracer les alertes traitées (date, source, équipements concernés, action menée).',
          'Présenter une synthèse trimestrielle au comité de pilotage sécurité.',
        ]),
      ]),
    },
    {
      id_mesure: 'MCO_MCS.4',
      titre: 'Installation des correctifs',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Identifier les équipements et applicatifs concernés par la mesure :<br>- équipements et applicatifs exposés à des SI tiers : serveurs web, pare-feu, équipements VPN, messagerie en ligne, etc. ;<br>- postes de travail des utilisateurs (fixes et nomades).',
          "Définir et formaliser :<br>- un délai cible entre la publication d'un correctif par l'éditeur et son application effective (la doctrine ANSSI mentionne « le mois qui suit la publication » comme repère ; plus court pour les vulnérabilités critiques) ;<br>- les fenêtres de maintenance compatibles avec l'activité (nuit, week-end) ;<br>- la procédure de test si un environnement de pré-production est disponible.",
          "Activer les mises à jour automatiques :<br>- systèmes d'exploitation (Windows, macOS, distributions Linux) ;<br>- navigateurs, suite bureautique, lecteurs PDF et autres applications ;<br>- firmwares des équipements réseau et de sécurité.",
          "Mesures d'atténuation pour les équipements impossibles à mettre à jour (incompatibilité, dépendance applicative) :<br>- isolation réseau (VLAN dédié, filtrage strict) ;<br>- contrôle d'accès renforcé (comptes dédiés, MFA) ;<br>- surveillance accrue (journalisation, alertes) ;<br>- planification du remplacement.",
          "Suivre l'application des correctifs (ex. via des indicateurs).",
        ]),
      ]),
    },
    {
      id_mesure: 'MCO_MCS.5',
      titre: 'Activer les mises à jour automatiques (TPE/PME)',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Système d'exploitation.<br>Dans les paramètres système, rubrique Mise à jour ou Mises à jour logicielles, activez l'installation automatique des mises à jour, y compris les correctifs de sécurité. La démarche est documentée sur le site de support officiel de votre système d'exploitation (Windows, macOS, distributions Linux). Sur les serveurs Linux, le paquet « unattended-upgrades » permet d'appliquer les correctifs sans intervention.",
          "Applications.<br>Le système à jour ne suffit pas : navigateur, suite bureautique, lecteur PDF, outils métiers sont aussi visés. Activez la mise à jour automatique dans chaque application, ou laissez le magasin d'applications du système s'en charger.",
          "En entreprise : centraliser.<br>Au-delà de quelques postes, utilisez un outil de gestion centralisée des mises à jour pour déployer les correctifs sur tout le parc, imposer un délai maximum d'installation et identifier les postes en retard. C'est aussi ce qui permet de tester un correctif sur un petit groupe avant un déploiement large.",
        ]),
      ]),
      note: "Attention :\n- Certaines mises à jour nécessitent un redémarrage des équipements pour être effectives. Il est donc nécessaire de vérifier périodiquement que les équipements ne sont pas en attente de redémarrage et de planifier les redémarrages ayant un impact sur la disponibilité des systèmes.\n- Pour certaines mises à jour importantes (systèmes d'exploitation serveurs, bases de données, etc.), un délai de qualification interne peut être nécessaire pour s'assurer que la mise à jour n'impacte pas le bon fonctionnement du système.",
    },
    {
      id_mesure: 'MCO_MCS.6',
      titre: 'Logiciels et systèmes obsolètes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Inventorier les composants obsolètes (versions non supportées par leur éditeur ou fabricant).',
          "Pour chaque composant, mettre en place des mesures d'atténuation :<br>- cloisonnement réseau (VLAN dédié, pare-feu avec règles strictes) ;<br>- filtrage strict des flux entrants et sortants (juste ce qu'il faut pour l'usage métier) ;<br>- contrôle d'accès renforcé (comptes dédiés, authentification forte) ;<br>- surveillance renforcée (journaux, supervision spécifique) ;<br>- secrets d'authentification dédiés (pas partagés avec d'autres systèmes).",
          'Établir et suivre un plan de migration ou de remplacement avec échéance.',
          'Tracer la décision : justification métier ou technique, mesures de compensation appliquées, responsable, date de réexamen.',
          'Revoir au moins annuellement la pertinence du maintien.',
        ]),
      ]),
    },
    {
      id_mesure: 'MCO_MCS.7',
      titre: 'Téléchargements officiels',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Inscrire dans la charte et les procédures internes : seules les sources officielles sont autorisées pour les téléchargements de logiciels et mises à jour.',
          "Privilégier les canaux automatiques sécurisés : magasin d'applications de l'OS, gestionnaire de paquets officiel, mise à jour automatique de l'éditeur.",
          "Pour les téléchargements manuels :<br>- aller directement sur le site officiel de l'éditeur (URL connue, pas via un moteur de recherche pour éviter les sites publicitaires détournés) ;<br>- vérifier la signature numérique de l'installateur lorsqu'elle existe ;<br>- comparer l'empreinte (hash) si l'éditeur la publie.",
          'Interdire les sites de téléchargements génériques et les miroirs non maîtrisés.',
          "Sensibiliser les utilisateurs : les fausses publicités d'installateurs sont un vecteur d'attaque courant.",
        ]),
      ]),
    },
    {
      id_mesure: 'ANNUAIRE.1',
      titre: "Maintenir à jour les annuaires d'entreprise",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Identifier la version en place.<br>Faites l'inventaire de votre ou vos annuaires : éditeur, version installée, version cible recommandée. C'est la base pour savoir quel écart de correctifs vous devez combler.",
          "Appliquer les correctifs.<br>Le processus type, à chaque cycle de mise à jour :<br>- consulter les bulletins de sécurité de l'éditeur et du CERT-FR pour identifier les correctifs critiques ;<br>- tester le correctif sur un environnement de pré-production avant le déploiement ;<br>- sauvegarder (ou prendre un instantané) avant d'appliquer ;<br>- déployer pendant une fenêtre de maintenance planifiée ;<br>- vérifier le bon fonctionnement après application (authentification, réplication, droits).",
          "Automatiser ce qui peut l'être.<br>L'application manuelle est difficile à tenir dans la durée. Mettez en place un outil de gestion des correctifs pour :<br>- centraliser la diffusion sur l'ensemble des serveurs d'annuaire ;<br>- définir des groupes (test puis production) pour un déploiement en vagues ;<br>- imposer un délai maximum entre la sortie d'un correctif critique et son application ;<br>- conserver un historique des versions et des correctifs appliqués.",
        ]),
      ]),
    },
    {
      id_mesure: 'PHYS.1',
      titre: "Contrôle d'accès aux locaux",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Identifier les zones sensibles : salle serveur, local technique, salle d'archivage, bureau de la direction si données très sensibles.",
          "Appliquer des mesures selon la sensibilité des zones, par exemple :<br>- bureaux : porte fermée à clé en dehors des horaires, registre des visiteurs à l'accueil ;<br>- salle serveur et local technique : serrure renforcée ou badge dédié, liste limitée des personnes autorisées, accompagnement obligatoire des prestataires ;<br>- traçabilité des accès (cahier ou journal du contrôle d'accès électronique).",
          'Procéder à une revue annuelle de la liste des personnes autorisées et retirer les accès devenus inutiles.',
          "À chaque départ, retirer immédiatement badges, clés et droits d'accès.",
        ]),
      ]),
    },
    {
      id_mesure: 'CLOISON.1',
      titre: 'Cloisonnement des systèmes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Identifier les types de systèmes présents sur le réseau :<br>- SI maîtrisés de l'entité (postes, serveurs, applications métiers gérés par l'IT) ;<br>- SI tiers (hébergement de systèmes de partenaires, accès prestataires) ;<br>- SI non concernés par les objectifs de sécurité (par ex. système ouvert au public) ;<br>- équipements personnels et visiteurs.",
          'Choisir le mode de cloisonnement adapté :<br>- réseau : VLAN distincts et sous-réseaux IP dédiés ;<br>- calcul : machines virtuelles séparées sur des hôtes distincts pour les systèmes très sensibles ;<br>- stockage : volumes ou pools distincts (NAS dédié pour les sauvegardes).',
          'Filtrer les flux entre zones par un pare-feu (autoriser uniquement ce qui est nécessaire).',
          'Documenter le cloisonnement dans la cartographie du SI.',
        ]),
      ]),
    },
    {
      id_mesure: 'CLOISON.5',
      titre: 'Limiter les interconnexions',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Reprendre les interconnexions définies et listées.',
          "Pour chacune, documenter :<br>- le besoin métier (activité supportée) ;<br>- les flux nécessaires (protocoles, ports, sens) ;<br>- la durée d'usage prévue.",
          'Fermer toute interconnexion sans justification ou sans usage avéré.',
          "Mettre en place un processus de demande d'ouverture pour les nouvelles interconnexions : justification écrite, validation IT et métier, durée limitée.",
          'Revoir cette matrice de flux annuellement.',
        ]),
      ]),
    },
    {
      id_mesure: 'FILTRE.1',
      titre: 'Règles de filtrage',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Construire la matrice de flux justifiés : source, destination, protocole/port, sens, justification métier.',
          'Configurer le pare-feu en politique « deny by default » : tout est bloqué sauf ce qui est explicitement autorisé.',
          "Privilégier des règles précises : une règle large (« autoriser tout TCP ») crée plus de risque qu'elle n'en réduit.",
          "Journaliser les flux bloqués pour détecter les tentatives d'intrusion ou les erreurs de configuration applicative.",
          'Revoir annuellement les règles :<br>- confronter la matrice de flux théorique aux règles réelles ;<br>- corriger les contradictions ;<br>- documenter chaque règle (intitulé clair, demandeur, date).',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI, Recommandations pour la définition d'une politique de filtrage réseau d'un pare-feu",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/NP_Politique_pare_feu_NoteTech.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'FILTRE.8',
      titre: 'Activer le pare-feu (TPE/PME)',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Pare-feu local sur chaque poste.<br>Activé par défaut sur les systèmes récents. Dans les paramètres système, rubrique Sécurité ou Pare-feu, vérifiez :<br>- pare-feu activé pour tous les profils réseau (privé, public, domaine) ;<br>- exceptions réduites au strict nécessaire ;<br>- profil « réseau public » correctement appliqué sur les postes nomades (Wi-Fi de gare, hôtel, café).',
          "Un pare-feu dédié.<br>Dès qu'on monte en taille ou en exposition (serveurs internes, télétravail massif, données sensibles, plusieurs sites), un ou plusieurs pare-feux physiques dédiés deviennent nécessaires pour segmenter le réseau en zones cloisonnées, journaliser les flux et assurer la redondance.",
        ]),
      ]),
      note: "Optionnel — Au minimum, le pare-feu de la box internet :\nSi un pare-feu physique dédié ne peut pas être mis en place et qu'une box internet est utilisée, activez a minima le pare-feu de votre box. Connectez-vous à l'interface d'administration de la box (adresse du type 192.168.1.1, indiquée sous la box) et vérifiez :\n- pare-feu activé ;\n- aucune redirection de ports sans besoin explicite ;\n- accès distant à l'administration désactivé.",
    },
    {
      id_mesure: 'DISTANCE.1',
      titre: 'Accès distants sécurisés',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Pour les accès distants des utilisateurs (télétravail) :<br>- VPN IPsec ou TLS chiffré, conformément aux recommandations ANSSI ;<br>- authentification systématique ;<br>- pas de stockage des identifiants dans le client VPN.',
          "Pour les accès distants des administrateurs ou prestataires (télémaintenance) :<br>- tunnel chiffré dédié ;<br>- authentification systématique ;<br>- journalisation des sessions ;<br>- ouverture sur demande et temporaire si possible (pas d'accès permanent).",
          'Pour les protocoles applicatifs accédant à des ressources sensibles :<br>- HTTPS au lieu de HTTP ;<br>- SSH au lieu de Telnet ou rlogin ;<br>- IMAPS, POP3S, SMTPS au lieu des versions en clair.',
          'Privilégier les produits qualifiés ANSSI pour les passerelles VPN.',
        ]),
      ]),
    },
    {
      id_mesure: 'MALWARE.1',
      titre: 'Maîtrise des équipements connectés',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Inventorier les équipements autorisés à se connecter aux SI : postes professionnels, serveurs, smartphones professionnels, imprimantes, équipements IoT.',
          "Définir une politique BYOD claire :<br>- autorisé ou non selon le contexte de l'entité ;<br>- si autorisé, conditions à respecter par l'équipement personnel (ex. logiciel de sécurité, chiffrement, MFA, mises à jour à jour).",
          'Mettre en œuvre des mesures techniques pour empêcher les équipements non autorisés de se connecter, par exemple :<br>- désactivation des prises réseau dans les zones publiques (salle de réunion, accueil) ;<br>- authentification 802.1X des équipements sur le réseau filaire et Wi-Fi pour les contextes les plus exigeants.',
        ]),
      ]),
    },
    {
      id_mesure: 'MALWARE.3',
      titre: 'Antivirus / EDR',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Choisir la solution :<br>- petite structure, secteur peu sensible : l'antivirus intégré au système d'exploitation suffit dans la plupart des cas — inutile de payer par réflexe ;<br>- secteur sensible ou entreprise plus exposée : privilégiez un EDR (détection comportementale, pas seulement signatures connues).<br>Pour comparer : cherchez « comparatif antivirus » ou « comparatif EDR » en privilégiant les sources indépendantes.",
          'Bien le paramétrer (le plus important) :<br>- mise à jour automatique activée ;<br>- analyse des fichiers entrants activée : ce paramètre couvre à la fois les pièces jointes des mails et les clés USB branchées sur le poste ;<br>- analyses complètes programmées régulièrement ;<br>- exceptions réduites au strict nécessaire ;<br>- configuration protégée par mot de passe.',
          "Centraliser.<br>Dès qu'il y a plus d'une dizaine d'équipements, gérer chaque antivirus à la main devient ingérable. Déployez une console d'administration centralisée (incluse dans la plupart des solutions professionnelles) qui permet de :<br>- déployer et mettre à jour l'outil sur tous les équipements en une fois ;<br>- imposer un paramétrage uniforme (impossible pour un utilisateur de le désactiver) ;<br>- recevoir les alertes en temps réel et garder l'historique des détections.<br>En continu — Traiter les alertes :<br>- Pour maintenir la vigilance des utilisateurs (qui ne doivent pas banaliser les alertes de l'antivirus), il est recommandé de contacter l'utilisateur du poste sur lequel une alerte a été générée.<br>- Très régulièrement (a minima 1 fois par semaine), surveiller et analyser la console d'administration de la solution antivirale. Elle permet aussi de s'assurer que l'antivirus est installé sur tous les postes, qu'il est actif et que sa base virale est à jour, et donc d'identifier les postes non conformes.",
        ]),
      ]),
    },
    {
      id_mesure: 'MALWARE.7',
      titre: 'Maîtrise des supports amovibles',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Politique : interdire les supports inconnus, encadrer les supports nécessaires.',
          'Fournir des supports professionnels :<br>- clés USB et disques durs chiffrés ;<br>- identification claire (logo, numéro de série) ;<br>- inventaire tenu à jour.',
          "Sensibilisation : ne jamais brancher une clé trouvée ou reçue d'un tiers non maîtrisé.",
        ]),
      ]),
    },
    {
      id_mesure: 'AUTH.1',
      titre: 'Changement des mots de passe par défaut',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Faire la liste des équipements et logiciels à vérifier : box internet, routeur, pare-feu, switch, imprimantes, stockage réseau (NAS), caméras, objets connectés, applications métier, etc.',
          "Retrouver les identifiants d'origine :<br>- étiquette collée sous l'appareil ou au dos ;<br>- documentation ou notice du fabricant ;<br>- site du constructeur (attention : ces mots de passe sont souvent publiés en ligne, c'est bien là le problème).",
          "Se connecter à l'interface d'administration de chaque équipement (généralement via un navigateur, avec l'adresse indiquée dans la notice).",
          "Remplacer identifiant ET mot de passe :<br>- changer aussi le nom du compte quand c'est possible (éviter « admin », « root », « user ») ;<br>- choisir un mot de passe long, unique pour chaque équipement, jamais réutilisé ailleurs ;<br>- ne pas se contenter d'ajouter un chiffre au mot de passe d'usine.",
          "Conserver les nouveaux accès en sécurité : gestionnaire de mots de passe ou coffre-fort numérique, avec la mention de l'équipement concerné. Ne pas les laisser sur un post-it ou dans un fichier partagé.",
          'Traiter en priorité ce qui est le plus exposé : équipements de sécurité, services accessibles depuis internet, équipements réseau.',
          "Refaire le point à chaque nouvel achat, chaque réinstallation et après toute remise à zéro (un « reset usine » restaure les mots de passe d'origine).",
        ]),
      ]),
    },
    {
      id_mesure: 'AUTH.4',
      titre: 'Concevoir des mots de passe robustes (TPE/PME)',
      description:
        "⚠️ Cette mesure s'applique à tous les mots de passe et secrets : utilisateurs, administrateurs, comptes de service, accès partagés, etc.",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Construire un mot de passe robuste<br>Privilégiez la longueur à la complexité : une phrase de passe (plusieurs mots assemblés) est souvent plus solide et plus facile à retenir qu\'un mot court bourré de caractères spéciaux.<br><a href="https://www.cnil.fr/fr/generer-un-mot-de-passe-solide">Générer un mot de passe solide (CNIL)</a><br><a href="https://monservicesecurise.cyber.gouv.fr/articles/fixer-des-contraintes-de-longueur-et-de-complexite-des-mots-de-passe">Contraintes de longueur et complexité (ANSSI / MonServiceSécurisé)</a>',
          'Utiliser un gestionnaire de mots de passe<br>Un humain ne peut pas retenir un mot de passe unique par service. Un gestionnaire génère, stocke et remplit automatiquement vos identifiants, protégés par un seul mot de passe maître (qui, lui, doit être très solide).<br><a href="https://messervices.cyber.gouv.fr/visas/catalogue-produits-services-profils-de-protection-sites-certifies-qualifies-agrees-anssi.pdf">Privilégiez un outil figurant au catalogue des produits qualifiés par l\'ANSSI</a>',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: 'Guide ANSSI Authentification multifacteur et mots de passe',
          url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-authentification_multifacteur_et_mots_de_passe.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'AUTH.4',
      titre: 'Activer la vérification en deux étapes (MFA)',
      description:
        "La quasi-totalité des services en ligne et logiciels professionnels (messagerie, banque, réseaux sociaux, outils métiers, cloud…) proposent aujourd'hui d'activer la vérification en deux étapes. Le nom et l'emplacement du réglage varient, mais la logique reste la même.",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Connectez-vous à votre compte, puis ouvrez les paramètres (souvent symbolisés par une roue crantée ou accessibles depuis votre nom/photo de profil).',
          'Cherchez la rubrique « Sécurité », « Sécurité et confidentialité », « Connexion » ou « Compte » selon les services (ex. Google, O365, WhatsApp).',
          "Repérez l'option intitulée « Vérification en deux étapes », « Authentification à deux facteurs », « 2FA », « MFA » ou « Double authentification », puis cliquez sur Activer.",
          "Choisissez la méthode de second facteur. À éviter si possible : le code reçu par SMS. Cette méthode reste préférable à l'absence de second facteur, mais elle est vulnérable au SIM swapping (vol de votre numéro par un attaquant) et à l'interception des SMS. Ne l'utilisez qu'en dernier recours, ou comme méthode de secours.",
          "Suivez les instructions à l'écran pour finaliser l'enrôlement (scan d'un QR code avec votre application, branchement de la clé, saisie d'un code de confirmation…).",
          "Sauvegardez précieusement les codes de récupération proposés à la fin de la configuration. Ils permettent de récupérer l'accès à votre compte si vous perdez votre téléphone ou votre clé. Conservez-les hors ligne (impression rangée dans un endroit sûr, gestionnaire de mots de passe).",
        ]),
      ]),
      note: "Si vous ne trouvez pas l'option, recherchez 'activer la vérification en deux étapes [nom du service]' sur le site de support officiel du service.",
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: 'Guide ANSSI Authentification multifacteur et mots de passe',
          url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-authentification_multifacteur_et_mots_de_passe.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'COMPTE.1',
      titre: 'Comptes individuels',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Inventorier tous les comptes existants : utilisateurs, administrateurs, comptes de service, comptes partagés.',
          'Pour chaque compte non individuel :<br>- si possible, remplacer par des comptes individuels ;<br>- sinon, justifier le maintien et appliquer les mesures de la mesure « comptes partagés ».',
          'Nomenclature claire :<br>- utilisateurs : prénom.nom ;<br>- administrateurs : adm-prénom.nom ou similaire, distinct du compte utilisateur ;<br>- services : nom du service explicite (ex. svc-backup, svc-monitoring).',
          'Pour chaque compte, élément secret (mot de passe ou clé) connu uniquement de la personne ou du processus autorisé.',
        ]),
      ]),
    },
    {
      id_mesure: 'COMPTE.2',
      titre: 'Comptes partagés',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Justifier le maintien : pour chaque compte partagé, documenter la raison technique ou organisationnelle qui empêche le passage en compte individuel.',
          'Liste limitée des utilisateurs autorisés : nominative, à jour, validée par le responsable.',
          'Stockage du secret :<br>- dans un coffre-fort numérique de mots de passe (gestionnaire partagé) ;<br>- jamais sur un post-it, fichier texte ou email.',
          "Renouvellement du secret :<br>- à chaque retrait d'un utilisateur (départ, mobilité interne) ;<br>- à fréquence régulière si la rotation est faible.",
          "Traçabilité :<br>- cahier de prise et de passation (qui utilise le compte, quand, pour quoi) ;<br>- corrélation avec les badges d'accès physique (par exemple si le compte est lié à une salle de supervision) ;<br>- journalisation applicative croisée.",
          "Si l'élément secret ne peut pas être renouvelé (cas rare) : mettre en œuvre un contrôle d'accès renforcé sur la ressource concernée et une surveillance accrue.",
        ]),
      ]),
    },
    {
      id_mesure: 'COMPTE.5',
      titre: 'Désactivation des comptes sans privilèges',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Définir les règles dans la politique de gestion des comptes :<br>- compte d'utilisateur partant : désactivation à la date du départ, suppression après période de conservation (souvent 30 à 90 jours selon politique RH) ;<br>- compte de prestataire : désactivation à la fin du contrat ;<br>- compte inactif depuis X mois (ex. 3 mois) : désactivation automatique avec alerte au responsable.",
          'Connecter la procédure RH (départ, mobilité) à la procédure IT (désactivation).',
          'Automatiser autant que possible :<br>- script de désactivation des comptes inactifs ;<br>- alerte automatique au-delà du délai prévu.',
          'Tracer chaque désactivation : date, motif, responsable.',
        ]),
      ]),
    },
    {
      id_mesure: 'COMPTE.6',
      titre: 'Désactivation des comptes à privilèges',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Définir les règles dans la politique de gestion des comptes :<br>- compte à privilèges (administrateur) : désactivation immédiate à la fin de la mission ou du besoin ;<br>- compte de service : désactivation dès l'arrêt de l'application ou du projet associé, avec un propriétaire identifié pour chaque compte ;<br>- compte à privilèges inactif depuis X mois (ex. 3 mois) : désactivation automatique avec alerte au responsable.",
          'Connecter la procédure RH et la gestion des missions/prestations à la procédure IT (fin de mission = désactivation).',
          'Automatiser autant que possible :<br>- inventaire et revue périodique des comptes à privilèges et comptes de service ;<br>- alerte automatique au-delà du délai prévu.',
          'Tracer chaque désactivation : date, motif, responsable.',
        ]),
      ]),
    },
    {
      id_mesure: 'COMPTE.4',
      titre: 'Revue annuelle des comptes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Extraire l'inventaire des comptes par périmètre : annuaire d'entreprise, applications métiers, systèmes critiques, etc.",
          "Pour chaque compte, vérifier :<br>- existence d'un utilisateur ou d'un processus rattaché ;<br>- rattachement nominatif (sauf comptes de service justifiés) ;<br>- dernière connexion (les comptes inactifs depuis longtemps doivent être désactivés) ;<br>- statut RH (toujours en poste ou parti) ;<br>- cohérence avec la mission actuelle.",
          "Faire valider l'inventaire par les responsables métiers.",
          'Désactiver / supprimer les comptes inutiles ou non justifiés.',
          'Tracer la revue : date, périmètre, participants, anomalies relevées, actions correctives.',
        ]),
      ]),
    },
    {
      id_mesure: 'DROITS.3',
      titre: 'Séparer compte utilisateur et compte administrateur sur les postes de travail',
      description:
        'La règle : un compte administrateur uniquement pour administrer, un compte utilisateur standard pour le travail quotidien.',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Créer un compte utilisateur séparé.<br>Sur chaque poste, créez deux comptes distincts dans les paramètres système, rubrique Comptes ou Utilisateurs et groupes :<br>- un compte administrateur avec un mot de passe robuste uniquement connu par les personnes autorisées et utilisé uniquement pour installer un logiciel ou modifier la configuration ;<br>- un compte utilisateur standard (sans droits d'administration) pour l'usage quotidien : navigation, mails, bureautique.<br>La démarche est documentée sur les sites de support officiels de chaque système d'exploitation ; sur Linux, elle dépend de la distribution.",
          'Travailler au quotidien avec le compte standard : pour les tâches usuelles (mails, navigation, bureautique), rutiliser le compte utilisateur standard.',
          "Ne pas oublier les processus automatiques : les agents installés sur les postes (sauvegarde, télédistribution, supervision, antivirus) tournent souvent avec des droits élevés — vérifiez qu'ils ne disposent que des droits nécessaires à leur fonction.",
          "Au-delà de quelques postes, si possible, gérez les droits via l'annuaire d'entreprise : aucun utilisateur n'est administrateur local de son poste par défaut, les comptes d'administration sont nominatifs et distincts des comptes utilisateurs courants, et leur usage est journalisé. C'est aussi ce qui permet de retirer rapidement les droits d'un collaborateur qui change de poste ou quitte l'entreprise.",
        ]),
      ]),
    },
    {
      id_mesure: 'DROITS.4',
      titre: "Attribution des droits d'accès",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Extraire les ressources (applicatifs et équipements) : annuaire d'entreprise, applications métiers, etc.",
          "Pour chaque périmètre, définir une matrice de droits :<br>- quels rôles ou groupes peuvent accéder ;<br>- en lecture seule ou en écriture ;<br>- règles d'exception.",
          "Préférer la gestion par groupes : créer un groupe RH, un groupe Finance, etc., et attribuer les droits aux groupes plutôt qu'aux individus.",
          'À chaque demande de droit : justification métier explicite, validation hiérarchique, attribution traçable.',
          'Pour les comptes à privilèges : encore plus strict et journalisation systématique.',
          'Ne pas oublier les processus automatiques : comptes de service, connecteurs applicatifs et intégrations entre outils disposent souvent de droits très larges — leur appliquer la même règle du besoin justifié.',
        ]),
      ]),
    },
    {
      id_mesure: 'DROITS.2',
      titre: 'Revue annuelle des droits',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Extraire pour chaque ressource (applicatif ou équipement) la liste des utilisateurs et leurs droits.',
          'Transmettre la liste au responsable de chaque ressource, pour validation :<br>- cet utilisateur a-t-il toujours besoin de ce droit ?<br>- le niveau de droit est-il adapté ?<br>- faut-il retirer / ajouter quelque chose ?',
          'Appliquer les modifications validées.',
          'Tracer la revue : date, périmètre, validateur, modifications appliquées.',
        ]),
      ]),
    },
    {
      id_mesure: 'COMPADMIN.10',
      titre: 'Séparer compte utilisateur et compte administrateur dédiés à cet usage',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "S'assurer de la création d'un compte utilisateur (sans privilèges d'administration) pour chacun des administrateurs. Ces comptes utilisateurs, via une authentification spécifique, seront utilisés pour l'accès à Internet, aux boîtes mail et aux fonctionnalités d'ordre administratif et bureautique.",
          'Réserver les comptes administrateurs (via une authentification spécifique) aux opérations de maintenance informatique, administration des services, gestion des sauvegardes, gestion des utilisateurs et des accès, paramétrage des systèmes et des applications, etc.',
        ]),
      ]),
    },
    {
      id_mesure: 'COMPADMIN.12',
      titre: "Cas dérogatoires d'administration",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Lister précisément les cas où l'administration n'est pas réalisée depuis un compte dédié (et documenter la justification).",
          'Pour chaque cas, mettre en œuvre des mesures de compensation, par exemple :<br>- mettre en place une traçabilité renforcée (journalisation détaillée, alerte sur actions critiques, conservation des logs > 1 an si possible) ;<br>- durcir le poste utilisé (antivirus, pare-feu local strict, navigation Internet restreinte) ;<br>- séparer les sessions ou utiliser sudo / élévation contrôlée plutôt que des droits admin permanents ;<br>- sensibilisation spécifique de la personne concernée.',
          'Planifier la migration vers un modèle « compte admin dédié » à moyen terme.',
          'Revoir périodiquement la pertinence du maintien du cas dérogatoire.',
        ]),
      ]),
    },
    {
      id_mesure: 'INCIDENT.3',
      titre: 'Analyse et qualification des événements',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Recenser les sources d'événements de sécurité :<br>- alertes des outils techniques (antivirus, EDR, pare-feu, supervision) ;<br>- signalements des utilisateurs (mails suspects, comportements anormaux) ;<br>- alertes de prestataires ou du CERT-FR.",
          "Définir une grille de qualification, par exemple :<br>- non-incident (faux positif ou comportement normal) ;<br>- à investiguer (signal faible, à corroborer) ;<br>- incident avéré (compromission, attaque, fuite confirmée) : déclencher la procédure de gestion d'incident.",
          'Centraliser la collecte dans un journal ou un outil simple ; même un tableur peut suffire au démarrage.',
          "Procéder à l'analyse :<br>- corréler avec d'autres sources (journaux, autres alertes) ;<br>- vérifier la cartographie : l'événement est-il cohérent avec une activité légitime ?<br>- documenter la décision.",
          'Pour les structures plus matures : prestation PDIS qualifiée ANSSI (Prestataire de détection des incidents de sécurité).',
        ]),
      ]),
    },
    {
      id_mesure: 'INCIDENT.5',
      titre: 'Conservation des relevés techniques',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Définir un registre centralisé des incidents (date, type, périmètre, actions menées, relevés associés).',
          "Pour chaque incident, identifier les relevés à conserver :<br>- rapport d'analyse de l'incident ;<br>- alertes des outils (antivirus, EDR, SIEM) ;<br>- journaux des systèmes concernés ;<br>- le cas échéant, copies physiques de disques ou images mémoire (réalisées avec un PRIS).",
          'Définir une durée de conservation :<br>- cohérente avec le RGPD (limitée à la finalité : preuve, audit, contrôle) ;<br>- cohérente avec les obligations sectorielles ;<br>- typiquement entre 6 mois et plusieurs années selon la gravité.',
          "Documenter ces règles dans la procédure de gestion d'incident.",
        ]),
      ]),
    },
    {
      id_mesure: 'CONTINU.1',
      titre: 'Sauvegarder ses données (TPE/PME)',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Concevoir le processus :<br>- identifier les données à sauvegarder : comptabilité, fichiers clients et fournisseurs, contrats, devis et factures, boîtes mail, documents partagés, photos et vidéos professionnelles ;<br>- définir la fréquence en se demandant « Combien de temps de données suis-je prêt à perdre ? » (une heure ? une journée ? une semaine ?). La réponse détermine le rythme des sauvegardes (quotidien dans la plupart des cas).',
          "Mettre en œuvre :<br>- choisir un support adapté : par exemple un disque dur externe pour une copie hors ligne, complété idéalement par un service cloud professionnel (pas un compte grand public) pour disposer d'une seconde copie à distance ;<br>- automatiser les sauvegardes avec un logiciel dédié (souvent fourni avec le disque, ou via un outil gratuit) ; une sauvegarde manuelle finit toujours par être oubliée ;<br>- débrancher le support après chaque sauvegarde : c'est cette copie déconnectée qui vous sauvera en cas de rançongiciel (un attaquant ne peut pas chiffrer ce qui n'est pas branché) ;<br>- tester la restauration en essayant de récupérer quelques fichiers au hasard ;<br>- appliquer la règle « 3-2-1 » : 3 copies distinctes des données (les données en production + 2 sauvegardes), sur 2 supports différents, dont 1 hors ligne.",
          "Vérifier :<br>- quel que soit le support utilisé, réaliser des tests de restauration réguliers pour s'assurer que les données sauvegardées sont toujours exploitables, complètes et inaltérées.",
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI Sauvegarde des systèmes d'information – Les Fondamentaux",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'CONTINU.2',
      titre: 'Test des sauvegardes',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Définir l'inventaire à tester : pour chaque système, vérifier au moins une fois par an la capacité à restaurer.",
          "Combiner plusieurs types de tests :<br>- test ponctuel : restaurer un fichier ou un dossier au hasard, à la demande ;<br>- test partiel : restaurer une application complète sur un environnement de test ;<br>- test général : exercice de restauration complète d'un système, dans des conditions proches du réel.",
          "Pour chaque test, mesurer :<br>- le délai de restauration (temps réel) ;<br>- l'exhaustivité (toutes les données attendues sont-elles présentes ?) ;<br>- la cohérence applicative (le système restauré fonctionne-t-il ?).",
          'Conserver une trace écrite des résultats (date, périmètre, succès / échec, actions correctives).',
          'Si des sauvegardes échouent ou sont incomplètes : corriger immédiatement et tester à nouveau.',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: "Guide ANSSI Sauvegarde des systèmes d'information – Les Fondamentaux",
          url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
        }),
      ]),
    },
    {
      id_mesure: 'CRISE.1',
      titre: 'Procédure de gestion de crise cyber',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Critères de déclenchement : que considère-t-on comme un incident majeur ? (paralysie d'activité, fuite de données, atteinte à la sécurité d'un service critique).",
          'Composition de la cellule de crise.',
          'Premiers réflexes techniques :<br>- isoler les machines suspectes du réseau ;<br>- ne pas éteindre, ne pas redémarrer (préserver les preuves) ;<br>- prévenir le référent SSI puis le dirigeant ;<br>- contacter un prestataire PRIS qualifié si besoin.',
          "Chaîne d'alerte externe : assureur cyber, CERT-FR (cert@ssi.gouv.fr), CNIL (si données personnelles), autorités sectorielles, principaux clients et partenaires.",
          'Annuaire des parties prenantes externes : à constituer en amont, conservé hors ligne, mis à jour annuellement.',
          'Plan de communication interne et externe : qui parle, à qui, dans quel délai.',
          'Suivi pendant la crise : journal de bord, rythme de réunions, décisions prises.',
          'Sortie de crise : conditions de retour à la normale, communication de clôture, déclenchement du RETEX.',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: 'Ressources REAGIR sur MesServicesCyber',
          url: 'https://messervices.cyber.gouv.fr/catalogue#guides?besoin=REAGIR',
        }),
      ]),
    },
    {
      id_mesure: 'CRISE.2',
      titre: "Retour d'expérience (RETEX)",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Déclencher le RETEX dès la sortie de crise, d'entraînement ou d'exercice, et au plus tard sous 30 jours :<br>- RETEX à chaud (J+7 environ) : recueil immédiat des constats, encore frais ;<br>- RETEX à froid (J+30 environ) : analyse plus posée, vision consolidée.",
          'Réunir les participants : cellule de crise, équipes opérationnelles, prestataires impliqués.',
          "Méthode :<br>- reconstituer la chronologie de la crise ;<br>- identifier ce qui a bien fonctionné (à pérenniser) ;<br>- identifier ce qui n'a pas fonctionné (procédures incomplètes, annuaire obsolète, outils défaillants, manque de compétences) ;<br>- identifier les améliorations à apporter.",
          'Pour chaque amélioration, désigner un responsable et fixer une échéance.',
          'Intégrer les modifications dans les procédures et les exercices à venir.',
          'Conserver le rapport de RETEX et présenter une synthèse en comité de pilotage sécurité.',
        ]),
      ]),
      aller_plus_loin: knex.raw('?::jsonb', [
        JSON.stringify({
          libelle: 'Guide ANSSI Organiser un exercice de gestion de crise cyber',
          url: 'https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
        }),
      ]),
    },
    {
      id_mesure: 'CRISE.8',
      titre: 'Liste des contacts de crise à imprimer',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Identifier les rôles à mobiliser en cas de cyberattaque, puis les attribuer aux personnes réellement présentes dans votre entité (une même personne peut cumuler plusieurs rôles) :<br>- prise de décision (dirigeant) ;<br>- gestion de l'informatique (interne ou prestataire) ;<br>- communication (interne, clients, partenaires) ;<br>- juridique et déclaration (CNIL si données personnelles, dépôt de plainte) ;<br>- lien avec l'assurance cyber.",
          "Ajouter les contacts externes indispensables : prestataire informatique, hébergeur, opérateur télécom, éditeur des logiciels métier, banque, assureur, forces de l'ordre, et les dispositifs d'aide publics (Cybermalveillance.gouv.fr, ANSSI/CERT selon votre statut).",
          "Pour chaque contact, noter : nom, fonction, numéro de téléphone (idéalement un mobile joignable hors du réseau de l'entreprise), adresse mail — et si possible une adresse mail de secours, indépendante de votre messagerie professionnelle.",
          "Ne pas oublier les références utiles : numéro de contrat d'infogérance, numéro de police d'assurance cyber, identifiant client chez l'hébergeur, numéro d'astreinte. Sans ces références, la prise en charge est beaucoup plus lente.",
          'Imprimer plusieurs exemplaires et les répartir intelligemment : classeur de crise au bureau, domicile du dirigeant, véhicule ou sac du responsable informatique. Le principe : la liste doit rester lisible sans ordinateur, sans réseau et sans internet.',
          'Dater et versionner le document (« Version du 27/07/2026 ») pour repérer immédiatement un exemplaire périmé.',
          "Protéger le document : il contient des données personnelles et une cartographie de vos prestataires. Informer les personnes concernées, limiter la diffusion aux seules personnes utiles, et ne pas laisser d'exemplaires traîner dans des espaces communs.",
          'Maintenir à jour cette liste, notamment à chaque départ, arrivée ou changement de prestataire.',
        ]),
      ]),
    },
    {
      id_mesure: 'CRISE.9',
      titre: 'Liste de contacts de crise disponible',
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "Tenir deux versions synchronisées :<br>- version numérique dans un dossier sécurisé du SI ;<br>- version papier imprimée, conservée dans un classeur en armoire fermée à clé, chez le référent SSI à son domicile, ou dans un coffre si l'entité en dispose.",
          'Synchroniser les deux versions : à chaque mise à jour numérique, réimprimer.',
          "Tester l'accessibilité au moins une fois par an (lors de l'exercice de crise) : « si la messagerie est inaccessible, qui peut donner le numéro de tel contact en 2 minutes ? ».",
          'Mettre à jour cette liste en cas de changement et a minima annuellement.',
        ]),
      ]),
    },
    {
      id_mesure: 'EXO.1',
      titre: "S'entraîner à gérer une crise cyber (TPE/PME)",
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          'Utiliser les kits et guides existants.<br>Inutile d\'écrire un scénario de zéro. Des kits clés en main et des guides sont disponibles :<br>- <a href="https://messervices.cyber.gouv.fr/ressources/reflexes-cyber.html">Kit Réflexes cyber ANSSI</a><br>- [A FILTRER AVEC LE SIRET] Kits sectoriels et collectivités ANSSI : https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kit-exercice-collectivites-territoriales/ et https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kits-dexercices-sectoriels/<br>- <a href="https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber">Guide d\'aide à l\'organisation d\'un exercice de gestion de crise cyber</a><br>- <a href="https://www.amf.asso.fr/page-capcyberbrcrises-and-collectivites/43113">CapCyber Crise</a>',
          "Organiser un exercice simple.<br>Un format « sur table » suffit pour commencer : réunissez les personnes-clés (direction, IT ou prestataire, communication, métier), présentez un scénario réaliste (rançongiciel, fuite de données, indisponibilité de la messagerie…) et faites-leur dérouler à voix haute les décisions, dans l'ordre. À l'issue, formalisez les enseignements : qui appeler en priorité, qui décide de couper le réseau, comment alerter les clients, où sont les contacts d'urgence (assureur, CERT-FR, prestataire de réponse à incident).",
          "Pour les entités plus matures : Rempar.<br><a href=\"https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/rempar/rempar25/\">L'ANSSI organise chaque année un exercice national, Rempar, avec scénarios prêts à jouer et accompagnement</a><br>C'est l'occasion idéale de passer d'un exercice interne à un exercice plus complet, voire intersectoriel.",
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('tutoriels').del();
}
