import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur } from './fauxObjets';
import {
  AdaptateurRechercheEntreprise,
  ResultatRechercheEntreprise,
} from '../../src/infra/adaptateurRechercheEntreprise';
import assert from 'node:assert';

describe('quand requête GET sur `/api/annuaire/organisations`', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  it('aseptise les paramètres de la requête', async () => {
    let termeCherche;
    let departementCherche;
    const unAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
      rechercheOrganisations: async (
        terme: string,
        departement: string | null
      ) => {
        termeCherche = terme;
        departementCherche = departement;
        return [];
      },
    };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurRechercheEntreprise: unAdaptateurRechercheEntreprise,
    });

    await request(serveur).get(
      '/api/annuaire/organisations?recherche=ma>recherche&departement=33      '
    );

    assert.equal(termeCherche, 'ma&gt;recherche');
    assert.equal(departementCherche, '33');
  });

  it('retourne une erreur HTTP 400 si le terme de recherche est vide', async () => {
    const reponse = await request(serveur).get(
      '/api/annuaire/organisations?recherche=&departement=mon>departement'
    );
    assert.equal(reponse.status, 400);
  });

  it("retourne une erreur HTTP 400 si le département n'existe pas", async () => {
    const reponse = await request(serveur).get(
      '/api/annuaire/organisations?recherche=siret&departement=990'
    );
    assert.equal(reponse.status, 400);
  });

  it("recherche les organisations correspondantes grâce au service d'annuaire", async () => {
    let adaptateurAppele = false;
    let termeCherche;
    let departementCherche;
    const unAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
      rechercheOrganisations: async (
        terme: string,
        departement: string | null
      ): Promise<ResultatRechercheEntreprise[]> => {
        adaptateurAppele = true;
        termeCherche = terme;
        departementCherche = departement;
        return [{ nom: 'un résultat', departement: '01', siret: '1234' }];
      },
    };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurRechercheEntreprise: unAdaptateurRechercheEntreprise,
    });

    await request(serveur).get(
      '/api/annuaire/organisations?recherche=marecherche&departement=01'
    );

    assert.equal(adaptateurAppele, true);
    assert.equal(termeCherche, 'marecherche');
    assert.equal(departementCherche, '01');
  });
});
