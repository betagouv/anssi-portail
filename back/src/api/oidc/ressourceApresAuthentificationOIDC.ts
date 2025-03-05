import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceApresAuthentificationOIDC = (
  configurationServeur: ConfigurationServeur
) => {
  let routeur = Router();
  routeur.get('/', async (requete, reponse) => {
    if (!requete.cookies.AgentConnectInfo) {
      reponse.sendStatus(401);
      return;
    }

    try {
      const { adaptateurOIDC } = configurationServeur;
      let { accessToken, idToken } = await adaptateurOIDC.recupereJeton(
        requete
      );
      let informationsUtilisateur =
        await adaptateurOIDC.recupereInformationsUtilisateur(accessToken);

      requete.session = { ...requete.session, ...informationsUtilisateur };
      requete.session.token = configurationServeur.adaptateurJWT.genereToken(
        informationsUtilisateur.email
      );
      requete.session.AgentConnectIdToken = idToken;
      reponse.sendFile(
        configurationServeur.fournisseurChemin.cheminPageJekyll(
          'apres-authentification'
        )
      );
    } catch (e) {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
