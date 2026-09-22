import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';

describe("L'adaptateur environnement", () => {
  beforeEach(() => {
    for (const cle of Object.keys(process.env).filter((cle) => cle.startsWith('HACHAGE_SECRET_DE_HACHAGE_'))) {
      vi.stubEnv(cle, undefined);
    }
  });

  it('sait charger les secrets', async () => {
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', 'secret1');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_2', 'secret2');

    const tousLesSecretsDeHachage = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    expect(tousLesSecretsDeHachage).toEqual([
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
    ]);
  });

  it('charge les secrets dans le bon ordre', async () => {
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', 'secret1');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_3', 'secret3');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_2', 'secret2');

    const tousLesSecretsDeHachage = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    expect(tousLesSecretsDeHachage).toEqual([
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
      { version: 3, secret: 'secret3' },
    ]);
  });

  it('ne charge pas les secrets qui ne correspondent pas au format indiqué', async () => {
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', 'secret1');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_V3', 'secret3');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_2', 'secret2');

    const tousLesSecretsDeHachage = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    expect(tousLesSecretsDeHachage).toEqual([
      { version: 1, secret: 'secret1' },
      { version: 2, secret: 'secret2' },
    ]);
  });

  it('utilise des entiers pour les versions', () => {
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', 'secret1');

    const tousLesSecretsDeHachage = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    expect(tousLesSecretsDeHachage[0].version).toBe(1);
  });

  it('lance une exception si un secret est vide', async () => {
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', '');

    expect(() => {
      adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();
    }).toThrow(
      expect.objectContaining({ message: `Le secret de hachage HACHAGE_SECRET_DE_HACHAGE_1 ne doit pas être vide` })
    );
  });

  it('ignore les clés qui ne concernent pas le hachage', () => {
    vi.stubEnv('URL_BASE', '');
    vi.stubEnv('HACHAGE_SECRET_DE_HACHAGE_1', 'ok');

    const secrets = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    expect(secrets).toHaveLength(1);
  });

  it('lance une exception si SECRET_JWT est vide', () => {
    vi.stubEnv('SECRET_JWT', '');

    expect(() => {
      adaptateurEnvironnement.secrets().jwt();
    }).toThrow(expect.objectContaining({ message: '💥 Veuillez renseigner le secret JWT' }));
  });

  it('lance une exception si SECRET_JWT est non défini', () => {
    vi.stubEnv('SECRET_JWT', undefined);

    expect(() => {
      adaptateurEnvironnement.secrets().jwt();
    }).toThrow(expect.objectContaining({ message: '💥 Veuillez renseigner le secret JWT' }));
  });

  it('lance une exception si SECRET_COOKIE est vide', () => {
    vi.stubEnv('SECRET_COOKIE', '');

    expect(() => {
      adaptateurEnvironnement.secrets().cookie();
    }).toThrow(expect.objectContaining({ message: '💥 Veuillez renseigner le secret COOKIE' }));
  });

  it('lance une exception si SECRET_COOKIE est non défini', () => {
    vi.stubEnv('SECRET_COOKIE', undefined);

    expect(() => {
      adaptateurEnvironnement.secrets().cookie();
    }).toThrow(expect.objectContaining({ message: '💥 Veuillez renseigner le secret COOKIE' }));
  });
});
