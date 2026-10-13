import type { Knex } from 'knex';

// Mesures ayant reçu le lien via 20260910125401_ajouteFicheGestionIdentitesAuxMesures.
const mesures = [
  'AUTH.1',
  'AUTH.4',
  'COMPTE.1',
  'COMPTE.2',
  'COMPTE.5',
  'COMPTE.6',
  'COMPTE.4',
  'DROITS.3',
  'DROITS.4',
  'DROITS.2',
];

const libelleAvecPrefixe = 'Fiche pratique - Gestion des identités';
const libelleSansPrefixe = 'Gestion des identités';

const remplaceLibelle = async (knex: Knex, avant: string, apres: string): Promise<void> => {
  await knex('mesures')
    .whereIn('id', mesures)
    .whereRaw('liens @> ?::jsonb', [JSON.stringify([{ libelle: avant }])])
    .update({
      liens: knex.raw(
        `(SELECT jsonb_agg(
          CASE WHEN lien->>'libelle' = ?
            THEN jsonb_set(lien, '{libelle}', to_jsonb(?::text))
            ELSE lien
          END ORDER BY position
        ) FROM jsonb_array_elements(liens) WITH ORDINALITY AS elements(lien, position))`,
        [avant, apres]
      ),
    });
};

export async function up(knex: Knex): Promise<void> {
  await remplaceLibelle(knex, libelleAvecPrefixe, libelleSansPrefixe);
}

export async function down(knex: Knex): Promise<void> {
  await remplaceLibelle(knex, libelleSansPrefixe, libelleAvecPrefixe);
}
