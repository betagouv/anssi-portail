import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { UtilisateurConnecte } from '../../bus/evenements/utilisateurConnecte';

const ressourceApresAuthentificationOIDC = ({
  adaptateurOIDC,
  adaptateurJWT,
  entrepotUtilisateur,
  fournisseurChemin,
  adaptateurHachage,
  busEvenements,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (requete, reponse) => {
    if (!requete.cookies.AgentConnectInfo) {
      reponse.sendStatus(401);
      return;
    }

    try {
      const { accessToken, idToken, connexionAvecMFA } =
        await adaptateurOIDC.recupereJeton(requete);
      const informationsUtilisateur =
        await adaptateurOIDC.recupereInformationsUtilisateur(accessToken);
      const { email } = informationsUtilisateur;

      const emailHache = adaptateurHachage.hache(email);
      const utilisateurExiste = await entrepotUtilisateur.existe(emailHache);
      if (!utilisateurExiste) {
        const token = adaptateurJWT.genereToken(informationsUtilisateur);
        reponse.redirect(`/creation-compte?token=${token}`);
        return;
      }

      requete.session = { ...requete.session, ...informationsUtilisateur };
      requete.session.token = adaptateurJWT.genereToken({ email });
      requete.session.AgentConnectIdToken = idToken;
      reponse.sendFileAvecNonce(
        fournisseurChemin.cheminPageJekyll('apres-authentification')
      );

      await busEvenements.publie(
        new UtilisateurConnecte(emailHache, connexionAvecMFA)
      );
    } catch {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
