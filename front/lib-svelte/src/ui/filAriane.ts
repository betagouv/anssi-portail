import { decodeEntiteHtml } from '$plateforme/aseptisationDuHtml';

export type Branche = {
  nom: string;
  lien: string | undefined;
};

export type Segment = {
  id: string;
  label: string;
  href: string;
};

export const fabriqueSegment = (branche?: Branche): Segment[] =>
  branche ? [{ id: `noeud-${branche.nom}`, label: branche.nom, href: branche.lien ?? '' }] : [];

type FabriqueFilAriane = {
  (args: PropriétésFilAriane): Segment[];
  (args: PropriétésFilAriane, utilisateurEstConnecté: boolean): Segment[];
};

type PropriétésSegmentFilAriane =
  | {
      // branche
      défaut: Branche;
      connecté?: Branche;
    }
  | Branche
  | {
      // feuille
      nom: string;
    };

export type PropriétésFilAriane =
  | {
      branche?: Branche;
      brancheConnectée?: Branche;
      feuille: string;
    }
  | PropriétésSegmentFilAriane[];

export const fabriqueFilAriane: FabriqueFilAriane = (
  propriétés: PropriétésFilAriane,
  utilisateurEstConnecté: boolean = false
) => {
  const segmentAccueil = utilisateurEstConnecté
    ? { id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' }
    : { id: 'noeud-accueil', label: 'Accueil', href: '/' };

  if (Array.isArray(propriétés)) {
    const segments = propriétés.flatMap((segment) => {
      if ('défaut' in segment) {
        // branche/segment avec 2 modes
        const branche = (utilisateurEstConnecté && segment.connecté) || segment.défaut;
        return fabriqueSegment(branche);
      }
      if ('lien' in segment) {
        // branche/segment "simple" avec 1 mode
        return fabriqueSegment(segment);
      }
      // feuille
      return {
        id: `noeud-${decodeEntiteHtml(segment.nom)}`,
        label: decodeEntiteHtml(segment.nom),
        href: '',
      };
    });
    return [segmentAccueil, ...segments];
  }

  const { branche, brancheConnectée, feuille } = propriétés;

  const segmentBranche = fabriqueSegment((utilisateurEstConnecté && brancheConnectée) || branche);

  const segmentFeuille = {
    id: `noeud-${decodeEntiteHtml(feuille)}`,
    label: decodeEntiteHtml(feuille),
    href: '',
  };

  return [segmentAccueil, ...segmentBranche, segmentFeuille];
};
