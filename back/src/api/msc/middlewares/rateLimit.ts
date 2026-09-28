import { Express } from 'express';
import { IpFilter } from 'express-ipfilter';
import rateLimit from 'express-rate-limit';
import { fabriqueCleRateLimit } from '../../clefRateLimit.js';
import { ConfigurationServeur } from '../../configurationServeur.js';

const UNE_MINUTE = Temporal.Duration.from({ minutes: 1 });

export const configureLeRateLimit = (app: Express, configurationServeur: ConfigurationServeur) => {
  const limiteRequetesParMinuteGlobal = rateLimit({
    windowMs: UNE_MINUTE.total('milliseconds'),
    limit: configurationServeur.reseau.maxRequetesParMinutes,
    keyGenerator: fabriqueCleRateLimit(configurationServeur.reseau.trustProxy),
  });
  const limiteRequetesParMinuteAPI = rateLimit({
    windowMs: UNE_MINUTE.total('milliseconds'),
    limit: configurationServeur.reseau.maxRequetesParMinuteAPI,
    keyGenerator: fabriqueCleRateLimit(configurationServeur.reseau.trustProxy),
  });
  app.set('trust proxy', configurationServeur.reseau.trustProxy);

  app.use(limiteRequetesParMinuteGlobal);
  app.use('/api', limiteRequetesParMinuteAPI);
  app.use('/oidc', limiteRequetesParMinuteAPI);

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
