import type { IdRôle } from '../../roles';

export type Réflexes = {
  [idRôle in IdRôle]: {
    proposition: {
      bonRéflexe: string;
      mauvaisRéflexe: string;
    };
    conséquence: {
      bonRéflexe: string;
      mauvaisRéflexe: string;
    };
  }[];
};

export const réflexes: Réflexes = {
  direction: [
    {
      proposition: {
        bonRéflexe: 'Activer le dispositif de crise',
        mauvaisRéflexe: 'Identifier la personne responsable de la négligence ayant permis l’attaque',
      },
      conséquence: {
        bonRéflexe:
          'Mobiliser les acteurs clés et activer les procédures dès les premières minutes permet de gérer l’incertitude avec agilité.',
        mauvaisRéflexe:
          'Chercher un coupable crée un climat de méfiance qui décourage les signalements futurs et détourne l’énergie de la reprise.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Outiller la cellule de crise (main courante, outils collaboratifs)',
        mauvaisRéflexe: 'Payer la rançon pour récupérer les données',
      },
      conséquence: {
        bonRéflexe:
          'Centraliser les données et tracer les décisions en temps réel évite les doublons et facilite la coordination.',
        mauvaisRéflexe:
          'Payer ne garantit ni récupération ni clé fonctionnelle, et finance directement le crime organisé.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Planifier des points de situation réguliers',
        mauvaisRéflexe: 'Ne pas informer les collaborateurs pour éviter de les inquiéter',
      },
      conséquence: {
        bonRéflexe:
          'Des points fréquents offrent une vision actualisée et évitent les décisions prises sur des informations obsolètes.',
        mauvaisRéflexe:
          'Sans consignes claires, les agents pourraient utiliser des outils compromis et aggraver la situation.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Solliciter une analyse des activités à maintenir en mode dégradé',
        mauvaisRéflexe: 'Confier aux équipes IT la gestion de l’incident',
      },
      conséquence: {
        bonRéflexe:
          'Identifier les fonctions vitales à maintenir permet d’optimiser les ressources et de limiter les pertes.',
        mauvaisRéflexe:
          'Les volets juridique, communicationnel et RH seraient négligés, aggravant l’impact global. Un pilotage transversal est indispensable.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Solliciter une analyse des applications à relancer en priorité',
        mauvaisRéflexe: 'Suspendre toutes les décisions jusqu’à avoir une vision complète de l’incident',
      },
      conséquence: {
        bonRéflexe:
          'Avec trois semaines de gestion dégradée en perspective, fixer des objectifs clairs guide les équipes vers une sortie sécurisée.',
        mauvaisRéflexe:
          'Attendre une image parfaite avant d’agir laisse le champ libre à l’attaquant et retarde des actions de containment urgentes.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Fournir un bilan consolidé aux autorités et aux partenaires essentiels',
        mauvaisRéflexe: 'Déléguer la gestion de crise à un seul responsable sans cellule dédiée',
      },
      conséquence: {
        bonRéflexe:
          'La situation est désormais assez claire pour rassurer les parties prenantes et activer d’éventuels soutiens.',
        mauvaisRéflexe:
          'Une crise cyber nécessite une coordination multi-métiers. Concentrer la gestion sur une seule personne crée des goulots d’étranglement et des angles morts.',
      },
    },
  ],
  si: [
    {
      proposition: {
        bonRéflexe: 'Investiguer immédiatement les causes de l’indisponibilité',
        mauvaisRéflexe: 'Réinstaller les sauvegardes rapidement pour rétablir les services',
      },
      conséquence: {
        bonRéflexe: 'Identifier l’origine de l’incident, éviter les spéculations et cadrer la réponse dès le départ.',
        mauvaisRéflexe: 'Une restauration précipitée risque de réinfecter les systèmes sains et d’effacer les preuves.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Couper momentanément internet pour entraver les actions de l’attaquant',
        mauvaisRéflexe: 'Demander à tous les utilisateurs d’éteindre immédiatement leur poste',
      },
      conséquence: {
        bonRéflexe:
          'Bloque la propagation du virus et l’exfiltration de données, donne aux équipes le temps de diagnostiquer.',
        mauvaisRéflexe:
          'Rallumer des machines éteintes peut propager l’infection et supprimer des preuves essentielles.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Vérifier l’intégrité des sauvegardes et leur capacité à être réinstallées',
        mauvaisRéflexe: 'Couper définitivement toutes les interconnexions avec l’extérieur',
      },
      conséquence: {
        bonRéflexe:
          'S’assurer que les sauvegardes ne sont pas compromises est crucial pour orienter les actions de continuité.',
        mauvaisRéflexe:
          'Trop radical : paralyserait des services essentiels et isolerait des acteurs clés. La segmentation ciblée est préférable.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Solliciter l’aide d’une équipe externe de réponse à incident (ANSSI, CERT)',
        mauvaisRéflexe: 'N’impliquer que les équipes IT pour faciliter le pilotage technique',
      },
      conséquence: {
        bonRéflexe:
          'Des experts externes renforcent les compétences internes, accélèrent le diagnostic et soulagent les équipes débordées.',
        mauvaisRéflexe:
          'Se passer d’expertises externes surcharge les équipes, biaise l’analyse et retarde le diagnostic.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Lister avec les équipes métiers l’ensemble des systèmes impactés',
        mauvaisRéflexe: 'Relancer les systèmes les moins touchés pour maintenir une activité partielle',
      },
      conséquence: {
        bonRéflexe:
          'Cartographier précisément les dommages permet de prioriser les correctifs et d’aligner toutes les équipes sur une feuille de route.',
        mauvaisRéflexe:
          'Relancer des systèmes avant d’avoir certifié leur intégrité risque de propager le rançongiciel et de compromettre la reconstruction.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Identifier le temps nécessaire au nettoyage et à la reconstruction',
        mauvaisRéflexe: 'Attendre la fin de l’investigation interne avant de solliciter des renforts externes',
      },
      conséquence: {
        bonRéflexe:
          'Évaluer les délais réalistes permet de planifier la reconstruction et d’éviter les promesses irréalistes.',
        mauvaisRéflexe:
          'Retarder l’appel à des experts externes surcharge inutilement les équipes et allonge la durée de l’incident.',
      },
    },
  ],
  communication: [
    {
      proposition: {
        bonRéflexe: 'Partager aux usagers qu’un incident est en cours via les réseaux sociaux',
        mauvaisRéflexe: 'Autoriser les élus à piloter eux-mêmes la communication de crise',
      },
      conséquence: {
        bonRéflexe:
          'Limiter les rumeurs dès le début et guider les publics pour qu’ils s’adaptent. La rapidité en phase 1 est déterminante.',
        mauvaisRéflexe: 'Les prises de parole non expertes génèrent confusion et perte de crédibilité.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Identifier un porte-parole pour répondre aux médias',
        mauvaisRéflexe: 'Autoriser les collaborateurs contactés par la presse à s’exprimer',
      },
      conséquence: {
        bonRéflexe:
          'Centraliser les prises de parole garantit des messages cohérents et évite les déclarations improvisées.',
        mauvaisRéflexe:
          'Des déclarations non coordonnées alimentent la panique et propagent des informations erronées.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Publier un communiqué de presse sur la situation',
        mauvaisRéflexe: 'Annoncer publiquement un délai de reprise d’activité pour rassurer',
      },
      conséquence: {
        bonRéflexe:
          'Avec les médias aux portes et l’attaque confirmée, un communiqué officiel fixe un cadre clair et préserve la maîtrise du récit.',
        mauvaisRéflexe:
          'Promettre une échéance irréaliste décrédibilise l’organisation quand elle ne peut pas la tenir.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Veiller les réseaux sociaux pour mesurer l’impact réputationnel',
        mauvaisRéflexe: 'Utiliser uniquement un automate d’appels pour diffuser les messages',
      },
      conséquence: {
        bonRéflexe:
          'Avec la demande de rançon publiée, la veille permet d’anticiper les crises de confiance et d’ajuster les messages.',
        mauvaisRéflexe:
          'Un automate froid minimise la gravité de la situation et ne répond pas aux interrogations des usagers.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Mettre à jour le communiqué de presse pour intégrer les nouvelles données',
        mauvaisRéflexe: 'Interrompre toute communication externe jusqu’à résolution complète de l’incident',
      },
      conséquence: {
        bonRéflexe:
          'Adapter les messages à l’évolution de la situation est indispensable pour garder la main sur le récit.',
        mauvaisRéflexe:
          'Le silence prolongé aggrave les rumeurs, la méfiance et la désorganisation. Une communication proactive est indispensable même en l’absence de certitudes.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Organiser des échanges internes entre direction et équipes impactées',
        mauvaisRéflexe: 'Laisser les élus gérer les échanges avec les administrés sans coordination',
      },
      conséquence: {
        bonRéflexe:
          'Après sept heures de crise, reconnaître l’engagement des équipes et briser l’isolement est essentiel pour tenir sur la durée.',
        mauvaisRéflexe:
          'Sans coordination, des messages contradictoires peuvent circuler, nuisant à la crédibilité de l’organisation et amplifiant la confusion.',
      },
    },
  ],
  juridique: [
    {
      proposition: {
        bonRéflexe: 'Évaluer rapidement les conséquences juridiques et financières',
        mauvaisRéflexe: 'Payer la rançon pour récupérer les données',
      },
      conséquence: {
        bonRéflexe: 'Identifier les risques RGPD, les coûts directs et indirects, et cadrer la réponse dès le début.',
        mauvaisRéflexe: 'Ne garantit ni récupération ni clé fonctionnelle, et finance le crime organisé.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Porter plainte auprès des forces de l’ordre',
        mauvaisRéflexe: 'Demander de relancer immédiatement les systèmes pour limiter les impacts',
      },
      conséquence: {
        bonRéflexe:
          'Sécurise les garanties assurantielles souvent conditionnées à cette démarche et documente la gestion de l’incident.',
        mauvaisRéflexe: 'Une restauration précipitée risque de contaminer les systèmes sains et d’effacer les preuves.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Contacter l’assurance pour connaître la couverture en cas d’attaque',
        mauvaisRéflexe: 'Se concentrer sur la gestion des impacts avant de contacter les autorités',
      },
      conséquence: {
        bonRéflexe:
          'Connaître rapidement les plafonds et délais de déclaration (48-72h) est crucial pour activer les garanties dans les temps.',
        mauvaisRéflexe:
          'Ne pas notifier les autorités enfreint les obligations légales (72h RGPD) et prive l’organisation d’un soutien technique.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Mettre en place un budget et des moyens de paiement dédiés à la gestion de crise',
        mauvaisRéflexe: 'Lancer un audit général de la sécurité des systèmes en pleine crise',
      },
      conséquence: {
        bonRéflexe:
          'Permet de régler les dépenses urgentes (prestataires, matériel) sans les lourdeurs administratives habituelles.',
        mauvaisRéflexe: 'Trop long et complexe en pleine crise. La priorité est une analyse rapide pour agir.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Signaler l’incident à la CNIL',
        mauvaisRéflexe: 'Attendre la résolution complète avant tout signalement officiel',
      },
      conséquence: {
        bonRéflexe: 'Avec la fuite confirmée, ce signalement est prioritaire et juridiquement obligatoire sous 72h.',
        mauvaisRéflexe:
          'Reporter le signalement enfreint les obligations légales et prive l’organisation d’un soutien technique des autorités.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Solliciter des reports ou facilités de paiement auprès des prestataires',
        mauvaisRéflexe: 'Payer la rançon comme dernier recours pour accélérer la reprise',
      },
      conséquence: {
        bonRéflexe:
          'Soulage la trésorerie, préserve la confiance des partenaires et évite les tensions liées aux retards.',
        mauvaisRéflexe: 'Même en reconstruction, payer ne garantit rien et finance le crime organisé.',
      },
    },
  ],
  rh: [
    {
      proposition: {
        bonRéflexe: 'Rejouer la paie du mois précédent via le prestataire ou la DDFIP',
        mauvaisRéflexe: 'Annuler tous les processus de recrutement en cours',
      },
      conséquence: {
        bonRéflexe:
          'Garantir le paiement des salaires dans les délais respecte les obligations légales et rassure les équipes.',
        mauvaisRéflexe: 'Geler les recrutements détériore l’image employeur et complique la résilience post-crise.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Partager aux collaborateurs les consignes de conduite à tenir',
        mauvaisRéflexe: 'Recevoir en entretien le collaborateur à l’origine de la négligence',
      },
      conséquence: {
        bonRéflexe:
          'Guider les agents évite qu’ils utilisent des outils compromis et limite les rumeurs grâce à une information claire.',
        mauvaisRéflexe: 'Sanctionner décourage la transparence et peut amener les équipes à taire des erreurs futures.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Commander des repas et de l’eau pour les équipes mobilisées',
        mauvaisRéflexe: 'Ne pas prévenir les représentants du personnel pour éviter les tensions',
      },
      conséquence: {
        bonRéflexe:
          'Assurer les besoins de base démontre la considération de la direction et renforce la cohésion dans le stress.',
        mauvaisRéflexe:
          'Limiter l’information des représentants expose l’organisation à des litiges et exacerbe les conflits.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Assurer le suivi du temps de travail et mettre en place des roulements',
        mauvaisRéflexe: 'Appeler le prestataire pour valider la commande des chèques vacances',
      },
      conséquence: {
        bonRéflexe:
          'Tracer les heures supplémentaires garantit une compensation équitable et maintient la capacité des équipes sur la durée.',
        mauvaisRéflexe: 'Tâche administrative non urgente qui détourne des ressources des actions critiques.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Mettre en place une cellule de soutien psychologique pour les agents',
        mauvaisRéflexe: 'Ne pas informer les syndicats pour éviter les mécontentements',
      },
      conséquence: {
        bonRéflexe:
          'Face à l’incertitude et à la pression depuis plusieurs heures, un soutien psychologique limite les risques psychosociaux.',
        mauvaisRéflexe:
          'Les représentants du personnel ont un droit à l’information. Le silence expose l’organisation à des litiges.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Faciliter le confort et le repos des équipes dans la durée (garde d’enfants, hôtel…)',
        mauvaisRéflexe: 'Imposer des heures supplémentaires sans suivi ni compensation planifiée',
      },
      conséquence: {
        bonRéflexe:
          'Avec trois semaines de gestion dégradée annoncées, garantir le repos est essentiel pour maintenir l’efficacité.',
        mauvaisRéflexe:
          'Sans traçabilité ni planification des compensations, les équipes s’épuisent, ce qui aggrave les risques d’erreurs et de conflits sociaux.',
      },
    },
  ],
  relations: [
    {
      proposition: {
        bonRéflexe: 'Informer usagers et partenaires de l’indisponibilité des services',
        mauvaisRéflexe: 'Appeler un à un les usagers pour les prévenir',
      },
      conséquence: {
        bonRéflexe: 'Limiter les rumeurs et guider les publics pour qu’ils s’adaptent dès les premières minutes.',
        mauvaisRéflexe: 'Sans annuaires ni téléphones disponibles, cette démarche est inefficace à grande échelle.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Réorganiser l’accueil (fermeture partielle, renforcement d’équipe)',
        mauvaisRéflexe: 'Suspendre tous les services administratifs le temps de la résolution',
      },
      conséquence: {
        bonRéflexe:
          'Concentrer les efforts sur les tâches prioritaires et rendre la conduite de crise plus efficace face à l’afflux.',
        mauvaisRéflexe: 'Fermer des services non impactés paralyse l’activité et érode la confiance des usagers.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Mettre en place un canal d’information dédié (hotline, guichet, FAQ)',
        mauvaisRéflexe: 'Ne pas informer les usagers pour éviter les mécontentements',
      },
      conséquence: {
        bonRéflexe: 'Un point de contact unique centralise les demandes et limite la désinformation.',
        mauvaisRéflexe: 'L’absence d’information génère rumeurs, défiance et crise de réputation bien plus grave.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Mettre en place un mode de travail dégradé (papier, travail sur site)',
        mauvaisRéflexe: 'Relancer l’ensemble des activités en mode nominal d’ici la fin de semaine',
      },
      conséquence: {
        bonRéflexe:
          'Maintenir les activités critiques malgré l’indisponibilité des systèmes en évitant les outils compromis.',
        mauvaisRéflexe: 'Une remise en service précipitée peut entraîner une réinfection des systèmes.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Identifier les usagers à accompagner en priorité (publics fragiles, partenaires clés)',
        mauvaisRéflexe: 'Orienter tous les usagers vers les services dématérialisés de la communauté de communes',
      },
      conséquence: {
        bonRéflexe: 'Cibler les publics prioritaires concentre les moyens là où ils sont le plus nécessaires.',
        mauvaisRéflexe:
          'Ces services ne sont pas nécessairement disponibles ni adaptés, et certains usagers fragiles n’y ont pas accès.',
      },
    },
    {
      proposition: {
        bonRéflexe: 'Planifier avec les équipes IT les applications à reconstruire en priorité',
        mauvaisRéflexe: 'Relancer l’ensemble des activités en mode nominal d’ici vendredi',
      },
      conséquence: {
        bonRéflexe:
          'Identifier les systèmes indispensables à la reprise permet de dresser une feuille de route claire.',
        mauvaisRéflexe:
          'Une remise en service précipitée avec des vulnérabilités non corrigées risque une réinfection complète.',
      },
    },
  ],
};
