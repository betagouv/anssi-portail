import { Request } from 'express';
import { BusEvenements } from '../../bus/busEvenements.js';
import { EntrepotUtilisateur } from '../../metier/entrepotUtilisateur.js';
import { MotifChangementParcours, Parcours } from '../../metier/parcours.js';
import { Suivi } from '../../metier/suivi.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

const construitLeSuiviDepuisLaRequête = (requête: Request): Suivi | undefined => {
  const campagne = (requête.query.campagne || requête.query.mtm_campaign || requête.query.utm_campaign) as
    | string
    | undefined;
  const source = requête.query.pageSource as string | undefined;
  if (!campagne && !source) return undefined;

  return {
    ...(campagne && { campagne }),
    ...(source && { source }),
  };
};

export const fabriqueAttributionParcours =
  ({
    entrepotUtilisateur,
    busEvenements,
  }: {
    entrepotUtilisateur: EntrepotUtilisateur;
    busEvenements: BusEvenements;
  }): GestionnaireRequêtesComplémentaires['attributionParcours'] =>
  (parcours: Parcours) =>
  async (requête, _réponse, suite) => {
    const motif: MotifChangementParcours = requête.originalUrl.startsWith('/mesures')
      ? 'visite-page-mesure'
      : 'visite-page-module';
    const utilisateur = requête.utilisateur as Utilisateur;
    const suivi = construitLeSuiviDepuisLaRequête(requête);
    await utilisateur.rejoinsParcours(parcours, busEvenements, motif, suivi);
    await entrepotUtilisateur.metsAJour(utilisateur);
    suite();
  };
