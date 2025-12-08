import { AdaptateurEnvironnement } from '../../infra/adaptateurEnvironnement';
import { Guide } from '../../metier/guide';

export const guidePresentation =
  (adaptateurEnvironnement: AdaptateurEnvironnement) => (guide: Guide) => ({
    ...guide,
    nomImage: undefined,
    image: guide.nomImage
      ? {
          petite: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-588.avif`,
          grande: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-origine.avif`,
        }
      : null,
    documents: guide.documents.map((document) => ({
      libelle: document.libelle,
      url: `${adaptateurEnvironnement.urlBaseMSC()}/documents-guides/${document.nomFichier}`,
    })),
  });
