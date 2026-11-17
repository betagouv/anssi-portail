import { decodeHTML } from 'entities';
import { fromStore } from 'svelte/store';
import { espaceConnectéActivé } from '$plateforme/environnement';
import { profilStore } from '../stores/profil.store';

const profil = fromStore(profilStore);

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

  const premièreBranche: Branche =
    espaceConnectéActivé && !!profil.current?.email
      ? { nom: 'Tableau de bord', lien: '/tableau-de-bord' }
      : { nom: 'Accueil', lien: '/' };

  return [premièreBranche, ...(propriétés.parents ?? []), { nom: propriétés.feuille, lien: '' }].map(
    ({ nom, lien }, index) => ({ id: `noeud-${index}`, label: decodeHTML(nom), href: lien })
  );
};
