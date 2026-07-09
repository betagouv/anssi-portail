import { untrack } from 'svelte';
import { SvelteURLSearchParams } from 'svelte/reactivity';

type ExtraisValeur = {
  <T>(cle: string): T | undefined;
  <T>(cle: string, defaut: T): T;
  <T, U = T | null>(cle: string, defaut: U): T | U | null;
};

export type FragmentDeNavigation = {
  section?: string | undefined;
  change: <T>(cle: string, valeur: T | T[]) => void;
  changeSection: (section: string | undefined, actualise: boolean) => void;
  extraisTableau: <T>(cle: string) => T[];
  extraisValeur: ExtraisValeur;
  actualise: () => string;
};

const fragmentSansComportement: FragmentDeNavigation = {
  section: undefined,
  change: () => {},
  changeSection: () => {},
  extraisTableau: () => [],
  extraisValeur: () => undefined,
  actualise: () => '',
};

const nettoie = (hash: string | undefined): string => hash?.replace(/^#/, '') ?? '';

export const creeLeFragmentDeNavigation = (hash?: string): FragmentDeNavigation => {
  if (hash === undefined && typeof window === 'undefined') {
    return fragmentSansComportement;
  }

  let section = $state<string | undefined>(undefined);
  const filtres: Record<string, string[]> = $state({});
  const initialise = (hash: string) => {
    const [sectionActive, reste = ''] = nettoie(hash).split('?');
    for (const [cle, valeur] of new SvelteURLSearchParams(reste).entries()) {
      if (valeur) filtres[cle] = valeur.split(',').filter(Boolean);
    }
    section = sectionActive || undefined;
  };
  initialise(hash ?? window.location.hash);
  $effect(() => {
    const change = () => initialise(window.location.hash);
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  });
  const serialise = (): string => {
    const chaineFiltres = Object.entries(filtres)
      .filter(([, v]) => v.length > 0)
      .map(([k, v]) => `${k}=${v.join(',')}`)
      .join('&');
    return '#' + (section ?? '') + (chaineFiltres.length ? `?${chaineFiltres}` : '');
  };
  const actualiseInterne = () => {
    return untrack(() => {
      const nouveauHash = serialise();
      if (typeof window !== 'undefined' && window.location.hash !== nouveauHash) {
        window.location.hash = nouveauHash;
      }
      return nouveauHash;
    });
  };
  return {
    get section() {
      return section;
    },
    change: <T>(cle: string, valeur: T | T[]) => {
      filtres[cle] = (Array.isArray(valeur) ? valeur : valeur ? [valeur] : []).map(String);
    },
    changeSection: (nouvelleSection: string | undefined, actualise: boolean) => {
      section = nouvelleSection;
      if (actualise) actualiseInterne();
    },
    extraisTableau: <T>(cle: string): T[] => (filtres[cle] as unknown as T[]) ?? [],
    extraisValeur: <T, U = T | undefined>(cle: string, defaut?: U): T | U | undefined =>
      (filtres[cle]?.[0] as unknown as T) ?? defaut,
    actualise: actualiseInterne,
  };
};
