import { AdaptateurStatistiqueMiniTests } from '../../src/metier/adaptateurStatistiqueMiniTests.js';

export class AdaptateurStatistiqueMiniTestsMémoire implements AdaptateurStatistiqueMiniTests {
  async nombreDeMiniTestsRéalisés() {
    return {
      vraiFaux: 0,
    };
  }
}
