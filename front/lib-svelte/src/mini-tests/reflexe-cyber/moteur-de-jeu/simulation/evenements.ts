import type { IdScénario } from '../../scenarios';
import type { IdRôle } from '../../roles';

export type Évènements = {
  [idScénario in IdScénario]: {
    heure: string;
    titre: string;
    contexte: string[];
    notifications: {
      [idRôle in IdRôle]: string;
    };
  }[];
};

export const évènements: Évènements = {
  entreprise: [
    {
      heure: '9h30',
      titre: "Début de l'incident",
      contexte: [
        'Les premières alertes arrivent en cascade :',
        '<ul><li>agendas bloqués,</li><li>secrétariat incapable de gérer les rendez-vous clients — un client menace de rompre son contrat après un rendez-vous en visio raté.</li></ul>',
        'Le système de paie et des fichiers internes (contrats, commandes) deviennent inaccessibles, et le site web tombe. Le technicien support investigue, sans résultat clair pour l’instant.',
      ],
      notifications: {
        direction: 'Pouvez-vous confirmer l’ouverture immédiate de la cellule de crise ?',
        si: 'Le site et les fichiers internes ne répondent plus. Quels systèmes dois-je isoler d’abord ?',
        communication: 'Un client menace de rompre son contrat. Quel message puis-je lui adresser ?',
        juridique: 'Je lance le chiffrage des pertes. Quels postes dois-je suivre en priorité ?',
        rh: 'La paie est inaccessible. Quelle consigne donnons-nous aux collaborateurs ?',
        relations: 'Les clients ne peuvent plus suivre leurs commandes. Que leur répondons-nous ?',
      },
    },
    {
      heure: '10h15',
      titre: 'Inquiétude générale',
      contexte: [
        'L’outil de gestion des livraisons tombe à son tour : les camions se présentant à l’entrepôt ne peuvent plus être redirigés.',
        'Informé par un client, un investisseur s’inquiète et exige un point de situation toutes les 20 minutes.',
        'La RH alerte : sans systèmes, la paie ne sera pas versée dans les 72h. Un seul technicien reste mobilisé sur le volet technique, qui prend du temps.',
      ],
      notifications: {
        direction: 'L’investisseur réclame un point toutes les 20 minutes. Qui consolide les informations ?',
        si: 'L’outil de livraison vient de tomber. Puis-je faire intervenir un prestataire ?',
        communication: 'Les clients commencent à s’inquiéter. Validons-nous un message externe ?',
        juridique: 'La paie pourrait être bloquée sous 72 heures. Quelle solution de secours finançons-nous ?',
        rh: 'Les équipes demandent quand elles seront payées. Que puis-je leur annoncer ?',
        relations: 'Les camions s’accumulent devant l’entrepôt. Puis-je prévenir directement les clients concernés ?',
      },
    },
    {
      heure: '11h00',
      titre: 'Confirmation d’une cyberattaque',
      contexte: [
        'C’est un rançongiciel. Paie, congés et absences, outil de gestion logistique, site web et certains fichiers hébergés en interne sont bloqués.',
        'Le technicien est débordé et réclame des renforts. En sous-effectif, l’entrepôt gère les commandes sans outils, et un client exige de désactiver l’outil logistique pour éviter une propagation vers son propre système.',
        'Les représentants du personnel menacent d’exercer leur droit de retrait faute d’informations, et des journalistes tentent d’interroger les collaborateurs.',
      ],
      notifications: {
        direction: 'Le rançongiciel est confirmé. Pouvez-vous fixer nos priorités pour la prochaine heure ?',
        si: 'La chaîne logistique est bloquée et je suis seul. J’ai besoin d’un renfort technique maintenant.',
        communication: 'Des journalistes sollicitent les collaborateurs. Qui prend officiellement la parole ?',
        juridique: 'Dois-je déposer plainte et déclarer l’incident à notre assureur aujourd’hui ?',
        rh: 'Les représentants du personnel menacent un droit de retrait. Quelle réponse validons-nous ?',
        relations: 'Un client craint une propagation vers son SI. Quelle garantie pouvons-nous lui donner ?',
      },
    },
    {
      heure: '12h30',
      titre: 'Constat de l’ampleur de l’impact',
      contexte: [
        'Les sauvegardes sont compromises et la récupération s’annonce incertaine et lente. Les attaquants publient une demande de rançon de 500 000 €.',
        'Les clients s’inquiètent fortement du retard pris sur leurs livraisons.',
        'Les équipes, épuisées, réclament des renforts et la mise en place d’un système de repos pour tenir dans la durée.',
      ],
      notifications: {
        direction: 'La rançon est de 500 000 €. Pouvez-vous arrêter notre position ?',
        si: 'Les sauvegardes sont compromises. Quelles applications dois-je tenter de restaurer en premier ?',
        communication: 'Les retards deviennent visibles. Quel niveau d’information communiquons-nous ?',
        juridique: 'Je dois engager des dépenses d’urgence. Pouvez-vous valider une enveloppe dédiée ?',
        rh: 'Les équipes sont épuisées. Puis-je mettre en place des rotations dès ce soir ?',
        relations: 'Les clients réclament de nouveaux délais. Quelle promesse réaliste pouvons-nous faire ?',
      },
    },
    {
      heure: '15h30',
      titre: 'Détection de fuite de données',
      contexte: [
        'Un collaborateur signale que les attaquants revendiquent avoir volé et publié des données sur le dark web — l’analyse est en cours.',
        'La dernière sauvegarde saine date d’une semaine : il faudra trois jours pour la réinstaller, puis relancer progressivement les applications.',
        'Sur les réseaux sociaux, un client dénonce le manque d’investissement en cybersécurité de l’entreprise.',
      ],
      notifications: {
        direction: 'La fuite de données est probable. Qui coordonne les décisions de reprise ?',
        si: 'La sauvegarde saine a une semaine. Quelles applications doivent repartir avant les autres ?',
        communication: 'Un client nous accuse publiquement de négligence. Puis-je répondre maintenant ?',
        juridique: 'Des données semblent publiées. Dois-je préparer la notification à la CNIL ?',
        rh: 'Les collaborateurs découvrent la fuite sur les réseaux. Quel message interne envoyons-nous ?',
        relations: 'Quels clients stratégiques devons-nous appeler en priorité ?',
      },
    },
    {
      heure: '16h30',
      titre: 'Adaptation en mode dégradé',
      contexte: [
        'Bilan sévère : 100 % des serveurs sont chiffrés et un rachat de matériel est nécessaire pour reconstruire une infrastructure saine, plus de la moitié des postes (70) sont infectés et doivent être remplacés.',
        'La fuite de données est confirmée (contrats, noms, mails de clients et collaborateurs).',
        'Trois semaines minimum de gestion dégradée sont prévues, alors que la commande des chèques-vacances doit être validée sous 24h avec un fichier inaccessible.',
        'Deux journalistes relancent les collaborateurs, et un tweet ainsi qu’un article local évoquent déjà la fuite de données et le risque de retard des livraisons.',
      ],
      notifications: {
        direction: 'Trois semaines de gestion dégradée sont prévues. Pouvez-vous valider le plan de reprise ?',
        si: 'Les serveurs sont chiffrés et 70 postes sont infectés. Par quoi reconstruisons-nous ?',
        communication: 'Deux journalistes relancent et un article est publié. Quelle réponse leur transmettons-nous ?',
        juridique: 'La trésorerie est fragile. Quelles dépenses de reconstruction devons-nous sécuriser ?',
        rh: 'La crise va durer. Puis-je organiser hébergement, garde d’enfants et repos des équipes ?',
        relations: 'Les livraisons seront perturbées plusieurs semaines. Quel calendrier annonçons-nous aux clients ?',
      },
    },
  ],
  collectivité: [
    {
      heure: '9h30',
      titre: "Début de l'incident",
      contexte: [
        'Les premières alertes arrivent en cascade :',
        '<ul><li>agendas bloqués,</li><li>paie inaccessible,</li><li>application cantine hors service.</li></ul>',
        'Sur X, un administré interpelle publiquement la mairie et évoque une cyberattaque. Le technicien est sur le coup, mais sans résultat clair pour l’instant.',
      ],
      notifications: {
        direction: 'Pouvez-vous confirmer l’activation de la cellule de crise ?',
        si: 'J’isole les services touchés. Quels accès devons-nous préserver ?',
        communication: 'Un administré parle déjà de cyberattaque sur X. Que répondons-nous ?',
        juridique: 'Je commence à chiffrer l’incident. Quels impacts sont prioritaires ?',
        rh: 'Les agents demandent des consignes. Que puis-je leur transmettre ?',
        relations: 'L’accueil reçoit les premiers appels. Quel message donnons-nous aux usagers ?',
      },
    },
    {
      heure: '10h15',
      titre: 'L’inquiétude s’installe',
      contexte: [
        'L’accueil est saturé — deux heures d’attente, des administrés agressifs.',
        'Les applications crèche et périscolaire tombent. Le maire exige un point toutes les 20 minutes.',
        'La RH alerte : si les systèmes restent indisponibles, la paie ne sera pas versée dans les 72h.',
      ],
      notifications: {
        direction: 'Le maire exige un point toutes les 20 minutes. Qui consolide la situation ?',
        si: 'Crèche et périscolaire viennent de tomber. Puis-je mobiliser un renfort externe ?',
        communication: 'Les rumeurs progressent. Validons-nous une prise de parole officielle ?',
        juridique: 'La paie est menacée sous 72 heures. Quel dispositif d’urgence retenons-nous ?',
        rh: 'Les agents d’accueil sont sous pression. Puis-je organiser des rotations ?',
        relations: 'Deux heures d’attente au guichet. Puis-je fermer temporairement certains services ?',
      },
    },
    {
      heure: '11h00',
      titre: 'L’attaque est confirmée',
      contexte: [
        'C’est un rançongiciel. Paie, cantine, périscolaire, crèche, rendez-vous, contrats — tout est chiffré.',
        'Le technicien réclame des renforts.',
        'Les représentants du personnel menacent un droit de retrait. Des journalistes appellent directement des agents.',
      ],
      notifications: {
        direction: 'L’attaque est confirmée. Pouvez-vous fixer les trois priorités immédiates ?',
        si: 'Tout est chiffré et l’équipe est débordée. J’ai besoin d’un arbitrage sur les renforts.',
        communication: 'Des journalistes contactent directement les agents. Qui sera notre porte-parole ?',
        juridique: 'Dois-je préparer le dépôt de plainte et vérifier notre couverture assurantielle ?',
        rh: 'Les représentants du personnel évoquent un droit de retrait. Quelle réponse leur apportons-nous ?',
        relations: 'Les services essentiels sont bloqués. Lesquels devons-nous maintenir en priorité ?',
      },
    },
    {
      heure: '12h30',
      titre: 'L’ampleur de l’impact se révèle',
      contexte: [
        'Les sauvegardes sont compromises. Les attaquants publient une demande de rançon : 500 000 €.',
        'À la crèche, les fiches santé sont inaccessibles — les soins du midi sont impossibles.',
        'Les équipes fatiguent et demandent des roulements.',
      ],
      notifications: {
        direction: 'La rançon atteint 500 000 €. Pouvez-vous trancher notre position officielle ?',
        si: 'Les sauvegardes sont compromises. Quelles activités dois-je sécuriser en premier ?',
        communication: 'La demande de rançon circule. Quel niveau d’information rendons-nous public ?',
        juridique: 'J’ai besoin d’un budget immédiat pour les prestataires et le matériel. Pouvez-vous l’autoriser ?',
        rh: 'Les équipes sont épuisées. Puis-je instaurer des roulements dès maintenant ?',
        relations: 'Les fiches santé de la crèche sont inaccessibles. Quelle solution dégradée validons-nous ?',
      },
    },
    {
      heure: '15h30',
      titre: 'Fuite de données détectée',
      contexte: [
        'Des données ont été volées et publiées sur le dark web.',
        'La dernière sauvegarde saine date d’une semaine — trois jours de réinstallation en perspective.',
        'Un élu attaque sur le coût de la crise, un autre sur le sous-investissement cyber.',
      ],
      notifications: {
        direction: 'La fuite est confirmée. Qui pilote désormais la reprise et les notifications obligatoires ?',
        si: 'La dernière sauvegarde saine date d’une semaine. Quelles applications reconstruisons-nous d’abord ?',
        communication: 'Les critiques politiques s’intensifient. Puis-je mettre à jour notre communiqué ?',
        juridique: 'Des données personnelles sont publiées. Dois-je saisir la CNIL immédiatement ?',
        rh: 'La pression affecte les agents. Puis-je ouvrir une cellule de soutien psychologique ?',
        relations: 'Quels publics fragiles devons-nous contacter en priorité ?',
      },
    },
    {
      heure: '16h30',
      titre: 'La reconstruction commence',
      contexte: [
        'Bilan sévère : 100 % des serveurs chiffrés, 70 postes à remplacer, fuite confirmée (noms, coordonnées, contrats).',
        'Trois semaines minimum de gestion dégradée.',
        'Un article local paraît sur la fuite et le risque de surendettement.',
      ],
      notifications: {
        direction: 'Trois semaines de mode dégradé sont prévues. Pouvez-vous valider la feuille de route ?',
        si: 'Soixante-dix postes sont à remplacer. Quel ordre de reconstruction retenons-nous ?',
        communication: 'L’article local vient de paraître. Quelle réponse officielle publions-nous ?',
        juridique: 'La crise menace le budget communal. Quelles dépenses devons-nous sécuriser ?',
        rh: 'Les équipes vont tenir plusieurs semaines. Puis-je organiser repos et renforts ?',
        relations: 'Les services reprendront progressivement. Quel calendrier annonçons-nous aux usagers ?',
      },
    },
  ],
};
