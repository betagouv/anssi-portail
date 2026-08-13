import { BusEvenements } from '../../bus/busEvenements.js';
import { EntrepotUtilisateur } from '../../metier/entrepotUtilisateur.js';
import { Parcours } from '../../metier/parcours.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

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
    const utilisateur = requête.utilisateur as Utilisateur;
    await utilisateur.rejoinsParcours(parcours, busEvenements);
    await entrepotUtilisateur.metsAJour(utilisateur);
    suite();
  };
