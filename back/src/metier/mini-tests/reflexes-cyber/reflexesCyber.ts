import { BusEvenements } from '../../../bus/busEvenements.js';
import { SimulationRéflexesCyberRéponseSoumise } from '../../../bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { SimulationRéflexesCyberTerminé } from '../../../bus/evenements/simulationReflexesCyberTermine.js';
import { CodeRegion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '../../utilisateur.js';

export type Scénario = 'entreprise' | 'collectivité';
export type Rôle = 'direction' | 'si' | 'communication' | 'juridique' | 'rh' | 'relations';
export type Réflexe = 'bon' | 'mauvais' | 'aucun';

export class RéflexesCyber {
  private readonly NUMÉRO_ÉVÉNEMENT_FIN_SIMULATION = 6;
  consommeLaRéponse = async ({
    busÉvénements,
    idCorrélation,
    idScénario,
    idRôle,
    numéroÉvènement,
    réflexe,
    utilisateur,
  }: {
    busÉvénements: BusEvenements;
    idCorrélation: string;
    idScénario: Scénario;
    idRôle: Rôle;
    numéroÉvènement: number;
    réflexe: Réflexe;
    utilisateur?: Utilisateur;
  }) => {
    let email: string | undefined;
    let codeRegion: CodeRegion | undefined;
    let codeSecteur: CodeSecteur | undefined;
    let codeTrancheEffectif: CodeTrancheEffectif | undefined;

    if (utilisateur) {
      email = utilisateur.email;
      codeRegion = await utilisateur.codeRegion();
      codeSecteur = await utilisateur.codeSecteur();
      codeTrancheEffectif = await utilisateur.codeTrancheEffectif();
    }
    await busÉvénements.publie(
      new SimulationRéflexesCyberRéponseSoumise({
        idCorrélation,
        idScénario,
        idRôle,
        numéroÉvènement,
        réflexe,
        email,
        codeRegion,
        codeSecteur,
        codeTrancheEffectif,
      })
    );
    if (numéroÉvènement === this.NUMÉRO_ÉVÉNEMENT_FIN_SIMULATION) {
      await busÉvénements.publie(
        new SimulationRéflexesCyberTerminé({
          idCorrélation,
          idScénario,
          idRôle,
          email,
          codeRegion,
          codeSecteur,
          codeTrancheEffectif,
        })
      );
    }
  };
}
