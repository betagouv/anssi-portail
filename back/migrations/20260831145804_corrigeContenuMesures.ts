import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      explications: `<p>Utiliser des mots de passe suffisamment longs et difficiles à deviner pour protéger tous les comptes de l'organisation. Le niveau de protection attendu dépend de la sensibilité de l'accès : plus un compte donne accès à des informations ou des outils importants, plus le secret qui le protège doit être robuste.</p>
<p>À titre indicatif, la longueur minimale d'un mot de passe combinant minuscules, majuscules, chiffres et caractères spéciaux recommandée est :</p>
<ul>
<li>accès peu ou moyennement sensible : 9 à 11 caractères ;</li>
<li>accès sensible : 12 à 14 caractères ;</li>
<li>accès très sensible : 15 caractères ou plus.</li>
</ul>
<p>En cas de doute, retenez la borne supérieure : 12 caractères minimum est un bon réflexe par défaut.</p>
<p>Sur les comptes les plus importants, le mot de passe gagne à ne pas rester la seule barrière : lorsqu'un service le propose, une vérification supplémentaire au moment de la connexion (code sur une application, clé physique, empreinte…) protège l'accès même si le mot de passe venait à être volé ou deviné.</p>
<p>Pour plus de précision, ou si un autre type de secret est utilisé (ex. certificat), appliquer les recommandations du guide « Authentification multifacteur et mots de passe ».</p>`,
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.4')
    .update({
      explications: `<p>Utiliser des mots de passe suffisamment longs et difficiles à deviner pour protéger tous les comptes de l'organisation. Le niveau de protection attendu dépend de la sensibilité de l'accès : plus un compte donne accès à des informations ou des outils importants, plus le secret qui le protège doit être robuste.</p>
<p>À titre indicatif, la longueur minimale d'un mot de passe combinant minuscules, majuscules, chiffres et caractères spéciaux recommandée est :<br>
accès peu ou moyennement sensible : 9 à 11 caractères ;<br>
accès sensible : 12 à 14 caractères ;<br>
accès très sensible : 15 caractères ou plus.<br>
En cas de doute, retenez la borne supérieure : 12 caractères minimum est un bon réflexe par défaut.</p>
<p>Sur les comptes les plus importants, le mot de passe gagne à ne pas rester la seule barrière : lorsqu'un service le propose, une vérification supplémentaire au moment de la connexion (code sur une application, clé physique, empreinte…) protège l'accès même si le mot de passe venait à être volé ou deviné.</p>
<p>Pour plus de précision, ou si un autre type de secret est utilisé (ex. certificat), appliquer les recommandations du guide « Authentification multifacteur et mots de passe ».</p>`,
    });
}
