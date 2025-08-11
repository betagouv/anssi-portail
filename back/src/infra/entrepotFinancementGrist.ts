import axios, { AxiosResponse } from 'axios';
import { EntrepotFinancement } from '../metier/entrepotFinancement';
import { Financement } from '../metier/financement';

export type ClientHttp = {
  get: (url: string) => Promise<unknown>;
};

export class EntrepotFinancementGrist implements EntrepotFinancement {
  clientHttp: ClientHttp;
  constructor({ clientHttp = axios }: { clientHttp?: ClientHttp }) {
    this.clientHttp = clientHttp;
  }

  tous = async () => {
    const reponse = (await this.clientHttp.get(
      'la vraie url'
    )) as AxiosResponse;
    return reponse.data as Financement[];
  };
}
