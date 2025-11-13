import axios from 'axios';
import { EntrepotGuide } from '../metier/entrepotGuide';
import { Guide } from '../metier/guide';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type GuideGrist = {
  id: number;
  fields: {
    Identifiant: string | null;
  };
};

export type RetourGuideGrist = {
  records: GuideGrist[];
};

export type ClientHttp<T> = {
  get: (
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: T }>;
};

export class EntrepotGuideGrist implements EntrepotGuide {
  clientHttp: ClientHttp<RetourGuideGrist>;
  adaptateurEnvironnement: AdaptateurEnvironnement;

  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<RetourGuideGrist>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    this.clientHttp = clientHttp;
    this.adaptateurEnvironnement = adaptateurEnvironnement;
  }

  async tous(): Promise<Guide[]> {
    const urlDocGuides = this.adaptateurEnvironnement.grist().urlGuides();
    const cleApi = this.adaptateurEnvironnement.grist().cleApiGuides();
    const { data: guidesGrist } = await this.clientHttp.get(urlDocGuides, {
      headers: { Authorization: `Bearer ${cleApi}` },
    });

    return guidesGrist.records.map((ligneGrist) => ({
      id: ligneGrist.fields.Identifiant ?? '',
    }));
  }
}
