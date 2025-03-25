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
    trustProxy: () => {
      const trustProxyEnChaine = process.env.SERVEUR_TRUST_PROXY || '0';
      const trustProxyEnNombre = Number(trustProxyEnChaine);
      if (isNaN(trustProxyEnNombre)) {
        console.warn(
          `Attention ! SERVEUR_TRUST_PROXY positionné à ${trustProxyEnChaine}`
        );
        return trustProxyEnChaine;
      } else {
        return trustProxyEnNombre;
      }
    },
    maxRequetesParMinute: () => {
      const maxEnChaine = process.env.SERVEUR_MAX_REQUETES_PAR_MINUTE || '600'
      const maxEnNombre = Number(maxEnChaine);
      if (isNaN(maxEnNombre)) {
        throw new Error(`SERVEUR_MAX_REQUETES_PAR_MINUTE n'est pas un nombre : ${maxEnChaine}`);
      } else {
        return maxEnNombre
      }
    },
    ipAutorisees: () => process.env.SERVEUR_ADRESSES_IP_AUTORISEES?.split(',') ?? false,
  }),
  sentry: () => ({
    dsn: () => process.env.SENTRY_DSN,
    environnement: () => process.env.SENTRY_ENVIRONNEMENT,
  }),
};

export { adaptateurEnvironnement };
