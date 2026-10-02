import { afterEach, describe, expect, it } from 'vitest';
import { AdaptateurChiffrement } from '../../src/infra/adaptateurChiffrement.js';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import { EntrepotUtilisateurMPAPostgres } from '../../src/infra/entrepotUtilisateurMPAPostgres.js';
import { UtilisateurBDD } from '../../src/infra/utilisateurBDD.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';

describe("L'entrepôt utilisateur PostgreSQL", () => {
  let entrepot: EntrepotUtilisateurMPAPostgres;

  afterEach(async () => {
    await entrepot.knex.destroy();
  });

  it("conserve l'organisation de MonProfilAnssi si l’API entreprise ne la trouve pas", async () => {
    const donneesUtilisateur = {
      email: 'jeanne.dupont@user.com',
      cguAcceptees: true,
      infolettreAcceptee: false,
      pixelDeSuiviAccepte: true,
    };
    const adaptateurChiffrement: AdaptateurChiffrement = {
      chiffre: () => ({ iv: '', aad: '', donnees: '', tag: '' }),
      dechiffre: <T>() => donneesUtilisateur as T,
    };
    const adaptateurProfilAnssi: AdaptateurProfilAnssi = {
      metsAJour: async () => undefined,
      recherche: async () => [],
      recupere: async () => ({
        email: donneesUtilisateur.email,
        prenom: 'Jeanne',
        nom: 'Dupont',
        domainesSpecialite: [],
        organisation: {
          nom: 'Mon organisation',
          siret: '12345678901234',
          departement: '75',
        },
      }),
    };
    entrepot = new EntrepotUtilisateurMPAPostgres({
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise: { rechercheOrganisations: async () => [] },
      adaptateurChiffrement,
      adaptateurHachage: fauxAdaptateurHachage,
      entrepotMesure: new EntrepotMesureMemoire(),
    });
    const utilisateurBDD = {
      email_hache: 'email-hache',
      donnees: adaptateurChiffrement.chiffre(donneesUtilisateur),
      id_liste_favoris: undefined,
      roles: [],
      parcours: null,
    } as unknown as UtilisateurBDD;
    const entrepotTestable = entrepot as unknown as {
      hydrateUtilisateur: (utilisateur: UtilisateurBDD) => Promise<Utilisateur | undefined>;
      recupereMesuresPrisesEnCompte: () => Promise<[]>;
    };
    entrepotTestable.recupereMesuresPrisesEnCompte = async () => [];

    const utilisateur = await entrepotTestable.hydrateUtilisateur(utilisateurBDD);

    expect(await utilisateur?.organisation()).toMatchObject({
      nom: 'Mon organisation',
      siret: '12345678901234',
      departement: '75',
      codeActivite: undefined,
      codeSecteur: undefined,
      codeTrancheEffectif: undefined,
    });
  });
});
