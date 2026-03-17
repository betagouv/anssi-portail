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

export const fabriqueServiceSanteGuides = (adaptateurCellar: AdaptateurCellar): ServiceSanteGuides => {
  const booleanVersEtat = (valeur: boolean): Etat => (valeur ? 'ok' : 'ko');

  const santeDocuments = async (guide: Guide): Promise<SanteDocumentGuide[]> =>
    await Promise.all(
      guide.documents.map(async (document) => ({
        nom: document.nomFichier,
        etat: booleanVersEtat(await adaptateurCellar.existe(document.nomFichier, 'GUIDES')),
      }))
    );

  const etatImage = async (guide: Guide, format: string) =>
    booleanVersEtat(await adaptateurCellar.existe(`${guide.id}/${guide.nomImage}-${format}.avif`, 'GUIDES'));

  const tousOk = (objet: { [p: string]: Etat } | ArrayLike<Etat>) => Object.values(objet).every((v) => v === 'ok');

  const auMoinsUnKo = (objet: { [p: string]: Etat } | ArrayLike<Etat>) => Object.values(objet).some((v) => v === 'ko');

  return {
    calculeSante: async (guides: Guide[]) => {
      const tousLesGuides = await Promise.all(
        guides.map(async (guide) => {
          const documents = await santeDocuments(guide);

          const images = {
            '234': await etatImage(guide, '234'),
            '588': await etatImage(guide, '588'),
            origine: await etatImage(guide, 'origine'),
          };

          return {
            id: guide.id,
            documents,
            images,
            enBonneSante: () => tousOk(documents.map((d) => d.etat)) && tousOk(images),
            avecProbleme: () => auMoinsUnKo(documents.map((d) => d.etat)) || auMoinsUnKo(images),
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
