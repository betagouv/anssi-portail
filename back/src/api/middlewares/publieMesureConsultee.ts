import { BusEvenements } from '../../bus/busEvenements.js';
import { MesureConsultee } from '../../bus/evenements/mesureConsultee.js';
import { IdMesure } from '../../metier/mesure.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

export const fabriquePublieMesureConsultée =
  ({ busEvenements }: { busEvenements: BusEvenements }): GestionnaireRequêtesComplémentaires['publieMesureConsultée'] =>
  async (requête, _réponse, suite) => {
    if (new IdMesure(requête.params.id as string).estValide() && requête.utilisateur?.emailHache()) {
      const evt = new MesureConsultee(requête.params.id as string, requête.utilisateur?.emailHache());
      busEvenements.publie(evt);
    }
    suite();
  };
