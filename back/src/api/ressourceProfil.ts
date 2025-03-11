import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { ResultatRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

const ressourceProfil = ({adaptateurJWT, adaptateurRechercheEntreprise}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (requete: Request, reponse: Response) => {
    reponse.send({
      nom: requete.session!.nom,
      prenom: requete.session!.prenom,
      email: requete.session!.email,
      siret: requete.session!.siret,
    });
  });

  routeur.get('/verification-token-creation-compte', async (requete: Request, reponse: Response) => {
    const { token } = requete.query;
    try {
      if(!token) throw new Error('Token manquant');
      const informationsUtilisateur = adaptateurJWT.decode(token as string);

      let organisation: ResultatRechercheEntreprise | undefined;
      if(informationsUtilisateur.siret) {
        organisation = (await adaptateurRechercheEntreprise.rechercheOrganisations(informationsUtilisateur.siret, null))[0];
      }

      reponse.send({
        prenom: informationsUtilisateur.prenom,
        nom: informationsUtilisateur.nom,
        email: informationsUtilisateur.email,
        ...(organisation && { organisation })
      });
    } catch(e) {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceProfil };
