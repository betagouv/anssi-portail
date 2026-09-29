import { AdaptateurStatistiqueParcours } from '../metier/adaptateurStatistiqueParcours.js';

export class AdaptateurStatistiqueParcoursMémoire implements AdaptateurStatistiqueParcours {
  nombreDeParcoursDémarrés = async () => 1234;
}
