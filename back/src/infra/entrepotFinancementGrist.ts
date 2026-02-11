import axios from 'axios';
import { EntrepotFinancement } from '../metier/entrepotFinancement';
import { Financement } from '../metier/financement';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';
import { aseptiseListeGrist } from './grist';
import { EntrepotGrist, ReponseGrist } from './entrepotGrist';

export type FinancementGrist = {
  id: number;
  fields: {
    Nom_du_dispositif: string | null;
    Financeur: string | null;
    Entites_eligibles: string[] | null;
    Perimetre_geographique: string[] | null;
    Financement: string[] | null;
    Objectifs: string | null;
    Operations_eligibles: string | null;
    Beneficiaire: string | null;
    Montant: string | null;
    Conditions: string | null;
    Region: string | null;
    Contact: string | null;
    Source: string | null;
  };
};

export class EntrepotFinancementGrist
  extends EntrepotGrist<FinancementGrist>
  implements EntrepotFinancement
{
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp: ClientHttp<ReponseGrist<FinancementGrist>>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    super(
      clientHttp,
      adaptateurEnvironnement.grist().urlFinancements(),
      adaptateurEnvironnement.grist().cleApiFinancements(),
      adaptateurEnvironnement.grist().dureeCacheEnSecondes()
    );
  }

  async parId(id: number): Promise<Financement | undefined> {
    return (await this.tous()).find((financement) => financement.id === id);
  }

  async tous(): Promise<Financement[]> {
    const financementsGrist = await this.appelleGrist();
    return financementsGrist.records.map(this.convertisFinancementGrist);
  }

  private readonly convertisFinancementGrist = ({
    fields,
    id,
  }: FinancementGrist) =>
    new Financement({
      id,
      nom: fields.Nom_du_dispositif ?? '',
      financeur: fields.Financeur ?? '',
      typesDeFinancement: aseptiseListeGrist(fields.Financement),
      entitesElligibles: aseptiseListeGrist(fields.Entites_eligibles),
      perimetresGeographiques: aseptiseListeGrist(
        fields.Perimetre_geographique
      ),
      objectifs: fields.Objectifs ?? '',
      operationsEligibles: fields.Operations_eligibles ?? '',
      benificiaires: fields.Beneficiaire ?? '',
      montant: fields.Montant ?? '',
      condition: fields.Conditions ?? '',
      sources: fields.Source ? [fields.Source] : [],
      contact: fields.Contact ?? '',
      regions: fields.Region ? [fields.Region] : [],
    });
}
