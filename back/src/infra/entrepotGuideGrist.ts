import axios from 'axios';
import { EntrepotGuide } from '../metier/entrepotGuide';
import { Guide } from '../metier/guide';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';

export type GuideGrist = {
  id: number;
  fields: {
    Identifiant: string | null;
    Titre: string | null;
    Image: string | null;
  };
};

export type RetourGuideGrist = {
  records: GuideGrist[];
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

  private convertisGuideGrist(guideGrist: GuideGrist): Guide {
    return {
      id: guideGrist.fields.Identifiant ?? '',
      titre: guideGrist.fields.Titre ?? '',
      lienVignette: guideGrist.fields.Image ?? '',
    };
  }

  async tous(): Promise<Guide[]> {
    const urlDocGuides = this.adaptateurEnvironnement.grist().urlGuides();
    if (!urlDocGuides) {
      return [];
    }
    const cleApi = this.adaptateurEnvironnement.grist().cleApiGuides();
    const { data: guidesGrist } = await this.clientHttp.get(urlDocGuides, {
      headers: { Authorization: `Bearer ${cleApi}` },
    });

    return guidesGrist.records.map(this.convertisGuideGrist);
  }
}
