import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { ClientHttp } from '../../../src/infra/clientHttp';
import {
  EntrepotExigenceGrist,
  ExigenceGrist,
} from '../../../src/infra/nis2/entrepotExigenceGrist';
import { ReponseGrist } from '../../../src/infra/entrepotGrist';
import { fauxAdaptateurEnvironnement } from '../../api/fauxObjets';
import { FournisseurHorlogeDeTest } from '../fournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../src/infra/fournisseurHorloge';

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

    const exigences = await entrepotExigenceGristHorsLigne.parReferentiel('');

    assert.deepEqual(exigences, []);
  });

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

    await entrepotExigenceGrist.parReferentiel('nis2');

    assert.equal(headerAuthent, 'Bearer FAUSSE_CLE_API_SOCLE');
    assert.equal(
      urlAppelee,
      'http://grist/api/docs/idDeDocumentSocle/tables/idTableExigencesNis2/records'
    );
  });

  it('sait récupérer les données des exigences', async () => {
    clientHttp.get = async () => {
      return {
        data: {
          records: [
            {
              id: 10,
              fields: {
                References_New_: ['L', '1.1-EI/EE'],
                Objectif_de_securite:
                  "Objectif de sécurité 1: Recensement des systèmes d'information",
                Thematique: 'Recensement des SI',
                Contenu: 'L’entité liste l’ensemble de ses activités',
                EIEE: ['L', 'EI', 'EE'],
              },
            },
            {
              id: 21,
              fields: {
                References_New_: ['L', '2.A.3-EI/EE'],
                Objectif_de_securite:
                  "Objectif de sécurité 2: Mise en œuvre d'un cadre de gouvernance de la sécurité numérique",
                Thematique: 'Rôles et responsabilités',
                Contenu: 'L’entité définit et met en œuvre une organisation',
                EIEE: ['L', 'EE'],
              },
            },
          ] satisfies ExigenceGrist[],
        },
      };
    };

    const exigences = await entrepotExigenceGrist.parReferentiel('nis2');

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

  it("n'appelle pas Grist si les données sont en cache", async () => {
    let nombreAppel = 0;
    clientHttp.get = async <T>() => {
      nombreAppel++;
      return {
        data: { records: [] } as unknown as T,
      };
    };

    await entrepotExigenceGrist.parReferentiel('nis2');
    ilSePasse20Secondes();
    await entrepotExigenceGrist.parReferentiel('nis2');

    assert.equal(nombreAppel, 1);
  });
});
