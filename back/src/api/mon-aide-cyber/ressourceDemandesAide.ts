import cors from 'cors';
import { Router } from 'express';
import { encode } from 'html-entities';
import z from 'zod';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideCorpsRequete } from '../zod';
import { schemaRessourceDemandesAide } from './ressourceDemandesAide.schema';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceDemandesAide = ({ adaptateurMonAideCyber }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.options('/', cors());
  routeur.post(
    '/',
    cors(),
    valideCorpsRequete(schemaRessourceDemandesAide),
    filetRouteAsynchrone(async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceDemandesAide>>, reponse) => {
      try {
        const { emailAidant, identifiantAidant, siretAidant, entiteAidee, origine } = requete.body;
        const { email, departement, raisonSociale, siret } = entiteAidee;
        // suite à la suppression de l'aseptisation, on force un encodage pour garder des données consistantes envoyées à Mon Aide Cyber
        await adaptateurMonAideCyber.creeDemandeAide({
          ...(origine && { origine }),
          aidant: {
            ...(emailAidant && { email: encode(emailAidant) }),
            ...(identifiantAidant && { identifiant: identifiantAidant }),
            ...(siretAidant && { siret: siretAidant }),
          },
          entiteAidee: {
            email: encode(email),
            departement,
            raisonSociale: encode(raisonSociale),
            siret,
          },
        });
        reponse.sendStatus(201);
      } catch (e: unknown | Error) {
        reponse.status(400).send({ erreur: (e as Error).message });
      }
    })
  );
  return routeur;
};

export { ressourceDemandesAide };
