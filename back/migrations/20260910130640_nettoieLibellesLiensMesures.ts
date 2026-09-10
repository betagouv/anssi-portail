import type { Knex } from 'knex';

const prefixe = 'Pour aller plus loin : ';

// Libellés issus des migrations 20260604075323 et 20260611142616,
// avec les apostrophes typographiques introduites par 20260831142500.
const libellesExistants = [
  { id: 'CONTINU.1', libelle: 'Guide ANSSI SAUVEGARDE DES SYSTÈMES D’INFORMATION - Les Fondamentaux' },
  { id: 'CONTINU.2', libelle: 'Guide ANSSI Sauvegarde des systèmes d’information – Les Fondamentaux' },
  { id: 'CRISE.1', libelle: 'les ressources REAGIR sur MesServicesCyber' },
  { id: 'CRISE.2', libelle: 'Guide ANSSI Organiser un exercice de gestion de crise cyber' },
  { id: 'CRISE.9', libelle: 'Guide ANSSI Organiser un exercice de gestion de crise cyber' },
];

const remplaceLibelle = async (knex: Knex, id: string, avant: string, apres: string): Promise<void> => {
  await knex('mesures')
    .where('id', id)
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
  for (const { id, libelle } of libellesExistants) {
    await remplaceLibelle(knex, id, prefixe + libelle, libelle.charAt(0).toUpperCase() + libelle.slice(1));
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const { id, libelle } of libellesExistants) {
    await remplaceLibelle(knex, id, libelle.charAt(0).toUpperCase() + libelle.slice(1), prefixe + libelle);
  }
}
