import { Parcours } from '../../metier/parcours.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

export const attributionParcours: GestionnaireRequêtesComplémentaires['attributionParcours'] =
  ({ entrepotUtilisateur, busEvenements }: ConfigurationServeur) =>
  (parcours: Parcours) =>
  async (requête, _réponse, suite) => {
    const utilisateur = requête.utilisateur as Utilisateur;
    await utilisateur.rejoinsParcours(parcours, busEvenements);
    await entrepotUtilisateur.metsAJour(utilisateur);
    suite();
  };
