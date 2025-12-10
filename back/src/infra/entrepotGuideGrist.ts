import axios from 'axios';
import { EntrepotGuide } from '../metier/entrepotGuide';
import { Guide } from '../metier/guide';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';
import { EntrepotGrist } from './entrepotGrist';
import { aseptiseListeGrist } from './grist';
import { BesoinCyber } from '../metier/besoinCyber';

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

export class EntrepotGuideGrist
  extends EntrepotGrist<GuideGrist>
  implements EntrepotGuide
{
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<RetourGuideGrist>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    const grist = adaptateurEnvironnement.grist();
    super(
      clientHttp,
      grist.urlGuides(),
      grist.cleApiGuides(),
      grist.dureeCacheEnSecondes()
    );
  }

  private readonly convertiBesoin = (
    besoin: string
  ): BesoinCyber | undefined => {
    switch (besoin) {
      case 'Réagir':
        return 'REAGIR';
      case 'Sensibiliser':
        return 'ETRE_SENSIBILISE';
      case 'Former':
        return 'SE_FORMER';
      case 'Sécuriser':
        return 'SECURISER';
    }
    return undefined;
  };

  private readonly convertisGuideGrist = (guideGrist: GuideGrist): Guide => {
    return new Guide({
      id: guideGrist.fields.Identifiant ?? '',
      nom: guideGrist.fields.Titre ?? '',
      description: guideGrist.fields.Description ?? '',
      nomImage: guideGrist.fields.Image ?? null,
      langue: guideGrist.fields.Langue ?? 'FR',
      collections: aseptiseListeGrist(guideGrist.fields.Collections),
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
      besoins: aseptiseListeGrist(guideGrist.fields.Besoins_cyber)
        .map(this.convertiBesoin)
        .filter((b) => !!b),
    });
  };

  async parId(id: string): Promise<Guide | undefined> {
    return (await this.tous()).find((guide) => guide.id === id);
  }

  async tous(): Promise<Guide[]> {
    const guidesGrist = await this.appelleGrist();
    return guidesGrist.records.map(this.convertisGuideGrist);
  }

  async parCollections(collections: string[]): Promise<Guide[]> {
    if (!collections.length) {
      return [];
    }
    const tousLesGuides = await this.tous();
    return tousLesGuides.filter((guide) =>
      guide.collections.some((uneCollectionDuGuide) =>
        collections.includes(uneCollectionDuGuide)
      )
    );
  }
}
