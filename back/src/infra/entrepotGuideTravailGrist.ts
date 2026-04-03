import axios from 'axios';
import { BesoinCyber } from '../metier/besoinCyber';
import { EntrepotGuideTravail } from '../metier/entrepotGuideTravail';
import { Guide } from '../metier/guide';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';
import { EntrepotGrist } from './entrepotGrist';
import { GuideGrist } from './entrepotGuideGrist';
import { aseptiseListeGrist } from './grist';

export class EntrepotGuideTravailGrist extends EntrepotGrist<GuideGrist> implements EntrepotGuideTravail {
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    const grist = adaptateurEnvironnement.grist();
    super(clientHttp, grist.gestionGuides().urlTable(), grist.gestionGuides().cleApi(), grist.dureeCacheEnSecondes());
  }

  private readonly convertiBesoin = (besoin: string): BesoinCyber | undefined => {
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
      listeDocuments: JSON.parse(guideGrist.fields.Liste_documents || '[]'),
      dateMiseAJour: guideGrist.fields.Date_de_mise_a_jour_s_
        ? new Date(guideGrist.fields.Date_de_mise_a_jour_s_ * 1000)
        : new Date(),
      thematique: guideGrist.fields.Thematique ?? '',
      besoins: aseptiseListeGrist(guideGrist.fields.Besoins_cyber)
        .map(this.convertiBesoin)
        .filter((b) => !!b),
    });
  };

  async parId(id: string, options: { sansCache?: boolean } = {}): Promise<Guide | undefined> {
    const guidesGrist = await this.appelleGrist({
      filtre: { Identifiant: [id] },
      sansCache: options.sansCache,
    });
    return guidesGrist.records.map(this.convertisGuideGrist)[0];
  }

  async sauvegardeDocuments(idGuide: string, documents: { libelle: string; nomFichier: string }[]) {
    await this.modifieEnregistrementGrist('Identifiant', idGuide, {
      Liste_documents: JSON.stringify(documents),
    });
  }
}
