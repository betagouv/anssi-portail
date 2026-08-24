import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ParcoursAllégéTerminé } from '../bus/evenements/parcoursAllegeTermine.js';
import { ParcoursChangé } from '../bus/evenements/parcoursChange.js';
import { ParcoursCompletTerminé } from '../bus/evenements/parcoursCompletTermine.js';
import { ParcoursRejoint } from '../bus/evenements/parcoursRejoint.js';

export interface AdaptateurEmail {
  envoieEmailBienvenue: ({ email, prenom }: { email: string; prenom: string }) => Promise<void>;
  creeContactBrevo: ({
    email,
    prenom,
    nom,
    infoLettre,
    pixelDeSuiviAccepté,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    pixelDeSuiviAccepté: boolean;
    telephone?: string;
  }) => Promise<void>;
  inscrisAInfolettre: (email: string) => Promise<void>;
  metsÀJourMesureConsultée: (événement: MesureConsultee) => Promise<void>;
  metsÀJourMesurePriseEnCompte: (événement: MesurePriseEnCompte) => Promise<void>;
  metsÀJourModuleTerminé: (événement: ModuleTermine) => Promise<void>;
  metsÀJourBadgeCyberdépartDébloqué: (événement: BadgeCyberdépartDébloqué) => Promise<void>;
  metsÀJourParcoursChangé: (événement: ParcoursChangé) => Promise<void>;
  metsÀJourParcoursRejoint: (événement: ParcoursRejoint) => Promise<void>;
  metsÀJourParcoursAllégéTerminé: (événement: ParcoursAllégéTerminé) => Promise<void>;
  metsÀJourParcoursCompletTerminé: (événement: ParcoursCompletTerminé) => Promise<void>;
}
