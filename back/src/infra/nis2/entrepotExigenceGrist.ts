import axios from 'axios';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence';
import {
  CategorieEntite,
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
    Objectif_de_securite: string;
    Thematique: string;
    Contenu: string;
    EIEE: string;
    Niveau: string | null;
    Observations: string | null;
    ExigencesCible: string | null;
  };
};

export class EntrepotExigenceGrist
  extends EntrepotGrist<ExigenceGrist>
  implements EntrepotExigence
{
  private readonly urlDocument: string;
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
    this.urlDocument = `${configGrist.baseURL()}/api/docs/${configGrist.nis2().idDocument()}`;
  }

  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: 'ISO'): Promise<ExigenceISO[]>;
  async parReferentiel(referentiel: Referentiel): Promise<Exigence[]> {
    const requete = this.construitRequeteSQL(referentiel);

    const exigences = await this.appelleGrist(
      {},
      `${this.urlDocument}/sql?q=${requete}`
    );

    return exigences.records.map(
      (exigenceGrist) =>
        new ExigenceNIS2({
          reference: exigenceGrist.fields.Reference,
          contenu: exigenceGrist.fields.Contenu,
          thematique: exigenceGrist.fields.Thematique,
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
          objectifSecurite: exigenceGrist.fields.Objectif_de_securite,
          exigences: exigenceGrist.fields.ExigencesCible
            ? (JSON.parse(exigenceGrist.fields.ExigencesCible) as Exigence[])
            : undefined,
          niveau: exigenceGrist.fields.Niveau ?? undefined,
          observations: exigenceGrist.fields.Observations ?? undefined,
          referentielCompare: 'ISO',
        })
    );
  }
  private construitRequeteSQL(
    referentiel: Referentiel,
    cible: Referentiel = 'ISO'
  ) {
    if (referentiel === 'NIS2') {
      const selections = this.construitSelection(referentiel, cible);
      const tableEtJointure = this.construitTableEtJoiture(referentiel, cible);
      return ['SELECT', selections.join(','), ...tableEtJointure].join(' ');
    }

    throw new Error('Referentiel non pris en charge');
  }

  private construitSelection(source: Referentiel, cible?: Referentiel) {
    const base = ['source.References_New_ as Reference', 'source.Contenu'];
    const optionnel = [];
    const projectionCible: string[] = [];
    if (source === 'NIS2') {
      optionnel.push(
        'source.Objectif_de_securite',
        'source.Thematique',
        'source.EIEE'
      );
    }
    if (cible === 'ISO') {
      projectionCible.push(
        'cr.Correspondance as Niveau',
        'cr.Commentaires_externes as Observations',
        `(
              SELECT
                  json_group_array (
                      json_object ('reference', '', 'contenu', iso.Ref_ISO_27001_27002)
                  )
              FROM
                  ISO_27001_27002_2022 iso
              WHERE
                  iso.id IN (
                      SELECT
                          value
                      FROM
                          json_each (cr.Ref_ISO_27001_27002)
                  )
          ) as ExigencesCible`
      );
    }

    return base.concat(optionnel).concat(projectionCible);
  }

  private construitTableEtJoiture(source: Referentiel, cible?: Referentiel) {
    const table = [];
    const jointure = [];
    if (source === 'NIS2') {
      table.push('FROM', 'Exigences_NIS2_2_4_1 as source');
    } else {
      throw new Error('Referentiel source autre que NIS2 non pris en charge');
    }

    if (cible === 'ISO') {
      jointure.push(
        'LEFT OUTER JOIN',
        'Croisement_NIS2_ISO as cr ON source.id = cr.Ref_New_NIS2'
      );
    } else {
      return table;
    }

    return table.concat(jointure);
  }
}
