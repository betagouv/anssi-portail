import { describe, it } from 'node:test';
import { Organisation, Utilisateur } from '../../src/metier/utilisateur';
import assert from 'node:assert';
import { fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';

describe("L'utilisateur", () => {
  const infosUtilisateur = {
    email: 'jeanne@chezelle.fr',
    prenom: 'Jeanne',
    nom: 'Dupont',
    siretEntite: '1234',
    cguAcceptees: true,
    domainesSpecialite: ['a'],
    infolettreAcceptee: false,
  };

  it("utilise l'organisation fournie en priorite", async () => {
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: new Organisation({
          nom: 'beta',
          departement: '33',
          siret: '1234',
        }),
      },
      fauxAdaptateurRechercheEntreprise
    );

    const organisation = await utilisateur.organisation();

    assert.equal(organisation.nom, 'beta');
    assert.equal(organisation.departement, '33');
    assert.equal(organisation.siret, '1234');
  });

  it("ne recherche qu'une seule fois dans l’API entreprise", async () => {
    let nombreRecherchesEntreprise = 0;
    const rechercheEntreprise: AdaptateurRechercheEntreprise = {
      rechercheOrganisations: async (_: string, __: string | null) => {
        nombreRecherchesEntreprise++;
        return [{ nom: 'tif', departement: '01', siret: '98' }];
      },
    };
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: undefined,
      },
      rechercheEntreprise
    );

    const organisation = await utilisateur.organisation();
    await utilisateur.organisation();

    assert.equal(organisation.nom, 'tif');
    assert.equal(organisation.departement, '01');
    assert.equal(organisation.siret, '98');
    assert.equal(1, nombreRecherchesEntreprise);
  });

  it("se décrit comme un agent ANSSI si son organisation est le siège social de l'ANSSI", async () => {
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: new Organisation({
          nom: 'ANSSI',
          departement: '75',
          siret: '13000766900018',
        }),
      },
      fauxAdaptateurRechercheEntreprise
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    assert.equal(estAgentAnssi, true);
  });

  it("se décrit comme un agent ANSSI si son organisation n'est pas l'ANSSI", async () => {
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: new Organisation({
          nom: 'ANSSI',
          departement: '75',
          siret: '2424242000023',
        }),
      },
      fauxAdaptateurRechercheEntreprise
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    assert.equal(estAgentAnssi, false);
  });

  it("se décrit comme un agent ANSSI si son organisation est un établissement de l'ANSSI", async () => {
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: new Organisation({
          nom: 'ANSSI',
          departement: '75',
          siret: '13000766912345',
        }),
      },
      fauxAdaptateurRechercheEntreprise
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    assert.equal(estAgentAnssi, true);
  });
});
