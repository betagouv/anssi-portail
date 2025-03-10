import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxAdaptateurRechercheEntreprise,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { fabriqueMiddleware } from '../../src/api/middleware';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import {
  AdaptateurRechercheEntreprise,
  ResultatRechercheEntreprise,
} from '../../src/infra/adaptateurRechercheEntreprise';
import assert from 'node:assert';

describe('quand requête GET sur `/api/annuaire/organisations`', () => {
  let serveur: Express;
  let configurationServeur: any;

  beforeEach(() => {
    configurationServeur = {
      fournisseurChemin: fauxFournisseurDeChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
      adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
      entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
    };
    serveur = creeServeur(configurationServeur);
  });

  it('aseptise les paramètres de la requête', async (done) => {
    let termeCherche;
    let departementCherche;
    let unAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
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
      ...configurationServeur,
      adaptateurRechercheEntreprise: unAdaptateurRechercheEntreprise,
    });

    await request(serveur).get(
      '/api/annuaire/organisations?recherche=ma>recherche&departement=33      '
    );

    assert.equal(termeCherche, 'ma&gt;recherche');
    assert.equal(departementCherche, '33');
  });

  it('retourne une erreur HTTP 400 si le terme de recherche est vide', async () => {
    let reponse = await request(serveur).get(
      '/api/annuaire/organisations?recherche=&departement=mon>departement'
    );
    assert.equal(reponse.status, 400);
  });

  it("retourne une erreur HTTP 400 si le département n'existe pas", async () => {
    let reponse = await request(serveur).get(
      '/api/annuaire/organisations?recherche=siret&departement=990'
    );
    assert.equal(reponse.status, 400);
  });

  it("recherche les organisations correspondantes grâce au service d'annuaire", async (done) => {
    let adaptateurAppele = false;
    let termeCherche;
    let departementCherche;
    let unAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
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
      ...configurationServeur,
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
