import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceApresAuthentificationOIDC = (
  {adaptateurOIDC, adaptateurJWT, entrepotUtilisateur, fournisseurChemin}: ConfigurationServeur
) => {
  let routeur = Router();
  routeur.get('/', async (requete, reponse) => {
    if (!requete.cookies.AgentConnectInfo) {
      reponse.sendStatus(401);
      return;
    }

    try {
      let { accessToken, idToken } = await adaptateurOIDC.recupereJeton(
        requete
      );
      let informationsUtilisateur =
        await adaptateurOIDC.recupereInformationsUtilisateur(accessToken);
      const { email } = informationsUtilisateur;

      if (!(await entrepotUtilisateur.parEmail(email))) {
        const token = adaptateurJWT.genereToken(informationsUtilisateur);
        reponse.redirect(`/creation-compte?token=${token}`);
        return;
      }

      requete.session = { ...requete.session, ...informationsUtilisateur };
      requete.session.token =
        adaptateurJWT.genereToken({ email });
      requete.session.AgentConnectIdToken = idToken;
      reponse.sendFile(
        fournisseurChemin.cheminPageJekyll(
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
