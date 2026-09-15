import { BusEvenements } from '../../../bus/busEvenements.js';
import { SimulationRéflexesCyberRéponseSoumise } from '../../../bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { SimulationRéflexesCyberTerminé } from '../../../bus/evenements/simulationReflexesCyberTermine.js';

export class RéflexesCyber {
  private readonly NUMÉRO_ÉVÉNEMENT_FIN_SIMULATION = 6;
  consommeLaRéponse = async ({
    busÉvénements,
    idCorrélation,
    idScénario,
    idRôle,
    numéroÉvènement,
    réflexe,
  }: {
    busÉvénements: BusEvenements;
    idCorrélation: string;
    idScénario: 'entreprise' | 'collectivité';
    idRôle: 'direction' | 'si' | 'communication' | 'juridique' | 'rh' | 'relations';
    numéroÉvènement: number;
    réflexe: 'bon' | 'mauvais' | 'aucun';
  }) => {
    await busÉvénements.publie(
      new SimulationRéflexesCyberRéponseSoumise({
        idCorrélation,
        idScénario,
        idRôle,
        numéroÉvènement,
        réflexe,
      })
    );
    if (numéroÉvènement === this.NUMÉRO_ÉVÉNEMENT_FIN_SIMULATION) {
      await busÉvénements.publie(
        new SimulationRéflexesCyberTerminé({
          idCorrélation,
          idScénario,
          idRôle,
        })
      );
    }
  };
}
