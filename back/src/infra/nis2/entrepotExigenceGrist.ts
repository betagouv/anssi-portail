import axios from 'axios';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence';
import {
  CategorieEntite,
  Correspondance,
  Exigence,
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
          nomColonneContenuCible: string;
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
      ISO: {
        table: 'ISO_27001_27002_2022',
        champs: [
          'source.Contenu',
          'source.Ref_ISO_27001_27002 as Reference',
          'source.Norme',
          'source.Chapitre',
        ],
        ISO: undefined,
        NIS2: {
          nomTableAssociation: configGrist.nis2().idTableComparaisonISO_NIS2(),
          nomColonneReferenceCible: 'References_New_',
          nomColonneContenuCible: 'Contenu',
          nomTableCible: 'Exigences_NIS2_2_4_1',
        },
      },
      NIS2: {
        table: 'Exigences_NIS2_2_4_1',
        NIS2: undefined,
        champs: [
          'source.Contenu',
          'source.References_New_ as Reference',
          'source.Objectif_de_securite',
          'source.Thematique',
          'source.EIEE',
        ],
        ISO: {
          nomTableAssociation: configGrist.nis2().idTableComparaisonNIS2_ISO(),
          nomColonneReferenceCible: 'Ref_ISO_27001_27002',
          nomColonneContenuCible: 'Contenu',
          nomTableCible: 'ISO_27001_27002_2022',
        },
      },
    };
    this.urlDocument = `${configGrist.baseURL()}/api/docs/${configGrist.nis2().idDocument()}`;
  }

  parReferentiel(
    referentiel: 'NIS2',
    cible?: Referentiel
  ): Promise<ExigenceNIS2[]>;
  parReferentiel(
    referentiel: 'ISO',
    cible?: Referentiel
  ): Promise<ExigenceISO[]>;
  async parReferentiel(
    referentiel: Referentiel,
    cible?: Referentiel
  ): Promise<Exigence[]> {
    const requete = this.construitRequeteSQL(referentiel, cible);

    const exigences = await this.appelleGrist(
      {},
      `${this.urlDocument}/sql?q=${requete}`
    );

    if (referentiel === 'NIS2') {
      return exigences.records.map((exigenceGrist) => {
        const correspondance = new Correspondance(
          this.versNiveau(exigenceGrist.fields.Niveau),
          exigenceGrist.fields.Observations ?? undefined,
          exigenceGrist.fields.ExigencesCible
            ? (JSON.parse(exigenceGrist.fields.ExigencesCible) as Exigence[])
            : []
        );

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
          referentielCompare: 'ISO',
          correspondance,
        });
      });
    }

    if (referentiel === 'ISO') {
      return exigences.records.map((exigenceGrist) => {
        const correspondance = new Correspondance(
          this.versNiveau(exigenceGrist.fields.Niveau),
          exigenceGrist.fields.Observations ?? undefined,
          exigenceGrist.fields.ExigencesCible
            ? (JSON.parse(exigenceGrist.fields.ExigencesCible) as Exigence[])
            : []
        );

        return new ExigenceISO({
          reference: exigenceGrist.fields.Reference,
          norme: exigenceGrist.fields.Norme ?? '',
          chapitre: exigenceGrist.fields.Chapitre ?? '',
          contenu: exigenceGrist.fields.Contenu,
          correspondance,
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
      constructeurDeRequete.leftJoin(
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
            k
              .from(
                k.raw(`json_each (cr.${croisement.nomColonneReferenceCible})`)
              )
              .select('value')
          )
          .select(
            k.raw(
              `json_group_array (json_object ('reference', cible.${croisement.nomColonneReferenceCible}, 'contenu', cible.${croisement.nomColonneContenuCible}))`
            )
          )
          .as('ExigencesCible')
      );
    }

    return constructeurDeRequete.select(champs).toString();
  }
}
