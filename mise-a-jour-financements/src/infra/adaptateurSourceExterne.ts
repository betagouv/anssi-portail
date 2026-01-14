import axios from 'axios';
import { Financement } from '../metier/financement';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';

type Aide = {
  id_aid: string;
  aid_nom: string;
  aid_objet: string;
  aid_operations_el: string;
  aid_montant: string;
  aid_benef: string;
  financeurs: { org_nom: string }[];
  aid_conditions: string;
};

export type RetourAidesEntreprisesAPI = Aide[] | false;

export interface AdaptateurSourceExterne {
  parId(id: Financement['id']): Promise<Financement | undefined>;
}

export class AdapateurAidesEntreprisesAPI implements AdaptateurSourceExterne {
  private readonly clientHttp: ClientHttp<RetourAidesEntreprisesAPI>;
  private readonly adaptateurEnvironnement: AdaptateurEnvironnement;
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<RetourAidesEntreprisesAPI>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    this.clientHttp = clientHttp;
    this.adaptateurEnvironnement = adaptateurEnvironnement;
  }

  async parId(id: Financement['id']): Promise<Financement | undefined> {
    const url = this.adaptateurEnvironnement.aidesEntreprises().url();
    if (!url) {
      return undefined;
    }
    const { data: aides } = await this.clientHttp.get(
      url + '/' + id + '?clean_html=true',
      {
        headers: {
          'X-Aidesentreprises-Id': this.adaptateurEnvironnement
            .aidesEntreprises()
            .apiId(),
          'X-Aidesentreprises-Key': this.adaptateurEnvironnement
            .aidesEntreprises()
            .apiKey(),
        },
      }
    );

    if (!aides) {
      return undefined;
    }

    const aide = aides[0];
    return {
      benificiaires: aide.aid_benef,
      condition: aide.aid_conditions,
      financeur: aide.financeurs.map((f) => f.org_nom).join(', '),
      id,
      montant: aide.aid_montant,
      nom: aide.aid_nom,
      objectifs: aide.aid_objet,
      operationsEligibles: aide.aid_operations_el,
    };
  }
}
