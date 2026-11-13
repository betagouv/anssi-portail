import { stockageDeSession, type StockageDeSession } from '../utils/stockageDeSession';

type Traitement = () => void;

const clés = {
  mesure: 'mesure-prise-en-compte',
  premièreMesure: 'premiere-mesure-prise-en-compte',
  dixMesures: '10-mesures-prises-en-compte',
  badgeDébloqué: 'badge-cyberdepart-debloque',
  moduleTerminé: 'module-termine',
  parcoursCompletTerminé: 'parcours-complet-termine',
} as const;

type Clé = (typeof clés)[keyof typeof clés];

export const créeÉvènementsDuParcours = (
  fournitStockage: () => StockageDeSession | undefined = () =>
    typeof window === 'undefined' ? undefined : stockageDeSession
) => {
  const publie = (clé: Clé) => {
    try {
      fournitStockage()?.setItem(clé, 'true');
    } catch {
      // Une erreur du stockage de session ne doit pas interrompre la navigation après validation de la mesure.
    }
  };

  const traite = (clé: Clé, traitement: Traitement) => {
    try {
      const stockage = fournitStockage();
      if (!stockage || stockage.getItem(clé) !== 'true') return;
      stockage.supprimeItem(clé);
    } catch {
      return;
    }
    traitement();
  };

  return {
    publieMesurePriseEnCompte: () => publie(clés.mesure),
    traiteMesurePriseEnCompte: (traitement: Traitement) => traite(clés.mesure, traitement),

    publiePremièreMesurePriseEnCompte: () => publie(clés.premièreMesure),
    traitePremièreMesurePriseEnCompte: (traitement: Traitement) => traite(clés.premièreMesure, traitement),

    publieDixMesuresPrisesEnCompteParcoursComplet: () => publie(clés.dixMesures),
    traiteDixMesuresPrisesEnCompteParcoursComplet: (traitement: Traitement) => traite(clés.dixMesures, traitement),

    publieBadgeCyberdépartDébloqué: () => publie(clés.badgeDébloqué),
    traiteBadgeCyberdépartDébloqué: (traitement: Traitement) => traite(clés.badgeDébloqué, traitement),

    publieModuleTerminé: () => {
      try {
        const stockage = fournitStockage();
        if (!stockage || stockage.getItem(clés.parcoursCompletTerminé) === 'true') return;
        stockage.setItem(clés.moduleTerminé, 'true');
      } catch {
        return;
      }
    },
    traiteModuleTerminé: (traitement: Traitement) => traite(clés.moduleTerminé, traitement),

    publieParcoursCompletTerminé: () => {
      try {
        const stockage = fournitStockage();
        if (!stockage) return;
        stockage.setItem(clés.parcoursCompletTerminé, 'true');
        stockage.supprimeItem(clés.moduleTerminé);
      } catch {
        return;
      }
    },
    traiteParcoursCompletTerminé: (traitement: Traitement) => traite(clés.parcoursCompletTerminé, traitement),
  };
};

export const évènementsDuParcours = créeÉvènementsDuParcours();
