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
  (args: { feuille: string; branche?: Branche }): Segment[];
  (
    args: { feuille: string; branche?: Branche; brancheConnectée?: Branche },
    utilisateurEstConnecté: boolean
  ): Segment[];
};

export const fabriqueFilAriane: FabriqueFilAriane = (
  { branche, brancheConnectée, feuille }: { feuille: string; branche?: Branche; brancheConnectée?: Branche },
  utilisateurEstConnecté: boolean = false
) => {
  const segmentAccueil = utilisateurEstConnecté
    ? { id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' }
    : { id: 'noeud-accueil', label: 'Accueil', href: '/' };

  const segmentBranche = fabriqueSegment((utilisateurEstConnecté && brancheConnectée) || branche);

  const segmentFeuille = {
    id: `noeud-${decodeEntiteHtml(feuille)}`,
    label: decodeEntiteHtml(feuille),
    href: '',
  };

  return [segmentAccueil, ...segmentBranche, segmentFeuille];
};
