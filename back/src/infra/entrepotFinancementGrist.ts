import axios, { AxiosResponse } from 'axios';
import { EntrepotFinancement } from '../metier/entrepotFinancement';
import { Financement } from '../metier/financement';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

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
    const cleApi = this.adaptateurEnvironnement.grist().cleApiFinancements();
    const reponse = (await this.clientHttp.get(urlDocFinancement, {
      headers: { Authorization: `Bearer ${cleApi}` },
    })) as AxiosResponse;
    return reponse.data as Financement[];
  };
}
