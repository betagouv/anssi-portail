import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque.js';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte.js';
import { Organisation, Utilisateur } from '../../src/metier/utilisateur.js';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets.js';
import { mesureDeTest } from '../api/mesures/constructeurDeMesure.js';
import { utilisateurDeTest } from '../api/mesures/constructeurDUtilisateur.js';
import { mesureAuthentA2Etapes, moduleCyberdépart } from '../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotPriseEnCompteMemoire } from '../persistance/EntrepotPriseEnCompteMemoire.js';

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
      moduleCyberdépart.mesures = [mesureDeTest().construis()];
      await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

      busEvenements.aRecuUnEvenement(ModuleTermine);
      const evenement = busEvenements.recupereEvenement(ModuleTermine);

      assert.equal(evenement!.emailHache, 'utilisateur@mail.com-hache');
      assert.equal(evenement!.idModule, 1);
      assert.equal(evenement!.nomModule, 'Cyberdépart');
    });

    it("ne publie pas d'événement de completion si toutes les mesures du module ne sont pas prises en compte", async () => {
      moduleCyberdépart.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];

      await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

      busEvenements.naPasRecuDEvenement(ModuleTermine);
    });

    it("ignore la prise en compte d'une mesure déjà prise en compte", async () => {
      await utilisateurDeParcours.prendEnCompte(
        mesure,
        entrepotPriseEnCompte,
        fabriqueBusPourLesTests(),
        moduleCyberdépart
      );
      await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

      assert.equal(utilisateurDeParcours.mesuresPrisesEnCompte.length, 1);
      busEvenements.naPasRecuDEvenement(ModuleTermine);
      busEvenements.naPasRecuDEvenement(MesurePriseEnCompte);
    });

    it('signale que la prise en compte termine le module', async () => {
      moduleCyberdépart.mesures = [mesureDeTest().construis()];

      const nouvelÉtatDuModule = await utilisateurDeParcours.prendEnCompte(
        mesure,
        entrepotPriseEnCompte,
        busEvenements,
        moduleCyberdépart
      );

      assert.equal(nouvelÉtatDuModule.moduleTerminé, true);
    });

    describe('du module Cyberdépart', () => {
      it('publie un événement de déblocage de badge', async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
          mesureDeTest().avecLId('mes3').construis(),
        ];
        moduleCyberdépart.mesures = [
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
        ];
        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

        busEvenements.aRecuUnEvenement(BadgeCyberdépartDébloqué);
      });

      it('signale que la prise en compte debloque le badge Cyberdépart', async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
          mesureDeTest().avecLId('mes3').construis(),
        ];
        moduleCyberdépart.mesures = [
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
          mesureDeTest().construis(),
        ];
        const nouvelÉtatDuModule = await utilisateurDeParcours.prendEnCompte(
          mesure,
          entrepotPriseEnCompte,
          busEvenements,
          moduleCyberdépart
        );

        assert.equal(nouvelÉtatDuModule.badgeCyberdépartDebloqué, true);
      });

      it("ne publie pas un événement de déblocage de badge s'il a déjà été débloqué", async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
          mesureDeTest().avecLId('mes3').construis(),
          mesureDeTest().avecLId('mes4').construis(),
        ];

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

        busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué);
      });

      it("ne publie pas un événement de déblocage de badge si le seuil n'est pas atteint", async () => {
        utilisateurDeParcours.mesuresPrisesEnCompte = [
          mesureDeTest().avecLId('mes1').construis(),
          mesureDeTest().avecLId('mes2').construis(),
        ];

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

        busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué);
      });
    });
  });
});
