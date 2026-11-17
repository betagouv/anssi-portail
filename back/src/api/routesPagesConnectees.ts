const origineDeReferencePourValidation = 'https://origine-interne.invalid';

export const routesPagesConnectéesStatiques = [
  'favoris',
  'gestion-guides',
  'campagne-de-sensibilisation',
  'ma-maturite',
  'tableau-de-bord',
] as const;

const cheminsPagesConnecteesStatiques = new Set([
  ...routesPagesConnectéesStatiques.map((page) => `/${page}`),
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
