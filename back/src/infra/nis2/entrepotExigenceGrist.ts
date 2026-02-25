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
    References_New_: string;
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
          reference: exigenceGrist.fields.References_New_,
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
  construitRequeteSQL(referentiel: Referentiel) {
    if (referentiel === 'NIS2') {
      return `
        SELECT
          nis2.References_New_,
          nis2.Objectif_de_securite,
          nis2.Thematique,
          nis2.Contenu,
          nis2.EIEE,
          '' as Niveau,
          '' as Observations,
          '[]' as ExigencesCible
        FROM 
          Exigences_NIS2_2_4_1 as nis2
      `;
    }

    throw new Error('Referentiel non pris en charge');
  }
}
