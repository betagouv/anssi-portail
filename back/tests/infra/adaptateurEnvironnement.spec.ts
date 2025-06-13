import { afterEach, beforeEach, describe, it } from 'node:test';
import { adaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import assert from 'node:assert';

describe("L'adaptateur environnement", () => {
  let envActuel: NodeJS.ProcessEnv;

  beforeEach(() => {
    envActuel = process.env;
  });

  afterEach(() => {
    process.env = envActuel;
  });

  it('sait charger les secrets', async () => {
    process.env = {
      HACHAGE_SECRET_DE_HACHAGE_1: 'secret1',
      HACHAGE_SECRET_DE_HACHAGE_2: 'secret2',
    };

    const tousLesSecretsDeHachage = adaptateurEnvironnement
      .hachage()
      .tousLesSecretsDeHachage();

    assert.deepEqual(tousLesSecretsDeHachage, [
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
    ]);
  });

  it('charge les secrets dans le bon ordre', async () => {
    process.env = {
      HACHAGE_SECRET_DE_HACHAGE_1: 'secret1',
      HACHAGE_SECRET_DE_HACHAGE_3: 'secret3',
      HACHAGE_SECRET_DE_HACHAGE_2: 'secret2',
    };

    const tousLesSecretsDeHachage = adaptateurEnvironnement
      .hachage()
      .tousLesSecretsDeHachage();

    assert.deepEqual(tousLesSecretsDeHachage, [
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
      { version: 3, secret: 'secret3' },
    ]);
  });

  it('ne charge pas les secrets qui ne correspondent pas au format indiqué', async () => {
    process.env = {
      HACHAGE_SECRET_DE_HACHAGE_1: 'secret1',
      HACHAGE_SECRET_DE_HACHAGE_V3: 'secret3',
      HACHAGE_SECRET_DE_HACHAGE_2: 'secret2',
    };

    const tousLesSecretsDeHachage = adaptateurEnvironnement
      .hachage()
      .tousLesSecretsDeHachage();

    assert.deepEqual(tousLesSecretsDeHachage, [
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
    ]);
  });

  it('utilise des entiers pour les versions', () => {
    process.env = { HACHAGE_SECRET_DE_HACHAGE_1: 'secret1' };

    const tousLesSecretsDeHachage = adaptateurEnvironnement
      .hachage()
      .tousLesSecretsDeHachage();

    assert.equal(tousLesSecretsDeHachage[0].version, 1);
  });

  it('lance une exception si un secret est vide', async () => {
    process.env = {
      HACHAGE_SECRET_DE_HACHAGE_1: '',
    };

    assert.throws(
      () => {
        adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();
      },
      {
        message: `Le secret de hachage HACHAGE_SECRET_DE_HACHAGE_1 ne doit pas être vide`,
      }
    );
  });

  it('ignore les clés qui ne concernent pas le hachage', () => {
    process.env = {
      URL_BASE: '',
      HACHAGE_SECRET_DE_HACHAGE_1: 'ok',
    };

    const secrets = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    assert.equal(secrets.length, 1);
  });
});
