import { AdaptateurCellar } from '../infra/adaptateurCellar';
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
  enBonneSante: () => boolean;
  avecProbleme: () => boolean;
};

export type ServiceSanteGuides = {
  calculeSante: (guides: Guide[]) => Promise<{
    guidesAvecProbleme: SanteGuide[];
    guidesEnBonneSante: SanteGuide[];
  }>;
};

export const fabriqueServiceSanteGuides = (
  adaptateurCellar: AdaptateurCellar
): ServiceSanteGuides => {
  return {
    calculeSante: async (guides: Guide[]) => {
      const tousLesGuides = await Promise.all(
        guides.map(async (guide) => {
          const documents = await Promise.all(
            guide.documents.map(async (document) => {
              const etat = await adaptateurCellar.existe(
                document.nomFichier,
                'GUIDES'
              );
              return {
                nom: document.nomFichier,
                etat: (etat ? 'ok' : 'ko') as Etat,
              };
            })
          );

          return {
            id: guide.id,
            documents,
            images: {
              '234': 'ok' as Etat,
              '588': 'ok' as Etat,
              origine: 'ok' as Etat,
            },
            enBonneSante: () => documents.every((d) => d.etat === 'ok'),
            avecProbleme: () => documents.some((d) => d.etat === 'ko'),
          };
        })
      );

      return {
        guidesAvecProbleme: tousLesGuides.filter((g) => g.avecProbleme()),
        guidesEnBonneSante: tousLesGuides.filter((g) => g.enBonneSante()),
      };
    },
  };
};
