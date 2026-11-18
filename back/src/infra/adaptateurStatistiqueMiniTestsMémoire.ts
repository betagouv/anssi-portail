import { AdaptateurStatistiqueMiniTests } from '../metier/mini-tests/adaptateurStatistiqueMiniTests.js';

export class AdaptateurStatistiqueMiniTestsMémoire implements AdaptateurStatistiqueMiniTests {
  async nombreDeMiniTestsRéalisés() {
    return {
      vraiFaux: 12000,
      exposition: 1780,
      reflexesCyber: 5678,
      hameconnage: 3456,
    };
  }
}
