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
    Resume: string | null;
    Description: string | null;
    Image: string | null;
    Langue: 'FR' | 'EN' | null;
    Collections: string[];
    Documents: string;
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
      nom: guideGrist.fields.Titre ?? '',
      resume: guideGrist.fields.Resume ?? '',
      description: guideGrist.fields.Description ?? '',
      nomImage: guideGrist.fields.Image ?? null,
      langue: guideGrist.fields.Langue ?? 'FR',
      collections: guideGrist.fields.Collections ?? [],
      documents: guideGrist.fields.Documents
        ? guideGrist.fields.Documents.split('\n').map((ligne) => ({
            libelle: ligne.split(' : ')[0],
            nomFichier: ligne.split(' : ')[1],
          }))
        : [],
    };
  }

  async parId(id: string): Promise<Guide | undefined> {
    return (await this.tous()).find((guide) => guide.id === id);
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
