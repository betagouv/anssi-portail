import { CodeRegion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { EvenementDuBus } from '../busEvenements.js';

export class SimulationRéflexesCyberTerminé implements EvenementDuBus {
  readonly idCorrélation: string;
  readonly idScénario: 'entreprise' | 'collectivité';
  readonly idRôle: 'direction' | 'si' | 'communication' | 'juridique' | 'rh' | 'relations';
  readonly email?: string;
  readonly codeRegion?: CodeRegion;
  readonly codeSecteur?: CodeSecteur;
  readonly codeTrancheEffectif?: CodeTrancheEffectif;
  constructor({
    idCorrélation,
    idScénario,
    idRôle,
    email,
    codeRegion,
    codeSecteur,
    codeTrancheEffectif,
  }: {
    idCorrélation: string;
    idScénario: 'entreprise' | 'collectivité';
    idRôle: 'direction' | 'si' | 'communication' | 'juridique' | 'rh' | 'relations';
    email?: string;
    codeRegion?: CodeRegion;
    codeSecteur?: CodeSecteur;
    codeTrancheEffectif?: CodeTrancheEffectif;
  }) {
    this.idCorrélation = idCorrélation;
    this.idScénario = idScénario;
    this.idRôle = idRôle;
    this.email = email;
    this.codeRegion = codeRegion;
    this.codeSecteur = codeSecteur;
    this.codeTrancheEffectif = codeTrancheEffectif;
  }
}
