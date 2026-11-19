import Knex from 'knex';
import config from '../../knexfile.js';
import {
  EntrepôtRésultatTestMaturité,
  FiltreResultatsTest,
} from '../metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { RésultatTestMaturité } from '../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { Utilisateur } from '../metier/utilisateur.js';
import { AdaptateurHachage } from './adaptateurHachage.js';
import { EntrepotUtilisateurMPAPostgres } from './entrepotUtilisateurMPAPostgres.js';

export class EntrepotResultatTestPostgres implements EntrepôtRésultatTestMaturité {
  knex: Knex.Knex;
  entrepotUtilisateur: EntrepotUtilisateurMPAPostgres;
  private adaptateurHachage: AdaptateurHachage;

  constructor({
    entrepotUtilisateur,
    adaptateurHachage,
  }: {
    entrepotUtilisateur: EntrepotUtilisateurMPAPostgres;
    adaptateurHachage: AdaptateurHachage;
  }) {
    this.adaptateurHachage = adaptateurHachage;
    this.knex = Knex(config);
    this.entrepotUtilisateur = entrepotUtilisateur;
  }

  async ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]> {
    const donnees = await this.knex('resultats_test').where({
      code_session_groupe: code,
    });
    return Promise.all(donnees.map((donnees) => this.traduitEnResultatTestMaturite(donnees)));
  }

  private async traduitEnResultatTestMaturite(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    donneesTestMaturite: any,
    avecUtilisateur: boolean = true
  ) {
    const utilisateur: Utilisateur | undefined =
      avecUtilisateur && donneesTestMaturite.email_utilisateur_hache
        ? await this.entrepotUtilisateur.parEmailHache(donneesTestMaturite.email_utilisateur_hache)
        : undefined;

    const resultat = new RésultatTestMaturité({
      ...donneesTestMaturite,
      tailleOrganisation: donneesTestMaturite.taille_organisation,
      codeSessionGroupe: donneesTestMaturite.code_session_groupe,
      dateRealisation: donneesTestMaturite.date_realisation,
    });
    resultat.utilisateur = utilisateur;
    return resultat;
  }

  async parId(id: string): Promise<RésultatTestMaturité | undefined> {
    const donnees = await this.knex('resultats_test').where({ id }).first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité | undefined> {
    const donnees = await this.knex('resultats_test')
      .where({
        email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
      })
      .orderBy('date_realisation', 'desc')
      .first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async metsÀjour(resultatTest: RésultatTestMaturité): Promise<void> {
    await this.knex('resultats_test')
      .where({ id: resultatTest.id })
      .update({
        email_utilisateur_hache: resultatTest.utilisateur
          ? this.adaptateurHachage.hache(resultatTest.utilisateur.email)
          : null,
      });
  }

  async ajoute(resultatTest: RésultatTestMaturité): Promise<void> {
    const { utilisateur, tailleOrganisation, codeSessionGroupe, dateRealisation, ...reste } = resultatTest;
    await this.knex('resultats_test').insert({
      ...reste,
      taille_organisation: tailleOrganisation,
      code_session_groupe: codeSessionGroupe,
      email_utilisateur_hache: utilisateur ? this.adaptateurHachage.hache(utilisateur.email) : null,
      date_realisation: dateRealisation,
    });
  }

  async taille() {
    const resultat = await this.knex('resultats_test').count({ count: '*' });
    return Number(resultat[0].count);
  }

  async tousEnOmettantUtilisateur(): Promise<RésultatTestMaturité[]> {
    const resultats = await this.knex('resultats_test');
    return Promise.all(resultats.map((resultat) => this.traduitEnResultatTestMaturite(resultat, false)));
  }

  async pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité[]> {
    const resultats = await this.knex('resultats_test').where({
      email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
    });
    return Promise.all(resultats.map((resultat) => this.traduitEnResultatTestMaturite(resultat)));
  }

  async parFiltresEnOmettantUtilisateur({
    codeSecteur,
    codeRegion,
    codeTrancheEffectif,
  }: FiltreResultatsTest): Promise<RésultatTestMaturité[]> {
    const resultats = await this.knex('resultats_test').where((builder) => {
      if (codeSecteur) builder = builder.where('secteur', codeSecteur);
      if (codeRegion) builder = builder.where('region', codeRegion);
      if (codeTrancheEffectif) builder = builder.where('taille_organisation', codeTrancheEffectif);
      return builder;
    });
    return Promise.all(resultats.map((resultat) => this.traduitEnResultatTestMaturite(resultat, false)));
  }
}
