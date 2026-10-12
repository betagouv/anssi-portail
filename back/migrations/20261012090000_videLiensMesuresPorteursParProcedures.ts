import type { Knex } from 'knex';

/*
 Alignement de `mesures.liens` sur l'export
 "Prod_Referentiel de mesure - Parcours de sécurisation-Mesures.csv" : la colonne « Lien mesure » n'y est
 renseignée que pour les 10 mesures « Fiche pratique - Gestion des identités » (déjà à jour en base).
 Elle est vide pour les 12 mesures ci-dessous, qui portaient encore un lien en base.

 Pour 11 d'entre elles, le lien existe déjà côté `procedures` (`aller_plus_loin` ou <msc-lien> dans les étapes).
 CRISE.9 n'a pas de lien côté procédure : son lien (guide d'organisation d'un exercice de crise) est perdu.

 Aucune modification de la table `procedures` : son contenu est déjà identique à l'export
 "Prod_Referentiel de mesure - Parcours de sécurisation-TUTO (1).csv".
 */

type Lien = { libelle: string; url: string };

const CATALOGUE_ANSSI: Lien = {
  libelle: 'Catalogue des produits et services certifiés, qualifiés et agréés par l’ANSSI',
  url: 'https://messervices.cyber.gouv.fr/visas/catalogue-produits-services-profils-de-protection-sites-certifies-qualifies-agrees-anssi.pdf',
};

const GUIDE_EXERCICE_CRISE: Lien = {
  libelle: 'Guide ANSSI Organiser un exercice de gestion de crise cyber',
  url: 'https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
};

const LIENS_PAR_MESURE: Record<string, Lien[]> = {
  'RECENSEMENT.3': [
    {
      libelle: 'Guide ANSSI « Cartographie du système d’information – Guide d’élaboration en 5 étapes », Étape 5',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf',
    },
  ],
  'PSSI.2': [CATALOGUE_ANSSI],
  'CONTRAT.1': [
    {
      libelle: 'Guide ANSSI « Maîtriser les risques de l’infogérance »',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/2010-12-03_Guide_externalisation.pdf',
    },
  ],
  'CONTRAT.2': [CATALOGUE_ANSSI],
  'RH.1': [
    {
      libelle:
        'Guide ANSSI « Charte d’utilisation des moyens informatiques et des outils numériques – Guide d’élaboration en 8 points clés pour les PME et ETI »',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/guide-charte-utilisation-moyens-informatiques-outils-numeriques_anssi.pdf',
    },
  ],
  'RH.5': [{ libelle: 'SecNumAcadémie (ANSSI, gratuit)', url: 'https://secnumacademie.gouv.fr/' }],
  'FILTRE.1': [
    {
      libelle: 'ANSSI, « Recommandations pour la définition d’une politique de filtrage réseau d’un pare-feu »',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/NP_Politique_pare_feu_NoteTech.pdf',
    },
  ],
  'CONTINU.1': [
    {
      libelle: 'Guide ANSSI SAUVEGARDE DES SYSTÈMES D’INFORMATION - Les Fondamentaux',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
    },
  ],
  'CONTINU.2': [
    {
      libelle: 'Guide ANSSI Sauvegarde des systèmes d’information – Les Fondamentaux',
      url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
    },
  ],
  'CRISE.1': [
    {
      libelle: 'Les ressources REAGIR sur MesServicesCyber',
      url: 'https://messervices.cyber.gouv.fr/catalogue#guides?besoin=REAGIR',
    },
  ],
  'CRISE.2': [GUIDE_EXERCICE_CRISE],
  'CRISE.9': [GUIDE_EXERCICE_CRISE],
};

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .whereIn('id', Object.keys(LIENS_PAR_MESURE))
    .update({ liens: knex.raw("'[]'::jsonb") });
}

export async function down(knex: Knex): Promise<void> {
  for (const [id, liens] of Object.entries(LIENS_PAR_MESURE)) {
    await knex('mesures')
      .where('id', id)
      .update({ liens: knex.raw('?::jsonb', [JSON.stringify(liens)]) });
  }
}
