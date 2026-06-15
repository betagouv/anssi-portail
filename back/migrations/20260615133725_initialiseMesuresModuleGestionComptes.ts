import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('modules').insert({ id: 6, nom: `Gestion des comptes et droits` });

  await knex('mesures').insert([
    {
      id: `DISTANCE.1`,
      id_module: 6,
      ordre: 6010,
      titre: `Mettre en oeuvre un mécanisme de chiffrement et d'authentification pour les accès à distance aux systèmes d'information`,
      phrase_accroche: ``,
      explications: `Quand un utilisateur ou un prestataire se connecte à distance à votre SI, son trafic transite par Internet. Sans chiffrement ni authentification solide, n'importe qui peut l'intercepter ou se faire passer pour lui.

D'où la double exigence :
- chiffrement à l'aide de protocoles éprouvés (VPN utilisant TLS ou IPsec, ou protocoles applicatifs sécurisés comme TLS/SSL ou SSH), conformes aux recommandations de l'ANSSI ;
- authentification quand l'accès est réalisé par l'entité ou ses prestataires.`,
      action_prioritaire: `Imposer un VPN IPsec ou TLS (selon le contexte) pour tout accès distant. Activer l'authentification systématique pour les accès distants (prestataires, administrateurs, télétravail, etc.).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['8.1-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Interception du trafic en clair`,
            description: `Un accès distant non chiffré (ex. RDP sans VPN, FTP) laisse fuiter identifiants et données dès qu'il transite sur Internet.`,
          },
          {
            libelle: `Accès sans authentification`,
            description: `Un accès au SI par un attaquant sans aucune barrière d'authentification.`,
          },
          {
            libelle: `Accès prestataire non encadré`,
            description: `Une télémaintenance s'ouvre via un protocole non sécurisé et personne ne sait quand le prestataire entre ou sort.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `COMPTE.1`,
      id_module: 6,
      ordre: 6020,
      titre: `Utiliser des comptes individuels réservés à l'utilisateur ou au processus automatique associé`,
      phrase_accroche: ``,
      explications: `Quand plusieurs personnes partagent un même compte, plus personne ne sait qui a fait quoi. En cas d'incident, l'enquête tourne court. Et si le mot de passe fuite, tous les utilisateurs sont compromis en même temps.

La règle de base : chaque utilisateur et chaque processus automatique qui accède à vos ressources dispose d'un compte individuel, qui lui est réservé. Ce compte est protégé au minimum par un élément secret (mot de passe) connu uniquement de la personne ou du processus autorisé.

À noter : cette mesure ne s'applique pas aux systèmes qui n'ont pour seul objectif que de diffuser de l'information au public (par exemple un site vitrine).`,
      action_prioritaire: `Créer un compte individuel pour chaque utilisateur et processus de service.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.1-EI/EE', '10.A.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Aucune imputation possible en cas d'incident`,
            description: `Un compte est utilisé par plusieurs personnes, et un acte malveillant ou une erreur ne peut être attribué à quiconque.`,
          },
          {
            libelle: `Mot de passe partagé qui circule`,
            description: `Le mot de passe d'un compte commun passe de main en main, finit sur un post-it, et finit par fuiter.`,
          },
          {
            libelle: `Aucune piste d'audit exploitable`,
            description: `Les journaux affichent toujours le même compte, donc l'analyse forensic après incident devient quasi impossible.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `COMPTE.2`,
      id_module: 6,
      ordre: 6030,
      titre: `Sécuriser l'usage des comptes partagés lorsqu'ils sont indispensables`,
      phrase_accroche: ``,
      explications: `Idéalement, tous les comptes sont individuels. Mais dans certains contextes — salle de supervision, équipement industriel, contrainte technique — un compte partagé reste indispensable. Dans ce cas, il faut compenser le risque par d'autres moyens.

Concrètement :
- mettre en œuvre des mesures pour réduire les risques et assurer la traçabilité (carnet de quart dans une salle de supervision, badgeuse à l'entrée du local, journalisation applicative croisée, etc.) ;
- renouveler l'élément secret (mot de passe) à chaque retrait d'un utilisateur de ce compte (départ, mobilité interne) ;
- si la modification de l'élément secret est impossible, mettre en place un contrôle d'accès approprié à la ressource concernée ainsi que des mesures compensatoires.

Cette règle s'applique à tous les comptes partagés, y compris les comptes d'administration lorsque le partage est inévitable.`,
      action_prioritaire: `Limiter au maximum les comptes partagés. Pour ceux qui restent : renouvellement du secret à chaque retrait d'un utilisateur, stockage du secret dans un gestionnaire de mots de passe sécurisé, traçabilité organisationnelle (cahier de prise/passation).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.3-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Mot de passe partagé qui survit aux départs`,
            description: `Un ancien collaborateur connaît encore le mot de passe d'un compte technique des mois après son départ.`,
          },
          {
            libelle: `Aucune imputation possible`,
            description: `Un acte malveillant ou erroné réalisé via le compte partagé ne peut être attribué à personne.`,
          },
          {
            libelle: `Compromission silencieuse`,
            description: `L'élément secret est conservé dans un fichier non sécurisé, et fuite à la première intrusion.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `COMPTE.3`,
      id_module: 6,
      ordre: 6040,
      titre: `Désactiver les comptes non nécessaires dans un délai formalisé`,
      phrase_accroche: ``,
      explications: `Un compte qui ne sert plus mais reste actif, c'est une cible facile pour un attaquant. Il faut donc fixer des délais clairs pour désactiver tout compte devenu inutile.

Formalisez une procédure de suppression des comptes inactifs ou non nécessaires, qui prend en compte les délais de désactivation prévus par votre politique de gestion des comptes (par exemple sous 7 jours pour un compte utilisateur parti, immédiatement pour un compte à privilèges).`,
      action_prioritaire: `Formaliser des délais clairs : désactivation immédiate des comptes à privilèges au départ, sous 7 jours pour les comptes utilisateurs standards, et désactivation automatique des comptes inactifs depuis 3 mois.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Comptes dormants exploités`,
            description: `Un compte d'ancien collaborateur reste actif, est compromis (réutilisation de mot de passe ailleurs), et donne accès à l'entité.`,
          },
          {
            libelle: `Comptes orphelins`,
            description: `Des comptes techniques de projets terminés ou de prestataires partis restent actifs faute de procédure.`,
          },
          {
            libelle: `Délai de désactivation non respecté`,
            description: `Le départ a lieu mais le compte reste accessible pendant des semaines, créant une fenêtre d'exposition.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `COMPTE.4`,
      id_module: 6,
      ordre: 6050,
      titre: `Effectuer une revue des comptes a minima annuellement`,
      phrase_accroche: ``,
      explications: `Même avec une bonne procédure de désactivation, des comptes obsolètes finissent par s'accumuler. Une revue régulière permet de remettre les choses au propre — au moins une fois par an.

Cette revue vérifie trois choses :
- que les utilisateurs et processus accédant à vos ressources disposent bien de comptes individuels ;
- que chaque compte individuel est effectivement réservé à l'utilisateur ou au processus auquel il est attribué ;
- que les comptes qui ne sont plus nécessaires sont désactivés.`,
      action_prioritaire: `Bloquer une revue annuelle dans le calendrier, conduite par l'IT en collaboration avec les responsables métiers. Documenter les anomalies et les correctifs appliqués.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.A.6-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Accumulation de comptes obsolètes`,
            description: `Sans revue, le SI conserve des dizaines de comptes inutilisés qui élargissent la surface d'attaque.`,
          },
          {
            libelle: `Comptes utilisés à mauvais escient`,
            description: `Un compte attribué à un utilisateur précis est en réalité partagé avec d'autres, sans que personne ne s'en rende compte.`,
          },
          {
            libelle: `Comptes à privilèges non maîtrisés`,
            description: `Aucune visibilité sur qui détient des droits étendus, et certains comptes admin ne devraient plus exister.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `DROITS.1`,
      id_module: 6,
      ordre: 6060,
      titre: `Attribuer les droits d'accès aux ressources selon les besoins`,
      phrase_accroche: ``,
      explications: `Plus un utilisateur a de droits, plus une compromission de son compte fait de dégâts. Le principe du moindre privilège, c'est : chacun n'a que ce qu'il lui faut, ni plus, ni moins.

N'attribuez les droits d'accès à vos ressources qu'aux utilisateurs et processus qui en ont un besoin justifié par leurs missions, et uniquement pour la réalisation des activités de l'entité ou le maintien en condition opérationnelle et de sécurité.`,
      action_prioritaire: `Adopter le principe du moindre privilège : par défaut, aucun accès sauf besoin démontré et l'appliquer en priorité aux ressources sensibles (RH, finance, données clients).`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.2-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Droits trop larges hérités`,
            description: `Un collaborateur accumule des droits au fil des projets et finit par avoir accès à des ressources sans rapport avec sa mission.`,
          },
          {
            libelle: `Compromission d'un compte = compromission étendue`,
            description: `Si un compte sur-droité est piraté, l'attaquant accède immédiatement à beaucoup plus de ressources que nécessaire.`,
          },
          {
            libelle: `Accès aux ressources sensibles non contrôlé`,
            description: `Tout le monde peut consulter des dossiers RH, juridiques ou commerciaux qui devraient être restreints.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `DROITS.2`,
      id_module: 6,
      ordre: 6070,
      titre: `Effectuer une revue des droits d'accès a minima annuellement`,
      phrase_accroche: ``,
      explications: `Comme pour les comptes, les droits s'accumulent au fil des projets et des mobilités. Sans revue régulière, un collaborateur peut finir par avoir accès à des ressources sans rapport avec son poste actuel.

D'où la revue annuelle des droits d'accès : elle vérifie que chacun n'a que les droits justifiés par sa mission, et permet de corriger les anomalies (droits excédant la mission, droits hérités d'anciennes fonctions, etc.).`,
      action_prioritaire: `Calendrier annuel de revue, conduit conjointement par l'IT et les responsables métiers. Documenter les modifications appliquées.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['10.C.4-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Droits qui s'accumulent au fil des projets`,
            description: `Un collaborateur sur le terrain depuis 10 ans détient accès à tout, alors que la moitié n'a plus de sens.`,
          },
          {
            libelle: `Mobilités internes sans révision`,
            description: `Un changement de poste se traduit par une addition de droits, jamais une soustraction.`,
          },
          {
            libelle: `Comptes admin pléthoriques`,
            description: `Impossible de dire qui a vraiment besoin de quel droit d'administration, car aucune revue n'a jamais été tenue.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
    {
      id: `COMPADMIN.12`,
      id_module: 6,
      ordre: 6080,
      titre: `Mettre en oeuvre des mesures complémentaires lorsque les actions d'administration ne sont pas effectuées à partir d'un compte d'administration`,
      phrase_accroche: ``,
      explications: `L'idéal, c'est que toutes les actions d'administration se fassent depuis un compte d'administration dédié, distinct du compte utilisateur courant. Mais dans certains cas (contrainte technique, applicatif spécifique), ce n'est pas possible.

Quand c'est le cas, il faut mettre en place :
- des mesures pour assurer le contrôle des actions d'administration réalisées (ex. traçabilité renforcée, supervision) ;
- des mesures de réduction du risque lié à l'utilisation d'un compte non dédié (ex. durcissement du poste, contrôle des actions critiques).`,
      action_prioritaire: `Identifier les cas où l'utilisation d'un compte d'administration dédié n'est pas possible, et y appliquer une journalisation renforcée et un contrôle des actions sensibles.`,
      action_facile_a_faire: ``,
      references_nis2: knex.raw('?::jsonb', [JSON.stringify(['11.A.5-EI/EE'])]),
      risques: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: `Action d'administration depuis un compte courant compromis`,
            description: `Un mail piégé ouvert avec un compte ayant des droits admin entraîne une prise de contrôle totale du système.`,
          },
          {
            libelle: `Absence de traçabilité`,
            description: `Les actions admin réalisées via un compte mixte sont noyées dans les actions courantes, et impossibles à reconstituer après incident.`,
          },
          {
            libelle: `Élévation de privilèges discrète`,
            description: `Un attaquant entré sur un poste courant exploite directement les droits admin embarqués, sans avoir à passer par une étape d'élévation.`,
          },
        ]),
      ]),
      liens: knex.raw('?::jsonb', [JSON.stringify([])]),
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').delete().where({ id: 'DISTANCE.1' });
  await knex('mesures').delete().where({ id: 'COMPTE.1' });
  await knex('mesures').delete().where({ id: 'COMPTE.2' });
  await knex('mesures').delete().where({ id: 'COMPTE.3' });
  await knex('mesures').delete().where({ id: 'COMPTE.4' });
  await knex('mesures').delete().where({ id: 'DROITS.1' });
  await knex('mesures').delete().where({ id: 'DROITS.2' });
  await knex('mesures').delete().where({ id: 'COMPADMIN.12' });
  await knex('modules').delete().where({ id: 6 });
}
