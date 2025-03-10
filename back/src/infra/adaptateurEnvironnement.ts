const adaptateurEnvironnement = {
  oidc: () => ({
    urlRedirectionApresAuthentification: () =>
      `${process.env.URL_BASE_MSC}/oidc/apres-authentification`,
    urlRedirectionApresDeconnexion: () =>
      `${process.env.URL_BASE_MSC}/oidc/apres-deconnexion`,
    urlBase: () => process.env.OIDC_URL_BASE || '/',
    clientId: () => process.env.OIDC_CLIENT_ID || '',
    clientSecret: () => process.env.OIDC_CLIENT_SECRET || '',
  }),
  serveur: () => ({
    trustProxy: () => process.env.SERVEUR_TRUST_PROXY || '0',
    maxRequetesParMinute: () => {
      const maxEnChaine = process.env.SERVEUR_MAX_REQUETES_PAR_MINUTE || '600'
      const maxEnNombre = Number(maxEnChaine);
      if (isNaN(maxEnNombre)) {
        throw new Error(`SERVEUR_MAX_REQUETES_PAR_MINUTE n'est pas un nombre : ${maxEnChaine}`);
      } else {
        return maxEnNombre
      }
    },
  }),
};

export { adaptateurEnvironnement };
