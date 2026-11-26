import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { RésultatTestMaturité } from '@metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { CodeRégion } from '@metier/referentielRegions.js';
import { CodeSecteur } from '@metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '@metier/referentielTranchesEffectifEtablissement.js';
import { creeServeur } from '@api/msc/index.js';
import { AdaptateurRechercheEntreprise } from '@infra/adaptateurRechercheEntreprise.js';

import { ResultatTestMaturiteCreateur } from '../../../metier/mini-tests/maturite-cyber/ResultatTestMaturiteCreateur.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurRechercheEntreprise } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';
import { ConstructeurRésultatTestMaturité, unRésultatDeTestDeMaturité } from './constructeurResultatTestMaturite.js';

describe('La ressource qui gère le dernier résultat de test', () => {
  let serveur: Express;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  let cookieJeanneDupont: string;

  beforeEach(async () => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
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
      entrepôtRésultatTestMaturité,
      entrepotUtilisateur,
    });
  });

  async function ajouteRésultatDeTestPourJeanne(constructeurFournis?: ConstructeurRésultatTestMaturité) {
    const constructeur = constructeurFournis ?? unRésultatDeTestDeMaturité();
    const résultatDeJeanne = await constructeur.pour(jeanneDupont).construis();
    await entrepôtRésultatTestMaturité.ajoute(résultatDeJeanne);
    return résultatDeJeanne;
  }

  describe('sur requête GET', () => {
    describe('pour un utilisateur connecté', () => {
      const requeteGET = async () =>
        await request(serveur).get('/api/resultats-test/dernier').set('Cookie', [cookieJeanneDupont]).send();

      it('renvoie 200 et le dernier résultat de test ', async () => {
        await ajouteRésultatDeTestPourJeanne();

        const reponse = await requeteGET();

        expect(reponse.status).toBe(HttpStatusCode.Ok);
        expect(reponse.body.reponses).toEqual({
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        });
      });

      it('renvoie la date de réalisation du test', async () => {
        await ajouteRésultatDeTestPourJeanne(unRésultatDeTestDeMaturité().avecDateRéalisation(new Date(2025, 5, 11)));

        const reponse = await requeteGET();

        expect(new Date(reponse.body.dateRealisation).getTime()).toBe(new Date(2025, 5, 11).getTime());
      });

      it("renvoie une erreur 404 lorsque l'utilisateur n'a pas de test", async () => {
        const reponse = await requeteGET();

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
      });

      it('renvoie le niveau du test', async () => {
        await new ResultatTestMaturiteCreateur()
          .deNiveau('insuffisant')
          .pour(jeanneDupont)
          .dansEntrepot(entrepôtRésultatTestMaturité)
          .cree();

        const reponse = await requeteGET();

        expect(reponse.body.idNiveau).toBe('insuffisant');
      });

      describe('concernant les informations de mon organisation', () => {
        let codeTrancheEffectifRenvoyeParRechercheEntreprise: CodeTrancheEffectif | undefined = '11';
        let codeSecteurRenvoyeParRechercheEntreprise: CodeSecteur | undefined;
        let codeRegionRenvoyeParRechercheEntreprise: CodeRégion | undefined = 'FR-971';
        let resultatTestMaturite: RésultatTestMaturité;

        beforeEach(async () => {
          resultatTestMaturite = await ajouteRésultatDeTestPourJeanne();
          adaptateurRechercheEntreprise.rechercheOrganisation = async (terme) => {
            return terme === '13000766900018'
              ? {
                  departement: 'Nord',
                  nom: 'Friterie',
                  siret: '13000766900018',
                  codeTrancheEffectif: codeTrancheEffectifRenvoyeParRechercheEntreprise,
                  codeSecteur: codeSecteurRenvoyeParRechercheEntreprise,
                  codeRegion: codeRegionRenvoyeParRechercheEntreprise,
                  estCollectivite: false,
                  estAssociation: false,
                  codeActivite: '62.01Z',
                }
              : undefined;
          };
        });

        it('renvoie les détails', async () => {
          codeTrancheEffectifRenvoyeParRechercheEntreprise = '21';
          codeSecteurRenvoyeParRechercheEntreprise = 'U';
          codeRegionRenvoyeParRechercheEntreprise = 'FR-HDF';

          const reponse = await requeteGET();

          expect(reponse.body.organisation).toEqual({
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

            expect(reponse.body.organisation.trancheEffectif).toBeUndefined();
          });

          it("reste robuste lorsque la région n'est pas définie", async () => {
            codeRegionRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.region = undefined;

            const reponse = await requeteGET();

            expect(reponse.body.organisation.region).toBeUndefined();
          });

          it("reste robuste lorsque le secteur n'est pas défini", async () => {
            codeSecteurRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.secteur = undefined;

            const reponse = await requeteGET();

            expect(reponse.body.organisation.secteur).toBeUndefined();
          });

          it('utilise la région du test', async () => {
            codeRegionRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.region = 'FR-ARA';

            const reponse = await requeteGET();

            expect(reponse.body.organisation.region.code).toBe('FR-ARA');
          });

          it('utilise la tranche d’effectif du test', async () => {
            codeTrancheEffectifRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.tailleOrganisation = '53';

            const reponse = await requeteGET();

            expect(reponse.body.organisation.trancheEffectif.code).toBe('53');
          });

          it('utilise le secteur du test', async () => {
            codeSecteurRenvoyeParRechercheEntreprise = undefined;
            resultatTestMaturite.secteur = 'B';

            const reponse = await requeteGET();

            expect(reponse.body.organisation.secteur.code).toBe('B');
          });
        });
      });

      describe("en cas de réponse incorrecte de l'API", () => {
        it('sans données de test préalables', async () => {
          const résultat = await ajouteRésultatDeTestPourJeanne();
          résultat.region = undefined;
          résultat.secteur = undefined;
          résultat.tailleOrganisation = undefined;
          adaptateurRechercheEntreprise.rechercheOrganisation = async () => undefined;

          const réponse = await requeteGET();

          expect(réponse.status).toBe(HttpStatusCode.Ok);
          expect(réponse.body.organisation).toBeUndefined();
        });

        it('avec données de test préalables', async () => {
          await ajouteRésultatDeTestPourJeanne(
            unRésultatDeTestDeMaturité().avecRégion('FR-20R').avecSecteur('C').avecTailleOrganisation('12')
          );
          adaptateurRechercheEntreprise.rechercheOrganisation = async () => undefined;

          const réponse = await requeteGET();

          expect(réponse.status).toBe(HttpStatusCode.Ok);
          expect(réponse.body.organisation.region.code).toBe('FR-20R');
          expect(réponse.body.organisation.secteur.code).toBe('C');
          expect(réponse.body.organisation.trancheEffectif.code).toBe('12');
        });
      });
    });

    describe('pour un utilisateur non connecté', () => {
      const requeteGET = async () => await request(serveur).get('/api/resultats-test/dernier').send();

      it('renvoie une erreur 401', async () => {
        await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().construis());

        const reponse = await requeteGET();

        expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
      });
    });
  });
});
