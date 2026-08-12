import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ConstructeurDeModule } from '../api/mesures/constructeurDeModule.js';
import { fabriqueModuleCyberdépart } from '../api/objetsPretsALEmploi.js';

describe('Le module', () => {
  it('ne devrait pas renvoyer de cible déblocage badge pour un module autre que Cyberdépart', () => {
    const moduleAutreQueCyberdépart = new ConstructeurDeModule()
      .avecLId(2)
      .avecLeNom('Autre module que Cyberdépart')
      .construis();

    const cible = moduleAutreQueCyberdépart.cibleDéblocageBadgeCyberdépart();

    assert.equal(cible, undefined);
  });
  describe("reconnait s'il est le module Cyberdépart", () => {
    it("et l'indique lorqu'il l'est", () => {
      const moduleCyberDépart = fabriqueModuleCyberdépart();

      const estCyberdépart = moduleCyberDépart.estCyberdépart();

      assert.equal(estCyberdépart, true);
    });

    it("et l'indique lorqu'il ne l'est pas", () => {
      const module = new ConstructeurDeModule().construis();

      const estCyberdépart = module.estCyberdépart();

      assert.equal(estCyberdépart, false);
    });
  });
});
