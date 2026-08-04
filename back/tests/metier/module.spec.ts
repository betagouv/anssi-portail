import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ConstructeurDeModule } from '../api/mesures/constructeurDeModule.js';

describe('Le module', () => {
  it('ne devrait pas renvoyer de cible déblocage badge pour un module autre que Cyberdépart', () => {
    const moduleAutreQueCyberdépart = new ConstructeurDeModule()
      .avecLId(2)
      .avecLeNom('Autre module que Cyberdépart')
      .construis();

    const cible = moduleAutreQueCyberdépart.cibleDéblocageBadgeCyberdépart();

    assert.equal(cible, undefined);
  });
});
