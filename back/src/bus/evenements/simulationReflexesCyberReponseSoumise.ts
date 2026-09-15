import { Réflexe, Rôle, Scénario } from '../../metier/mini-tests/reflexes-cyber/reflexesCyber.js';
import { CodeRegion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { EvenementDuBus } from '../busEvenements.js';

export class SimulationRéflexesCyberRéponseSoumise implements EvenementDuBus {
  readonly idCorrélation: string;
  readonly idScénario: Scénario;
  readonly idRôle: Rôle;
  readonly numéroÉvènement: number;
  readonly réflexe: Réflexe;
  readonly email?: string;
  readonly codeRegion?: CodeRegion;
  readonly codeSecteur?: CodeSecteur;
  readonly codeTrancheEffectif?: CodeTrancheEffectif;
  constructor({
    idCorrélation,
    idScénario,
    idRôle,
    numéroÉvènement,
    réflexe,
    email,
    codeRegion,
    codeSecteur,
    codeTrancheEffectif,
  }: {
    idCorrélation: string;
    idScénario: Scénario;
    idRôle: Rôle;
    numéroÉvènement: number;
    réflexe: Réflexe;
    email?: string;
    codeRegion?: CodeRegion;
    codeSecteur?: CodeSecteur;
    codeTrancheEffectif?: CodeTrancheEffectif;
  }) {
    this.idCorrélation = idCorrélation;
    this.idScénario = idScénario;
    this.idRôle = idRôle;
    this.numéroÉvènement = numéroÉvènement;
    this.réflexe = réflexe;
    this.email = email;
    this.codeRegion = codeRegion;
    this.codeSecteur = codeSecteur;
    this.codeTrancheEffectif = codeTrancheEffectif;
  }
}
