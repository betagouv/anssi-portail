import { decodeHTML } from 'entities';

export type Branche = {
  nom: string;
  lien: string;
};

export type Segment = {
  id: string;
  label: string;
  href: string;
};

export type PropriétésFilAriane = {
  parents?: Branche[];
  feuille: string;
};

export const fabriqueFilAriane = (propriétés: PropriétésFilAriane | undefined): Segment[] => {
  if (!propriétés) return [];
  return [{ nom: 'Accueil', lien: '/' }, ...(propriétés.parents ?? []), { nom: propriétés.feuille, lien: '' }].map(
    ({ nom, lien }, index) => ({ id: `noeud-${index}`, label: decodeHTML(nom), href: lien })
  );
};
