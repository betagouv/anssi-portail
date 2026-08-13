import { MesureConsultee } from '../../bus/evenements/mesureConsultee.js';
import { IdMesure } from '../../metier/mesure.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

export const publieMesureConsultée: GestionnaireRequêtesComplémentaires['publieMesureConsultée'] =
  ({ busEvenements }: ConfigurationServeur) =>
  async (requête, _réponse, suite) => {
    if (new IdMesure(requête.params.id as string).estValide() && requête.utilisateur?.emailHache()) {
      const evt = new MesureConsultee(requête.params.id as string, requête.utilisateur?.emailHache());
      busEvenements.publie(evt);
    }
    suite();
  };
