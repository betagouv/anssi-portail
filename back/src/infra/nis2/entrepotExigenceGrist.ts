import axios from 'axios';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence';
import {
  CategorieEntite,
  Correspondance,
  CyFun23Fonction,
  CyFun23NiveauAssurance,
  Exigence,
  ExigenceAE,
  ExigenceCyFun23,
  ExigenceISO,
  ExigenceNIS2,
  Referentiel,
} from '../../metier/nis2/exigence';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement';
import { ClientHttp } from '../clientHttp';
import { EntrepotGrist, ReponseGrist } from '../entrepotGrist';
import knex, { QueryBuilder } from 'knex';

export type ExigenceGrist = {
  fields: {
    Reference: string;
    Contenu: string;
    // NIS2
    Objectif_de_securite?: string;
    Thematique?: string;
    EIEE?: string;
    // ISO
    Norme?: string;
    Chapitre?: string;
    // CyFun23
    Fonction?: string;
    NiveauAssurance?: string;
    EstMesureCle?: number;
    // Comparaison
    Niveau?: string;
    Observations?: string;
    ExigencesCible?: string;
  };
};

type Croisements = {
  [K in Referentiel]: { table: string; champs: string[] } & {
    [L in Referentiel]:
      | {
          nomTableAssociation: string;
          nomTableCible: string;
          nomColonneReferenceCible: string;
        }
      | undefined;
  };
};

export class EntrepotExigenceGrist
  extends EntrepotGrist<ExigenceGrist>
  implements EntrepotExigence
{
  private readonly urlDocument: string;
  private readonly croisements: Croisements;
  private readonly afficheObservations: boolean;
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<ReponseGrist<ExigenceGrist>>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    const configGrist = adaptateurEnvironnement.grist();
    super(
      clientHttp,
      '',
      configGrist.nis2().cleApi(),
      configGrist.dureeCacheEnSecondes()
    );
    this.croisements = {
      AE: {
        table: 'AE_2690',
        champs: ['source.Contenu', 'source.ID2 as Reference'],
        AE: undefined,
        CyFun23: undefined,
        NIS2: {
          nomTableAssociation: 'Croisement_AE_NIS2',
          nomColonneReferenceCible: 'References_New_',
          nomTableCible: 'Exigences_NIS2_2_5',
        },
        ISO: undefined,
      },
      CyFun23: {
        table: '',
        champs: [],
        AE: undefined,
        CyFun23: undefined,
        ISO: undefined,
        NIS2: undefined,
      },
      ISO: {
        table: 'ISO_27001_27002_2022',
        champs: [
          'source.Contenu',
          'source.Ref_ISO_27001_27002 as Reference',
          'source.Norme',
          'source.Chapitre',
        ],
        AE: undefined,
        CyFun23: undefined,
        ISO: undefined,
        NIS2: {
          nomTableAssociation: 'Croisement_ISO_NIS2',
          nomColonneReferenceCible: 'References_New_',
          nomTableCible: 'Exigences_NIS2_2_5',
        },
      },
      NIS2: {
        table: 'Exigences_NIS2_2_5',
        champs: [
          'source.Contenu',
          'source.References_New_ as Reference',
          'source.Objectif_de_securite',
          'source.Thematique',
          'source.EIEE',
        ],
        AE: {
          nomTableAssociation: 'Croisement_NIS2_AE',
          nomColonneReferenceCible: 'ID2',
          nomTableCible: 'AE_2690',
        },
        CyFun23: undefined,
        NIS2: undefined,
        ISO: {
          nomTableAssociation: 'Croisement_NIS2_ISO',
          nomColonneReferenceCible: 'Ref_ISO_27001_27002',
          nomTableCible: 'ISO_27001_27002_2022',
        },
      },
    };
    this.urlDocument = `${configGrist.baseURL()}/api/docs/${configGrist.nis2().idDocument()}`;
    this.afficheObservations = adaptateurEnvironnement
      .fonctionnalites()
      .nis2()
      .afficheObservations();
  }

  parReferentiel(
    referentiel: 'NIS2',
    cible?: Referentiel
  ): Promise<ExigenceNIS2[]>;
  parReferentiel(
    referentiel: 'ISO',
    cible?: Referentiel
  ): Promise<ExigenceISO[]>;
  parReferentiel(referentiel: 'AE', cible?: Referentiel): Promise<ExigenceAE[]>;
  parReferentiel(
    referentiel: 'CyFun23',
    cible?: Referentiel
  ): Promise<ExigenceCyFun23[]>;
  async parReferentiel(
    referentiel: Referentiel,
    cible?: Referentiel
  ): Promise<Exigence[]> {
    const requete = this.construitRequeteSQL(referentiel, cible);

    const exigences = await this.appelleGrist(
      {},
      `${this.urlDocument}/sql?q=${requete}`
    );

    const fabriqueCorrespondance = (
      exigenceGrist: ExigenceGrist
    ): Correspondance =>
      new Correspondance(
        this.versNiveau(exigenceGrist.fields.Niveau),
        (this.afficheObservations && exigenceGrist.fields.Observations) ||
          undefined,
        exigenceGrist.fields.ExigencesCible
          ? (JSON.parse(exigenceGrist.fields.ExigencesCible) as Exigence[])
          : []
      );

    if (referentiel === 'NIS2') {
      return exigences.records.map((exigenceGrist) => {
        return new ExigenceNIS2({
          reference: exigenceGrist.fields.Reference,
          contenu: exigenceGrist.fields.Contenu,
          thematique: exigenceGrist.fields.Thematique ?? '',
          entitesCible: exigenceGrist.fields.EIEE
            ? (JSON.parse(exigenceGrist.fields.EIEE) as string[])
                .map(
                  (categorie) =>
                    ({ EI: 'EntiteImportante', EE: 'EntiteEssentielle' })[
                      categorie
                    ] as CategorieEntite
                )
                .filter((c) => c !== undefined)
            : [],
          objectifSecurite: exigenceGrist.fields.Objectif_de_securite ?? '',
          referentielCompare: cible,
          correspondance: fabriqueCorrespondance(exigenceGrist),
        });
      });
    }

    if (referentiel === 'ISO') {
      return exigences.records.map((exigenceGrist) => {
        return new ExigenceISO({
          reference: exigenceGrist.fields.Reference,
          norme: exigenceGrist.fields.Norme ?? '',
          chapitre: exigenceGrist.fields.Chapitre ?? '',
          contenu: exigenceGrist.fields.Contenu,
          correspondance: fabriqueCorrespondance(exigenceGrist),
        });
      });
    }

    if (referentiel === 'AE') {
      return exigences.records.map((exigenceGrist) => {
        return new ExigenceAE({
          reference: exigenceGrist.fields.Reference,
          contenu: exigenceGrist.fields.Contenu,
          correspondance: fabriqueCorrespondance(exigenceGrist),
        });
      });
    }

    if (referentiel === 'CyFun23') {
      return exigences.records.map((exigenceGrist) => {
        return new ExigenceCyFun23({
          reference: exigenceGrist.fields.Reference,
          contenu: exigenceGrist.fields.Contenu,
          fonction: this.traduitFonction(exigenceGrist.fields.Fonction),
          niveauAssurance: this.traduitNiveauAssurance(
            exigenceGrist.fields.NiveauAssurance
          ),
          estMesureCle: Boolean(exigenceGrist.fields.EstMesureCle),
          correspondance: fabriqueCorrespondance(exigenceGrist),
        });
      });
    }

    throw new Error('Referentiel non pris en charge');
  }

  private versNiveau(niveau?: string): Correspondance['niveau'] {
    switch (niveau) {
      case 'O':
        return 'moyen';
      case 'R':
        return 'faible';
      case 'V':
        return 'élevé';
      default:
        return 'NA';
    }
  }

  private traduitFonction(fonction?: string): CyFun23Fonction | undefined {
    switch (fonction) {
      case 'Identify':
        return 'Identifier';
      case 'Protect':
        return 'Protéger';
      case 'Detect':
        return 'Détecter';
      case 'Respond':
        return 'Répondre';
      case 'Recover':
        return 'Rétablir';
      default:
        return undefined;
    }
  }

  private traduitNiveauAssurance(
    niveau?: string
  ): CyFun23NiveauAssurance | undefined {
    switch (niveau) {
      case 'Basic':
        return 'Basique';
      case 'Important':
        return 'Important';
      case 'Essential':
        return 'Essentiel';
      default:
        return undefined;
    }
  }

  private construitRequeteSQL(source: Referentiel, cible?: Referentiel) {
    const k = knex({ client: 'sqlite', useNullAsDefault: true });
    const constructeurDeRequete = k({
      source: this.croisements[source].table,
    });
    const champs: QueryBuilder[] = [...this.croisements[source].champs];
    if (source === 'ISO') {
      constructeurDeRequete
        .where('source.Norme', 'ISO 27002')
        .orWhere('source.Chapitre', '<>', '');
    }
    const croisement = this.croisements[source][cible ?? source];
    if (croisement) {
      constructeurDeRequete.join(
        { cr: croisement.nomTableAssociation },
        'source.id',
        'cr.Reference_source'
      );
      champs.push(
        'cr.Correspondance as Niveau',
        'cr.Commentaires_externes as Observations',
        k({ cible: croisement.nomTableCible })
          .where(
            'cible.id',
            'IN',
            k.from(k.raw(`json_each (cr.References_cibles)`)).select('value')
          )
          .select(
            k.raw(
              `json_group_array (json_object ('reference', cible.${croisement.nomColonneReferenceCible}, 'contenu', cible.Contenu))`
            )
          )
          .as('ExigencesCible')
      );
    }

    return constructeurDeRequete.select(champs).toString();
  }
}
