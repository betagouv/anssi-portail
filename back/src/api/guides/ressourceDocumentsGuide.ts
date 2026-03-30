import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import multer from 'multer';
import { ConfigurationServeur } from '../configurationServeur';
import { valideCorpsRequete } from '../zod';
import { schemaAjoutDocumentGuide } from './ressourceDocumentsGuide.schema';

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

const ressourceDocumentsGuide = ({
  adaptateurHachage,
  entrepotGestionGuide,
  entrepotUtilisateur,
  middleware,
  cellar,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:slug/documents',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideLesDocuments(),
    valideCorpsRequete(schemaAjoutDocumentGuide),
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        if (!requete.utilisateur || !requete.utilisateur.peutAjouterUnDocumentAUnGuide()) {
          return reponse.status(403).json({
            erreur: "Vous n'êtes pas autorisé à ajouter un document",
          });
        }

        const identifiantGuide = requete.params.slug as string;
        const guide = await entrepotGestionGuide.parId(identifiantGuide);
        if (!guide) {
          return reponse.status(404).json({
            erreur: `Le guide "${identifiantGuide}" est introuvable`,
          });
        }

        const fichier = requete.file!; // Le fichier est forcément présent àa ce stade, car validé par "valideLesDocuments()"
        await cellar.depose(
          {
            contenu: fichier.buffer,
            nom: fichier.originalname,
            typeDeContenu: fichier.mimetype,
          },
          'GESTION_GUIDES'
        );

        await entrepotGestionGuide.ajouteDocument(identifiantGuide, fichier.originalname, requete.body.libelleDuLien);

        reponse.status(201).send();
      } catch (err) {
        suite(err);
      }
    }
  );

  return routeur;
};

export { ressourceDocumentsGuide };
