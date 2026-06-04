import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';
import { MesureConsultee } from '../bus/evenements/mesureConsultee';
import { BusEvenements } from '../bus/busEvenements';

function publieMesureConsultee(nomPage: string, requete: Request, busEvenements: BusEvenements) {
  if (
    'mesures' === nomPage &&
    /[A-Z_]{1,20}\.[0-9]{1,2}/.test(requete.params.id as string) &&
    requete.utilisateur?.emailHache
  ) {
    const evt = new MesureConsultee(requete.params.id as string, requete.utilisateur?.emailHache);
    busEvenements.publie(evt);
  }
}

const ressourcePagesJekyll = (
  { fournisseurChemin, middleware, entrepotUtilisateur, adaptateurHachage, busEvenements }: ConfigurationServeur,
  nomPage: string
): Router => {
  const routeur = Router({ mergeParams: true });

  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    (requete: Request, reponse: Response) => {
      publieMesureConsultee(nomPage, requete, busEvenements);
      reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll(nomPage));
    }
  );

  return routeur;
};
export { ressourcePagesJekyll };
