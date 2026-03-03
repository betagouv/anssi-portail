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
  [K in Referentiel]: {
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
        ISO: undefined,
        NIS2: {
          nomTableAssociation: configGrist.nis2().idTableComparaisonISO_NIS2(),
          nomColonneReferenceCible: 'References_New_',
          nomColonneContenuCible: 'Contenu',
          nomTableCible: 'Exigences_NIS2_2_4_1',
        },
      },
      NIS2: {
        NIS2: undefined,
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

  private construitRequeteSQL(referentiel: Referentiel, cible?: Referentiel) {
    if (referentiel === 'NIS2') {
      const selections = this.construitSelection(referentiel, cible);
      const tableEtJointure = this.construitTableEtJoiture(referentiel, cible);
      return ['SELECT', selections.join(','), ...tableEtJointure].join(' ');
    }
    if (referentiel === 'ISO') {
      const selections = this.construitSelection(referentiel, cible);
      const tableEtJointure = this.construitTableEtJoiture(referentiel, cible);
      const condtions = this.construitConditions(referentiel);
      return [
        'SELECT',
        selections.join(','),
        ...tableEtJointure,
        ...condtions,
      ].join(' ');
    }

    throw new Error('Referentiel non pris en charge');
  }

  private construitSelection(source: Referentiel, cible?: Referentiel) {
    const base = ['source.Contenu'];
    const optionnel = [];
    const projectionCible: string[] = [];
    const croisement = this.croisements[source][cible ?? source];
    if (source === 'NIS2') {
      base.push('source.References_New_ as Reference');
      optionnel.push(
        'source.Objectif_de_securite',
        'source.Thematique',
        'source.EIEE'
      );
    }
    if (source === 'ISO') {
      base.push('source.Ref_ISO_27001_27002 as Reference');
      optionnel.push('source.Norme', 'source.Chapitre');
    }
    if (croisement) {
      projectionCible.push(
        'cr.Correspondance as Niveau',
        'cr.Commentaires_externes as Observations',
        `(
              SELECT
                  json_group_array (
                      json_object ('reference', cible.${croisement.nomColonneReferenceCible}, 'contenu', cible.${croisement.nomColonneContenuCible})
                  )
              FROM
                  ${croisement.nomTableCible} cible
              WHERE
                  cible.id IN (
                      SELECT
                          value
                      FROM
                          json_each (cr.${croisement.nomColonneReferenceCible})
                  )
          ) as ExigencesCible`
      );
    }

    return base.concat(optionnel).concat(projectionCible);
  }

  private construitTableEtJoiture(source: Referentiel, cible?: Referentiel) {
    const table = [];
    const jointure = [];
    const croisement = this.croisements[source][cible ?? source];
    if (source === 'NIS2') {
      table.push('FROM', 'Exigences_NIS2_2_4_1 as source');
    } else if (source === 'ISO') {
      table.push('FROM', 'ISO_27001_27002_2022 as source');
    } else {
      throw new Error(
        'Referentiel source autre que NIS2 ou ISO non pris en charge'
      );
    }

    if (croisement) {
      jointure.push(
        'LEFT OUTER JOIN',
        `${croisement.nomTableAssociation} as cr ON source.id = cr.Reference_source`
      );
    } else {
      return table;
    }

    return table.concat(jointure);
  }

  private construitConditions(source: Referentiel) {
    if (source === 'ISO') {
      return ["WHERE source.Norme = 'ISO 27002' OR source.Chapitre <> ''"];
    }

    return [];
  }
}
