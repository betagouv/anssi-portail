import { Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { fabriqueGestionnaireRessourceCellar, gereDocumentManquantSimplement } from '../gestionnaireRessourceCellar';

export const ressourceDocumentGuide = ({ cellar, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  const documentGuideManquant = async (reponse: Response, nomDuDocument: string) => {
    const guides = await entrepotGuide.tous();
    const guideTrouve = guides.find((guide) => guide.nomsAnciensDocuments.includes(nomDuDocument));
    if (guideTrouve) {
      reponse.redirect(301, `/guides/${guideTrouve.id}`);
    } else {
      gereDocumentManquantSimplement(reponse);
    }
  };

  routeur.get('/:slug', fabriqueGestionnaireRessourceCellar(cellar, 'GUIDES', documentGuideManquant));

  return routeur;
};
