import { Request, Response, Router } from 'express';
import { BusEvenements } from '../bus/busEvenements';
import { MesureConsultee } from '../bus/evenements/mesureConsultee';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { corpsVide, valideCorpsRequete } from './zod';

function publieMesureConsultee(nomPage: string, requete: Request, busEvenements: BusEvenements) {
  if (
    'mesures' === nomPage &&
    /[A-Z_]{1,20}\.[0-9]{1,2}/.test(requete.params.id as string) &&
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
