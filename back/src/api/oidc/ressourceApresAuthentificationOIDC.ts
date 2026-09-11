import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { UtilisateurConnecte } from '../../bus/evenements/utilisateurConnecte.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { garantitUnMFA } from './acr.js';

const ressourceApresAuthentificationOIDC = ({
  adaptateurEnvironnement,
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
        reponse.sendStatus(HttpStatusCode.Unauthorized);
        return;
      }

      try {
        const { accessToken, idToken, sujet, connexionAvecMFA, acr } = await adaptateurOIDC.recupereJeton(requete);
        if (!adaptateurEnvironnement.oidc().authentificationMultiFacteursDésactivée() && !garantitUnMFA(acr)) {
          return reponse.status(HttpStatusCode.Forbidden).json({
            erreur:
              'Accès refusé. Vous ne pouvez pas accéder à MesServicesCyber sans double authentification. Veuillez en activer une auprès de votre fournisseur d’identité, puis vous connecter à nouveau.',
          });
        }
        const informationsUtilisateur = await adaptateurOIDC.recupereInformationsUtilisateur(accessToken, sujet);
        const { email } = informationsUtilisateur;

        const emailHache = adaptateurHachage.hache(email);
        const utilisateurExiste = await entrepotUtilisateur.existe(emailHache);
        if (!utilisateurExiste) {
          const token = adaptateurJWT.genereToken(informationsUtilisateur);
          reponse.redirect(`/creation-compte?token=${token}`);
          return;
        }

        requete.session = { ...requete.session, ...informationsUtilisateur, connexionAvecMFA };
        requete.session.token = adaptateurJWT.genereToken({ email });
        requete.session.AgentConnectIdToken = idToken;
        await reponse.envoieFichierEnrichi(fournisseurChemin.jekyll.page('apres-authentification'));

        await busEvenements.publie(new UtilisateurConnecte(emailHache, connexionAvecMFA));
      } catch {
        reponse.sendStatus(HttpStatusCode.Unauthorized);
      }
    })
  );
  return routeur;
};

export { ressourceApresAuthentificationOIDC };
