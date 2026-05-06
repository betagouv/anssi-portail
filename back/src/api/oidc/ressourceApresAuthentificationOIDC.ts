import { Router } from 'express';
import { UtilisateurConnecte } from '../../bus/evenements/utilisateurConnecte';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const ressourceApresAuthentificationOIDC = ({
  adaptateurOIDC,
  adaptateurJWT,
  entrepotUtilisateur,
  fournisseurChemin,
  adaptateurHachage,
  busEvenements,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete, reponse) => {
      if (!requete.cookies.AgentConnectInfo) {
        reponse.sendStatus(401);
        return;
      }

      try {
        const { accessToken, idToken, connexionAvecMFA } = await adaptateurOIDC.recupereJeton(requete);
        const informationsUtilisateur = await adaptateurOIDC.recupereInformationsUtilisateur(accessToken);
        const { email } = informationsUtilisateur;

        const emailHache = adaptateurHachage.hache(email);
        const utilisateur = await entrepotUtilisateur.parEmailHache(emailHache);

        if (!utilisateur) {
          const token = adaptateurJWT.genereToken(informationsUtilisateur);
          reponse.redirect(`/creation-compte?token=${token}`);
          return;
        }

        if (!connexionAvecMFA && utilisateur.peutManipulerLesDocumentsDUnGuide()) {
          return reponse.sendStatus(403);
        }

        requete.session = { ...requete.session, ...informationsUtilisateur };
        requete.session.token = adaptateurJWT.genereToken({ email });
        requete.session.AgentConnectIdToken = idToken;
        reponse.envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('apres-authentification'));

        await busEvenements.publie(new UtilisateurConnecte(emailHache, connexionAvecMFA));
      } catch {
        reponse.sendStatus(401);
      }
    })
  );
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
