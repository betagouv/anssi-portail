import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { ResultatRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

const ressourceInformationsCreationCompte = ({
  adaptateurJWT,
  adaptateurRechercheEntreprise,
  adaptateurProfilAnssi,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/', async (requete: Request, reponse: Response) => {
    const { token } = requete.query;
    if (!token) reponse.sendStatus(401);
    try {
      const informationsUtilisateur = adaptateurJWT.decode(token as string);

      let organisation: ResultatRechercheEntreprise | undefined;

      let profilAnssi = await adaptateurProfilAnssi.recupere(
        informationsUtilisateur.email
      );

      if (!profilAnssi && informationsUtilisateur.siret) {
        organisation = (
          await adaptateurRechercheEntreprise.rechercheOrganisations(
            informationsUtilisateur.siret,
            null
          )
        )[0];
      }

      reponse.send({
        email: informationsUtilisateur.email,
        prenom: informationsUtilisateur.prenom,
        nom: informationsUtilisateur.nom,
        ...(organisation && { organisation }),
        ...profilAnssi,
        postes: profilAnssi?.domainesSpecialite,
      });
    } catch (e) {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceInformationsCreationCompte };
