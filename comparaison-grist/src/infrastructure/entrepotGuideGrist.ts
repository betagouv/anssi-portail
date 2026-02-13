import { ClientHttp } from '../metier/clientHttp';
import { EntrepotGuide } from '../metier/guides/entrepotGuide';
import { Guide } from '../metier/guides/guide.type';

export type SnapshotGrist = {
  snapshots: {
    docId: string;
  }[];
};

export type GuideGrist = {
  id: number;
  fields: {
    Identifiant: string | null;
    Titre: string | null;
    Description: string | null;
    Image: string | null;
    Langue: 'FR' | 'EN' | null;
    Collections: string[];
    Documents: string;
    Date_de_publication: string | null;
    Date_de_mise_a_jour: string | null;
    Thematique: string | null;
    Besoins_cyber: string[];
  };
};

export type RetourGuideGrist = {
  records: GuideGrist[];
};

export class EntrepotGuideGrist implements EntrepotGuide {
  constructor(
    private readonly clientHttp: ClientHttp,
    private readonly urlDeBase: string,
    private readonly idTable: string,
    private readonly cleApi: string
  ) {}

  async tous(): Promise<Guide[]> {
    const guidesGrist = await this.appelleGrist();
    return guidesGrist.records.map(this.convertisGuideGrist);
  }

  async empreinte(): Promise<string> {
    const url = `${this.urlDeBase}/snapshots`;
    const reponse = await this.clientHttp.get<SnapshotGrist>(url, {
      headers: {
        authorization: `Bearer ${this.cleApi}`,
        accept: 'application/json',
      },
    });
    return reponse.data.snapshots[0].docId;
  }

  protected async appelleGrist() {
    if (!this.urlDeBase) {
      return { records: [] };
    }

    const url = `${this.urlDeBase}/tables/${this.idTable}/records`;
    const reponse = await this.clientHttp.get<RetourGuideGrist>(url, {
      headers: {
        authorization: `Bearer ${this.cleApi}`,
        accept: 'application/json',
      },
    });
    return reponse.data;
  }

  private aseptiseListe<T>(colonne: T[] | null | undefined): T[] {
    return colonne?.slice(1) ?? [];
  }

  private readonly convertisGuideGrist = (guideGrist: GuideGrist): Guide => {
    return {
      id: guideGrist.fields.Identifiant ?? '',
      nom: guideGrist.fields.Titre ?? '',
      description: guideGrist.fields.Description ?? '',
      nomImage: guideGrist.fields.Image ?? null,
      langue: guideGrist.fields.Langue ?? 'FR',
      collections: this.aseptiseListe(guideGrist.fields.Collections),
      documents: guideGrist.fields.Documents
        ? guideGrist.fields.Documents.split('\n')
            .filter((l) => !!l)
            .map((ligne) => {
              const indexDernierDeuxPoints = ligne.lastIndexOf(':');

              return {
                libelle: ligne.substring(0, indexDernierDeuxPoints).trim(),
                nomFichier: ligne.substring(indexDernierDeuxPoints + 1).trim(),
              };
            })
        : [],
      dateMiseAJour: guideGrist.fields.Date_de_mise_a_jour ?? '',
      datePublication: guideGrist.fields.Date_de_publication ?? '',
      thematique: guideGrist.fields.Thematique ?? '',
      besoins: this.aseptiseListe(guideGrist.fields.Besoins_cyber),
    };
  };
}
