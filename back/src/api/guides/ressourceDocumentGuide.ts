import { Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { fabriqueGestionnaireRessourceCellar, gereDocumentManquantSimplement } from '../gestionnaireRessourceCellar.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { HttpStatusCode } from '@anssi-portail/axios';

export const ressourceDocumentGuide = ({ cellar, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  const documentGuideManquant = async (reponse: Response, nomDuDocument: string) => {
    const guides = await entrepotGuide.tous();
    const guideTrouve = guides.find((guide) => guide.nomsAnciensDocuments.includes(nomDuDocument));
    if (guideTrouve) {
      reponse.redirect(HttpStatusCode.MovedPermanently, `/guides/${guideTrouve.id}`);
    } else {
      gereDocumentManquantSimplement(reponse);
    }
  };

  routeur.get(
    '/*slug',
    valideCorpsRequete(corpsVide),
    fabriqueGestionnaireRessourceCellar(cellar, 'GUIDES', documentGuideManquant)
  );

  return routeur;
};
