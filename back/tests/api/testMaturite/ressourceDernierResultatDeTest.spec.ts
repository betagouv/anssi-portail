import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurRechercheEntreprise } from '../../../src/infra/adaptateurRechercheEntreprise';
import { CodeRegion } from '../../../src/metier/referentielRegions';
import { CodeSecteur } from '../../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../../src/metier/referentielTranchesEffectifEtablissement';
import {
  DonneesCreationResultatTestMaturite,
  ResultatTestMaturite,
} from '../../../src/metier/resultatTestMaturite';
import { ResultatTestMaturiteCreateur } from '../../metier/ResultatTestMaturiteCreateur';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurRechercheEntreprise,
} from '../fauxObjets';
import { jeanneDupont } from '../objetsPretsALEmploi';

describe('La ressource qui gère le dernier résultat de test', () => {
  let serveur: Express;
  let entrepotResultatTest: EntrepotResultatTestMemoire;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  let cookieJeanneDupont: string;

  beforeEach(async () => {
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    adaptateurRechercheEntreprise = {
      ...fauxAdaptateurRechercheEntreprise,
    };
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurRechercheEntreprise,
      entrepotResultatTest,
      entrepotUtilisateur,
    });
  });

  const donneesResultatTestCorrectes =
    (): DonneesCreationResultatTestMaturite => ({
      region: 'FR-NOR' as CodeRegion,
      secteur: 'J' as CodeSecteur,
      tailleOrganisation: '51' as CodeTrancheEffectif,
      reponses: {
        'prise-en-compte-risque': 2,
        pilotage: 3,
        budget: 5,
        'ressources-humaines': 3,
        'adoption-solutions': 2,
        posture: 3,
      },
    });

  async function ajouteResultatDeTestPourJeanne(
    donneesSupplementaires: Partial<DonneesCreationResultatTestMaturite> = {}
  ) {
    const resultatDeJeanne = new ResultatTestMaturite({
      ...donneesResultatTestCorrectes(),
      ...donneesSupplementaires,
    });
    await resultatDeJeanne.revendiquePropriete(
      jeanneDupont,
      fauxAdaptateurRechercheEntreprise
    );
    await entrepotResultatTest.ajoute(resultatDeJeanne);
    return resultatDeJeanne;
  }

  describe('sur requête GET', () => {
    describe('pour un utilisateur connecté', () => {
      const requeteGET = async () =>
        await request(serveur)
          .get('/api/resultats-test/dernier')
          .set('Cookie', [cookieJeanneDupont])
          .send();

      it('renvoie 200 et le dernier résultat de test ', async () => {
        await ajouteResultatDeTestPourJeanne();

        const reponse = await requeteGET();

        assert.equal(reponse.status, 200);
        assert.deepEqual(reponse.body.reponses, {
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        });
      });

      it('renvoie la date de réalisation du test', async () => {
        await ajouteResultatDeTestPourJeanne({
          dateRealisation: new Date(2025, 5, 11),
        });

        const reponse = await requeteGET();

        assert.equal(
          new Date(reponse.body.dateRealisation).getTime(),
          new Date(2025, 5, 11).getTime()
        );
      });

      it("renvoie une erreur 404 lorsque l'utilisateur n'a pas de test", async () => {
        const reponse = await requeteGET();

        assert.equal(reponse.status, 404);
      });

      it('renvoie le niveau du test', async () => {
        await new ResultatTestMaturiteCreateur()
          .deNiveau('insuffisant')
          .pour(jeanneDupont)
          .dansEntrepot(entrepotResultatTest)
          .cree();

        const reponse = await requeteGET();

        assert.equal(reponse.body.idNiveau, 'insuffisant');
      });

      describe('concernant les informations de mon organisation', () => {
        let codeTrancheEffectifRenvoyeParRechercheEntreprise:
          | CodeTrancheEffectif
          | undefined = '11';
        let codeSecteurRenvoyeParRechercheEntreprise: CodeSecteur | undefined;
        let codeRegionRenvoyeParRechercheEntreprise: CodeRegion | undefined =
          'FR-971';
        let resultatTestMaturite: ResultatTestMaturite;

        beforeEach(async () => {
          resultatTestMaturite = await ajouteResultatDeTestPourJeanne();
          adaptateurRechercheEntreprise.rechercheOrganisations = async (
            terme
          ) => {
            return terme === '13000766900018'
              ? [
                  {
                    departement: 'Nord',
                    nom: 'Friterie',
                    siret: '13000766900018',
                    codeTrancheEffectif:
                      codeTrancheEffectifRenvoyeParRechercheEntreprise,
                    codeSecteur: codeSecteurRenvoyeParRechercheEntreprise,
                    codeRegion: codeRegionRenvoyeParRechercheEntreprise,
                    estCollectivite: false,
                    estAssociation: false,
                  },
                ]
              : [];
          };
        });

        it('renvoie les détails', async () => {
          codeTrancheEffectifRenvoyeParRechercheEntreprise = '21';
          codeSecteurRenvoyeParRechercheEntreprise = 'U';
          codeRegionRenvoyeParRechercheEntreprise = 'FR-HDF';

          const reponse = await requeteGET();

          assert.deepEqual(reponse.body.organisation, {
            trancheEffectif: { code: '21', libelle: '50 à 99 salariés' },
            secteur: { code: 'U', libelle: 'Activités extra-territoriales' },
            region: { code: 'FR-HDF', libelle: 'Hauts-de-France' },
          });
        });

        describe('en cas d’absence de données dans l’API', () => {
          it("reste robuste lorsque la tranche d'effectif n'est pas définie", async () => {
            codeTrancheEffectifRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.tailleOrganisation = undefined;

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.trancheEffectif, undefined);
          });

          it("reste robuste lorsque la région n'est pas définie", async () => {
            codeRegionRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.region = undefined;

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.region, undefined);
          });

          it("reste robuste lorsque le secteur n'est pas défini", async () => {
            codeSecteurRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.secteur = undefined;

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.secteur, undefined);
          });

          it('utilise la région du test', async () => {
            codeRegionRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.region = 'FR-COM';

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.region.code, 'FR-COM');
          });

          it('utilise la tranche d’effectif du test', async () => {
            codeTrancheEffectifRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.tailleOrganisation = '53';

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.trancheEffectif.code, '53');
          });

          it('utilise le secteur du test', async () => {
            codeSecteurRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.secteur = 'B';

            const reponse = await requeteGET();

            assert.equal(reponse.body.organisation.secteur.code, 'B');
          });
        });
      });
    });

    describe('pour un utilisateur non connecté', () => {
      const requeteGET = async () =>
        await request(serveur).get('/api/resultats-test/dernier').send();

      it('renvoie une erreur 401', async () => {
        await entrepotResultatTest.ajoute(
          new ResultatTestMaturite(donneesResultatTestCorrectes())
        );

        const reponse = await requeteGET();

        assert.equal(reponse.status, 401);
      });
    });
  });
});
