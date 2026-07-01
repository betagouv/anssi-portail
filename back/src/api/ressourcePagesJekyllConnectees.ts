import { Request, Response, Router } from 'express';
import { BusEvenements } from '../bus/busEvenements.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { IdMesure } from '../metier/mesure.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

function publieMesureConsultee(nomPage: string, requete: Request, busEvenements: BusEvenements) {
  if (
    'mesures' === nomPage &&
    new IdMesure(requete.params.id as string).estValide() &&
    requete.utilisateur?.emailHache()
  ) {
    const evt = new MesureConsultee(requete.params.id as string, requete.utilisateur?.emailHache());
    busEvenements.publie(evt);
  }
}

const ressourcePagesJekyllConnectees = (
  { fournisseurChemin, middleware, busEvenements, entrepotUtilisateur, adaptateurHachage }: ConfigurationServeur,
  nomPage: string
): Router => {
  const routeur = Router({ mergeParams: true });

  routeur.get(
    '/',
    middleware.verifieJWTNavigation,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      publieMesureConsultee(nomPage, requete, busEvenements);
      reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll(nomPage));
    })
  );

  return routeur;
};
export { ressourcePagesJekyllConnectees };
