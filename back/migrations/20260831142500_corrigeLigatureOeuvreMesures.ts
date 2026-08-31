import type { Knex } from 'knex';

/*
 Corrige, dans la table `mesures` :
 - l'orthographe de « œuvre » (et ses formes « mise/mettre en œuvre ») : le caractère ligaturé
   « œ » avait été saisi « oe » dans plusieurs titres, explications et actions ;
 - les apostrophes droites (U+0027, ') en apostrophes typographiques (U+2019, ’), sur
   l'ensemble des colonnes textuelles et JSONB de la table (les deux usages coexistaient dans
   les données).

 La correction des apostrophes est faite par un `replace()` SQL global plutôt que par des
 valeurs codées en dur : les colonnes concernées (titre, phrase_accroche, explications,
 action_prioritaire, action_facile_a_faire, risques, liens) sont trop nombreuses et changeantes
 pour être retranscrites fiablement à la main, et l'apostrophe droite n'a pas d'autre usage
 légitime dans ces textes (les citations utilisent des guillemets « »).

 down() ne peut pas distinguer les apostrophes typographiques déjà présentes avant cette
 migration de celles issues de la conversion : la reconversion ’ → ' sur rollback est donc une
 restauration approximative, pas un retour bit à bit à l'état antérieur.
 */

export async function up(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'CONFORMITE.1').update({
    action_facile_a_faire: `Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en œuvre.`,
  });

  await knex('mesures').where('id', 'CONFORMITE.2').update({
    titre: `Définir et mettre en œuvre en continu un plan d'action pour corriger les non-conformités identifiées`,
  });

  await knex('mesures').where('id', 'RH.4').update({
    titre: `Formaliser et mettre en œuvre un processus de gestion des arrivées, départs et changements de fonction`,
  });

  await knex('mesures').where('id', 'PSSI.1').update({
    titre: `Formaliser et mettre en œuvre une politique de sécurité des systèmes d'information (PSSI)`,
  });

  await knex('mesures').where('id', 'PSSI.2').update({
    titre: `Formaliser et mettre en œuvre une politique de sécurité relative à l'usage du chiffrement`,
  });

  await knex('mesures').where('id', 'PSSI.3').update({
    titre: `Formaliser et mettre en œuvre une politique de sécurité relative au contrôle d'accès physique et logique`,
  });

  await knex('mesures').where('id', 'PSSI.6').update({
    titre: `Formaliser et mettre en œuvre une politique de sécurité relative à la gestion des comptes`,
  });

  await knex('mesures').where('id', 'PSSI.4').update({
    titre: `Formaliser et mettre en œuvre une politique de sécurité relative à l'application des mesures de sécurité mises en œuvre`,
  });

  await knex('mesures')
    .where('id', 'MCO_MCS.4')
    .update({
      explications: `<p>Quand un correctif de sécurité est publié, c'est généralement parce qu'une vulnérabilité est connue. Plus vous tardez à l'appliquer, plus la fenêtre d'attaque reste ouverte — et les attaquants ne s'en privent pas.</p>
<p>Le principe est de mettre en œuvre :</p>
<ul>
<li><strong>sans délai</strong> : les actions visant à l'installation des correctifs de sécurité (tests, préparation, planification) ;</li>
<li><strong>sans retard injustifié</strong> : l'application effective des correctifs après ces actions.</li>
</ul>
<p>Cette exigence s'applique sur les équipements et applicatifs exposés à des systèmes d'information tiers (serveurs web, pare-feu, messagerie en ligne) et sur les postes de travail des utilisateurs. Si des raisons techniques ou opérationnelles empêchent l'installation d'un correctif, mettez en œuvre des mesures d'atténuation (isolation, contrôle d'accès renforcé, surveillance accrue).</p>`,
    });

  await knex('mesures').where('id', 'MCO_MCS.6').update({
    titre: `Mettre en œuvre des mesures complémentaires en cas d'utilisation d'un logiciel dans une version obsolète`,
  });

  await knex('mesures').where('id', 'DISTANCE.1').update({
    titre: `Mettre en œuvre un mécanisme de chiffrement et d'authentification pour les accès à distance aux systèmes d'information`,
  });

  await knex('mesures').where('id', 'COMPADMIN.12').update({
    titre: `Mettre en œuvre des mesures complémentaires lorsque les actions d'administration ne sont pas effectuées à partir d'un compte d'administration`,
  });

  await knex('mesures').where('id', 'CRISE.1').update({
    titre: `Formaliser et mettre en œuvre une procédure de gestion de crise en cas d'incident de sécurité majeur`,
  });

  // Apostrophes droites -> apostrophes typographiques, sur toute la table.
  await knex.raw(`
    UPDATE mesures
    SET
      titre = replace(titre, '''', '’'),
      phrase_accroche = replace(phrase_accroche, '''', '’'),
      explications = replace(explications, '''', '’'),
      action_prioritaire = replace(action_prioritaire, '''', '’'),
      action_facile_a_faire = replace(action_facile_a_faire, '''', '’'),
      risques = replace(risques::text, '''', '’')::jsonb,
      liens = replace(liens::text, '''', '’')::jsonb
    WHERE
      titre LIKE '%''%'
      OR phrase_accroche LIKE '%''%'
      OR explications LIKE '%''%'
      OR action_prioritaire LIKE '%''%'
      OR action_facile_a_faire LIKE '%''%'
      OR risques::text LIKE '%''%'
      OR liens::text LIKE '%''%'
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Reconversion best-effort des apostrophes typographiques en apostrophes droites, avant de
  // restaurer les valeurs codées en dur ci-dessous (qui utilisent, elles, l'apostrophe droite).
  await knex.raw(`
    UPDATE mesures
    SET
      titre = replace(titre, '’', ''''),
      phrase_accroche = replace(phrase_accroche, '’', ''''),
      explications = replace(explications, '’', ''''),
      action_prioritaire = replace(action_prioritaire, '’', ''''),
      action_facile_a_faire = replace(action_facile_a_faire, '’', ''''),
      risques = replace(risques::text, '’', '''')::jsonb,
      liens = replace(liens::text, '’', '''')::jsonb
    WHERE
      titre LIKE '%’%'
      OR phrase_accroche LIKE '%’%'
      OR explications LIKE '%’%'
      OR action_prioritaire LIKE '%’%'
      OR action_facile_a_faire LIKE '%’%'
      OR risques::text LIKE '%’%'
      OR liens::text LIKE '%’%'
  `);

  await knex('mesures').where('id', 'CONFORMITE.1').update({
    action_facile_a_faire: `Si NIS2 ne s'applique pas à votre entité, cette mesure n'est pas à mettre en oeuvre.`,
  });

  await knex('mesures').where('id', 'CONFORMITE.2').update({
    titre: `Définir et mettre en oeuvre en continu un plan d'action pour corriger les non-conformités identifiées`,
  });

  await knex('mesures').where('id', 'RH.4').update({
    titre: `Formaliser et mettre en oeuvre un processus de gestion des arrivées, départs et changements de fonction`,
  });

  await knex('mesures').where('id', 'PSSI.1').update({
    titre: `Formaliser et mettre en oeuvre une politique de sécurité des systèmes d'information (PSSI)`,
  });

  await knex('mesures').where('id', 'PSSI.2').update({
    titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à l'usage du chiffrement`,
  });

  await knex('mesures').where('id', 'PSSI.3').update({
    titre: `Formaliser et mettre en oeuvre une politique de sécurité relative au contrôle d'accès physique et logique`,
  });

  await knex('mesures').where('id', 'PSSI.6').update({
    titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à la gestion des comptes`,
  });

  await knex('mesures').where('id', 'PSSI.4').update({
    titre: `Formaliser et mettre en oeuvre une politique de sécurité relative à l'application des mesures de sécurité mises en oeuvre`,
  });

  await knex('mesures')
    .where('id', 'MCO_MCS.4')
    .update({
      explications: `<p>Quand un correctif de sécurité est publié, c'est généralement parce qu'une vulnérabilité est connue. Plus vous tardez à l'appliquer, plus la fenêtre d'attaque reste ouverte — et les attaquants ne s'en privent pas.</p>
<p>Le principe est de mettre en oeuvre :</p>
<ul>
<li><strong>sans délai</strong> : les actions visant à l'installation des correctifs de sécurité (tests, préparation, planification) ;</li>
<li><strong>sans retard injustifié</strong> : l'application effective des correctifs après ces actions.</li>
</ul>
<p>Cette exigence s'applique sur les équipements et applicatifs exposés à des systèmes d'information tiers (serveurs web, pare-feu, messagerie en ligne) et sur les postes de travail des utilisateurs. Si des raisons techniques ou opérationnelles empêchent l'installation d'un correctif, mettez en œuvre des mesures d'atténuation (isolation, contrôle d'accès renforcé, surveillance accrue).</p>`,
    });

  await knex('mesures').where('id', 'MCO_MCS.6').update({
    titre: `Mettre en oeuvre des mesures complémentaires en cas d'utilisation d'un logiciel dans une version obsolète`,
  });

  await knex('mesures').where('id', 'DISTANCE.1').update({
    titre: `Mettre en oeuvre un mécanisme de chiffrement et d'authentification pour les accès à distance aux systèmes d'information`,
  });

  await knex('mesures').where('id', 'COMPADMIN.12').update({
    titre: `Mettre en oeuvre des mesures complémentaires lorsque les actions d'administration ne sont pas effectuées à partir d'un compte d'administration`,
  });

  await knex('mesures').where('id', 'CRISE.1').update({
    titre: `Formaliser et mettre en oeuvre une procédure de gestion de crise en cas d'incident de sécurité majeur`,
  });
}
