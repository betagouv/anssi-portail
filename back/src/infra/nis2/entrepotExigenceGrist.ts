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
import { aseptiseListeGrist } from '../grist';

export type ExigenceGrist = {
  id: number;
  fields: {
    References_New_: string;
    Objectif_de_securite: string;
    Thematique: string;
    Contenu: string;
    EIEE: string[];
    Niveau: string | null;
    Observations: string | null;
    ExigencesCible: string | null;
  };
};

export class EntrepotExigenceGrist
  extends EntrepotGrist<ExigenceGrist>
  implements EntrepotExigence
{
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<ReponseGrist<ExigenceGrist>>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    const configGrist = adaptateurEnvironnement.grist();
    const url = `${configGrist.baseURL()}/api/docs/${configGrist.nis2().idDocument()}/tables/${configGrist.nis2().idTableExigencesNIS2()}/records`;
    super(
      clientHttp,
      url,
      configGrist.nis2().cleApi(),
      configGrist.dureeCacheEnSecondes()
    );
  }

  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: 'ISO'): Promise<ExigenceISO[]>;
  async parReferentiel(_referentiel: Referentiel): Promise<Exigence[]> {
    const exigences = await this.appelleGrist();

    return exigences.records.map(
      (exigenceGrist) =>
        new ExigenceNIS2({
          reference: exigenceGrist.fields.References_New_,
          contenu: exigenceGrist.fields.Contenu,
          thematique: exigenceGrist.fields.Thematique,
          entitesCible: aseptiseListeGrist(exigenceGrist.fields.EIEE)
            .map(
              (categorie) =>
                ({ EI: 'EntiteImportante', EE: 'EntiteEssentielle' })[
                  categorie
                ] as CategorieEntite
            )
            .filter((c) => c !== undefined),
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
}
