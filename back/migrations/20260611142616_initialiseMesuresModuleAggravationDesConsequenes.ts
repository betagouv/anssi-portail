import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('modules').insert({ id: 2, nom: `Aggravation des conséquences d'un incident ou d'une crise` });

  await knex('mesures').insert([
    {
      id: `INCIDENT.3`,
      id_module: 2,
      ordre: 2010,
      titre: `Mettre en œuvre des mécanismes permettant d’analyser et de qualifier les événements de sécurité ainsi que d'identifier d'éventuels incidents`,
      phrase_accroche: ``,
      explications: `Vos outils de sécurité (antivirus, EDR, pare-feu, supervision) génèrent en permanence des alertes. Certaines sont du bruit, d'autres sont de vrais signaux. Sans analyse, tout se noie.

Un événement de sécurité ne devient un incident qu'après analyse. Vous devez donc mettre en place des mécanismes pour analyser et qualifier les événements de sécurité remontés (par vos outils, par vos utilisateurs, par vos prestataires) et identifier les incidents potentiels ou avérés.`,
      action_prioritaire: `Désigner une personne responsable de la qualification des événements. Définir une grille simple (incident / non-incident / à investiguer) et la documenter.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['12.3-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `INCIDENT.5`,
      id_module: 2,
      ordre: 2020,
      titre: `Conserver les relevés techniques produits dans le cadre de la gestion des incidents de sécurité`,
      phrase_accroche: ``,
      explications: `Quand un incident survient, les traces techniques sont précieuses : elles permettent de comprendre ce qui s'est passé, et de constituer des preuves en cas de dépôt de plainte ou de contrôle.

Conservez les relevés techniques produits dans le cadre de la gestion des incidents (rapport d'analyse, alertes remontées par les outils, etc.). La durée de conservation doit être pertinente au regard de la protection des données à caractère personnel (notamment de la finalité du traitement).`,
      action_prioritaire: `Définir un registre centralisé des incidents et une durée de conservation par type de relevé (rapports d'analyse, journaux, copies forensic, etc.).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['12.6-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `CONTINU.2`,
      id_module: 2,
      ordre: 2030,
      titre: `Tester les procédures de sauvegarde et de restauration a minima annuellement`,
      phrase_accroche: ``,
      explications: `Une sauvegarde que vous n'avez jamais restaurée, vous ne savez pas si elle fonctionne. Et le moment où vous le découvrez (en pleine attaque rançongiciel, par exemple) est rarement le bon.

D'où le principe : tester les procédures de sauvegarde et de restauration au moins une fois par an, pour vérifier que les sauvegardes se font correctement et qu'elles peuvent être effectivement restaurées.`,
      action_prioritaire: `Bloquer une date annuelle de test de restauration. Tester la restauration complète d'au moins un système critique (changer le système choisi à chaque itération) et la restauration de fichiers individuels.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['13.2-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Pour aller plus loin : Guide ANSSI Sauvegarde des systèmes d'information – Les Fondamentaux",
            url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
          },
        ]),
      ]),
    },
    {
      id: `CRISE.1`,
      id_module: 2,
      ordre: 2040,
      titre: `Formaliser et mettre en oeuvre une procédure de gestion de crise en cas d'incident de sécurité majeur`,
      phrase_accroche: ``,
      explications: `Une cyberattaque majeure, ça ne s'improvise pas. Sans procédure préparée à l'avance, chacun improvise sous stress, les décisions prennent des heures, les mauvais réflexes se multiplient.

Définissez une procédure de gestion de crise activable en cas d'incident significatif sur vos systèmes, ainsi qu'un annuaire des parties prenantes externes (assureur cyber, prestataire de réponse à incident, autorités, CERT-FR, partenaires-clés), construit en s'appuyant sur votre cartographie de l'écosystème.`,
      action_prioritaire: `Rédiger une procédure courte (5 à 10 pages) : critères de déclenchement, cellule de crise (qui, quels rôles), chaîne d'alerte, premiers réflexes techniques, obligations de notification. La faire approuver par le dirigeant.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.1-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Pour aller plus loin : les ressources REAGIR sur MesServicesCyber',
            url: 'https://messervices.cyber.gouv.fr/catalogue#guides?besoin=REAGIR',
          },
        ]),
      ]),
    },
    {
      id: `CRISE.2`,
      id_module: 2,
      ordre: 2050,
      titre: `Réaliser un retour d'expérience après tout déclenchement de la procédure de gestion de crise`,
      phrase_accroche: ``,
      explications: `Une crise qui se passe sans retour d'expérience, c'est une crise dont on n'apprend rien. Les mêmes manques se reproduiront à la suivante : annuaire pas à jour, sauvegardes incomplètes, communication chaotique.

À chaque activation du dispositif de gestion de crise — qu'il s'agisse d'un entraînement, d'un exercice ou d'une crise réelle —, organisez un retour d'expérience (RETEX) pour identifier les axes d'amélioration et les mesures à mettre en œuvre.`,
      action_prioritaire: `Organiser un RETEX systématiquement, à chaud (J+7) puis à froid (J+30) après tout déclenchement. Tracer les enseignements et associer chaque action à un responsable.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.5-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Pour aller plus loin : Guide ANSSI Organiser un exercice de gestion de crise cyber',
            url: 'https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
          },
        ]),
      ]),
    },
    {
      id: `CRISE.9`,
      id_module: 2,
      ordre: 2060,
      titre: `S'assurer de la disponibilité de la liste des personnes et leurs coordonnées à contacter en cas d'incident de sécurité majeur`,
      phrase_accroche: ``,
      explications: `Le jour où vos systèmes tombent (rançongiciel, panne, sinistre), votre messagerie aussi est inaccessible. Si la liste des personnes à contacter n'existe qu'en numérique sur le SI, vous ne pourrez pas l'ouvrir.

D'où l'exigence d'une double disponibilité de la liste des personnes mobilisables dans la gestion de crise d'origine cyber :
- au format papier si les systèmes d'information ne sont plus disponibles ;
- au format numérique si la version papier n'est pas accessible.`,
      action_prioritaire: `Imprimer la liste des contacts de crise et la conserver dans un endroit sûr accessible (classeur en armoire, coffre). La maintenir à jour annuellement et à chaque changement.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['14.3-EI/EE'])]),
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
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: 'Pour aller plus loin : Guide ANSSI Organiser un exercice de gestion de crise cyber',
            url: 'https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
          },
        ]),
      ]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').delete().where({ id: 'INCIDENT.3' });
  await knex('mesures').delete().where({ id: 'INCIDENT.5' });
  await knex('mesures').delete().where({ id: 'CONTINU.2' });
  await knex('mesures').delete().where({ id: 'CRISE.1' });
  await knex('mesures').delete().where({ id: 'CRISE.2' });
  await knex('mesures').delete().where({ id: 'CRISE.9' });
  await knex('modules').delete().where({ id: 2 });
}
