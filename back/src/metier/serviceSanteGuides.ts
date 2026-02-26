import { Guide } from './guide';

export type ServiceSanteGuides = {
  calculeSante: (guides: Guide[]) => {
    guidesAvecProbleme: any[];
    guidesEnBonneSante: any[];
  };
};

export const fabriqueServiceSanteGuides = (): ServiceSanteGuides => {
  return {
    calculeSante: () => {
      return {
        guidesAvecProbleme: [],
        guidesEnBonneSante: [],
      };
    },
  };
};
