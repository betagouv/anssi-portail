import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Module } from '../../src/metier/module.js';

describe('Le module', () => {
  it('ne devrait pas renvoyer de cible déblocage badge pour un module autre que Cyberdépart', () => {
    const moduleAutreQueCyberdépart = new Module(2, 'Autre module que Cyberdépart');

    const cible = moduleAutreQueCyberdépart.cibleDéblocageBadgeCyberdépart();

    assert.equal(cible, undefined);
  });
});
