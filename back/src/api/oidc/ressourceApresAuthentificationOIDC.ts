import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceApresAuthentificationOIDC = (
  configurationServeur: ConfigurationServeur
) => {
  let routeur = Router();
  routeur.get('/', async (requete, reponse) => {
    const { adaptateurOIDC } = configurationServeur;
    let { accessToken } = await adaptateurOIDC.recupereJeton(requete);
    let informationsUtilisateur =
      await adaptateurOIDC.recupereInformationsUtilisateur(accessToken);
    requete.session! = { ...requete.session!, ...informationsUtilisateur };
    reponse.sendFile(
      configurationServeur.fournisseurChemin.cheminPageJekyll(
        'apres-authentification'
      )
    );
  });
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
