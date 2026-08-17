import { Request, Response } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { fabriqueAttributionParcoursMesure } from '../../../src/api/middlewares/attributionParcoursMesure.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { ConstructeurDeMesure } from '../mesures/constructeurDeMesure.js';
import { fabriqueModuleCyberdépart, mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';
import { Parcours } from '../../../src/metier/parcours.js';
import { ConstructeurDeModule } from '../mesures/constructeurDeModule.js';

describe("Le middleware d'attribution de parcours par mesure", () => {
  let entrepotMesure: EntrepotMesureMemoire;
  let entrepôtModule: EntrepôtModuleMémoire;

  beforeEach(() => {
    entrepotMesure = new EntrepotMesureMemoire();
    entrepôtModule = new EntrepôtModuleMémoire();
  });
  it("n'attribut pas de parcours si l'id de mesure est invalide", async () => {
    let attributionParcoursAppellé = false;
    const attributionParcours = () => async () => {
      attributionParcoursAppellé = true;
    };

    const attributionParcoursMesure = fabriqueAttributionParcoursMesure({
      entrepotMesure,
      entrepôtModule,
      attributionParcours,
    });

    const requête = {
      params: {
        id: 'fauxId',
      },
    } as Partial<Request>;
    await attributionParcoursMesure(requête as Request, {} as Response, () => {});

    assert.equal(attributionParcoursAppellé, false);
  });

  it("n'attribut pas de parcours si la mesure n'appartient à aucun module", async () => {
    let attributionParcoursAppellé = false;
    const attributionParcours = () => async () => {
      attributionParcoursAppellé = true;
    };
    const mesure = new ConstructeurDeMesure().avecLId('AUTH.5').construis();
    await entrepotMesure.ajoute(mesure);
    const attributionParcoursMesure = fabriqueAttributionParcoursMesure({
      entrepotMesure,
      entrepôtModule,
      attributionParcours,
    });

    const requête = {
      params: {
        id: mesure.id,
      },
    } as Partial<Request>;
    await attributionParcoursMesure(requête as Request, {} as Response, () => {});

    assert.equal(attributionParcoursAppellé, false);
  });

  it('attribut le parcours allégé si la mesure est dans le module Cyberdépart', async () => {
    let attributionParcoursAppellé = '';
    const attributionParcours = (parcours: Parcours) => async () => {
      attributionParcoursAppellé = parcours;
    };
    const moduleCyberdépart = fabriqueModuleCyberdépart();
    const mesure = mesureAuthentA2Etapes();
    moduleCyberdépart.mesures = [mesure];
    await entrepotMesure.ajoute(mesure);
    await entrepôtModule.ajoute(moduleCyberdépart);
    const attributionParcoursMesure = fabriqueAttributionParcoursMesure({
      entrepotMesure,
      entrepôtModule,
      attributionParcours,
    });

    const requête = {
      params: {
        id: mesure.id,
      },
    } as Partial<Request>;
    await attributionParcoursMesure(requête as Request, {} as Response, () => {});

    assert.equal(attributionParcoursAppellé, 'allégé');
  });

  it("attribut le parcours complet si la mesure n'est pas dans le module Cyberdépart", async () => {
    let attributionParcoursAppellé = '';
    const attributionParcours = (parcours: Parcours) => async () => {
      attributionParcoursAppellé = parcours;
    };
    const module = new ConstructeurDeModule().avecLId(4).construis();
    const mesure = mesureAuthentA2Etapes();
    module.mesures = [mesure];
    await entrepotMesure.ajoute(mesure);
    await entrepôtModule.ajoute(module);
    const attributionParcoursMesure = fabriqueAttributionParcoursMesure({
      entrepotMesure,
      entrepôtModule,
      attributionParcours,
    });

    const requête = {
      params: {
        id: mesure.id,
      },
    } as Partial<Request>;
    await attributionParcoursMesure(requête as Request, {} as Response, () => {});

    assert.equal(attributionParcoursAppellé, 'complet');
  });
});
