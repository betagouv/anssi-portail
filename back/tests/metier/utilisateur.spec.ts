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
import { ConstructeurDeModule } from '../api/mesures/constructeurDeModule.js';
import { utilisateurDeTest } from '../api/mesures/constructeurDUtilisateur.js';
import { fabriqueModuleCyberdépart, mesureAuthentA2Etapes } from '../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotPriseEnCompteMemoire } from '../persistance/EntrepotPriseEnCompteMemoire.js';
import { Module } from '../../src/metier/module.js';
import { ParcoursRejoint } from '../../src/bus/evenements/parcoursRejoint.js';
import { ParcoursChangé } from '../../src/bus/evenements/parcoursChange.js';
import { ParcoursAllégéTerminé } from '../../src/bus/evenements/parcoursAllegeTermine.js';

describe("L'utilisateur", () => {
  const infosUtilisateur = {
    email: 'jeanne@chezelle.fr',
    prenom: 'Jeanne',
    nom: 'Dupont',
    siretEntite: '1234',
    cguAcceptees: true,
    domainesSpecialite: ['a'],
    infolettreAcceptee: false,
    pixelDeSuiviAccepté: false,
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

  describe('du parcours de sécurisation', () => {
    let utilisateurDeParcours: Utilisateur;
    const mesure = mesureAuthentA2Etapes();
    let entrepotPriseEnCompte: EntrepotPriseEnCompte;
    let busEvenements: MockBusEvenement;

    beforeEach(() => {
      utilisateurDeParcours = utilisateurDeTest().avecLEmail('utilisateur@mail.com').construis();
      entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
      busEvenements = fabriqueBusPourLesTests();
    });

    describe('concernant la prise en compte des mesures', () => {
      it("ignore la prise en compte d'une mesure déjà prise en compte", async () => {
        await utilisateurDeParcours.prendEnCompte(
          mesure,
          entrepotPriseEnCompte,
          fabriqueBusPourLesTests(),
          fabriqueModuleCyberdépart()
        );
        await utilisateurDeParcours.prendEnCompte(
          mesure,
          entrepotPriseEnCompte,
          busEvenements,
          fabriqueModuleCyberdépart()
        );

        assert.equal(utilisateurDeParcours.mesuresPrisesEnCompte.length, 1);
        busEvenements.naPasRecuDEvenement(ModuleTermine);
        busEvenements.naPasRecuDEvenement(MesurePriseEnCompte);
      });

      describe('du module Cyberdépart', () => {
        let moduleCyberdépart: Module;
        beforeEach(() => {
          moduleCyberdépart = fabriqueModuleCyberdépart();
        });

        it('publie un événement de déblocage de badge', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
          ];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().construis(),
          ];
          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          assert.equal(busEvenements.aRecuUnEvenement(BadgeCyberdépartDébloqué), true);
        });

        it('signale que la prise en compte debloque le badge Cyberdépart', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
          ];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
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

          const moduleCyberdépart = fabriqueModuleCyberdépart();
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().avecLId('mes4').construis(),
          ];

          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          assert.equal(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué), true);
        });

        it("ne publie pas un événement de déblocage de badge si le seuil n'est pas atteint", async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
          ];

          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().avecLId('mes4').construis(),
          ];

          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          assert.equal(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué), true);
        });

        it('publie les totaux lors du déblocage du badge', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
          ];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().construis(),
          ];
          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          const evenement = busEvenements.recupereEvenement(BadgeCyberdépartDébloqué);
          assert.equal(evenement!.nombreMesuresActuel, 4);
          assert.equal(evenement!.nombreMesuresTotal, 5);
        });

        it('ne prends en compte que les mesures du module Cyberdépart pour le déblocage du badge', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('MESURE1').construis(),
            mesureDeTest().avecLId('MESURE2').construis(),
            mesureDeTest().avecLId('MESURE3').construis(),
          ];

          moduleCyberdépart.mesures = [
            mesureDeTest().avecLId('AUTH.1').construis(),
            mesureDeTest().avecLId('AUTH.2').construis(),
            mesureDeTest().avecLId('AUTH.3').construis(),
            mesureDeTest().avecLId('AUTH.4').construis(),
            mesureDeTest().avecLId('AUTH.5').construis(),
          ];
          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          assert.equal(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué), true);
        });

        it('rejoins le parcours basique', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          const mesureCyberdépart = mesureDeTest().avecLId('AUTH.1').construis();
          moduleCyberdépart.mesures = [mesureCyberdépart];
          await utilisateurDeParcours.prendEnCompte(
            mesureCyberdépart,
            entrepotPriseEnCompte,
            busEvenements,
            moduleCyberdépart
          );

          const evenement = busEvenements.recupereEvenement(ParcoursRejoint);

          assert.equal(utilisateurDeParcours.parcoursActuel(), 'allégé');
          assert.equal(evenement?.email, utilisateurDeParcours.email);
          assert.equal(evenement?.parcours, 'allégé');
          assert.equal(evenement?.motif, 'prise-en-compte-mesure');
        });

        it("ne rejoins pas le parcours basique s'il est déjà en parcours complet", async () => {
          const utilisateur = utilisateurDeTest()
            .avecLEmail('utilisateur@mail.com')
            .avecLeParcours('complet')
            .construis();
          utilisateur.mesuresPrisesEnCompte = [];

          const mesureCyberdépart = mesureDeTest().avecLId('AUTH.1').construis();
          moduleCyberdépart.mesures = [mesureCyberdépart];
          await utilisateur.prendEnCompte(mesureCyberdépart, entrepotPriseEnCompte, busEvenements, moduleCyberdépart);

          assert.equal(utilisateur.parcoursActuel(), 'complet');
          assert.equal(busEvenements.naPasRecuDEvenement(ParcoursRejoint), true);
          assert.equal(busEvenements.naPasRecuDEvenement(ParcoursChangé), true);
        });

        it('publie un événement d');
      });

      describe("d'un module autre que Cyberdépart", () => {
        it('rejoins le parcours complet', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          const module = new ConstructeurDeModule().construis();
          const mesure = mesureDeTest().avecLId('AUTH.1').construis();
          module.mesures = [mesure];

          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, module);

          assert.equal(utilisateurDeParcours.parcoursActuel(), 'complet');
        });

        it("rejoins le parcours complet s'il est déjà en parcours basique", async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');
          const module = new ConstructeurDeModule().construis();
          const mesure = mesureDeTest().avecLId('AUTH.1').construis();
          module.mesures = [mesure];

          await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, module);

          const evenement = busEvenements.recupereEvenement(ParcoursChangé);
          assert.equal(utilisateurDeParcours.parcoursActuel(), 'complet');
          assert.equal(evenement?.email, utilisateurDeParcours.email);
          assert.equal(evenement?.parcoursPrécédent, 'allégé');
          assert.equal(evenement?.parcours, 'complet');
          assert.equal(evenement?.motif, 'prise-en-compte-mesure');
        });
      });
    });

    describe('concernant la complétion du module', () => {
      it('signale que la prise en compte termine le module', async () => {
        const moduleCyberDépart = fabriqueModuleCyberdépart();
        moduleCyberDépart.mesures = [mesure];

        const nouvelÉtatDuModule = await utilisateurDeParcours.prendEnCompte(
          mesure,
          entrepotPriseEnCompte,
          busEvenements,
          moduleCyberDépart
        );

        assert.equal(nouvelÉtatDuModule.moduleTerminé, true);
      });

      it('publie un événement de completion quand toutes les mesures du module sont prises en compte', async () => {
        const moduleCyberDépart = fabriqueModuleCyberdépart();
        moduleCyberDépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberDépart);

        busEvenements.aRecuUnEvenement(ModuleTermine);
        const evenement = busEvenements.recupereEvenement(ModuleTermine);

        assert.equal(evenement!.email, 'utilisateur@mail.com');
        assert.equal(evenement!.idModule, 1);
        assert.equal(evenement!.nomModule, 'Cyberdépart');
        assert.equal(evenement!.parcours, 'allégé');
      });

      it('publie un événement de fin de parcours allégé quand toutes les mesures du module Cyberdépart sont prises en compte', async () => {
        const moduleCyberDépart = fabriqueModuleCyberdépart();
        moduleCyberDépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberDépart);

        const evenement = busEvenements.recupereEvenement(ParcoursAllégéTerminé);

        assert.equal(evenement?.email, 'utilisateur@mail.com');
      });

      it("ne publie pas un événement de fin de parcours allégé si l'utilisateur n'est pas en parcours allégé", async () => {
        const moduleCyberDépart = fabriqueModuleCyberdépart();
        moduleCyberDépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('complet', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberDépart);

        assert.equal(busEvenements.naPasRecuDEvenement(ParcoursAllégéTerminé), true);
      });

      it("adapte l'événement de complétion au module", async () => {
        const moduleGénérique = new ConstructeurDeModule().avecLId(3).avecLeNom('ModuleGénérique').construis();
        const mesure = mesureDeTest().avecLId('MESURE').construis();
        moduleGénérique.mesures = [mesure];

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleGénérique);

        const evenement = busEvenements.recupereEvenement(ModuleTermine);
        assert.equal(evenement!.idModule, 3);
        assert.equal(evenement!.nomModule, 'ModuleGénérique');
      });

      it("ne publie pas d'événement de completion si toutes les mesures du module ne sont pas prises en compte", async () => {
        const moduleCyberDépart = fabriqueModuleCyberdépart();
        moduleCyberDépart.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];

        await utilisateurDeParcours.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, moduleCyberDépart);

        assert.equal(busEvenements.naPasRecuDEvenement(ModuleTermine), true);
      });

      it('ne compte que les prises en compte du module', async () => {
        const module = new ConstructeurDeModule().avecLId(2).construis();
        const derniereMesureDuModule2 = mesureDeTest().avecLId('MESURE2').construis();
        module.mesures = [derniereMesureDuModule2];
        utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('MESURE3').construis()];

        await utilisateurDeParcours.prendEnCompte(
          derniereMesureDuModule2,
          entrepotPriseEnCompte,
          busEvenements,
          module
        );

        assert.equal(busEvenements.aRecuUnEvenement(ModuleTermine), true);
      });
    });

    it('indique le nombre des mesures prises en compte dans un module', () => {
      const module = new ConstructeurDeModule().construis();
      const mesures = [mesureDeTest().construis(), mesureDeTest().construis()];
      module.mesures = mesures;
      utilisateurDeParcours.mesuresPrisesEnCompte = mesures;

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      assert.equal(nombreDeMesuresPrisesEnCompte, 2);
    });

    it("indique le nombre des mesures prises en compte dans un module lorsqu'il n'y en a pas", () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      assert.equal(nombreDeMesuresPrisesEnCompte, 0);
    });

    it('indique le nombre des mesures prises en compte dans un module sans tenir compte des mesures des autres modules', () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [];
      utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      assert.equal(nombreDeMesuresPrisesEnCompte, 0);
    });

    it('compare les ids des mesures prises en compte', () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesureDeTest().avecLId('TEST').construis()];
      utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('TEST').construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      assert.equal(nombreDeMesuresPrisesEnCompte, 1);
    });
  });
});
