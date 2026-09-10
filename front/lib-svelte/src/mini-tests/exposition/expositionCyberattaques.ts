/**
 * Logique du mini-test « Mon organisation est-elle exposée aux cyberattaques ? ».
 *
 * Reprend le calcul de facteurs d'exposition et les contenus de sensibilisation de la
 * version précédente du simulateur (POC HTML), sans changement de fond : mêmes règles de
 * renforcement, mêmes chiffres sourcés ANSSI / Cybermalveillance.gouv.fr.
 */

export type TypeOrganisation = 'tpe-pme-eti' | 'grand-groupe' | 'collectivite' | 'association';

export type Secteur =
  | 'sante'
  | 'energie'
  | 'transports'
  | 'telecom'
  | 'defense'
  | 'institutionnel'
  | 'commerce'
  | 'assurance'
  | 'sport'
  | 'emploi'
  | 'logistique'
  | 'autre';

export type FacteurAggravant = 'reputation' | 'subco' | 'rd' | 'ot' | 'geo';

export type IdMenace = 'ranso' | 'fovi' | 'harc' | 'espionnage' | 'destab' | 'subco';

export type ReponsesExposition = {
  type: TypeOrganisation;
  secteur?: Secteur;
  facteurs: FacteurAggravant[];
};

export const TYPES_ORGANISATION: { value: TypeOrganisation; label: string }[] = [
  { value: 'tpe-pme-eti', label: 'TPE / PME / ETI' },
  { value: 'grand-groupe', label: 'Grand groupe' },
  { value: 'collectivite', label: 'Collectivités et administrations' },
  { value: 'association', label: 'Association / ONG' },
];

export const SECTEURS: { value: Secteur; label: string }[] = [
  { value: 'assurance', label: 'Assurance / Mutuelles' },
  { value: 'commerce', label: 'Commerce (en ligne ou physique)' },
  { value: 'defense', label: 'Défense / BITD' },
  { value: 'emploi', label: 'Emploi / RH' },
  { value: 'energie', label: 'Énergie' },
  { value: 'institutionnel', label: 'Institutionnel / Gouvernemental' },
  { value: 'logistique', label: 'Logistique / Livraison' },
  { value: 'sante', label: 'Santé' },
  { value: 'sport', label: 'Sport / Loisirs' },
  { value: 'telecom', label: 'Télécommunications' },
  { value: 'transports', label: 'Transports' },
  { value: 'autre', label: 'Autre' },
];

export const FACTEURS_AGGRAVANTS: { value: FacteurAggravant; label: string }[] = [
  { value: 'reputation', label: 'Forte visibilité en ligne' },
  { value: 'subco', label: 'Forte dépendance à des sous-traitants ou prestataires informatiques' },
  { value: 'rd', label: 'Activités de R&D et innovation' },
  { value: 'ot', label: 'Présence de systèmes industriels' },
  { value: 'geo', label: 'Exposition à des évènements publics ou internationaux' },
];

const TYPES_AVEC_SECTEUR: TypeOrganisation[] = ['tpe-pme-eti', 'grand-groupe'];

export const secteurDisponiblePour = (type: TypeOrganisation | undefined): boolean =>
  !!type && TYPES_AVEC_SECTEUR.includes(type);

const aUnFacteur = (reponses: ReponsesExposition, facteur: FacteurAggravant): boolean =>
  reponses.facteurs.includes(facteur);

export type Scores = Record<IdMenace, { renforce: boolean }>;

/**
 * Chaque menace n'a plus que 2 états : « base » (non nommé, la carte étant déjà filtrée
 * pour n'afficher que des menaces pertinentes) et « Renforcée », dès qu'au moins un
 * facteur d'aggravation identifié est présent.
 */
export function calculerScores(reponses: ReponsesExposition): Scores {
  const { type, secteur } = reponses;

  const ransoRenforce =
    secteur === 'sante' || type === 'tpe-pme-eti' || aUnFacteur(reponses, 'ot') || aUnFacteur(reponses, 'subco');

  const foviRenforce = type === 'collectivite' || aUnFacteur(reponses, 'subco');

  const harcRenforce = type === 'collectivite' || type === 'tpe-pme-eti' || aUnFacteur(reponses, 'reputation');

  // Carte déjà visible seulement si R&D et/ou type Collectivité (cf. `menacesPertinentes`) :
  // ces 2 facteurs étant aussi des facteurs de renforcement, cette carte affiche donc
  // toujours « Renforcée ».
  const espionnageRenforce =
    type === 'collectivite' ||
    (!!secteur && ['energie', 'telecom', 'defense', 'sante'].includes(secteur)) ||
    aUnFacteur(reponses, 'rd');

  // Carte déjà visible seulement si exposition aux évènements internationaux (cf.
  // `menacesPertinentes`) ; passe à « Renforcée » si le secteur est concerné, ou si
  // le second facteur (systèmes industriels) s'ajoute pour une TPE/PME/ETI.
  const destabRenforce =
    (!!secteur && ['energie', 'telecom', 'transports'].includes(secteur)) ||
    (type === 'tpe-pme-eti' && aUnFacteur(reponses, 'ot'));

  return {
    ranso: { renforce: ransoRenforce },
    fovi: { renforce: foviRenforce },
    harc: { renforce: harcRenforce },
    espionnage: { renforce: espionnageRenforce },
    destab: { renforce: destabRenforce },
    subco: { renforce: false },
  };
}

export type DefinitionMenace = {
  id: IdMenace;
  icone: string;
  couleurFond: string;
  nom: string;
  description: string;
  visible: (reponses: ReponsesExposition) => boolean;
};

// Ordre : menaces à but lucratif d'abord (les plus fréquentes selon Cybermalveillance.gouv.fr),
// puis espionnage, puis déstabilisation (ANSSI).
export const DEFINITIONS_MENACES: DefinitionMenace[] = [
  {
    id: 'ranso',
    icone: '/assets/icones/cadenas.avif',
    couleurFond: 'jaune',
    nom: 'Rançongiciel & extorsion',
    description: 'Chiffrement des systèmes, demande de rançon, exfiltration de données à des fins de chantage.',
    visible: () => true,
  },
  {
    id: 'fovi',
    icone: '/assets/icones/liasse-de-billets-aillee.avif',
    couleurFond: 'bleu-clair',
    nom: 'Fraude au virement',
    description: "Faux RIB, faux ordre de virement, usurpation d'identité d'un fournisseur ou d'un dirigeant.",
    visible: () => true,
  },
  {
    id: 'harc',
    icone: '/assets/icones/bulle-discussion.avif',
    couleurFond: 'pourpre',
    nom: 'Cyberharcèlement',
    description:
      "Dénigrement, faux avis, usurpation d'identité sur les réseaux sociaux visant l'organisation ou ses dirigeants.",
    visible: () => true,
  },
  {
    id: 'espionnage',
    icone: '/assets/icones/regard-de-cote.avif',
    couleurFond: 'bleu',
    nom: 'Espionnage stratégique & industriel',
    description:
      'Collecte de renseignement, vol de données sensibles, compromission longue durée par acteurs étatiques.',
    // Affiché uniquement si activité de R&D et/ou type « Collectivités et administrations »
    visible: (reponses) => aUnFacteur(reponses, 'rd') || reponses.type === 'collectivite',
  },
  {
    id: 'destab',
    icone: '/assets/icones/megaphone.avif',
    couleurFond: 'rose',
    nom: 'Déstabilisation',
    description: 'DDoS, défiguration de sites, sabotage et divulgation de données à visée politique.',
    // Affiché uniquement si exposition à des évènements publics ou internationaux
    visible: (reponses) => aUnFacteur(reponses, 'geo'),
  },
  {
    id: 'subco',
    icone: '/assets/icones/poignee-de-mains.avif',
    couleurFond: 'bleu-clair',
    nom: "Compromission d'un prestataire",
    description:
      "Exploitation d'un fournisseur, sous-traitant ou service tiers comme point d'entrée pour accéder à vos données ou systèmes.",
    // Affiché uniquement si forte dépendance à des sous-traitants ou prestataires informatiques
    visible: (reponses) => aUnFacteur(reponses, 'subco'),
  },
];

/**
 * Paragraphes de mise en contexte pour une menace, selon le profil renseigné.
 * Les statistiques sont mises en évidence avec `<strong>` (seule balise d'emphase
 * autorisée par le nettoyeur HTML `aseptiseHtml`).
 */
export function paragraphesInsight(id: IdMenace, reponses: ReponsesExposition): string[] {
  const { type, secteur } = reponses;

  if (id === 'ranso') {
    const principal =
      "Selon l'ANSSI, les compromissions par rançongiciels demeurent une menace importante en France et représentent une part significative de l'activité cybercriminelle observée.";
    let variante = '';
    if (secteur === 'sante')
      variante =
        "La proportion des rançongiciels ayant touché des établissements de santé (<strong>8&nbsp;%</strong>) est de nouveau en hausse par rapport à 2024. Plusieurs centres hospitaliers ont subi des perturbations de leurs activités d'accueil et de traitement de patients. Les petites structures de santé telles que les EHPAD et les cliniques sont également affectées par ce type d'incident.";
    else if (type === 'tpe-pme-eti')
      variante =
        "<strong>37&nbsp;%</strong> des victimes de rançongiciels constatées en 2025 par l'ANSSI étaient des TPE, PME et ETI.";
    else if (type === 'collectivite')
      variante =
        'La part des collectivités territoriales victimes de rançongiciel demeure importante (<strong>11&nbsp;%</strong> en 2025). Les rançongiciels sont la 3e cybermenace la plus fréquente pour les collectivités et administrations, avec un impact sur la continuité des services publics.';
    else if (type === 'grand-groupe')
      variante =
        "Les grands groupes représentent <strong>12&nbsp;%</strong> des victimes selon l'ANSSI, ciblés pour des rançons élevées et le vol de données sensibles.";

    const extras: string[] = [];
    if (aUnFacteur(reponses, 'subco'))
      extras.push(
        'Une forte dépendance à des prestataires accroît ce risque, ces attaques exploitant souvent des accès distants gérés par des tiers.'
      );
    if (aUnFacteur(reponses, 'ot'))
      extras.push(
        "Les systèmes industriels peuvent constituer un point d'entrée privilégié, via des accès distants insuffisamment sécurisés, emportant un risque d'arrêt de la production."
      );

    return [principal, [variante, ...extras].filter(Boolean).join(' ')].filter(Boolean);
  }

  if (id === 'fovi') {
    const principal =
      "Les fraudes au virement ont bondi de <strong>+170&nbsp;%</strong> en 2025 selon Cybermalveillance.gouv.fr : usurpation d'un fournisseur ou d'un dirigeant, souvent après piratage d'une messagerie, pour détourner un paiement. Les données bancaires ayant fait l'objet de violations récentes et exposées concourent à ce risque.";
    const clauseType =
      type === 'collectivite'
        ? 'Pour les collectivités et administrations, ce risque a progressé de <strong>+262&nbsp;%</strong> en 2025, désormais parmi les menaces les plus fréquentes rencontrées par ces dernières.'
        : "Pour les entreprises, elle est l'une des cybermenaces les plus fréquentes constatées en 2025 (+93&nbsp;%).";
    return [principal, clauseType];
  }

  if (id === 'harc') {
    const principal =
      'Le cyberharcèlement des organisations progresse fortement en 2025 selon Cybermalveillance.gouv.fr, visant autant les dirigeants ou agents que la structure elle-même.';
    const clauseType =
      type === 'collectivite'
        ? 'Une augmentation de <strong>+209&nbsp;%</strong> pour les collectivités et administrations a été constatée. Elles sont particulièrement visées par des campagnes de dénigrement à motivation politique ou administrative.'
        : 'Une augmentation de <strong>+205&nbsp;%</strong> pour les entreprises a été constatée.';

    const extras: string[] = [];
    if (type === 'tpe-pme-eti')
      extras.push(
        'Les plus petites structures, moins outillées pour gérer leur e-réputation, sont souvent démunies face à ce type de campagne.'
      );
    if (aUnFacteur(reponses, 'reputation'))
      extras.push(
        "Une forte présence en ligne y expose davantage : faux avis, dénigrement organisé, parfois assortis d'une demande de rançon pour leur retrait."
      );

    return [principal, [clauseType, ...extras].filter(Boolean).join(' ')].filter(Boolean);
  }

  if (id === 'espionnage') {
    let variante = '';
    if (type === 'collectivite')
      variante =
        "Les entités publiques et notamment gouvernementales sont la cible la plus fréquente de l'espionnage d'origine étatique : décisions, négociations, positions stratégiques.";
    else if (secteur === 'energie')
      variante =
        "Selon l'ANSSI, le secteur de l'énergie a constitué en 2025 une cible prioritaire pour des services de renseignement étrangers, avec des campagnes actives en France et en Europe.";
    else if (secteur === 'telecom')
      variante =
        "Selon l'ANSSI, le secteur des télécommunications a constitué en 2025 une cible prioritaire pour des services de renseignement étrangers, avec des campagnes actives en France et en Europe.";
    else if (secteur === 'defense')
      variante =
        "Selon l'ANSSI, le secteur de la défense a constitué en 2025 une cible prioritaire pour des services de renseignement étrangers, avec des campagnes actives en France et en Europe.";
    else if (secteur === 'sante')
      variante =
        "Le secteur de la santé concentre plus de <strong>10&nbsp;%</strong> des incidents traités par l'ANSSI ; les données médicales sont convoitées pour le chantage ou le renseignement sur des personnalités.";

    const clauseRd = aUnFacteur(reponses, 'rd')
      ? "Les activités de R&D constituent un facteur d'exposition accru au risque d'espionnage : brevets, prototypes et résultats peuvent être convoités par des concurrents ou des États."
      : '';

    return [clauseRd, variante].filter(Boolean);
  }

  if (id === 'subco') {
    return [
      "L'ANSSI documente une proportion croissante de cyberattaques impliquant la compromission préalable d'un sous-traitant ou d'un prestataire pour atteindre une cible finale. Infogéreur, prestataire Cloud, éditeurs logiciel peuvent constituer une porte d'entrée vers vos données ou vos systèmes d'information.",
      "Par ailleurs, une violation de données subie par un partenaire, un fournisseur ou un service tiers que vous utilisez peut, même sans compromission directe de vos propres systèmes, exposer indirectement des informations vous concernant (identité, coordonnées, données bancaires) et alimenter des attaques secondaires contre votre organisation : hameçonnage ciblé, fraude au virement, usurpation d'identité.",
    ];
  }

  // destab
  const principal =
    "Fortement liées à l'actualité internationale, les attaques à des fins de déstabilisation ciblant des entités françaises ont été particulièrement nombreuses en 2025 selon l'ANSSI. Les attaques par DDoS ont été les plus fréquentes.";
  const clauseGeo =
    "L'exposition à des événements publics ou à des enjeux géopolitiques constitue un facteur d'exposition aggravant.";
  const clauseOtPme =
    type === 'tpe-pme-eti' && aUnFacteur(reponses, 'ot')
      ? 'Des groupes ont revendiqué en 2024 la prise de contrôle de petites installations industrielles, appartenant à des TPE/PME.'
      : '';

  return [principal, [clauseGeo, clauseOtPme].filter(Boolean).join(' ')].filter(Boolean);
}

export type ResumeInsight = {
  indicateur: string;
  enHausse: boolean;
  texte: string;
  source: 'ANSSI' | 'CYBERMALVEILLANCE';
};

/**
 * Résumé chiffré d'une menace pour l'affichage en carte, dérivé des mêmes
 * chiffres sourcés que `paragraphesInsight`. Retourne `undefined` quand
 * aucun chiffre sourcé n'est disponible pour le profil renseigné (on
 * n'invente pas de statistique).
 */
export function resumeInsight(id: IdMenace, reponses: ReponsesExposition): ResumeInsight | undefined {
  const { type, secteur } = reponses;

  if (id === 'ranso') {
    if (secteur === 'sante')
      return {
        indicateur: '8 %',
        enHausse: true,
        texte: 'des établissements de santé touchés par un rançongiciel en 2025',
        source: 'ANSSI',
      };
    if (type === 'tpe-pme-eti')
      return {
        indicateur: '37 %',
        enHausse: false,
        texte: 'des victimes de rançongiciels en 2025 étaient des TPE, PME ou ETI',
        source: 'ANSSI',
      };
    if (type === 'collectivite')
      return {
        indicateur: '11 %',
        enHausse: false,
        texte: "des collectivités victimes d'un rançongiciel en 2025",
        source: 'ANSSI',
      };
    if (type === 'grand-groupe')
      return {
        indicateur: '12 %',
        enHausse: false,
        texte: 'des victimes de rançongiciels en 2025 étaient des grands groupes',
        source: 'ANSSI',
      };
    return undefined;
  }

  if (id === 'fovi')
    return {
      indicateur: '+170 %',
      enHausse: true,
      texte: 'de fraudes au virement constatées en 2025',
      source: 'CYBERMALVEILLANCE',
    };

  if (id === 'harc')
    return type === 'collectivite'
      ? {
          indicateur: '+209 %',
          enHausse: true,
          texte: 'pour les collectivités et administrations en 2025',
          source: 'CYBERMALVEILLANCE',
        }
      : {
          indicateur: '+205 %',
          enHausse: true,
          texte: 'pour les entreprises en 2025',
          source: 'CYBERMALVEILLANCE',
        };

  if (id === 'espionnage') {
    if (secteur === 'sante')
      return {
        indicateur: '> 10 %',
        enHausse: false,
        texte: "des incidents traités par l'ANSSI concernent la santé",
        source: 'ANSSI',
      };
    return undefined;
  }

  if (id === 'subco')
    return {
      indicateur: 'Sous-traitance',
      enHausse: false,
      texte: 'généralisation des attaques passant par la chaîne de sous-traitance',
      source: 'ANSSI',
    };

  // destab
  return {
    indicateur: 'DDoS',
    enHausse: false,
    texte: "mode d'attaque à des fins de destabilisation",
    source: 'ANSSI',
  };
}

export type MenaceEvaluee = DefinitionMenace & {
  renforce: boolean;
  paragraphesInsight: string[];
  resume: ResumeInsight | undefined;
};

export function menacesPertinentes(reponses: ReponsesExposition): MenaceEvaluee[] {
  const scores = calculerScores(reponses);

  return DEFINITIONS_MENACES.filter((menace) => menace.visible(reponses)).map((menace) => ({
    ...menace,
    renforce: scores[menace.id].renforce,
    paragraphesInsight: paragraphesInsight(menace.id, reponses),
    resume: resumeInsight(menace.id, reponses),
  }));
}
