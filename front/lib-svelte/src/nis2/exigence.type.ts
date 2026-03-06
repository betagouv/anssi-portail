export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type Referentiel = 'NIS2' | 'ISO';
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

export type Exigence = ExigenceNis2 | ExigenceISO;

export const badgesExigence = (exigence: ExigenceNis2) => {
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
};

export const formateContenuExigence = ({
  contenu,
}: ExigenceBase | ExigenceComparee) => {
  return contenu
    .split('\n')
    .map((p) => {
      if (p.startsWith('•')) {
        return `<li>${p.replace('•', '')}</li>`;
      }
      return `<p>${p}</p>`;
    })
    .join('')
    .replace(/(?<!<\/li>)\s*<li>/g, '<ul><li>')
    .replace(/<\/li>(?!\s*<li>)/g, '</li></ul>');
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
  }

  return {
    reference: (exigence.reference as string) ?? '',
    contenu: (exigence.contenu as string) ?? '',

    norme: (exigence.norme as string) ?? '',
    chapitre: (exigence.chapitre as string) ?? '',

    correspondance: correspondances['NIS2'],
  } satisfies ExigenceISO;
};
