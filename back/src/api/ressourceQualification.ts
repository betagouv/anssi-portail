import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceQualification = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get('/:slug', async (requete: Request, reponse: Response) => {
    const tampon = await cellar.get(`/qualifications/${requete.params.slug}`);
    reponse.contentType('application/pdf').status(200).send(tampon);
  });

  return routeur;
};
export { ressourceQualification };
