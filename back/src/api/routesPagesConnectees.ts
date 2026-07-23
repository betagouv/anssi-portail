const origineDeReferencePourValidation = 'https://origine-interne.invalid';

export const routesPagesConnecteesStatiques = ['ma-maturite', 'favoris', 'services-anssi', 'gestion-guides'] as const;

const cheminsPagesConnecteesStatiques = new Set([
  ...routesPagesConnecteesStatiques.map((page) => `/${page}`),
  '/parcours-complet',
]);
const motifsPagesConnecteesAvecParametre = [/^\/modules\/[^/]+$/, /^\/mesures\/[^/]+$/];

export const estUrlRedirectionApresConnexionAutorisee = (valeur: string): boolean => {
  try {
    const url = new URL(valeur, origineDeReferencePourValidation);
    const cheminSansSlashFinal = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;

    return (
      url.origin === origineDeReferencePourValidation &&
      (cheminsPagesConnecteesStatiques.has(cheminSansSlashFinal) ||
        motifsPagesConnecteesAvecParametre.some((motif) => motif.test(cheminSansSlashFinal)))
    );
  } catch {
    return false;
  }
};
