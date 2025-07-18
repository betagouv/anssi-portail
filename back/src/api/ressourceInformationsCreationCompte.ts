import { Request, Response, Router } from 'express';
import { ResultatRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { ConfigurationServeur } from './configurationServeur';

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

      const profilAnssi = await adaptateurProfilAnssi.recupere(
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
        ...(organisation && {
          organisation: {
            departement: organisation.departement,
            nom: organisation.nom,
            siret: organisation.siret,
          },
        }),
        ...profilAnssi,
        domainesSpecialite: profilAnssi?.domainesSpecialite,
      });
    } catch {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceInformationsCreationCompte };
