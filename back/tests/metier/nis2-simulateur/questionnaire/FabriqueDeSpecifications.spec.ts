import assert from 'node:assert';
import { describe, it, beforeEach } from 'node:test';
import { FabriqueDeSpecifications } from '../../../../src/metier/nis2-simulateur/questionnaire/FabriqueDeSpecifications';
import { EtatQuestionnaire, EtatQuestionnaireVide } from '../../../../src/metier/nis2-simulateur/EtatQuestionnaire';
import { Specifications } from '../../../../src/metier/nis2-simulateur/questionnaire/Specifications';
import {
  AppartenancePaysUnionEuropeenne,
  UnionPetitMoyenGrand,
} from '../../../../src/metier/nis2-simulateur/ChampsSimulateur.definitions';
import { SecteurActivite } from '../../../../src/metier/nis2-simulateur/SecteurActivite.definitions';
import { libellesSecteursActivite } from '../../../../src/metier/nis2-simulateur/LibellesSecteursActivite';
import { SousSecteurActivite } from '../../../../src/metier/nis2-simulateur/SousSecteurActivite.definitions';
import { libellesSousSecteursActivite } from '../../../../src/metier/nis2-simulateur/LibellesSousSecteursActivite';
import {
  autresActivites,
  CasDeTest,
  energie,
  fabrication,
  fournisseursNumeriques,
  gestionDesServicesTIC,
  infrastructureNumerique,
} from './casDeTests.activites';
import {
  PointsAttentionPrecis,
  ResultatEligibilite,
  ResumesPointsAttention,
} from '../../../../src/metier/nis2-simulateur/Regulation.definitions';
import { SpecificationTexte } from '../../../../src/metier/nis2-simulateur/questionnaire/FormatDesSpecificationsCSV';

describe('La fabrique de spécifications', () => {
  let fabrique: FabriqueDeSpecifications;

  beforeEach(() => {
    fabrique = new FabriqueDeSpecifications();
  });

  it('préserve le code des spécifications', () => {
    const avecUnCode = uneSpecification({
      Code: 'R1255',
      Resultat: 'Régulée EE',
    });

    const specs = fabrique.transforme(avecUnCode);

    assert.strictEqual(specs.code, 'R1255');
  });

  describe("pour la règle « d'entité OSE »", () => {
    const entiteOui: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['oui'],
    };
    const entiteNon: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['non'],
    };
    const entiteNeSaitPas: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['nsp'],
    };

    it('sait instancier une règle « Oui »', () => {
      const specs = fabrique.transforme(uneSpecification({ 'Designation OSE': 'Oui', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specs.evalue(entiteOui), reguleEE());
      assert.strictEqual(specs.evalue(entiteNon), undefined);
      assert.strictEqual(specs.evalue(entiteNeSaitPas), undefined);
    });

    it('sait instancier une règle « Non »', () => {
      const specs = fabrique.transforme(uneSpecification({ 'Designation OSE': 'Non', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.strictEqual(specs.evalue(entiteOui), undefined);
      assert.partialDeepStrictEqual(specs.evalue(entiteNon), reguleEE());
      assert.strictEqual(specs.evalue(entiteNeSaitPas), undefined);
    });

    it('sait instancier une règle « Ne sait pas »', () => {
      const specs = fabrique.transforme(uneSpecification({ 'Designation OSE': 'Ne sait pas', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.strictEqual(specs.evalue(entiteOui), undefined);
      assert.strictEqual(specs.evalue(entiteNon), undefined);
      assert.partialDeepStrictEqual(specs.evalue(entiteNeSaitPas), reguleEE());
    });

    it('sait instancier une règle « Non [OU] Ne sait pas »', () => {
      const specs = fabrique.transforme(
        uneSpecification({
          'Designation OSE': 'Non [OU] Ne sait pas',
          Resultat: 'Régulée EE',
        })
      );

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.strictEqual(specs.evalue(entiteOui), undefined);
      assert.partialDeepStrictEqual(specs.evalue(entiteNon), reguleEE());
      assert.partialDeepStrictEqual(specs.evalue(entiteNeSaitPas), reguleEE());
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => fabrique.transforme(uneSpecification({ 'Designation OSE': 'Mauvaise valeur' })), {
        message: /Mauvaise valeur/,
      });
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specifications = fabrique.transforme(uneSpecification({ 'Designation OSE': '', Resultat: 'Régulée EE' }));

      assert.strictEqual(specifications.nombreDeRegles(), 0);
    });
  });

  describe('pour la règle de « Localisation »', () => {
    const entiteFrance: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      appartenancePaysUnionEuropeenne: ['france'],
    };
    const entiteAutre: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      appartenancePaysUnionEuropeenne: ['autre'],
    };

    it('sait instancier une règle « France »', () => {
      const specs = fabrique.transforme(uneSpecification({ Localisation: 'France', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specs.evalue(entiteFrance), reguleEE());
      assert.strictEqual(specs.evalue(entiteAutre), undefined);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => fabrique.transforme(uneSpecification({ Localisation: '12345' })), /12345/);
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specifications = fabrique.transforme(uneSpecification({ Localisation: '-', Resultat: 'Régulée EE' }));

      assert.strictEqual(specifications.nombreDeRegles(), 0);
    });
  });

  describe('pour la règle « Type de structure »', () => {
    const privee: EtatQuestionnaire = { ...EtatQuestionnaireVide, typeStructure: ['privee'] };
    const publique: EtatQuestionnaire = { ...EtatQuestionnaireVide, typeStructure: ['publique'] };

    it('instancie une règle « Entreprise privée ou publique »', () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({
          'Type de structure': 'Entreprise privée ou publique',
          Resultat: 'Régulée EE',
        })
      );

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specs.evalue(privee), reguleEE());
      assert.strictEqual(specs.evalue(publique), undefined);
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({
          'Type de structure': '-',
          Resultat: 'Régulée EE',
        })
      );

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ 'Type de structure': 'X', Resultat: 'Régulée EE' }));
      }, /X/);
    });
  });

  describe('pour la règle « Taille »', () => {
    const entiteDeTaille = (taille: UnionPetitMoyenGrand) => ({
      ...EtatQuestionnaireVide,
      trancheNombreEmployes: [taille],
      trancheChiffreAffaire: [taille],
    });

    const petiteEntite: EtatQuestionnaire = entiteDeTaille('petit');
    const entiteMoyenne: EtatQuestionnaire = entiteDeTaille('moyen');
    const grandeEntite: EtatQuestionnaire = entiteDeTaille('grand');

    it('sait instancier une règle « Petite »', () => {
      const specs = fabrique.transforme(uneSpecification({ Taille: 'Petite', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specs.evalue(petiteEntite), reguleEE());
      assert.strictEqual(specs.evalue(entiteMoyenne), undefined);
      assert.strictEqual(specs.evalue(grandeEntite), undefined);
    });

    it('sait instancier une règle « Moyenne »', () => {
      const specs = fabrique.transforme(uneSpecification({ Taille: 'Moyenne', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.strictEqual(specs.evalue(petiteEntite), undefined);
      assert.partialDeepStrictEqual(specs.evalue(entiteMoyenne), reguleEE());
      assert.strictEqual(specs.evalue(grandeEntite), undefined);
    });

    it('sait instancier une règle « Grande »', () => {
      const specs = fabrique.transforme(uneSpecification({ Taille: 'Grande', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 1);
      assert.strictEqual(specs.evalue(petiteEntite), undefined);
      assert.strictEqual(specs.evalue(entiteMoyenne), undefined);
      assert.partialDeepStrictEqual(specs.evalue(grandeEntite), reguleEE());
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Taille: '-', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ Taille: 'XXL', Resultat: 'Régulée EE' }));
      }, /XXL/);
    });
  });

  describe('pour la règle « Secteurs »', () => {
    const entiteDuSecteur = (secteur: SecteurActivite): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      secteurActivite: [secteur],
    });
    const entiteDesSecteurs = (secteurs: SecteurActivite[]): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      secteurActivite: secteurs,
    });

    const tousLesSecteurs = Object.entries(libellesSecteursActivite).map(([id, libelle]) => ({ id, libelle }));

    for (const { id, libelle } of tousLesSecteurs) {
      it(`sait instancier une règle pour le secteur ${libelle}`, () => {
        const entite = entiteDuSecteur(id as SecteurActivite);
        const specs = fabrique.transforme(uneSpecification({ Secteurs: libelle, Resultat: 'Régulée EE' }));

        assert.strictEqual(specs.nombreDeRegles(), 1);
        assert.partialDeepStrictEqual(specs.evalue(entite), reguleEE());
      });
    }

    it("ne matche pas un secteur qui n'est pas celui de la règle", () => {
      const banque = entiteDuSecteur('banqueSecteurBancaire');
      const specsEnergie = fabrique.transforme(uneSpecification({ Secteurs: 'Énergie', Resultat: 'Régulée EE' }));

      const resultat = specsEnergie.evalue(banque);

      assert.strictEqual(resultat, undefined);
    });

    it("matche dès qu'un secteur est parmi ceux de la règle", () => {
      const banqueEtEnergie = entiteDesSecteurs(['banqueSecteurBancaire', 'energie']);
      const specsEnergie = fabrique.transforme(uneSpecification({ Secteurs: 'Énergie', Resultat: 'Régulée EE' }));

      const resultat = specsEnergie.evalue(banqueEtEnergie);

      assert.partialDeepStrictEqual(resultat, reguleEE());
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Secteurs: '-', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ Secteurs: 'Tennis', Resultat: 'Régulée EE' }));
      }, /Tennis/);
    });
  });

  describe('pour la règle « Sous-secteurs »', () => {
    const entiteDuSousSecteur = (sousSecteur: SousSecteurActivite): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      sousSecteurActivite: [sousSecteur],
    });

    const entiteDesSousSecteur = (sousSecteurs: SousSecteurActivite[]): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      sousSecteurActivite: sousSecteurs,
    });
    const tousSaufAutres = Object.entries(libellesSousSecteursActivite)
      .filter(([, libelle]) => libelle !== 'Autre sous-secteur')
      .map(([id, libelle]) => ({ id, libelle }));

    for (const { id, libelle } of tousSaufAutres) {
      it(`sait instancier une règle pour le sous-secteur ${libelle}`, () => {
        const entite = entiteDuSousSecteur(id as SousSecteurActivite);
        const specs = fabrique.transforme(
          uneSpecification({
            'Sous-secteurs': libelle,
            Resultat: 'Régulée EE',
          })
        );

        assert.strictEqual(specs.nombreDeRegles(), 1);
        assert.partialDeepStrictEqual(specs.evalue(entite), reguleEE());
      });
    }

    it("ne matche pas un sous-secteur qui n'est pas celui de la règle", () => {
      const gaz = entiteDuSousSecteur('gaz');
      const transportAerien = fabrique.transforme(
        uneSpecification({
          'Sous-secteurs': 'Aériens',
          Resultat: 'Régulée EE',
        })
      );

      const resultat = transportAerien.evalue(gaz);

      assert.strictEqual(resultat, undefined);
    });

    it("matche dès qu'un secteur est parmi ceux de la règle", () => {
      const aeriensEtFerroviaires = entiteDesSousSecteur(['transportsAeriens', 'transportsFerroviaires']);
      const specsFeroviaires = fabrique.transforme(
        uneSpecification({
          'Sous-secteurs': 'Ferroviaires',
          Resultat: 'Régulée EE',
        })
      );

      const resultat = specsFeroviaires.evalue(aeriensEtFerroviaires);

      assert.partialDeepStrictEqual(resultat, reguleEE());
    });

    describe("quand il s'agit de la valeur « Autre sous-secteur »", () => {
      it('sait instancier une règle pour le « Autre » du secteur Énergie', () => {
        const autreDeEnergie: EtatQuestionnaire = {
          ...entiteDuSousSecteur('autreSousSecteurEnergie'),
          secteurActivite: ['energie'],
        };

        const specsAutreEnergie = fabrique.transforme(
          uneSpecification({
            Secteurs: 'Énergie',
            'Sous-secteurs': 'Autre sous-secteur',
            Resultat: 'Régulée EE',
          })
        );

        assert.strictEqual(specsAutreEnergie.nombreDeRegles(), 2);
        assert.partialDeepStrictEqual(specsAutreEnergie.evalue(autreDeEnergie), reguleEE());
      });

      it('sait instancier une règle pour le « Autre » du secteur Fabrication', () => {
        const autreDeFabrication: EtatQuestionnaire = {
          ...entiteDuSousSecteur('autreSousSecteurFabrication'),
          secteurActivite: ['fabrication'],
        };

        const specsAutreFabrication = fabrique.transforme(
          uneSpecification({
            Secteurs: 'Fabrication',
            'Sous-secteurs': 'Autre sous-secteur',
            Resultat: 'Régulée EE',
          })
        );

        assert.strictEqual(specsAutreFabrication.nombreDeRegles(), 2);
        assert.partialDeepStrictEqual(specsAutreFabrication.evalue(autreDeFabrication), reguleEE());
      });

      it('sait instancier une règle pour le « Autre » du secteur Transports', () => {
        const autreDeTransports: EtatQuestionnaire = {
          ...entiteDuSousSecteur('autreSousSecteurTransports'),
          secteurActivite: ['transports'],
        };

        const specsAutreFabrication = fabrique.transforme(
          uneSpecification({
            Secteurs: 'Transports',
            'Sous-secteurs': 'Autre sous-secteur',
            Resultat: 'Régulée EE',
          })
        );

        assert.strictEqual(specsAutreFabrication.nombreDeRegles(), 2);
        assert.partialDeepStrictEqual(specsAutreFabrication.evalue(autreDeTransports), reguleEE());
      });

      it("jette une erreur si le secteur parent n'a pas de sous-secteur connu", () => {
        assert.throws(() => {
          fabrique.transforme(
            uneSpecification({
              'Sous-secteurs': 'Autre sous-secteur',
              Secteurs: 'Gestion des services TIC', // Ce secteur n'a pas de sous-secteur
              Resultat: 'Régulée EE',
            })
          );
        }, /Autre sous-secteur/);
      });
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({ 'Sous-secteurs': '-', Resultat: 'Régulée EE' })
      );

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ 'Sous-secteurs': 'Parachute', Resultat: 'Régulée EE' }));
      }, /Parachute/);
    });
  });

  describe('pour la règle « Activités »', () => {
    const casDeTest: CasDeTest[] = [
      ...infrastructureNumerique,
      ...gestionDesServicesTIC,
      ...fournisseursNumeriques,
      ...fabrication,
      ...energie,
      ...autresActivites,
    ];

    for (const {
      libelleActivite,
      activite,
      libelleSecteur,
      secteur,
      libelleSousSecteur = '-',
      sousSecteur,
    } of casDeTest) {
      it(`sait instancier la règle ${libelleActivite} du secteur ${libelleSecteur}`, () => {
        const specs: Specifications = fabrique.transforme(
          uneSpecification({
            Activités: libelleActivite,
            Secteurs: libelleSecteur,
            'Sous-secteurs': libelleSousSecteur,
            Resultat: 'Régulée EE',
          })
        );

        const reponse: EtatQuestionnaire = {
          ...EtatQuestionnaireVide,
          secteurActivite: [secteur],
          sousSecteurActivite: [sousSecteur!],
          activites: [activite],
        };

        assert.partialDeepStrictEqual(specs.evalue(reponse), reguleEE());
      });
    }

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Activités: '-', Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(
        () => {
          fabrique.transforme(uneSpecification({ Activités: 'Volley', Resultat: 'Régulée EE' }));
        },
        { message: /Volley/ }
      );
    });
  });

  describe('pour la règle « Extra - Fourniture de service »', () => {
    const entiteQuiFournitEn = (localisations: AppartenancePaysUnionEuropeenne[]): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      localisationFournitureServicesNumeriques: localisations,
    });

    it('instancie une règle pour la valeur « France »', () => {
      const specsFrance: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Fourniture de service': 'France',
          Resultat: 'Régulée EE',
        })
      );

      const enFrance = entiteQuiFournitEn(['france']);

      assert.strictEqual(specsFrance.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specsFrance.evalue(enFrance), reguleEE());
    });

    it("instancie une règle pour la valeur « Autres États membres de l'Union Européenne »", () => {
      const specsAutreDansUE: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Fourniture de service': "Autres États membres de l'Union Européenne",
          Resultat: 'Régulée EE',
        })
      );

      const autreEnUE = entiteQuiFournitEn(['autre']);

      assert.strictEqual(specsAutreDansUE.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specsAutreDansUE.evalue(autreEnUE), reguleEE());
    });

    it('instancie une règle pour la valeur « Autres États hors Union Européenne »', () => {
      const specsHorsUE: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Fourniture de service': 'Autres États hors Union Européenne',
          Resultat: 'Régulée EE',
        })
      );

      const horsUE = entiteQuiFournitEn(['horsue']);

      assert.strictEqual(specsHorsUE.nombreDeRegles(), 1);
      assert.partialDeepStrictEqual(specsHorsUE.evalue(horsUE), reguleEE());
    });

    describe('lorsque la valeur est un cumul de réponses', () => {
      it('instancie une règle qui match si les réponses sont exactement la combinaison des valeurs individuelles attendues', () => {
        const specsFranceEtAutreUE = fabrique.transforme(
          uneSpecification({
            'Extra - Fourniture de service': "France + Autres États membres de l'Union Européenne",
            Resultat: 'Régulée EE',
          })
        );

        assert.strictEqual(specsFranceEtAutreUE.nombreDeRegles(), 1);

        assert.partialDeepStrictEqual(specsFranceEtAutreUE.evalue(entiteQuiFournitEn(['france', 'autre'])), reguleEE());

        assert.strictEqual(specsFranceEtAutreUE.evalue(entiteQuiFournitEn(['france'])), undefined);
        assert.strictEqual(specsFranceEtAutreUE.evalue(entiteQuiFournitEn(['autre'])), undefined);
        assert.strictEqual(specsFranceEtAutreUE.evalue(entiteQuiFournitEn(['france', 'horsue'])), undefined);
        assert.strictEqual(specsFranceEtAutreUE.evalue(entiteQuiFournitEn(['horsue'])), undefined);
      });
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Fourniture de service': '-',
          Resultat: 'Régulée EE',
        })
      );

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ 'Extra - Fourniture de service': 'Jardin', Resultat: 'Régulée EE' }));
      }, /Jardin/);
    });
  });

  describe('pour la règle « Extra - Établissement principal »', () => {
    const entiteAvecDecisionEn = (pays: AppartenancePaysUnionEuropeenne): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      paysDecisionsCyber: [pays],
    });

    const entiteQuiOpereEn = (pays: AppartenancePaysUnionEuropeenne): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      paysOperationsCyber: [pays],
    });

    const entiteAvecSalariesBasesEn = (pays: AppartenancePaysUnionEuropeenne): EtatQuestionnaire => ({
      ...EtatQuestionnaireVide,
      paysPlusGrandNombreSalaries: [pays],
    });

    it('instancie la règle « France »', () => {
      assert.doesNotThrow(() =>
        fabrique.transforme(uneSpecification({ 'Extra - Établissement principal': 'France', Resultat: 'Régulée EE' }))
      );
    });

    it("instancie la règle « Autres États membres de l'Union Européenne »", () => {
      assert.doesNotThrow(() =>
        fabrique.transforme(
          uneSpecification({
            'Extra - Établissement principal': "Autres États membres de l'Union Européenne",
            Resultat: 'Régulée EE',
          })
        )
      );
    });

    it("est un match dès qu'un pays de la réponse correspond au pays de la règle", () => {
      const specsFrance: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Établissement principal': 'France',
          Resultat: 'Régulée EE',
        })
      );

      const decisionFr = entiteAvecDecisionEn('france');
      assert.partialDeepStrictEqual(specsFrance.evalue(decisionFr), reguleEE());

      const operationFr = entiteQuiOpereEn('france');
      assert.partialDeepStrictEqual(specsFrance.evalue(operationFr), reguleEE());

      const salariesFr = entiteAvecSalariesBasesEn('france');
      assert.partialDeepStrictEqual(specsFrance.evalue(salariesFr), reguleEE());
    });

    it('ne match pas si aucun pays de la réponse ne correspond à celui de la règle', () => {
      const specsFrance: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Établissement principal': 'France',
          Resultat: 'Régulée EE',
        })
      );

      const decisionAutreUE = entiteAvecDecisionEn('autre');

      assert.strictEqual(specsFrance.evalue(decisionAutreUE), undefined);
    });

    it("n'instancie pas de règle si aucune valeur n'est passée", () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({
          'Extra - Établissement principal': '-',
          Resultat: 'Régulée EE',
        })
      );

      assert.strictEqual(specs.nombreDeRegles(), 0);
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => {
        fabrique.transforme(uneSpecification({ 'Extra - Établissement principal': 'Jardin', Resultat: 'Régulée EE' }));
      }, /Jardin/);
    });
  });

  describe('pour le résultat', () => {
    it('sait instancier un résultat « Régulée EE»', () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Resultat: 'Régulée EE' }));

      assert.strictEqual(specs.resultat().regulation, 'Regule');
      assert.strictEqual(specs.resultat().typeEntite, 'EntiteEssentielle');
    });

    it('sait instancier un résultat « Régulée EI »', () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Resultat: 'Régulée EI' }));

      assert.strictEqual(specs.resultat().regulation, 'Regule');
      assert.strictEqual(specs.resultat().typeEntite, 'EntiteImportante');
    });

    it('sait instancier un résultat « Régulée, enregistrement seul »', () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Resultat: 'Régulée, enregistrement seul' }));

      assert.strictEqual(specs.resultat().regulation, 'Regule');
      assert.strictEqual(specs.resultat().typeEntite, 'EnregistrementUniquement');
    });

    it('sait instancier un résultat « Régulée, sans précision EE/EI »', () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({ Resultat: 'Régulée, sans précision EE/EI' })
      );

      assert.strictEqual(specs.resultat().regulation, 'Regule');
      assert.strictEqual(specs.resultat().typeEntite, 'AutreEtatMembreUE');
    });

    it('sait instancier un résultat « Non regulée »', () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Resultat: 'Non régulée' }));

      assert.strictEqual(specs.resultat().regulation, 'NonRegule');
    });

    it('sait instancier un résultat « Incertain »', () => {
      const specs: Specifications = fabrique.transforme(uneSpecification({ Resultat: 'Incertain' }));

      assert.strictEqual(specs.resultat().regulation, 'Incertain');
      assert.strictEqual(specs.resultat().typeEntite, 'AutreEtatMembreUE');
    });

    it("lève une exception si la valeur reçue n'est pas gérée", () => {
      assert.throws(() => fabrique.transforme(uneSpecification({ Resultat: 'X' })), /X/);
    });
  });

  describe("pour les « Points d'attention »", () => {
    const tousLesResumes: [string, ResumesPointsAttention][] = [
      ['#NumeriqueUE', 'NumeriqueUE'],
      ['#EtabliUE', 'EtabliUE'],
      ['#RepresentantUE', 'RepresentantUE'],
    ];

    for (const [cleCsv, resumeAttendu] of tousLesResumes) {
      it(`comprend le résumé ${cleCsv}`, () => {
        const specs: Specifications = fabrique.transforme(
          uneSpecification({ Resultat: 'Régulée EE', "Points d'attention": cleCsv })
        );

        const { resumes } = specs.resultat().pointsAttention;

        assert.deepStrictEqual(resumes, [resumeAttendu]);
      });
    }

    const toutesLesPrecisions: [string, PointsAttentionPrecis][] = [
      ['#MecanismeExemptionSecuriteNationale', 'MecanismeExemptionSecuriteNationale'],
      ['#ResilienceEntiteCritique', 'ResilienceEntiteCritique'],
      ['#DORA', 'DORA'],
      ['#TelecomFranceEtAutresEMdelUE', 'TelecomFranceEtAutresEMdelUE'],
      ['#TelecomAutresEMdelUEUniquement', 'TelecomAutresEMdelUEUniquement'],
      ['#NumeriqueEtabliEMUEhorsFrance', 'NumeriqueEtabliEMUEhorsFrance'],
      ['#EnregistrementNomsDeDomaine', 'EnregistrementNomsDeDomaine'],
      ['#CriteresDePossibleInclusion', 'CriteresDePossibleInclusion'],
      ['#OSE', 'OSE'],
    ];

    for (const [cleCsv, precisionAttendue] of toutesLesPrecisions) {
      it(`comprend la précision ${cleCsv}`, () => {
        const specs: Specifications = fabrique.transforme(
          uneSpecification({ Resultat: 'Régulée EE', "Points d'attention": cleCsv })
        );

        const { precisions } = specs.resultat().pointsAttention;

        assert.deepStrictEqual(precisions, [precisionAttendue]);
      });
    }

    it('sait répartir entre les résumés et les précisions', () => {
      const specs: Specifications = fabrique.transforme(
        uneSpecification({
          Resultat: 'Régulée EE',
          "Points d'attention": '#NumeriqueUE, #DORA',
        })
      );

      const { resumes, precisions } = specs.resultat().pointsAttention;

      assert.deepStrictEqual(resumes, ['NumeriqueUE']);
      assert.deepStrictEqual(precisions, ['DORA']);
    });

    it("ne fait rien s'il n'y a pas de points d'attention", () => {
      const specs = fabrique.transforme(
        uneSpecification({
          Resultat: 'Régulée EE',
          "Points d'attention": '-',
        })
      );

      const { resumes, precisions } = specs.resultat().pointsAttention;

      assert.deepStrictEqual(resumes, []);
      assert.deepStrictEqual(precisions, []);
    });

    it("lève une exception si un point d'attention est inconnu", () => {
      assert.throws(
        () => fabrique.transforme(uneSpecification({ Resultat: 'Régulée EE', "Points d'attention": '#Train' })),
        /Train/
      );
    });
  });
});

function uneSpecification(surcharge: Partial<SpecificationTexte>): SpecificationTexte {
  return {
    'Designation OSE': '',
    Localisation: '-',
    'Type de structure': '-',
    Taille: '-',
    Secteurs: '-',
    'Sous-secteurs': '-',
    Activités: '-',
    'Extra - Fourniture de service': '-',
    'Extra - Établissement principal': '-',
    Resultat: 'CHAQUE TEST DOIT LE DÉFINIR',
    "Points d'attention": '-',
    Code: '',
    ...surcharge,
  };
}

export function reguleEE(): Partial<ResultatEligibilite> {
  return {
    regulation: 'Regule',
    typeEntite: 'EntiteEssentielle',
  };
}
