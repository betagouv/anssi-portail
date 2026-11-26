import { CumulMensuel, SeuilCompletion, TotalParDepartement, TotalParNiveauMaturite } from '@metier/observatoire.js';

export interface AdaptateurObservatoireMSC {
  totalTestsMaturite(): Promise<number>;
  testsMaturiteParNiveau(): Promise<TotalParNiveauMaturite[]>;
  totalTestsSensibilisation(): Promise<number>;
  cumulMensuelTestsSensibilisation(): Promise<CumulMensuel[]>;
  totalParcoursRejoints(): Promise<number>;
  totalCyberdepartsValides(): Promise<number>;
  cumulMensuelCyberdepartsValides(): Promise<CumulMensuel[]>;
  cyberdepartsValidesParDepartement(): Promise<TotalParDepartement[]>;
  totalCompletions(seuil: SeuilCompletion): Promise<number>;
  cumulMensuelCompletions(seuil: SeuilCompletion): Promise<CumulMensuel[]>;
  completionsParDepartement(seuil: SeuilCompletion): Promise<TotalParDepartement[]>;
  dateDerniereExecution(): Promise<Date | null>;
}
