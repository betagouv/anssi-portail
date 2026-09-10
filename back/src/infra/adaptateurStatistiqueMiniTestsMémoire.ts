import { AdaptateurStatistiqueMiniTests } from '../metier/adaptateurStatistiqueMiniTests.js';

export class AdaptateurStatistiqueMiniTestsMémoire implements AdaptateurStatistiqueMiniTests {
  async nombreDeMiniTestsRéalisés() {
    return {
      vraiFaux: 12000,
      exposition: 1780,
    };
  }
}
