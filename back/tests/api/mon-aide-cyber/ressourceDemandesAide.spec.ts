import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import assert from 'node:assert';
import { DemandeAide } from '../../../src/infra/adaptateurMonAideCyber';

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
      .send({});

    assert.equal(reponse.status, 201);
  });

  it('envoie la demande d’aide à MAC', async () => {
    let emailEnvoye = '';
    adaptateurMonAideCyber.creeDemandeAide = async ({ email }: DemandeAide) => {
      emailEnvoye = email;
    };

    await request(serveur)
      .post('/api/mon-aide-cyber/demandes-aide')
      .send({ email: 'durant@mail.fr' });

    assert.equal(emailEnvoye, 'durant@mail.fr');
  });
});
