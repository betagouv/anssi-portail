import { ClientHttp } from '../../metier/clientHttp';
import { EntrepotFinancement } from '../../metier/financements/entrepotFinancement';
import { Financement } from '../../metier/financements/financement.type';

export type FinancementGrist = {
  id: number;
  fields: {
    Nom_du_dispositif: string | null;
    Financeur: string | null;
    Entites_eligibles: string[] | null;
    Perimetre_geographique: string[] | null;
    Financement: string[] | null;
    Objectifs: string | null;
    Operations_eligibles: string | null;
    Beneficiaire: string | null;
    Montant: string | null;
    Conditions: string | null;
    Region: string | null;
    Contact: string | null;
    Source: string | null;
    ID_Aides_entreprises: number | null;
  };
};

export type SnapshotGrist = {
  snapshots: {
    docId: string;
  }[];
};

export class EntrepotFinancementGrist implements EntrepotFinancement {
  constructor(
    private readonly clientHttp: ClientHttp,
    private readonly urlDeBase: string,
    private readonly idTable: string,
    private readonly cleApi: string
  ) {
    if (!urlDeBase) {
      throw new Error('Url de base non définie');
    }
    if (!cleApi) {
      throw new Error('Clé api non définie');
    }
    if (!idTable) {
      throw new Error('ID de table non défini');
    }
  }

  async tous(): Promise<Financement[]> {
    const financementsGrist = await this.appelleGrist();
    return financementsGrist.records.map(this.convertisFinancementGrist);
  }

  async empreinte(): Promise<string> {
    const url = `${this.urlDeBase}/snapshots`;
    const reponse = await this.clientHttp.get<SnapshotGrist>(url, {
      headers: {
        authorization: `Bearer ${this.cleApi}`,
        accept: 'application/json',
      },
    });
    return reponse.data.snapshots[0].docId;
  }

  protected async appelleGrist() {
    const url = `${this.urlDeBase}/tables/${this.idTable}/records`;
    const reponse = await this.clientHttp.get<{ records: FinancementGrist[] }>(url, {
      headers: {
        authorization: `Bearer ${this.cleApi}`,
        accept: 'application/json',
      },
    });
    return reponse.data;
  }

  private aseptiseListe<T>(colonne: T[] | null | undefined): T[] {
    return colonne?.slice(1) ?? [];
  }

  private readonly convertisFinancementGrist = ({ fields, id }: FinancementGrist) =>
    new Financement({
      id,
      nom: fields.Nom_du_dispositif ?? '',
      financeur: fields.Financeur ?? '',
      typesDeFinancement: this.aseptiseListe(fields.Financement),
      entitesElligibles: this.aseptiseListe(fields.Entites_eligibles),
      perimetresGeographiques: this.aseptiseListe(fields.Perimetre_geographique),
      objectifs: fields.Objectifs ?? '',
      operationsEligibles: fields.Operations_eligibles ?? '',
      benificiaires: fields.Beneficiaire ?? '',
      montant: fields.Montant ?? '',
      condition: fields.Conditions ?? '',
      sources: fields.Source ? [fields.Source] : [],
      contact: fields.Contact ?? '',
      regions: fields.Region ? [fields.Region] : [],
      idExterne: fields.ID_Aides_entreprises ?? undefined,
    });
}
