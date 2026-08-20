import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ParcoursAllégéTerminé } from '../bus/evenements/parcoursAllegeTermine.js';
import { ParcoursChangé } from '../bus/evenements/parcoursChange.js';
import { ParcoursRejoint } from '../bus/evenements/parcoursRejoint.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';

export const adaptateurEmailConsole = (): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({ email, prenom }: { email: string; prenom: string }) => {
    console.log(`Envoie d'email de bienvenue pour l'utilisateur ${email} avec prénom ${prenom}`);
  },
  creeContactBrevo: async ({ email, prenom, infoLettre }) => {
    console.log(`On crée le compte pour l'utilisateur ${email} avec prénom ${prenom} avec l'infolettre ${infoLettre}`);
  },
  inscrisAInfolettre: async (email: string) => {
    console.log(`On inscrit ${email} à l’infolettre`);
  },
  metsÀJourMesureConsultée: async (événement: MesureConsultee) => {
    console.log(`On signale que ${événement.email} a consulté la mesure ${événement.idMesure}`);
  },
  metsÀJourMesurePriseEnCompte: async (événement: MesurePriseEnCompte) => {
    console.log(`On signale que ${événement.email} a pris en compte la mesure ${événement.idMesure}`);
  },
  metsÀJourModuleTerminé: async (événement: ModuleTermine) => {
    console.log(`On signale que ${événement.email} a terminé le module ${événement.nomModule}`);
  },
  metsÀJourBadgeCyberdépartDébloqué: async (événement: BadgeCyberdépartDébloqué) => {
    console.log(`On signale que ${événement.email} a débloqué son badge cyberdépart`);
  },
  metsÀJourParcours: async (événement: ParcoursChangé | ParcoursRejoint) => {
    console.log(`On signale que ${événement.email} a changé/rejoint le parcours ${événement.parcours}`);
  },
  metsÀJourParcoursAllégéTerminé: async (événement: ParcoursAllégéTerminé) => {
    console.log(`On signale que ${événement.email} a terminé le parcours allégé`);
  },
});
