import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import { ClientHttp } from '../../../src/infra/clientHttp.js';
import { EntrepotExigenceGrist, ExigenceGrist } from '../../../src/infra/nis2/entrepotExigenceGrist.js';
import { fauxAdaptateurEnvironnement } from '../../api/fauxObjets.js';
import { fabriqueClientGet, fabriqueFauxClientHttp } from '../fournisseurClientHttp.js';

describe("L'entrepot d'exigence Grist", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  let clientHttp: ClientHttp;
  let entrepotExigenceGrist: EntrepotExigenceGrist;

  beforeEach(() => {
    clientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async () => ({ data: { records: [] } })),
    };
    entrepotExigenceGrist = new EntrepotExigenceGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  });

  const ilSePasse20Secondes = (): void => {
    vi.setSystemTime(new Date(Date.now() + 20000));
  };

  it('sait récupérer des exigences en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;

    clientHttp.get = fabriqueClientGet(async (url, config) => {
      urlAppelee = url;
      headerAuthent = config?.headers?.authorization;
      return {
        data: { records: [] },
      };
    });

    await entrepotExigenceGrist.parReferentiel('NIS2');

    expect(headerAuthent).toBe('Bearer FAUSSE_CLE_API_SOCLE');
    expect(urlAppelee.startsWith('http://grist/api/docs/idDeDocumentSocle/sql?q=')).toBeTruthy();
  });

  it("renvoie une liste vide si l'appel à grist échoue", async () => {
    clientHttp.get = fabriqueClientGet(async () => {
      throw new Error("Erreur de test lros de l'appel au Grist");
    });

    const exigences = await entrepotExigenceGrist.parReferentiel('NIS2');

    expect(exigences).toHaveLength(0);
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

    const exigences = await entrepotExigenceGristHorsLigne.parReferentiel('NIS2');

    expect(exigences).toEqual([]);
  });

  it("n'appelle pas Grist si les données sont en cache", async () => {
    clientHttp.get = fabriqueClientGet(async () => ({ data: { records: [] } }));

    vi.spyOn(clientHttp, 'get');

    await entrepotExigenceGrist.parReferentiel('NIS2');
    ilSePasse20Secondes();
    await entrepotExigenceGrist.parReferentiel('NIS2');

    expect(clientHttp.get).toHaveBeenCalledOnce();
  });

  describe("lorsqu'il récupère les exigences NIS2", () => {
    it('sait récupérer les données des exigences', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite: "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  Content: 'The entity lists all its activities',
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
                  Content: 'The entity defines and implements an organization',
                  EIEE: '["EE"]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('NIS2');

      expect(exigences[0].reference).toBe('1.1-EI/EE');
      expect(exigences[0].contenu).toBe('L’entité liste l’ensemble de ses activités');
      expect(exigences[0].contenuEnAnglais).toBe('The entity lists all its activities');
      expect(exigences[0].thematique).toBe('Recensement des SI');
      expect(exigences[0].objectifSecurite).toBe("Objectif de sécurité 1: Recensement des systèmes d'information");
      expect(exigences[0].entitesCible).toEqual(['EntiteImportante', 'EntiteEssentielle']);
      expect(exigences[1].reference).toBe('2.A.3-EI/EE');
    });

    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite: "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  Content: 'The entity lists all its activities',
                  EIEE: '["EI","EE"]',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement","contenuEnAnglais": "5.1 Leadership et commitment"},{"reference":"","contenu":"5.3 Rôles, responsabilités et autorités au sein de l\'organisation", "contenuEnAnglais": "5.3 Organizational roles, responsibilities and authorities"}]',
                },
              },
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite: "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  Content: 'The entity defines and implements an organization',
                  EIEE: '["EI","EE"]',
                  Niveau: 'V',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement","contenuEnAnglais": "5.1 Leadership et commitment"},{"reference":"","contenu":"5.3 Rôles, responsabilités et autorités au sein de l\'organisation", "contenuEnAnglais": "5.3 Organizational roles, responsibilities and authorities"}]',
                },
              },
              {
                fields: {
                  Reference: '1.1-EI/EE',
                  Objectif_de_securite: "Objectif de sécurité 1: Recensement des systèmes d'information",
                  Thematique: 'Recensement des SI',
                  Contenu: 'L’entité liste l’ensemble de ses activités',
                  Content: 'The entity lists all its activities',
                  EIEE: '["EI","EE"]',
                  Niveau: 'R',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"","contenu":"27001:2022-5.1 Leadership et engagement","contenuEnAnglais": "5.1 Leadership et commitment"},{"reference":"","contenu":"5.3 Rôles, responsabilités et autorités au sein de l\'organisation", "contenuEnAnglais": "5.3 Organizational roles, responsibilities and authorities"}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('NIS2', 'ISO');

      expect(exigences[0].correspondances['ISO']?.niveau).toBe('moyen');
      expect(exigences[0].correspondances['ISO']?.observations.contenu).toBe('Des observations');
      expect(exigences[0].correspondances['ISO']?.exigences).toEqual([
        {
          reference: '',
          contenu: '27001:2022-5.1 Leadership et engagement',
          contenuEnAnglais: '5.1 Leadership et commitment',
        },
        {
          reference: '',
          contenu: "5.3 Rôles, responsabilités et autorités au sein de l'organisation",
          contenuEnAnglais: '5.3 Organizational roles, responsibilities and authorities',
        },
      ]);
      expect(exigences[1].correspondances['ISO']?.niveau).toBe('élevé');
      expect(exigences[2].correspondances['ISO']?.niveau).toBe('faible');
    });
  });

  describe("lorsqu'il récupère les exigences ISO 27001", () => {
    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ISO 27001:2022-5.1 Leadership et engagement',
                  Norme: 'ISO 27001',
                  Chapitre: '5 Leadership',
                  Contenu: '5.1 Leadership et engagement',
                  Content: '5.1 Leadership et commitment',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité...", "contenuEnAnglais": "The entity’s executive officer..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre...", "contenuEnAnglais": "The entity defines and implements..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('ISO', 'NIS2');

      expect(exigences[0].correspondances['NIS2']?.niveau).toBe('moyen');
      expect(exigences[0].correspondances['NIS2']?.observations.contenu).toBe('Des observations');
      expect(exigences[0].correspondances['NIS2']?.exigences).toEqual([
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
          contenuEnAnglais: 'The entity’s executive officer...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
          contenuEnAnglais: 'The entity defines and implements...',
        },
      ]);
    });
  });

  describe("lorsqu'il récupère les exigences AE", () => {
    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: '1.2.3',
                  Contenu: 'Le contenu de 1.2.3',
                  Content: 'Content of 1.2.3',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité...", "contenuEnAnglais": "The entity’s executive officer..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre...", "contenuEnAnglais": "The entity defines and implements..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('AE', 'NIS2');

      expect(exigences[0].correspondances['NIS2']?.niveau).toBe('moyen');
      expect(exigences[0].correspondances['NIS2']?.observations.contenu).toBe('Des observations');
      expect(exigences[0].correspondances['NIS2']?.exigences).toEqual([
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
          contenuEnAnglais: 'The entity’s executive officer...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
          contenuEnAnglais: 'The entity defines and implements...',
        },
      ]);
    });
  });

  describe("lorsqu'il récupère les exigences CyFun23", () => {
    it('sait récupérer les informations des exigences', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ID.AM-1.3',
                  Contenu: 'Lorsque du matériel non autorisé est détecté, ...',
                  Content: 'When unauthorized hardware is detected, ...',
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
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('CyFun23', 'NIS2');

      expect(exigences[0].reference).toBe('ID.AM-1.3');
      expect(exigences[0].contenu).toBe('Lorsque du matériel non autorisé est détecté, ...');
      expect(exigences[0].contenuEnAnglais).toBe('When unauthorized hardware is detected, ...');
      expect(exigences[0].fonction).toBe('Identifier');
      expect(exigences[0].niveauAssurance).toBe('Essentiel');
      expect(exigences[0].estMesureCle).toBe(true);
    });

    it('sait récupérer, pour chaque exigence, la liste des correspondances', async () => {
      clientHttp.get = fabriqueClientGet(async () => {
        return {
          data: {
            records: [
              {
                fields: {
                  Reference: 'ID.AM-1.3',
                  Contenu: 'Lorsque du matériel non autorisé est détecté, ...',
                  Content: 'When unauthorized hardware is detected, ...',
                  Niveau: 'O',
                  Observations: 'Des observations',
                  ExigencesCible:
                    '[{"reference":"2.A.1-EI/EE","contenu":"Le dirigeant exécutif de l’entité...", "contenuEnAnglais": "The entity’s executive officer..."},{"reference":"2.A.3-EI/EE","contenu":"L’entité définit et met en œuvre...", "contenuEnAnglais": "The entity defines and implements..."}]',
                },
              },
            ] satisfies ExigenceGrist[],
          },
        };
      });

      const exigences = await entrepotExigenceGrist.parReferentiel('CyFun23', 'NIS2');

      expect(exigences[0].correspondances['NIS2']?.niveau).toBe('moyen');
      expect(exigences[0].correspondances['NIS2']?.observations.contenu).toBe('Des observations');
      expect(exigences[0].correspondances['NIS2']?.exigences).toEqual([
        {
          reference: '2.A.1-EI/EE',
          contenu: 'Le dirigeant exécutif de l’entité...',
          contenuEnAnglais: 'The entity’s executive officer...',
        },
        {
          reference: '2.A.3-EI/EE',
          contenu: 'L’entité définit et met en œuvre...',
          contenuEnAnglais: 'The entity defines and implements...',
        },
      ]);
    });
  });
});
