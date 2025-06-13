import { describe, it } from 'node:test';
import {
  fauxAdaptateurEnvironnement,
  fauxAdaptateurHachage,
} from '../api/fauxObjets';
import { fabriqueServiceVerificationCoherenceSecretsHachage } from '../../src/infra/serviceVerificationCoherenceSecretsHachage';
import { EntrepotSecretHachage } from '../../src/infra/entrepotSecretHachagePostgres';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import assert from 'assert';

describe('Le service de vérification de la cohérence des secrets de hachage', () => {
  it('jette une erreur si un secret est invalide', async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [
          { version: 1, secret: 'unAutreSecret' },
        ],
      }),
    };
    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [{ version: 1, empreinte: 'secret-crypte' }],
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      compareBCrypt: async () => false,
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.rejects(
      () => service.verifieCoherenceSecrets(),
      {
        message:
          '💥 La version 1 du secret de la config a une valeur différente de celle déjà appliquée.',
      },
      'La méthode aurait dû lever une erreur'
    );
  });

  it("jette une erreur si le deuxième secret est invalide, peu importe l'ordre", async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [
          { version: 2, secret: 'unAutresecret' },
          { version: 1, secret: 'secret' },
        ],
      }),
    };
    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [
        { version: 1, empreinte: 'secret-crypte' },
        { version: 2, empreinte: 'secret2-crypte' },
      ],
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      compareBCrypt: async (secretEnClair) => secretEnClair !== 'unAutresecret',
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.rejects(
      () => service.verifieCoherenceSecrets(),
      {
        message:
          '💥 La version 2 du secret de la config a une valeur différente de celle déjà appliquée.',
      },
      'La méthode aurait dû lever une erreur'
    );
  });

  it('ne fait rien si tous les secrets sont valides', async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [
          { version: 1, secret: 'secret' },
          { version: 2, secret: 'secret2' },
        ],
      }),
    };
    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [
        { version: 1, empreinte: 'secret-crypte' },
        { version: 2, empreinte: 'secret2-crypte' },
      ],
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      compareBCrypt: async () => true,
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.doesNotReject(() => service.verifieCoherenceSecrets());
  });

  it("jette une erreur si un secret n'est pas présent dans la persistance", async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [
          { version: 1, secret: 'secret' },
          { version: 2, secret: 'secret2' },
        ],
      }),
    };
    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [{ version: 2, empreinte: 'secret2-crypte' }],
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      compareBCrypt: async () => true,
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.rejects(
      () => service.verifieCoherenceSecrets(),
      {
        message:
          '💥 La version 1 du secret noté dans la config est manquante dans la persistance.',
      },
      'La méthode aurait dû lever une erreur'
    );
  });

  it("jette une erreur si un secret de la persistance n'est pas présent dans la config", async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [{ version: 2, secret: 'secret2' }],
      }),
    };
    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [
        { version: 2, empreinte: 'secret2-crypte' },
        { version: 1, empreinte: 'secret-crypte' },
      ],
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      compareBCrypt: async () => true,
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.rejects(
      () => service.verifieCoherenceSecrets(),
      {
        message:
          '💥 La version 1 du secret déjà appliquée est manquante dans la config.',
      },
      'La méthode aurait dû lever une erreur'
    );
  });

  it("jette une erreur si aucun secret n'est présent dans la config", async () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      hachage: () => ({
        tousLesSecretsDeHachage: () => [],
      }),
    };

    const entrepotSecretHachage: EntrepotSecretHachage = {
      tous: async () => [{ version: 1, empreinte: 'secret-crypte' }],
    };

    const service = fabriqueServiceVerificationCoherenceSecretsHachage({
      adaptateurHachage: fauxAdaptateurHachage,
      entrepotSecretHachage,
      adaptateurEnvironnement,
    });

    await assert.rejects(
      () => service.verifieCoherenceSecrets(),
      {
        message: '💥 Aucun secret de hachage dans la config.',
      },
      'La méthode aurait dû lever une erreur'
    );
  });
});
