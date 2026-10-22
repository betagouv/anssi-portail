import { Express } from 'express';
import { IpFilter } from 'express-ipfilter';
import rateLimit from 'express-rate-limit';
import { fabriqueCleRateLimit } from '../../clefRateLimit.js';
import { ConfigurationServeur } from '../../configurationServeur.js';

export const configureLeRateLimit = (app: Express, configurationServeur: ConfigurationServeur) => {
  const limiteRequêtesParMinuteGlobal = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinutes,
    keyGenerator: fabriqueCleRateLimit(configurationServeur.reseau.trustProxy),
  });
  const limiteRequêtesParMinuteAPI = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinuteAPI,
    keyGenerator: fabriqueCleRateLimit(configurationServeur.reseau.trustProxy),
  });
  const limiteRequêtesParMinuteRetoursUtilisateurs = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinuteRetoursUtilisateurs,
    keyGenerator: fabriqueCleRateLimit(configurationServeur.reseau.trustProxy),
  });
  app.set('trust proxy', configurationServeur.reseau.trustProxy);

  app.use(limiteRequêtesParMinuteGlobal);
  app.use('/api', limiteRequêtesParMinuteAPI);
  app.use('/oidc', limiteRequêtesParMinuteAPI);

  /* eslint-disable regles-eslint/route-sans-validation */
  app.post('/api/articles/:id/avis', limiteRequêtesParMinuteRetoursUtilisateurs);
  app.post('/api/mesures/:id/avis', limiteRequêtesParMinuteRetoursUtilisateurs);
  app.post('/api/outils/retours/:id', limiteRequêtesParMinuteRetoursUtilisateurs);
  app.post('/api/retour-mini-tests/:id', limiteRequêtesParMinuteRetoursUtilisateurs);
  /* eslint-enable regles-eslint/route-sans-validation */

  if (configurationServeur.reseau.ipAutorisees) {
    app.use(
      IpFilter(configurationServeur.reseau.ipAutorisees, {
        detectIp: (request) => {
          const forwardedFor = request.headers['x-forwarded-for'];
          if (typeof forwardedFor === 'string') {
            const ips = forwardedFor
              .split(',')
              .map((ip) => ip.trim())
              .filter((ip) => ip !== '');

            if (ips.length > 0) {
              const ipWaf = ips[ips.length - 1];
              return ipWaf;
            }
          }
          return 'interdire';
        },
        mode: 'allow',
        log: false,
      })
    );
  }
};
