import { AdaptateurEnvironnement } from '../../infra/adaptateurEnvironnement';
import { Guide } from '../../metier/guide';

export const guidePresentation = (adaptateurEnvironnement: AdaptateurEnvironnement) => (guide: Guide) => ({
  ...guide,
  nomImage: undefined,
  image: {
    petite: `/documents-guides/${guide.id}/588.avif`,
    grande: `/documents-guides/${guide.id}/origine.avif`,
  },
  documents: guide.listeDocuments.map((document) => ({
    libelle: document.libelle,
    url: `${adaptateurEnvironnement.urlBaseMSC()}/documents-guides/${document.nomFichier}`,
  })),
});
