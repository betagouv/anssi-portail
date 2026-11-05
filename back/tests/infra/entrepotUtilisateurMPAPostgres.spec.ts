import { describe, expect, it, vi } from 'vitest';
import { ObjetChiffre } from '../../src/infra/adaptateurChiffrement.js';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import { EntrepotUtilisateurMPAPostgres } from '../../src/infra/entrepotUtilisateurMPAPostgres.js';
import {
  fauxAdaptateurHachage,
  fauxAdaptateurProfilAnssi,
  fauxAdaptateurRechercheEntreprise,
  fauxRapporteurErreur,
} from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';

const { insert, first, select } = vi.hoisted(() => ({
  insert: vi.fn().mockResolvedValue(undefined),
  first: vi.fn().mockResolvedValue(undefined),
  select: vi.fn().mockResolvedValue([]),
}));

vi.mock('knex', () => ({
  default: vi.fn(() =>
    Object.assign(
      vi.fn(() => ({ insert, where: vi.fn(() => ({ first, select })) })),
      { raw: vi.fn() }
    )
  ),
}));

describe("L'entrepôt utilisateur MPA Postgres", () => {
  const adaptateurChiffrement = {
    chiffre: <T>(_: T) => ({ iv: '', aad: '', donnees: '', tag: '' }),
    dechiffre: <T>(_: ObjetChiffre): T =>
      ({ email: 'jeanne.dupont@mail.fr', cguAcceptees: true, infolettreAcceptee: false }) as T,
  };

  it("n'ajoute pas l'utilisateur dans la BDD si MPA échoue", async () => {
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
      adaptateurChiffrement,
      entrepotMesure: new EntrepotMesureMemoire(),
      rapporteurErreur: fauxRapporteurErreur,
    });

    await expect(entrepôt.ajoute(jeanneDupont)).rejects.toThrow();

    expect(insert).not.toHaveBeenCalled();
  });

  it("hydrate l'utilisateur sans codes d'organisation si la recherche d'organisations ne renvoie rien", async () => {
    first.mockResolvedValue({
      email_hache: 'hache',
      donnees: {},
      id_liste_favoris: undefined,
      roles: [],
      parcours: null,
    });

    const entrepôt = new EntrepotUtilisateurMPAPostgres({
      adaptateurProfilAnssi: {
        ...fauxAdaptateurProfilAnssi,
        recupere: async () => ({
          email: 'jeanne.dupont@mail.fr',
          prenom: 'Jeanne',
          nom: 'Dupont',
          domainesSpecialite: [],
          organisation: { nom: 'Mon organisation', siret: '12345678901234', departement: '33' },
        }),
      },
      adaptateurRechercheEntreprise: { rechercheOrganisations: async () => [] },
      adaptateurHachage: fauxAdaptateurHachage,
      adaptateurChiffrement,
      entrepotMesure: new EntrepotMesureMemoire(),
      rapporteurErreur: fauxRapporteurErreur,
    });

    const utilisateur = await entrepôt.parEmailHache('hache');

    const organisation = await utilisateur!.organisation();
    expect(organisation.codeActivite).toBeUndefined();
    expect(organisation.codeSecteur).toBeUndefined();
    expect(organisation.codeTrancheEffectif).toBeUndefined();
  });
});
