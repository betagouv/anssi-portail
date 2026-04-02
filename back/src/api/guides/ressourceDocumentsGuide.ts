import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import multer from 'multer';
import { EntrepotGuideTravail } from '../../metier/entrepotGuideTravail';
import { Guide } from '../../metier/guide';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideRequete } from '../zod';
import { schemaAjoutDocumentGuide } from './ressourceDocumentsGuide.schema';

const valideAutorisation = (): RequestHandler => {
  return async (requete: Request, reponse: Response, suite: NextFunction) => {
    if (!requete.utilisateur || !requete.utilisateur.peutManipulerLesDocumentsDUnGuide()) {
      return reponse.status(403).json({
        erreur: "Vous n'êtes pas autorisé à ajouter un document",
      });
    }
    return suite();
  };
};

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

const recupereLeGuide = (entrepotGuideTravail: EntrepotGuideTravail) => {
  return async (requete: Request, reponse: Response, suite: NextFunction) => {
    const identifiantGuide = requete.params.slug as string;
    const guide = await entrepotGuideTravail.parId(identifiantGuide);
    if (!guide) {
      return reponse.status(404).json({
        erreur: `Le guide "${identifiantGuide}" est introuvable`,
      });
    }
    reponse.locals.guide = guide;
    suite();
  };
};

const ressourceDocumentsGuide = ({
  adaptateurHachage,
  entrepotGuideTravail,
  entrepotUtilisateur,
  middleware,
  cellar,
  generateurImage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug/documents',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideAutorisation(),
    recupereLeGuide(entrepotGuideTravail),
    filetRouteAsynchrone(async (_requete, reponse) => {
      const guide = reponse.locals.guide as Guide;
      reponse.status(200).send(guide.listeDocuments ?? []);
    })
  );

  routeur.post(
    '/:slug/documents',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideAutorisation(),
    valideLesDocuments(),
    valideRequete(schemaAjoutDocumentGuide),
    recupereLeGuide(entrepotGuideTravail),
    filetRouteAsynchrone(async (requete, reponse) => {
      const fichier = requete.file!; // Le fichier est forcément présent à ce stade, car validé par "valideLesDocuments()"
      await cellar.depose(
        { contenu: fichier.buffer, nom: fichier.originalname, typeDeContenu: fichier.mimetype },
        'GESTION_GUIDES'
      );

      const identifiantGuide = reponse.locals.guide.id as string;
      if (requete.body.genereVisuel === 'true') {
        const imageOrigine = await generateurImage.depuisPdf(fichier.buffer);
        const image588 = await generateurImage.depuisPdf(fichier.buffer, { largeur: 588 });
        await cellar.depose(
          { contenu: imageOrigine, nom: `${identifiantGuide}/origine.avif`, typeDeContenu: 'image/avif' },
          'GESTION_GUIDES'
        );
        await cellar.depose(
          { contenu: image588, nom: `${identifiantGuide}/588.avif`, typeDeContenu: 'image/avif' },
          'GESTION_GUIDES'
        );
      }

      await entrepotGuideTravail.ajouteDocument(identifiantGuide, fichier.originalname, requete.body.libelleDuLien);

      reponse.status(201).send();
    })
  );

  return routeur;
};

export { ressourceDocumentsGuide };
