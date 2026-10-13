import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import { Express } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';

export const configureLesCookies = (app: Express, configurationServeur: ConfigurationServeur) => {
  app.use(
    cookieSession({
      name: 'session',
      sameSite: true,
      secret: configurationServeur.adaptateurEnvironnement.secrets().cookie(),
      secure: configurationServeur.adaptateurEnvironnement.nodeEnv() !== 'developpement',
      signed: configurationServeur.adaptateurEnvironnement.nodeEnv() !== 'developpement',
    })
  );

  app.use(cookieParser());
};
