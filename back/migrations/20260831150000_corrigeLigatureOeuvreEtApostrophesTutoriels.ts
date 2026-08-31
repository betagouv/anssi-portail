import type { Knex } from 'knex';

/*
 Même correction que `20260831142500_corrigeLigatureOeuvreMesures.ts`, appliquée à la table
 `tutoriels` :
 - l'orthographe de « œuvre »/« œuvres » (caractère ligaturé « œ », saisi « oe ») ;
 - les apostrophes droites (U+0027, ') en apostrophes typographiques (U+2019, ’).

 Les deux corrections sont faites par des `replace()` SQL globaux sur les colonnes concernées
 (titre, description, note, etapes, aller_plus_loin) plutôt que par des valeurs codées en dur,
 pour les mêmes raisons que dans la migration `mesures` : ces colonnes sont trop nombreuses et
 changeantes pour être retranscrites fiablement à la main, et ni « oe » non ligaturé ni
 l'apostrophe droite n'ont d'usage légitime dans ces textes.

 Vérification faite sur le contenu actuel de `tutoriels` : aucune occurrence de « oeuvre » non
 ligaturé n'y a été trouvée (uniquement des « œuvre » déjà corrects) ; le `replace()` est
 néanmoins conservé pour couvrir toute ligne non vue ici et pour rester symétrique avec la
 migration `mesures`.

 down() ne peut pas distinguer les apostrophes typographiques déjà présentes avant cette
 migration de celles issues de la conversion : la reconversion ’ → ' sur rollback est donc une
 restauration approximative, pas un retour bit à bit à l'état antérieur.
 */

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE tutoriels
    SET
      titre = replace(replace(titre, 'oeuvres', 'œuvres'), 'oeuvre', 'œuvre'),
      description = replace(replace(description, 'oeuvres', 'œuvres'), 'oeuvre', 'œuvre'),
      note = replace(replace(note, 'oeuvres', 'œuvres'), 'oeuvre', 'œuvre'),
      etapes = replace(replace(etapes::text, 'oeuvres', 'œuvres'), 'oeuvre', 'œuvre')::jsonb,
      aller_plus_loin = replace(replace(aller_plus_loin::text, 'oeuvres', 'œuvres'), 'oeuvre', 'œuvre')::jsonb
    WHERE
      titre LIKE '%oeuvre%'
      OR description LIKE '%oeuvre%'
      OR note LIKE '%oeuvre%'
      OR etapes::text LIKE '%oeuvre%'
      OR aller_plus_loin::text LIKE '%oeuvre%'
  `);

  await knex.raw(`
    UPDATE tutoriels
    SET
      titre = replace(titre, '''', '’'),
      description = replace(description, '''', '’'),
      note = replace(note, '''', '’'),
      etapes = replace(etapes::text, '''', '’')::jsonb,
      aller_plus_loin = replace(aller_plus_loin::text, '''', '’')::jsonb
    WHERE
      titre LIKE '%''%'
      OR description LIKE '%''%'
      OR note LIKE '%''%'
      OR etapes::text LIKE '%''%'
      OR aller_plus_loin::text LIKE '%''%'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE tutoriels
    SET
      titre = replace(titre, '’', ''''),
      description = replace(description, '’', ''''),
      note = replace(note, '’', ''''),
      etapes = replace(etapes::text, '’', '''')::jsonb,
      aller_plus_loin = replace(aller_plus_loin::text, '’', '''')::jsonb
    WHERE
      titre LIKE '%’%'
      OR description LIKE '%’%'
      OR note LIKE '%’%'
      OR etapes::text LIKE '%’%'
      OR aller_plus_loin::text LIKE '%’%'
  `);

  await knex.raw(`
    UPDATE tutoriels
    SET
      titre = replace(replace(titre, 'œuvres', 'oeuvres'), 'œuvre', 'oeuvre'),
      description = replace(replace(description, 'œuvres', 'oeuvres'), 'œuvre', 'oeuvre'),
      note = replace(replace(note, 'œuvres', 'oeuvres'), 'œuvre', 'oeuvre'),
      etapes = replace(replace(etapes::text, 'œuvres', 'oeuvres'), 'œuvre', 'oeuvre')::jsonb,
      aller_plus_loin = replace(replace(aller_plus_loin::text, 'œuvres', 'oeuvres'), 'œuvre', 'oeuvre')::jsonb
    WHERE
      titre LIKE '%œuvre%'
      OR description LIKE '%œuvre%'
      OR note LIKE '%œuvre%'
      OR etapes::text LIKE '%œuvre%'
      OR aller_plus_loin::text LIKE '%œuvre%'
  `);
}
