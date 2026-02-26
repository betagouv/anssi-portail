import { Guide } from './guide';

export type Etat = 'ok' | 'ko';

type SanteDocumentGuide = {
  nom: string;
  etat: Etat;
};
type TailleImage = '234' | '588' | 'origine';

type SanteImagesGuide = Record<TailleImage, Etat>;

type SanteGuide = {
  images: SanteImagesGuide;
  id: string;
  documents: SanteDocumentGuide[];
};

export type ServiceSanteGuides = {
  calculeSante: (guides: Guide[]) => {
    guidesAvecProbleme: SanteGuide[];
    guidesEnBonneSante: SanteGuide[];
  };
};

export const fabriqueServiceSanteGuides = (): ServiceSanteGuides => {
  return {
    calculeSante: (guides: Guide[]) => {
      return {
        guidesAvecProbleme: [],
        guidesEnBonneSante: guides.map((guide) => ({
          id: guide.id,
          documents: guide.documents.map((document) => ({
            nom: document.nomFichier,
            etat: 'ok',
          })),
          images: {
            '234': 'ok',
            '588': 'ok',
            origine: 'ok',
          },
        })),
      };
    },
  };
};
