import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceConnexionOIDC = (configurationServeur: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete, reponse) => {
    const demandeAutorisation =
      await configurationServeur.adaptateurOIDC.genereDemandeAutorisation();

    const { url, state, nonce } = demandeAutorisation;
    reponse.cookie(
      'AgentConnectInfo',
      { state, nonce },
      { httpOnly: true, secure: true, maxAge: 120000, sameSite: 'none' }
    );

    reponse.redirect(url);
  });
  return routeur;
};

export { ressourceConnexionOIDC };
