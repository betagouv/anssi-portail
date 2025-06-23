import { describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { profilStore } from '../../src/stores/profil.store';

const mocks = vi.hoisted(() => ({
  get: vi.fn(async () => ({
    data: {
      prenom: 'Jeanne',
      nom: 'Dupond',
      email: 'jeanne.dupond@mail.fr',
      siret: '123456789',
    },
  })),
}));

vi.mock('axios', async () => {
  return {
    default: {
      get: mocks.get,
    },
  };
});

describe('Le store du profil', () => {
  it('fait un appel API lors de son initialisation', async () => {
    expect(mocks.get).toHaveBeenCalled();
  });

  it('assigne la valeur du profil au store', async () => {
    const profil = get(profilStore);

    expect(profil!.prenom).toEqual('Jeanne');
    expect(profil!.nom).toEqual('Dupond');
    expect(profil!.email).toEqual('jeanne.dupond@mail.fr');
    expect(profil!.siret).toEqual('123456789');
  });
});
