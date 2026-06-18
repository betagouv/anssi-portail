import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { Organisation, Utilisateur } from '../../src/metier/utilisateur';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets';
import { utilisateurDeTest } from '../api/mesures/constructeurDUtilisateur';
import { mesureAuthentA2Etapes } from '../api/objetsPretsALEmploi';
import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte';
import { EntrepotPriseEnCompteMemoire } from '../persistance/EntrepotPriseEnCompteMemoire';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte';
import { mesureDeTest } from '../api/mesures/constructeurDeMesure';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque';

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
          codeActivite: '62.01Z',
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
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
        return [
          {
            nom: 'tif',
            departement: '01',
            siret: '98',
            codeTrancheEffectif: '01',
            codeRegion: 'FR-ARA',
            codeSecteur: 'D',
            estAssociation: false,
            estCollectivite: false,
            codeActivite: '62.01Z',
          },
        ];
      },
    };
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        organisation: undefined,
      },
      rechercheEntreprise,
      fauxAdaptateurHachage
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
          codeActivite: '62.01Z',
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
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
          codeActivite: '62.01Z',
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
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
          codeActivite: '62.01Z',
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    assert.equal(estAgentAnssi, true);
  });

  it('Peut ajouter un guide', () => {
    const utilisateur = new Utilisateur(
      {
        ...infosUtilisateur,
        roles: ['GESTION_GUIDES'],
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    assert.equal(utilisateur.peutManipulerLesDocumentsDUnGuide(), true);
  });

  describe('concernant la prise en compte des mesures', () => {
    const mesure = mesureAuthentA2Etapes();
    let utilisateurDeParcours: Utilisateur;
    let entrepotPriseEnCompte: EntrepotPriseEnCompte;
    let busEvenements: MockBusEvenement;

    beforeEach(() => {
      utilisateurDeParcours = utilisateurDeTest().avecLEmail('utilisateur@mail.com').construis();
      entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
      busEvenements = fabriqueBusPourLesTests();
    });

    it('publie un événement de completion quand toutes les mesures du module sont prises en compte', async () => {
      await utilisateurDeParcours.prendEnCompte(mesure, 1, 1, entrepotPriseEnCompte, busEvenements);

      busEvenements.aRecuUnEvenement(ModuleTermine);
      const evenement = busEvenements.recupereEvenement(ModuleTermine);

      assert.equal(evenement!.emailHache, 'utilisateur@mail.com-hache');
      assert.equal(evenement!.idModule, 1);
      assert.equal(evenement!.nomModule, 'Cyberdépart');
    });

    it("ne publie pas d'événement de completion si toutes les mesures du module ne sont pas prises en compte", async () => {
      await utilisateurDeParcours.prendEnCompte(mesure, 2, 1, entrepotPriseEnCompte, busEvenements);

      busEvenements.naPasRecuDEvenement(ModuleTermine);
    });

    it("ignore la prise en compte d'une mesure déjà prise en compte", async () => {
      await utilisateurDeParcours.prendEnCompte(mesure, 2, 1, entrepotPriseEnCompte, fabriqueBusPourLesTests());
      await utilisateurDeParcours.prendEnCompte(mesure, 2, 1, entrepotPriseEnCompte, busEvenements);

      assert.equal(utilisateurDeParcours.mesuresPrisesEnCompte.length, 1);
      busEvenements.naPasRecuDEvenement(ModuleTermine);
      busEvenements.naPasRecuDEvenement(MesurePriseEnCompte);
    });

    describe('du module Cyberdépart', () => {
      it('publie un événement de déblocage de badge', async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
          mesureDeTest().avecLId('mes3').construis(),
        ];
        await utilisateurDeParcours.prendEnCompte(mesure, 5, 1, entrepotPriseEnCompte, busEvenements);

        busEvenements.aRecuUnEvenement(BadgeCyberdépartDébloqué);
      });

      it("ne publie pas un événement de déblocage de badge s'il a déjà été débloqué", async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
          mesureDeTest().avecLId('mes3').construis(),
          mesureDeTest().avecLId('mes4').construis(),
        ];

        await utilisateurDeParcours.prendEnCompte(mesure, 5, 1, entrepotPriseEnCompte, busEvenements);

        busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué);
      });

      it("ne publie pas un événement de déblocage de badge si le seuil n'est pas atteint", async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
        ];

        await utilisateurDeParcours.prendEnCompte(mesure, 5, 1, entrepotPriseEnCompte, busEvenements);

        busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué);
      });
    });
  });
});
