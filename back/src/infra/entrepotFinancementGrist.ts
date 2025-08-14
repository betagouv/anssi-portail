import axios, { AxiosResponse } from 'axios';
import { EntrepotFinancement } from '../metier/entrepotFinancement';
import { Financement } from '../metier/financement';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type RetourApiGrist = {
  records: {
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
    };
  }[];
};

export type ClientHttp = {
  get: (
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<unknown>;
};

export class EntrepotFinancementGrist implements EntrepotFinancement {
  clientHttp: ClientHttp;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    this.clientHttp = clientHttp;
    this.adaptateurEnvironnement = adaptateurEnvironnement;
  }

  tous = async () => {
    const urlDocFinancement = this.adaptateurEnvironnement
      .grist()
      .urlFinancements();
    if (!urlDocFinancement) {
      return [];
    }
    const cleApi = this.adaptateurEnvironnement.grist().cleApiFinancements();
    const reponse = (await this.clientHttp.get(urlDocFinancement, {
      headers: { Authorization: `Bearer ${cleApi}` },
    })) as AxiosResponse<RetourApiGrist>;

    return reponse.data.records.map(
      ({ fields, id }) =>
        new Financement({
          id,
          nom: fields.Nom_du_dispositif ?? '',
          financeur: fields.Financeur ?? '',
          typesDeFinancement:
            fields.Financement?.filter((p) => p !== 'L') ?? [],
          entitesElligibles:
            fields.Entites_eligibles?.filter((p) => p !== 'L') ?? [],
          perimetreGeographique:
            fields.Perimetre_geographique?.filter((p) => p !== 'L') ?? [],
          objectifs: fields.Objectifs ?? '',
          operationsEligibles: fields.Operations_eligibles ?? '',
          benificiaires: fields.Beneficiaire ?? '',
          montant: fields.Montant ?? '',
          condition: fields.Conditions ?? '',
          sources: fields.Source ? [fields.Source] : [],
          contact: fields.Contact ?? '',
          regions: fields.Region ? [fields.Region] : [],
        })
    );
  };
}
