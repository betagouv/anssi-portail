import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { ClientHttp } from '../../../src/infra/clientHttp';
import { ReponseGrist } from '../../../src/infra/entrepotGrist';
import { FournisseurHorloge } from '../../../src/infra/fournisseurHorloge';
import {
  EntrepotExigenceGrist,
  ExigenceGrist,
} from '../../../src/infra/nis2/entrepotExigenceGrist';
import { fauxAdaptateurEnvironnement } from '../../api/fauxObjets';
import { FournisseurHorlogeDeTest } from '../fournisseurHorlogeDeTest';

describe("L'entrepot d'exigence Grist", () => {
  let clientHttp: ClientHttp<ReponseGrist<ExigenceGrist>>;
  let entrepotExigenceGrist: EntrepotExigenceGrist;

  beforeEach(() => {
    clientHttp = { get: async () => ({ data: { records: [] } }) };
    entrepotExigenceGrist = new EntrepotExigenceGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  });

  const ilSePasse20Secondes = (): void => {
    FournisseurHorlogeDeTest.initialise(
      new Date(FournisseurHorloge.maintenant().getTime() + 20000)
    );
  };

  it('sait récupérer des exigences en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;

    clientHttp.get = async (url, config) => {
      urlAppelee = url;
      headerAuthent = config?.headers?.authorization;
      return {
        data: { records: [] },
      };
    };

    await entrepotExigenceGrist.parReferentiel('NIS2');

    assert.equal(headerAuthent, 'Bearer FAUSSE_CLE_API_SOCLE');
    assert.ok(
      urlAppelee.startsWith('http://grist/api/docs/idDeDocumentSocle/sql?q=')
    );
  });

  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    const entrepotExigenceGristHorsLigne = new EntrepotExigenceGrist({
      clientHttp,
      adaptateurEnvironnement: {
        ...fauxAdaptateurEnvironnement,
        grist: () => ({
          ...fauxAdaptateurEnvironnement.grist(),
          dureeCacheEnSecondes: () => 0,
        }),
      },
    });

    const exigences =
      await entrepotExigenceGristHorsLigne.parReferentiel('NIS2');

    assert.deepEqual(exigences, []);
  });

  it("n'appelle pas Grist si les données sont en cache", async () => {
    let nombreAppel = 0;
    clientHttp.get = async <T>() => {
      nombreAppel++;
      return {
        data: { records: [] } as unknown as T,
      };
    };

    await entrepotExigenceGrist.parReferentiel('NIS2');
    ilSePasse20Secondes();
    await entrepotExigenceGrist.parReferentiel('NIS2');

    assert.equal(nombreAppel, 1);
  });

  describe("lorsqu'il récupère les exigences NIS2", () => {
    it('sait récupérer les données des exigences', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite:
                    "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  EIEE: '["EI","EE"]',
                },
              },
              {
                fields: {
                  Reference: '2.A.3-EI/EE',
                  Objectif_de_securite:
                    "Objectif de sécurité 2: Mise en œuvre d'un cadre de gouvernance de la sécurité numérique",
                  Thematique: 'Rôles et responsabilités',
                  Contenu: 'L’entité définit et met en œuvre une organisation',
                  EIEE: '["EE"]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel('NIS2');

      assert.equal(exigences[0].reference, '1.1-EI/EE');
      assert.equal(
        exigences[0].contenu,
        'L’entité liste l’ensemble de ses activités'
      );
      assert.equal(exigences[0].thematique, 'Recensement des SI');
      assert.equal(
        exigences[0].objectifSecurite,
        "Objectif de sécurité 1: Recensement des systèmes d'information"
      );
      assert.deepEqual(exigences[0].entitesCible, [
        'EntiteImportante',
        'EntiteEssentielle',
      ]);
      assert.equal(exigences[1].reference, '2.A.3-EI/EE');
    });

    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite:
                    "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  EIEE: '["EI","EE"]',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement"},{"reference":"","contenu":"27002:2022-5.4 Responsabilités de la direction"}]',
                },
              },
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite:
                    "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  EIEE: '["EI","EE"]',
                  Niveau: 'V',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement"},{"reference":"","contenu":"27002:2022-5.4 Responsabilités de la direction"}]',
                },
              },
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite:
                    "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  EIEE: '["EI","EE"]',
                  Niveau: 'R',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement"},{"reference":"","contenu":"27002:2022-5.4 Responsabilités de la direction"}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel(
        'NIS2',
        'ISO'
      );

      assert.equal(exigences[0].correspondances['ISO']?.niveau, 'moyen');
      assert.equal(
        exigences[0].correspondances['ISO']?.observations,
        'Des observations'
      );
      assert.deepEqual(exigences[0].correspondances['ISO']?.exigences, [
        {
          reference: '',
          contenu: '27001:2022-5.1 Leadership et engagement',
        },
        {
          reference: '',
          contenu: '27002:2022-5.4 Responsabilités de la direction',
        },
      ]);
      assert.equal(exigences[1].correspondances['ISO']?.niveau, 'élevé');
      assert.equal(exigences[2].correspondances['ISO']?.niveau, 'faible');
    });
  });

  describe("lorsqu'il récupère les exigences ISO 27001", () => {
    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ISO 27001:2022-5.1 Leadership et engagement',
                  Norme: 'ISO 27001',
                  Chapitre: '5 Leadership',
                  Contenu: '5.1 Leadership et engagement',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel(
        'ISO',
        'NIS2'
      );

      assert.equal(exigences[0].correspondances['NIS2']?.niveau, 'moyen');
      assert.equal(
        exigences[0].correspondances['NIS2']?.observations,
        'Des observations'
      );
      assert.deepEqual(exigences[0].correspondances['NIS2']?.exigences, [
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
        },
      ]);
    });
  });

  describe("lorsqu'il récupère les exigences AE", () => {
    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.2.3',
                  Contenu: 'Le contenu de 1.2.3',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel(
        'AE',
        'NIS2'
      );

      assert.equal(exigences[0].correspondances['NIS2']?.niveau, 'moyen');
      assert.equal(
        exigences[0].correspondances['NIS2']?.observations,
        'Des observations'
      );
      assert.deepEqual(exigences[0].correspondances['NIS2']?.exigences, [
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
        },
      ]);
    });
  });

  describe("lorsqu'il récupère les exigences CyFun23", () => {
    it('sait récupérer les informations des exigences', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ID.AM-1.3',
                  Contenu: 'Lorsque du matériel non autorisé est détecté, ...',
                  Fonction: 'Identify',
                  NiveauAssurance: 'Essential',
                  EstMesureCle: 1,
                  Niveau: undefined,
                  Observations: undefined,
                  ExigencesCible: '[]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel(
        'CyFun23',
        'NIS2'
      );

      assert.equal(exigences[0].reference, 'ID.AM-1.3');
      assert.equal(
        exigences[0].contenu,
        'Lorsque du matériel non autorisé est détecté, ...'
      );
      assert.equal(exigences[0].fonction, 'Identifier');
      assert.equal(exigences[0].niveauAssurance, 'Essentiel');
      assert.equal(exigences[0].estMesureCle, true);
    });

    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ID.AM-1.3',
                  Contenu: 'Lorsque du matériel non autorisé est détecté, ...',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      };

      const exigences = await entrepotExigenceGrist.parReferentiel(
        'CyFun23',
        'NIS2'
      );

      assert.equal(exigences[0].correspondances['NIS2']?.niveau, 'moyen');
      assert.equal(
        exigences[0].correspondances['NIS2']?.observations,
        'Des observations'
      );
      assert.deepEqual(exigences[0].correspondances['NIS2']?.exigences, [
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
        },
      ]);
    });
  });
});
