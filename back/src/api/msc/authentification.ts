import { Express } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { ressourceApresAuthentificationOIDC } from '../oidc/ressourceApresAuthentificationOIDC.js';
import { ressourceApresDeconnexionOIDC } from '../oidc/ressourceApresDeconnexionOIDC.js';
import { ressourceConnexionOIDC } from '../oidc/ressourceConnexionOIDC.js';
import { ressourceDeconnexionOIDC } from '../oidc/ressourceDeconnexionOIDC.js';
import { ressourcePageConnexion } from '../ressourcePageConnexion.js';
import { enregistreRouteDansExpress } from './enregistreRoutes.js';

export const configureLAuthentification = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = enregistreRouteDansExpress(app);
  enregistreRoute('/connexion', ressourcePageConnexion(configurationServeur));
  enregistreRoute('/oidc/connexion', ressourceConnexionOIDC(configurationServeur));
  enregistreRoute('/oidc/apres-authentification', ressourceApresAuthentificationOIDC(configurationServeur));
  enregistreRoute('/oidc/deconnexion', ressourceDeconnexionOIDC(configurationServeur));
  enregistreRoute('/oidc/apres-deconnexion', ressourceApresDeconnexionOIDC());
};
