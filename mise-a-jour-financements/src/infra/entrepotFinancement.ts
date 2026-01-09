import axios from 'axios';
import { Financement } from '../metier/financement.js';
import { ClientHttp } from './clientHttp.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';

export interface EntrepotFinancement {
  tous(): Promise<Financement[]>;
}

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

export class EntrepotFinancementGrist implements EntrepotFinancement {
  clientHttp: ClientHttp<RetourApiGrist>;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<RetourApiGrist>;
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
    const reponse = await this.clientHttp.get(urlDocFinancement, {
      headers: { Authorization: `Bearer ${cleApi}` },
    });

    return reponse.data.records.map(
      ({ fields, id }) =>
        ({
          id,
          nom: fields.Nom_du_dispositif ?? '',
          financeur: fields.Financeur ?? '',
          objectifs: fields.Objectifs ?? '',
          operationsEligibles: fields.Operations_eligibles ?? '',
          benificiaires: fields.Beneficiaire ?? '',
          montant: fields.Montant ?? '',
          condition: fields.Conditions ?? '',
        } satisfies Financement)
    );
  };
}
