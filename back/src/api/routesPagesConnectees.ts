const origineDeReferencePourValidation = 'https://origine-interne.invalid';

export const routesPagesConnecteesStatiques = ['ma-maturite', 'favoris', 'services-anssi', 'gestion-guides'] as const;

const cheminsPagesConnecteesStatiques = new Set([
  ...routesPagesConnecteesStatiques.map((page) => `/${page}`),
  '/parcours-complet',
]);
const cheminsPagesConnectéesAvecParamètres = ['/modules/', '/mesures/'];

export const estUrlRedirectionApresConnexionAutorisee = (valeur: string): boolean => {
  try {
    const url = new URL(valeur, origineDeReferencePourValidation);
    const cheminSansSlashFinal = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;

    const aLaMêmeOrigine = url.origin === origineDeReferencePourValidation;
    const aUnCheminStatiqueValide = cheminsPagesConnecteesStatiques.has(cheminSansSlashFinal);
    const aUnCheminAvecParamètresValide = cheminsPagesConnectéesAvecParamètres.some((motif) =>
      cheminSansSlashFinal.startsWith(motif)
    );

    return aLaMêmeOrigine && (aUnCheminStatiqueValide || aUnCheminAvecParamètresValide);
  } catch {
    return false;
  }
};
