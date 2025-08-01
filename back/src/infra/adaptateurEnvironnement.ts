type AdaptateurEnvironnement = {
  urlBaseMSC: () => string;
  oidc: () => {
    urlRedirectionApresAuthentification: () => string;
    urlRedirectionApresDeconnexion: () => string;
    urlBase: () => string;
    clientId: () => string;
    clientSecret: () => string;
  };
  serveur: () => {
    trustProxy: () => string | number;
    maxRequetesParMinute: () => number;
    ipAutorisees: () => false | string[];
  };
  sentry: () => {
    dsn: () => string | undefined;
    environnement: () => string | undefined;
  };
  crisp: () => {
    idArticle: (id: string) => string | undefined;
  };
  hachage: () => {
    tousLesSecretsDeHachage: () => { version: number; secret: string }[];
  };
  maintenance: () => {
    actif: () => boolean;
    detailsPreparation: () => string | undefined;
  };
  chiffrement: () => {
    cleChaCha20Hex: () => string;
  };
  repartition: () => {
    nombreMinimumDeResultats: () => number;
  };
  mattermost: () => {
    webhookRetourExperience: () => string | undefined;
    webhookAvisUtilisateur: () => string | undefined;
  };
};

const adaptateurEnvironnement: AdaptateurEnvironnement = {
  urlBaseMSC: () => process.env.URL_BASE_MSC || '',
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
      const maxEnChaine = process.env.SERVEUR_MAX_REQUETES_PAR_MINUTE || '600';
      const maxEnNombre = Number(maxEnChaine);
      if (isNaN(maxEnNombre)) {
        throw new Error(
          `SERVEUR_MAX_REQUETES_PAR_MINUTE n'est pas un nombre : ${maxEnChaine}`
        );
      } else {
        return maxEnNombre;
      }
    },
    ipAutorisees: () =>
      process.env.SERVEUR_ADRESSES_IP_AUTORISEES?.split(',') ?? false,
  }),
  sentry: () => ({
    dsn: () => process.env.SENTRY_DSN,
    environnement: () => process.env.SENTRY_ENVIRONNEMENT,
  }),
  crisp: () => ({
    idArticle: (id: string) => {
      return process.env[`ARTICLE_${id}_ID`];
    },
  }),
  hachage: () => ({
    tousLesSecretsDeHachage: () => {
      type VersionDeSecret = {
        version: string;
        valeur: string;
      };
      return Object.entries(process.env)
        .map(([cle, valeur]) => {
          const matches = cle.match(/HACHAGE_SECRET_DE_HACHAGE_(\d+)/);
          const version = matches ? matches[1] : undefined;
          return { version, valeur };
        })
        .filter((objet): objet is VersionDeSecret => !!objet.version)
        .map(({ version, valeur }) => {
          if (!valeur) {
            throw new Error(
              `Le secret de hachage HACHAGE_SECRET_DE_HACHAGE_${version} ne doit pas être vide`
            );
          }
          return {
            version: parseInt(version, 10),
            secret: valeur,
          };
        })
        .sort(
          ({ version: version1 }, { version: version2 }) => version1 - version2
        );
    },
  }),
  maintenance: () => ({
    actif: () => process.env.MODE_MAINTENANCE === 'true',
    detailsPreparation: () => process.env.PREPARATION_MODE_MAINTENANCE,
  }),
  chiffrement: () => ({
    cleChaCha20Hex: () => {
      const cleHex = process.env.CHIFFREMENT_CHACHA20_CLE_HEX;
      if (!cleHex) {
        throw new Error(
          `La clé de chiffrement CHIFFREMENT_CHACHA20_CLE_HEX ne doit pas être vide`
        );
      }
      return cleHex;
    },
  }),
  repartition: () => ({
    nombreMinimumDeResultats: () => {
      const nombreMinimumDeResultats = Number(
        process.env.NOMBRE_MINIMUM_DE_RESULTATS_COMPARAISON || 50
      );
      if (!Number.isInteger(nombreMinimumDeResultats)) {
        throw new Error(
          `La limite NOMBRE_MINIMUM_DE_RESULTATS_COMPARAISON doit être un entier`
        );
      }
      return nombreMinimumDeResultats;
    },
  }),
  mattermost: () => ({
    webhookAvisUtilisateur: () =>
      process.env.WEBHOOK_MATTERMOST_AVIS_UTILISATEUR,
    webhookRetourExperience: () =>
      process.env.WEBHOOK_MATTERMOST_RETOURS_EXPERIENCE,
  }),
};

export { AdaptateurEnvironnement, adaptateurEnvironnement };
