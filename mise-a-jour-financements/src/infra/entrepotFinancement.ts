import axios from 'axios';
import { Financement } from '../metier/financement';
import { ClientHttp } from './clientHttp';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { aseptiseHtml } from './aseptisationDuHtml';

export interface EntrepotFinancement {
  tous(): Promise<Financement[]>;
}

export type RetourApiGrist = {
  records: {
    id: number;
    fields: {
      ID_Aides_entreprises: number;
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
      Date_derniere_modification: number | null;
    };
  }[];
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
    const reponse = await this.clientHttp.get<RetourApiGrist>(
      urlDocFinancement,
      {
        headers: { Authorization: `Bearer ${cleApi}` },
      }
    );

    return reponse.data.records
      .map(
        ({ fields }) =>
          ({
            id: fields.ID_Aides_entreprises,
            nom: aseptiseHtml(fields.Nom_du_dispositif ?? ''),
            financeur: aseptiseHtml(fields.Financeur ?? ''),
            objectifs: aseptiseHtml(fields.Objectifs ?? ''),
            operationsEligibles: aseptiseHtml(
              fields.Operations_eligibles ?? ''
            ),
            benificiaires: aseptiseHtml(fields.Beneficiaire ?? ''),
            montant: aseptiseHtml(fields.Montant ?? ''),
            condition: aseptiseHtml(fields.Conditions ?? ''),
            derniereModification: fields.Date_derniere_modification
              ? new Date(fields.Date_derniere_modification * 1000)
              : undefined,
          } satisfies Financement)
      )
      .filter((f) => f.id > 0);
  };
}
