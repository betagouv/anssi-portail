import { ConfigurationServeur } from './configurationServeur';
import { Response, Request, Router } from 'express';
import { ResultatRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

const ressourceInformationsCreationCompte = ({adaptateurJWT, adaptateurRechercheEntreprise}: ConfigurationServeur) => {
  const routeur = Router();
 

  routeur.get('/', async (requete: Request, reponse: Response) => {
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

export { ressourceInformationsCreationCompte };
