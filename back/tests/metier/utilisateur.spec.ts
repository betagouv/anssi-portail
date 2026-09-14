import { beforeEach, describe, it, expect } from 'vitest';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque.js';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine.js';
import { ParcoursAllégéTerminé } from '../../src/bus/evenements/parcoursAllegeTermine.js';
import { ParcoursChangé } from '../../src/bus/evenements/parcoursChange.js';
import { ParcoursCompletTerminé } from '../../src/bus/evenements/parcoursCompletTermine.js';
import { ParcoursRejoint } from '../../src/bus/evenements/parcoursRejoint.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte.js';
import { Module } from '../../src/metier/module.js';
import { Organisation, Utilisateur } from '../../src/metier/utilisateur.js';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets.js';
import { mesureDeTest } from '../api/mesures/constructeurDeMesure.js';
import { ConstructeurDeModule } from '../api/mesures/constructeurDeModule.js';
import { utilisateurDeTest } from '../api/mesures/constructeurDUtilisateur.js';
import { fabriqueModuleCyberdépart, mesureAuthentA2Etapes } from '../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';
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
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    const organisation = await utilisateur.organisation();

    expect(organisation.nom).toBe('beta');
    expect(organisation.departement).toBe('33');
    expect(organisation.siret).toBe('1234');
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

    expect(organisation.nom).toBe('tif');
    expect(organisation.departement).toBe('01');
    expect(organisation.siret).toBe('98');
    expect(1).toBe(nombreRecherchesEntreprise);
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
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    expect(estAgentAnssi).toBe(true);
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
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    expect(estAgentAnssi).toBe(false);
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
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
        }),
      },
      fauxAdaptateurRechercheEntreprise,
      fauxAdaptateurHachage
    );

    const estAgentAnssi = await utilisateur.estAgentAnssi();

    expect(estAgentAnssi).toBe(true);
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

    expect(utilisateur.peutManipulerLesDocumentsDUnGuide()).toBe(true);
  });

  describe('du parcours de sécurisation', () => {
    let utilisateurDeParcours: Utilisateur;
    const mesure = mesureAuthentA2Etapes();
    let entrepotPriseEnCompte: EntrepotPriseEnCompte;
    let entrepotMesure: EntrepotMesureMemoire;
    let busEvenements: MockBusEvenement;
    let paramètresPriseEnCompteDéfaut: Parameters<Utilisateur['prendEnCompte']>[0];
    let moduleCyberdépart: Module;

    beforeEach(() => {
      utilisateurDeParcours = utilisateurDeTest().avecLEmail('utilisateur@mail.com').construis();
      entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
      entrepotMesure = new EntrepotMesureMemoire();
      busEvenements = fabriqueBusPourLesTests();
      moduleCyberdépart = fabriqueModuleCyberdépart();
      paramètresPriseEnCompteDéfaut = {
        busEvenements,
        entrepotMesure,
        entrepotPriseEnCompte,
        mesure,
        module: moduleCyberdépart,
      };
    });

    describe('concernant la prise en compte des mesures', () => {
      it("ignore la prise en compte d'une mesure déjà prise en compte", async () => {
        await utilisateurDeParcours.prendEnCompte({
          ...paramètresPriseEnCompteDéfaut,
          busEvenements: fabriqueBusPourLesTests(),
        });
        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        expect(utilisateurDeParcours.mesuresPrisesEnCompte).toHaveLength(1);
        busEvenements.naPasRecuDEvenement(ModuleTermine);
        busEvenements.naPasRecuDEvenement(MesurePriseEnCompte);
      });

      describe('du module Cyberdépart', () => {
        it('publie un événement de déblocage de badge', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('mes1').construis()];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().construis(),
          ];
          await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

          expect(busEvenements.aRecuUnEvenement(BadgeCyberdépartDébloqué)).toBe(true);
        });

        it('signale que la prise en compte debloque le badge Cyberdépart', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('mes1').construis()];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().construis(),
          ];
          const nouvelÉtatDuModule = await utilisateurDeParcours.prendEnCompte({
            ...paramètresPriseEnCompteDéfaut,
            module: moduleCyberdépart,
          });

          expect(nouvelÉtatDuModule.badgeCyberdépartDebloqué).toBe(true);
        });

        it("ne publie pas un événement de déblocage de badge s'il a déjà été débloqué", async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().avecLId('mes4').construis(),
          ];

          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().avecLId('mes4').construis(),
          ];

          await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

          expect(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué)).toBe(true);
        });

        it("ne publie pas un événement de déblocage de badge si le seuil n'est pas atteint", async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];

          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().avecLId('mes4').construis(),
          ];

          await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

          expect(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué)).toBe(true);
        });

        it('publie les totaux lors du déblocage du badge', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('mes1').construis()];
          moduleCyberdépart.mesures = [
            mesure,
            mesureDeTest().avecLId('mes1').construis(),
            mesureDeTest().avecLId('mes2').construis(),
            mesureDeTest().avecLId('mes3').construis(),
            mesureDeTest().construis(),
          ];
          await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

          const evenement = busEvenements.recupereEvenement(BadgeCyberdépartDébloqué);
          expect(evenement!.nombreMesuresActuel).toBe(2);
          expect(evenement!.nombreMesuresTotal).toBe(5);
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
          await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

          expect(busEvenements.naPasRecuDEvenement(BadgeCyberdépartDébloqué)).toBe(true);
        });

        it('rejoins le parcours basique', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          const mesureCyberdépart = mesureDeTest().avecLId('AUTH.1').construis();
          moduleCyberdépart.mesures = [mesureCyberdépart];
          await utilisateurDeParcours.prendEnCompte({
            ...paramètresPriseEnCompteDéfaut,
            mesure: mesureCyberdépart,
            module: moduleCyberdépart,
          });

          const evenement = busEvenements.recupereEvenement(ParcoursRejoint);

          expect(utilisateurDeParcours.parcoursActuel()).toBe('allégé');
          expect(evenement?.email).toBe(utilisateurDeParcours.email);
          expect(evenement?.parcours).toBe('allégé');
          expect(evenement?.motif).toBe('prise-en-compte-mesure');
        });

        it("ne rejoins pas le parcours basique s'il est déjà en parcours complet", async () => {
          const utilisateur = utilisateurDeTest()
            .avecLEmail('utilisateur@mail.com')
            .avecLeParcours('complet')
            .construis();
          utilisateur.mesuresPrisesEnCompte = [];

          const mesureCyberdépart = mesureDeTest().avecLId('AUTH.1').construis();
          moduleCyberdépart.mesures = [mesureCyberdépart];
          await utilisateur.prendEnCompte({ ...paramètresPriseEnCompteDéfaut, mesure: mesureCyberdépart });

          expect(utilisateur.parcoursActuel()).toBe('complet');
          expect(busEvenements.naPasRecuDEvenement(ParcoursRejoint)).toBe(true);
          expect(busEvenements.naPasRecuDEvenement(ParcoursChangé)).toBe(true);
        });

        it.todo('publie un événement d');
      });

      describe("d'un module autre que Cyberdépart", () => {
        it('rejoins le parcours complet', async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          const module = new ConstructeurDeModule().construis();
          const mesure = mesureDeTest().avecLId('AUTH.1').construis();
          module.mesures = [mesure];

          await utilisateurDeParcours.prendEnCompte({ ...paramètresPriseEnCompteDéfaut, mesure, module });

          expect(utilisateurDeParcours.parcoursActuel()).toBe('complet');
        });

        it("rejoins le parcours complet s'il est déjà en parcours basique", async () => {
          utilisateurDeParcours.mesuresPrisesEnCompte = [];
          await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');
          const module = new ConstructeurDeModule().construis();
          const mesure = mesureDeTest().avecLId('AUTH.1').construis();
          module.mesures = [mesure];

          await utilisateurDeParcours.prendEnCompte({ ...paramètresPriseEnCompteDéfaut, mesure, module });

          const evenement = busEvenements.recupereEvenement(ParcoursChangé);
          expect(utilisateurDeParcours.parcoursActuel()).toBe('complet');
          expect(evenement?.email).toBe(utilisateurDeParcours.email);
          expect(evenement?.parcoursPrécédent).toBe('allégé');
          expect(evenement?.parcours).toBe('complet');
          expect(evenement?.motif).toBe('prise-en-compte-mesure');
        });
      });
    });

    describe('concernant la complétion du module', () => {
      it('signale que la prise en compte termine le module', async () => {
        moduleCyberdépart.mesures = [mesure];

        const nouvelÉtatDuModule = await utilisateurDeParcours.prendEnCompte({
          ...paramètresPriseEnCompteDéfaut,
          module: moduleCyberdépart,
        });

        expect(nouvelÉtatDuModule.moduleTerminé).toBe(true);
      });

      it('publie un événement de completion quand toutes les mesures du module sont prises en compte', async () => {
        moduleCyberdépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        busEvenements.aRecuUnEvenement(ModuleTermine);
        const evenement = busEvenements.recupereEvenement(ModuleTermine);

        expect(evenement!.email).toBe('utilisateur@mail.com');
        expect(evenement!.idModule).toBe(1);
        expect(evenement!.nomModule).toBe('Cyberdépart');
        expect(evenement!.parcours).toBe('allégé');
      });

      it('publie un événement de fin de parcours allégé quand toutes les mesures du module Cyberdépart sont prises en compte', async () => {
        moduleCyberdépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('allégé', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        const evenement = busEvenements.recupereEvenement(ParcoursAllégéTerminé);

        expect(evenement?.email).toBe('utilisateur@mail.com');
      });

      it("ne publie pas un événement de fin de parcours allégé si l'utilisateur n'est pas en parcours allégé", async () => {
        moduleCyberdépart.mesures = [mesure];
        await utilisateurDeParcours.rejoinsParcours('complet', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        expect(busEvenements.naPasRecuDEvenement(ParcoursAllégéTerminé)).toBe(true);
      });

      it('publie un événement de fin de parcours complet quand toutes les mesures sont prises en compte', async () => {
        moduleCyberdépart.mesures = [mesure];
        await entrepotMesure.ajoute(mesure);
        await utilisateurDeParcours.rejoinsParcours('complet', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        const evenement = busEvenements.recupereEvenement(ParcoursCompletTerminé);

        expect(evenement?.email).toBe('utilisateur@mail.com');
      });

      it('indique que le parcours est terminé quand toutes les mesures sont prises en compte', async () => {
        moduleCyberdépart.mesures = [mesure];
        await entrepotMesure.ajoute(mesure);
        await utilisateurDeParcours.rejoinsParcours('complet', busEvenements, 'prise-en-compte-mesure');

        const nouvelEtatModule = await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        expect(nouvelEtatModule.parcoursCompletTerminé).toBe(true);
      });

      it("ne publie pas un événement de fin de parcours complet s'il reste des mesures à prendre en compte", async () => {
        moduleCyberdépart.mesures = [mesure];
        await entrepotMesure.ajoute(mesure);
        await entrepotMesure.ajoute(mesureDeTest().construis());
        await utilisateurDeParcours.rejoinsParcours('complet', busEvenements, 'prise-en-compte-mesure');

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        expect(busEvenements.naPasRecuDEvenement(ParcoursCompletTerminé)).toBe(true);
      });

      it("adapte l'événement de complétion au module", async () => {
        const moduleGénérique = new ConstructeurDeModule().avecLId(3).avecLeNom('ModuleGénérique').construis();
        const mesure = mesureDeTest().avecLId('MESURE').construis();
        moduleGénérique.mesures = [mesure];

        await utilisateurDeParcours.prendEnCompte({
          ...paramètresPriseEnCompteDéfaut,
          mesure,
          module: moduleGénérique,
        });

        const evenement = busEvenements.recupereEvenement(ModuleTermine);
        expect(evenement!.idModule).toBe(3);
        expect(evenement!.nomModule).toBe('ModuleGénérique');
      });

      it("ne publie pas d'événement de completion si toutes les mesures du module ne sont pas prises en compte", async () => {
        moduleCyberdépart.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];

        await utilisateurDeParcours.prendEnCompte(paramètresPriseEnCompteDéfaut);

        expect(busEvenements.naPasRecuDEvenement(ModuleTermine)).toBe(true);
      });

      it('ne compte que les prises en compte du module', async () => {
        const module = new ConstructeurDeModule().avecLId(2).construis();
        const derniereMesureDuModule2 = mesureDeTest().avecLId('MESURE2').construis();
        module.mesures = [derniereMesureDuModule2];
        utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('MESURE3').construis()];

        await utilisateurDeParcours.prendEnCompte({
          ...paramètresPriseEnCompteDéfaut,
          mesure: derniereMesureDuModule2,
          module,
        });

        expect(busEvenements.aRecuUnEvenement(ModuleTermine)).toBe(true);
      });
    });

    it('indique le nombre des mesures prises en compte dans un module', () => {
      const module = new ConstructeurDeModule().construis();
      const mesures = [mesureDeTest().construis(), mesureDeTest().construis()];
      module.mesures = mesures;
      utilisateurDeParcours.mesuresPrisesEnCompte = mesures;

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      expect(nombreDeMesuresPrisesEnCompte).toBe(2);
    });

    it("indique le nombre des mesures prises en compte dans un module lorsqu'il n'y en a pas", () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      expect(nombreDeMesuresPrisesEnCompte).toBe(0);
    });

    it('indique le nombre des mesures prises en compte dans un module sans tenir compte des mesures des autres modules', () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [];
      utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      expect(nombreDeMesuresPrisesEnCompte).toBe(0);
    });

    it('compare les ids des mesures prises en compte', () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesureDeTest().avecLId('TEST').construis()];
      utilisateurDeParcours.mesuresPrisesEnCompte = [mesureDeTest().avecLId('TEST').construis()];

      const nombreDeMesuresPrisesEnCompte = utilisateurDeParcours.nombreDeMesuresPrisesEnCompte(module);

      expect(nombreDeMesuresPrisesEnCompte).toBe(1);
    });
  });
});
