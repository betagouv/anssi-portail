import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import z from 'zod';
import { schemaRessourceDemandesAide } from '../../../src/api/mon-aide-cyber/ressourceDemandesAide.schema';
import { creeServeur } from '../../../src/api/msc';
import { DemandeAide } from '../../../src/infra/adaptateurMonAideCyber';
import { adaptateurMonAideCyberVide } from '../../../src/infra/adaptateurMonAideCyberVide';
import { CodeDepartement } from '../../../src/metier/referentielDepartements';
import { configurationDeTestDuServeur } from '../fauxObjets';

type CorpsDemandeAide = z.infer<typeof schemaRessourceDemandesAide>;

const uneDemandeAide = (parametres?: {
  email?: string;
  emailAidant?: string;
  identifiantAidant?: string;
  departement?: string;
  raisonSociale?: string;
  siret?: string;
  origine?: string;
  siretAidant?: string;
}): CorpsDemandeAide => ({
  ...(parametres?.origine && { origine: parametres.origine }),
  ...(parametres?.emailAidant && { emailAidant: parametres?.emailAidant }),
  ...(parametres?.siretAidant && {
    siretAidant: parametres?.siretAidant,
  }),
  ...(parametres?.identifiantAidant && {
    identifiantAidant: parametres?.identifiantAidant,
  }),
  entiteAidee: {
    email: parametres?.email || 'durant@mail.fr',
    departement: (parametres?.departement || '12') as CodeDepartement,
    raisonSociale: parametres?.raisonSociale || 'Une raison sociale',
    siret: parametres?.siret || '12345678901237',
  },
  validationCGU: true,
});

describe('Quand requête POST sur `/api/mon-aide-cyber/demandes-aide`', () => {
  let serveur: Express;
  const adaptateurMonAideCyber = adaptateurMonAideCyberVide();

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurMonAideCyber,
    });
  });

  it('retourne une 201', async () => {
    const reponse = await request(serveur).post('/api/mon-aide-cyber/demandes-aide').send(uneDemandeAide());

    assert.equal(reponse.status, 201);
  });

  describe('envoie la demande d’aide à MAC', () => {
    it('pour une demande sans aidant', async () => {
      let demandeAideEnvoyee: DemandeAide | undefined = undefined;
      adaptateurMonAideCyber.creeDemandeAide = async (demandeAide: DemandeAide) => {
        demandeAideEnvoyee = demandeAide;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(uneDemandeAide({ email: 'durant@mail.fr', siret: '12345678901237' }));

      assert.deepEqual(demandeAideEnvoyee, {
        entiteAidee: {
          email: 'durant@mail.fr',
          departement: '12',
          raisonSociale: 'Une raison sociale',
          siret: '12345678901237',
        },
        aidant: {},
      });
    });

    it("pour une demande avec siret de l'aidant", async () => {
      let demandeAideEnvoyee: DemandeAide | undefined = undefined;
      adaptateurMonAideCyber.creeDemandeAide = async (demandeAide: DemandeAide) => {
        demandeAideEnvoyee = demandeAide;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(
          uneDemandeAide({
            email: 'durant@mail.fr',
            siret: '12345678901237',
            siretAidant: '12345678901237',
          })
        );

      assert.deepEqual(demandeAideEnvoyee, {
        entiteAidee: {
          email: 'durant@mail.fr',
          departement: '12',
          raisonSociale: 'Une raison sociale',
          siret: '12345678901237',
        },
        aidant: { siret: '12345678901237' },
      });
    });
  });

  it('gère les cas d’erreurs lors de la demande d’Aide', async () => {
    adaptateurMonAideCyber.creeDemandeAide = async (_demandeAide: DemandeAide) => {
      throw new Error('une erreur quelconque');
    };

    const reponse = await request(serveur)
      .post('/api/mon-aide-cyber/demandes-aide')
      .send(uneDemandeAide({ email: 'durant@mail.fr' }));

    assert.equal(reponse.status, 400);
    assert.equal(reponse.body.erreur, 'une erreur quelconque');
  });

  describe('aseptise les paramètres', () => {
    it('pour la raison sociale de l’entité', async () => {
      let raisonSocialeEnvoyee: string = '';
      adaptateurMonAideCyber.creeDemandeAide = async ({ entiteAidee: { raisonSociale } }: DemandeAide) => {
        raisonSocialeEnvoyee = raisonSociale;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(
          uneDemandeAide({
            email: 'durant@mail.fr',
            departement: '12',
            raisonSociale: 'Une raison <sociale>',
          })
        );

      assert.equal(raisonSocialeEnvoyee, 'Une raison &lt;sociale&gt;');
    });
  });

  describe('valide les paramètres', () => {
    it('pour le mail de l’entité', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          entiteAidee: {
            email: 'ceci-n-est-pas-un-mail.fr',
            departement: '12',
            raisonSociale: 'Une raison sociale',
            siret: '12345678901237',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.entiteAidee[0], 'Veuillez saisir un email valide.');
    });

    it('pour le SIRET de l’entité', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          validationCGU: true,
          entiteAidee: {
            email: 'jean.dupont@email.fr',
            departement: '12',
            raisonSociale: 'Une raison sociale',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.entiteAidee[0], 'Veuillez saisir un SIRET valide.');
    });

    it('pour le mail de l’Aidant si l’entité est en relation', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          emailAidant: 'ceci-n-est-pas-un-mail.fr',
          entiteAidee: {
            email: 'jean.dupont@mail.fr',
            departement: '12',
            raisonSociale: 'Une raison sociale',
            siret: '12345678901237',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.emailAidant[0], 'Veuillez saisir un email valide pour l’Aidant cyber.');
    });

    it('pour la validation des CGU', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          validationCGU: false,
          entiteAidee: {
            email: 'jean.dupont@mail.fr',
            departement: '12',
            raisonSociale: 'Une raison sociale',
            siret: '12345678901237',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.validationCGU[0], 'Veuillez valider les CGU.');
    });

    it('pour la validation du département', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          email: 'jean.dupont@mail.fr',
          validationCGU: true,
          entiteAidee: { departement: '1000', raisonSociale: 'Une raison sociale' },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.entiteAidee[0], 'Veuillez saisir un département valide.');
    });

    it('pour la validation de la raison sociale', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          email: 'jean.dupont@mail.fr',
          validationCGU: true,
          entiteAidee: {
            departement: '01',
            raisonSociale: '',
            siret: '12345678901237',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.entiteAidee[0], 'Veuillez saisir une raison sociale valide.');
    });

    it('pour la validation de l’identifiant Aidant', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          validationCGU: true,
          entiteAidee: {
            departement: '33',
            raisonSociale: 'beta-gouv',
            email: 'jean.dupont@mail.fr',
            siret: '12345678901237',
          },
          identifiantAidant: '  a ',
        });

      assert.equal(reponse.status, 400);
      assert.equal(
        reponse.body.fieldErrors.identifiantAidant[0],
        'Veuillez saisir un identifiant Aidant cyber valide.'
      );
    });

    it('pour la validation du SIRET Aidant', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          validationCGU: true,
          entiteAidee: {
            departement: '33',
            raisonSociale: 'beta-gouv',
            email: 'jean.dupont@mail.fr',
            siret: '12345678901237',
          },
          siretAidant: '01234',
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.siretAidant[0], 'Veuillez saisir un SIRET Aidant cyber valide.');
    });

    it('pour l’origine de la demande', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          origine: '   ',
          validationCGU: true,
          entiteAidee: {
            departement: '33',
            raisonSociale: 'beta-gouv',
            email: 'jean.dupont@mail.fr',
            siret: '12345678901237',
          },
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.origine[0], 'Veuillez saisir une origine valide.');
    });
  });
});
