import { CumulMensuel, SeuilCompletion, TotalParNiveauMaturite } from '../../metier/observatoire.js';

export interface AdaptateurObservatoireMSC {
  totalTestsMaturite(): Promise<number>;
  testsMaturiteParNiveau(): Promise<TotalParNiveauMaturite[]>;
  totalTestsSensibilisation(): Promise<number>;
  cumulMensuelTestsSensibilisation(): Promise<CumulMensuel[]>;
  totalParcoursRejoints(): Promise<number>;
  totalCyberdepartsValides(): Promise<number>;
  cumulMensuelCyberdepartsValides(): Promise<CumulMensuel[]>;
  totalCompletions(seuil: SeuilCompletion): Promise<number>;
  cumulMensuelCompletions(seuil: SeuilCompletion): Promise<CumulMensuel[]>;
  dateDerniereExecution(): Promise<Date | null>;
}
