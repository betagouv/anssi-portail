import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import assert from 'node:assert';
import { DemandeAide } from '../../../src/infra/adaptateurMonAideCyber';
import { CorpsDemandeAide } from '../../../src/api/mon-aide-cyber/ressourceDemandesAide';

const uneDemandeAide = (parametres?: {
  email?: string;
  emailAidant?: string;
  departement?: string;
  raisonSociale?: string;
}): CorpsDemandeAide => ({
  email: 'durant@mail.fr',
  ...(parametres?.emailAidant && { emailAidant: parametres?.emailAidant }),
  entite: {
    departement: parametres?.departement || '12',
    raisonSociale: parametres?.raisonSociale || 'Une raison sociale',
  },
  validationCGU: true,
});

describe('Quand requête POST sur `/api/mon-aide-cyber/demandes-aide`', () => {
  let serveur: Express;
  const adaptateurMonAideCyber = {
    creeDemandeAide: async (_: DemandeAide) => {},
  };

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurMonAideCyber,
    });
  });

  it('retourne une 201', async () => {
    const reponse = await request(serveur)
      .post('/api/mon-aide-cyber/demandes-aide')
      .send(uneDemandeAide());

    assert.equal(reponse.status, 201);
  });

  it('envoie la demande d’aide à MAC', async () => {
    let demandeAideEnvoyee: DemandeAide | undefined = undefined;
    adaptateurMonAideCyber.creeDemandeAide = async (
      demandeAide: DemandeAide
    ) => {
      demandeAideEnvoyee = demandeAide;
    };

    await request(serveur)
      .post('/api/mon-aide-cyber/demandes-aide')
      .send(uneDemandeAide({ email: 'durant@mail.fr' }));

    assert.deepEqual(demandeAideEnvoyee, {
      email: 'durant@mail.fr',
      departement: '12',
      raisonSociale: 'Une raison sociale',
    });
  });

  describe('aseptise les paramètres', () => {
    it('pour le mail de l’entité Aidée', async () => {
      let emailEnvoye = '';
      adaptateurMonAideCyber.creeDemandeAide = async ({
        email,
      }: DemandeAide) => {
        emailEnvoye = email;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(uneDemandeAide({ email: '   durant@mail.fr   ' }));

      assert.equal(emailEnvoye, 'durant@mail.fr');
    });

    it('pour le mail de l’Aidant si l’entité est en relation', async () => {
      let emailEnvoye: string | undefined = undefined;
      adaptateurMonAideCyber.creeDemandeAide = async ({
        emailAidant,
      }: DemandeAide) => {
        emailEnvoye = emailAidant;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(uneDemandeAide({ emailAidant: '   aidant@mail.fr   ' }));

      assert.equal(emailEnvoye, 'aidant@mail.fr');
    });

    it('pour le département de l’entité', async () => {
      let departementEnvoye: string = '';
      adaptateurMonAideCyber.creeDemandeAide = async ({
        departement,
      }: DemandeAide) => {
        departementEnvoye = departement;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(uneDemandeAide({ departement: '   12   ' }));

      assert.equal(departementEnvoye, '12');
    });

    it('pour la raison sociale de l’entité', async () => {
      let raisonSocialeEnvoyee: string = '';
      adaptateurMonAideCyber.creeDemandeAide = async ({
        raisonSociale,
      }: DemandeAide) => {
        raisonSocialeEnvoyee = raisonSociale;
      };

      await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send(
          uneDemandeAide({
            email: 'durant@mail.fr',
            departement: '12',
            raisonSociale: '   Une raison sociale   ',
          })
        );

      assert.equal(raisonSocialeEnvoyee, 'Une raison sociale');
    });
  });

  describe('valide les paramètres', () => {
    it('pour le mail de l’entité', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          email: 'ceci-n-est-pas-un-mail.fr',
          entite: { departement: '12', raisonSociale: 'Une raison sociale' },
        });

      assert.equal(reponse.status, 400);
      assert.equal(
        await reponse.body.erreur,
        'Veuillez saisir un email valide.'
      );
    });

    it('pour le mail de l’Aidant si l’entité est en relation', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          email: 'jean.dupont@mail.fr',
          emailAidant: 'ceci-n-est-pas-un-mail.fr',
          entite: { departement: '12', raisonSociale: 'Une raison sociale' },
        });

      assert.equal(reponse.status, 400);
      assert.equal(
        await reponse.body.erreur,
        'Veuillez saisir un email valide pour l’Aidant.'
      );
    });

    it('pour la validation des CGU', async () => {
      const reponse = await request(serveur)
        .post('/api/mon-aide-cyber/demandes-aide')
        .send({
          email: 'jean.dupont@mail.fr',
          validationCGU: false,
          entite: { departement: '12', raisonSociale: 'Une raison sociale' },
        });

      assert.equal(reponse.status, 400);
      assert.equal(await reponse.body.erreur, 'Veuillez valider les CGU.');
    });

    it('pour la validation du département', async () => {
      const reponse = await request(serveur)
          .post('/api/mon-aide-cyber/demandes-aide')
          .send({
            email: 'jean.dupont@mail.fr',
            validationCGU: true,
            entite: { departement: '1000', raisonSociale: 'Une raison sociale' },
          });

      assert.equal(reponse.status, 400);
      assert.equal(await reponse.body.erreur, 'Veuillez saisir un département valide.');
    });

    it('pour la validation de la raison sociale', async () => {
      const reponse = await request(serveur)
          .post('/api/mon-aide-cyber/demandes-aide')
          .send({
            email: 'jean.dupont@mail.fr',
            validationCGU: true,
            entite: { departement: '01', raisonSociale: '   ' },
          });

      assert.equal(reponse.status, 400);
      assert.equal(await reponse.body.erreur, 'Veuillez saisir une raison sociale valide.');
    });
  });
});
