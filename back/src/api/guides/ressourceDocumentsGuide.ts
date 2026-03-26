import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import multer from 'multer';
import { ConfigurationServeur } from '../configurationServeur';

const valideLesDocuments = (): RequestHandler => {
  return async (requete: Request, reponse: Response, suite: NextFunction) => {
    return multer({
      storage: multer.memoryStorage(),
    }).single('document-guide')(requete, reponse, (err) => {
      if (!requete.file) {
        return reponse.status(400).json({
          erreur: 'Document obligatoire',
        });
      }
      if (err && err instanceof multer.MulterError) {
        return reponse.status(400).json({
          erreur: 'Une erreur est survenue',
        });
      }
      return suite();
    });
  };
};

const ressourceDocumentsGuide = (_: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:slug/documents',
    valideLesDocuments(),
    async (_requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        reponse.status(201).send();
      } catch (err) {
        suite(err);
      }
    }
  );

  return routeur;
};

export { ressourceDocumentsGuide };
