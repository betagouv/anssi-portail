import { describe, expect, it, vi } from 'vitest';
import { ObjetChiffre } from '../../src/infra/adaptateurChiffrement.js';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import { EntrepotUtilisateurMPAPostgres } from '../../src/infra/entrepotUtilisateurMPAPostgres.js';
import {
  fauxAdaptateurHachage,
  fauxAdaptateurProfilAnssi,
  fauxAdaptateurRechercheEntreprise,
} from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';

const { insert } = vi.hoisted(() => ({ insert: vi.fn().mockResolvedValue(undefined) }));

vi.mock('knex', () => ({
  default: vi.fn(() =>
    Object.assign(
      vi.fn(() => ({ insert })),
      { raw: vi.fn() }
    )
  ),
}));

describe("L'entrepôt utilisateur MPA Postgres", () => {
  it("n'ajoute pas l'utilisateur dans la BDD si MPA échoue", async () => {
    const fauxAdaptateurChiffrement = {
      chiffre: <T>(_: T) => ({
        iv: '',
        aad: '',
        donnees: '',
        tag: '',
      }),
      dechiffre: <T>(_: ObjetChiffre): T => {
        return JSON.parse('{}');
      },
    };
    const adaptateurProfilAnssi: AdaptateurProfilAnssi = {
      ...fauxAdaptateurProfilAnssi,
      metsAJour: () => {
        throw new Error();
      },
    };
    const entrepôt = new EntrepotUtilisateurMPAPostgres({
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
      adaptateurHachage: fauxAdaptateurHachage,
      adaptateurChiffrement: fauxAdaptateurChiffrement,
      entrepotMesure: new EntrepotMesureMemoire(),
    });

    await expect(entrepôt.ajoute(jeanneDupont)).rejects.toThrow();

    expect(insert).not.toHaveBeenCalled();
  });
});
