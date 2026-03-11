export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type Referentiel = 'NIS2' | 'ISO' | 'AE' | 'CyFun23';
export type ReferentielSelectionne = Exclude<Referentiel, 'NIS2'>;

export type ExigenceComparee = {
  reference: string;
  contenu: string;
};

export type Correspondance = {
  niveau: 'NA' | 'faible' | 'moyen' | 'élevé';
  exigences: ExigenceComparee[];
  observations: string;
};

export type ExigenceBase = {
  reference: string;
  contenu: string;
};

export interface ExigenceNis2 extends ExigenceBase {
  objectifSecurite: string;
  thematique: string;
  entitesCible: CategorieEntite[];
  correspondance?: Correspondance;
}

export interface ExigenceISO extends ExigenceBase {
  norme: string;
  chapitre: string;
  correspondance: Correspondance;
}

export interface ExigenceAE extends ExigenceBase {
  correspondance: Correspondance;
}

export type CyFun23Fonction =
  | 'Identifier'
  | 'Protéger'
  | 'Détecter'
  | 'Répondre'
  | 'Rétablir';

export type CyFun23NiveauAssurance = 'Basique' | 'Important' | 'Essentiel';

export interface ExigenceCyFun23 extends ExigenceBase {
  fonction: CyFun23Fonction;
  niveauAssurance: CyFun23NiveauAssurance;
  estMesureCle: boolean;
  correspondance: Correspondance;
}

export type Exigence =
  | ExigenceNis2
  | ExigenceISO
  | ExigenceAE
  | ExigenceCyFun23;

export const badgesExigence = (exigence: ExigenceNis2 | ExigenceCyFun23) => {
  if ('entitesCible' in exigence) {
    return exigence?.entitesCible?.map((categorie) => ({
      label: {
        EntiteImportante: 'EI',
        EntiteEssentielle: 'EE',
      }[categorie],
      accent: {
        EntiteImportante: 'green-archipel',
        EntiteEssentielle: 'green-bourgeon',
      }[categorie],
    }));
  }
  return [
    ...(exigence.estMesureCle
      ? [
          {
            label: 'mesure clé',
            type: 'default',
            hasIcon: true,
            icon: 'checkbox-line',
          },
        ]
      : []),
    {
      label: exigence.fonction,
      accent: {
        Identifier: 'green-archipel',
        Protéger: 'blue-ecume',
        Détecter: 'yellow-moutarde',
        Répondre: 'pink-tuile',
        Rétablir: 'green-emeraude',
      }[exigence.fonction],
    },
    {
      label: exigence.niveauAssurance,
      accent: {
        Basique: 'green-bourgeon',
        Important: 'brown-cafe-creme',
        Essentiel: 'purple-glycine',
      }[exigence.niveauAssurance],
    },
  ];
};

export const formateContenuExigence = ({
  contenu,
}: ExigenceBase | ExigenceComparee): string => {
  const lignes = contenu.split('\n');
  const htmlParts: string[] = [];

  let niveauCourant = -1;

  const ouvreListe = () => {
    htmlParts.push('<ul>');
    niveauCourant++;
  };

  const fermeListe = () => {
    htmlParts.push('</ul>');
    niveauCourant--;
  };

  for (const ligne of lignes) {
    let niveau = -1;
    let texte = ligne.trim();

    if (ligne.startsWith('•')) {
      niveau = 0;
      texte = ligne.slice(1).trim();
    } else if (ligne.startsWith('o\t')) {
      niveau = 1;
      texte = ligne.slice(2).trim();
    }

    if (niveau >= 0) {
      while (niveauCourant < niveau) ouvreListe();
      while (niveauCourant > niveau) fermeListe();

      htmlParts.push(`<li>${texte}</li>`);
    } else {
      while (niveauCourant >= 0) fermeListe();
      htmlParts.push(`<p>${texte}</p>`);
    }
  }
  return htmlParts.join('');
};

export const fabriqueDExigence = (
  source: Referentiel,
  cible: Referentiel | undefined,
  exigence: Record<string, unknown>
): Exigence => {
  const correspondances = exigence.correspondances as Record<
    string,
    Correspondance
  >;
  if (source === 'NIS2') {
    return {
      reference: (exigence.reference as string) ?? '',
      contenu: (exigence.contenu as string) ?? '',

      objectifSecurite: (exigence.objectifSecurite as string) ?? '',
      thematique: (exigence.thematique as string) ?? '',
      entitesCible: (exigence.entitesCible as CategorieEntite[]) ?? [],

      correspondance: cible && correspondances[cible],
    } satisfies ExigenceNis2;
  } else if (source === 'ISO') {
    return {
      reference: (exigence.reference as string) ?? '',
      contenu: (exigence.contenu as string) ?? '',

      norme: (exigence.norme as string) ?? '',
      chapitre: (exigence.chapitre as string) ?? '',

      correspondance: correspondances['NIS2'],
    } satisfies ExigenceISO;
  } else if (source === 'AE') {
    return {
      reference: (exigence.reference as string) ?? '',
      contenu: (exigence.contenu as string) ?? '',

      correspondance: correspondances['NIS2'],
    } satisfies ExigenceAE;
  } else {
    return {
      reference: (exigence.reference as string) ?? '',
      contenu: (exigence.contenu as string) ?? '',
      estMesureCle: Boolean(exigence.estMesureCle),
      fonction: exigence.fonction as CyFun23Fonction,
      niveauAssurance: exigence.niveauAssurance as CyFun23NiveauAssurance,

      correspondance: correspondances['NIS2'],
    } satisfies ExigenceCyFun23;
  }
};
