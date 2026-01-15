import axios from 'axios';
import { Financement } from '../metier/financement';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';

export type Aide = {
  id_aid: string;
  aid_nom: string;
  aid_objet: string;
  aid_operations_el: string;
  aid_montant: string;
  aid_benef: string;
  financeurs: { org_nom: string }[];
  aid_conditions: string;
  horodatage: string;
};
export type ResumeAide = Omit<Aide, 'financeurs'>;

export type DetailsAidesEntreprisesAPI = Aide[] | false;
export type RechercheAidesEntreprisesAPI = {
  data: ResumeAide[];
};

export interface AdaptateurSourceExterne {
  chercheAidesCyber: () => Promise<Financement[]>;
  parId(id: Financement['id']): Promise<Financement | undefined>;
}

export class AdapateurAidesEntreprisesAPI implements AdaptateurSourceExterne {
  private readonly clientHttp: ClientHttp;
  private readonly adaptateurEnvironnement: AdaptateurEnvironnement;
  private readonly headers: Record<string, string>;
  private readonly itemParPage = 50;
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    this.clientHttp = clientHttp;
    this.adaptateurEnvironnement = adaptateurEnvironnement;
    this.headers = {
      'X-Aidesentreprises-Id': this.adaptateurEnvironnement
        .aidesEntreprises()
        .apiId(),
      'X-Aidesentreprises-Key': this.adaptateurEnvironnement
        .aidesEntreprises()
        .apiKey(),
    };
  }

  async parId(id: Financement['id']): Promise<Financement | undefined> {
    const url = this.adaptateurEnvironnement.aidesEntreprises().urlAPI();
    if (!url) {
      return undefined;
    }
    const { data: aides } =
      await this.clientHttp.get<DetailsAidesEntreprisesAPI>(
        url + '/' + id + '?clean_html=true',
        {
          headers: this.headers,
        }
      );

    if (!aides) {
      return undefined;
    }

    const aide = aides[0];
    return this.mapper(aide);
  }
  async chercheAidesCyber() {
    const url = this.adaptateurEnvironnement.aidesEntreprises().urlAPI();
    if (!url) {
      return [];
    }
    let resultatRecherche: RechercheAidesEntreprisesAPI;
    const nouvellesAides: Financement[] = [];

    do {
      const reponse = await this.clientHttp.get<RechercheAidesEntreprisesAPI>(
        url +
          `?full_text=cyber&limit=${this.itemParPage}&offset=${
            this.itemParPage *
            Math.floor(nouvellesAides.length / this.itemParPage)
          }`,
        {
          headers: this.headers,
        }
      );
      resultatRecherche = reponse.data;
      nouvellesAides.push(...resultatRecherche.data.map(this.mapper));
    } while (resultatRecherche.data.length === this.itemParPage);
    return nouvellesAides;
  }

  mapper(aide: ResumeAide | Aide) {
    return {
      id: Number(aide.id_aid),
      benificiaires: aide.aid_benef,
      condition: aide.aid_conditions,
      financeur:
        'financeurs' in aide
          ? aide.financeurs.map((f) => f.org_nom).join(', ')
          : '',
      montant: aide.aid_montant,
      nom: aide.aid_nom,
      objectifs: aide.aid_objet,
      operationsEligibles: aide.aid_operations_el,
      derniereModification: new Date(aide.horodatage),
    };
  }
}
